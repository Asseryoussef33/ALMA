/* ==========================================================================
   ALMA | app.js : shared behaviour for every page
   - icons, formatting, storage, demo auth + page guard
   - shared header, mobile drawer, bottom navigation, footer
   - reusable components: project card, chip filter, modal, toast,
     quote / site-visit request form, CSV download
   Load order on every page: data.js -> app.js -> pages/<page>.js
   ========================================================================== */
(function () {
  'use strict';

  const D = window.ALMA_DATA;
  const ALMA = (window.ALMA = { data: D });
  const body = document.body;

  /* ---------------------------------------------------------------- icons */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2"/>',
    message: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    area: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 16V8h8"/><path d="m8 8 8 8"/>',
    wallet: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    send: '<path d="M21 3 3 10.5l7 3 3 7z"/><path d="m10 13.5 4.5-4.5"/>',
    filter: '<path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/>',
    sort: '<path d="M8 4v16M8 4 4.5 7.5M8 4l3.5 3.5M16 20V4M16 20l-3.5-3.5M16 20l3.5-3.5"/>',
    building: '<path d="M4 21V5l7-2v18M11 9h9v12M7 8h1M7 12h1M7 16h1M14 13h3M14 17h3M2 21h20"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
    chart: '<path d="M4 20h16"/><path d="M7 16v-3M11 16v-6M15 16v-4M19 16V7"/><path d="m6 9 4-3 4 2 5-4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    printer: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    checkSquare: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 3 3 5-6"/>',
    more: '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.8 5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    hardhat: '<path d="M3 18h18M5 18v-3a7 7 0 0 1 14 0v3M10 8V5h4v3"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    sofa: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 1 1 4 0v4H3zM5 17v2M19 17v2"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    store: '<path d="M4 9 5.5 4h13L20 9M4 9h16v11H4zM9 20v-6h6v6"/>',
    tools: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19l-3-3 7.5-7.5"/><path d="m4 20 5-5M3 6l3-3 4 4-3 3z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'
  };

  ALMA.icon = function (name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  };
  /** Replace every <span data-icon="name"></span> inside root with its SVG. */
  ALMA.hydrateIcons = function (root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      el.innerHTML = ALMA.icon(el.getAttribute('data-icon'));
      el.removeAttribute('data-icon');
    });
  };

  /* ------------------------------------------------------------ helpers */
  const esc = (ALMA.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  });
  ALMA.param = function (k) { return new URLSearchParams(location.search).get(k); };
  ALMA.byId = function (list, id) { return (list || []).find(function (x) { return x.id === id; }); };

  function trim1(x) { return String(Math.round(x * 10) / 10); }
  function short(n) {
    if (n >= 1e6) return trim1(n / 1e6) + 'M';
    if (n >= 1e3) return trim1(n / 1e3) + 'K';
    return String(n);
  }
  ALMA.egp = function (n) { return 'EGP ' + Math.round(Number(n) || 0).toLocaleString('en-US'); };
  ALMA.egpShort = function (n) { return 'EGP ' + short(Number(n) || 0); };
  ALMA.egpRange = function (a, b) { return 'EGP ' + short(a) + ' - ' + short(b); };
  ALMA.priceOf = function (p) { return p.price ? ALMA.egp(p.price) : ALMA.egpRange(p.budgetMin, p.budgetMax); };
  ALMA.ago = function (h) {
    if (h < 1) return 'Just now';
    if (h < 24) return Math.round(h) + 'h ago';
    return Math.round(h / 24) + 'd ago';
  };
  function pad(n) { return String(n).padStart(2, '0'); }
  ALMA.iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  ALMA.parseISO = function (s) { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  ALMA.addDays = function (s, n) { const d = ALMA.parseISO(s); d.setDate(d.getDate() + n); return ALMA.iso(d); };
  ALMA.fmtDate = function (s, opts) {
    return ALMA.parseISO(s).toLocaleDateString('en-GB', opts || { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };
  ALMA.initials = function (name) {
    return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  };
  ALMA.debounce = function (fn, ms) {
    let t; return function () { const a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(null, a); }, ms || 180); };
  };

  /* ------------------------------------------------------------ storage
     Browser storage can be blocked (private mode, some file:// setups);
     everything falls back to memory for the current page. */
  const mem = {};
  function makeStore(kind) {
    return {
      get: function (key, fallback) {
        try {
          const v = window[kind].getItem(key);
          if (v != null) return JSON.parse(v);
        } catch (e) { /* storage unavailable */ }
        return key in mem ? mem[key] : fallback;
      },
      set: function (key, val) {
        mem[key] = val;
        try { window[kind].setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
      },
      remove: function (key) {
        delete mem[key];
        try { window[kind].removeItem(key); } catch (e) { /* ignore */ }
      }
    };
  }
  ALMA.store = makeStore('localStorage');
  ALMA.session = makeStore('sessionStorage');

  /* ------------------------------------------------------------ demo auth
     PLACEHOLDER: credentials come from data.js and are checked in the
     browser. This is NOT security. Replace with server-side auth. */
  const SESSION_KEY = 'alma.session';
  ALMA.auth = {
    login: function (username, password) {
      const u = (D.auth.users || []).find(function (x) {
        return x.username.toLowerCase() === String(username).trim().toLowerCase() && x.password === password;
      });
      if (!u) return null;
      const s = { username: u.username, name: u.displayName, role: u.role, engineerId: u.engineerId || null, at: Date.now() };
      ALMA.session.set(SESSION_KEY, s);
      return s;
    },
    current: function () { return ALMA.session.get(SESSION_KEY, null); },
    logout: function () { ALMA.session.remove(SESSION_KEY); location.href = 'index.html'; }
  };

  // Page guard: <body data-protected="true"> pages need a session.
  if (body.dataset.protected === 'true') {
    if (!ALMA.auth.current()) {
      ALMA.blocked = true;
      const here = location.pathname.split('/').pop() + location.search + location.hash;
      location.replace('login.html?next=' + encodeURIComponent(here || 'dashboard.html'));
    } else {
      body.classList.add('auth-ok');
    }
  }

  /* --------------------------------------------------------- inbox state */
  ALMA.inboxItems = function () {
    const seed = (D.dashboard.messages || []).map(function (m) {
      return { id: m.id, kind: 'message', from: m.from, subject: m.subject, date: m.date, body: m.body };
    });
    const local = ALMA.store.get('alma.inbox', []).map(function (m) { return Object.assign({ kind: 'request' }, m); });
    const listings = ALMA.store.get('alma.listingRequests', []).map(function (m) {
      return { id: m.id, kind: 'listing', from: m.officeName, subject: 'Directory listing request', date: m.date,
        body: [m.location, (m.specialties || []).join(', '), m.services, m.phone, m.email, m.website].filter(Boolean).join(' | ') };
    });
    return local.concat(listings, seed).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  };
  ALMA.unreadCount = function () {
    const read = ALMA.store.get('alma.readIds', []);
    return ALMA.inboxItems().filter(function (m) { return read.indexOf(m.id) === -1; }).length;
  };

  /* ----------------------------------------------------------- the shell */
  const LOGO = '<svg class="brand-mark" viewBox="0 0 64 56" aria-hidden="true" focusable="false"><path fill="#F26A1B" d="M0 56 24 0h16l24 56H48L32 19 16 56z"/><path fill="#161A23" d="M23 41h18l-9 14z"/></svg>';
  ALMA.logo = LOGO;

  function topLinks(user) {
    const links = [
      { key: 'home', label: 'Home', href: 'index.html' },
      { key: 'services', label: 'Services', href: 'services.html' },
      { key: 'projects', label: 'Projects', href: 'projects.html' },
      { key: 'offices', label: 'Offices', href: 'offices.html' },
      { key: 'engineers', label: 'Engineers', href: 'engineers.html' }
    ];
    if (user) {
      links.push({ key: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'lock' });
      links.push({ key: 'reports', label: 'Reports', href: 'reports.html', icon: 'lock' });
    }
    return links;
  }

  function profileHref(user) {
    if (!user) return 'login.html';
    return user.engineerId ? 'engineer.html?id=' + encodeURIComponent(user.engineerId) : 'dashboard.html';
  }

  function navItems(user) {
    if (body.dataset.nav === 'staff' && user) {
      return [
        { key: 'home', label: 'Home', href: 'dashboard.html', icon: 'home' },
        { key: 'projects', label: 'Projects', href: 'dashboard.html?view=projects', icon: 'folder' },
        { key: 'calendar', label: 'Reports', href: 'reports.html', icon: 'calendar' },
        { key: 'messages', label: 'Messages', href: 'dashboard.html?view=inbox', icon: 'message', badge: ALMA.unreadCount() },
        { key: 'profile', label: 'Profile', href: profileHref(user), icon: 'user' }
      ];
    }
    return [
      { key: 'home', label: 'Home', href: 'index.html', icon: 'home' },
      { key: 'explore', label: 'Explore', href: 'projects.html', icon: 'compass' },
      { key: 'add', label: 'Request', href: 'services.html', icon: 'plus', fab: true },
      { key: 'saved', label: 'Saved', href: 'projects.html?saved=1', icon: 'bookmark' },
      { key: 'profile', label: user ? 'Dashboard' : 'Profile', href: user ? 'dashboard.html' : 'login.html', icon: 'user' }
    ];
  }

  function renderHeader() {
    const host = document.getElementById('app-header');
    if (!host) return;
    const user = ALMA.auth.current();
    const page = body.dataset.page;
    const unread = user ? ALMA.unreadCount() : 0;
    const back = body.dataset.back
      ? '<button type="button" class="icon-btn icon-btn-plain back-btn" data-back-btn aria-label="Go back">' + ALMA.icon('chevronLeft') + '</button>' : '';

    const links = topLinks(user).map(function (l) {
      return '<a href="' + l.href + '"' + (l.key === page ? ' aria-current="page"' : '') + '>' + esc(l.label) + '</a>';
    }).join('');

    let actions = '';
    if (user) {
      actions += '<a class="icon-btn icon-btn-plain" href="dashboard.html?view=inbox" aria-label="Notifications' + (unread ? ', ' + unread + ' unread' : '') + '">' + ALMA.icon('bell') + (unread ? '<span class="dot" aria-hidden="true"></span>' : '') + '</a>';
      actions += '<a class="avatar avatar-sm" href="' + profileHref(user) + '" aria-label="Your profile: ' + esc(user.name) + '">' + esc(ALMA.initials(user.name)) + '</a>';
    } else {
      actions += '<button type="button" class="btn btn-primary btn-sm hide-mobile" data-quote="quote">Request a Quote</button>';
      actions += '<a class="btn btn-ghost btn-sm hide-mobile" href="login.html">Staff login</a>';
    }
    actions += '<button type="button" class="icon-btn icon-btn-plain menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="site-drawer" data-menu-btn>' + ALMA.icon('menu') + '</button>';

    host.innerHTML =
      '<header class="site-header">' +
        '<div class="container header-inner">' + back +
          '<a class="brand" href="index.html" aria-label="ALMA, The soul of spaces: home">' + LOGO +
            '<span class="brand-text"><span class="brand-name">ALMA</span><span class="brand-tag">The soul of spaces</span></span></a>' +
          '<nav class="top-nav" aria-label="Main">' + links + '</nav>' +
          '<div class="header-actions">' + actions + '</div>' +
        '</div>' +
      '</header>' +
      '<div class="drawer-backdrop" data-drawer-close hidden></div>' +
      '<aside class="drawer" id="site-drawer" aria-label="Site menu" hidden>' +
        '<div class="drawer-head"><span class="brand-name">Menu</span>' +
        '<button type="button" class="icon-btn" data-drawer-close aria-label="Close menu">' + ALMA.icon('close') + '</button></div>' +
        '<nav class="drawer-nav" aria-label="Site">' + topLinks(user).map(function (l) {
          return '<a href="' + l.href + '"' + (l.key === page ? ' aria-current="page"' : '') + '>' + esc(l.label) + ALMA.icon('chevronRight') + '</a>';
        }).join('') + '</nav>' +
        '<div class="drawer-foot">' + (user
          ? '<p class="muted small">Signed in as <strong>' + esc(user.name) + '</strong> (' + esc(user.role) + ')</p><button type="button" class="btn btn-ghost btn-block" data-logout>' + ALMA.icon('logout') + 'Log out</button>'
          : '<button type="button" class="btn btn-primary btn-block" data-quote="quote">Request a Quote</button><a class="btn btn-ghost btn-block" href="login.html">Staff login</a>') +
        '</div>' +
      '</aside>';

    // drawer behaviour
    const drawer = host.querySelector('.drawer');
    const backdrop = host.querySelector('.drawer-backdrop');
    const menuBtn = host.querySelector('[data-menu-btn]');
    function openDrawer() {
      drawer.hidden = false; backdrop.hidden = false;
      requestAnimationFrame(function () { drawer.classList.add('open'); });
      menuBtn.setAttribute('aria-expanded', 'true');
      const first = drawer.querySelector('a, button'); if (first) first.focus();
    }
    function closeDrawer() {
      drawer.classList.remove('open'); backdrop.hidden = true; drawer.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus();
    }
    menuBtn.addEventListener('click', openDrawer);
    host.querySelectorAll('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
    drawer.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
    host.querySelectorAll('[data-quote]').forEach(function (b) { b.addEventListener('click', function () { if (!drawer.hidden) closeDrawer(); }); });

    const backBtn = host.querySelector('[data-back-btn]');
    if (backBtn) backBtn.addEventListener('click', function () {
      if (history.length > 1 && document.referrer) history.back();
      else location.href = body.dataset.back;
    });
  }

  function renderBottomNav() {
    const host = document.getElementById('app-bottom-nav');
    if (!host) return;
    const user = ALMA.auth.current();
    const active = body.dataset.tab;
    host.innerHTML = '<nav class="bottom-nav" aria-label="Primary"><ul>' + navItems(user).map(function (it) {
      const cur = it.key === active ? ' aria-current="page"' : '';
      const badge = it.badge ? '<span class="nav-badge" aria-label="' + it.badge + ' unread">' + it.badge + '</span>' : '';
      const ic = it.fab ? '<span class="nav-fab">' + ALMA.icon(it.icon) + '</span>' : ALMA.icon(it.icon);
      return '<li><a href="' + it.href + '" data-tab-key="' + it.key + '"' + cur + '>' + ic + '<span>' + esc(it.label) + '</span>' + badge + '</a></li>';
    }).join('') + '</ul></nav>';
  }
  /** Change which bottom-nav item is highlighted (used by pages with views). */
  ALMA.setTab = function (key) {
    body.dataset.tab = key;
    document.querySelectorAll('.bottom-nav a').forEach(function (a) {
      if (a.dataset.tabKey === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  ALMA.refreshNav = function () { renderBottomNav(); };

  function renderFooter() {
    const host = document.getElementById('app-footer');
    if (!host) return;
    host.innerHTML =
      '<footer class="site-footer"><div class="container footer-inner">' +
        '<div><a class="brand" href="index.html" aria-label="ALMA home">' + LOGO + '<span class="brand-text"><span class="brand-name">ALMA</span><span class="brand-tag">The soul of spaces</span></span></a>' +
        '<p class="muted small footer-note">Finishing engineering and interior execution in ' + esc(D.brand.city) + '.</p></div>' +
        '<nav aria-label="Footer"><ul class="footer-links">' +
          '<li><a href="services.html">Services</a></li><li><a href="projects.html">Projects</a></li>' +
          '<li><a href="offices.html">Office directory</a></li><li><a href="engineers.html">Engineers</a></li>' +
          '<li><a href="login.html">Staff login</a></li></ul></nav>' +
        '<address class="footer-contact"><a href="tel:' + esc(D.brand.phone.replace(/\s/g, '')) + '">' + ALMA.icon('phone') + esc(D.brand.phone) + '</a>' +
          '<a href="mailto:' + esc(D.brand.email) + '">' + ALMA.icon('mail') + esc(D.brand.email) + '</a>' +
          '<span>' + ALMA.icon('clock') + esc(D.brand.hours) + '</span></address>' +
      '</div><div class="container"><p class="muted small copyright">&copy; ' + new Date().getFullYear() + ' ALMA. Placeholder content for demonstration.</p></div></footer>';
  }

  /* ------------------------------------------------------ media placeholder */
  /** Returns an <img> if the item has real images, otherwise a styled placeholder. */
  ALMA.media = function (item, i, opts) {
    i = i || 0; opts = opts || {};
    const imgs = (item && item.images) || [];
    const label = opts.label || ((item && item.title ? item.title : 'Project') + ', image ' + (i + 1));
    const cls = 'media ' + (opts.cls || '');
    if (imgs.length) {
      return '<img class="' + cls + '" src="' + esc(imgs[i % imgs.length]) + '" alt="' + esc(label) + '" loading="lazy">';
    }
    return '<div class="' + cls + ' ph ph-' + esc((item && item.tone) || 'warm') + '" style="--v:' + (i % 6) + '" role="img" aria-label="' + esc(label) + ' (placeholder image)">' +
      '<span class="ph-room" aria-hidden="true"><span class="ph-win"></span><span class="ph-sofa"></span><span class="ph-lamp"></span></span></div>';
  };

  /* ------------------------------------------------------ project card */
  ALMA.projectCard = function (p) {
    const status = p.status === 'in-progress' ? '<span class="badge badge-progress">In progress</span>' : '';
    return '<article class="card project-card">' +
      '<div class="project-card-media">' + ALMA.media(p, 0) + status + '</div>' +
      '<div class="project-card-body">' +
        '<h3 class="card-title"><a class="stretched" href="project.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + '</a></h3>' +
        '<p class="meta">' + esc(p.type) + '<span class="sep" aria-hidden="true">&bull;</span>' + p.area + ' m&sup2;</p>' +
        '<p class="meta meta-icon">' + ALMA.icon('pin') + esc(p.location) + '</p>' +
        '<p class="card-text">' + esc(p.summary) + '</p>' +
        '<ul class="tags" aria-label="Style tags">' + p.tags.map(function (t) { return '<li class="tag">' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="card-foot"><strong class="price">' + esc(ALMA.priceOf(p)) + '</strong>' +
          '<span class="btn btn-primary btn-sm btn-pill" aria-hidden="true">View Details' + ALMA.icon('arrowRight') + '</span></div>' +
      '</div></article>';
  };

  /* ------------------------------------------------------ chip filter
     items: [{value, label, count?}]  ->  accessible toggle buttons */
  ALMA.chips = function (container, items, active, onChange, label) {
    container.classList.add('chip-row');
    container.setAttribute('role', 'group');
    if (label) container.setAttribute('aria-label', label);
    function render() {
      container.innerHTML = items.map(function (it) {
        const on = it.value === active;
        return '<button type="button" class="chip" aria-pressed="' + on + '" data-value="' + esc(it.value) + '">' + esc(it.label) +
          (it.count != null ? ' <span class="chip-count">(' + it.count + ')</span>' : '') + '</button>';
      }).join('');
    }
    render();
    container.addEventListener('click', function (e) {
      const b = e.target.closest('.chip'); if (!b) return;
      active = b.dataset.value; render();
      const again = container.querySelector('[data-value="' + CSS.escape(active) + '"]'); if (again) again.focus();
      onChange(active);
    });
    return { set: function (v, newItems) { active = v; if (newItems) items = newItems; render(); } };
  };

  /* ------------------------------------------------------ toast */
  ALMA.toast = function (msg) {
    let t = document.getElementById('alma-toast');
    if (!t) {
      t = document.createElement('div'); t.id = 'alma-toast'; t.className = 'toast';
      t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 3600);
  };

  /* ------------------------------------------------------ modal (<dialog>) */
  let modalSeq = 0;
  ALMA.modal = function (opts) {
    const id = 'modal-title-' + (++modalSeq);
    const dlg = document.createElement('dialog');
    dlg.className = 'modal';
    dlg.setAttribute('aria-labelledby', id);
    dlg.innerHTML =
      '<form class="modal-form" method="dialog">' +
        '<div class="modal-head"><h2 id="' + id + '">' + esc(opts.title) + '</h2>' +
        '<button type="button" class="icon-btn" data-close aria-label="Close">' + ALMA.icon('close') + '</button></div>' +
        '<div class="modal-body">' + opts.body + '</div>' +
        (opts.onSubmit
          ? '<div class="modal-foot"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button type="submit" class="btn btn-primary">' + esc(opts.submitLabel || 'Submit') + '</button></div>'
          : '<div class="modal-foot"><button type="button" class="btn btn-ghost" data-close>Close</button></div>') +
      '</form>';
    document.body.appendChild(dlg);
    const form = dlg.querySelector('form');
    dlg.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { dlg.remove(); if (opts.onClose) opts.onClose(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!opts.onSubmit) { dlg.close(); return; }
      if (!form.reportValidity()) return;
      const data = {};
      new FormData(form).forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
      if (opts.onSubmit(data, form) !== false) dlg.close();
    });
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    const first = dlg.querySelector('.modal-body input, .modal-body select, .modal-body textarea');
    if (first) first.focus();
    return dlg;
  };

  /* ------------------------------------------------------ quote / visit form */
  function allServices() {
    const out = [];
    D.services.forEach(function (g) { g.items.forEach(function (s) { out.push({ id: s.id, name: s.name, group: g.group }); }); });
    return out;
  }
  ALMA.allServices = allServices;
  const KIND_TITLES = { quote: 'Request a Quote', visit: 'Book a Site Visit', video: 'Book a Video Consultation' };
  ALMA.kindLabel = function (k) { return KIND_TITLES[k] || KIND_TITLES.quote; };

  /** opts: { kind: 'quote'|'visit'|'video', serviceId, projectId, note } */
  ALMA.openQuote = function (opts) {
    opts = opts || {};
    const kind = KIND_TITLES[opts.kind] ? opts.kind : 'quote';
    const project = opts.projectId ? ALMA.byId(D.projects, opts.projectId) : null;
    const today = ALMA.iso(new Date());
    const services = allServices();
    const scheduled = kind !== 'quote';
    const html =
      (project ? '<p class="form-context">' + ALMA.icon('image') + 'Inspired by: <strong>' + esc(project.title) + '</strong></p>' : '') +
      '<div class="form-grid">' +
        field('q-name', 'Full name', '<input id="q-name" name="name" autocomplete="name" required>') +
        field('q-phone', 'Phone / WhatsApp', '<input id="q-phone" name="phone" type="tel" autocomplete="tel" required pattern="\\+?[0-9 ]{7,}">') +
        field('q-email', 'Email (optional)', '<input id="q-email" name="email" type="email" autocomplete="email">') +
        field('q-service', 'Service', '<select id="q-service" name="service" required>' + groupOptions(services, opts.serviceId) + '</select>') +
        field('q-location', 'Site location', '<input id="q-location" name="location" placeholder="e.g. Smouha, Alexandria" required>') +
        field('q-area', 'Area (m²)', '<input id="q-area" name="area" type="number" min="1" inputmode="numeric" value="' + esc(opts.area || '') + '">') +
        (scheduled
          ? field('q-date', kind === 'video' ? 'Preferred call date' : 'Preferred visit date', '<input id="q-date" name="date" type="date" min="' + today + '" required>') +
            field('q-time', 'Preferred time', '<select id="q-time" name="time"><option>Morning (9 to 12)</option><option>Afternoon (12 to 4)</option><option>Evening (4 to 7)</option></select>')
          : field('q-budget', 'Budget range', '<select id="q-budget" name="budget"><option value="">Not sure yet</option><option>Under EGP 500K</option><option>EGP 500K - 1M</option><option>EGP 1M - 2M</option><option>EGP 2M - 3.5M</option><option>Above EGP 3.5M</option></select>')) +
        field('q-msg', 'Tell us about your space', '<textarea id="q-msg" name="message" rows="3">' + esc(opts.note || '') + '</textarea>', true) +
      '</div>' +
      '<p class="muted small form-note">Demo form: your request is saved in this browser only and appears in the staff inbox. Connect it to email or a CRM before launch.</p>';
    ALMA.modal({
      title: KIND_TITLES[kind],
      body: html,
      submitLabel: kind === 'quote' ? 'Send request' : 'Book',
      onSubmit: function (d) {
        const svc = ALMA.byId(services, d.service);
        const list = ALMA.store.get('alma.inbox', []);
        list.unshift({
          id: 'q' + Date.now(), date: ALMA.iso(new Date()) + ' ' + new Date().toTimeString().slice(0, 5),
          from: d.name, subject: KIND_TITLES[kind] + ': ' + (svc ? svc.name : 'General'),
          body: [d.location, d.area ? d.area + ' m²' : '', d.budget, d.date ? 'Preferred ' + d.date + ' ' + (d.time || '') : '',
            project ? 'Project: ' + project.title : '', d.phone, d.email, d.message].filter(Boolean).join(' | ')
        });
        ALMA.store.set('alma.inbox', list);
        ALMA.toast(kind === 'quote' ? 'Thanks ' + d.name + '. Your request was sent. We will contact you shortly.' : 'Thanks ' + d.name + '. Your booking request was sent. We will confirm the time with you.');
      }
    });
  };
  function field(id, label, control, wide) {
    return '<div class="field' + (wide ? ' field-wide' : '') + '"><label for="' + id + '">' + esc(label) + '</label>' + control + '</div>';
  }
  ALMA.field = field;
  function groupOptions(services, selected) {
    let html = '', group = '';
    services.forEach(function (s) {
      if (s.group !== group) { if (group) html += '</optgroup>'; group = s.group; html += '<optgroup label="' + esc(group) + '">'; }
      html += '<option value="' + esc(s.id) + '"' + (s.id === selected ? ' selected' : '') + '>' + esc(s.name) + '</option>';
    });
    return html + '</optgroup>';
  }

  // Any element with data-quote opens the form: data-quote="quote|visit|video" data-service data-project
  document.addEventListener('click', function (e) {
    const t = e.target.closest('[data-quote]');
    if (t) { e.preventDefault(); ALMA.openQuote({ kind: t.dataset.quote, serviceId: t.dataset.service, projectId: t.dataset.project }); return; }
    if (e.target.closest('[data-logout]')) { e.preventDefault(); ALMA.auth.logout(); }
  });

  /* ------------------------------------------------------ saved projects */
  ALMA.saved = {
    list: function () { return ALMA.store.get('alma.saved', []); },
    has: function (id) { return ALMA.saved.list().indexOf(id) !== -1; },
    toggle: function (id) {
      const l = ALMA.saved.list(); const i = l.indexOf(id);
      if (i === -1) l.push(id); else l.splice(i, 1);
      ALMA.store.set('alma.saved', l); return i === -1;
    }
  };

  /* ------------------------------------------------------ CSV export */
  ALMA.downloadCSV = function (rows, filename) {
    const csv = rows.map(function (r) {
      return r.map(function (c) {
        const s = c == null ? '' : String(c);
        return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(',');
    }).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }); // BOM so Excel reads UTF-8
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };

  /* ------------------------------------------------------ boot */
  if (!ALMA.blocked) {
    renderHeader();
    renderBottomNav();
    renderFooter();
    ALMA.hydrateIcons();
  }
})();
