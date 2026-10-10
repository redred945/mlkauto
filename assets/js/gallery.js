/* MLK Auto - gallery.js (vanilla). Lightbox accessible pour .gallery.
   Charger apres app.js : <script src="/assets/js/gallery.js" defer></script>
   Chaque .gallery__item contient un <button class="gallery__btn"> avec <img> et un <figcaption>.
   <dialog> modal : Echap ferme, fleches gauche/droite, Tab piege entre Precedent / Suivant / Fermer,
   le focus revient sur la vignette d'origine. */
(function () {
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  if (!items.length || typeof HTMLDialogElement === 'undefined') return;

  var idx = 0, opener = null;
  var dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Visionneuse de photos');
  dlg.innerHTML =
    '<div class="lightbox__stage">' +
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Fermer">Fermer</button>' +
    '<figure class="lightbox__fig"><img alt="" src=""><figcaption class="lightbox__cap"><span class="lightbox__text"></span><span class="lightbox__count" aria-live="polite"></span></figcaption></figure>' +
    '<div class="lightbox__bar">' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Photo précédente">&larr;<span class="sr-only"> Précédente</span></button>' +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Photo suivante">&rarr;<span class="sr-only"> Suivante</span></button>' +
    '</div></div>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector('img');
  var text = dlg.querySelector('.lightbox__text');
  var count = dlg.querySelector('.lightbox__count');
  var closeBtn = dlg.querySelector('.lightbox__close');
  var prevBtn = dlg.querySelector('.lightbox__prev');
  var nextBtn = dlg.querySelector('.lightbox__next');

  function show(i) {
    idx = (i + items.length) % items.length;
    var src = items[idx].querySelector('img');
    var cap = items[idx].querySelector('figcaption');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    text.textContent = cap ? cap.textContent : '';
    count.textContent = (idx + 1) + ' / ' + items.length;
  }
  function open(i, from) {
    opener = from;
    show(i);
    if (dlg.showModal) dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () {
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  });

  items.forEach(function (it, i) {
    var b = it.querySelector('.gallery__btn');
    if (b) b.addEventListener('click', function () { open(i, b); });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(idx - 1); });
  nextBtn.addEventListener('click', function () { show(idx + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });

  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') {
      var f = [closeBtn, prevBtn, nextBtn].filter(function (el) { return el.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
