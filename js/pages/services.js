/* ALMA | Services page */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data, esc = A.esc;
  const BTN = {
    quote: { label: 'Request a Quote', icon: 'send' },
    visit: { label: 'Book a Site Visit', icon: 'calendar' },
    video: { label: 'Book a Video Consultation', icon: 'video' }
  };

  function slug(s) { return s.toLowerCase().replace(/\s+/g, '-'); }

  document.getElementById('service-groups').innerHTML = D.services.map(function (g) {
    return '<section class="service-group" id="group-' + slug(g.group) + '" aria-labelledby="h-' + slug(g.group) + '" style="scroll-margin-top:84px">' +
      '<div class="service-group-head"><span class="tile-icon">' + A.icon(g.icon) + '</span><h2 id="h-' + slug(g.group) + '">' + esc(g.group) + '</h2></div>' +
      '<div class="service-grid">' + g.items.map(function (s) {
        const actions = (s.actions || ['quote']).map(function (k, i) {
          const b = BTN[k] || BTN.quote;
          return '<button type="button" class="btn ' + (i === 0 ? 'btn-primary' : 'btn-outline') + ' btn-sm" data-quote="' + k + '" data-service="' + esc(s.id) + '">' +
            A.icon(b.icon) + esc(b.label) + '</button>';
        }).join('');
        const link = s.link ? '<a class="text-link" href="' + esc(s.link) + '">' + esc(s.linkLabel || 'Learn more') + A.icon('arrowRight') + '</a>' : '';
        return '<article class="card service-card" id="svc-' + esc(s.id) + '">' +
          '<div class="service-card-head"><span class="tile-icon">' + A.icon(s.icon || 'sparkle') + '</span><h3>' + esc(s.name) + '</h3></div>' +
          '<p>' + esc(s.description) + '</p>' + link +
          '<div class="service-actions">' + actions + '</div></article>';
      }).join('') + '</div></section>';
  }).join('');

  // Smart cost estimator
  const E = D.estimator;
  const area = document.getElementById('est-area');
  const level = document.getElementById('est-level');
  const scope = document.getElementById('est-scope');
  level.innerHTML = E.levels.map(function (l, i) { return '<option value="' + l.id + '"' + (i === 1 ? ' selected' : '') + '>' + esc(l.label) + ' (approx. ' + A.egp(l.rate) + ' / m²)</option>'; }).join('');
  scope.innerHTML = E.scopes.map(function (s) { return '<option value="' + s.id + '">' + esc(s.label) + '</option>'; }).join('');
  const out = document.getElementById('est-result');
  let lastText = '';
  function calc() {
    const m2 = Math.max(0, Number(area.value) || 0);
    const l = A.byId(E.levels, level.value), s = A.byId(E.scopes, scope.value);
    const mid = m2 * l.rate * s.factor;
    lastText = m2 ? A.egpRange(mid * (1 - E.spread), mid * (1 + E.spread)) : 'Enter an area';
    out.textContent = lastText;
  }
  [area, level, scope].forEach(function (el) { el.addEventListener('input', calc); });
  calc();
  document.getElementById('est-quote').addEventListener('click', function () {
    const l = A.byId(E.levels, level.value), s = A.byId(E.scopes, scope.value);
    A.openQuote({ kind: 'quote', serviceId: 'estimator', area: area.value,
      note: 'Estimator: ' + area.value + ' m², ' + l.label + ', ' + s.label + ' = ' + lastText });
  });

  // honour #anchors after content is injected
  if (location.hash) { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
})();
