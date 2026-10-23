/* ALMA | Home page */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data, esc = A.esc;

  // Hero (text + image come from data.js > home.hero)
  const hero = D.home.hero;
  document.getElementById('hero-media').innerHTML = A.media(hero, 0, { label: hero.title });
  document.getElementById('hero-eyebrow').textContent = hero.eyebrow;
  document.getElementById('hero-title').textContent = hero.title;
  document.getElementById('hero-sub').textContent = hero.subtitle;

  // Categories: links into the filtered projects page
  document.getElementById('home-categories').innerHTML = D.categories.map(function (c, i) {
    const href = c === 'All' ? 'projects.html' : 'projects.html?cat=' + encodeURIComponent(c);
    return '<a class="chip" href="' + href + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' + esc(c) + '</a>';
  }).join('');

  // Featured projects
  const featured = D.projects.filter(function (p) { return p.featured; });
  document.getElementById('featured-list').innerHTML = (featured.length ? featured : D.projects.slice(0, 2)).map(A.projectCard).join('');

  // Services preview: one tile per group
  document.getElementById('services-preview').innerHTML = D.services.map(function (g) {
    const names = g.items.slice(0, 3).map(function (s) { return s.name; }).join(', ');
    return '<a class="card tile" href="services.html#group-' + encodeURIComponent(g.group.toLowerCase().replace(/\s+/g, '-')) + '" style="text-decoration:none">' +
      '<span class="tile-icon">' + A.icon(g.icon) + '</span>' +
      '<div><h3>' + esc(g.group) + '</h3><p>' + esc(names) + (g.items.length > 3 ? ' and more' : '') + '</p></div>' + A.icon('chevronRight') + '</a>';
  }).join('');

  document.getElementById('office-count').textContent = D.offices.length + ' finishing and interior execution offices';
  document.getElementById('engineer-count').textContent = D.engineers.length + ' engineers in our team and network';
})();
