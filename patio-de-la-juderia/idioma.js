/* Idiomas de la carta: español, inglés, francés e italiano.
   - Elige solo el idioma del teléfono (un turista inglés ve la carta en inglés al escanear el QR);
     si el teléfono está en otro idioma que no tenemos, muestra inglés.
   - Selector con banderas en la cabecera; la elección se recuerda durante la visita.
   - Cambiar de idioma no recarga la página: la música sigue sonando.
   Va después de los datos (carta-2027-es.js, experiencias-es.js, traducciones.js) y antes del resto. */
(() => {
  const I = window.PATIO_I18N;
  const IDS = I.idiomas.map(x => x.id);
  const POS = { en: 0, fr: 1, it: 2 };
  let base = structuredClone(window.PATIO_MENU_ES); // carta en español (la planilla puede reemplazarla)

  // Índice inverso: cualquier texto ya traducido → su clave en español (para volver a traducir sin perderse)
  const inverso = new Map();
  for (const [es, tr] of Object.entries(I.textos)) { inverso.set(es, es); tr.forEach(x => { if (x && !inverso.has(x)) inverso.set(x, es); }); }

  function elegir() {
    const q = new URLSearchParams(location.search).get('lang');
    if (IDS.includes(q)) return q;
    try { const s = sessionStorage.getItem('patio-idioma'); if (IDS.includes(s)) return s; } catch (e) {}
    for (const l of (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'])) {
      const c = String(l).slice(0, 2).toLowerCase();
      if (IDS.includes(c)) return c;
      if (['ca', 'gl', 'eu'].includes(c)) return 'es';
    }
    return 'en';
  }
  let lang = elegir();

  function t(es, vars) {
    let s = es;
    if (lang !== 'es') { const v = I.textos[es]; if (v && v[POS[lang]]) s = v[POS[lang]]; }
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }
  window.PatioT = t;
  const locale = () => I.idiomas.find(x => x.id === lang).locale;

  /* ---------- Carta traducida (copia de la carta en español) ---------- */
  function datos() {
    const d = structuredClone(base);
    if (lang === 'es') return d;
    const k = POS[lang], extra = window.PATIO_TRAD_PLANILLA || {};
    for (const g of d.groups) {
      const tg = I.grupos[g.id];
      if (tg) { g.name = tg[k][0]; g.description = tg[k][1]; }
      for (const r of (g.rows || [])) {
        const tr = (extra[r[0]] && extra[r[0]][lang]) ? [extra[r[0]][lang][0], extra[r[0]][lang][1]] : (I.filas[r[0]] ? [I.filas[r[0]][k * 2], I.filas[r[0]][k * 2 + 1]] : null);
        if (tr) { if (tr[0]) r[1] = tr[0]; if (r[3] && tr[1]) r[3] = tr[1]; }
        if (r[6] && I.familias[r[6]]) r[6] = I.familias[r[6]][k];
        if (r[4]) r[4] = t(r[4]);
        if (Array.isArray(r[2])) r[2] = r[2].map(o => ({ ...o, unit: t(o.unit) }));
      }
      for (const m of (g.menus || [])) {
        const tm = I.menus[m.id] && I.menus[m.id][lang];
        if (!tm) continue;
        Object.assign(m, { name: tm.name, shortName: tm.shortName, condition: tm.condition, summary: tm.summary, included: tm.included, courses: tm.courses });
        if (tm.choices) m.choices = tm.choices;
        if (tm.desserts) m.desserts = tm.desserts;
      }
    }
    return d;
  }

  /* ---------- Textos fijos de la página ---------- */
  const EXCLUIR = '#menu-results,#featured-dishes,[data-service-notice],#menu-detail,.legal-content,.music-control,script,style,noscript,.idioma';
  const clave = s => { const c = s.replace(/\s+/g, ' ').trim(); return inverso.get(c) || c; };
  function traducirDOM(raiz) {
    raiz = raiz || document.body;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    const nodos = [];
    while (w.nextNode()) nodos.push(w.currentNode);
    for (const n of nodos) {
      if (!n.parentElement || n.parentElement.closest(EXCLUIR)) continue;
      const m = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!m[2] || !/[A-Za-zÀ-ÿ]/.test(m[2])) continue;
      const nuevo = t(clave(m[2]));
      if (nuevo !== m[2]) n.nodeValue = m[1] + nuevo + m[3];
    }
    for (const el of raiz.querySelectorAll('[aria-label],[placeholder],[title],img[alt]')) {
      if (el.closest(EXCLUIR)) continue;
      for (const a of ['aria-label', 'placeholder', 'title', 'alt']) {
        const v = el.getAttribute(a);
        if (v && /[A-Za-zÀ-ÿ]/.test(v)) { const nuevo = t(clave(v)); if (nuevo !== v) el.setAttribute(a, nuevo); }
      }
    }
    document.querySelectorAll('.legal-content').forEach(e => { e.lang = 'es'; });
  }
  function whatsapp() {
    const texto = encodeURIComponent(I.whatsapp[lang]);
    document.querySelectorAll('a[href*="wa.me/34625940724"]').forEach(a => {
      if (a.closest('#menu-detail')) return;
      a.href = 'https://wa.me/34625940724?text=' + texto;
    });
  }
  function titulo() {
    if (document.querySelector('#menu-detail')) return; // la página del menú pone su propio título
    document.title = t(clave(document.title));
  }

  /* ---------- Selector con banderas ---------- */
  function selector() {
    const header = document.querySelector('header');
    if (!header) return;
    let caja = header.querySelector('.idioma');
    if (!caja) {
      caja = document.createElement('div');
      caja.className = 'idioma';
      caja.innerHTML = `<button class="idioma-boton" type="button" aria-haspopup="true" aria-expanded="false"><span class="bandera" aria-hidden="true"></span><span class="idioma-codigo"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button>
        <ul class="idioma-lista" hidden>${I.idiomas.map(x => `<li><button type="button" data-idioma="${x.id}" lang="${x.id}"><span class="bandera bandera-${x.id}" aria-hidden="true"></span>${x.nombre}</button></li>`).join('')}</ul>`;
      header.append(caja);
    }
    const b = caja.querySelector('.idioma-boton');
    b.querySelector('.bandera').className = 'bandera bandera-' + lang;
    b.querySelector('.idioma-codigo').textContent = lang.toUpperCase();
    b.setAttribute('aria-label', t('Cambiar idioma') + ': ' + I.idiomas.find(x => x.id === lang).nombre);
    caja.querySelectorAll('[data-idioma]').forEach(x => x.setAttribute('aria-current', String(x.dataset.idioma === lang)));
  }
  function cerrarLista() {
    document.querySelectorAll('.idioma-lista').forEach(l => { l.hidden = true; });
    document.querySelectorAll('.idioma-boton').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  document.addEventListener('click', e => {
    const boton = e.target.closest('.idioma-boton');
    const opcion = e.target.closest('[data-idioma]');
    if (boton) {
      const lista = boton.parentElement.querySelector('.idioma-lista');
      const abrir = lista.hidden;
      cerrarLista();
      lista.hidden = !abrir;
      boton.setAttribute('aria-expanded', String(abrir));
      if (abrir) lista.querySelector('[aria-current="true"]')?.focus();
      return;
    }
    if (opcion) { cerrarLista(); cambiar(opcion.dataset.idioma); return; }
    if (!e.target.closest('.idioma')) cerrarLista();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarLista(); });

  /* ---------- Aplicar y cambiar ---------- */
  function aplicar(rearmar) {
    document.documentElement.lang = lang;
    window.PATIO_MENU_ES = datos();
    traducirDOM(document.body);
    whatsapp();
    titulo();
    selector();
    if (!rearmar) return;
    document.querySelector('#featured-dishes')?.replaceChildren();
    document.querySelector('#menu-detail')?.replaceChildren();
    window.PatioInitCarta?.();
    window.PatioInitService?.();
    window.PatioInitDetail?.();
    window.PatioMusica?.refrescar();
  }
  function cambiar(nuevo) {
    if (!IDS.includes(nuevo) || nuevo === lang) return;
    lang = nuevo;
    try { sessionStorage.setItem('patio-idioma', lang); } catch (e) {}
    window.PatioAnimaciones?.revertir();
    aplicar(true);
    window.PatioVistas?.olvidar();
    window.PatioAnimaciones?.rehacer();
    document.querySelector('.idioma-boton')?.focus();
  }

  window.PatioIdioma = {
    get actual() { return lang; },
    locale, t, cambiar,
    // navigation.js la llama al cambiar de página (la cabecera y el contenido son nuevos)
    alNavegar() { traducirDOM(document.body); whatsapp(); titulo(); selector(); },
    // carta en español que se está usando (la planilla la compara antes de reemplazarla)
    baseES() { return structuredClone(base); },
    // la planilla de Google Sheets entrega una carta nueva en español y sus traducciones
    nuevaBase(carta) { base = structuredClone(carta); window.PatioAnimaciones?.revertir(); aplicar(true); window.PatioVistas?.olvidar(); window.PatioAnimaciones?.rehacer(); }
  };

  aplicar(false);
  // Segunda pasada para lo que crean los scripts que cargan después (botón «Buscar», etc.)
  document.addEventListener('DOMContentLoaded', () => { traducirDOM(document.body); selector(); });
})();
