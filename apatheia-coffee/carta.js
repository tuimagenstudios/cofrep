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
      return '<a href="#' + s.id + '"><span class="num">' + dos(i + 1) + '</span>' + esc(s.nombre) + '</a>';
    }).join('');
    $('#secciones').innerHTML = SECCIONES.map(function (s, i) {
      return '<section class="seccion" id="' + s.id + '" aria-labelledby="h-' + s.id + '">' +
        '<header class="seccion-cab revelar">' +
        '<figure class="seccion-foto"><img src="' + (s.foto || fotoDe(s.items[0] && s.items[0].tipo)) + '" alt="" loading="lazy"></figure>' +
        '<span class="num">' + dos(i + 1) + ' / ' + dos(SECCIONES.length) + '</span>' +
        '<h2 id="h-' + s.id + '">' + esc(s.nombre) + '</h2>' + (s.bajada ? '<p>' + esc(s.bajada) + '</p>' : '') + '</header>' +
        '<ul class="lista">' + s.items.map(itemHTML).join('') + '</ul></section>';
    }).join('');
    observar();
    pintarSeleccion();
  }
  function itemHTML(p, i) {
    var c = seleccion[p.id] || 0;
    return '<li class="item revelar" style="--i:' + (i || 0) + '"><button class="item-btn" type="button" data-prod="' + p.id + '">' +
      '<span class="item-nombre">' + esc(p.nombre) + (p.etiqueta ? '<span class="item-tag">' + esc(p.etiqueta) + '</span>' : '') + '</span>' +
      '<span class="item-precio">' + plata(p.precio) + '</span>' +
      (p.desc ? '<p class="item-desc">' + esc(p.desc) + '</p>' : '') +
      '<span class="item-cant" data-cant="' + p.id + '"' + (c ? '' : ' hidden') + '>' + c + ' en tu selección</span>' +
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
      (p.etiqueta ? '<p class="eyebrow">' + esc(p.etiqueta) + '</p>' : '') +
      '<h2 id="prod-nombre">' + esc(p.nombre) + '</h2>' +
      (p.desc ? '<p class="prod-desc">' + esc(p.desc) + '</p>' : '') + notas +
      '<div class="prod-pie"><span class="prod-precio">' + plata(p.precio) + '</span>' +
      '<button class="btn" type="button" data-sumar="' + p.id + '">Agregar <span aria-hidden="true">+</span></button></div>' +
      '<p class="prod-legal">Consultá alérgenos y disponibilidad en la barra.</p>';
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
    $('#barra-cant').textContent = t.cant + (t.cant === 1 ? ' producto' : ' productos');
    $('#barra-total').textContent = plata(t.total);
    $('#sel-total').textContent = plata(t.total);
    document.querySelectorAll('[data-cant]').forEach(function (el) {
      var c = seleccion[el.dataset.cant] || 0;
      el.hidden = !c; el.textContent = c + ' en tu selección';
    });
    var ids = Object.keys(seleccion);
    $('#sel-lista').innerHTML = ids.length ? ids.map(function (id) {
      var p = productos[id];
      return '<div class="sel-item"><div><div class="sel-item-nombre">' + esc(p.nombre) + '</div>' +
        '<div class="sel-item-precio">' + plata(p.precio * seleccion[id]) + '</div></div>' +
        '<div class="cant"><button type="button" data-cambiar="-1" data-id="' + id + '" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
        '<span>' + seleccion[id] + '</span>' +
        '<button type="button" data-cambiar="1" data-id="' + id + '" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button></div></div>';
    }).join('') : '<p class="sel-vacia">Todavía no elegiste nada. Tocá un producto para ver su ficha.</p>';
    $('#sel-checkout').hidden = false;
    $('#sel-form').hidden = !ids.length;
    $('.sel-total').hidden = !ids.length;
    $('#sel-vaciar').hidden = !ids.length;
    if (!ids.length) $('#sel-preview').hidden = true;
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
    $('.tema-txt').textContent = t === 'noche' ? 'Día' : 'Noche';
    $('#tema').setAttribute('aria-label', t === 'noche' ? 'Cambiar a modo día' : 'Cambiar a modo noche');
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
  function desdePlanilla(filas) {
    var mapa = {}, orden = [];
    filas.forEach(function (f) {
      if (!mapa[f.categoria]) {
        var previa = SECCIONES.filter(function (x) { return slug(x.nombre) === slug(f.categoria); })[0];
        mapa[f.categoria] = { nombre: f.categoria, bajada: previa ? previa.bajada : '', foto: previa && previa.foto, items: [] };
        orden.push(mapa[f.categoria]);
      }
      mapa[f.categoria].items.push({ nombre: f.producto, precio: f.precio, desc: f.descripcion, etiqueta: f.etiqueta || '', tipo: tipoPara(f.producto, f.categoria) });
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
    if (NEGOCIO.whatsapp) {
      $('#sel-info').textContent = 'Se abrirá WhatsApp con tu pedido para que el local lo confirme.';
      $('#sel-enviar').textContent = 'Enviar por WhatsApp';
    }
    try { seleccion = JSON.parse(leerLS(CLAVE_SEL)) || {}; } catch (e) { seleccion = {}; }

    var temaGuardado = leerLS('apatheia-tema');
    aplicarTema(temaGuardado || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'noche' : 'dia'));
    $('#tema').addEventListener('click', function () {
      var t = document.documentElement.dataset.tema === 'noche' ? 'dia' : 'noche';
      aplicarTema(t); guardar('apatheia-tema', t);
    });

    render();

    var top = $('#top');
    window.addEventListener('scroll', function () { top.classList.toggle('con-linea', window.scrollY > 8); }, { passive: true });

    document.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-prod]'))) { abrirProducto(b.dataset.prod); return; }
      if ((b = e.target.closest('[data-sumar]'))) {
        cambiar(b.dataset.sumar, 1); $('#prod-dialog').close(); destacar(b.dataset.sumar);
        aviso(productos[b.dataset.sumar].nombre + ' · agregado'); return;
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

    var form = $('#sel-form');
    form.addEventListener('change', function (e) {
      if (e.target.name === 'modo') $('#mesa-label').hidden = e.target.value !== 'Mesa';
      $('#sel-preview').hidden = true;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!totales().cant) return;
      var datos = Object.fromEntries(new FormData(form));
      datos.nombre = (datos.nombre || '').trim();
      if (!datos.nombre) { form.elements.nombre.focus(); aviso('Escribí tu nombre para preparar el pedido'); return; }
      var msg = textoPedido(datos);
      if (NEGOCIO.whatsapp) {
        window.open('https://wa.me/' + NEGOCIO.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      } else {
        $('#sel-texto').value = 'PEDIDO DE MUESTRA\n\n' + msg;
        $('#sel-preview').hidden = false; $('#sel-estado').textContent = '';
        $('#sel-texto').focus();
      }
    });
    $('#sel-copiar').addEventListener('click', function () {
      var t = $('#sel-texto');
      (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject())
        .then(function () { $('#sel-estado').textContent = 'Pedido copiado. No se envió al local.'; })
        .catch(function () { t.select(); $('#sel-estado').textContent = 'Seleccionamos el texto: copialo desde el menú de tu teléfono.'; });
    });
    $('#sel-vaciar').addEventListener('click', function () {
      seleccion = {}; guardar(CLAVE_SEL, '{}'); pintarSeleccion(); aviso('Selección vacía');
    });

    if (window.CofrepPlanilla) window.CofrepPlanilla.cargar({ alGuardada: desdePlanilla, alNueva: desdePlanilla });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
