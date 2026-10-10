/* MLK Auto - splash.js : pilote l'ecran d'ouverture (classe html.splash-on posee par le script inline du <head>).
   Skip au clic / tap / Echap ; nettoyage a la fin de la sequence ; garde-fou 3 s. Aucun piege de focus. */
(function () {
  'use strict';
  var root = document.documentElement;
  var el = document.querySelector('.splash');
  if (!el || !root.classList.contains('splash-on')) return;
  var ended = false;
  function end() {
    if (ended) return; ended = true;
    el.classList.add('is-done');
    root.classList.remove('splash-on');
    el.parentNode && el.parentNode.removeChild(el);
    document.removeEventListener('keydown', onKey);
  }
  function skip() { if (ended) return; el.classList.add('is-skip'); setTimeout(end, 300); }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Esc') skip(); }
  el.addEventListener('click', skip);
  el.addEventListener('touchstart', skip, { passive: true });
  document.addEventListener('keydown', onKey);
  var panel = el.querySelector('.splash__panel');
  if (panel) panel.addEventListener('animationend', function (e) { if (e.animationName === 'splash-exit') end(); });
  setTimeout(end, 1900);
  setTimeout(end, 3000);
})();
