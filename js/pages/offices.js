/* ALMA | Office directory: search, city + specialty filters, listing request form */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data, esc = A.esc;

  const search = document.getElementById('office-search');
  const city = document.getElementById('office-city');
  const spec = document.getElementById('office-specialty');

  const cities = Array.from(new Set(D.offices.map(function (o) { return o.city; }))).sort();
  city.innerHTML = '<option value="">All cities</option>' + cities.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
  spec.innerHTML = '<option value="">All specialties</option>' + D.officeSpecialties.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');

  function card(o) {
    const contacts = [];
    if (o.phone) contacts.push('<a class="btn btn-ghost btn-sm" href="tel:' + esc(o.phone.replace(/\s/g, '')) + '" aria-label="Call ' + esc(o.name) + ' on ' + esc(o.phone) + '">' + A.icon('phone') + 'Call</a>');
    if (o.email) contacts.push('<a class="btn btn-ghost btn-sm" href="mailto:' + esc(o.email) + '" aria-label="Email ' + esc(o.name) + '">' + A.icon('mail') + 'Email</a>');
    if (o.website) contacts.push('<a class="btn btn-ghost btn-sm" href="' + esc(o.website) + '" target="_blank" rel="noopener noreferrer nofollow" aria-label="Website of ' + esc(o.name) + ' (opens in a new tab)">' + A.icon('globe') + 'Website</a>');
    return '<article class="card office-card">' +
      '<div class="office-head"><span class="office-logo" aria-hidden="true">' + esc(A.initials(o.name.replace(/^Sample\s+/i, ''))) + '</span>' +
        '<div><h3>' + esc(o.name) + '</h3><p class="meta meta-icon">' + A.icon('pin') + esc(o.location) + '</p>' +
        (o.sample ? '<span class="badge badge-sample">Sample listing</span>' : '') + '</div></div>' +
      '<div class="kv"><span>Specialties</span><ul class="tags">' + o.specialties.map(function (s) { return '<li class="tag">' + esc(s) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="kv"><span>Services offered</span><p>' + esc(o.services.join(', ')) + '</p></div>' +
      '<div class="kv"><span>Contact</span><p class="small">' + esc([o.phone, o.email].filter(Boolean).join(' | ')) + '</p></div>' +
      '<div class="contact-row">' + contacts.join('') + '</div></article>';
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const list = D.offices.filter(function (o) {
      const hay = [o.name, o.location, o.city].concat(o.specialties, o.services).join(' ').toLowerCase();
      return (!q || q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; })) &&
        (!city.value || o.city === city.value) &&
        (!spec.value || o.specialties.indexOf(spec.value) !== -1);
    }).sort(function (a, b) { return a.name.localeCompare(b.name); }); // neutral alphabetical order
    document.getElementById('office-count').textContent = list.length + (list.length === 1 ? ' office' : ' offices');
    document.getElementById('office-list').innerHTML = list.length ? list.map(card).join('')
      : '<div class="card empty" style="grid-column:1/-1">' + A.icon('building') + '<h3>No offices match</h3><p>Try another city or specialty.</p></div>';
  }
  search.addEventListener('input', A.debounce(render, 150));
  city.addEventListener('change', render);
  spec.addEventListener('change', render);
  render();

  // Listing request form
  document.getElementById('l-specialties').innerHTML = D.officeSpecialties.map(function (s, i) {
    return '<label class="check"><input type="checkbox" name="specialties" value="' + esc(s) + '" id="ls-' + i + '">' + esc(s) + '</label>';
  }).join('');
  const form = document.getElementById('listing-form');
  const err = document.getElementById('listing-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const specs = fd.getAll('specialties');
    if (!specs.length) { err.textContent = 'Please choose at least one specialty.'; err.hidden = false; return; }
    const req = {
      id: 'l' + Date.now(), date: A.iso(new Date()) + ' ' + new Date().toTimeString().slice(0, 5),
      officeName: fd.get('officeName').trim(), contactPerson: fd.get('contactPerson').trim(), phone: fd.get('phone').trim(),
      email: fd.get('email').trim(), location: fd.get('location').trim(), website: (fd.get('website') || '').trim(),
      specialties: specs, services: fd.get('services').trim()
    };
    const list = A.store.get('alma.listingRequests', []); list.unshift(req);
    A.store.set('alma.listingRequests', list);
    form.reset();
    A.toast('Thanks. Your listing request was sent for review.');
  });
})();
