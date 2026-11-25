/* ODDYSON · pedido.js (TuimagenStudio · COFREP)
   1) La carta lee la planilla de Google cada vez que se abre (pestañas «Productos» y «Local»).
      Si Google no responde, queda la copia de respaldo de catalogo.js.
   2) Envío por cuadras y forma de pago, con los datos de la pestaña «Local». */

const LOCAL = { lat: -36.7788647, lng: -59.8621458, base: 10, precio: 2000, cada: 5, suma: 500, max: 60, alias: '', titular: '' };
window.envioActual = null;
window.pagoActual = 'efectivo';

/* ===== Envío ===== */
function costoEnvio(cuadras) {
  if (!(cuadras > 0)) return null;
  if (LOCAL.max && cuadras > LOCAL.max) return null;
  if (cuadras <= LOCAL.base) return LOCAL.precio;
  return LOCAL.precio + Math.ceil((cuadras - LOCAL.base) / (LOCAL.cada || 1)) * LOCAL.suma;
}
function mostrarEnvio(cuadras, mapa) {
  const res = query('#envio-res');
  if (!(cuadras > 0)) { window.envioActual = null; res.textContent = ''; return; }
  const costo = costoEnvio(cuadras);
  window.envioActual = { cuadras, costo, mapa: mapa || (window.envioActual && window.envioActual.mapa) || null };
  res.innerHTML = costo === null
    ? t(`≈${cuadras} cuadras: consultá el envío por WhatsApp.`, `≈${cuadras} blocks: ask about delivery on WhatsApp.`)
    : `${t('Envío estimado', 'Estimated delivery')} (≈${cuadras} ${t('cuadras', 'blocks')}): <b>${money.format(costo)}</b><br>${t('Total con envío', 'Total with delivery')}: <b>${money.format(subtotal() + costo)}</b> · ${t('a confirmar', 'to be confirmed')}`;
}
query('#envio-cuadras').addEventListener('input', e => mostrarEnvio(Math.round(Number(e.target.value)), null));
query('#envio-gps').addEventListener('click', () => {
  const res = query('#envio-res');
  if (!navigator.geolocation) { res.textContent = t('Tu celular no permite usar la ubicación: escribí las cuadras.', 'Location not available: type the blocks.'); return; }
  res.textContent = t('Buscando tu ubicación…', 'Finding your location…');
  navigator.geolocation.getCurrentPosition(pos => {
    const la = pos.coords.latitude, lo = pos.coords.longitude, rad = Math.PI / 180;
    const h = Math.sin((la - LOCAL.lat) * rad / 2) ** 2 + Math.cos(LOCAL.lat * rad) * Math.cos(la * rad) * Math.sin((lo - LOCAL.lng) * rad / 2) ** 2;
    const metros = 2 * 6371000 * Math.asin(Math.sqrt(h)) * 1.3; // 1,3: las calles no van en línea recta
    const cuadras = Math.max(1, Math.round(metros / 100));
    query('#envio-cuadras').value = cuadras;
    mostrarEnvio(cuadras, `https://maps.google.com/?q=${la.toFixed(6)},${lo.toFixed(6)}`);
  }, () => { res.textContent = t('No pudimos ver tu ubicación: escribí las cuadras aproximadas.', 'Could not get your location: type the blocks.'); },
  { enableHighAccuracy: true, timeout: 12000 });
});

/* ===== Pago ===== */
document.querySelectorAll('.pago-op').forEach(boton => boton.addEventListener('click', () => {
  window.pagoActual = boton.dataset.pago;
  document.querySelectorAll('.pago-op').forEach(b => b.classList.toggle('on', b === boton));
  query('#pago-efectivo').hidden = window.pagoActual !== 'efectivo';
  query('#pago-transf').hidden = window.pagoActual !== 'transferencia';
}));
query('#alias-copiar').addEventListener('click', () => {
  if (navigator.clipboard) navigator.clipboard.writeText(LOCAL.alias).then(() => { query('#alias-copiar').textContent = t('¡Copiado!', 'Copied!'); });
});
function pintarLocal() {
  query('#alias-txt').textContent = LOCAL.alias || t('te lo pasamos por WhatsApp', 'we send it on WhatsApp');
  query('#titular-txt').textContent = LOCAL.titular ? t('Titular: ', 'Account holder: ') + LOCAL.titular : '';
  query('#alias-copiar').hidden = !LOCAL.alias;
}
function mostrarExtras() {
  query('#envio-box').hidden = modoPedido !== 'delivery';
  query('#pago-box').hidden = modoPedido === 'mesa';
}
// Los botones Mesa / Retiro / Delivery (los de pago no cambian el modo)
document.querySelectorAll('.wa-op:not(.pago-op)').forEach(boton => boton.addEventListener('click', mostrarExtras));
// La aclaración de cada plato se guarda mientras se escribe
document.addEventListener('input', event => {
  const nota = event.target.closest('[data-nota]');
  if (nota) notas.set(nota.dataset.nota, nota.value);
});
pintarLocal();
mostrarExtras();

/* ===== Planilla de Google ===== */
const PLANILLA = 'https://docs.google.com/spreadsheets/d/1QGu5dx9pHsiDvrQ0djcHfmucm4jg7S22OwTCxQzKtxo/export?format=csv&gid=';
const HOJA_PRODUCTOS = '388190678';
const HOJA_LOCAL = '32749804';

function leerCSV(texto) {
  const filas = []; let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}
// «14800», «$14.800», «14.800,00» → 14800
function numero(valor) {
  const limpio = String(valor || '').trim().replace(/[,.]\d{1,2}$/, '').replace(/\D/g, '');
  return limpio ? Number(limpio) : null;
}
function categoriaDe(nombre) {
  const buscado = normalize(nombre || '');
  if (!buscado) return null;
  const hallada = Object.entries(categories).find(([, c]) => normalize(c.name[0]) === buscado || normalize(c.tab[0]) === buscado);
  if (hallada) return hallada[0];
  const clave = 'cat-' + buscado.replace(/ /g, '-');
  if (!categories[clave]) categories[clave] = { name: [nombre.trim(), nombre.trim()], tab: [nombre.trim(), nombre.trim()] };
  return clave;
}
async function cargarPlanilla() {
  try {
    const textos = await Promise.all([HOJA_PRODUCTOS, HOJA_LOCAL].map(gid =>
      fetch(PLANILLA + gid + '&t=' + Date.now(), { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })));
    const nuevos = [];
    leerCSV(textos[0]).slice(1).forEach((f, i) => {
      const [id, cat, nombre, nombreEn, precio, disponible, , descripcion, foto, opciones, , descripcionEn] = f;
      if (!nombre || !nombre.trim()) return;
      if (String(disponible || '').trim().toUpperCase().startsWith('NO')) return;
      const categoria = categoriaDe(cat);
      if (!categoria) return;
      nuevos.push({
        id: (id || '').trim() || 'fila-' + (i + 2), category: categoria,
        name: nombre.trim(), nameEn: (nombreEn || '').trim() || nombre.trim(),
        price: numero(precio), description: (descripcion || '').trim(), descriptionEn: (descripcionEn || '').trim(),
        image: (foto || '').trim() || null, opciones: (opciones || '').trim()
      });
    });
    if (nuevos.length > 5) {
      dishes.length = 0;
      dishes.push(...nuevos);
      for (const id of [...quantities.keys()]) if (!dishes.some(d => d.id === id)) quantities.delete(id);
    }
    const datos = Object.fromEntries(leerCSV(textos[1]).slice(1).map(f => [normalize(f[0] || ''), (f[1] || '').trim()]));
    const dato = clave => datos[normalize(clave)] || '';
    const wa = dato('WhatsApp para pedidos').replace(/\D/g, '');
    if (wa.length >= 10) NEGOCIO_WHATSAPP = wa;
    ES_PRUEBA = dato('Pedidos reales (SI/NO)').toUpperCase() !== 'SI';
    const alias = dato('Alias para transferencias');
    LOCAL.alias = /confirmar/i.test(alias) ? '' : alias;
    const titular = dato('Titular de la cuenta');
    LOCAL.titular = /confirmar/i.test(titular) ? '' : titular;
    [['base', 'Envío: cuadras incluidas'], ['precio', 'Envío: precio hasta esas cuadras'], ['cada', 'Envío: cada cuántas cuadras más'],
     ['suma', 'Envío: cuánto suma'], ['max', 'Envío: máximo de cuadras']].forEach(([k, n]) => { const v = numero(dato(n)); if (v !== null) LOCAL[k] = v; });
    const la = parseFloat(dato('Latitud del local')), lo = parseFloat(dato('Longitud del local'));
    if (Math.abs(la) <= 90 && Math.abs(lo) <= 180 && la && lo) { LOCAL.lat = la; LOCAL.lng = lo; }
    pintarLocal();
    setLanguage(language);
    document.documentElement.dataset.planilla = 'ok';
  } catch (error) {
    document.documentElement.dataset.planilla = 'respaldo';
  }
}
cargarPlanilla();
