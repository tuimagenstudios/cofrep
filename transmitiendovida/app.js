/* Transmitiendo Vida · boceto bordó
   Las fechas de los lugares de reunión y de las reuniones especiales se leen de la planilla
   «Transmitiendo Vida · Agenda de reuniones (web)», pestaña Agenda (la misma de la web actual). */
(function () {
  'use strict';
  var SHEET_ID = '1v6OMN9MNn2YVPBJlNdZoEJ8KPQljNjp1qcuVv_lb1eg';

  var SEDES = [
    { k: 'Capital Federal', pais: 'CABA', dir: 'Av. Corrientes 818 · Hotel Las Naciones', q: 'Av. Corrientes 818, CABA' },
    { k: 'San Isidro', pais: 'Buenos Aires', dir: 'Martín y Omar 399 · Teatro Stella Maris', q: 'Martín y Omar 399, San Isidro, Buenos Aires' },
    { k: 'Moreno', pais: 'Buenos Aires', dir: 'Dr. Aseff 49', q: 'Dr. Aseff 49, Moreno, Buenos Aires' },
    { k: 'La Plata', pais: 'Buenos Aires', dir: 'Calle 44 n.º 368, entre 2 y 3 · Círculo de Oficiales de Mar', q: 'Calle 44 368, La Plata, Buenos Aires' },
    { k: 'Montevideo', pais: 'Uruguay', dir: 'Av. 18 de Julio 1332', q: 'Av. 18 de Julio 1332, Montevideo, Uruguay' },
    { k: 'Tres Arroyos', pais: 'Buenos Aires', dir: 'Av. Rivadavia 558', q: 'Av. Rivadavia 558, Tres Arroyos, Buenos Aires' }
  ];
  var RADIOS = [
    ['Radio Colonia', 'AM 530', [['5:30', 'de la mañana'], ['00:00', 'medianoche']]],
    ['Radio Cristiana', 'FM 92.5', [['7:00', 'de la mañana']]],
    ['Radio Kairós', 'FM 87.7', [['8:00', 'de la mañana'], ['21:00', 'de la noche']]],
    ['Radio Welcome', 'FM 105.9', [['8:30', 'de la mañana']]],
    ['Radio JCB', 'FM 94.5', [['9:30', 'de la mañana']]],
    ['LU24 Tres Arroyos', 'Radio LU24', [['22:00', 'de la noche']]],
    ['Radio Argentina', 'AM 570', [['23:30', 'de la noche']]]
  ];
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var FB = 'https://www.facebook.com/profile.php?id=100064880432909';
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function csv(t) { var R = [], r = [], v = '', q = false; for (var i = 0; i < t.length; i++) { var c = t[i]; if (q) { if (c == '"') { if (t[i + 1] == '"') { v += '"'; i++; } else q = false; } else v += c; } else if (c == '"') q = true; else if (c == ',') { r.push(v); v = ''; } else if (c == '\n' || c == '\r') { if (c == '\r' && t[i + 1] == '\n') i++; r.push(v); R.push(r); r = []; v = ''; } else v += c; } if (v || r.length) { r.push(v); R.push(r); } return R; }
  function fecha(s) { s = String(s || '').trim(); var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); if (m) { var y = +m[3]; if (y < 100) y += 2000; return new Date(y, m[2] - 1, +m[1]); } m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return new Date(+m[1], m[2] - 1, +m[3]); return null; }
  function hora(s) { s = String(s || '').trim(); if (!s) return ''; var fr = s.match(/^0?[.,](\d+)$/); if (fr) { var mins = Math.round(parseFloat('0.' + fr[1]) * 1440); s = Math.floor(mins / 60) + ':' + ('0' + mins % 60).slice(-2); } var m = s.match(/^(\d{1,2})(?::(\d{2}))?/); if (!m) return esc(s); return m[2] && m[2] != '00' ? m[1] + ':' + m[2] + ' horas' : m[1] + ' horas'; }
  function mapa(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }

  /* ---------- Radios ---------- */
  $('radios-lista').innerHTML = RADIOS.map(function (r, i) {
    return '<li class="item revelar" style="--i:' + i + '"><div class="fila"><span class="item-nombre">' + r[0] + ' <span class="item-tag">' + r[1] + '</span></span>' +
      '<span class="radio-horas">' + r[2].map(function (x) { return '<span class="item-dato">' + x[0] + ' horas</span><small>' + x[1] + '</small>'; }).join('') + '</span></div></li>';
  }).join('');

  /* ---------- Agenda desde la planilla ---------- */
  function pintar(ev) {
    $('sedes-lista').innerHTML = SEDES.map(function (s, i) {
      var f = ev.filter(function (e) { return e.tipo == 'sede' && e.lugar == s.k.toLowerCase(); }).slice(0, 3);
      var sub = f.length ? 'Próxima: ' + DIAS[f[0].f.getDay()].toLowerCase() + ' ' + f[0].f.getDate() + ' de ' + MESES[f[0].f.getMonth()] + (f[0].h ? ' · ' + hora(f[0].h) : '') : s.pais;
      var dato = f.length ? '<span class="badge-prox">Nueva fecha</span>' : '';
      var lista = f.length
        ? '<ul class="fechas">' + f.map(function (e) { return '<li><b>' + e.f.getDate() + ' ' + MESES[e.f.getMonth()] + '</b><span>' + DIAS[e.f.getDay()] + (e.h ? ' · ' + hora(e.h) : '') + (e.det ? ' · ' + esc(e.det) : '') + '</span></li>'; }).join('') + '</ul>'
        : '<p class="a-confirmar">Próximas fechas a confirmar.</p>';
      return '<details class="item revelar visto" style="--i:' + i + '"><summary class="fila"><span class="item-nombre">' + s.k + '</span><span class="item-dato">' + dato + '</span><span class="mas" aria-hidden="true">+</span><span class="item-sub">' + sub + '</span></summary>' +
        '<div class="item-cuerpo"><p class="dir">' + s.dir + '</p>' + lista + '<a class="link-flecha" href="' + mapa(s.q) + '" target="_blank" rel="noopener">Cómo llegar <span aria-hidden="true">→</span></a></div></details>';
    }).join('');

  }
  function leer(t) {
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    return csv(t).slice(1).map(function (r) { return { tipo: (r[0] || '').trim().toLowerCase(), lugarTxt: (r[1] || '').trim(), lugar: (r[1] || '').trim().toLowerCase(), f: fecha(r[2]), h: r[3], det: (r[4] || '').trim(), dir: (r[5] || '').trim(), ver: (r[6] || 'SI').trim().toUpperCase() }; })
      .filter(function (e) { return e.f && e.f >= hoy && e.ver != 'NO'; }).sort(function (a, b) { return a.f - b.f; });
  }
  pintar([]);
  try { var c = localStorage.getItem('tv-agenda'); if (c) pintar(leer(c)); } catch (e) {}
  fetch('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&sheet=Agenda', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
    .then(function (t) { if (t.indexOf('Tipo') < 0) return; pintar(leer(t)); try { localStorage.setItem('tv-agenda', t); } catch (e) {} })
    .catch(function () {});

  /* ---------- Modo noche ---------- */
  var raiz = document.documentElement, btnTema = $('tema'), meta = document.querySelector('meta[name="theme-color"]');
  function syncTema() {
    var n = raiz.dataset.tema === 'noche';
    btnTema.setAttribute('aria-label', n ? 'Cambiar a modo día' : 'Cambiar a modo noche');
    btnTema.querySelector('.tema-txt').textContent = n ? 'Día' : 'Noche';
    meta.content = n ? '#170B0F' : '#F7F1EC';
  }
  btnTema.addEventListener('click', function () {
    if (raiz.dataset.tema === 'noche') delete raiz.dataset.tema; else raiz.dataset.tema = 'noche';
    try { localStorage.setItem('tvb-tema', raiz.dataset.tema || 'dia'); } catch (e) {}
    syncTema();
  });
  syncTema();

  /* ---------- Copiar alias ---------- */
  $('copiar-alias').addEventListener('click', function () {
    var t = this.querySelector('.btn-txt'), alias = $('alias').textContent;
    var b = this; var ok = function () { t.textContent = '¡Alias copiado! Gracias'; b.classList.add('copiado'); setTimeout(function () { t.textContent = 'Copiar alias'; b.classList.remove('copiado'); }, 2600); };
    if (navigator.clipboard) navigator.clipboard.writeText(alias).then(ok, function () {});
  });

  /* ---------- Galería ---------- */
  var gal = $('galeria'), figs = [].slice.call(gal.querySelectorAll('figure'));
  var ant = $('gal-ant'), sig = $('gal-sig'), cont = $('gal-cont'), puntos = $('gal-puntos');
  puntos.innerHTML = figs.map(function () { return '<i></i>'; }).join('');
  var dots = [].slice.call(puntos.children);
  function paso() { return figs[1] ? figs[1].offsetLeft - figs[0].offsetLeft : gal.clientWidth; }
  function actual() { return Math.max(0, Math.min(figs.length - 1, Math.round(gal.scrollLeft / paso()))); }
  function marcar() {
    var i = actual(), fin = gal.scrollLeft + gal.clientWidth >= gal.scrollWidth - 4;
    if (fin) i = figs.length - 1;
    cont.textContent = (i + 1) + ' / ' + figs.length;
    dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
    ant.disabled = gal.scrollLeft < 4; sig.disabled = fin;
  }
  sig.addEventListener('click', function () { gal.scrollBy({ left: paso(), behavior: 'smooth' }); });
  ant.addEventListener('click', function () { gal.scrollBy({ left: -paso(), behavior: 'smooth' }); });
  gal.addEventListener('scroll', function () { requestAnimationFrame(marcar); }, { passive: true });
  addEventListener('resize', marcar); marcar();

  /* ---------- Encabezado con línea al bajar ---------- */
  var top = $('top');
  addEventListener('scroll', function () { top.classList.toggle('con-linea', scrollY > 8); }, { passive: true });

  /* ---------- Entradas progresivas ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.revelar:not(.visto)').forEach(function (el, i) { if (el.closest('.lista')) el.style.setProperty('--i', i % 6); io.observe(el); });

  /* ---------- Índice: marca la sección visible ---------- */
  var links = [].slice.call(document.querySelectorAll('#indice-pista a'));
  var pista = $('indice-pista');
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) {
        var act = a.getAttribute('href') === '#' + e.target.id;
        a.setAttribute('aria-current', act ? 'true' : 'false');
        if (act) pista.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' });
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

  /* ---------- Avisos: visitas y reuniones especiales ----------
     Se cargan en la planilla, pestaña «Avisos»:
     Etiqueta · Título · Bajada · Fechas · Hasta (dd/mm/aaaa) · Hora · Lugar · Imagen (link) · Mostrar
     Al día siguiente de «Hasta» el aviso desaparece solo. Si no hay ninguno vigente, la sección no se muestra. */
  function imgDrive(u) {
    u = String(u || '').trim(); var m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
    return m ? 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1400' : u;
  }
  function pintarAvisos(filas) {
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    var av = filas.map(function (r) { return { et: (r[0] || '').trim(), tit: (r[1] || '').trim(), baj: (r[2] || '').trim(), fechas: (r[3] || '').trim(), hasta: fecha(r[4]), hora: (r[5] || '').trim(), lugar: (r[6] || '').trim(), img: imgDrive(r[7]), ver: (r[8] || 'SI').trim().toUpperCase() }; })
      .filter(function (a) { return a.tit && a.ver != 'NO' && (!a.hasta || a.hasta >= hoy); }); /* en el orden de la planilla */
    var sec = $('avisos');
    if (!av.length) { sec.hidden = true; return; }
    sec.hidden = false;
    $('avisos-lista').innerHTML = av.map(function (a, i) {
      var foto = a.img ? '<button class="av-foto" type="button" data-img="' + esc(a.img) + '" aria-label="Ver flyer de ' + esc(a.tit) + '"><img src="' + esc(a.img) + '" alt=""' + (i > 1 ? ' loading="lazy"' : '') + '><span class="av-ver">Ver flyer</span></button>' : '';
      return '<article class="av-tarjeta' + (a.img ? '' : ' sin-foto') + '" style="--i:' + i + '"' + (a.img ? ' tabindex="0" role="button" aria-label="Ver flyer de ' + esc(a.tit) + ', ' + esc(a.fechas) + '"' : '') + '>' + foto +
        '<div class="av-info">' + (a.et ? '<span class="av-et">' + esc(a.et) + '</span>' : '') +
        '<p class="av-fecha">' + esc(a.fechas) + (a.hora ? ' · ' + esc(a.hora) : '') + '</p>' +
        '<h3>' + esc(a.tit) + '</h3>' + (a.baj ? '<p class="av-bajada">' + esc(a.baj) + '</p>' : '') +
        (a.lugar ? '<p class="av-lugar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>' + esc(a.lugar) + '</p>' : '') +
        '</div></article>';
    }).join('');
  }
  function leerAvisos(t) { var f = csv(t); if (!f.length || !/t[ií]tulo/i.test(f[0].join(' '))) return null; return f.slice(1); }
  try { var ca = localStorage.getItem('tv-avisos'); var fa = ca && leerAvisos(ca); if (fa) pintarAvisos(fa); } catch (e) {}
  fetch('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&sheet=Avisos', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
    .then(function (t) { var f = leerAvisos(t); if (!f) return; pintarAvisos(f); try { localStorage.setItem('tv-avisos', t); } catch (e) {} })
    .catch(function () {});

  /* visor de flyers */
  var visor = $('visor'), visorImg = $('visor-img');
  $('avisos-lista').addEventListener('click', function (e) {
    var t = e.target.closest('.av-tarjeta'); var b = t && t.querySelector('.av-foto'); if (!b) return;
    visorImg.src = b.getAttribute('data-img'); visorImg.alt = b.getAttribute('aria-label') || '';
    if (visor.showModal) visor.showModal(); else window.open(visorImg.src, '_blank');
  });
  $('avisos-lista').addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('av-tarjeta')) { e.preventDefault(); e.target.click(); } });
  $('visor-cerrar').addEventListener('click', function () { visor.close(); });
  visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });

  /* flechas de avisos (en el celular) */
  var avL = $('avisos-lista'), avAnt = $('av-ant'), avSig = $('av-sig'), avCont = $('av-cont');
  function avPaso() { var t = avL.querySelector('.av-tarjeta'); return t ? t.offsetWidth + 14 : avL.clientWidth; }
  function avMarcar() {
    var n = avL.querySelectorAll('.av-tarjeta').length, i = Math.round(avL.scrollLeft / avPaso());
    var fin = avL.scrollLeft + avL.clientWidth >= avL.scrollWidth - 4;
    avAnt.disabled = avL.scrollLeft < 4; avSig.disabled = fin || n < 2;
    avCont.textContent = n > 1 ? (Math.min(i, n - 1) + 1) + ' / ' + n : '';
  }
  avSig.addEventListener('click', function () { avL.scrollBy({ left: avPaso(), behavior: 'smooth' }); });
  avAnt.addEventListener('click', function () { avL.scrollBy({ left: -avPaso(), behavior: 'smooth' }); });
  avL.addEventListener('scroll', function () { requestAnimationFrame(avMarcar); }, { passive: true });
  addEventListener('resize', avMarcar);
  new MutationObserver(avMarcar).observe(avL, { childList: true }); avMarcar();
})();
