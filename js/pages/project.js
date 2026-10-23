/* ALMA | Project detail: gallery, description, feature tags, Materials & Finishes */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data, esc = A.esc;
  const host = document.getElementById('project-detail');
  const p = A.byId(D.projects, A.param('id'));

  if (!p) {
    host.innerHTML = '<div class="card empty">' + A.icon('search') + '<h3>Project not found</h3><p>It may have been moved or renamed.</p>' +
      '<p style="margin-top:14px"><a class="btn btn-primary btn-sm" href="projects.html">Browse projects</a></p></div>';
    return;
  }
  document.title = p.title + ' | ALMA';

  const count = Math.max(1, p.images.length || p.galleryCount || 1);
  const eng = A.byId(D.engineers, p.engineerId);
  const FEATURE_ICONS = ['layers', 'cube', 'grid', 'sparkle', 'ruler', 'eye'];
  const statusBadge = p.status === 'in-progress' ? '<span class="badge badge-progress">In progress</span>' : '<span class="badge badge-done">Completed</span>';

  host.innerHTML =
    '<div class="detail-wrap">' +
      '<section class="gallery" aria-roledescription="carousel" aria-label="Project gallery">' +
        '<div class="gallery-track" id="g-track">' + Array.from({ length: count }, function (_, i) {
          return '<div class="gallery-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + count + '"' + (i ? ' aria-hidden="true"' : '') + '>' + A.media(p, i) + '</div>';
        }).join('') + '</div>' +
        (count > 1
          ? '<button type="button" class="icon-btn gallery-btn gallery-prev" id="g-prev" aria-label="Previous image">' + A.icon('chevronLeft') + '</button>' +
            '<button type="button" class="icon-btn gallery-btn gallery-next" id="g-next" aria-label="Next image">' + A.icon('chevronRight') + '</button>'
          : '') +
        '<span class="gallery-counter" id="g-counter" aria-live="polite">1 / ' + count + '</span>' +
      '</section>' +

      '<div class="stack">' +
        '<div style="display:flex;gap:8px;align-items:center;justify-content:space-between">' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge badge-outline">' + esc(p.type) + '</span>' + statusBadge + '</div>' +
          '<div style="display:flex;gap:6px">' +
            '<button type="button" class="icon-btn" id="save-btn" aria-pressed="false" aria-label="Save project">' + A.icon('bookmark') + '</button>' +
            '<button type="button" class="icon-btn" id="share-btn" aria-label="Share project">' + A.icon('share') + '</button>' +
          '</div>' +
        '</div>' +
        '<h1 class="display detail-title">' + esc(p.title) + '</h1>' +
        '<div class="detail-meta"><span>' + A.icon('pin') + esc(p.location) + '</span><span>' + A.icon('area') + p.area + ' m&sup2;</span><span>' + A.icon('grid') + esc(p.category) + '</span></div>' +
        '<p class="detail-price">' + esc(A.priceOf(p)) + '</p>' +
        '<p class="detail-desc">' + esc(p.description) + '</p>' +
        '<ul class="tags" aria-label="Style tags">' + p.tags.map(function (t) { return '<li class="tag">' + esc(t) + '</li>'; }).join('') + '</ul>' +

        '<section aria-labelledby="feat-h" style="margin-top:22px"><h2 id="feat-h" class="sr-only">Features</h2>' +
          '<ul class="tags">' + p.features.map(function (f, i) { return '<li class="tag tag-lg">' + A.icon(FEATURE_ICONS[i % FEATURE_ICONS.length]) + esc(f) + '</li>'; }).join('') + '</ul></section>' +

        '<section aria-labelledby="mat-h" style="margin-top:24px">' +
          '<div class="section-head"><h2 id="mat-h">Materials &amp; Finishes</h2></div>' +
          '<ul class="materials">' + p.materials.map(function (m) {
            return '<li class="material">' + (m.image
              ? '<img class="swatch" src="' + esc(m.image) + '" alt="" style="width:100%;object-fit:cover">'
              : '<div class="swatch sw-' + esc(m.swatch) + '" aria-hidden="true"></div>') + '<p>' + esc(m.name) + '</p></li>';
          }).join('') + '</ul></section>' +

        (eng ? '<a class="card engineer-mini" href="engineer.html?id=' + encodeURIComponent(eng.id) + '" style="text-decoration:none;margin-top:22px">' +
          '<span class="avatar avatar-sm">' + (eng.photo ? '<img src="' + esc(eng.photo) + '" alt="">' : esc(A.initials(eng.name))) + '</span>' +
          '<div><span class="muted small">Project engineer</span><h3>' + esc(eng.name) + '</h3><span class="muted small">' + esc(eng.role) + '</span></div>' +
          '<span style="margin-left:auto;color:var(--muted)">' + A.icon('chevronRight') + '</span></a>' : '') +

        '<div class="detail-actions sticky-cta" style="margin-top:22px">' +
          '<button type="button" class="btn btn-primary btn-lg btn-block" data-quote="quote" data-project="' + esc(p.id) + '">Request a Quote' + A.icon('arrowRight') + '</button>' +
        '</div>' +
        '<button type="button" class="btn btn-outline btn-block" data-quote="visit" data-service="site-visit" data-project="' + esc(p.id) + '">' + A.icon('calendar') + 'Book a Site Visit</button>' +
      '</div>' +
    '</div>' +

    '<section aria-labelledby="more-h" style="margin-top:36px"><div class="section-head"><h2 id="more-h">More projects</h2><a class="see-all" href="projects.html">See all' + A.icon('arrowRight') + '</a></div>' +
      '<div class="card-list grid-2">' + D.projects.filter(function (x) { return x.id !== p.id; })
        .sort(function (a, b) { return (b.category === p.category) - (a.category === p.category); }).slice(0, 2).map(A.projectCard).join('') +
      '</div></section>';

  // Gallery: buttons, keyboard arrows, swipe
  let idx = 0;
  const track = document.getElementById('g-track');
  const slides = track.children;
  function go(i) {
    idx = (i + count) % count;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    Array.prototype.forEach.call(slides, function (s, n) { if (n === idx) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
    document.getElementById('g-counter').textContent = (idx + 1) + ' / ' + count;
  }
  if (count > 1) {
    document.getElementById('g-prev').addEventListener('click', function () { go(idx - 1); });
    document.getElementById('g-next').addEventListener('click', function () { go(idx + 1); });
    const gal = track.parentElement;
    gal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    });
    let x0 = null;
    gal.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    gal.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // Save (bookmark) and share
  const saveBtn = document.getElementById('save-btn');
  function syncSave() {
    const on = A.saved.has(p.id);
    saveBtn.setAttribute('aria-pressed', String(on));
    saveBtn.setAttribute('aria-label', on ? 'Remove from saved' : 'Save project');
  }
  syncSave();
  saveBtn.addEventListener('click', function () {
    const on = A.saved.toggle(p.id); syncSave();
    A.toast(on ? 'Saved. Find it under Saved.' : 'Removed from saved.');
  });
  document.getElementById('share-btn').addEventListener('click', function () {
    const data = { title: p.title + ' | ALMA', url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(function () { A.toast('Link copied.'); }, function () { A.toast('Copy the link from the address bar.'); });
    } else { A.toast('Copy the link from the address bar.'); }
  });
})();
