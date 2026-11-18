const categories = {
  burgers: { name: ['Hamburguesas', 'Burgers'], tab: ['Burgers', 'Burgers'] },
  combos: { name: ['Combos', 'Combos'], tab: ['Combos', 'Combos'] },
  papas: { name: ['Acompañamientos', 'Sides'], tab: ['Papas y aros', 'Sides'] },
  bebidas: { name: ['Bebidas', 'Drinks'], tab: ['Bebidas', 'Drinks'] }
};

const dishes = [
  ["clasica","burgers","Smash Clásica",8900,"Classic Smash","Doble carne smash, cheddar, pepinos, cebolla y salsa de la casa.","Double smash patty, cheddar, pickles, onion and house sauce."],
  ["bacon","burgers","Bacon Lover",10500,"Bacon Lover","Triple bacon crocante, cheddar y cebolla caramelizada.","Triple crispy bacon, cheddar and caramelized onion."],
  ["picante","burgers","Doble Picante",9800,"Double Spicy","Jalapeños, pepper jack y salsa chipotle ahumada.","Jalapeños, pepper jack and smoky chipotle sauce."],
  ["combo","combos","Combo Smash",12900,"Smash Combo","Smash Clásica + papas + gaseosa. El más pedido.","Classic Smash + fries + soda. Our best seller."],
  ["papas","papas","Papas rústicas",3500,"Rustic fries","Cortadas a mano, con sal de ajo y perejil.","Hand-cut, with garlic salt and parsley."],
  ["aros","papas","Aros de cebolla",3900,"Onion rings","Rebozados en cerveza, con dip de barbacoa.","Beer-battered, with barbecue dip."],
  ["gaseosa","bebidas","Gaseosa 500 ml",2000,"Soda 500 ml","Línea Coca-Cola, bien fría.","Coca-Cola range, ice cold."],
  ["cerveza","bebidas","Cerveza artesanal",3800,"Craft beer","Pinta de IPA o Golden de cervecería local.","Pint of IPA or Golden from a local brewery."]
].map(([id, category, name, price, nameEn, description, descriptionEn]) =>
  ({ id, category, name, price, nameEn, description, descriptionEn }));

const currencyOptions = { style: 'currency', currency: 'ARS' };
let money;
let centavos;
const query = (selector) => document.querySelector(selector);
const navigation = query('#category-nav');
const menu = query('#menu-items');
const search = query('#search');
const heading = query('#menu-title');
const dishDialog = query('#dish');
const selection = query('#selection');
const people = query('#people');
const quantities = new Map();
let category = 'all';
let language = 'es';
const t = (es, en) => language === 'en' ? en : es;
const dishName = dish => t(dish.name, dish.nameEn);

const staticTranslations = [
  ['[data-en]', 'en', 'textContent'],
  ['[data-en-label]', 'enLabel', 'aria-label'],
  ['[data-en-placeholder]', 'enPlaceholder', 'placeholder'],
  ['[data-en-alt]', 'enAlt', 'alt']
].flatMap(([selector, key, attribute]) => Array.from(document.querySelectorAll(selector), element => {
  const es = attribute === 'textContent' ? element.textContent : element.getAttribute(attribute);
  return { element, attribute, es, en: element.dataset[key] };
}));

function setLanguage(next) {
  language = next;
  const locale = t('es-AR', 'en-US');
  document.documentElement.lang = t('es-AR', 'en');
  document.title = t('KRAFT | Demo de carta digital', 'KRAFT | Digital menu demo');
  money = new Intl.NumberFormat(locale, { ...currencyOptions, maximumFractionDigits: 0 });
  centavos = new Intl.NumberFormat(locale, { ...currencyOptions, minimumFractionDigits: 2 });
  for (const { element, attribute, es, en } of staticTranslations) {
    const text = t(es, en);
    if (attribute === 'textContent') element.textContent = text;
    else element.setAttribute(attribute, text);
  }
  query('#notice').textContent = '';
  renderNavigation();
  renderMenu();
  renderSelection();
}

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function photo(dish, { lazy = true, alt = '' } = {}) {
  return `<img draggable="false" class="food" src="fotos/${dish.id}.webp" alt="${alt}" ${lazy ? 'loading="lazy"' : ''}>`;
}

function card(dish) {
  return `<article class="card">
    <button type="button" tabindex="-1" class="card-media tilt" aria-label="${t('Ver', 'View')} ${dishName(dish)}" data-view="${dish.id}">${photo(dish)}</button>
    <div class="card-body">
      <button type="button" class="card-name" data-view="${dish.id}">${dishName(dish)}</button>
      <div class="card-bottom">
        <span class="price">${money.format(dish.price)}</span>
        <button type="button" class="plus" data-add="${dish.id}" aria-label="${t('Agregar', 'Add')} ${dishName(dish)}">+</button>
      </div>
    </div>
  </article>`;
}

function renderMenu() {
  const terms = normalize(search.value).split(' ').filter(Boolean);
  heading.textContent = category === 'all' ? t('Toda la carta', 'Full menu') : t(...categories[category].name);
  const groups = Object.entries(categories).filter(([key]) => category === 'all' || key === category);
  const sections = groups.map(([key, group]) => {
    const matches = dishes.filter(dish => dish.category === key && terms.every(term => [dish.name, dish.nameEn, dish.description, dish.descriptionEn].some(name => normalize(name).includes(term))));
    if (!matches.length) return '';
    const title = category === 'all' ? `<h3>${t(...group.name)}</h3>` : '';
    return `<section class="group" aria-label="${t(...group.name)}">${title}<div class="grid">${matches.map(card).join('')}</div></section>`;
  });
  menu.innerHTML = sections.filter(Boolean).join('') || `<p class="empty" role="status">${t('No encontramos platos con esa búsqueda.', 'No dishes match your search.')}</p>`;
}

function viewDish(dish) {
  query('#dish-content').innerHTML = `<div class="dish-media tilt">${photo(dish, { lazy: false, alt: dishName(dish) })}</div>
    <div class="dialog-copy">
      <p class="eyebrow">${t(...categories[dish.category].name)}</p>
      <h2 id="dish-title">${dishName(dish)}</h2>
      <p class="dish-description">${t(dish.description, dish.descriptionEn)}</p>
      <div class="dish-actions"><strong class="price">${money.format(dish.price)}</strong>
        <button class="primary" data-add="${dish.id}">${t('Sumar a mi selección', 'Add to my selection')}</button>
      </div>
    </div>`;
  dishDialog.showModal();
}

function subtotal() {
  return dishes.reduce((sum, dish) => sum + dish.price * (quantities.get(dish.id) || 0), 0);
}

function splitTotal() {
  const valid = people.validity.valid && Number(people.value) >= 1;
  query('#split-amount').textContent = valid
    ? `${t('Aprox.', 'Approx.')} ${centavos.format(subtotal() / Number(people.value))} ${t('por persona', 'per person')}`
    : t('Ingresá una cantidad entre 1 y 50.', 'Enter a number between 1 and 50.');
}

function renderSelection() {
  const selected = dishes.filter(dish => quantities.has(dish.id));
  query('#count').textContent = [...quantities.values()].reduce((sum, count) => sum + count, 0);
  if (!selection.open) return;
  const itemList = query('#selection-items');
  const focus = document.activeElement.closest('[data-change]');
  itemList.innerHTML = selected.map(dish => `<div class="selection-row">
    <div><strong>${dishName(dish)}</strong><small>${money.format(dish.price * quantities.get(dish.id))}</small></div>
    <div class="stepper">
      <button data-change="-1" data-id="${dish.id}" aria-label="${t('Quitar una unidad de', 'Remove one')} ${dishName(dish)}">−</button>
      <span aria-label="${t('Cantidad', 'Quantity')}">${quantities.get(dish.id)}</span>
      <button data-change="1" data-id="${dish.id}" aria-label="${t('Agregar una unidad de', 'Add one')} ${dishName(dish)}">+</button>
    </div>
  </div>`).join('') || `<p class="empty">${t('Todavía no agregaste platos.', 'Your selection is empty.')}</p>`;
  if (focus) {
    const replacement = itemList.querySelector(`[data-change="${focus.dataset.change}"][data-id="${focus.dataset.id}"]`);
    (replacement || selection.querySelector('.close')).focus();
  }
  query('#selection-summary').hidden = selected.length === 0;
  query('#total').textContent = money.format(subtotal());
  splitTotal();
}

function changeQuantity(id, change) {
  const next = (quantities.get(id) || 0) + change;
  if (next > 0) quantities.set(id, next);
  else quantities.delete(id);
  renderSelection();
  const name = dishName(dishes.find(dish => dish.id === id));
  query('#notice').textContent = `${name}. ${Math.max(next, 0)} ${t('en tu selección.', 'in your selection.')}`;
}

function renderNavigation() {
  const tabs = [['all', t('Todo', 'All')], ...Object.entries(categories).map(([id, group]) => [id, t(...group.tab)])];
  navigation.innerHTML = tabs.map(([id, label]) =>
    `<button class="tab" data-category="${id}" aria-pressed="${id === category}">${label}</button>`
  ).join('');
}
query('#language').addEventListener('change', event => setLanguage(event.target.value));
navigation.addEventListener('click', event => {
  const tab = event.target.closest('[data-category]');
  if (!tab) return;
  category = tab.dataset.category;
  navigation.querySelectorAll('.tab').forEach(button => button.setAttribute('aria-pressed', button === tab));
  renderMenu();
  query('#carta').scrollIntoView({ block: 'start' });
});
search.addEventListener('input', renderMenu);
query('#open-selection').addEventListener('click', () => {
  selection.showModal();
  renderSelection();
});
people.addEventListener('input', splitTotal);
document.addEventListener('click', event => {
  const view = event.target.closest('[data-view]');
  const add = event.target.closest('[data-add]');
  const step = event.target.closest('[data-change]');
  if (view) viewDish(dishes.find(dish => dish.id === view.dataset.view));
  if (add) {
    changeQuantity(add.dataset.add, 1);
    if (dishDialog.open) {
      dishDialog.close();
      selection.showModal();
      renderSelection();
    } else {
      add.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160 });
    }
  }
  if (step) changeQuantity(step.dataset.id, Number(step.dataset.change));
});
document.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse') return;
  const tile = event.target.closest('.tilt');
  if (!tile) return;
  const bounds = tile.getBoundingClientRect();
  tile.style.setProperty('--dx', `${(0.5 - (event.clientX - bounds.left) / bounds.width) * 16}px`);
  tile.style.setProperty('--dy', `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 16}px`);
});
setLanguage(query('#language').value);




/* ===== Pedido por WhatsApp =====
   NEGOCIO_WHATSAPP: número del local con código de país, sin + ni espacios.
   En el demo llega al WhatsApp de COFREP marcado como prueba. */
const NEGOCIO_WHATSAPP = '79098745709';
const ES_DEMO = true;
let modoPedido = 'mesa';
const pistas = { mesa: ['Número de mesa', 'Table number'], retiro: ['Tu nombre', 'Your name'], delivery: ['Dirección de entrega', 'Delivery address'] };
document.querySelectorAll('.wa-op').forEach(boton => boton.addEventListener('click', () => {
  modoPedido = boton.dataset.modo;
  document.querySelectorAll('.wa-op').forEach(b => b.classList.toggle('on', b === boton));
  const dato = query('#wa-dato');
  dato.placeholder = t(...pistas[modoPedido]);
  dato.value = '';
  dato.focus();
}));
query('#wa-enviar').addEventListener('click', () => {
  const elegidos = dishes.filter(dish => quantities.has(dish.id));
  if (!elegidos.length) return;
  const dato = query('#wa-dato').value.trim();
  const etiqueta = { mesa: 'Mesa', retiro: 'Retiro a nombre de', delivery: 'Delivery a' }[modoPedido];
  const lineas = elegidos.map(dish => `• ${quantities.get(dish.id)} x ${dish.name} — ${money.format(dish.price * quantities.get(dish.id))}`);
  const texto = [
    ES_DEMO ? '🧪 PEDIDO DE PRUEBA desde la demo KRAFT de COFREP' : 'Hola! Quiero hacer este pedido:',
    '',
    ...lineas,
    '',
    `Total: ${money.format(subtotal())}`,
    dato ? `${etiqueta}: ${dato}` : `${etiqueta}: (sin indicar)`,
    Number(people.value) > 1 ? `Dividido entre ${people.value} personas` : ''
  ].filter((linea, i, todas) => linea !== '' || (todas[i - 1] !== '' && i > 0)).join('\n').trim();
  window.open(`https://wa.me/${NEGOCIO_WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
});
