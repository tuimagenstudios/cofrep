/* Carta conectada a la planilla de Google Sheets del restaurante.
   - La planilla tiene que estar compartida como «Cualquier persona con el enlace: Lector».
   - Se lee cada vez que alguien abre la carta. Si Google no responde, se usa la última copia
     guardada en el teléfono o, si no hay, la carta que viene escrita en la web. Nunca queda vacía.
   - Solo se vuelve a armar la carta si algo cambió de verdad.
   - Lo que escribe el restaurante se muestra como texto: no puede romper el diseño ni meter código.
   Pestañas: «Carta», «Menús» y «Avisos» (los títulos de la primera fila importan, el orden no).
   Para probar en la compu: ?planilla-prueba=/ruta/carpeta/ (con Carta.csv, Menús.csv y Avisos.csv), solo en localhost. */
(() => {
  if (!window.PatioIdioma) return;
  const meta = document.querySelector('meta[name="cofrep-planilla"]');
  const valor = meta ? (meta.getAttribute('content') || '').trim() : '';
  const idPlanilla = (valor.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || [])[1] || valor;
  const prueba = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? new URLSearchParams(location.search).get('planilla-prueba') : '';
  if (!idPlanilla && !prueba) return;
  const CLAVE = 'patio-planilla-' + (prueba ? 'prueba' : idPlanilla);

  const sinTildes = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const limpio = s => String(s || '').replace(/[<>`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 400);
  const traduccion = s => { const v = limpio(s); return /^(#|loading|cargando)/i.test(v) ? '' : v; };
  function precio(s) {
    let v = String(s || '').replace(/[€\s]/g, '');
    if (!v) return 0;
    if (v.includes(',')) v = v.replace(/\./g, '').replace(',', '.');
    const n = Number(v);
    return isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
  }
  function parseCSV(t) {
    const filas = []; let fila = [], v = '', q = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { v += '"'; i++; } else q = false; } else v += c; }
      else if (c === '"') q = true;
      else if (c === ',') { fila.push(v); v = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; fila.push(v); filas.push(fila); fila = []; v = ''; }
      else v += c;
    }
    if (v || fila.length) { fila.push(v); filas.push(fila); }
    return filas.filter(f => f.some(x => String(x).trim()));
  }
  // Tabla → lista de objetos con las columnas por título
  function tabla(csv) {
    const t = parseCSV(csv);
    if (t.length < 2) return [];
    const tit = t[0].map(sinTildes);
    return t.slice(1).map(f => { const o = {}; tit.forEach((k, i) => { o[k] = f[i] == null ? '' : f[i]; }); return o; });
  }
  const url = hoja => prueba
    ? prueba.replace(/\/?$/, '/') + encodeURIComponent(hoja) + '.csv'
    : 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(idPlanilla) + '/gviz/tq?tqx=out:csv&headers=1&sheet=' + encodeURIComponent(hoja);
  const leer = hoja => fetch(url(hoja), { cache: 'no-store' }).then(r => {
    if (!r.ok) throw new Error(hoja + ' ' + r.status);
    return r.text();
  }).then(t => { if (/^\s*</.test(t)) throw new Error('la planilla no es pública'); return tabla(t); });

  const OPCIONES = { 'veg*': 'opcion-vegetariana', 'veg': 'vegetariano', 'sg*': 'opcion-sin-gluten' };

  /* ---------- De la planilla a la carta ---------- */
  function armar(carta, menus, avisos) {
    const base = window.PatioIdioma.baseES();
    const porNombre = new Map(base.groups.map(g => [sinTildes(g.name), g]));
    const nuevas = new Map();
    const trad = {};
    carta.forEach((f, i) => {
      const nombre = limpio(f['plato']);
      const g = porNombre.get(sinTildes(f['seccion']));
      const p1 = precio(f['precio']), p2 = precio(f['precio botella']);
      if (!nombre || !g || g.id === 'menus' || !p1 || sinTildes(f['mostrar']) === 'no') return;
      let id = String(f['id'] || '').trim();
      id = /^\d+$/.test(id) ? Number(id) : (limpio(id) || 'nuevo-' + (i + 2));
      const unidad = sinTildes(f['unidad']) === 'copa / botella' ? '' : limpio(f['unidad']);
      const opciones = String(f['opciones'] || '').split(',').map(x => OPCIONES[sinTildes(x)]).filter(Boolean);
      const numero = Object.keys(f).find(k => k.startsWith('n.'));
      const fila = [id, nombre, p2 ? [{ price: p1, unit: 'copa' }, { price: p2, unit: 'botella' }] : p1, limpio(f['descripcion']), unidad, opciones];
      const familia = limpio(f['familia']);
      if (familia || typeof id !== 'number') fila[6] = familia || undefined;
      if (typeof id !== 'number' && numero && /^\d+$/.test(String(f[numero]).trim())) fila[7] = Number(f[numero]);
      if (!nuevas.has(g.id)) nuevas.set(g.id, []);
      nuevas.get(g.id).push(fila);
      trad[id] = {
        en: [traduccion(f['plato en']), traduccion(f['descripcion en'])],
        fr: [traduccion(f['plato fr']), traduccion(f['descripcion fr'])],
        it: [traduccion(f['plato it']), traduccion(f['descripcion it'])]
      };
    });
    if ([...nuevas.values()].reduce((s, x) => s + x.length, 0) < 10) throw new Error('la pestaña Carta parece vacía');
    base.groups.forEach(g => { if (g.id !== 'menus') g.rows = nuevas.get(g.id) || []; });

    // Menús: cada fila es una parte del menú
    const grupoMenus = base.groups.find(g => g.id === 'menus');
    const tradMenus = {};
    if (grupoMenus && menus.length) {
      const porId = new Map();
      menus.forEach(f => {
        const id = limpio(f['menu']); if (!id) return;
        if (!porId.has(id)) porId.set(id, []);
        porId.get(id).push(f);
      });
      grupoMenus.menus = grupoMenus.menus.map(m => {
        const filas = porId.get(m.id); if (!filas) return m;
        const nuevo = { ...m, courses: [] }; delete nuevo.choices; delete nuevo.desserts;
        const tr = { en: { courses: [] }, fr: { courses: [] }, it: { courses: [] } };
        const par = (f, l) => [traduccion(f['texto ' + l]), traduccion(f['detalle ' + l])];
        filas.forEach(f => {
          const parte = sinTildes(f['parte']), texto = limpio(f['texto']), detalle = limpio(f['detalle']);
          if (!texto) return;
          const cada = fn => ['en', 'fr', 'it'].forEach(l => fn(tr[l], par(f, l)));
          if (parte === 'nombre') { nuevo.name = texto; const p = precio(f['precio']); if (p) nuevo.price = p; cada((o, v) => { o.name = v[0]; }); }
          else if (parte === 'nombre corto') { nuevo.shortName = texto; cada((o, v) => { o.shortName = v[0]; }); }
          else if (parte === 'condicion') { nuevo.condition = texto; cada((o, v) => { o.condition = v[0]; }); }
          else if (parte === 'resumen') { nuevo.summary = texto; cada((o, v) => { o.summary = v[0]; }); }
          else if (parte === 'incluye') { nuevo.included = texto; cada((o, v) => { o.included = v[0]; }); }
          else if (parte === 'plato') { nuevo.courses.push([texto, detalle]); cada((o, v) => { o.courses.push(v); }); }
          else if (parte === 'titulo a elegir') { nuevo.choices = { title: texto, items: (nuevo.choices && nuevo.choices.items) || [] }; cada((o, v) => { o.choices = { title: v[0], items: (o.choices && o.choices.items) || [] }; }); }
          else if (parte === 'a elegir') { nuevo.choices = nuevo.choices || { title: '', items: [] }; nuevo.choices.items.push([texto, detalle]); cada((o, v) => { o.choices = o.choices || { title: '', items: [] }; o.choices.items.push(v); }); }
          else if (parte === 'postre') { nuevo.desserts = nuevo.desserts || []; nuevo.desserts.push([texto, detalle]); cada((o, v) => { o.desserts = o.desserts || []; o.desserts.push(v); }); }
        });
        if (!nuevo.courses.length) return m;
        // Solo cuenta como cambio si alguna traducción difiere de la que ya trae la carta
        const actual = window.PATIO_I18N.menus[m.id] || {};
        const campos = o => JSON.stringify([o.name, o.shortName, o.condition, o.summary, o.included, o.courses, o.choices || null, o.desserts || null]);
        if (['en', 'fr', 'it'].some(l => !actual[l] || campos(tr[l]) !== campos(actual[l]))) tradMenus[m.id] = tr;
        return nuevo;
      });
    }

    // Avisos
    const servicio = { ...window.PATIO_SERVICE_ES };
    avisos.forEach(f => {
      const c = sinTildes(f['concepto']), v = precio(f['importe']);
      if (!v) return;
      if (c.includes('consumo')) servicio.minimum = v;
      else if (c.includes('pan')) servicio.bread = v;
      else if (c.includes('envase')) servicio.container = v;
      else if (c.includes('bolsa')) servicio.bag = v;
    });
    return { base, trad, tradMenus, servicio };
  }

  /* ---------- Aplicar (solo si cambió algo) ---------- */
  // Resumen de la carta por contenido (ignora diferencias de forma, como un campo vacío o ausente)
  function canon(base) {
    return JSON.stringify(base.groups.map(g => [g.id, (g.rows || []).map(r => [String(r[0]), r[1], JSON.stringify(r[2]), r[3] || '', r[4] || '', (r[5] || []).join(','), r[6] || '']),
      (g.menus || []).map(m => [m.id, m.name, m.price, m.condition, m.summary, m.included, JSON.stringify(m.courses), JSON.stringify(m.choices || null), JSON.stringify(m.desserts || null)])]));
  }
  let aplicado = JSON.stringify({ base: window.PatioIdioma.baseES(), servicio: window.PATIO_SERVICE_ES, trad: {} });
  function aplicar(c, comparar) {
    const firma = JSON.stringify({ base: c.base, servicio: c.servicio, trad: c.trad });
    if (firma === aplicado) return;
    // Si la planilla trae exactamente la carta de la web, no hace falta volver a armar nada.
    const I = window.PATIO_I18N;
    const iguales = comparar && canon(c.base) === canon(window.PatioIdioma.baseES()) &&
      JSON.stringify(c.servicio) === JSON.stringify(window.PATIO_SERVICE_ES) &&
      Object.entries(c.trad).every(([id, t]) => { const v = I.filas[id]; return v && t.en[0] === v[0] && t.fr[0] === v[2] && t.it[0] === v[4] && t.en[1] === v[1] && t.fr[1] === v[3] && t.it[1] === v[5]; }) &&
      !Object.keys(c.tradMenus).length;
    aplicado = firma;
    if (iguales) return;
    window.PATIO_SERVICE_ES = c.servicio;
    window.PATIO_TRAD_PLANILLA = c.trad;
    for (const [id, porIdioma] of Object.entries(c.tradMenus)) {
      I.menus[id] = I.menus[id] || {};
      for (const [l, v] of Object.entries(porIdioma)) I.menus[id][l] = { ...(I.menus[id][l] || {}), ...Object.fromEntries(Object.entries(v).filter(([, x]) => (Array.isArray(x) ? x.length : (x && (typeof x !== 'object' || x.items))))) };
    }
    window.PatioIdioma.nuevaBase(c.base);
  }

  try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g && g.base) aplicar(g, true); } catch (e) {}
  Promise.all([leer('Carta'), leer('Menús').catch(() => []), leer('Avisos').catch(() => [])])
    .then(([carta, menus, avisos]) => {
      const c = armar(carta, menus, avisos);
      try { localStorage.setItem(CLAVE, JSON.stringify(c)); } catch (e) {}
      aplicar(c, true);
    })
    .catch(e => console.warn('Patio: no se pudo leer la planilla, se usa la carta guardada.', e.message));
})();
