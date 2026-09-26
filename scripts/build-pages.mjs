// Builds the service, sector and case study pages from scripts/pages-content.mjs
// into /<slug>/index.html and /case-studies/..., and keeps sitemap.xml in step.
// No dependencies.
//
//   node scripts/build-pages.mjs
//
// The generated HTML is committed (GitHub Pages serves static files), so run
// this after editing the content and commit both.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { COMMON_CHECKS, STEPS, PAGES, CASE_STUDIES } from './pages-content.mjs';

const SITE = 'https://prlsitesolutions.co.uk';
const ORG_ID = `${SITE}/#organization`;
const ROOT = new URL('../', import.meta.url);
const bySlug = Object.fromEntries(PAGES.map((p) => [p.slug, p]));
const csBySlug = Object.fromEntries(CASE_STUDIES.map((c) => [c.slug, c]));
const PUBLISHED = '2026-09-26';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const PROVIDER = { '@type': 'EmploymentAgency', '@id': ORG_ID, name: 'PRL Site Solutions', url: `${SITE}/`, telephone: '+448007723959' };

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
      <a href="/#sectors">Sectors</a>
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
        <p>Construction, industrial and energy-from-waste recruitment. 15 Beryl Road, Prenton, Wirral CH43 9RS.<br>
        <a href="tel:08007723959" style="display:inline">0800 772 3959</a> · <a href="mailto:info@prlsitesolutions.co.uk" style="display:inline">info@prlsitesolutions.co.uk</a></p>
        <div class="footer-badges">
          <img src="/assets/cyber-essentials-white.png" alt="Cyber Essentials certified" width="120" height="48" loading="lazy" style="height:48px;width:auto">
          <img src="/assets/iso-logo.png" alt="ISO 9001:2015 certified" width="44" height="44" loading="lazy" style="height:44px;width:auto;border-radius:6px">
        </div>
      </div>
      <div><h2>Services</h2>${PAGES.filter((p) => p.kind === 'service').map((p) => `<a href="/${p.slug}/">${esc(p.nav)}</a>`).join('')}</div>
      <div><h2>Sectors</h2>${PAGES.filter((p) => p.kind === 'sector').map((p) => `<a href="/${p.slug}/">${esc(p.nav)}</a>`).join('')}</div>
      <div><h2>Company</h2><a href="/case-studies/">Case studies</a><a href="/careers.html">Live vacancies</a><a href="/#contact">Contact us</a><a href="https://www.prismworkforce.online/apply">Apply for work</a><a href="https://www.prismworkforce.online/privacy">Privacy policy</a><a href="/modern-slavery.html">Modern slavery statement</a></div>
    </div>
    <div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} PRL Site Solutions Ltd. All rights reserved.</span><span>Proud supporters of the Lighthouse Construction Industry Charity</span></div>
  </div>
</footer>`;

function shell({ path, title, description, schemaHtml, ogImage, body }) {
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
<!-- Generated by scripts/build-pages.mjs from scripts/pages-content.mjs. Edit the content file, not this one. -->
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
      provider: PROVIDER,
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
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

// ───────────────────────── validate & write ─────────────────────────

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

const OUTPUTS = [
  ...PAGES.map((p) => ({ path: `${p.slug}/`, html: page(p), prio: p.kind === 'sector' && p.slug.startsWith('energy') ? '0.9' : '0.8' })),
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
