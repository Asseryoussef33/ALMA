/* ALMA | Engineer dashboard (restricted)
   Views: ?view=home (default) | ?view=projects | ?view=inbox
   Request status changes are kept in this browser (localStorage). */
(function () {
  'use strict';
  const A = window.ALMA;
  if (A.blocked) return;
  const D = A.data, esc = A.esc;
  const host = document.getElementById('dashboard-view');
  const user = A.auth.current();
  const me = user.engineerId ? A.byId(D.engineers, user.engineerId) : null;
  const STATE_KEY = 'alma.requestState';
  const view = ['projects', 'inbox'].indexOf(A.param('view')) !== -1 ? A.param('view') : 'home';
  A.setTab(view === 'projects' ? 'projects' : view === 'inbox' ? 'messages' : 'home');

  /* ---------- request data (seed + local changes) ---------- */
  function requests() {
    const st = A.store.get(STATE_KEY, {});
    return D.dashboard.requests.map(function (r) { return Object.assign({}, r, st[r.id] || {}); });
  }
  function patch(id, changes) {
    const st = A.store.get(STATE_KEY, {});
    st[id] = Object.assign({}, st[id] || {}, changes);
    A.store.set(STATE_KEY, st);
  }

  const STATUS = {
    'new': { label: 'New Request', cls: '' },
    'in-progress': { label: 'In Progress', cls: 'badge-progress' },
    'completed': { label: 'Completed', cls: 'badge-done' }
  };

  function requestCard(r) {
    const s = STATUS[r.status] || STATUS.new;
    let actions;
    if (r.status === 'new') {
      actions = '<button type="button" class="btn btn-primary btn-sm" data-act="proposal" data-id="' + r.id + '">' + A.icon('send') + 'Submit Proposal</button>' +
        '<button type="button" class="btn btn-outline btn-sm" data-act="visit" data-id="' + r.id + '">' + A.icon('calendar') + 'Accept Site Visit</button>';
    } else if (r.status === 'in-progress') {
      actions = '<a class="btn btn-ghost btn-sm" href="reports.html' + (r.siteId ? '?site=' + r.siteId : '') + '">' + A.icon('book') + 'Open journal</a>' +
        '<button type="button" class="btn btn-outline btn-sm" data-act="complete" data-id="' + r.id + '">' + A.icon('check') + 'Mark completed</button>';
    } else {
      actions = '<button type="button" class="btn btn-ghost btn-sm" data-act="details" data-id="' + r.id + '">' + A.icon('file') + 'View details</button>' +
        '<a class="btn btn-outline btn-sm" href="reports.html?view=weekly' + (r.siteId ? '&site=' + r.siteId : '') + '">' + A.icon('chart') + 'Reports</a>';
    }
    const stage = r.stage && r.status !== 'new' ? '<span class="request-stage">' + A.icon('clock') + esc(r.stage) + '</span>' : '';
    return '<article class="card request-card" aria-labelledby="rq-' + r.id + '">' +
      '<div class="request-main">' + A.media(r, 0, { label: r.title }) +
        '<div class="request-info">' +
          '<div class="request-top"><span class="badge ' + s.cls + '">' + s.label + '</span><span class="time">' + A.ago(r.hoursAgo) + '</span>' +
            (r.urgent && r.status === 'new' ? '<span class="badge badge-progress" title="Urgent quotation">Urgent</span>' : '') +
            '<details class="menu"><summary aria-label="More actions for ' + esc(r.title) + '">' + A.icon('more') + '</summary><div class="menu-list">' +
              '<button type="button" data-act="details" data-id="' + r.id + '">View details</button>' +
              (r.status === 'in-progress' ? '<button type="button" data-act="complete" data-id="' + r.id + '">Mark completed</button>' : '') +
              (A.store.get(STATE_KEY, {})[r.id] ? '<button type="button" data-act="reset" data-id="' + r.id + '">Reset to original status</button>' : '') +
            '</div></details></div>' +
          '<h3 id="rq-' + r.id + '">' + esc(r.title) + '</h3>' +
          '<p class="meta meta-icon">' + A.icon('pin') + esc(r.location) + '</p>' +
          '<div class="request-facts"><span>' + A.icon('area') + r.area + ' m&sup2;</span><span class="bar" aria-hidden="true"></span><span>' + A.icon('wallet') + esc(A.egpRange(r.budgetMin, r.budgetMax)) + '</span></div>' +
          '<p class="card-text">' + esc(r.description) + '</p>' + stage +
        '</div></div>' +
      '<ul class="tags" aria-label="Style tags">' + r.tags.map(function (t) { return '<li class="tag">' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="request-actions">' + actions + '</div>' +
    '</article>';
  }

  /* ---------- views ---------- */
  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }

  function renderHome() {
    const m = D.dashboard.metrics;
    const newOnes = requests().filter(function (r) { return r.status === 'new'; });
    const roleLine = me ? esc(me.role) + ' <span aria-hidden="true">&bull;</span> ' + esc(me.discipline) : esc(user.role);
    host.innerHTML =
      '<div class="greet">' +
        '<div><h1>' + greeting() + ', ' + esc(user.name) + '</h1><p class="sub">' + roleLine + '</p></div>' +
        '<p class="greet-date">' + A.fmtDate(A.iso(new Date()), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + A.icon('calendar') + '</p>' +
      '</div>' +
      '<section aria-label="Key figures" class="metrics" style="margin-top:20px">' +
        '<div class="card metric"><span class="metric-icon">' + A.icon('building') + '</span><span class="metric-value">' + m.activeSites + '</span><span class="metric-label">Active Sites</span>' +
          '<span class="metric-delta"><span class="up">' + A.icon('arrowUp') + m.activeSitesChange + '</span> since last week</span></div>' +
        '<div class="card metric"><span class="metric-icon">' + A.icon('file') + '</span><span class="metric-value">' + m.pendingQuotations + '</span><span class="metric-label">Pending Quotations</span>' +
          '<span class="metric-delta"><span class="warn-dot" aria-hidden="true"></span><span class="warn">' + m.urgentQuotations + '</span> urgent</span></div>' +
        '<div class="card metric"><span class="metric-icon">' + A.icon('chart') + '</span><span class="metric-value"><small>EGP</small> ' + A.egpShort(m.revenue).replace('EGP ', '') + '</span><span class="metric-label">Total Revenue</span>' +
          '<span class="metric-delta"><span class="up">' + A.icon('arrowUp') + m.revenueChangePct + '%</span> this month</span></div>' +
      '</section>' +
      '<section aria-labelledby="in-h" style="margin-top:28px">' +
        '<div class="section-head"><h2 id="in-h">Incoming Project Requests</h2><a class="see-all" href="dashboard.html?view=projects">See all' + A.icon('arrowRight') + '</a></div>' +
        (newOnes.length ? '<div class="request-list stack">' + newOnes.slice(0, 4).map(requestCard).join('') + '</div>'
          : '<div class="card empty">' + A.icon('check') + '<h3>No new requests</h3><p>You are all caught up.</p></div>') +
      '</section>' +
      '<section aria-labelledby="quick-h" style="margin-top:28px"><div class="section-head"><h2 id="quick-h">Quick links</h2></div><div class="tile-grid">' +
        '<a class="card tile" href="reports.html" style="text-decoration:none"><span class="tile-icon">' + A.icon('book') + '</span><div><h3>Daily journal</h3><p>Log today’s site activity</p></div>' + A.icon('chevronRight') + '</a>' +
        '<a class="card tile" href="reports.html?view=weekly" style="text-decoration:none"><span class="tile-icon">' + A.icon('chart') + '</span><div><h3>Weekly report</h3><p>Progress, materials and revenue</p></div>' + A.icon('chevronRight') + '</a>' +
        '<a class="card tile" href="dashboard.html?view=inbox" style="text-decoration:none"><span class="tile-icon">' + A.icon('message') + '</span><div><h3>Messages</h3><p>' + A.unreadCount() + ' unread</p></div>' + A.icon('chevronRight') + '</a>' +
      '</div></section>';
  }

  const pState = { tab: 'all', type: '', budget: '', sort: 'newest', panel: false };
  function renderProjects() {
    const all = requests();
    const counts = { all: all.length, 'new': 0, 'in-progress': 0, completed: 0 };
    all.forEach(function (r) { counts[r.status]++; });
    let list = all.filter(function (r) {
      return (pState.tab === 'all' || r.status === pState.tab) &&
        (!pState.type || r.type === pState.type) &&
        (!pState.budget || r.budgetMax >= Number(pState.budget));
    });
    const sorters = {
      newest: function (a, b) { return a.hoursAgo - b.hoursAgo; },
      budgetHigh: function (a, b) { return b.budgetMax - a.budgetMax; },
      budgetLow: function (a, b) { return a.budgetMin - b.budgetMin; },
      area: function (a, b) { return b.area - a.area; }
    };
    list = list.sort(sorters[pState.sort]);
    const filtersOn = pState.type || pState.budget;

    host.innerHTML =
      '<div class="view-head"><div><h1>Project Requests</h1><p>New opportunities from verified clients</p></div>' +
        '<div class="head-tools">' +
          '<button type="button" class="icon-btn" id="filter-btn" aria-label="Filter requests" aria-expanded="' + pState.panel + '" aria-controls="filter-panel">' + A.icon('filter') + (filtersOn ? '<span class="dot" aria-hidden="true"></span>' : '') + '</button>' +
          '<button type="button" class="icon-btn" id="sort-btn" aria-label="Sort requests" aria-expanded="' + pState.panel + '" aria-controls="filter-panel">' + A.icon('sort') + '</button>' +
        '</div></div>' +
      '<div class="card filter-panel" id="filter-panel"' + (pState.panel ? '' : ' hidden') + ' style="margin-top:14px">' +
        '<div class="toolbar-row">' +
          '<div class="field"><label for="f-type">Type</label><select id="f-type"><option value="">All types</option><option' + (pState.type === 'Residential' ? ' selected' : '') + '>Residential</option><option' + (pState.type === 'Commercial' ? ' selected' : '') + '>Commercial</option></select></div>' +
          '<div class="field"><label for="f-budget">Budget</label><select id="f-budget"><option value="">Any budget</option>' +
            [[1000000, 'EGP 1M and above'], [2000000, 'EGP 2M and above'], [3000000, 'EGP 3M and above']].map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === pState.budget ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
          '<div class="field"><label for="f-sort">Sort by</label><select id="f-sort">' +
            [['newest', 'Newest first'], ['budgetHigh', 'Budget: high to low'], ['budgetLow', 'Budget: low to high'], ['area', 'Area: largest first']].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === pState.sort ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
          '<button type="button" class="btn btn-ghost btn-sm" id="f-clear">Clear</button>' +
        '</div></div>' +
      '<div id="req-tabs" style="margin-top:16px"></div>' +
      '<p class="results-count" aria-live="polite" style="margin-top:8px">' + list.length + ' shown</p>' +
      '<div class="request-list stack" style="margin-top:12px">' + (list.length ? list.map(requestCard).join('')
        : '<div class="card empty">' + A.icon('folder') + '<h3>Nothing here</h3><p>No requests in this view.</p></div>') + '</div>';

    A.chips(document.getElementById('req-tabs'), [
      { value: 'all', label: 'All', count: counts.all }, { value: 'new', label: 'New', count: counts['new'] },
      { value: 'in-progress', label: 'In Progress', count: counts['in-progress'] }, { value: 'completed', label: 'Completed', count: counts.completed }
    ], pState.tab, function (v) { pState.tab = v; renderProjects(); document.querySelector('#req-tabs [aria-pressed="true"]').focus(); }, 'Request status');

    function togglePanel(focusId) {
      pState.panel = !pState.panel; renderProjects();
      if (pState.panel) document.getElementById(focusId).focus();
    }
    document.getElementById('filter-btn').addEventListener('click', function () { togglePanel('f-type'); });
    document.getElementById('sort-btn').addEventListener('click', function () { togglePanel('f-sort'); });
    function onChange(key, id) { document.getElementById(id).addEventListener('change', function (e) { pState[key] = e.target.value; renderProjects(); document.getElementById(id).focus(); }); }
    onChange('type', 'f-type'); onChange('budget', 'f-budget'); onChange('sort', 'f-sort');
    document.getElementById('f-clear').addEventListener('click', function () { pState.type = ''; pState.budget = ''; pState.sort = 'newest'; renderProjects(); });
  }

  function renderInbox() {
    const items = A.inboxItems();
    const read = A.store.get('alma.readIds', []);
    const KIND = { request: 'Website request', listing: 'Listing request', message: 'Message' };
    host.innerHTML =
      '<div class="view-head"><div><h1>Messages</h1><p>Quote requests, bookings and listing requests sent from the website, plus messages.</p></div></div>' +
      '<div class="notice" style="margin-top:14px">' + A.icon('lock') + '<span>Demo inbox: website requests are stored in this browser only. Connect the forms to email or a CRM before launch.</span></div>' +
      '<div class="stack" style="margin-top:16px">' + (items.length ? items.map(function (m) {
        const unread = read.indexOf(m.id) === -1;
        return '<article class="card inbox-item' + (unread ? ' unread' : '') + '">' +
          '<div class="inbox-top"><strong>' + esc(m.from) + (unread ? ' <span class="sr-only">(unread)</span>' : '') + '</strong><span class="muted small">' + esc(m.date) + '</span></div>' +
          '<div><span class="badge badge-outline">' + KIND[m.kind] + '</span> <strong style="font-size:14px">' + esc(m.subject) + '</strong></div>' +
          '<p>' + esc(m.body) + '</p></article>';
      }).join('') : '<div class="card empty">' + A.icon('message') + '<h3>No messages</h3></div>') + '</div>';
    // mark everything as read once viewed
    A.store.set('alma.readIds', Array.from(new Set(read.concat(items.map(function (m) { return m.id; })))));
    A.refreshNav(); A.setTab('messages');
  }

  function render() {
    if (view === 'projects') renderProjects(); else if (view === 'inbox') renderInbox(); else renderHome();
  }

  /* ---------- actions (event delegation) ---------- */
  host.addEventListener('click', function (e) {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const r = requests().find(function (x) { return x.id === b.dataset.id; }); if (!r) return;
    const menu = b.closest('details'); if (menu) menu.open = false;
    const act = b.dataset.act;

    if (act === 'proposal') {
      const mid = Math.round((r.budgetMin + r.budgetMax) / 2 / 10000) * 10000;
      A.modal({
        title: 'Submit Proposal: ' + r.title, submitLabel: 'Send proposal',
        body: '<p class="muted small" style="margin-bottom:14px">' + esc(r.location) + ' | ' + r.area + ' m² | Client budget ' + esc(A.egpRange(r.budgetMin, r.budgetMax)) + '</p>' +
          '<div class="form-grid">' +
            A.field('p-amount', 'Proposed amount (EGP)', '<input id="p-amount" name="amount" type="number" min="1" step="any" required value="' + mid + '">') +
            A.field('p-weeks', 'Duration (weeks)', '<input id="p-weeks" name="weeks" type="number" min="1" required value="12">') +
            A.field('p-notes', 'Scope and notes', '<textarea id="p-notes" name="notes" rows="4" required>Full finishing as requested. Materials schedule and payment milestones attached.</textarea>', true) +
          '</div>',
        onSubmit: function (d) {
          patch(r.id, { status: 'in-progress', stage: 'Proposal sent: ' + A.egp(d.amount) + ', ' + d.weeks + ' weeks' });
          A.toast('Proposal sent for ' + r.title + '.'); render();
        }
      });
    } else if (act === 'visit') {
      A.modal({
        title: 'Accept Site Visit: ' + r.title, submitLabel: 'Confirm visit',
        body: '<div class="form-grid">' +
          A.field('v-date', 'Visit date', '<input id="v-date" name="date" type="date" required min="' + A.iso(new Date()) + '" value="' + A.addDays(A.iso(new Date()), 2) + '">') +
          A.field('v-time', 'Time', '<input id="v-time" name="time" type="time" required value="11:00">') +
          A.field('v-note', 'Note to client', '<textarea id="v-note" name="note" rows="3">I will bring samples for flooring and wall finishes.</textarea>', true) +
          '</div>',
        onSubmit: function (d) {
          patch(r.id, { status: 'in-progress', stage: 'Site visit: ' + A.fmtDate(d.date, { weekday: 'short', day: 'numeric', month: 'short' }) + ' at ' + d.time });
          A.toast('Site visit confirmed for ' + r.title + '.'); render();
        }
      });
    } else if (act === 'complete') {
      patch(r.id, { status: 'completed', stage: 'Completed' }); A.toast(r.title + ' marked as completed.'); render();
    } else if (act === 'reset') {
      const st = A.store.get(STATE_KEY, {}); delete st[r.id]; A.store.set(STATE_KEY, st); A.toast('Status reset.'); render();
    } else if (act === 'details') {
      A.modal({
        title: r.title,
        body: A.media(r, 0, { label: r.title, cls: 'swatch' }) +
          '<dl class="detail-list" style="margin-top:14px">' +
          [['Status', (STATUS[r.status] || STATUS.new).label + (r.stage ? ' (' + r.stage + ')' : '')], ['Type', r.type], ['Location', r.location], ['Area', r.area + ' m²'],
            ['Budget', A.egpRange(r.budgetMin, r.budgetMax)], ['Received', A.ago(r.hoursAgo)], ['Brief', r.description], ['Styles', r.tags.join(', ')]]
            .map(function (kv) { return '<div><dt>' + kv[0] + '</dt><dd>' + esc(kv[1]) + '</dd></div>'; }).join('') + '</dl>'
      });
    }
  });

  // close any open "more" menu when clicking elsewhere
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.menu[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });

  render();
})();
