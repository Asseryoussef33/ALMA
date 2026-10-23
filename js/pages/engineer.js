/* ALMA | Engineer profile: details, current projects, completed projects */
(function () {
  'use strict';
  const A = window.ALMA, D = A.data, esc = A.esc;
  const host = document.getElementById('engineer-profile');
  const e = A.byId(D.engineers, A.param('id'));
  const user = A.auth.current();

  if (user && document.body.dataset.nav === 'public' && user.engineerId === (e && e.id)) A.setTab('profile');
  else A.setTab('explore');

  if (!e) {
    host.innerHTML = '<div class="card empty">' + A.icon('user') + '<h3>Engineer not found</h3><p><a class="text-link" href="engineers.html">Back to engineers</a></p></div>';
    return;
  }
  document.title = e.name + ' | ALMA Engineers';
  const done = D.projects.filter(function (p) { return p.engineerId === e.id && p.status === 'completed'; });
  const ongoing = D.projects.filter(function (p) { return p.engineerId === e.id && p.status === 'in-progress'; });
  const isMe = user && user.engineerId === e.id;

  host.innerHTML =
    '<section class="card profile-hero" aria-labelledby="eng-name">' +
      '<div class="profile-top"><span class="avatar avatar-lg">' + (e.photo ? '<img src="' + esc(e.photo) + '" alt="Photo of ' + esc(e.name) + '">' : '<span aria-hidden="true">' + esc(A.initials(e.name)) + '</span>') + '</span>' +
        '<div><h1 id="eng-name">' + esc(e.name) + '</h1><p class="muted">' + esc(e.role) + ' <span aria-hidden="true">&bull;</span> ' + esc(e.discipline) + '</p>' +
        (e.sample ? '<span class="badge badge-sample">Sample profile</span>' : '') + '</div></div>' +
      '<div class="stack">' +
        '<div class="stats-3"><div class="stat-box"><strong>' + e.years + '</strong><span>Years exp.</span></div>' +
          '<div class="stat-box"><strong>' + done.length + '</strong><span>Completed</span></div>' +
          '<div class="stat-box"><strong>' + e.currentProjects.length + '</strong><span>Current</span></div></div>' +
        '<div class="contact-row">' +
          (e.phone ? '<a class="btn btn-ghost btn-sm" href="tel:' + esc(e.phone.replace(/\s/g, '')) + '">' + A.icon('phone') + 'Call</a>' : '') +
          (e.email ? '<a class="btn btn-primary btn-sm" href="mailto:' + esc(e.email) + '?subject=' + encodeURIComponent('Enquiry via ALMA website') + '">' + A.icon('mail') + 'Contact</a>' : '') +
          (isMe ? '<button type="button" class="btn btn-outline btn-sm" data-logout>' + A.icon('logout') + 'Log out</button>' : '') +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="card card-pad" aria-labelledby="about-h"><h2 id="about-h" style="font-size:18px;margin-bottom:8px">About</h2>' +
      '<p class="muted">' + esc(e.bio) + '</p>' +
      '<h3 style="font-size:15px;margin:16px 0 8px">Specialties</h3><ul class="tags">' + e.specialties.map(function (s) { return '<li class="tag">' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<h3 style="font-size:15px;margin:16px 0 4px">Current projects</h3>' +
      (e.currentProjects.length ? '<ul class="list-plain">' + e.currentProjects.map(function (c) { return '<li>' + A.icon('hardhat') + esc(c) + '</li>'; }).join('') + '</ul>'
        : '<p class="muted">Available for new projects.</p>') +
    '</section>' +

    '<section aria-labelledby="done-h"><div class="section-head"><h2 id="done-h">Completed projects</h2></div>' +
      (done.length ? '<div class="card-list grid-2">' + done.map(A.projectCard).join('') + '</div>'
        : '<div class="card empty">' + A.icon('folder') + '<h3>No completed projects listed yet</h3></div>') +
    '</section>' +
    (ongoing.length ? '<section aria-labelledby="on-h"><div class="section-head"><h2 id="on-h">In progress</h2></div><div class="card-list grid-2">' + ongoing.map(A.projectCard).join('') + '</div></section>' : '');
})();
