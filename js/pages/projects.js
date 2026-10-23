/* ALMA | Projects list: search + category + status filters, and Saved view */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data;

  const state = {
    q: A.param('q') || '',
    cat: D.categories.indexOf(A.param('cat')) !== -1 ? A.param('cat') : 'All',
    status: 'all',
    saved: A.param('saved') === '1'
  };

  if (state.saved) {
    A.setTab('saved');
    document.getElementById('projects-title').textContent = 'Saved projects';
    document.getElementById('projects-sub').textContent = 'Projects you bookmarked on this device.';
    document.title = 'Saved projects | ALMA';
  }

  const input = document.getElementById('project-search');
  input.value = state.q;

  A.chips(document.getElementById('category-filter'), D.categories.map(function (c) { return { value: c, label: c }; }),
    state.cat, function (v) { state.cat = v; render(); }, 'Filter by category');
  A.chips(document.getElementById('status-filter'), [
    { value: 'all', label: 'All statuses' }, { value: 'completed', label: 'Completed' }, { value: 'in-progress', label: 'In progress' }
  ], state.status, function (v) { state.status = v; render(); }, 'Filter by status');

  input.addEventListener('input', A.debounce(function () { state.q = input.value; render(); }, 150));

  function matches(p, q) {
    if (!q) return true;
    // Searches title, location and style tags (plus feature and material names)
    const hay = [p.title, p.location, p.type, p.category].concat(p.tags, p.features, p.materials.map(function (m) { return m.name; }))
      .join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function syncURL() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.cat !== 'All') p.set('cat', state.cat);
    if (state.saved) p.set('saved', '1');
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function render() {
    const savedIds = A.saved.list();
    const list = D.projects.filter(function (p) {
      return (!state.saved || savedIds.indexOf(p.id) !== -1) &&
        (state.cat === 'All' || p.category === state.cat) &&
        (state.status === 'all' || p.status === state.status) &&
        matches(p, state.q);
    });
    document.getElementById('results-count').textContent = list.length + (list.length === 1 ? ' project' : ' projects');
    const host = document.getElementById('project-list');
    if (list.length) {
      host.innerHTML = list.map(A.projectCard).join('');
    } else {
      host.innerHTML = '<div class="card empty" style="grid-column:1/-1">' + A.icon(state.saved ? 'bookmark' : 'search') +
        '<h3>' + (state.saved && !savedIds.length ? 'No saved projects yet' : 'No projects match') + '</h3>' +
        '<p>' + (state.saved && !savedIds.length ? 'Tap the bookmark on any project to save it here.' : 'Try another category or a shorter search.') + '</p>' +
        '<p style="margin-top:14px"><a class="btn btn-ghost btn-sm" href="projects.html">Show all projects</a></p></div>';
    }
    syncURL();
  }
  render();
})();
