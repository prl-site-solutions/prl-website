// Rebuilds the job cards in careers.html and one page per advert under
// /jobs/<slug>/ (each with its own Google JobPosting data) from PRL's live
// CV-Library adverts. Run twice daily by .github/workflows/sync-jobs.yml.
//
//   node scripts/sync-jobs.mjs            fetch live feed and rewrite the pages
//   node scripts/sync-jobs.mjs feed.html  use a saved copy of the feed instead
//
// No dependencies. Exits non-zero (leaving every page untouched) if the feed
// can't be fetched or doesn't parse cleanly — a stale page beats an empty one.
//
// When an advert closes on CV-Library its /jobs/ page is deleted (GitHub Pages
// then returns 404, which is how Google for Jobs expects an expired role to
// disappear) and its sitemap entry is removed.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { SITE, esc, jsonLd, breadcrumbs, shell, ctaSection } from './build-pages.mjs';
import { notify } from './notify-indexing.mjs';

const AGENCY = '454083';
const FEED_URL = `https://www.cv-library.co.uk/cgi-bin/yourjobs.cgi?agency=${AGENCY}`;
const PAGE = new URL('../careers.html', import.meta.url);
const SITEMAP = new URL('../sitemap.xml', import.meta.url);
const JOBS_DIR = new URL('../jobs/', import.meta.url);
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
      start: toText(f['Start Date'] || ''),
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
    description: j.description.split('\n').map((l) => `<p>${escapeHtml(l)}</p>`).join('') + APPLY_NOTE(j),
    datePosted: isoDate(j.posted),
    validThrough: validThrough(isoDate(j.posted)),
    employmentType: EMPLOYMENT[j.type.toLowerCase()] || 'OTHER',
    hiringOrganization: ORG,
    jobLocation: { '@type': 'Place', address: j.address },
    identifier: { '@type': 'PropertyValue', name: 'PRL Site Solutions', value: j.id },
    directApply: false,
    url: `${SITE}${jobPath(j)}`,
  };
  if (pay) posting.baseSalary = { '@type': 'MonetaryAmount', currency: 'GBP', value: { '@type': 'QuantitativeValue', minValue: pay.min, maxValue: pay.max, unitText: pay.unit } };
  // Google requires datePosted; if the advert has none, use the first day we saw it.
  if (!posting.datePosted) { posting.datePosted = j.firstSeen; posting.validThrough = validThrough(j.firstSeen); }
  return posting;
}

// ---------- job pages ----------
const slugify = (s) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const town = (j) => j.address.addressLocality || j.location.split(',')[0] || '';
function jobPath(j) {
  const base = slugify(`${titleCase(j.title)} ${town(j)}`).split('-').slice(0, 10).join('-');
  return `/jobs/${base}-${j.id}/`;
}

const APPLY_NOTE = (j) => `<p>To apply, call ${escapeHtml(j.contact ? titleCase(j.contact) : 'PRL Site Solutions')} on ${j.phone || '0800 772 3959'}, email your CV to info@prlsitesolutions.co.uk quoting reference ${j.id}, or register at https://www.prismworkforce.online/apply.</p>`;

// Point each role at the service page that covers it, for internal linking.
const SERVICE_FOR = [
  [/slinger|signaller|appointed person|lift|crane|operator|plant|excavator|telehandler|dumper|banks/i, ['plant-operator-recruitment', 'Plant operator recruitment']],
  [/supervisor|manager|engineer|foreman|hse|qa|qc|setting out|coordinator|planner/i, ['site-management-recruitment', 'Site management recruitment']],
  [/electric|pipefitter|pipe fitter|plumber|mechanical|fitter|tester|m&e|hvac/i, ['mechanical-electrical-recruitment', 'M&E recruitment']],
  [/labour|groundwork|operative|fire watch|general/i, ['construction-labour-supply', 'Construction labour supply']],
];
const serviceFor = (j) => (SERVICE_FOR.find(([re]) => re.test(j.title)) || [null, ['skilled-trades-recruitment', 'Skilled trades recruitment']])[1];

const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function rateText(j) {
  const pay = salary(j.rate);
  if (!pay) return j.rate || '';
  return `${money(pay.min)}${pay.max !== pay.min ? `–${money(pay.max)}` : ''} ${UNIT_SUFFIX[pay.unit]}`;
}

function jobPage(j, posting) {
  const path = jobPath(j);
  const title = titleCase(j.title);
  const where = j.location;
  const rate = rateText(j);
  const pageTitle = (() => {
    const full = `${title} job, ${town(j)}${rate ? ` | ${rate}` : ''} | PRL Site Solutions`;
    return full.length <= 75 ? full : `${title} job, ${town(j)} | PRL`;
  })();
  const description = summary(`${title}${rate ? `, ${rate}` : ''}, ${where}. ${j.description}`, 155);
  const [svcSlug, svcName] = serviceFor(j);
  const phone = j.phone || '08007723959';
  const phoneShow = phone.replace(/^(\d{5})(\d{6})$/, '$1 $2').replace(/^0800(\d{3})(\d{4})$/, '0800 $1 $2');
  const contact = j.contact ? titleCase(j.contact) : 'the PRL desk';
  const mail = `mailto:info@prlsitesolutions.co.uk?subject=${encodeURIComponent(`Application: ${title} (ref ${j.id})`)}`;
  const facts = [
    rate && ['Rate', rate],
    ['Location', where],
    j.type && ['Job type', j.type],
    j.length && !/^n\/?a$/i.test(j.length) && ['Length', j.length],
    j.start && /\d/.test(j.start) && ['Start', j.start],
    ['Posted', fmtDate(posting.datePosted)],
    ['Closes', fmtDate(posting.validThrough)],
    ['Reference', j.id],
  ].filter(Boolean);

  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], ['Vacancies', `${SITE}/careers.html`], [title, `${SITE}${path}`]]),
    posting,
  ].map(jsonLd).join('\n');

  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/careers.html">Vacancies</a> › ${esc(title)}</nav>
    <h1>${esc(title)}</h1>
    <p class="lede">${esc([j.type, rate, where].filter(Boolean).join(' · '))}</p>
    <div class="hero-actions">
      <a href="#apply" class="btn btn-amber">Apply for this job</a>
      <a href="tel:${phone}" class="btn btn-ghost">Call ${esc(contact)}</a>
    </div>
    <ul class="hero-facts">${facts.slice(0, 4).map(([, v]) => `<li>${esc(v)}</li>`).join('')}</ul>
  </div>
</header>

<main>
  <section class="block">
    <div class="wrap prose">
      <h2>The role</h2>
${j.description.split('\n').map((l) => `      <p>${esc(l)}</p>`).join('\n')}
    </div>
  </section>

  <section class="block alt" id="apply">
    <div class="wrap prose">
      <h2>How to apply</h2>
      <ul class="checks">
${facts.map(([k, v]) => `        <li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('\n')}
      </ul>
      <p style="margin-top:24px">Apply direct with PRL Site Solutions. Call ${esc(contact)} on <a href="tel:${phone}">${esc(phoneShow)}</a>, email your CV to <a href="${esc(mail)}">info@prlsitesolutions.co.uk</a> quoting reference ${esc(j.id)}, or register with us online.</p>
      <p><a href="https://www.prismworkforce.online/apply" class="btn btn-amber">Register and apply with PRL</a></p>
      <p>Prefer CV-Library? <a href="https://www.cv-library.co.uk/job/${j.id}" target="_blank" rel="noopener">This role is also advertised there</a>.</p>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2>Related</h2>
      <div class="related">
        <a href="/careers.html">All live vacancies</a>
        <a href="/${svcSlug}/">${esc(svcName)}</a>
        <a href="/guides/which-site-card/">Which site card do you need?</a>
        <a href="/guides/right-to-work-before-a-start/">Right to work checks</a>
      </div>
    </div>
  </section>
${ctaSection('Hiring for a site like this?', 'Trade, numbers, postcode, start date and the tickets the site needs')}
</main>
`;
  return shell({ path, title: pageTitle, description, schemaHtml, body, note: 'Generated by scripts/sync-jobs.mjs from the live CV-Library feed. Do not edit by hand.' });
}

// /jobs/ itself has no listing of its own: send people (and crawlers) to careers.html.
const JOBS_INDEX = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>Live vacancies | PRL Site Solutions</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${SITE}/careers.html">
  <meta http-equiv="refresh" content="0; url=/careers.html">
</head>
<body><p><a href="/careers.html">See all live vacancies</a></p></body>
</html>
`;

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
            <h3 class="role-title"><a href="${jobPath(j)}" style="color:inherit;text-decoration:none">${escapeHtml(titleCase(j.title))}</a></h3>
          </div>
          ${j.type ? `<span class="role-tag temp">${escapeHtml(j.type)}</span>` : ''}
        </div>
        <div class="role-rate">${rate}</div>
        <div class="role-meta">
          ${meta.join('\n          ')}
        </div>
        <p class="role-summary">${escapeHtml(summary(j.description))}</p>${j.contact ? `\n        <p class="role-contact">Contact: ${escapeHtml(titleCase(j.contact))}</p>` : ''}
        <div class="role-actions">
          <a href="${jobPath(j)}" class="btn btn-primary">View &amp; apply</a>${call}
        </div>
        <p class="role-contact" style="margin-top:10px">Also on <a href="https://www.cv-library.co.uk/job/${j.id}" target="_blank" rel="noopener">CV-Library</a></p>
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
const write = (file, content) => {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  writeFileSync(file, content);
  return true;
};

// Keep a job's first-seen date stable across runs (only used when CV-Library gives no posting date).
function firstSeen(path) {
  try {
    const m = readFileSync(new URL(`..${path}index.html`, import.meta.url), 'utf8').match(/"datePosted":"(\d{4}-\d{2}-\d{2})"/);
    if (m) return m[1];
  } catch { /* new job */ }
  return new Date().toISOString().slice(0, 10);
}

function updateSitemap(sitemap, jobs, changedPaths, today) {
  const old = Object.fromEntries([...sitemap.matchAll(/<url>\s*<loc>(https:\/\/prlsitesolutions\.co\.uk\/jobs\/[^<]+)<\/loc>\s*<lastmod>([^<]*)<\/lastmod>[\s\S]*?<\/url>/g)].map((m) => [m[1], m[2]]));
  let sm = sitemap.replace(/\s*<url>\s*<loc>https:\/\/prlsitesolutions\.co\.uk\/jobs\/[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
  const entries = jobs.map((j) => {
    const loc = `${SITE}${jobPath(j)}`;
    const lastmod = changedPaths.has(jobPath(j)) || !old[loc] ? today : old[loc];
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  }).join('');
  return sm.replace(/\s*<\/urlset>/, `\n${entries}</urlset>`);
}

async function main() {
  const jobs = parseFeed(await getFeed());
  jobs.sort((a, b) => (isoDate(b.posted) || '').localeCompare(isoDate(a.posted) || ''));
  for (const j of jobs) {
    j.address = address(j.location);
    await addPostcodeDistrict(j.address);
  }
  const paths = jobs.map(jobPath);
  if (new Set(paths).size !== paths.length) throw new Error('Two adverts produced the same /jobs/ path');
  for (const j of jobs) j.firstSeen = firstSeen(jobPath(j));

  // Build everything in memory first, so a failure leaves the site untouched.
  const pages = jobs.map((j) => ({ path: jobPath(j), html: jobPage(j, jobPosting(j)) }));
  const fingerprint = createHash('sha1').update(pages.map((p) => p.path + p.html.replace(/&copy; \d{4}/, '')).join('\n')).digest('hex').slice(0, 12);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Live vacancies at PRL Site Solutions',
    itemListElement: jobs.map((j, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}${jobPath(j)}`, name: titleCase(j.title) })),
  };

  const before = readFileSync(PAGE, 'utf8');
  let page = before;
  // careers.html is a listing page, so it carries an ItemList pointing at the job
  // pages; the JobPosting data lives on each job's own page (Google's rule).
  // The fingerprint makes careers.html change whenever any job page changes, so
  // the workflow's "git diff" step always sees job-page updates.
  page = replaceBetween(page, 'JOBS-SCHEMA', `\n<!-- job pages ${fingerprint} -->\n<script type="application/ld+json">${scriptJson(itemList)}</script>\n`);
  page = replaceBetween(page, 'JOBS-CARDS', '\n' + (jobs.length ? jobs.map(card).join('\n\n') : EMPTY) + '\n');
  page = replaceBetween(page, 'JOBS-COUNT', String(jobs.length));

  mkdirSync(JOBS_DIR, { recursive: true });
  const changed = new Set();
  for (const p of pages) {
    const dir = new URL(`..${p.path}`, import.meta.url);
    mkdirSync(dir, { recursive: true });
    if (write(new URL('index.html', dir), p.html)) changed.add(p.path);
  }
  write(new URL('index.html', JOBS_DIR), JOBS_INDEX);
  const keep = new Set(paths.map((p) => p.split('/')[2]));
  const removed = [];
  for (const d of readdirSync(JOBS_DIR, { withFileTypes: true })) {
    if (d.isDirectory() && !keep.has(d.name)) { rmSync(new URL(`${d.name}/`, JOBS_DIR), { recursive: true, force: true }); removed.push(d.name); }
  }

  const careersChanged = page !== before;
  if (careersChanged) writeFileSync(PAGE, page);

  const today = new Date().toISOString().slice(0, 10);
  let sitemap = readFileSync(SITEMAP, 'utf8');
  const smBefore = sitemap;
  if (careersChanged) sitemap = sitemap.replace(/(<loc>https:\/\/prlsitesolutions\.co\.uk\/careers\.html<\/loc>\s*<lastmod>)[^<]*/, `$1${today}`);
  sitemap = updateSitemap(sitemap, jobs, changed, today);
  if (sitemap !== smBefore) writeFileSync(SITEMAP, sitemap);

  // The workflow commits with "git add careers.html sitemap.xml"; stage the job
  // pages (including deletions) too so they go out in the same commit.
  if (process.env.GITHUB_ACTIONS === 'true') execFileSync('git', ['add', '-A', 'jobs'], { stdio: 'inherit' });

  // Google Indexing API: new/changed job pages -> URL_UPDATED, closed ones -> URL_DELETED.
  // INDEXING_CHANGES_FILE saves the list so a later workflow step can send it once
  // the pages are live (set INDEXING_DEFER=1 for that); otherwise send it now.
  const indexing = {
    updated: [...changed].map((p) => `${SITE}${p}`),
    deleted: removed.map((name) => `${SITE}/jobs/${name}/`),
  };
  if (process.env.INDEXING_CHANGES_FILE) writeFileSync(process.env.INDEXING_CHANGES_FILE, JSON.stringify(indexing, null, 2));
  if (process.env.INDEXING_DEFER === '1') {
    console.log(`Indexing API: ${indexing.updated.length + indexing.deleted.length} change(s) saved for the post-publish step.`);
  } else {
    try { await notify(indexing); } catch (err) { console.log(`Indexing API: unexpected error — ${err.message}`); }
  }

  if (!careersChanged && !changed.size && !removed.length) {
    console.log(`No change — ${jobs.length} live jobs.`);
    return;
  }
  console.log(`Updated careers.html and job pages — ${jobs.length} live jobs:`);
  for (const j of jobs) console.log(`  ${j.id}  ${isoDate(j.posted)}  ${titleCase(j.title)} — ${j.location}  ${jobPath(j)}${changed.has(jobPath(j)) ? '  (updated)' : ''}`);
  for (const r of removed) console.log(`  removed /jobs/${r}/ (advert closed)`);
}

main().catch((err) => {
  console.error(`sync-jobs failed: ${err.message}`);
  process.exit(1);
});
