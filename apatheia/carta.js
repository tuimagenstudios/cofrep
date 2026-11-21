/* =============================================================
   APATHEIA COFFEE · Carta digital (boceto "Visual Silence")
   1) NEGOCIO: datos del local (WhatsApp, horario, dirección).
   2) CARTA: productos de muestra. Si index.html tiene la planilla
      de Google en <meta name="cofrep-planilla">, se reemplazan
      por los de la planilla (columnas: Categoría, Producto,
      Descripción, Precio, Mostrar, Etiqueta).
   ============================================================= */
(function () {
  'use strict';

  /* ---------- 1. Datos del local ---------- */
  var NEGOCIO = {
    nombre: 'Apatheia Coffee',
    whatsapp: '',            // número completo con 549 (el de wa.link/5i7ob8). Vacío = modo muestra.
    horario: 'Abierto de lunes a lunes',
    direccion: 'Rubén César de Paula 569, Azul',
    wifi: 'Pet friendly',
    moneda: 'ARS'
  };

  /* ---------- 2. Carta (precios de muestra) ----------
     foto = foto propia del local para la sección o el producto (carpeta fotos/).
     tipo = dibujo lineal del sello (espresso, leche, frio, horno, dulce, salado). */
  var SECCIONES = [
    { nombre: 'Cafetería', bajada: 'Café de especialidad, frío o caliente.', foto: 'fotos/cafe.webp', items: [
      { nombre: 'Latte', precio: 4500, desc: 'Espresso, leche texturizada y una capa fina de espuma.', tipo: 'leche' },
      { nombre: 'Cappuccino', precio: 4800, desc: 'Partes iguales de café, leche y espuma.', tipo: 'leche' },
      { nombre: 'Latte de caramelo', precio: 5400, desc: 'Nuestro latte con caramelo.', tipo: 'leche' },
      { nombre: 'Café frío', precio: 5300, desc: 'Café con hielo, en vaso de vidrio.', tipo: 'frio', foto: 'fotos/cafe.webp' }
    ]},
    { nombre: 'Pastelería', bajada: 'Tortas de la casa, en porción.', foto: 'fotos/pasteleria.webp', items: [
      { nombre: 'Cheesecake de frutos rojos', precio: 8500, desc: 'Base crocante, queso crema y frutos rojos.', tipo: 'dulce' },
      { nombre: 'Pavlova', precio: 7800, desc: 'Merengue, crema y frutas.', tipo: 'dulce' },
      { nombre: 'Chocotorta', precio: 7400, desc: 'Galletitas de chocolate, dulce de leche y queso crema.', tipo: 'dulce', foto: 'fotos/chocotorta.webp' },
      { nombre: 'Choco Oreo', precio: 7900, desc: 'Chocolate y galletitas Oreo.', tipo: 'dulce', foto: 'fotos/seleccion-tortas.webp' },
      { nombre: 'Carrot cake', precio: 7500, desc: 'Zanahoria, especias y frosting de queso.', tipo: 'dulce' },
      { nombre: 'Ferrero Rocher', precio: 8900, desc: 'Chocolate, avellanas y bombones Ferrero.', tipo: 'dulce', foto: 'fotos/ferrero.webp' },
      { nombre: 'Red Velvet', precio: 8200, desc: 'Bizcocho rojo y crema de queso.', tipo: 'dulce', foto: 'fotos/seleccion-tortas.webp' },
      { nombre: 'Marquise de frutos rojos', precio: 8400, desc: 'Chocolate intenso, crema y frutos rojos.', tipo: 'dulce' },
      { nombre: 'Torta cookie', precio: 7600, desc: 'Masa de cookie con chips de chocolate.', tipo: 'dulce' },
      { nombre: 'Key lime', precio: 7800, desc: 'Crema de lima sobre base crocante.', tipo: 'dulce', foto: 'fotos/seleccion-tortas.webp' },
      { nombre: 'Lemon pie', precio: 7200, desc: 'Crema de limón y merengue.', tipo: 'dulce' },
      { nombre: 'Rogel', precio: 8000, desc: 'Capas finas, dulce de leche y merengue.', tipo: 'dulce' }
    ]},
    { nombre: 'Salados', bajada: 'Para el mediodía o la merienda.', foto: 'fotos/salados.webp', items: [
      { nombre: 'Sándwich en focaccia', precio: 10500, desc: 'Focaccia de la casa, tibia y rellena.', tipo: 'salado', foto: 'fotos/salados.webp' },
      { nombre: 'Ensaladas', precio: 9800, desc: 'Consultá la ensalada del día.', tipo: 'salado' }
    ]}
  ];

  /* ---------- Fotos propias del local ---------- */
  var FOTOS = {
    espresso: 'fotos/cafe.webp', leche: 'fotos/cafe.webp', filtro: 'fotos/cafe.webp', frio: 'fotos/cafe.webp', te: 'fotos/cafe.webp',
    horno: 'fotos/medialunas.webp', dulce: 'fotos/pasteleria.webp', salado: 'fotos/salados.webp'
  };
  var fotoDe = function (tipo) { return FOTOS[tipo] || FOTOS.espresso; };

  /* ---------- Dibujos lineales (iconografía minimalista) ---------- */
  var DIBUJOS = {
    espresso: '<path d="M18 30h24v8c0 7-5 12-12 12s-12-5-12-12zM42 33h3c4 0 4 8 0 8h-3M12 54h36"/><path d="M26 24c-2-3 2-5 0-8M33 24c-2-3 2-5 0-8"/>',
    leche: '<path d="M20 20h24l-3 34H23zM21 30h22"/><path d="M28 14c-2-3 2-5 0-8M36 14c-2-3 2-5 0-8"/>',
    filtro: '<path d="M16 16h32L36 34h-8zM28 34v4h8v-4M20 40h24v14H20zM48 44h3c3 0 3 6 0 6h-3"/>',
    frio: '<path d="M20 14h24l-3 40H23zM25 26h7v7h-7zM33 34h7v7h-7zM40 6l-6 20"/>',
    te: '<path d="M16 28h30v6c0 9-7 16-15 16s-15-7-15-16zM46 31h3c4 0 4 8 0 8h-3M31 28V16M31 16h-4v-6h8v6z"/>',
    horno: '<path d="M10 40c6-14 14-20 22-20s16 6 22 20c-6 4-12 4-22 4s-16 0-22-4z"/><path d="M24 24l4 18M40 24l-4 18M32 20v24"/>',
    dulce: '<path d="M12 44l40-14v14zM12 44v6h40v-6M12 44l28-24 12 10"/>',
    salado: '<path d="M10 46h44M14 46c0-14 8-24 18-24s18 10 18 24M20 36h24M32 22v-6"/>'
  };
  function dibujo(tipo) {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (DIBUJOS[tipo] || DIBUJOS.espresso).replace(/<path /g, '<path pathLength="1" ') + '</svg>';
  }

  /* ---------- Idioma (Español / English) ----------
     EN_CARTA traduce los productos y secciones escritos acá. Si la planilla
     trae columnas en inglés (Producto EN, Descripción EN, Categoría EN,
     Etiqueta EN), esas mandan. Lo que no tenga traducción sale en español. */
  var EN_CARTA = {
    secciones: {
      'cafeteria': ['Coffee', 'Specialty coffee, hot or iced.'],
      'pasteleria': ['Pastries', 'House cakes, by the slice.'],
      'salados': ['Savory', 'For lunch or an afternoon snack.']
    },
    productos: {
      'latte': ['Latte', 'Espresso, steamed milk and a thin layer of foam.'],
      'cappuccino': ['Cappuccino', 'Equal parts coffee, milk and foam.'],
      'latte-de-caramelo': ['Caramel latte', 'Our latte with caramel.'],
      'cafe-frio': ['Iced coffee', 'Coffee over ice, served in a glass.'],
      'cheesecake-de-frutos-rojos': ['Berry cheesecake', 'Crunchy base, cream cheese and red berries.'],
      'pavlova': ['Pavlova', 'Meringue, cream and fruit.'],
      'chocotorta': ['Chocotorta', 'An Argentine classic: chocolate cookies, dulce de leche and cream cheese.'],
      'choco-oreo': ['Choco Oreo', 'Chocolate and Oreo cookies.'],
      'carrot-cake': ['Carrot cake', 'Carrot, spices and cream cheese frosting.'],
      'ferrero-rocher': ['Ferrero Rocher', 'Chocolate, hazelnuts and Ferrero chocolates.'],
      'red-velvet': ['Red Velvet', 'Red sponge cake with cream cheese frosting.'],
      'marquise-de-frutos-rojos': ['Berry marquise', 'Rich chocolate, cream and red berries.'],
      'torta-cookie': ['Cookie cake', 'Cookie dough cake with chocolate chips.'],
      'key-lime': ['Key lime pie', 'Lime cream on a crunchy base.'],
      'lemon-pie': ['Lemon pie', 'Lemon cream and meringue.'],
      'rogel': ['Rogel', 'An Argentine classic: thin crisp layers, dulce de leche and meringue.'],
      'sandwich-en-focaccia': ['Focaccia sandwich', 'House focaccia, warm and filled.'],
      'ensaladas': ['Salads', 'Ask for the salad of the day.']
    },
    etiquetas: { 'nuevo': 'New', 'nueva': 'New', 'de-la-casa': 'House favorite', 'recomendado': 'Recommended', 'sin-tacc': 'Gluten free', 'vegano': 'Vegan', 'vegana': 'Vegan', 'del-dia': 'Of the day' }
  };

  var TXT = {
    es: {
      skip: 'Ir a la carta', seleccion: 'Selección', heroEyebrow: 'Cafetería y pastelería de especialidad',
      heroH1: 'Café, pastelería<br><span>y un poco de calma.</span>',
      heroBajada: 'Apatheia es armonía, paz y libertad: sentirnos vivos y completos en el momento presente. Vení a vivirlo con un café y algo dulce.',
      verCarta: 'Ver la carta <span aria-hidden="true">↓</span>', portadaAlt: 'Café para llevar de Apatheia junto a flores y una caja de pastelería',
      figcaption: 'Nuestra casa · Azul, Buenos Aires', horario: 'Horario', direccion: 'Dirección', mascotas: 'Mascotas',
      avisoDemo: 'Precios de muestra en ARS. Los precios y productos definitivos se cargan desde la planilla del local.',
      eventosEyebrow: 'Eventos en Apatheia', eventosH2: 'Un café<br>para crear.',
      evento1: '<span class="num">01 · Art and Coffee</span> Pintá una pieza y compartí una merienda con café. Incluye materiales y una guía paso a paso.',
      evento2: '<span class="num">02 · Coffee and Journaling</span> Un encuentro de escritura libre para compartir una pausa con un café.',
      evento3: '<span class="num">03 · Próximos encuentros</span> Las fechas y los cupos se anuncian en Instagram. <a class="link-flecha" href="https://www.instagram.com/apatheia.coffee_/" target="_blank" rel="noopener">Consultá fechas <span aria-hidden="true">↗</span></a>',
      pieFrase: 'La armonía también<br>se comparte.', comoLlegar: 'Cómo llegar ↗', fotos: 'Fotos: Apatheia Coffee',
      verSeleccion: 'Ver selección <span aria-hidden="true">→</span>', tuSeleccion: 'Tu selección', paraMomento: 'Para este momento.', paraMesa: 'Para la mesa {n}.',
      tuNombre: 'Tu nombre', nombrePh: '¿Cómo te llamás?', donde: '¿Dónde lo disfrutás?', enSalon: 'En el salón', paraLlevar: 'Para llevar',
      numMesa: 'Número de mesa', opcional: '(opcional)', notas: 'Notas', notasPh: 'Sin azúcar, para llevar a las 17 h…',
      pedidoMuestra: 'Pedido de muestra', copiar: 'Copiar', vaciar: 'Vaciar selección', total: 'Total', cerrar: 'Cerrar',
      mostrarMozo: 'Mostrale esta lista a quien te atiende en la mesa.',
      infoWa: 'Se abrirá WhatsApp con tu pedido para que el local lo confirme.',
      preparar: 'Preparar pedido', enviarWa: 'Enviar por WhatsApp',
      producto: 'producto', productos: 'productos', enSeleccion: 'en tu selección', agregar: 'Agregar', agregado: 'agregado',
      legal: 'Consultá alérgenos y disponibilidad en la barra.', vacia: 'Todavía no elegiste nada. Tocá un producto para ver su ficha.',
      quitarUno: 'Quitar uno', sumarUno: 'Sumar uno', faltaNombre: 'Escribí tu nombre para preparar el pedido',
      copiado: 'Pedido copiado. No se envió al local.', copiaManual: 'Seleccionamos el texto: copialo desde el menú de tu teléfono.',
      vaciada: 'Selección vacía', noche: 'Noche', dia: 'Día', aNoche: 'Cambiar a modo noche', aDia: 'Cambiar a modo día',
      otroIdioma: 'EN', otroIdiomaAria: 'Read the menu in English', titulo: 'Apatheia Coffee | Carta'
    },
    en: {
      skip: 'Skip to menu', seleccion: 'My list', heroEyebrow: 'Specialty coffee & pastry shop',
      heroH1: 'Coffee, pastries<br><span>and a little calm.</span>',
      heroBajada: 'Apatheia means harmony, peace and freedom: feeling alive and whole in the present moment. Come and enjoy it with a coffee and something sweet.',
      verCarta: 'See the menu <span aria-hidden="true">↓</span>', portadaAlt: 'Apatheia takeaway coffee next to flowers and a pastry box',
      figcaption: 'Our place · Azul, Buenos Aires', horario: 'Hours', direccion: 'Address', mascotas: 'Pets',
      avisoDemo: 'Sample prices in ARS (Argentine pesos). Final prices and products are loaded from the shop’s sheet.',
      eventosEyebrow: 'Events at Apatheia', eventosH2: 'A coffee<br>to create.',
      evento1: '<span class="num">01 · Art and Coffee</span> Paint a piece and share an afternoon snack with coffee. Materials and a step-by-step guide included.',
      evento2: '<span class="num">02 · Coffee and Journaling</span> A free-writing gathering to share a pause over coffee.',
      evento3: '<span class="num">03 · Upcoming events</span> Dates and spots are announced on Instagram. <a class="link-flecha" href="https://www.instagram.com/apatheia.coffee_/" target="_blank" rel="noopener">See dates <span aria-hidden="true">↗</span></a>',
      pieFrase: 'Harmony is also<br>meant to be shared.', comoLlegar: 'Directions ↗', fotos: 'Photos: Apatheia Coffee',
      verSeleccion: 'View list <span aria-hidden="true">→</span>', tuSeleccion: 'Your list', paraMomento: 'For this moment.', paraMesa: 'For table {n}.',
      tuNombre: 'Your name', nombrePh: 'What’s your name?', donde: 'Where will you enjoy it?', enSalon: 'Eat in', paraLlevar: 'Takeaway',
      numMesa: 'Table number', opcional: '(optional)', notas: 'Notes', notasPh: 'No sugar, pick up at 5 pm…',
      pedidoMuestra: 'Sample order', copiar: 'Copy', vaciar: 'Clear list', total: 'Total', cerrar: 'Close',
      mostrarMozo: 'Show this list to your server at the table.',
      infoWa: 'WhatsApp will open with your order so the shop can confirm it.',
      preparar: 'Prepare order', enviarWa: 'Send via WhatsApp',
      producto: 'item', productos: 'items', enSeleccion: 'on your list', agregar: 'Add', agregado: 'added',
      legal: 'Ask at the counter about allergens and availability.', vacia: 'Nothing here yet. Tap a product to see its details.',
      quitarUno: 'Remove one', sumarUno: 'Add one', faltaNombre: 'Please type your name to prepare the order',
      copiado: 'Order copied. It was not sent to the shop.', copiaManual: 'Text selected: copy it from your phone’s menu.',
      vaciada: 'List cleared', noche: 'Night', dia: 'Day', aNoche: 'Switch to night mode', aDia: 'Switch to day mode',
      otroIdioma: 'ES', otroIdiomaAria: 'Ver la carta en español', titulo: 'Apatheia Coffee | Menu'
    }
  };
  var idioma = 'es';
  var mesaFija = '';
  var txt = function (k) { return (TXT[idioma] && TXT[idioma][k]) || TXT.es[k] || k; };
  var slugT = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  // Nombre, descripción, bajada y etiqueta en el idioma elegido
  function nom(x) {
    if (idioma !== 'en') return x.nombre;
    if (x.nombre_en) return x.nombre_en;
    var d = EN_CARTA.productos[slugT(x.nombre)] || EN_CARTA.secciones[slugT(x.nombre)];
    return d ? d[0] : x.nombre;
  }
  function des(x) {
    if (idioma !== 'en') return x.desc;
    if (x.desc_en) return x.desc_en;
    var d = EN_CARTA.productos[slugT(x.nombre)];
    return d && d[1] ? d[1] : x.desc;
  }
  function baj(s) {
    if (idioma !== 'en') return s.bajada;
    var d = EN_CARTA.secciones[slugT(s.nombre)];
    return d && d[1] ? d[1] : s.bajada;
  }
  function etq(x) {
    if (!x.etiqueta || idioma !== 'en') return x.etiqueta;
    return x.etiqueta_en || EN_CARTA.etiquetas[slugT(x.etiqueta)] || x.etiqueta;
  }

  function aplicarIdioma(l) {
    idioma = l === 'en' ? 'en' : 'es';
    document.documentElement.lang = idioma;
    document.title = txt('titulo');
    document.querySelectorAll('[data-t]').forEach(function (el) { el.innerHTML = txt(el.dataset.t); });
    document.querySelectorAll('[data-t-ph]').forEach(function (el) { el.placeholder = txt(el.dataset.tPh); });
    document.querySelectorAll('[data-t-alt]').forEach(function (el) { el.alt = txt(el.dataset.tAlt); });
    document.querySelectorAll('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', txt(el.dataset.tAria)); });
    var b = $('#idioma');
    if (b) { b.textContent = txt('otroIdioma'); b.lang = idioma === 'en' ? 'es' : 'en'; b.setAttribute('aria-label', txt('otroIdiomaAria')); }
    $('#sel-h').textContent = mesaFija ? txt('paraMesa').replace('{n}', mesaFija) : txt('paraMomento');
    aplicarTema(document.documentElement.dataset.tema || 'dia');
  }

  /* ---------- Utilidades ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var plata = function (n) { return '$' + Math.round(n).toLocaleString('es-AR'); };
  var dos = function (n) { return (n < 10 ? '0' : '') + n; };
  var slug = function (s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  };
  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leerLS = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  var productos = {};   // id -> producto
  var seleccion = {};   // id -> cantidad
  var CLAVE_SEL = 'apatheia-seleccion';

  function indexar() {
    productos = {};
    SECCIONES.forEach(function (sec) {
      sec.id = slug(sec.nombre);
      sec.items.forEach(function (p) {
        var id = slug(p.nombre), n = 2;
        while (productos[id]) id = slug(p.nombre) + '-' + n++;
        p.id = id;
        p.fotoSeccion = sec.foto;
        productos[id] = p;
      });
    });
    Object.keys(seleccion).forEach(function (id) { if (!productos[id]) delete seleccion[id]; });
  }

  /* ---------- Render de la carta ---------- */
  function render() {
    indexar();
    $('#indice-pista').innerHTML = SECCIONES.map(function (s, i) {
      return '<a href="#' + s.id + '"><span class="num">' + dos(i + 1) + '</span>' + esc(nom(s)) + '</a>';
    }).join('');
    $('#secciones').innerHTML = SECCIONES.map(function (s, i) {
      return '<section class="seccion" id="' + s.id + '" aria-labelledby="h-' + s.id + '">' +
        '<header class="seccion-cab revelar">' +
        '<figure class="seccion-foto"><img src="' + (s.foto || fotoDe(s.items[0] && s.items[0].tipo)) + '" alt="" loading="lazy"></figure>' +
        '<span class="num">' + dos(i + 1) + ' / ' + dos(SECCIONES.length) + '</span>' +
        '<h2 id="h-' + s.id + '">' + esc(nom(s)) + '</h2>' + (baj(s) ? '<p>' + esc(baj(s)) + '</p>' : '') + '</header>' +
        '<ul class="lista">' + s.items.map(itemHTML).join('') + '</ul></section>';
    }).join('');
    observar();
    pintarSeleccion();
  }
  function itemHTML(p, i) {
    var c = seleccion[p.id] || 0;
    return '<li class="item revelar" style="--i:' + (i || 0) + '"><button class="item-btn" type="button" data-prod="' + p.id + '">' +
      '<span class="item-nombre">' + esc(nom(p)) + (p.etiqueta ? '<span class="item-tag">' + esc(etq(p)) + '</span>' : '') + '</span>' +
      '<span class="item-precio">' + plata(p.precio) + '</span>' +
      (des(p) ? '<p class="item-desc">' + esc(des(p)) + '</p>' : '') +
      '<span class="item-cant" data-cant="' + p.id + '"' + (c ? '' : ' hidden') + '>' + c + ' ' + txt('enSeleccion') + '</span>' +
      '</button></li>';
  }

  /* ---------- Ficha de producto ---------- */
  function abrirProducto(id) {
    var p = productos[id]; if (!p) return;
    var notas = p.notas ? '<dl class="prod-notas">' + Object.keys(p.notas).map(function (k) {
      return '<div><dt>' + esc(k) + '</dt><dd>' + esc(p.notas[k]) + '</dd></div>';
    }).join('') + '</dl>' : '';
    $('#prod-cuerpo').innerHTML =
      '<figure class="prod-foto"><img src="' + (p.foto || p.fotoSeccion || fotoDe(p.tipo)) + '" alt=""><span class="prod-sello">' + dibujo(p.tipo) + '</span></figure>' +
      (p.etiqueta ? '<p class="eyebrow">' + esc(etq(p)) + '</p>' : '') +
      '<h2 id="prod-nombre">' + esc(nom(p)) + '</h2>' +
      (des(p) ? '<p class="prod-desc">' + esc(des(p)) + '</p>' : '') + notas +
      '<div class="prod-pie"><span class="prod-precio">' + plata(p.precio) + '</span>' +
      '<button class="btn" type="button" data-sumar="' + p.id + '">' + txt('agregar') + ' <span aria-hidden="true">+</span></button></div>' +
      '<p class="prod-legal">' + txt('legal') + '</p>';
    abrir('prod-dialog');
  }

  /* ---------- Selección ---------- */
  function cambiar(id, d) {
    if (!productos[id]) return;
    var n = (seleccion[id] || 0) + d;
    if (n <= 0) delete seleccion[id]; else seleccion[id] = Math.min(n, 20);
    guardar(CLAVE_SEL, JSON.stringify(seleccion));
    pintarSeleccion();
  }
  function totales() {
    var cant = 0, total = 0;
    Object.keys(seleccion).forEach(function (id) { cant += seleccion[id]; total += seleccion[id] * productos[id].precio; });
    return { cant: cant, total: total };
  }
  function pintarSeleccion() {
    var t = totales();
    $('#sel-num').textContent = t.cant;
    $('#barra-sel').hidden = !t.cant;
    $('#barra-cant').textContent = t.cant + ' ' + (t.cant === 1 ? txt('producto') : txt('productos'));
    $('#barra-total').textContent = plata(t.total);
    $('#sel-total').textContent = plata(t.total);
    document.querySelectorAll('[data-cant]').forEach(function (el) {
      var c = seleccion[el.dataset.cant] || 0;
      el.hidden = !c; el.textContent = c + ' ' + txt('enSeleccion');
    });
    var ids = Object.keys(seleccion);
    $('#sel-lista').innerHTML = ids.length ? ids.map(function (id) {
      var p = productos[id];
      return '<div class="sel-item"><div><div class="sel-item-nombre">' + esc(nom(p)) + '</div>' +
        '<div class="sel-item-precio">' + plata(p.precio * seleccion[id]) + '</div></div>' +
        '<div class="cant"><button type="button" data-cambiar="-1" data-id="' + id + '" aria-label="' + txt('quitarUno') + ': ' + esc(nom(p)) + '">−</button>' +
        '<span>' + seleccion[id] + '</span>' +
        '<button type="button" data-cambiar="1" data-id="' + id + '" aria-label="' + txt('sumarUno') + ': ' + esc(nom(p)) + '">+</button></div></div>';
    }).join('') : '<p class="sel-vacia">' + txt('vacia') + '</p>';
    $('#sel-checkout').hidden = false;
    $('#sel-info').hidden = !ids.length;
    $('.sel-total').hidden = !ids.length;
    $('#sel-vaciar').hidden = !ids.length;
  }
  function textoPedido(datos) {
    var lineas = ['Hola ' + NEGOCIO.nombre + ', quiero pedir:', ''];
    Object.keys(seleccion).forEach(function (id) {
      lineas.push('• ' + seleccion[id] + ' × ' + productos[id].nombre + ' — ' + plata(productos[id].precio * seleccion[id]));
    });
    lineas.push('', 'Total: ' + plata(totales().total));
    lineas.push('Nombre: ' + datos.nombre);
    lineas.push('Modo: ' + datos.modo + (datos.modo === 'Mesa' && datos.mesa ? ' ' + datos.mesa : ''));
    if (datos.notas) lineas.push('Notas: ' + datos.notas);
    if (idioma === 'en') lineas.push('(Cliente que lee la carta en inglés)');
    return lineas.join('\n');
  }

  function destacar(id) {
    var n = $('#sel-num'); n.classList.remove('pulso'); void n.offsetWidth; n.classList.add('pulso');
    var fila = document.querySelector('[data-prod="' + id + '"]');
    if (fila) { var li = fila.parentNode; li.classList.remove('recien'); void li.offsetWidth; li.classList.add('recien'); }
  }

  /* ---------- Diálogos y avisos ---------- */
  function abrir(id) { var d = $('#' + id); if (!d.open) d.showModal(); }
  var tAviso;
  function aviso(txt) {
    var a = $('#aviso'); a.textContent = txt; a.classList.add('visible');
    clearTimeout(tAviso); tAviso = setTimeout(function () { a.classList.remove('visible'); }, 2200);
  }

  /* ---------- Modo noche ---------- */
  function aplicarTema(t) {
    document.documentElement.dataset.tema = t;
    $('meta[name="theme-color"]').setAttribute('content', t === 'noche' ? '#111111' : '#F8F7F4');
    $('.tema-txt').textContent = t === 'noche' ? txt('dia') : txt('noche');
    $('#tema').setAttribute('aria-label', t === 'noche' ? txt('aDia') : txt('aNoche'));
  }

  /* ---------- Entradas progresivas e índice activo ---------- */
  var obsRevelar, obsSeccion;
  function observar() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.revelar').forEach(function (el) { el.classList.add('visto'); }); return;
    }
    if (obsRevelar) obsRevelar.disconnect();
    if (obsSeccion) obsSeccion.disconnect();
    obsRevelar = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); obsRevelar.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.revelar').forEach(function (el) { obsRevelar.observe(el); });
    obsSeccion = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        document.querySelectorAll('.indice a').forEach(function (a) {
          var activo = a.getAttribute('href') === '#' + e.target.id;
          a.setAttribute('aria-current', activo ? 'true' : 'false');
          if (activo) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.seccion').forEach(function (s) { obsSeccion.observe(s); });
  }

  /* ---------- Carta desde Google Sheets ---------- */
  var DESDE_NOMBRE = [
    [/cold|iced|tonic|frio|fria|helad|limonada|jugo/, 'frio'],
    [/v60|chemex|aeropress|filtr|prensa/, 'filtro'],
    [/latte|cappu|capuc|flat|cortado|lagrima|mocha|con leche/, 'leche'],
    [/\bte\b|chai|matcha|infusion|tisana/, 'te'],
    [/croissant|medialuna|pain|factura/, 'horno'],
    [/torta|cake|cheese|brownie|budin|alfajor|cookie|postre|tarta/, 'dulce'],
    [/tostad|sandw|toast|wrap|bowl|ensalada|huevo|salado/, 'salado']
  ];
  function tipoPara(nombre, cat) {
    var t = slug(nombre + ' ' + cat).replace(/-/g, ' ');
    for (var i = 0; i < DESDE_NOMBRE.length; i++) if (DESDE_NOMBRE[i][0].test(t)) return DESDE_NOMBRE[i][1];
    return 'espresso';
  }
  var FOTO_PRODUCTO = {};   // fotos propias por producto, para conservarlas al leer la planilla
  function desdePlanilla(filas) {
    var mapa = {}, orden = [];
    SECCIONES.forEach(function (x) { x.items.forEach(function (it) { if (it.foto) FOTO_PRODUCTO[slug(it.nombre)] = it.foto; }); });
    filas.forEach(function (f) {
      if (!mapa[f.categoria]) {
        var previa = SECCIONES.filter(function (x) { return slug(x.nombre) === slug(f.categoria); })[0];
        mapa[f.categoria] = { nombre: f.categoria, bajada: previa ? previa.bajada : '', foto: previa && previa.foto, items: [] };
        orden.push(mapa[f.categoria]);
      }
      if (f.categoria_en && !mapa[f.categoria].nombre_en) mapa[f.categoria].nombre_en = f.categoria_en;
      mapa[f.categoria].items.push({ nombre: f.producto, precio: f.precio, desc: f.descripcion, etiqueta: f.etiqueta || '', tipo: tipoPara(f.producto, f.categoria), foto: FOTO_PRODUCTO[slug(f.producto)],
        nombre_en: f.producto_en || '', desc_en: f.descripcion_en || '', etiqueta_en: f.etiqueta_en || '' });
    });
    if (!orden.length) return;
    SECCIONES = orden;
    $('#aviso-demo').hidden = true;
    render();
  }

  /* ---------- Inicio ---------- */
  function iniciar() {
    $('#dato-horario').textContent = NEGOCIO.horario;
    $('#dato-direccion').textContent = NEGOCIO.direccion;
    $('#dato-wifi').textContent = NEGOCIO.wifi;
    try { seleccion = JSON.parse(leerLS(CLAVE_SEL)) || {}; } catch (e) { seleccion = {}; }

    // Siempre abre en modo claro; el modo noche es opcional desde el botón.
    aplicarTema('dia');
    $('#tema').addEventListener('click', function () {
      var t = document.documentElement.dataset.tema === 'noche' ? 'dia' : 'noche';
      aplicarTema(t);
    });

    // Idioma: siempre abre en español. Solo abre en inglés con ?lang=en en el link (o en el QR).
    var params = new URLSearchParams(location.search);
    var langInicial = (params.get('lang') || '').toLowerCase() === 'en' ? 'en' : 'es';
    mesaFija = (params.get('mesa') || '').replace(/\D/g, '').slice(0, 4);
    aplicarIdioma(langInicial);
    $('#idioma').addEventListener('click', function () {
      var l = idioma === 'en' ? 'es' : 'en';
      aplicarIdioma(l); render();
      aviso(l === 'en' ? 'Menu in English' : 'Carta en español');
    });

    render();

    var top = $('#top');
    window.addEventListener('scroll', function () { top.classList.toggle('con-linea', window.scrollY > 8); }, { passive: true });

    document.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-prod]'))) { abrirProducto(b.dataset.prod); return; }
      if ((b = e.target.closest('[data-sumar]'))) {
        cambiar(b.dataset.sumar, 1); $('#prod-dialog').close(); destacar(b.dataset.sumar);
        aviso(nom(productos[b.dataset.sumar]) + ' · ' + txt('agregado')); return;
      }
      if ((b = e.target.closest('[data-cambiar]'))) { cambiar(b.dataset.id, Number(b.dataset.cambiar)); return; }
      if ((b = e.target.closest('[data-cerrar]'))) { $('#' + b.dataset.cerrar).close(); return; }
    });
    $('#sel-abrir').addEventListener('click', function () { abrir('sel-dialog'); });
    $('#barra-sel').addEventListener('click', function () { abrir('sel-dialog'); });
    document.querySelectorAll('dialog').forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (e.target !== d) return;
        var r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
      });
    });

    // Los pedidos se toman en la mesa: la selección es una lista para mostrarle a quien atiende.
    // QR por mesa: el link ?mesa=4 muestra "Para la mesa 4." arriba de la lista.
    $('#sel-vaciar').addEventListener('click', function () {
      seleccion = {}; guardar(CLAVE_SEL, '{}'); pintarSeleccion(); aviso(txt('vaciada'));
    });

    if (window.CofrepPlanilla) window.CofrepPlanilla.cargar({ alGuardada: desdePlanilla, alNueva: desdePlanilla });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
