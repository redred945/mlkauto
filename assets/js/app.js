/* MLK Auto - app.js (vanilla). Charger avec <script src="/assets/js/app.js" defer></script>.
   Ajoute : html.js, html.is-ready, reveal (.reveal -> .is-in), header au scroll,
   menu mobile accessible, compteurs ([data-count]), FAQ animee, FAB appel.
   prefers-reduced-motion : aucun compteur, reveals visibles d'emblee. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Reveal + .sweep + compteurs : un seul observateur, declenche une seule fois */
  function onceInView(els, cb, threshold) {
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); }
      });
    }, { threshold: threshold || 0.15, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  onceInView($$('.reveal, .sweep'), function (el) { el.classList.add('is-in'); });

  /* Compteurs : la valeur finale reste dans le HTML ; on anime seulement si le mouvement est permis */
  if (!reduce) {
    onceInView($$('[data-count]'), function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(end)) return;
      var prefix = el.getAttribute('data-prefix') || '';
      var final = el.textContent;
      var start = null, dur = 1400;
      function tick(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(end * eased).toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
      }
      requestAnimationFrame(tick);
    }, 0.5);
  }

  /* Header au scroll + FAB */
  var header = $('.site-header');
  var fab = $('.fab-call');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (fab) fab.classList.toggle('is-visible', y > 200);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Menu mobile : aria-expanded, focus piege, Echap, fermeture au clic sur un lien */
  var toggle = $('.nav__toggle');
  var nav = $('#site-nav');
  if (toggle && nav) {
    var mq = window.matchMedia('(min-width: 64em)');
    var focusables = function () {
      return [toggle].concat($$('a[href]', nav)).filter(function (el) { return el.offsetParent !== null || el === toggle; });
    };
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      root.classList.toggle('menu-open', open);
      if (header) header.classList.toggle('is-open', open);
      if (open) { var first = $('a[href]', nav); if (first) first.focus(); } else { toggle.focus({ preventScroll: true }); }
    };
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    toggle.addEventListener('click', function () { setOpen(!isOpen()); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'Tab') {
        var f = focusables(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { if (isOpen()) { root.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); } }); });
    var onMq = function () { if (mq.matches && isOpen()) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);
  }

  /* FAQ : <details> avec ouverture animee (le contenu est deja dans .faq__body > .faq__inner) */
  $$('.faq__item').forEach(function (d) {
    var sum = $('summary', d);
    if (d.open) d.classList.add('is-open');
    if (!sum || reduce) { d.addEventListener('toggle', function () { d.classList.toggle('is-open', d.open); }); return; }
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.open) {
        d.classList.remove('is-open');
        setTimeout(function () { d.open = false; }, 280);
      } else {
        d.open = true;
        requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('is-open'); }); });
      }
    });
  });

  /* Pret : declenche le reflet du hero une fois la page chargee */
  function ready() { root.classList.add('is-ready'); }
  if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
})();
