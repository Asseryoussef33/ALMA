/* ALMA | Engineers directory */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data, esc = A.esc;
  const search = document.getElementById('eng-search');
  let discipline = 'all';

  const disciplines = Array.from(new Set(D.engineers.map(function (e) { return e.discipline; })));
  A.chips(document.getElementById('eng-filter'), [{ value: 'all', label: 'All' }].concat(disciplines.map(function (d) { return { value: d, label: d }; })),
    'all', function (v) { discipline = v; render(); }, 'Filter by discipline');

  function completedCount(id) { return D.projects.filter(function (p) { return p.engineerId === id && p.status === 'completed'; }).length; }

  function card(e) {
    const contact = e.email
      ? '<a class="btn btn-primary btn-sm" href="mailto:' + esc(e.email) + '?subject=' + encodeURIComponent('Enquiry via ALMA website') + '">' + A.icon('mail') + 'Contact</a>'
      : '<button type="button" class="btn btn-primary btn-sm" data-quote="quote">' + A.icon('mail') + 'Contact</button>';
    return '<article class="card engineer-card">' +
      '<div class="engineer-top"><span class="avatar">' + (e.photo ? '<img src="' + esc(e.photo) + '" alt="Photo of ' + esc(e.name) + '">' : '<span aria-hidden="true">' + esc(A.initials(e.name)) + '</span>') + '</span>' +
        '<div><h3>' + esc(e.name) + '</h3><p class="muted small">' + esc(e.role) + ' <span aria-hidden="true">&bull;</span> ' + esc(e.discipline) + '</p>' +
        (e.sample ? '<span class="badge badge-sample">Sample profile</span>' : '') + '</div></div>' +
      '<div class="stat-inline"><span><strong>' + e.years + '</strong> yrs experience</span><span><strong>' + completedCount(e.id) + '</strong> completed</span><span><strong>' + e.currentProjects.length + '</strong> current</span></div>' +
      '<div class="kv"><span>Specialties</span><ul class="tags">' + e.specialties.map(function (s) { return '<li class="tag">' + esc(s) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="kv"><span>Current projects</span><p>' + esc(e.currentProjects.length ? e.currentProjects.join(', ') : 'Available for new projects') + '</p></div>' +
      '<div class="contact-row">' + contact +
        '<a class="btn btn-outline btn-sm" href="engineer.html?id=' + encodeURIComponent(e.id) + '">View profile' + A.icon('arrowRight') + '</a></div>' +
      '</article>';
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const list = D.engineers.filter(function (e) {
      const hay = [e.name, e.role, e.discipline].concat(e.specialties, e.currentProjects).join(' ').toLowerCase();
      return (discipline === 'all' || e.discipline === discipline) && (!q || q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; }));
    });
    document.getElementById('eng-count').textContent = list.length + (list.length === 1 ? ' engineer' : ' engineers');
    document.getElementById('eng-list').innerHTML = list.length ? list.map(card).join('')
      : '<div class="card empty" style="grid-column:1/-1">' + A.icon('users') + '<h3>No engineers match</h3><p>Try a different search.</p></div>';
  }
  search.addEventListener('input', A.debounce(render, 150));
  render();
})();
