/* =============================================================
   Tonnarello · Modelo de la carta y lector de la planilla
   -------------------------------------------------------------
   La carta se dibuja siempre a partir de un único modelo:
     { sectionNote:{it,en,es}, categories:[{ code, section:'cucina'|'bevande',
       name:{it,en,es}, note:{it,en,es}, featured, items:[{ id, name:{it,en,es},
       desc:{it,en,es}, price, allergens, symbols:[], frozen, classic }] }] }

   1) modeloDesdeDatos(): lo arma con los datos que viajan con la carta
      (menu.js, i18n.js, bebidas.js). Es el respaldo: la carta nunca queda vacía.
   2) TonnarelloPlanilla.cargar(): lee la planilla de Google del local
      (pestañas «Menù» y «Categorie», publicadas como «Chiunque con il link: Visualizzatore»)
      y devuelve el mismo modelo. Si algo falla, se sigue usando el respaldo.

   No depende de ningún servidor externo: solo de Google Sheets del propio local.
   ============================================================= */
(function (global) {
  'use strict';

  var LANGS = ['it', 'en', 'es'];
  var CLASSICI = [['primi', 'Tonnarello Cacio e Pepe'], ['primi', 'Tonnarello Carbonara'], ['primi', 'Tonnarello all’Amatriciana'], ['secondi', 'Saltimbocca alla Romana'], ['dolci', 'Tiramisù espresso']];
  var tri = function (it, en, es) { return { it: it || '', en: en || it || '', es: es || it || '' }; };

  /* ---------- 1. Respaldo: datos incluidos en la carta ---------- */
  function modeloDesdeDatos() {
    var I = global.I18N, M = global.MENU, S = global.MENU_SYMBOLS || {};
    var categories = [];
    M.filter(function (c) { return c.id !== 'bevande'; }).forEach(function (c) {
      var en = I.en.categories[c.id] || {}, es = I.es.categories[c.id] || {};
      categories.push({
        code: c.id, section: 'cucina', featured: !!c.featured,
        name: tri(c.name, en.name, es.name), note: tri(c.note, en.note, es.note),
        items: c.items.map(function (it, i) {
          var e = (en.items || [])[i] || [], s = (es.items || [])[i] || [];
          return {
            id: c.id + '-' + (i + 1), name: tri(it[0], e[0], s[0]), desc: tri(it[2], e[1], s[1]),
            price: it[1], allergens: it[3] || '', symbols: (S[c.id] || [])[i] || [], frozen: !!it[4],
            classic: CLASSICI.some(function (k) { return k[0] === c.id && it[0].indexOf(k[1]) === 0; })
          };
        })
      });
    });
    var bev = M.find(function (c) { return c.id === 'bevande'; });
    var bevEn = I.en.categories.bevande || {}, bevEs = I.es.categories.bevande || {};
    global.BEVERAGE_GROUPS.forEach(function (g) {
      categories.push({
        code: g.id, section: 'bevande', featured: false,
        name: tri(I.it.drinkCategories[g.key], I.en.drinkCategories[g.key], I.es.drinkCategories[g.key]),
        note: tri('', '', ''),
        items: g.indexes.map(function (i) {
          var it = bev.items[i], e = (bevEn.items || [])[i] || [], s = (bevEs.items || [])[i] || [];
          return {
            id: it[5] || ('bevanda-' + i), name: tri(it[0], e[0], s[0]), desc: tri(it[2], e[1], s[1]),
            price: it[1], allergens: it[3] || '', symbols: (S.bevande || [])[i] || [], frozen: !!it[4], classic: false
          };
        })
      });
    });
    return { sectionNote: tri(bev.note, bevEn.note, bevEs.note), categories: categories, origen: 'datos' };
  }

  /* ---------- 2. Planilla de Google ---------- */
  function parseCSV(t) {
    var filas = [], fila = [], v = '', q = false;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { v += '"'; i++; } else q = false; } else v += c; }
      else if (c === '"') q = true;
      else if (c === ',') { fila.push(v); v = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; fila.push(v); filas.push(fila); fila = []; v = ''; }
      else v += c;
    }
    if (v || fila.length) { fila.push(v); filas.push(fila); }
    return filas;
  }
  var base = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
  // Lo que se escribe en la planilla se muestra solo como texto.
  var testo = function (s) { return String(s == null ? '' : s).replace(/[<>`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 400); };
  // Errores o celdas que Google todavía está traduciendo: se usa el italiano.
  var tradotto = function (s) { s = testo(s); return /^(#|loading|caricamento|errore|error)/i.test(s) ? '' : s; };
  // 12,50 · 12.5 · € 12,50 · 1.200,00
  function prezzo(s) {
    var t = String(s == null ? '' : s).replace(/[^\d,.-]/g, '');
    if (!t) return 0;
    if (t.indexOf(',') !== -1 && t.indexOf('.') !== -1) t = t.lastIndexOf(',') > t.lastIndexOf('.') ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
    else t = t.replace(',', '.');
    var n = Number(t); return isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
  }
  var si = function (s) { return /^(si|sì|s|x|yes|1|\*|vero|true)$/i.test(String(s || '').trim()); };
  var no = function (s) { return /^(no|n|0|falso|false)$/i.test(String(s || '').trim()); };

  function tabella(csv, colonne) {
    var righe = parseCSV(csv).filter(function (r) { return r.some(function (c) { return String(c).trim(); }); });
    if (righe.length < 2) return [];
    var titoli = righe[0].map(base), idx = {};
    Object.keys(colonne).forEach(function (k) { idx[k] = titoli.findIndex(function (t) { return colonne[k].indexOf(t) !== -1; }); });
    return righe.slice(1).map(function (r) { var o = {}; Object.keys(idx).forEach(function (k) { o[k] = idx[k] >= 0 ? r[idx[k]] : ''; }); return o; });
  }
  var COL_CATEGORIE = {
    sezione: ['sezione'], nome: ['categoria'], nomeEn: ['categoria en', 'categoria inglese'], nomeEs: ['categoria es', 'categoria spagnolo'],
    nota: ['nota'], notaEn: ['nota en'], notaEs: ['nota es'], codice: ['codice']
  };
  var COL_MENU = {
    categoria: ['categoria'], nome: ['piatto', 'prodotto', 'nome'], desc: ['descrizione'], prezzo: ['prezzo', 'prezzo eur', 'prezzo euro'],
    allergeni: ['allergeni'], simboli: ['simboli'], surgelato: ['surgelato', 'surgelato'], visibile: ['visibile', 'mostra'],
    classico: ['classico', 'classici'], nomeEn: ['piatto en'], descEn: ['descrizione en'], nomeEs: ['piatto es'], descEs: ['descrizione es'], codice: ['codice']
  };
  var SIMBOLI = ['foglia', 'bovino', 'suino', 'pesce', 'pollo', 'agnello', 'carne', 'calamaro', 'carciofo'];

  function modeloDesdePlanilla(csvCategorie, csvMenu, respaldo) {
    var cats = tabella(csvCategorie, COL_CATEGORIE), righe = tabella(csvMenu, COL_MENU);
    if (!cats.length || !righe.length) throw new Error('planilla vacía o sin las columnas esperadas');
    var porNombre = {}, categories = [], usados = {};
    var featured = {}; (respaldo ? respaldo.categories : []).forEach(function (c) { if (c.featured) featured[c.code] = true; });
    cats.forEach(function (c, i) {
      var nome = testo(c.nome); if (!nome) return;
      var code = base(c.codice).replace(/ /g, '-') || ('categoria-' + (i + 1)); while (usados[code]) code += '-b'; usados[code] = true;
      var cat = {
        code: code, section: /bevand|bibit|drink/i.test(base(c.sezione)) ? 'bevande' : 'cucina', featured: !!featured[code],
        name: tri(nome, tradotto(c.nomeEn), tradotto(c.nomeEs)), note: tri(testo(c.nota), tradotto(c.notaEn), tradotto(c.notaEs)), items: []
      };
      categories.push(cat); porNombre[base(nome)] = cat;
    });
    var ultima = null;
    righe.forEach(function (r, i) {
      var cat = porNombre[base(r.categoria)] || (testo(r.categoria) ? null : ultima);
      if (!cat) return; ultima = cat;
      var nome = testo(r.nome), price = prezzo(r.prezzo);
      if (!nome || !price || no(r.visibile)) return;
      cat.items.push({
        id: testo(r.codice) || (cat.code + '-r' + (i + 2)), name: tri(nome, tradotto(r.nomeEn), tradotto(r.nomeEs)),
        desc: tri(testo(r.desc), tradotto(r.descEn), tradotto(r.descEs)), price: price,
        allergens: testo(r.allergeni).replace(/[^\d-]+/g, '-').replace(/^-+|-+$/g, ''),
        symbols: base(r.simboli).split(' ').filter(function (s) { return SIMBOLI.indexOf(s) !== -1; }),
        frozen: si(r.surgelato), classic: si(r.classico)
      });
    });
    var piene = categories.filter(function (c) { return c.items.length; });
    if (!piene.length) throw new Error('la planilla no tiene productos con nombre y precio');
    return { sectionNote: respaldo ? respaldo.sectionNote : tri('', '', ''), categories: piene, origen: 'planilla' };
  }

  function idPlanilla() {
    var meta = document.querySelector('meta[name="tonnarello-planilla"]');
    var v = meta ? (meta.getAttribute('content') || '').trim() : '';
    var m = v.match(/\/d\/([a-zA-Z0-9_-]{20,})/); return m ? m[1] : v;
  }
  function leer(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('planilla ' + r.status); return r.text();
    }).then(function (t) { if (/^\s*</.test(t)) throw new Error('la planilla no es pública'); return t; });
  }
  var CLAVE = 'tonnarello-planilla-';
  /* opciones.respaldo: modelo de respaldo · opciones.alListo(modelo): se llama con la copia guardada y con la planilla nueva */
  function cargar(opciones) {
    var id = idPlanilla(), prueba = '';
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) prueba = new URLSearchParams(location.search).get('planilla-prueba') || '';
    if (!id && !prueba) return Promise.resolve(null);
    var clave = CLAVE + (prueba || id);
    try { var g = JSON.parse(localStorage.getItem(clave)); if (g && g.categories && g.categories.length) opciones.alListo(g); } catch (e) {}
    var hoja = function (nombre) {
      return prueba ? prueba.replace('{hoja}', encodeURIComponent(nombre))
        : 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(id) + '/gviz/tq?tqx=out:csv&headers=1&sheet=' + encodeURIComponent(nombre);
    };
    return Promise.all([leer(hoja('Categorie')), leer(hoja('Menù'))]).then(function (csv) {
      var modelo = modeloDesdePlanilla(csv[0], csv[1], opciones.respaldo);
      try { localStorage.setItem(clave, JSON.stringify(modelo)); } catch (e) {}
      opciones.alListo(modelo); return modelo;
    }).catch(function (e) { console.warn('Tonnarello: se usa la carta incluida.', e.message); return null; });
  }

  global.TonnarelloModelo = { desdeDatos: modeloDesdeDatos, desdePlanilla: modeloDesdePlanilla, prezzo: prezzo, LANGS: LANGS };
  global.TonnarelloPlanilla = { cargar: cargar };
})(typeof window !== 'undefined' ? window : globalThis);
