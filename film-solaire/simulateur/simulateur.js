/* Simulateur de teintes MLK Auto.
   Donnees reprises a l'identique du simulateur du site actuel (mlkauto.fr/film-solaire/simulateur/,
   plugin tint-simulator : slider-av.js / slider-ar.js). Cle = teinte (%) ; opacite du calque = teinte / 100. */
(function () {
  'use strict';
  var DATA = {
    '0':  { tlv: 92, uv: 30,   heat: 6 },
    '20': { tlv: 80, uv: 99.5, heat: 30 },
    '25': { tlv: 75, uv: 99.5, heat: 40 },
    '30': { tlv: 70, uv: 99.5, heat: 40 },
    '50': { tlv: 50, uv: 99.5, heat: 48 },
    '65': { tlv: 35, uv: 99.5, heat: 53 },
    '75': { tlv: 25, uv: 99.5, heat: 54 },
    '85': { tlv: 15, uv: 99.5, heat: 56 },
    '95': { tlv: 5,  uv: 99.5, heat: 62 }
  };
  var fmt = function (n) { return String(n).replace('.', ','); };
  function checked(side) { return document.querySelector('input[name="' + side + '"]:checked').value; }
  function label(side) { var c = checked(side); return c === '0' ? 'sans film' : 'teinte ' + c + ' %'; }
  function bind(side) {
    var film = document.getElementById('film-' + side);
    var radios = document.querySelectorAll('input[name="' + side + '"]');
    function update() {
      var v = checked(side);
      var d = DATA[v];
      film.style.opacity = Number(v) / 100;
      document.getElementById(side + '-tlv').textContent = fmt(d.tlv);
      document.getElementById(side + '-uv').textContent = fmt(Math.floor(d.uv)); /* 99,5 -> 99 : alignement sur « jusqu'à 99 % » du reste du site (donnee source : 99,5) */
      document.getElementById(side + '-heat').textContent = fmt(d.heat);
      document.getElementById('sim-car').setAttribute('aria-label',
        'Voiture vue de profil : vitres avant ' + label('av') + ', vitres arrière ' + label('ar'));
    }
    Array.prototype.forEach.call(radios, function (r) { r.addEventListener('change', update); });
    update();
  }
  bind('av'); bind('ar');
})();
