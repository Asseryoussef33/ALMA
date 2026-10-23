/* ALMA | Daily & weekly site reports (restricted)
   URL params: ?view=daily|weekly &site=<siteId|all> &date=YYYY-MM-DD &week=YYYY-MM-DD (Saturday)
   Export: CSV download, or the browser's Print dialog (Save as PDF). */
(function () {
  'use strict';
  const A = window.ALMA;
  if (A.blocked) return;
  const D = A.data, esc = A.esc;
  const LOCAL_KEY = 'alma.journal';

  const siteSel = document.getElementById('site-select');
  const dateIn = document.getElementById('date-input');
  const weekSel = document.getElementById('week-select');
  const tabDaily = document.getElementById('tab-daily');
  const tabWeekly = document.getElementById('tab-weekly');
  const dailyPanel = document.getElementById('daily-panel');
  const weeklyPanel = document.getElementById('weekly-panel');

  /* ---------- data helpers ---------- */
  function entries() {
    return D.journal.concat(A.store.get(LOCAL_KEY, [])).slice().sort(function (a, b) {
      return a.date.localeCompare(b.date) || a.siteId.localeCompare(b.siteId);
    });
  }
  function site(id) { return A.byId(D.sites, id) || { name: id, location: '' }; }
  function engName(id) { const e = A.byId(D.engineers, id); return e ? e.name : ''; }
  function matCost(e) { return (e.materials || []).reduce(function (s, m) { return s + (Number(m.cost) || 0); }, 0); }
  function weekStart(iso) { const d = A.parseISO(iso); d.setDate(d.getDate() - ((d.getDay() + 1) % 7)); return A.iso(d); } // Saturday
  function weekLabel(start) {
    return A.fmtDate(start, { day: 'numeric', month: 'short' }) + ' to ' + A.fmtDate(A.addDays(start, 6), { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function bySite(list) { return siteSel.value === 'all' ? list : list.filter(function (e) { return e.siteId === siteSel.value; }); }

  /* ---------- controls ---------- */
  const state = {
    view: A.param('view') === 'weekly' ? 'weekly' : 'daily',
    site: D.sites.some(function (s) { return s.id === A.param('site'); }) ? A.param('site') : 'all'
  };
  function fillControls(keepDate, keepWeek) {
    const all = entries();
    siteSel.innerHTML = '<option value="all">All sites</option>' + D.sites.map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === state.site ? ' selected' : '') + '>' + esc(s.name) + '</option>';
    }).join('');
    const dates = all.map(function (e) { return e.date; });
    const latest = dates[dates.length - 1] || A.iso(new Date());
    dateIn.min = dates[0] || ''; dateIn.max = A.iso(new Date()) > latest ? A.iso(new Date()) : latest;
    dateIn.value = keepDate || A.param('date') || latestForSite() || latest;
    const weeks = Array.from(new Set(all.map(function (e) { return weekStart(e.date); }))).sort().reverse();
    weekSel.innerHTML = weeks.map(function (w) { return '<option value="' + w + '">' + weekLabel(w) + '</option>'; }).join('');
    weekSel.value = keepWeek || (weeks.indexOf(A.param('week')) !== -1 ? A.param('week') : weeks[0]);
  }
  function latestForSite() {
    const l = bySite(entries()); return l.length ? l[l.length - 1].date : '';
  }

  function setView(v) {
    state.view = v;
    const daily = v === 'daily';
    tabDaily.setAttribute('aria-selected', String(daily)); tabWeekly.setAttribute('aria-selected', String(!daily));
    tabDaily.tabIndex = daily ? 0 : -1; tabWeekly.tabIndex = daily ? -1 : 0;
    dailyPanel.hidden = !daily; weeklyPanel.hidden = daily;
    document.getElementById('date-wrap').hidden = !daily;
    document.getElementById('week-wrap').hidden = daily;
    document.getElementById('recent-days').hidden = !daily;
    render();
  }

  function syncURL() {
    const p = new URLSearchParams();
    p.set('view', state.view);
    if (siteSel.value !== 'all') p.set('site', siteSel.value);
    if (state.view === 'daily') p.set('date', dateIn.value); else p.set('week', weekSel.value);
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  }

  /* ---------- daily ---------- */
  function entryCard(e) {
    const s = site(e.siteId);
    const mats = e.materials && e.materials.length
      ? '<div class="table-wrap"><table><caption class="sr-only">Materials used</caption><thead><tr><th scope="col">Material</th><th scope="col" class="num">Qty</th><th scope="col">Unit</th><th scope="col" class="num">Cost</th></tr></thead><tbody>' +
        e.materials.map(function (m) { return '<tr><td>' + esc(m.name) + '</td><td class="num">' + m.qty + '</td><td>' + esc(m.unit) + '</td><td class="num">' + A.egp(m.cost) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td colspan="3">Materials total</td><td class="num">' + A.egp(matCost(e)) + '</td></tr></tfoot></table></div>'
      : '<p class="muted small">No materials logged.</p>';
    return '<article class="card entry-card">' +
      '<div class="entry-head"><div><h3>' + esc(s.name) + '</h3><p class="meta meta-icon">' + A.icon('pin') + esc(s.location) + '</p></div>' +
        '<span class="badge badge-outline">' + A.fmtDate(e.date) + '</span></div>' +
      '<div class="progress-row"><div class="progress" role="progressbar" aria-label="Site progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + e.progress + '"><span style="width:' + e.progress + '%"></span></div><span>' + e.progress + '%</span></div>' +
      '<div class="entry-facts"><span>' + A.icon('users') + e.workers + ' workers</span><span>' + A.icon('user') + esc(engName(s.engineerId) || 'Unassigned') + '</span>' +
        '<span>' + A.icon('wallet') + 'Received ' + A.egp(e.revenue || 0) + '</span>' + (e.local ? '<span class="badge badge-sample">Added in this browser</span>' : '') + '</div>' +
      '<div><h4 class="small muted" style="margin-bottom:4px">ACTIVITIES</h4><p>' + esc(e.activities) + '</p></div>' +
      mats + (e.issues ? '<p class="issue"><strong>Issues: </strong>' + esc(e.issues) + '</p>' : '') +
    '</article>';
  }

  function dailyList() { return bySite(entries()).filter(function (e) { return e.date === dateIn.value; }); }

  function renderDaily() {
    const list = dailyList();
    // recent days chips
    const days = Array.from(new Set(bySite(entries()).map(function (e) { return e.date; }))).sort().reverse().slice(0, 8);
    const rd = document.getElementById('recent-days');
    rd.className = 'chip-row'; rd.setAttribute('role', 'group');
    rd.innerHTML = days.map(function (d) {
      return '<button type="button" class="chip" aria-pressed="' + (d === dateIn.value) + '" data-day="' + d + '">' + A.fmtDate(d, { weekday: 'short', day: 'numeric', month: 'short' }) + '</button>';
    }).join('');

    const total = list.reduce(function (s, e) { return s + (e.revenue || 0); }, 0);
    dailyPanel.innerHTML =
      '<div class="report-section"><h2>Daily journal: ' + A.fmtDate(dateIn.value) + '</h2>' +
      (list.length
        ? '<p class="muted small" style="margin-bottom:12px">' + list.length + ' entr' + (list.length === 1 ? 'y' : 'ies') + ' | ' +
            list.reduce(function (s, e) { return s + e.workers; }, 0) + ' workers | materials ' + A.egp(list.reduce(function (s, e) { return s + matCost(e); }, 0)) + ' | received ' + A.egp(total) + '</p>' +
          '<div class="stack">' + list.map(entryCard).join('') + '</div>'
        : '<div class="card empty">' + A.icon('book') + '<h3>No journal entries for this day</h3><p>Pick a highlighted day above or add a new entry.</p></div>') +
      '</div>';
    setPrintTitle('Daily journal | ' + A.fmtDate(dateIn.value));
  }

  /* ---------- weekly ---------- */
  function weeklyData() {
    const start = weekSel.value, end = A.addDays(start, 6);
    const all = entries();
    const list = bySite(all).filter(function (e) { return e.date >= start && e.date <= end; });
    const siteIds = Array.from(new Set(list.map(function (e) { return e.siteId; })));
    const perSite = siteIds.map(function (id) {
      const own = list.filter(function (e) { return e.siteId === id; });
      const before = all.filter(function (e) { return e.siteId === id && e.date < start; });
      const from = before.length ? before[before.length - 1].progress : own[0].progress;
      const to = own[own.length - 1].progress;
      return {
        id: id, name: site(id).name, days: new Set(own.map(function (e) { return e.date; })).size,
        from: from, to: to, workerDays: own.reduce(function (s, e) { return s + e.workers; }, 0),
        materials: own.reduce(function (s, e) { return s + matCost(e); }, 0),
        revenue: own.reduce(function (s, e) { return s + (e.revenue || 0); }, 0),
        issues: own.filter(function (e) { return e.issues; }).length
      };
    });
    const mats = {};
    list.forEach(function (e) {
      (e.materials || []).forEach(function (m) {
        const k = m.name + '|' + m.unit;
        mats[k] = mats[k] || { name: m.name, unit: m.unit, qty: 0, cost: 0 };
        mats[k].qty += Number(m.qty) || 0; mats[k].cost += Number(m.cost) || 0;
      });
    });
    return {
      start: start, end: end, list: list, perSite: perSite,
      materials: Object.keys(mats).map(function (k) { return mats[k]; }).sort(function (a, b) { return b.cost - a.cost; }),
      totals: {
        days: new Set(list.map(function (e) { return e.date; })).size,
        workerDays: perSite.reduce(function (s, x) { return s + x.workerDays; }, 0),
        materials: perSite.reduce(function (s, x) { return s + x.materials; }, 0),
        revenue: perSite.reduce(function (s, x) { return s + x.revenue; }, 0)
      }
    };
  }

  function renderWeekly() {
    const w = weeklyData();
    const scope = siteSel.value === 'all' ? 'All sites' : site(siteSel.value).name;
    setPrintTitle('Weekly report | ' + scope + ' | ' + weekLabel(w.start));
    if (!w.list.length) {
      weeklyPanel.innerHTML = '<div class="card empty">' + A.icon('chart') + '<h3>No activity this week</h3><p>Choose another week or site.</p></div>';
      return;
    }
    weeklyPanel.innerHTML =
      '<div class="report-section"><h2>Weekly report: ' + esc(scope) + '</h2><p class="muted small" style="margin:-4px 0 12px">' + weekLabel(w.start) + '</p>' +
        '<div class="summary-grid">' +
          '<div class="stat-box"><strong>' + w.totals.days + '</strong><span>Days logged</span></div>' +
          '<div class="stat-box"><strong>' + w.totals.workerDays + '</strong><span>Worker-days</span></div>' +
          '<div class="stat-box"><strong>' + A.egpShort(w.totals.materials) + '</strong><span>Materials cost</span></div>' +
          '<div class="stat-box"><strong>' + A.egpShort(w.totals.revenue) + '</strong><span>Revenue received</span></div>' +
        '</div></div>' +

      '<div class="report-section"><h2>Progress by site</h2><div class="table-wrap"><table><thead><tr>' +
        '<th scope="col">Site</th><th scope="col">Progress</th><th scope="col" class="num">Days</th><th scope="col" class="num">Worker-days</th><th scope="col" class="num">Materials</th><th scope="col" class="num">Revenue</th></tr></thead><tbody>' +
        w.perSite.map(function (s) {
          return '<tr><th scope="row" style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink);background:none">' + esc(s.name) + (s.issues ? ' <span class="badge badge-progress">' + s.issues + ' issue' + (s.issues > 1 ? 's' : '') + '</span>' : '') + '</th>' +
            '<td style="min-width:150px"><div class="progress-row"><div class="progress" aria-hidden="true"><span style="width:' + s.to + '%"></span></div><span>' + s.from + '% &rarr; ' + s.to + '%</span></div>' +
            '<span class="sr-only">Progress from ' + s.from + ' to ' + s.to + ' percent</span></td>' +
            '<td class="num">' + s.days + '</td><td class="num">' + s.workerDays + '</td><td class="num">' + A.egp(s.materials) + '</td><td class="num">' + A.egp(s.revenue) + '</td></tr>';
        }).join('') +
        '</tbody><tfoot><tr><td>Total</td><td></td><td class="num">' + w.totals.days + '</td><td class="num">' + w.totals.workerDays + '</td><td class="num">' + A.egp(w.totals.materials) + '</td><td class="num">' + A.egp(w.totals.revenue) + '</td></tr></tfoot></table></div></div>' +

      '<div class="report-section"><h2>Materials used</h2>' + (w.materials.length
        ? '<div class="table-wrap"><table><thead><tr><th scope="col">Material</th><th scope="col" class="num">Qty</th><th scope="col">Unit</th><th scope="col" class="num">Cost</th></tr></thead><tbody>' +
          w.materials.map(function (m) { return '<tr><td>' + esc(m.name) + '</td><td class="num">' + m.qty + '</td><td>' + esc(m.unit) + '</td><td class="num">' + A.egp(m.cost) + '</td></tr>'; }).join('') +
          '</tbody></table></div>' : '<p class="muted">No materials logged this week.</p>') + '</div>' +

      '<div class="report-section"><h2>Site activity</h2><div class="table-wrap"><table><thead><tr><th scope="col">Date</th><th scope="col">Site</th><th scope="col">Activities</th><th scope="col" class="num">Progress</th></tr></thead><tbody>' +
        w.list.map(function (e) {
          return '<tr><td style="white-space:nowrap">' + A.fmtDate(e.date, { weekday: 'short', day: 'numeric', month: 'short' }) + '</td><td>' + esc(site(e.siteId).name) + '</td><td>' + esc(e.activities) +
            (e.issues ? '<br><span class="small" style="color:var(--warn)">Issue: ' + esc(e.issues) + '</span>' : '') + '</td><td class="num">' + e.progress + '%</td></tr>';
        }).join('') + '</tbody></table></div></div>';
  }

  function setPrintTitle(t) {
    document.getElementById('print-title').innerHTML = '<p style="font-size:20px;font-weight:700">ALMA | ' + esc(t) + '</p><p class="muted small">Generated ' + A.fmtDate(A.iso(new Date())) + '</p><hr>';
  }

  function render() {
    if (state.view === 'daily') renderDaily(); else renderWeekly();
    syncURL();
  }

  /* ---------- export ---------- */
  function exportCSV() {
    const scope = siteSel.value === 'all' ? 'all-sites' : siteSel.value;
    if (state.view === 'daily') {
      const rows = [['Date', 'Site', 'Engineer', 'Progress %', 'Workers', 'Activities', 'Materials', 'Materials cost (EGP)', 'Revenue received (EGP)', 'Issues']];
      dailyList().forEach(function (e) {
        const s = site(e.siteId);
        rows.push([e.date, s.name, engName(s.engineerId), e.progress, e.workers, e.activities,
          (e.materials || []).map(function (m) { return m.name + ' ' + m.qty + ' ' + m.unit; }).join('; '), matCost(e), e.revenue || 0, e.issues || '']);
      });
      if (rows.length === 1) { A.toast('Nothing to export for this day.'); return; }
      A.downloadCSV(rows, 'alma-daily-' + dateIn.value + '-' + scope + '.csv');
    } else {
      const w = weeklyData();
      if (!w.list.length) { A.toast('Nothing to export for this week.'); return; }
      const rows = [['ALMA weekly report', weekLabel(w.start)], ['Scope', siteSel.value === 'all' ? 'All sites' : site(siteSel.value).name], [],
        ['Site', 'Progress start %', 'Progress end %', 'Days logged', 'Worker-days', 'Materials cost (EGP)', 'Revenue received (EGP)']];
      w.perSite.forEach(function (s) { rows.push([s.name, s.from, s.to, s.days, s.workerDays, s.materials, s.revenue]); });
      rows.push(['Total', '', '', w.totals.days, w.totals.workerDays, w.totals.materials, w.totals.revenue], [], ['Material', 'Quantity', 'Unit', 'Cost (EGP)']);
      w.materials.forEach(function (m) { rows.push([m.name, m.qty, m.unit, m.cost]); });
      rows.push([], ['Date', 'Site', 'Activities', 'Progress %', 'Issues']);
      w.list.forEach(function (e) { rows.push([e.date, site(e.siteId).name, e.activities, e.progress, e.issues || '']); });
      A.downloadCSV(rows, 'alma-weekly-' + w.start + '-' + scope + '.csv');
    }
  }

  /* ---------- new journal entry ---------- */
  function newEntry() {
    const defSite = siteSel.value !== 'all' ? siteSel.value : D.sites[0].id;
    A.modal({
      title: 'New journal entry', submitLabel: 'Save entry',
      body: '<div class="form-grid">' +
        A.field('n-site', 'Site', '<select id="n-site" name="siteId" required>' + D.sites.map(function (s) { return '<option value="' + s.id + '"' + (s.id === defSite ? ' selected' : '') + '>' + esc(s.name) + '</option>'; }).join('') + '</select>') +
        A.field('n-date', 'Date', '<input id="n-date" name="date" type="date" required value="' + A.iso(new Date()) + '" max="' + A.iso(new Date()) + '">') +
        A.field('n-progress', 'Overall progress (%)', '<input id="n-progress" name="progress" type="number" min="0" max="100" required>') +
        A.field('n-workers', 'Workers on site', '<input id="n-workers" name="workers" type="number" min="0" required value="5">') +
        A.field('n-activities', 'Activities', '<textarea id="n-activities" name="activities" rows="3" required></textarea>', true) +
        A.field('n-materials', 'Materials (one per line: name, qty, unit, cost)', '<textarea id="n-materials" name="materials" rows="3" placeholder="Tile adhesive, 20, bag, 4400"></textarea>', true) +
        A.field('n-revenue', 'Payment received (EGP)', '<input id="n-revenue" name="revenue" type="number" min="0" value="0">') +
        A.field('n-issues', 'Issues (optional)', '<input id="n-issues" name="issues">') +
        '</div><p class="muted small form-note">Demo: entries are saved in this browser only.</p>',
      onSubmit: function (d) {
        const materials = (d.materials || '').split('\n').map(function (l) { return l.split(',').map(function (x) { return x.trim(); }); })
          .filter(function (p) { return p[0]; })
          .map(function (p) { return { name: p[0], qty: Number(p[1]) || 0, unit: p[2] || '', cost: Number(p[3]) || 0 }; });
        const list = A.store.get(LOCAL_KEY, []);
        list.push({ id: 'jl' + Date.now(), local: true, date: d.date, siteId: d.siteId, progress: Number(d.progress), workers: Number(d.workers),
          revenue: Number(d.revenue) || 0, activities: d.activities, materials: materials, issues: d.issues || '' });
        A.store.set(LOCAL_KEY, list);
        state.site = siteSel.value;
        fillControls(d.date, weekStart(d.date));
        setView('daily');
        A.toast('Journal entry saved.');
      }
    });
  }

  /* ---------- wire up ---------- */
  fillControls();
  siteSel.addEventListener('change', function () { state.site = siteSel.value; if (state.view === 'daily' && !dailyList().length && latestForSite()) dateIn.value = latestForSite(); render(); });
  dateIn.addEventListener('change', render);
  weekSel.addEventListener('change', render);
  document.getElementById('recent-days').addEventListener('click', function (e) {
    const b = e.target.closest('[data-day]'); if (!b) return; dateIn.value = b.dataset.day; render();
    const again = document.querySelector('[data-day="' + b.dataset.day + '"]'); if (again) again.focus();
  });
  tabDaily.addEventListener('click', function () { setView('daily'); });
  tabWeekly.addEventListener('click', function () { setView('weekly'); });
  [tabDaily, tabWeekly].forEach(function (t) {
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const v = state.view === 'daily' ? 'weekly' : 'daily'; setView(v); (v === 'daily' ? tabDaily : tabWeekly).focus(); }
    });
  });
  document.getElementById('export-csv').addEventListener('click', exportCSV);
  document.getElementById('print-report').addEventListener('click', function () { window.print(); });
  document.getElementById('new-entry').addEventListener('click', newEntry);
  setView(state.view);
})();
