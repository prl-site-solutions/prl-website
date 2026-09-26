// Rebuilds the job cards and Google JobPosting data in careers.html from PRL's
// live CV-Library adverts. Run daily by .github/workflows/sync-jobs.yml.
//
//   node scripts/sync-jobs.mjs            fetch live feed and rewrite careers.html
//   node scripts/sync-jobs.mjs feed.html  use a saved copy of the feed instead
//
// No dependencies. Exits non-zero (leaving careers.html untouched) if the feed
// can't be fetched or doesn't parse cleanly — a stale page beats an empty one.

import { readFileSync, writeFileSync } from 'node:fs';

const AGENCY = '454083';
const FEED_URL = `https://www.cv-library.co.uk/cgi-bin/yourjobs.cgi?agency=${AGENCY}`;
const PAGE = new URL('../careers.html', import.meta.url);
const SITEMAP = new URL('../sitemap.xml', import.meta.url);
const ORG = { '@type': 'Organization', name: 'PRL Site Solutions', sameAs: 'https://prlsitesolutions.co.uk/', logo: 'https://prlsitesolutions.co.uk/assets/prl_logo.jpg' };

// ---------- fetch ----------
async function getFeed() {
  if (process.argv[2]) return readFileSync(process.argv[2], 'utf8');
  const res = await fetch(FEED_URL, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; PRL-website-job-sync)' } });
  if (!res.ok) throw new Error(`CV-Library feed returned HTTP ${res.status}`);
  return res.text();
}

// ---------- parse ----------
const decode = (s) => s
  .replace(/&nbsp;/g, ' ').replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const toText = (html) => decode(html
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|div)>/gi, '\n').replace(/<[^>]+>/g, ''))
  .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');

export function parseFeed(html) {
  const declared = html.match(/\((\d+) active vacanc/);
  if (!declared) throw new Error('Feed layout changed: no "(N active vacancies)" header found');

  const blocks = html.split('class="jobDescriptionMain"').slice(1);
  const jobs = blocks.map((block) => {
    const f = {};
    for (const m of block.matchAll(/jobDescriptionCriteria[^"]*">([^<]+):<\/div>\s*<div class="jobDescriptionDetails"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g)) {
      f[m[1].trim()] = m[2];
    }
    const job = {
      title: toText(f['Job Title'] || ''),
      rate: toText(f['Salary/Rate'] || ''),
      location: toText(f['Location'] || ''),
      posted: toText(f['Posted'] || ''),
      description: toText(f['Description'] || ''),
      type: toText(f['Job Type'] || ''),
      length: toText(f['Contract Length'] || ''),
      contact: toText(f['Contact Name'] || ''),
      phone: toText(f['Telephone'] || '').replace(/[^\d+]/g, ''),
      id: toText(f['Job ID'] || ''),
    };
    if (!job.title || !/^\d+$/.test(job.id)) throw new Error(`Feed layout changed: job without title/ID (${JSON.stringify(job).slice(0, 120)})`);
    return job;
  });

  if (jobs.length !== +declared[1]) throw new Error(`Parsed ${jobs.length} jobs but feed says ${declared[1]}`);
  return jobs;
}

// ---------- shape ----------
// "TIG WELDER" -> "TIG Welder"; mixed-case titles are left as the consultant typed them.
const ACRONYMS = /^(TIG|MIG|MMA|HSE|QA|QC|EFW|M&E|CSCS|CPCS|NPORS|HGV|PM|CAD|NDT)$/i;
const titleCase = (s) => (s === s.toUpperCase() ? s.toLowerCase() : s)
  .replace(/(^|[\s/(-])([a-z])/g, (_, a, b) => a + b.toUpperCase())
  .replace(/[A-Za-z&]+/g, (w) => (ACRONYMS.test(w) ? w.toUpperCase().replace('EFW', 'EfW') : w));

function isoDate(posted) {
  const m = posted.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

function salary(rate) {
  const nums = [...rate.matchAll(/£\s?([\d,]+(?:\.\d+)?)/g)].map((m) => +m[1].replace(/,/g, ''));
  if (!nums.length) return null;
  const unit = /hour/i.test(rate) ? 'HOUR' : /day/i.test(rate) ? 'DAY' : /week/i.test(rate) ? 'WEEK' : /month/i.test(rate) ? 'MONTH' : /annum|year/i.test(rate) ? 'YEAR' : null;
  if (!unit) return null;
  const [min, max] = [Math.min(...nums), Math.max(...nums)];
  return { min, max, unit };
}

const UNIT_SUFFIX = { HOUR: '/hr', DAY: '/day', WEEK: '/wk', MONTH: '/month', YEAR: '/yr' };
const money = (n) => `£${Number.isInteger(n) ? n : n.toFixed(2)}`;

function address(location) {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
  const addr = { '@type': 'PostalAddress', addressCountry: 'GB' };
  if (parts.length && /^[A-Z]{1,2}\d[A-Z\d]?(\s*\d[A-Z]{2})?$/i.test(parts[0])) addr.postalCode = parts.shift().toUpperCase();
  if (parts.length) addr.addressLocality = parts[0];
  if (parts.length > 1) addr.addressRegion = parts[parts.length - 1];
  return addr;
}

// Google asks for a postalCode. Adverts often give only a town, so look up its
// postcode district (outward code) on postcodes.io — only when the town AND
// county both match, and never failing the sync if the lookup is unavailable.
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z]/g, '');
async function addPostcodeDistrict(addr) {
  if (addr.postalCode || !addr.addressLocality) return;
  try {
    const res = await fetch(`https://api.postcodes.io/places?q=${encodeURIComponent(addr.addressLocality)}&limit=10`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return;
    const { result = [] } = await res.json();
    const town = norm(addr.addressLocality);
    const region = norm(addr.addressRegion);
    const hits = result.filter((p) =>
      [p.name_1, p.name_2].some((n) => norm(n) === town) &&
      (!region || [p.county_unitary, p.region].some((c) => norm(c) && (norm(c).includes(region) || region.includes(norm(c)))))
    );
    const outcodes = [...new Set(hits.map((p) => p.outcode).filter(Boolean))];
    if (outcodes.length === 1) addr.postalCode = outcodes[0];
  } catch { /* lookup is best-effort */ }
}

// CV-Library adverts run 30 days. validThrough = posting date + 30 days; if the
// advert is still live after that, roll forward in 30-day steps so Google never
// sees a live job as expired, and the page only changes once a month per job.
function validThrough(datePosted, now = new Date()) {
  if (!datePosted) return null;
  const DAY = 86400000;
  const posted = Date.parse(`${datePosted}T00:00:00Z`);
  let end = posted + 30 * DAY;
  while (end < now.getTime() + 3 * DAY) end += 30 * DAY;
  return new Date(end).toISOString().slice(0, 10);
}

const EMPLOYMENT = { temporary: 'TEMPORARY', permanent: 'FULL_TIME', contract: 'CONTRACTOR', 'part time': 'PART_TIME' };

function jobPosting(j) {
  const pay = salary(j.rate);
  const posting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: titleCase(j.title),
    description: j.description.split('\n').map((l) => `<p>${escapeHtml(l)}</p>`).join(''),
    datePosted: isoDate(j.posted),
    validThrough: validThrough(isoDate(j.posted)),
    employmentType: EMPLOYMENT[j.type.toLowerCase()] || 'OTHER',
    hiringOrganization: ORG,
    jobLocation: { '@type': 'Place', address: j.address },
    identifier: { '@type': 'PropertyValue', name: 'CV-Library Job ID', value: j.id },
    directApply: false,
    url: `https://www.cv-library.co.uk/job/${j.id}`,
  };
  if (pay) posting.baseSalary = { '@type': 'MonetaryAmount', currency: 'GBP', value: { '@type': 'QuantitativeValue', minValue: pay.min, maxValue: pay.max, unitText: pay.unit } };
  if (!posting.datePosted) { delete posting.datePosted; delete posting.validThrough; }
  return posting;
}

// ---------- render ----------
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script> must not contain "</script>"
const scriptJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function summary(desc, max = 240) {
  const flat = desc.replace(/\n/g, ' ').replace(/^(job description|overview|key responsibilities)\s*:?\s*/i, '');
  if (flat.length <= max) return flat;
  return flat.slice(0, flat.lastIndexOf(' ', max)).replace(/[,.;:\s]+$/, '') + '…';
}

const PIN = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>';
const CLOCK = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

function card(j) {
  const pay = salary(j.rate);
  const rate = pay
    ? `${money(pay.min)}${pay.max !== pay.min ? `–${money(pay.max)}` : ''}<span class="role-rate-suffix"> ${UNIT_SUFFIX[pay.unit]}</span>`
    : escapeHtml(j.rate || 'Rate on application');
  const meta = [`<div class="role-meta-item">${PIN}\n            ${escapeHtml(j.location)}\n          </div>`];
  if (j.length) meta.push(`<div class="role-meta-item">${CLOCK}\n            ${escapeHtml(j.length)}\n          </div>`);
  const call = j.phone
    ? `\n          <a href="tel:${j.phone}" class="btn btn-secondary" aria-label="Call ${escapeHtml(j.contact || 'PRL')}">Call</a>`
    : '';
  return `      <article class="role-card">
        <div class="role-header">
          <div>
            <h3 class="role-title">${escapeHtml(titleCase(j.title))}</h3>
          </div>
          ${j.type ? `<span class="role-tag temp">${escapeHtml(j.type)}</span>` : ''}
        </div>
        <div class="role-rate">${rate}</div>
        <div class="role-meta">
          ${meta.join('\n          ')}
        </div>
        <p class="role-summary">${escapeHtml(summary(j.description))}</p>${j.contact ? `\n        <p class="role-contact">Contact: ${escapeHtml(titleCase(j.contact))}</p>` : ''}
        <div class="role-actions">
          <a href="https://www.cv-library.co.uk/job/${j.id}" class="btn btn-primary" target="_blank" rel="noopener">Apply via CV-Library</a>${call}
        </div>
      </article>`;
}

const EMPTY = `      <article class="role-card">
        <h3 class="role-title">No advertised roles right now</h3>
        <p class="role-summary">New roles go up every week. Call us on 07960 871442 and we'll put your CV forward for work in your trade.</p>
      </article>`;

function replaceBetween(src, name, content) {
  const re = new RegExp(`(<!-- ${name}:START[^>]*-->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(src)) throw new Error(`careers.html is missing the ${name} markers`);
  return src.replace(re, (_, a, b) => `${a}${content}${b}`);
}

// ---------- main ----------
async function main() {
  const jobs = parseFeed(await getFeed());
  jobs.sort((a, b) => (isoDate(b.posted) || '').localeCompare(isoDate(a.posted) || ''));
  for (const j of jobs) {
    j.address = address(j.location);
    await addPostcodeDistrict(j.address);
  }

  const before = readFileSync(PAGE, 'utf8');
  let page = before;
  page = replaceBetween(page, 'JOBS-SCHEMA', '\n' + jobs.map((j) => `<script type="application/ld+json">${scriptJson(jobPosting(j))}</script>\n`).join(''));
  page = replaceBetween(page, 'JOBS-CARDS', '\n' + (jobs.length ? jobs.map(card).join('\n\n') : EMPTY) + '\n');
  page = replaceBetween(page, 'JOBS-COUNT', String(jobs.length));

  if (page === before) {
    console.log(`No change — ${jobs.length} live jobs.`);
    return;
  }
  writeFileSync(PAGE, page);

  const today = new Date().toISOString().slice(0, 10);
  const sitemap = readFileSync(SITEMAP, 'utf8');
  writeFileSync(SITEMAP, sitemap.replace(/(<loc>https:\/\/prlsitesolutions\.co\.uk\/careers\.html<\/loc>\s*<lastmod>)[^<]*/, `$1${today}`));

  console.log(`Updated careers.html — ${jobs.length} live jobs:`);
  for (const j of jobs) console.log(`  ${j.id}  ${isoDate(j.posted)}  ${titleCase(j.title)} — ${j.location}`);
}

main().catch((err) => {
  console.error(`sync-jobs failed: ${err.message}`);
  process.exit(1);
});
