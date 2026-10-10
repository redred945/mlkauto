/* MLK Auto - mobile.js (vanilla). Couche UX mobile, chargee apres app.js : <script src="/assets/js/mobile.js" defer></script>
   - barre d'action collante (Appeler / Devis / RDV) sous 48em, safe-area iOS, masquee clavier ouvert / menu ouvert
     (aucun WhatsApp : pas de numero WhatsApp confirme)
   - menu plein ecran : verrouillage du scroll sans saut, fermeture par tap hors des liens, appel + adresse dans le menu
   - pastilles de position pour les carrousels scroll-snap
   - lightbox : swipe gauche/droite, glisser vers le bas pour fermer, pincer pour zoomer, double tap
   - formulaire contact : preselection du besoin via ?besoin=
   - pied de page : lien Itineraire (ouvre l'appli Plans / Maps)
   Les styles sont dans le bloc "mobile-ux" en fin de site.css. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mqMobile = window.matchMedia('(max-width: 47.999em)');
  var TEL = '+33652441795', TEL_TXT = '06 52 44 17 95';
  var path = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  var MAPS = 'https://www.google.com/maps/search/?api=1&query=28+chemin+des+Closeaux+94440+Villecresnes';

  /* ---------- 1. Barre d'action collante ---------- */
  var NEEDS = { '/film-solaire/': 'Film solaire', '/film-solaire/simulateur/': 'Film solaire', '/total-covering/': 'Total covering', '/film-de-protection/': 'Film de protection', '/protection-pare-brise/': 'Pare-brise' };
  var ICON = {
    tel: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>',
    devis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    rdv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
  };
  var bar = null;
  function buildBar() {
    var need = NEEDS[path];
    var devisHref = '/contact/' + (need ? '?besoin=' + encodeURIComponent(need) : '') + '#contact-form';
    var onContact = path === '/contact/', onRdv = path === '/prendre-rdv/';
    var html = '<a class="m-bar__btn m-bar__btn--call" href="tel:' + TEL + '" aria-label="Appeler MLK Auto au ' + TEL_TXT + '">' + ICON.tel + '<span>Appeler</span></a>';
    if (!onContact) html += '<a class="m-bar__btn" href="' + devisHref + '">' + ICON.devis + '<span>Devis</span></a>';
    if (!onRdv) html += '<a class="m-bar__btn" href="/prendre-rdv/">' + ICON.rdv + '<span>RDV</span></a>';
    bar = document.createElement('nav');
    bar.className = 'm-bar';
    bar.setAttribute('aria-label', 'Actions rapides');
    bar.innerHTML = html;
    document.body.appendChild(bar);
    root.classList.add('has-mbar');
    var isHome = path === '/';
    var kb = false;
    function update() {
      var show = !isHome || (window.scrollY || window.pageYOffset) > window.innerHeight * 0.55;
      bar.classList.toggle('is-visible', show && !kb && !root.classList.contains('menu-open'));
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    /* clavier ouvert : la barre quitterait la zone utile et mangerait l'ecran */
    document.addEventListener('focusin', function (e) { if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) { kb = true; update(); } });
    document.addEventListener('focusout', function () { setTimeout(function () { var a = document.activeElement; kb = !!(a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)); update(); }, 50); });
    new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['class'] });
    update();
  }
  buildBar();

  /* ---------- 2. Menu plein ecran ---------- */
  var nav = $('#site-nav'), toggle = $('.nav__toggle');
  if (nav && toggle) {
    var extra = document.createElement('div');
    extra.className = 'nav__extra';
    extra.innerHTML = '<a class="btn btn--ghost nav__call" href="tel:' + TEL + '">Appeler le ' + TEL_TXT + '</a>' +
      '<p class="nav__meta">28 chemin des Closeaux, 94440 Villecresnes<br>Lundi – samedi, 10:00 – 18:00 · <a href="' + MAPS + '" target="_blank" rel="noopener">Itinéraire</a></p>';
    nav.appendChild(extra);

    var lockY = 0, locked = false;
    var inertEls = function () { return $$('main, footer.site-footer, .m-bar'); };
    function lock() {
      if (locked) return; locked = true;
      lockY = window.scrollY || window.pageYOffset;
      document.body.style.cssText += ';position:fixed;top:' + (-lockY) + 'px;left:0;right:0;width:100%;';
      inertEls().forEach(function (el) { el.inert = true; });
    }
    function unlock() {
      if (!locked) return; locked = false;
      var b = document.body;
      b.style.position = ''; b.style.top = ''; b.style.left = ''; b.style.right = ''; b.style.width = '';
      inertEls().forEach(function (el) { el.inert = false; });
      var prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto';
      window.scrollTo(0, lockY);
      root.style.scrollBehavior = prev;
    }
    new MutationObserver(function () { if (root.classList.contains('menu-open')) lock(); else unlock(); })
      .observe(root, { attributes: true, attributeFilter: ['class'] });
    /* tap sur le fond (hors liens/boutons) : ferme */
    nav.addEventListener('click', function (e) {
      if (e.target === nav || e.target === extra || e.target.classList.contains('nav__list') || e.target.classList.contains('nav__meta')) {
        if (toggle.getAttribute('aria-expanded') === 'true') toggle.click();
      }
    });
    /* le lien de la page courante ferme le menu aussi (sinon il reste ouvert) */
    $$('a[href]', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        var u = a.getAttribute('href');
        if (u && u.charAt(0) === '/' && a.pathname === location.pathname && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
      });
    });
  }

  /* ---------- 3. Pastilles de position des carrousels ---------- */
  var SNAP = ['#services .auto-grid', '.reviews', '#realisations .gallery', '.auto-grid'];
  var seen = [];
  $$(SNAP.join(',')).forEach(function (el) {
    if (seen.indexOf(el) > -1) return;
    seen.push(el);
    var isCarousel = el.matches('#services .auto-grid, .reviews, #realisations .gallery') || !!$('.service-card', el);
    if (!isCarousel) return;
    el.classList.add('m-snap');
    var n = el.children.length;
    if (n < 2) return;
    var dots = document.createElement('div');
    dots.className = 'm-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < n; i++) dots.appendChild(document.createElement('span'));
    el.parentNode.insertBefore(dots, el.nextSibling);
    var ticking = false;
    function upd() {
      ticking = false;
      var max = el.scrollWidth - el.clientWidth;
      var idx = max > 0 ? Math.round(el.scrollLeft / max * (n - 1)) : 0;
      Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('is-on', k === idx); });
    }
    el.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  });

  /* ---------- 4. Lightbox : swipe, pinch, double tap ---------- */
  function enhanceLightbox(dlg) {
    var img = $('.lightbox__fig img', dlg);
    var nextB = $('.lightbox__next', dlg), prevB = $('.lightbox__prev', dlg), closeB = $('.lightbox__close', dlg);
    if (!img || dlg.__mobile) return;
    dlg.__mobile = true;
    var pts = {}, scale = 1, tx = 0, ty = 0, startDist = 0, startScale = 1, sx = 0, sy = 0, dx = 0, dy = 0, lastTap = 0, moved = false;
    function apply(anim) {
      img.style.transition = anim ? 'transform .2s ease-out' : 'none';
      img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    }
    function reset(anim) { scale = 1; tx = 0; ty = 0; dx = 0; dy = 0; apply(anim); }
    function count() { return Object.keys(pts).length; }
    function dist() { var k = Object.keys(pts); var a = pts[k[0]], b = pts[k[1]]; return Math.hypot(a.x - b.x, a.y - b.y); }
    img.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      img.setPointerCapture(e.pointerId);
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      moved = false;
      if (count() === 2) { startDist = dist(); startScale = scale; }
      else { sx = e.clientX; sy = e.clientY; dx = 0; dy = 0; }
    });
    img.addEventListener('pointermove', function (e) {
      var p = pts[e.pointerId]; if (!p) return;
      var ox = p.x, oy = p.y; p.x = e.clientX; p.y = e.clientY;
      if (Math.abs(e.clientX - sx) > 6 || Math.abs(e.clientY - sy) > 6) moved = true;
      if (count() === 2) {
        scale = Math.min(4, Math.max(1, startScale * dist() / startDist));
        if (scale === 1) { tx = 0; ty = 0; }
        apply(false);
      } else if (scale > 1) {
        tx += e.clientX - ox; ty += e.clientY - oy; apply(false);
      } else {
        dx = e.clientX - sx; dy = e.clientY - sy;
        if (Math.abs(dx) > Math.abs(dy)) { tx = dx; ty = 0; } else { tx = 0; ty = Math.max(0, dy); }
        apply(false);
      }
    });
    function end(e) {
      if (!pts[e.pointerId]) return;
      var wasTwo = count() === 2;
      delete pts[e.pointerId];
      if (wasTwo) { if (scale < 1.05) reset(true); return; }
      if (scale > 1) {
        if (!moved) { var now = Date.now(); if (now - lastTap < 320) reset(true); lastTap = now; }
        return;
      }
      var ax = Math.abs(dx), ay = Math.abs(dy);
      if (!moved) {
        var t = Date.now();
        if (t - lastTap < 320) { scale = 2.5; tx = 0; ty = 0; apply(true); lastTap = 0; }
        else { lastTap = t; reset(true); }
        return;
      }
      if (ax > 60 && ax > ay) { var goNext = dx < 0; reset(false); (goNext ? nextB : prevB).click(); }
      else if (ay > 90 && ay > ax) { reset(false); closeB.click(); }
      else reset(true);
    }
    img.addEventListener('pointerup', end);
    img.addEventListener('pointercancel', end);
    [nextB, prevB].forEach(function (b) { b.addEventListener('click', function () { reset(false); }); });
    dlg.addEventListener('close', function () { reset(false); });
  }
  var existing = $('.lightbox'); if (existing) enhanceLightbox(existing);
  new MutationObserver(function (list) {
    list.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1 && n.classList.contains('lightbox')) enhanceLightbox(n); }); });
  }).observe(document.body, { childList: true });

  /* ---------- 5. Formulaire contact : besoin preselectionne ---------- */
  var need = $('#f-need');
  if (need) {
    var want = new URLSearchParams(location.search).get('besoin');
    if (want) $$('option', need).forEach(function (o) { if (o.textContent.trim() === want) need.value = o.value || o.textContent.trim(); });
    var msg = $('#f-msg'); if (msg) msg.setAttribute('autocapitalize', 'sentences');
    var nm = $('#f-name'); if (nm) nm.setAttribute('autocapitalize', 'words');
    [['f-name', 'next'], ['f-email', 'next'], ['f-tel', 'next']].forEach(function (p) { var el = document.getElementById(p[0]); if (el) el.setAttribute('enterkeyhint', p[1]); });
  }

  /* ---------- 6. Pied de page : itineraire ---------- */
  $$('.site-footer address').forEach(function (addr) {
    if (!/Closeaux/.test(addr.textContent) || $('.m-route', addr.parentNode)) return;
    var a = document.createElement('a');
    a.className = 'link-arrow m-route'; a.href = MAPS; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = 'Itinéraire<span class="sr-only"> (nouvel onglet)</span>';
    addr.parentNode.insertBefore(a, addr.nextSibling);
  });
})();
