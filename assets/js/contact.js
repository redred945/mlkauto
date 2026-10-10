/* MLK Auto - contact.js. Validation accessible du formulaire #contact-form.
   ENVOI NON BRANCHE : a la validation, on affiche seulement l'etat de succes (aucune donnee transmise).
   Pour brancher (Web3Forms ou autre) : remplacer le bloc "BRANCHER ICI" par un fetch(form.action, ...). */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var summary = document.getElementById('form-summary');
  var success = document.getElementById('form-success');
  var labels = { name: 'Prénom et nom', email: 'E-mail', tel: 'Téléphone', need: 'Votre besoin', message: 'Votre projet' };
  var fields = ['f-name', 'f-email', 'f-tel', 'f-need', 'f-msg'].map(function (id) { return document.getElementById(id); });

  function check(el) {
    var v = el.value.trim();
    if (!v) return el.tagName === 'SELECT' ? 'Choisissez un besoin dans la liste.' : 'Ce champ est obligatoire.';
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.';
    if (el.type === 'tel' && !/^(?:\+|00)?[0-9][0-9 .\-]{7,17}[0-9]$/.test(v)) return 'Saisissez un numéro de téléphone valide, par exemple 06 12 34 56 78.';
    return '';
  }
  function setError(el, msg) {
    var err = document.getElementById(el.id + '-err');
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (!err) return;
    err.textContent = msg;
    err.hidden = !msg;
  }
  fields.forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value || el.getAttribute('aria-invalid') === 'true') setError(el, check(el)); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') setError(el, check(el)); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var errors = [];
    fields.forEach(function (el) {
      var msg = check(el);
      setError(el, msg);
      if (msg) errors.push(el);
    });
    if (errors.length) {
      summary.innerHTML = '<strong>' + (errors.length > 1 ? errors.length + ' champs à corriger' : '1 champ à corriger') + '</strong><ul></ul>';
      var ul = summary.querySelector('ul');
      errors.forEach(function (el) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + el.id;
        a.textContent = labels[el.name] + ' : ' + document.getElementById(el.id + '-err').textContent;
        a.addEventListener('click', function (ev) { ev.preventDefault(); el.focus(); });
        li.appendChild(a); ul.appendChild(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }
    summary.hidden = true;
    /* BRANCHER ICI : envoyer new FormData(form) vers form.action (Web3Forms : ajouter access_key fournie par Reda). */
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();
