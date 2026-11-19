// Builds the service, sector and case study pages from scripts/pages-content.mjs
// into /<slug>/index.html and /case-studies/..., and keeps sitemap.xml in step.
// No dependencies.
//
//   node scripts/build-pages.mjs
//
// The generated HTML is committed (GitHub Pages serves static files), so run
// this after editing the content and commit both.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { COMMON_CHECKS, STEPS, PAGES, CASE_STUDIES, AREAS, GUIDES } from './pages-content.mjs';

const SITE = 'https://prlsitesolutions.co.uk';
const ORG_ID = `${SITE}/#organization`;
const ROOT = new URL('../', import.meta.url);
const bySlug = Object.fromEntries(PAGES.map((p) => [p.slug, p]));
const csBySlug = Object.fromEntries(CASE_STUDIES.map((c) => [c.slug, c]));
const guideBySlug = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
const PUBLISHED = '2026-09-26';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const MAPS = 'https://www.google.com/maps/place/?q=place_id:ChIJpahC5Xt2RSURTYVO12XzYpk';
const REVIEW = 'https://search.google.com/local/writereview?placeid=ChIJpahC5Xt2RSURTYVO12XzYpk';
const OFFICE_Q = encodeURIComponent('PRL Site Solutions, 259 Wallasey Village, Wallasey CH45 3LR');
const MAP_EMBED = `https://www.google.com/maps?q=${OFFICE_Q}&output=embed`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_Q}`;
const mapBlock = (label) => `<div class="office-map" style="margin-top:20px">
        <iframe src="${MAP_EMBED}" title="Map: PRL Site Solutions office, 259 Wallasey Village, Wallasey CH45 3LR" width="100%" height="300" style="border:0;border-radius:12px;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        <p style="margin-top:10px"><a href="${DIRECTIONS}">Directions to the Wallasey office</a> · <a href="${REVIEW}">Worked with us${label ? ` in ${esc(label)}` : ''}? Leave us a Google review</a></p>
      </div>`;

// Live adverts, written by scripts/sync-jobs.mjs. Read at build time so the area
// pages list the roles currently open near them.
function liveJobs() {
  try { return JSON.parse(readFileSync(new URL('jobs/jobs.json', ROOT), 'utf8')); } catch { return []; }
}
const areasFor = (location) => AREAS.filter((a) => a.jobMatch && a.jobMatch.test(location || ''));
const COMPANIES_HOUSE = 'https://find-and-update.company-information.service.gov.uk/company/14358717';
const OFFICE_GEO = { '@type': 'GeoCoordinates', latitude: 53.4308, longitude: -3.0560 };
const NW_CITIES = ['Wirral', 'Wallasey', 'Birkenhead', 'Liverpool', 'Ellesmere Port', 'Chester', 'Warrington', 'Manchester'];
const HOURS = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '09:00',
  closes: '17:00',
};
const PROVIDER = { '@type': 'EmploymentAgency', '@id': ORG_ID, name: 'PRL Site Solutions', url: `${SITE}/`, telephone: '+448007723959' };
const LOCAL_PROVIDER = {
  ...PROVIDER,
  alternateName: ['PRL Site Solutions Ltd'],
  email: 'info@prlsitesolutions.co.uk',
  hasMap: MAPS,
  openingHoursSpecification: HOURS,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '259 Wallasey Village',
    addressLocality: 'Wallasey',
    addressRegion: 'Wirral',
    postalCode: 'CH45 3LR',
    addressCountry: 'GB',
  },
  geo: OFFICE_GEO,
  areaServed: [
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'AdministrativeArea', name: 'Northwest England' },
    ...NW_CITIES.map((name) => ({ '@type': 'City', name })),
  ],
  sameAs: [
    MAPS,
    COMPANIES_HOUSE,
    'https://www.linkedin.com/company/prl-site-solutions/',
    'https://www.facebook.com/profile.php?id=61595134512677',
    'https://www.instagram.com/prlsitesolutionsltd/',
    'https://www.cv-library.co.uk/list-jobs/454083/PRL-Site-Solutions',
  ],
};

const breadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

// ───────────────────────── shared chrome ─────────────────────────

const NAV = `<nav class="nav" aria-label="Main">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="/assets/prl_logo_96.jpg" alt="" width="40" height="40">PRL Site Solutions</a>
    <div class="nav-links" id="navLinks">
      <a href="/#services">Services</a>
      <a href="/#areas">Areas</a>
      <a href="/guides/">Guides</a>
      <a href="/case-studies/">Case Studies</a>
      <a href="/careers.html">Vacancies</a>
      <a href="https://www.prismworkforce.online/login">Contractor Login</a>
      <a href="#enquiry" class="nav-cta">Request Workers</a>
    </div>
    <button class="nav-toggle" aria-label="Menu" aria-controls="navLinks" aria-expanded="false" onclick="var n=document.getElementById('navLinks');n.classList.toggle('open');this.setAttribute('aria-expanded',n.classList.contains('open'))">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
</nav>`;

const FORM = `<form class="enquiry" id="enquiryForm" novalidate>
        <h3>Request workers</h3>
        <p class="enquiry-sub">Tell us what you need and we'll call you back, usually the same working day.</p>
        <div class="enquiry-grid">
          <div><label for="eq-name">Your name</label><input id="eq-name" name="name" autocomplete="name" required maxlength="100"></div>
          <div><label for="eq-company">Company</label><input id="eq-company" name="company" autocomplete="organization" required maxlength="150"></div>
          <div><label for="eq-email">Email</label><input id="eq-email" name="email" type="email" autocomplete="email" required maxlength="200"></div>
          <div><label for="eq-phone">Phone</label><input id="eq-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="40"></div>
          <div><label for="eq-workers">How many workers? <span class="opt">(optional)</span></label><input id="eq-workers" name="workers" inputmode="numeric" maxlength="20"></div>
          <div><label for="eq-start">Start date <span class="opt">(optional)</span></label><input id="eq-start" name="startDate" placeholder="e.g. Monday, ASAP" maxlength="60"></div>
          <div class="full"><label for="eq-location">Site location <span class="opt">(optional)</span></label><input id="eq-location" name="location" placeholder="Town or postcode" maxlength="150"></div>
          <div class="full"><label for="eq-message">Trades and details</label><textarea id="eq-message" name="message" required maxlength="3000" placeholder="__PLACEHOLDER__"></textarea></div>
        </div>
        <div class="hp" aria-hidden="true"><label for="eq-website">Leave this empty</label><input id="eq-website" name="website" tabindex="-1" autocomplete="off"></div>
        <button type="submit" class="btn btn-amber">Send enquiry</button>
        <p class="enquiry-status" id="enquiryStatus" role="status" aria-live="polite"></p>
      </form>`;

const FOOTER = `<footer class="footer">
  <div class="wrap">
    <div class="footer-inner">
      <div class="footer-brand">
        <strong style="color:#fff">PRL Site Solutions Ltd</strong>
        <p>Construction recruitment. Registered office: 259 Wallasey Village, Wallasey, Wirral, Merseyside CH45 3LR.<br>
        Company no. 14358717. Office Monday to Friday, 9am–5pm.<br>
        <a href="tel:08007723959" style="display:inline">0800 772 3959</a> · <a href="mailto:info@prlsitesolutions.co.uk" style="display:inline">info@prlsitesolutions.co.uk</a><br>
        <a href="${MAPS}">Google listing and reviews</a></p>
        <p class="footer-social" style="margin-top:12px;display:flex;gap:10px;align-items:center"><a href="https://www.linkedin.com/company/prl-site-solutions/" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.08);color:#fff;padding:0" aria-label="PRL Site Solutions on LinkedIn" title="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg></a><a href="https://www.instagram.com/prlsitesolutionsltd/" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.08);color:#fff;padding:0" aria-label="PRL Site Solutions on Instagram" title="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a><a href="https://www.facebook.com/profile.php?id=61595134512677" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.08);color:#fff;padding:0" aria-label="PRL Site Solutions on Facebook" title="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg></a></p>
        <div class="footer-badges">
          <img src="/assets/cyber-essentials-white.png" alt="Cyber Essentials certified" width="120" height="48" loading="lazy" style="height:48px;width:auto">
          <img src="/assets/iso-logo.png" alt="ISO 9001:2015 certified" width="44" height="44" loading="lazy" style="height:44px;width:auto;border-radius:6px">
        </div>
      </div>
      <div><h2>Services</h2>${PAGES.filter((p) => p.kind === 'service').map((p) => `<a href="/${p.slug}/">${esc(p.nav)}</a>`).join('')}</div>
      <div><h2>Sectors</h2>${PAGES.filter((p) => p.kind === 'sector').map((p) => `<a href="/${p.slug}/">${esc(p.nav)}</a>`).join('')}</div>
      <div><h2>Areas</h2>${AREAS.map((a) => `<a href="/${a.slug}/">${esc(a.nav)}</a>`).join('')}<a href="${MAPS}">Google reviews</a></div>
      <div><h2>Company</h2><a href="/guides/">Guides</a><a href="/case-studies/">Case studies</a><a href="/careers.html">Live vacancies</a><a href="/#contact">Contact us</a><a href="${COMPANIES_HOUSE}">Companies House</a><a href="https://www.prismworkforce.online/apply">Apply for work</a><a href="https://www.prismworkforce.online/privacy">Privacy policy</a><a href="/modern-slavery.html">Modern slavery statement</a></div>
    </div>
    <div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} PRL Site Solutions Ltd. All rights reserved.</span><span>Proud supporters of the Lighthouse Construction Industry Charity</span></div>
  </div>
</footer>`;

function shell({ path, title, description, schemaHtml, ogImage, body, note = 'Generated by scripts/build-pages.mjs from scripts/pages-content.mjs. Edit the content file, not this one.' }) {
  const url = `${SITE}${path}`;
  const og = ogImage ? [`${SITE}${ogImage[0]}`, ogImage[1], ogImage[2]] : [`${SITE}/assets/og-image.jpg`, 1200, 630];
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${og[0]}">
  <meta property="og:image:width" content="${og[1]}">
  <meta property="og:image:height" content="${og[2]}">
  <meta property="og:locale" content="en_GB">
  <meta property="og:site_name" content="PRL Site Solutions">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${og[0]}">
  <link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <!-- Fonts: self-hosted (assets/fonts, SIL Open Font Licence) -->
  <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/site.css">
  ${schemaHtml}
  <link rel="preconnect" href="https://cloud.umami.is">
  <link rel="preconnect" href="https://gateway.umami.is" crossorigin>
  <script defer src="/assets/track.js"></script>
  <script defer src="/assets/enquiry.js"></script>
</head>
<body>
<!-- ${note} -->
${NAV}
${body}
${FOOTER}
</body>
</html>
`;
}

function ctaSection(heading, placeholder) {
  return `  <section class="cta" id="enquiry">
    <div class="wrap cta-inner">
      ${FORM.replace('__PLACEHOLDER__', esc(placeholder))}
      <div class="cta-contact">
        <h2>${esc(heading)}</h2>
        <p>Workers on site within 24 hours in most cases. Prefer to talk? Call or email us directly.</p>
        <a href="tel:08007723959" class="btn btn-amber">Call 0800 772 3959</a>
        <a href="mailto:info@prlsitesolutions.co.uk" class="btn btn-ghost">info@prlsitesolutions.co.uk</a>
        <p class="cta-small">Looking for work? <a href="https://www.prismworkforce.online/apply">Apply online</a> or see <a href="/careers.html">live vacancies</a>.</p>
      </div>
    </div>
  </section>`;
}

function csCard(c, eager = false) {
  const src = c.imageSmall ? c.imageSmall[0] : c.image[0];
  const [w, h] = c.imageSmall ? [c.imageSmall[1], c.imageSmall[2]] : [c.image[1], c.image[2]];
  return `        <a class="cs-card" href="/case-studies/${c.slug}/">
          <img src="${src}" alt="" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>
          <span class="cs-card-body"><span class="cs-card-sector">${esc(c.meta.find(([k]) => k === 'Sector')?.[1] || 'Case study')}</span><strong>${esc(c.h1)}</strong><span class="cs-card-more">Read the case study →</span></span>
        </a>`;
}

// ───────────────────────── service & sector pages ─────────────────────────

const SERVICE_CTA = {
  'Skilled Trades': 'Need skilled tradespeople on site?',
  'Labour Supply': 'Need labour on site?',
  'Plant Operators': 'Need a plant operator?',
  'Site Management': 'Need site management cover?',
};
function ctaHeading(p) {
  if (p.kind === 'service') return SERVICE_CTA[p.nav] || 'Need people on site?';
  const noun = p.nav === 'M&E' ? 'M&E' : p.nav.toLowerCase();
  const article = /^(M&E|[aeiou])/i.test(noun) ? 'an' : 'a'; // "an M&E", "an energy-from-waste"
  return `Staffing ${article} ${noun} project?`;
}

function page(p) {
  const url = `${SITE}/${p.slug}/`;
  const section = p.kind === 'service' ? ['Services', '/#services'] : ['Sectors', '/#sectors'];
  const placeholder = p.roles[0] ? `e.g. 3 ${p.roles[0][0].toLowerCase()}, 4 weeks, days` : 'Trades, numbers and duration';
  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], [section[0], `${SITE}${section[1]}`], [p.nav, url]]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: p.h1,
      serviceType: p.nav + (p.kind === 'service' ? ' recruitment' : ' sector recruitment'),
      description: p.description,
      url,
      provider: LOCAL_PROVIDER,
      areaServed: [
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'AdministrativeArea', name: 'Northwest England' },
        ...NW_CITIES.map((name) => ({ '@type': 'City', name })),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: p.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ].map(jsonLd).join('\n');

  const caseStudies = (p.caseStudies || []).map((s) => csBySlug[s]);
  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="${section[1]}">${section[0]}</a> › ${esc(p.nav)}</nav>
    <h1>${esc(p.h1)}</h1>
    <p class="lede">${esc(p.lede)}</p>
    <div class="hero-actions">
      <a href="#enquiry" class="btn btn-amber">Request workers</a>
      <a href="tel:08007723959" class="btn btn-ghost">Call 0800 772 3959</a>
    </div>
    <ul class="hero-facts">${p.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  </div>
</header>

<main>
  <section class="block">
    <div class="wrap">
      <h2>Roles we supply</h2>
      <p class="intro">${esc(p.rolesIntro)}</p>
      <div class="roles">
${p.roles.map(([name, detail]) => `        <div class="role"><h3>${esc(name)}</h3><p>${esc(detail)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block alt">
    <div class="wrap prose">
      <h2>${p.kind === 'sector' ? `Why ${esc(p.nav)} is different` : 'How we work'}</h2>
${p.body.map((para) => `      <p>${esc(para)}</p>`).join('\n')}
    </div>
  </section>
${caseStudies.length ? `
  <section class="block">
    <div class="wrap">
      <h2>Case studies</h2>
      <p class="intro">${esc(p.nav)} projects PRL has staffed.</p>
      <div class="cs-cards">
${caseStudies.map((c) => csCard(c)).join('\n')}
      </div>
    </div>
  </section>
` : ''}
  <section class="block${caseStudies.length ? ' alt' : ''}">
    <div class="wrap">
      <h2>Checked before they reach your site</h2>
      <p class="intro">The same checks apply to every placement, managed through our PRISM workforce system.</p>
      <ul class="checks">
${COMMON_CHECKS.map(([b, rest]) => `        <li><strong>${esc(b)}:</strong> ${esc(rest)}</li>`).join('\n')}
      </ul>
    </div>
  </section>

  <section class="block${caseStudies.length ? '' : ' alt'}">
    <div class="wrap">
      <h2>How it works</h2>
      <div class="steps">
${STEPS.map(([h, t]) => `        <div class="step"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block${caseStudies.length ? ' alt' : ''}">
    <div class="wrap">
      <h2>Frequently asked questions</h2>
      <div class="faq">
${p.faqs.map(([q, a]) => `        <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block${caseStudies.length ? '' : ' alt'}">
    <div class="wrap">
      <h2>Related services and sectors</h2>
      <div class="related">
${p.related.map((s) => `        <a href="/${s}/">${esc(bySlug[s].nav)}${bySlug[s].kind === 'service' ? ' recruitment' : ''}</a>`).join('\n')}
        <a href="/careers.html">Live vacancies</a>
      </div>
      <h2 style="margin-top:36px">Where we supply ${esc(p.nav.toLowerCase())}</h2>
      <p class="intro">Supplied from our office in Wallasey on the Wirral to sites in Birkenhead, Liverpool, Ellesmere Port, Chester, Warrington, Manchester and across the North West, and further afield when a project needs it.</p>
      <div class="related">
${AREAS.map((a) => `        <a href="/${a.slug}/">${esc(a.nav)}</a>`).join('\n')}
      </div>
      <h2 style="margin-top:36px">Practical guides</h2>
      <div class="related">
${GUIDES.map((g) => `        <a href="/guides/${g.slug}/">${esc(g.nav)}</a>`).join('\n')}
      </div>
    </div>
  </section>

${ctaSection(ctaHeading(p), placeholder)}
</main>
`;
  return shell({ path: `/${p.slug}/`, title: p.title, description: p.description, schemaHtml, body });
}

// ───────────────────────── case studies ─────────────────────────

function caseStudy(c) {
  const path = `/case-studies/${c.slug}/`;
  const url = `${SITE}${path}`;
  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], ['Case studies', `${SITE}/case-studies/`], [c.h1, url]]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.h1,
      description: c.description,
      image: `${SITE}${c.image[0]}`,
      datePublished: PUBLISHED,
      author: PROVIDER,
      publisher: PROVIDER,
      mainEntityOfPage: url,
      about: { '@type': 'Service', serviceType: 'Construction recruitment', provider: PROVIDER },
    },
  ].map(jsonLd).join('\n');

  const sections = c.sections.map(([h, paras]) => `
  <section class="block">
    <div class="wrap prose">
      <h2>${esc(h)}</h2>
${paras.map((t) => `      <p>${esc(t)}</p>`).join('\n')}
    </div>
  </section>`).join('');

  const supplied = c.supplied ? `
  <section class="block alt">
    <div class="wrap">
      <h2>Who we supplied</h2>
      <p class="intro">${esc(c.supplied.intro)}</p>
      <div class="cs-table-wrap">
        <table class="cs-table">
          <thead><tr><th scope="col">Discipline</th><th scope="col">People</th><th scope="col">Roles</th></tr></thead>
          <tbody>
${c.supplied.rows.map(([d, n, r]) => `            <tr><th scope="row">${esc(d)}</th><td>${esc(n)}</td><td>${esc(r)}</td></tr>`).join('\n')}
          </tbody>
        </table>
      </div>
    </div>
  </section>` : '';

  const scope = c.scope ? `
  <section class="block alt">
    <div class="wrap">
      <h2>What we delivered</h2>
      <div class="roles">
${c.scope.map(([h, t]) => `        <div class="role"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>` : '';

  const how = c.how ? `
  <section class="block">
    <div class="wrap">
      <h2>How we delivered it</h2>
      <div class="steps">
${c.how.map(([h, t]) => `        <div class="step"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>` : '';

  const closing = (c.result || c.also) ? `
  <section class="block${c.how ? ' alt' : ''}">
    <div class="wrap prose">
      <h2>${c.result ? 'The result' : 'Also at Ince'}</h2>
      <p>${esc(c.result || c.also)}</p>
    </div>
  </section>` : '';

  const others = CASE_STUDIES.filter((o) => o.slug !== c.slug);
  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/case-studies/">Case studies</a> › ${esc(c.meta.find(([k]) => k === 'Site')?.[1] || '')}</nav>
    <p class="cs-kicker">Case study</p>
    <h1>${esc(c.h1)}</h1>
    <p class="lede">${esc(c.lede)}</p>
    <dl class="cs-meta">${c.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
</header>

<main>
  <div class="wrap cs-figure-wrap">
    <img class="cs-figure" src="${c.image[0]}"${c.imageSmall ? ` srcset="${c.imageSmall[0]} ${c.imageSmall[1]}w, ${c.image[0]} ${c.image[1]}w" sizes="(max-width: 1100px) calc(100vw - 48px), 1052px"` : ''} alt="${esc(c.image[3])}" width="${c.image[1]}" height="${c.image[2]}" fetchpriority="high">
  </div>

  <section class="block cs-glance-block">
    <div class="wrap">
      <h2 class="sr-only">At a glance</h2>
      <ul class="cs-glance">
${c.glance.map(([n, l]) => `        <li><strong>${esc(n)}</strong><span>${esc(l)}</span></li>`).join('\n')}
      </ul>
    </div>
  </section>
${sections}
${supplied}${scope}${how}${closing}

  <section class="block">
    <div class="wrap">
      <h2>Related</h2>
      <div class="related">
${c.related.map((s) => `        <a href="/${s}/">${esc(bySlug[s].nav)}${bySlug[s].kind === 'service' ? ' recruitment' : ''}</a>`).join('\n')}
${others.map((o) => `        <a href="/case-studies/${o.slug}/">Case study: ${esc(o.meta.find(([k]) => k === 'Site')?.[1] || o.slug)}</a>`).join('\n')}
      </div>
    </div>
  </section>

${ctaSection('Staffing a similar project?', 'e.g. 10 electricians and 4 fire watch, 12 weeks, days and nights')}
</main>
`;
  return shell({ path, title: c.title, description: c.description, schemaHtml, ogImage: c.image, body });
}

function caseStudyIndex() {
  const path = '/case-studies/';
  const description = 'Projects staffed by PRL Site Solutions, including energy-from-waste builds at Protos Energy Park, Ince Marsh and the Kelvin plant in Sandwell.';
  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], ['Case studies', `${SITE}${path}`]]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'PRL Site Solutions case studies',
      description,
      url: `${SITE}${path}`,
      hasPart: CASE_STUDIES.map((c) => ({ '@type': 'Article', headline: c.h1, url: `${SITE}/case-studies/${c.slug}/` })),
    },
  ].map(jsonLd).join('\n');
  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › Case studies</nav>
    <h1>Case studies: projects we've staffed</h1>
    <p class="lede">Energy-from-waste, industrial and construction projects where PRL has supplied the workforce.</p>
  </div>
</header>

<main>
  <section class="block">
    <div class="wrap">
      <h2 class="sr-only">All case studies</h2>
      <div class="cs-cards">
${CASE_STUDIES.map((c, i) => csCard(c, i < 2)).join('\n')}
      </div>
    </div>
  </section>

${ctaSection('Staffing your next project?', 'Trades, numbers, site and start date')}
</main>
`;
  return shell({ path, title: 'Case Studies | Projects Staffed by PRL Site Solutions', description, schemaHtml, body });
}

// ───────────────────────── local area pages ─────────────────────────

function areaPage(a) {
  const path = `/${a.slug}/`;
  const url = `${SITE}${path}`;
  const others = AREAS.filter((o) => o.slug !== a.slug);
  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], ['Areas', `${SITE}/#areas`], [a.nav, url]]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: a.h1,
      serviceType: 'Construction recruitment',
      description: a.description,
      url,
      provider: { '@id': ORG_ID },
      areaServed: [
        { '@type': 'City', name: a.city },
        ...a.towns.filter((t) => t !== a.city).map((name) => ({ '@type': 'City', name })),
      ],
    },
    {
      '@context': 'https://schema.org',
      ...LOCAL_PROVIDER,
      areaServed: [
        { '@type': 'City', name: a.city },
        ...a.towns.filter((t) => t !== a.city).map((name) => ({ '@type': 'City', name })),
        { '@type': 'AdministrativeArea', name: a.region },
        { '@type': 'AdministrativeArea', name: 'Northwest England' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: a.faqs.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans } })),
    },
  ].map(jsonLd).join('\n');

  const services = ['skilled-trades-recruitment', 'construction-labour-supply', 'plant-operator-recruitment', 'site-management-recruitment'];
  const nearby = liveJobs().filter((j) => a.jobMatch && a.jobMatch.test(j.location));
  const jobsSection = `  <section class="block alt">
    <div class="wrap">
      <h2>Live roles near ${esc(a.city)}</h2>
${nearby.length ? `      <div class="roles">
${nearby.map((j) => `        <div class="role"><h3><a href="${j.path}">${esc(j.title)}</a></h3><p>${esc([j.rate, j.type, j.location].filter(Boolean).join(' · '))}</p></div>`).join('\n')}
      </div>
      <p style="margin-top:16px"><a href="/careers.html">See every live vacancy</a></p>` : `      <p class="intro">No roles are advertised near ${esc(a.city)} today. New roles go up every week: see <a href="/careers.html">all live vacancies</a>, or <a href="https://www.prismworkforce.online/apply">register with PRL</a> and we will call you when work in your trade comes up.</p>`}
    </div>
  </section>
`;
  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/#areas">Areas</a> › ${esc(a.nav)}</nav>
    <h1>${esc(a.h1)}</h1>
    <p class="lede">${esc(a.lede)}</p>
    <div class="hero-actions">
      <a href="#enquiry" class="btn btn-amber">Request workers in ${esc(a.nav)}</a>
      <a href="tel:08007723959" class="btn btn-ghost">Call 0800 772 3959</a>
    </div>
    <ul class="hero-facts"><li>Registered office in Wallasey, Wirral</li><li>Office Monday–Friday, 9am–5pm</li><li>On site within 24 hours in most cases</li></ul>
  </div>
</header>

<main>
  <section class="block">
    <div class="wrap prose">
      <h2>Supplying ${esc(a.city)} and nearby</h2>
${a.body.map((para) => `      <p>${esc(para)}</p>`).join('\n')}
      <p>Towns covered from this page: ${esc(a.towns.join(', '))}.</p>
      <p><strong>PRL Site Solutions Ltd</strong>, 259 Wallasey Village, Wallasey, Wirral, Merseyside, CH45 3LR. Company <a href="${COMPANIES_HOUSE}">14358717</a>. <a href="tel:08007723959">0800 772 3959</a>, Monday to Friday 9am–5pm. <a href="${MAPS}">Google listing</a>.</p>
      ${mapBlock(a.nav)}
    </div>
  </section>

${jobsSection}
  <section class="block">
    <div class="wrap">
      <h2>What ${esc(a.city)} sites usually ask for</h2>
      <div class="roles">
${a.asks.map(([name, detail]) => `        <div class="role"><h3>${esc(name)}</h3><p>${esc(detail)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2>Checked before they reach your site</h2>
      <ul class="checks">
${COMMON_CHECKS.map(([b, rest]) => `        <li><strong>${esc(b)}:</strong> ${esc(rest)}</li>`).join('\n')}
      </ul>
    </div>
  </section>

  <section class="block alt">
    <div class="wrap">
      <h2>How it works</h2>
      <div class="steps">
${STEPS.map(([h, t]) => `        <div class="step"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2>Frequently asked questions</h2>
      <div class="faq">
${a.faqs.map(([q, ans]) => `        <details><summary>${esc(q)}</summary><p>${esc(ans)}</p></details>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block alt">
    <div class="wrap">
      <h2>Related</h2>
      <div class="related">
${services.map((s) => `        <a href="/${s}/">${esc(bySlug[s].nav)} recruitment</a>`).join('\n')}
${others.map((o) => `        <a href="/${o.slug}/">${esc(o.nav)} recruitment</a>`).join('\n')}
        <a href="/careers.html">Live vacancies</a>
        <a href="/guides/hiring-construction-labour-northwest/">Hiring labour in the Northwest</a>
        <a href="/guides/which-site-card/">Which site card</a>
        <a href="/guides/">All guides</a>
        <a href="/case-studies/">Case studies</a>
        <a href="${MAPS}">Google listing</a>
      </div>
    </div>
  </section>

${ctaSection(`Need people on a ${a.nav} site?`, `e.g. 6 labourers, ${a.city}, Monday, days`)}
</main>
`;
  return shell({
    path,
    title: a.title,
    description: a.description,
    schemaHtml: `<meta name="geo.placename" content="${esc(a.city)}, ${esc(a.region)}">\n  <meta name="geo.position" content="${a.geo[0]};${a.geo[1]}">\n  <meta name="ICBM" content="${a.geo[0]}, ${a.geo[1]}">\n  ${schemaHtml}`,
    body,
  });
}

// ───────────────────────── guides ─────────────────────────

function guideBody(g) {
  return g.sections.map((s, i) => `  <section class="block${i % 2 ? ' alt' : ''}">
    <div class="wrap prose">
      <h2>${esc(s.h2)}</h2>
${s.paragraphs.map((para) => `      <p>${esc(para)}</p>`).join('\n')}
${s.bullets ? `      <ul class="checks">\n${s.bullets.map((b) => `        <li>${esc(b)}</li>`).join('\n')}\n      </ul>` : ''}
    </div>
  </section>`).join('\n');
}

function guidePage(g) {
  const path = `/guides/${g.slug}/`;
  const url = `${SITE}${path}`;
  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], ['Guides', `${SITE}/guides/`], [g.nav, url]]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.h1,
      description: g.description,
      datePublished: '2026-10-20',
      dateModified: '2026-10-20',
      mainEntityOfPage: url,
      author: { '@id': ORG_ID },
      publisher: LOCAL_PROVIDER,
      about: NW_CITIES.map((name) => ({ '@type': 'City', name })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.faqs.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans } })),
    },
  ].map(jsonLd).join('\n');

  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/guides/">Guides</a> › ${esc(g.nav)}</nav>
    <h1>${esc(g.h1)}</h1>
    <p class="lede">${esc(g.lede)}</p>
    <div class="hero-actions">
      <a href="#enquiry" class="btn btn-amber">Request workers</a>
      <a href="tel:08007723959" class="btn btn-ghost">Call 0800 772 3959</a>
    </div>
    <ul class="hero-facts"><li>PRL Site Solutions Ltd, Wallasey</li><li>Company 14358717</li><li>Not legal advice</li></ul>
  </div>
</header>

<main>
${guideBody(g)}
  <section class="block alt">
    <div class="wrap">
      <h2>Questions on this</h2>
      <div class="faq">
${g.faqs.map(([q, ans]) => `        <details><summary>${esc(q)}</summary><p>${esc(ans)}</p></details>`).join('\n')}
      </div>
    </div>
  </section>
  <section class="block">
    <div class="wrap">
      <h2>Related</h2>
      <div class="related">
${g.relatedPages.map((s) => `        <a href="/${s}/">${esc(bySlug[s].nav)}</a>`).join('\n')}
${g.relatedGuides.map((s) => `        <a href="/guides/${s}/">${esc(guideBySlug[s].nav)}</a>`).join('\n')}
${AREAS.map((a) => `        <a href="/${a.slug}/">${esc(a.nav)}</a>`).join('\n')}
      </div>
    </div>
  </section>
${ctaSection('Need people on site?', 'Trade, numbers, postcode, start date and the ticket the gate will enforce')}
</main>
`;
  return shell({ path, title: g.title, description: g.description, schemaHtml, body });
}

function guideIndex() {
  const path = '/guides/';
  const title = 'Construction recruitment guides | CSCS, hiring, right to work | PRL';
  const description = 'Practical guides from PRL Site Solutions in Wallasey: which site card, hiring labour in the Northwest, right to work, and how to brief an agency.';
  const schemaHtml = [
    breadcrumbs([['Home', `${SITE}/`], ['Guides', `${SITE}/guides/`]]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Construction recruitment guides',
      url: `${SITE}/guides/`,
      isPartOf: { '@id': ORG_ID },
      about: LOCAL_PROVIDER,
    },
  ].map(jsonLd).join('\n');
  const body = `
<header class="hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › Guides</nav>
    <h1>Guides for hiring construction people</h1>
    <p class="lede">How we read a site card, what a Northwest brief needs, and the checks that happen before anyone travels. Written from the Wallasey desk, not a generic agency template.</p>
  </div>
</header>
<main>
  <section class="block">
    <div class="wrap">
      <div class="roles">
${GUIDES.map((g) => `        <div class="role"><h3><a href="/guides/${g.slug}/">${esc(g.h1)}</a></h3><p>${esc(g.description)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>
  <section class="block alt">
    <div class="wrap">
      <h2>Areas these apply to</h2>
      <div class="related">
${AREAS.map((a) => `        <a href="/${a.slug}/">${esc(a.city)}</a>`).join('\n')}
        <a href="/case-studies/">Case studies</a>
        <a href="${COMPANIES_HOUSE}">Companies House 14358717</a>
      </div>
    </div>
  </section>
${ctaSection('Tell us the postcode and the ticket', 'e.g. 4 blue-card groundworkers, CH41, Monday')}
</main>
`;
  return shell({ path, title, description, schemaHtml, body });
}

// Shared with scripts/sync-jobs.mjs, which builds the /jobs/ pages in the same chrome.
export { SITE, ORG_ID, esc, jsonLd, breadcrumbs, shell, ctaSection, PAGES, AREAS, areasFor, buildAll };

// ───────────────────────── validate & write ─────────────────────────

function buildAll() {

const warn = (slug, title, description) => {
  if (title.length > 75) console.warn(`! ${slug}: title is ${title.length} chars (Google shows ~60)`);
  if (description.length > 165) console.warn(`! ${slug}: description is ${description.length} chars (Google shows ~155)`);
};
for (const p of PAGES) {
  warn(p.slug, p.title, p.description);
  for (const r of p.related) if (!bySlug[r]) throw new Error(`${p.slug}: related page "${r}" does not exist`);
  for (const s of p.caseStudies || []) if (!csBySlug[s]) throw new Error(`${p.slug}: case study "${s}" does not exist`);
}
for (const c of CASE_STUDIES) {
  warn(c.slug, c.title, c.description);
  for (const r of c.related) if (!bySlug[r]) throw new Error(`${c.slug}: related page "${r}" does not exist`);
}

for (const a of AREAS) warn(a.slug, a.title, a.description);
for (const g of GUIDES) {
  warn(g.slug, g.title, g.description);
  for (const r of g.relatedPages) if (!bySlug[r]) throw new Error(`${g.slug}: related page "${r}" does not exist`);
  for (const r of g.relatedGuides) if (!guideBySlug[r]) throw new Error(`${g.slug}: related guide "${r}" does not exist`);
}

const OUTPUTS = [
  ...PAGES.map((p) => ({ path: `${p.slug}/`, html: page(p), prio: p.kind === 'sector' && p.slug.startsWith('energy') ? '0.9' : '0.8' })),
  ...AREAS.map((a) => ({ path: `${a.slug}/`, html: areaPage(a), prio: '0.8' })),
  { path: 'guides/', html: guideIndex(), prio: '0.7' },
  ...GUIDES.map((g) => ({ path: `guides/${g.slug}/`, html: guidePage(g), prio: '0.7' })),
  { path: 'case-studies/', html: caseStudyIndex(), prio: '0.7' },
  ...CASE_STUDIES.map((c) => ({ path: `case-studies/${c.slug}/`, html: caseStudy(c), prio: '0.7' })),
];

const today = new Date().toISOString().slice(0, 10);
const changed = [];
for (const o of OUTPUTS) {
  const dir = new URL(o.path, ROOT);
  const file = new URL('index.html', dir);
  mkdirSync(dir, { recursive: true });
  if (!existsSync(file) || readFileSync(file, 'utf8') !== o.html) {
    writeFileSync(file, o.html);
    changed.push(o.path);
  }
}

// Sitemap: add missing pages; bump lastmod on pages that changed.
const smFile = new URL('sitemap.xml', ROOT);
let sm = readFileSync(smFile, 'utf8');
for (const o of OUTPUTS) {
  const loc = `${SITE}/${o.path}`;
  if (!sm.includes(`<loc>${loc}</loc>`)) {
    sm = sm.replace('</urlset>', `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${o.prio}</priority>\n  </url>\n</urlset>`);
  } else if (changed.includes(o.path)) {
    sm = sm.replace(new RegExp(`(<loc>${loc.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*`), `$1${today}`);
  }
}
writeFileSync(smFile, sm);

console.log(changed.length ? `Built ${changed.length} page(s): ${changed.join(', ')}` : 'No page changes.');
return changed;
}

// Build only when run directly (node scripts/build-pages.mjs), not when imported.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) buildAll();
