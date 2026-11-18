const categories = {
  hamburguesas: { name: ['Hamburguesas', 'Burgers'], tab: ['Hamburguesas', 'Burgers'] },
  combos: { name: ['Combos', 'Combos'], tab: ['Combos', 'Combos'] },
  pizzas: { name: ['Pizzas artesanales', 'Artisan pizzas'], tab: ['Pizzas', 'Pizza'] },
  milanesas: { name: ['Milanesas', 'Milanesas (breaded cutlets)'], tab: ['Milanesas', 'Milanesas'] },
  platos: { name: ['Platos elaborados', 'House specialties'], tab: ['Platos', 'Mains'] },
  gaseosas: { name: ['Gaseosas', 'Soft drinks'], tab: ['Gaseosas', 'Soft drinks'] }
};

const dishes = [
  ['burger-pepinillos', 'hamburguesas', 'Doble con cheddar y pepinillos', null, 'Double cheddar burger with pickles'],
  ['burger-cebolla-morada', 'hamburguesas', 'Doble con cheddar y cebolla morada', null, 'Double cheddar burger with red onion'],
  ['burger-panceta', 'hamburguesas', 'Doble con panceta y salsa', null, 'Double bacon burger with sauce'],
  ['burger-doble-cheddar', 'hamburguesas', 'Doble cheddar', null, 'Double cheddar burger'],
  ['burger-lechuga-tomate', 'hamburguesas', 'Cheddar con lechuga y tomate', null, 'Cheddar burger with lettuce and tomato'],
  ['burger-tomates', 'hamburguesas', 'Doble con tomates asados', null, 'Double burger with roasted tomatoes'],
  ['burger-hongos', 'hamburguesas', 'Doble con hongos', null, 'Double mushroom burger'],
  ['burger-cebolla', 'hamburguesas', 'Doble con cheddar y cebolla grillada', null, 'Double cheddar burger with grilled onions'],
  ['burger-oddyson-extra', 'hamburguesas', 'Hamburguesa con panceta y cebolla', null, 'Bacon and onion burger'],
  ['combo-1', 'combos', 'Combo 1', null],
  ['combo-2', 'combos', 'Combo 2', null],
  ['especial', 'pizzas', 'Pizza especial', 18000, 'House special pizza'],
  ['calabresa', 'pizzas', 'Pizza calabresa', 18000, 'Calabrese pizza'],
  ['mozzarella', 'pizzas', 'Pizza mozzarella', 17500, 'Mozzarella pizza'],
  ['oddy-pizza', 'pizzas', 'La Oddy Pizza', 20500, 'The Oddy Pizza'],
  ['roquefort', 'pizzas', 'Pizza roquefort', 18500, 'Roquefort pizza'],
  ['rucula', 'pizzas', 'Pizza de rúcula y jamón', 20000, 'Arugula and ham pizza'],
  ['capresse', 'pizzas', 'Pizza capresse', 18000, 'Caprese pizza'],
  ['cuatro', 'pizzas', 'Pizza 4 quesos', 19000, 'Four-cheese pizza'],
  ['napolitana', 'milanesas', 'Milanesa napolitana', 18500, 'Neapolitan-style milanesa'],
  ['verdeo', 'milanesas', 'Milanesa con crema de verdeo', 18500, 'Milanesa with scallion cream sauce'],
  ['oddy-mila', 'milanesas', 'Milanesa Oddyson', 19000, 'Oddyson milanesa'],
  ['royal', 'milanesas', 'Milanesa royal', 18500, 'Royal milanesa'],
  ['champinones', 'milanesas', 'Milanesa con crema de champiñones', 19000, 'Milanesa with mushroom cream sauce'],
  ['caballo', 'milanesas', 'Milanesa a caballo', 18500, 'Milanesa topped with fried eggs'],
  ['pimienta', 'platos', 'Ribeye steak a la pimienta', 18000, 'Ribeye steak with pepper sauce'],
  ['morrones', 'platos', 'Ribeye steak con morrones asados', 18000, 'Ribeye steak with roasted peppers'],
  ['ribeye-verdeo', 'platos', 'Ribeye steak con crema de verdeo', 18000, 'Ribeye steak with scallion cream sauce'],
  ['fanta', 'gaseosas', 'Fanta', 3800],
  ['sprite', 'gaseosas', 'Sprite', 3800],
  ['coca', 'gaseosas', 'Coca-Cola', 3800],
  ['zero', 'gaseosas', 'Coca-Cola Zero', 3800]
].map(([id, category, name, price, nameEn = name]) => ({ id, category, name, nameEn, price }));

const alternatePhotos = { mozzarella: 'pizza-detalle' };

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
  document.title = t('ODDYSON | Carta digital', 'ODDYSON | Digital menu');
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
  return `<img draggable="false" class="food ${dish.category === 'gaseosas' ? 'drink' : ''}" src="fotos/${dish.id}.webp" alt="${alt}" ${lazy ? 'loading="lazy"' : ''}>`;
}

function card(dish) {
  return `<article class="card">
    <button type="button" tabindex="-1" class="card-media tilt" aria-label="${t('Ver', 'View')} ${dishName(dish)}" data-view="${dish.id}">${photo(dish)}</button>
    <div class="card-body">
      <button type="button" class="card-name" data-view="${dish.id}">${dishName(dish)}</button>
      <div class="card-bottom">
        ${dish.price === null ? '' : `<span class="price">${money.format(dish.price)}</span>`}
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
    const matches = dishes.filter(dish => dish.category === key && terms.every(term => [dish.name, dish.nameEn].some(name => normalize(name).includes(term))));
    if (!matches.length) return '';
    const title = category === 'all' ? `<h3>${t(...group.name)}</h3>` : '';
    return `<section class="group" data-menu-group="${key}" aria-label="${t(...group.name)}">${title}<div class="grid">${matches.map(card).join('')}</div></section>`;
  });
  menu.innerHTML = sections.filter(Boolean).join('') || `<p class="empty" role="status">${t('No encontramos platos con esa búsqueda.', 'No dishes match your search.')}</p>`;
}

function viewDish(dish) {
  query('#dish-content').innerHTML = `<div class="dish-media tilt">${photo(dish, { lazy: false, alt: dishName(dish) })}</div>
    <div class="dialog-copy">
      <p class="eyebrow">${t(...categories[dish.category].name)}</p>
      <h2 id="dish-title">${dishName(dish)}</h2>
      <div class="dish-actions">${dish.price === null ? '' : `<strong class="price">${money.format(dish.price)}</strong>`}
        <button class="primary" data-add="${dish.id}">${t('Sumar a mi selección', 'Add to my selection')}</button>
      </div>
      <p class="source-note">${t('Consultá ingredientes y alérgenos con el local.', 'Ask our team about ingredients and allergens.')}</p>
    </div>`;
  const alternate = alternatePhotos[dish.id];
  if (alternate) {
    const img = dishDialog.querySelector('.food');
    const controls = document.createElement('button');
    controls.className = 'outline gallery-control';
    controls.type = 'button';
    const nextPhoto = t('Ver otra foto', 'View another photo');
    controls.textContent = nextPhoto;
    let detail = false;
    const flip = () => {
      detail = !detail;
      img.src = 'fotos/' + (detail ? alternate : dish.id) + '.webp';
      img.alt = detail ? t('Porción de pizza mozzarella con queso fundido', 'Slice of mozzarella pizza with melted cheese') : dishName(dish);
      controls.textContent = detail ? t('Volver a la primera foto', 'Back to the first photo') : nextPhoto;
    };
    controls.addEventListener('click', flip);
    dishDialog.querySelector('.dish-actions').after(controls);
    const frame = dishDialog.querySelector('.dish-media');
    let start;
    frame.addEventListener('pointerdown', event => {
      start = { x: event.clientX, y: event.clientY };
      frame.setPointerCapture(event.pointerId);
    });
    frame.addEventListener('pointerup', event => {
      if (start && Math.abs(event.clientX - start.x) > 45 && Math.abs(event.clientY - start.y) < 65) flip();
      start = null;
    });
    frame.addEventListener('pointercancel', () => { start = null; });
  }
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
  const hasPendingPrices = selected.some(dish => dish.price === null);
  query('#count').textContent = [...quantities.values()].reduce((sum, count) => sum + count, 0);
  if (!selection.open) return;
  const itemList = query('#selection-items');
  const focus = document.activeElement.closest('[data-change]');
  itemList.innerHTML = selected.map(dish => `<div class="selection-row">
    <div><strong>${dishName(dish)}</strong>${dish.price === null ? '' : `<small>${money.format(dish.price * quantities.get(dish.id))}</small>`}</div>
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
  query('#selection-summary').hidden = selected.length === 0 || hasPendingPrices;
  query('#pending-prices').hidden = !hasPendingPrices;
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
   ES_PRUEBA: true mientras es propuesta (el mensaje sale marcado como prueba). */
const NEGOCIO_WHATSAPP = '5492281366860';
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
  const items = dishes.filter(dish => quantities.has(dish.id)).map(dish => ({ cantidad: quantities.get(dish.id), nombre: dish.name, importe: dish.price === null ? '' : money.format(dish.price * quantities.get(dish.id)) }));
  if (!items.length) return;
  const dato = document.querySelector('#wa-dato').value.trim();
  const etiqueta = { mesa: 'Mesa', retiro: 'Retiro a nombre de', delivery: 'Delivery a' }[modoPedido];
  const personas = Number(people.value) || 1;
  const lineas = [
    ES_PRUEBA ? '🧪 PEDIDO DE PRUEBA · carta digital de ODDYSON (COFREP)' : 'Hola! Quiero hacer este pedido:',
    '',
    ...items.map(i => `• ${i.cantidad} x ${i.nombre}${i.importe ? ' — ' + i.importe : ''}`),
    '',
    `Total: ${money.format(subtotal())}`,
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
