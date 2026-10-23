/* ALMA | Login (DEMO ONLY: replace with real authentication, see README) */
(function () {
  'use strict';
  const A = window.ALMA;
  const form = document.getElementById('login-form');
  const err = document.getElementById('login-error');

  // Only allow redirects to our own pages (no open redirects)
  const raw = A.param('next') || '';
  const next = /^(dashboard|reports)\.html([?#].*)?$/.test(raw) ? raw : 'dashboard.html';

  if (A.auth.current()) {
    form.insertAdjacentHTML('beforebegin', '<div class="notice">' + A.icon('check') + '<span>You are already signed in. <a class="text-link" href="' + next + '">Go to dashboard</a></span></div>');
  }
  if (raw) {
    form.insertAdjacentHTML('beforebegin', '<div class="notice">' + A.icon('lock') + '<span>Please log in to view that page.</span></div>');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    if (!form.reportValidity()) return;
    const s = A.auth.login(form.username.value, form.password.value);
    if (!s) {
      err.textContent = 'Username or password is incorrect.';
      err.hidden = false;
      form.password.value = '';
      form.password.focus();
      return;
    }
    location.href = next;
  });
})();
