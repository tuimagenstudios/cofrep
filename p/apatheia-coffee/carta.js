const language = document.querySelector('#language');
const menuGrid = document.querySelector('.menu-grid');
const sections = [...document.querySelectorAll('[data-group]')];
const search = document.querySelector('#menu-search');
const searchField = document.querySelector('#search-field');
const searchToggle = document.querySelector('#search-toggle');
const noResults = document.querySelector('#no-results');
const selection = document.querySelector('#selection');
const selectionList = document.querySelector('#selection-items');
const selectionEmpty = document.querySelector('#selection-empty');
const selectionCount = document.querySelector('#selection-count');
const selectionStatus = document.querySelector('#selection-status');
const selectionSummary = document.querySelector('#selection-summary');
const totalOutput = document.querySelector('#selection-total');
const shareOutput = document.querySelector('#selection-share');
const splitPeople = document.querySelector('#split-people');
const quantities = new Map();
const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const pesosWithCents = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
let previouslyOpen = null;

function textInLanguage(spanish, english) {
  return language.value === 'en' ? english : spanish;
}

function quantityButton(symbol) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'quantity-button';
  button.textContent = symbol;
  return button;
}

function priceLabel(text) {
  const label = document.createElement('span');
  label.className = 'product-price';
  label.textContent = text;
  return label;
}

const products = [...menuGrid.querySelectorAll('li')].map(item => {
  const name = document.createElement('span');
  name.textContent = item.textContent.trim();
  if (item.dataset.en) {
    name.dataset.en = item.dataset.en;
    delete item.dataset.en;
  }
  const add = quantityButton('+');
  const price = Number(item.dataset.price);
  const product = { item, name, add, price, spanish: name.textContent, english: name.dataset.en };
  const label = document.createElement('span');
  label.className = 'product-label';
  label.append(name, priceLabel(pesos.format(price)));
  add.addEventListener('click', () => changeQuantity(product, 1));
  item.replaceChildren(label, add);
  return product;
});

const translations = [
  ['[data-en]', 'en', 'textContent'],
  ['[data-en-label]', 'enLabel', 'aria-label'],
  ['[data-en-alt]', 'enAlt', 'alt'],
  ['[data-en-placeholder]', 'enPlaceholder', 'placeholder']
].flatMap(([selector, key, attribute]) => Array.from(document.querySelectorAll(selector), element => ({
  element, attribute,
  es: attribute === 'textContent' ? element.textContent : element.getAttribute(attribute),
  en: element.dataset[key]
})));

function splitCount() {
  return Number.isSafeInteger(splitPeople.valueAsNumber) && splitPeople.valueAsNumber >= 1
    ? splitPeople.valueAsNumber
    : 1;
}

function renderTotal() {
  let total = 0;
  for (const [product, quantity] of quantities) total += product.price * quantity;
  selectionSummary.hidden = quantities.size === 0;
  totalOutput.value = pesos.format(total);
  shareOutput.value = pesosWithCents.format(total / splitCount());
}

function renderSelection() {
  selectionCount.textContent = [...quantities.values()].reduce((sum, quantity) => sum + quantity, 0);
  selectionEmpty.hidden = quantities.size > 0;
  const rows = new Map();

  for (const [product, quantity] of quantities) {
    const name = product.name.textContent;
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.className = 'product-label';
    label.append(name, priceLabel(pesos.format(product.price)));
    const controls = document.createElement('div');
    controls.className = 'selection-quantity';
    const decrease = quantityButton('−');
    const increase = quantityButton('+');
    const count = document.createElement('span');
    count.textContent = quantity;
    decrease.setAttribute('aria-label', textInLanguage(`Quitar uno de ${name}`, `Remove one ${name}`));
    increase.setAttribute('aria-label', textInLanguage(`Agregar uno de ${name}`, `Add one ${name}`));
    decrease.addEventListener('click', () => changeQuantity(product, -1, 'decrease'));
    increase.addEventListener('click', () => changeQuantity(product, 1, 'increase'));
    controls.append(decrease, count, increase);
    row.append(label, controls);
    rows.set(product, { row, decrease, increase });
  }

  selectionList.replaceChildren(...[...rows.values()].map(({ row }) => row));
  renderTotal();
  return rows;
}

function changeQuantity(product, difference, focusControl) {
  const quantity = (quantities.get(product) || 0) + difference;
  if (quantity > 0) quantities.set(product, quantity);
  else quantities.delete(product);

  const rows = renderSelection();
  if (focusControl) {
    const button = rows.get(product)?.[focusControl] || rows.values().next().value?.decrease;
    (button || selection.querySelector('button')).focus();
  }
  const name = product.name.textContent;
  selectionStatus.textContent = textInLanguage(
    `${name}. ${quantity} en tu selección.`,
    `${name}. ${quantity} in your selection.`
  );
}

function normalizeSearch(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();
}

function updateSearch() {
  const query = normalizeSearch(search.value);
  if (query && !previouslyOpen) previouslyOpen = new Set(sections.filter(section => section.open));
  for (const { item, spanish, english } of products) {
    item.hidden = Boolean(query) && ![spanish, english].some(name => name && normalizeSearch(name).includes(query));
  }
  for (const section of sections) {
    section.hidden = Boolean(query) && !section.querySelector('li:not([hidden])');
    if (query) section.open = !section.hidden;
    else if (previouslyOpen) section.open = previouslyOpen.has(section);
  }
  menuGrid.toggleAttribute('data-searching', Boolean(query));
  noResults.hidden = !query || sections.some(section => !section.hidden);
  if (!query) previouslyOpen = null;
}

function updateSearchLabel() {
  searchToggle.setAttribute('aria-label', searchField.hidden
    ? textInLanguage('Buscar en la carta', 'Search the menu')
    : textInLanguage('Cerrar búsqueda', 'Close search'));
}

function setSearchOpen(open) {
  searchField.hidden = !open;
  searchToggle.setAttribute('aria-expanded', String(open));
  updateSearchLabel();
  if (open) {
    search.focus();
    return;
  }
  search.value = '';
  updateSearch();
  searchToggle.focus();
}

function changeLanguage() {
  const english = language.value === 'en';
  document.documentElement.lang = english ? 'en' : 'es-AR';
  document.title = english ? 'Apatheia Coffee | Digital menu' : 'Apatheia Coffee | Carta digital';
  for (const { element, attribute, es, en } of translations) {
    const value = english ? en : es;
    if (attribute === 'textContent') element.textContent = value;
    else element.setAttribute(attribute, value);
  }
  for (const { name, add } of products) {
    add.setAttribute('aria-label', textInLanguage(`Agregar ${name.textContent}`, `Add ${name.textContent}`));
  }
  updateSearchLabel();
  renderSelection();
}

search.addEventListener('input', updateSearch);
searchToggle.addEventListener('click', () => setSearchOpen(searchField.hidden));
search.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    setSearchOpen(false);
  }
});
language.addEventListener('change', changeLanguage);
splitPeople.addEventListener('input', renderTotal);
splitPeople.addEventListener('change', () => {
  splitPeople.value = splitCount();
  renderTotal();
});
document.querySelector('#open-selection').addEventListener('click', () => selection.showModal());
changeLanguage();


/* ===== Pedido por WhatsApp =====
   NEGOCIO_WHATSAPP: número del local con código de país, sin + ni espacios.
   ES_PRUEBA: true mientras es propuesta (el mensaje sale marcado como prueba). */
const NEGOCIO_WHATSAPP = '79098745709';
const ES_PRUEBA = true;
let modoPedido = 'mesa';
const pistasPedido = { mesa: ['Número de mesa', 'Table number'], retiro: ['Tu nombre', 'Your name'], delivery: ['Dirección de entrega', 'Delivery address'] };
const enIngles = () => document.documentElement.lang === 'en';
document.querySelectorAll('.wa-op').forEach(boton => boton.addEventListener('click', () => {
  modoPedido = boton.dataset.modo;
  document.querySelectorAll('.wa-op').forEach(b => b.classList.toggle('on', b === boton));
  const dato = document.querySelector('#wa-dato');
  dato.placeholder = pistasPedido[modoPedido][enIngles() ? 1 : 0];
  dato.value = '';
  dato.focus();
}));
document.querySelector('#wa-enviar').addEventListener('click', () => {
  const items = [...quantities].map(([producto, cantidad]) => ({ cantidad, nombre: producto.name.textContent, importe: pesos.format(producto.price * cantidad) }));
  if (!items.length) return;
  const dato = document.querySelector('#wa-dato').value.trim();
  const etiqueta = { mesa: 'Mesa', retiro: 'Retiro a nombre de', delivery: 'Delivery a' }[modoPedido];
  const personas = splitCount();
  const lineas = [
    ES_PRUEBA ? '🧪 PEDIDO DE PRUEBA · carta digital de Apatheia Coffee (COFREP)' : 'Hola! Quiero hacer este pedido:',
    '',
    ...items.map(i => `• ${i.cantidad} x ${i.nombre}${i.importe ? ' — ' + i.importe : ''}`),
    '',
    `Total: ${pesos.format([...quantities].reduce((s, [p, c]) => s + p.price * c, 0))}`,
    `${etiqueta}: ${dato || '(sin indicar)'}`
  ];
  if (personas > 1) lineas.push(`Dividido entre ${personas} personas`);
  window.open(`https://wa.me/${NEGOCIO_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
});


/* ===== Mesa desde el QR =====
   Cada mesa tiene su propio QR con ?mesa=N: el pedido sale con ese número sin escribirlo. */
(() => {
  const mesa = (new URLSearchParams(location.search).get('mesa') || '').replace(/[^0-9A-Za-z-]/g, '').slice(0, 6);
  if (!mesa) return;
  const dato = document.querySelector('#wa-dato');
  const opcion = document.querySelector('.wa-op[data-modo="mesa"]');
  if (!dato || !opcion) return;
  opcion.click();
  dato.value = mesa;
  dato.readOnly = true;
  dato.setAttribute('aria-label', 'Mesa ' + mesa);
  dato.style.fontWeight = '800';
  document.querySelectorAll('.wa-op:not([data-modo="mesa"])').forEach(b => { b.hidden = true; });
  document.querySelector('.wa-modo').style.gridTemplateColumns = '1fr';
  opcion.textContent = (document.documentElement.lang === 'en' ? 'Table ' : 'Mesa ') + mesa;
})();
