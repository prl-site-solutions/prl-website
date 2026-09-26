// Builds the service and sector pages from scripts/pages-content.mjs into
// /<slug>/index.html, and keeps sitemap.xml in step. No dependencies.
//
//   node scripts/build-pages.mjs
//
// The generated HTML is committed (GitHub Pages serves static files), so run
// this after editing the content and commit both.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { COMMON_CHECKS, STEPS, PAGES } from './pages-content.mjs';

const SITE = 'https://prlsitesolutions.co.uk';
const ORG_ID = `${SITE}/#organization`;
const ROOT = new URL('../', import.meta.url);
const bySlug = Object.fromEntries(PAGES.map((p) => [p.slug, p]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

function schema(p) {
  const url = `${SITE}/${p.slug}/`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: p.kind === 'service' ? 'Services' : 'Sectors', item: `${SITE}/#${p.kind === 'service' ? 'services' : 'sectors'}` },
        { '@type': 'ListItem', position: 3, name: p.nav, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: p.h1,
      serviceType: p.nav + (p.kind === 'service' ? ' recruitment' : ' sector recruitment'),
      description: p.description,
      url,
      provider: { '@type': 'EmploymentAgency', '@id': ORG_ID, name: 'PRL Site Solutions', url: `${SITE}/`, telephone: '+448007723959' },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: p.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ].map(jsonLd).join('\n');
}

const NAV = `<nav class="nav" aria-label="Main">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="/assets/prl_logo_96.jpg" alt="" width="40" height="40">PRL Site Solutions</a>
    <div class="nav-links" id="navLinks">
      <a href="/#services">Services</a>
      <a href="/#sectors">Sectors</a>
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
      <div><h2>Company</h2><a href="/careers.html">Live vacancies</a><a href="/#contact">Contact us</a><a href="https://www.prismworkforce.online/apply">Apply for work</a><a href="https://www.prismworkforce.online/privacy">Privacy policy</a><a href="/modern-slavery.html">Modern slavery statement</a></div>
    </div>
    <div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} PRL Site Solutions Ltd. All rights reserved.</span><span>Proud supporters of the Lighthouse Construction Industry Charity</span></div>
  </div>
</footer>`;

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
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:image" content="${SITE}/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_GB">
  <meta property="og:site_name" content="PRL Site Solutions">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg">
  <link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"></noscript>
  <link rel="stylesheet" href="/assets/site.css">
  ${schema(p)}
  <script defer src="/assets/track.js"></script>
  <script defer src="/assets/enquiry.js"></script>
</head>
<body>
<!-- Generated by scripts/build-pages.mjs from scripts/pages-content.mjs. Edit the content file, not this one. -->
${NAV}

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

  <section class="block">
    <div class="wrap">
      <h2>Checked before they reach your site</h2>
      <p class="intro">The same checks apply to every placement, managed through our PRISM workforce system.</p>
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
${p.faqs.map(([q, a]) => `        <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="block alt">
    <div class="wrap">
      <h2>Related services and sectors</h2>
      <div class="related">
${p.related.map((s) => `        <a href="/${s}/">${esc(bySlug[s].nav)}${bySlug[s].kind === 'service' ? ' recruitment' : ''}</a>`).join('\n')}
        <a href="/careers.html">Live vacancies</a>
      </div>
    </div>
  </section>

  <section class="cta" id="enquiry">
    <div class="wrap cta-inner">
      ${FORM.replace('__PLACEHOLDER__', esc(placeholder))}
      <div class="cta-contact">
        <h2>${esc(ctaHeading(p))}</h2>
        <p>Workers on site within 24 hours in most cases. Prefer to talk? Call or email us directly.</p>
        <a href="tel:08007723959" class="btn btn-amber">Call 0800 772 3959</a>
        <a href="mailto:info@prlsitesolutions.co.uk" class="btn btn-ghost">info@prlsitesolutions.co.uk</a>
        <p class="cta-small">Looking for work? <a href="https://www.prismworkforce.online/apply">Apply online</a> or see <a href="/careers.html">live vacancies</a>.</p>
      </div>
    </div>
  </section>
</main>

${FOOTER}
</body>
</html>
`;
}

// ---- validate content, then write ----
for (const p of PAGES) {
  if (p.title.length > 75) console.warn(`! ${p.slug}: title is ${p.title.length} chars (Google shows ~60)`);
  if (p.description.length > 165) console.warn(`! ${p.slug}: description is ${p.description.length} chars (Google shows ~155)`);
  for (const r of p.related) if (!bySlug[r]) throw new Error(`${p.slug}: related page "${r}" does not exist`);
}

const today = new Date().toISOString().slice(0, 10);
const changed = [];
for (const p of PAGES) {
  const dir = new URL(`${p.slug}/`, ROOT);
  const file = new URL('index.html', dir);
  const html = page(p);
  mkdirSync(dir, { recursive: true });
  if (!existsSync(file) || readFileSync(file, 'utf8') !== html) {
    writeFileSync(file, html);
    changed.push(p.slug);
  }
}

// Sitemap: add missing pages; bump lastmod on pages that changed.
const smFile = new URL('sitemap.xml', ROOT);
let sm = readFileSync(smFile, 'utf8');
for (const p of PAGES) {
  const loc = `${SITE}/${p.slug}/`;
  if (!sm.includes(`<loc>${loc}</loc>`)) {
    const prio = p.kind === 'sector' && p.slug.startsWith('energy') ? '0.9' : '0.8';
    sm = sm.replace('</urlset>', `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${prio}</priority>\n  </url>\n</urlset>`);
  } else if (changed.includes(p.slug)) {
    sm = sm.replace(new RegExp(`(<loc>${loc.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*`), `$1${today}`);
  }
}
writeFileSync(smFile, sm);

console.log(changed.length ? `Built ${changed.length} page(s): ${changed.join(', ')}` : 'No page changes.');
