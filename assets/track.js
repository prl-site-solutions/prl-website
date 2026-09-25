// Visitor tracking — Umami Cloud (cookieless, so no consent banner needed).
// Dashboard: https://cloud.umami.is — the Website ID below is the only setting.
(function () {
  var WEBSITE_ID = 'c052fdde-5418-4c1b-bf0d-97b075c8cf8f';
  if (WEBSITE_ID.indexOf('__') === 0) return; // not configured yet

  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.setAttribute('data-website-id', WEBSITE_ID);
  // Only count the live site, never local previews.
  s.setAttribute('data-domains', 'prlsitesolutions.co.uk,www.prlsitesolutions.co.uk');
  document.head.appendChild(s);

  function track(name, data) {
    if (window.umami && typeof window.umami.track === 'function') window.umami.track(name, data);
  }
  window.prlTrack = track;

  // The clicks that mean someone is getting in touch or applying.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var data = { page: location.pathname };
    var name = null;
    if (href.indexOf('tel:') === 0) name = 'Phone click';
    else if (href.indexOf('mailto:') === 0) name = 'Email click';
    else if (/cv-library\.co\.uk\/job\//.test(href)) {
      name = 'Job apply click';
      var card = a.closest('.role-card');
      var title = card && card.querySelector('.role-title');
      if (title) data.job = title.textContent.trim();
    }
    else if (/prismworkforce\.online\/(apply|onboarding|new-starter)/.test(href)) name = 'Candidate form click';
    else if (/prismworkforce\.online\/login/.test(href)) name = 'Contractor login click';
    else if (href === '#contact' && /Request|Hire/i.test(a.textContent)) name = 'Request workers button';
    if (name) track(name, data);
  }, true);
})();
