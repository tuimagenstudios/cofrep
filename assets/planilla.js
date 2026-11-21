/* =============================================================
   COFREP · Lector de planillas de Google Sheets
   -------------------------------------------------------------
   Cada carta puede leer sus productos y precios de una planilla
   que maneja el propio local. La planilla tiene que estar
   compartida como "Cualquier persona con el enlace: Lector".

   Columnas (la primera fila son los títulos, el orden no importa):
     Categoría | Producto | Descripción | Precio | Mostrar | Etiqueta
   - Precio: se acepta 4200, $4.200 o $ 4.200
   - Mostrar: SI o NO (vacío = SI). NO oculta el producto.
   - Etiqueta: opcional (ej. "Nuevo", "El favorito de la casa")

   Uso en una carta:
     <meta name="cofrep-planilla" content="ID_DE_LA_PLANILLA">
     <script src="/assets/planilla.js"></script>
     CofrepPlanilla.cargar({ alGuardada: filas => ..., alNueva: filas => ... })
   ============================================================= */
(function () {
  'use strict';

  var HOJA = 'Carta';
  var CLAVE = 'cofrep-planilla-';

  function idDeLaCarta() {
    var meta = document.querySelector('meta[name="cofrep-planilla"]');
    var id = meta ? (meta.getAttribute('content') || '').trim() : '';
    // Acepta el link completo o solo el ID
    var m = id.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
    return m ? m[1] : id;
  }

  // Solo para probar en la compu (localhost): ?planilla-prueba=/ruta/archivo.csv
  function urlDePrueba() {
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return '';
    return new URLSearchParams(location.search).get('planilla-prueba') || '';
  }

  function parseCSV(t) {
    var filas = [], fila = [], v = '', q = false;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) {
        if (c === '"') { if (t[i + 1] === '"') { v += '"'; i++; } else q = false; }
        else v += c;
      } else if (c === '"') q = true;
      else if (c === ',') { fila.push(v); v = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && t[i + 1] === '\n') i++;
        fila.push(v); filas.push(fila); fila = []; v = '';
      } else v += c;
    }
    if (v || fila.length) { fila.push(v); filas.push(fila); }
    return filas;
  }

  var sinTildes = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };
  // Lo que escribe el cliente se muestra como texto: se sacan caracteres de HTML
  var limpio = function (s) {
    return String(s || '').replace(/[<>"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 300);
  };
  var precio = function (s) {
    var solo = String(s || '').replace(/,\d{1,2}\s*$/, '').replace(/[^\d]/g, '');
    return solo ? Number(solo) : 0;
  };

  var COLUMNAS = {
    categoria: ['categoria', 'rubro', 'seccion'],
    producto: ['producto', 'nombre', 'plato'],
    descripcion: ['descripcion', 'detalle'],
    precio: ['precio', 'valor'],
    mostrar: ['mostrar', 'disponible', 'visible'],
    etiqueta: ['etiqueta', 'destacado']
  };

  function aFilas(csv) {
    var tabla = parseCSV(csv).filter(function (f) { return f.some(function (c) { return c.trim(); }); });
    if (tabla.length < 2) return [];
    var titulos = tabla[0].map(sinTildes), idx = {};
    Object.keys(COLUMNAS).forEach(function (k) {
      idx[k] = titulos.findIndex(function (t) { return COLUMNAS[k].indexOf(t) !== -1; });
    });
    if (idx.producto < 0 || idx.precio < 0) return [];
    var ultimaCategoria = '';
    return tabla.slice(1).map(function (f) {
      var get = function (k) { return idx[k] >= 0 ? f[idx[k]] : ''; };
      var cat = limpio(get('categoria')) || ultimaCategoria;
      ultimaCategoria = cat;
      return {
        categoria: cat || 'Carta',
        producto: limpio(get('producto')),
        descripcion: limpio(get('descripcion')),
        precio: precio(get('precio')),
        etiqueta: limpio(get('etiqueta')),
        mostrar: sinTildes(get('mostrar')) !== 'no'
      };
    }).filter(function (p) { return p.producto && p.precio > 0 && p.mostrar; });
  }

  function guardada(id) {
    try { var g = JSON.parse(localStorage.getItem(CLAVE + id)); return Array.isArray(g) && g.length ? g : null; }
    catch (e) { return null; }
  }

  function leer(url) {
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('planilla ' + r.status); return r.text(); })
      .then(function (t) {
        if (/^\s*</.test(t)) throw new Error('la planilla no es pública');
        var filas = aFilas(t);
        if (!filas.length) throw new Error('planilla vacía o sin columnas Producto y Precio');
        return filas;
      });
  }

  /* opciones.alGuardada(filas): se llama enseguida si hay una copia guardada en el teléfono
     opciones.alNueva(filas):    se llama cuando llega la planilla actualizada               */
  function cargar(opciones) {
    opciones = opciones || {};
    var prueba = urlDePrueba(), id = idDeLaCarta();
    if (!prueba && !id) return Promise.resolve(null);
    var clave = prueba ? 'prueba' : id;
    var url = prueba || ('https://docs.google.com/spreadsheets/d/' + encodeURIComponent(id) +
      '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(opciones.hoja || HOJA));
    var copia = !prueba && guardada(clave);
    if (copia && opciones.alGuardada) { try { opciones.alGuardada(copia); } catch (e) { console.error(e); } }
    return leer(url).then(function (filas) {
      try { localStorage.setItem(CLAVE + clave, JSON.stringify(filas)); } catch (e) {}
      if (opciones.alNueva) opciones.alNueva(filas);
      return filas;
    }).catch(function (e) {
      console.warn('COFREP: no se pudo leer la planilla, se usa la carta guardada.', e.message);
      return null;
    });
  }

  window.CofrepPlanilla = { cargar: cargar, _aFilas: aFilas };
})();
