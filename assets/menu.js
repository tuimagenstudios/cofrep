// Motor de menú Cofrep. Cada página define window.MENU antes de cargar este archivo.
(function () {
  const M = window.MENU;
  const money = (n) => (M.moneda || '$') + ' ' + n.toLocaleString('es-AR');
  const cart = {};
  if (M.tema) for (const k in M.tema) document.documentElement.style.setProperty('--' + k, M.tema[k]);
  document.title = M.nombre + ' | Menú';
  const ico = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  };

  document.body.innerHTML = `
    <header class="hero" style="background-image:url('${M.portada}')"><div class="wrap">
      <span class="marca">${M.rubro}</span><h1>${M.nombre}</h1><p>${M.lema || ''}</p>
      <div class="datos">${M.direccion ? `<span>${ico.pin}${M.direccion}</span>` : ''}${M.horario ? `<span>${ico.reloj}${M.horario}</span>` : ''}</div>
    </div></header>
    <nav class="tabs"><div class="wrap">${M.categorias.map((c, i) => `<button data-i="${i}" class="${i ? '' : 'on'}">${c.nombre}</button>`).join('')}</div></nav>
    <main class="wrap">${M.categorias.map((c, i) => `<section id="c${i}"><h2>${c.nombre}<small>${String(c.items.length).padStart(2, '0')}</small></h2>${c.items.map((it, j) => `
      <div class="item">${it.img ? `<img src="${it.img}" alt="${it.nombre}" loading="lazy">` : ''}<div class="txt"><h3>${it.nombre}${it.tag ? `<span class="tag">${it.tag}</span>` : ''}</h3>
      ${it.desc ? `<p>${it.desc}</p>` : ''}<div class="precio">${money(it.precio)}</div></div>
      <div class="ctl" data-k="${i}-${j}"></div></div>`).join('')}</section>`).join('')}</main>
    <footer>Menú digital hecho por <a href="/">COFREP</a></footer>
    <button class="cart" id="cart"></button>`;

  const find = (k) => { const [i, j] = k.split('-'); return M.categorias[i].items[j]; };
  function draw() {
    document.querySelectorAll('.ctl').forEach((el) => {
      const q = cart[el.dataset.k] || 0;
      el.innerHTML = q ? `<div class="qty"><button data-a="-" aria-label="Quitar">−</button>${q}<button data-a="+" aria-label="Agregar">+</button></div>`
                       : `<button class="add" data-a="+" aria-label="Agregar">+</button>`;
    });
    let n = 0, t = 0;
    for (const k in cart) { n += cart[k]; t += cart[k] * find(k).precio; }
    const b = document.getElementById('cart');
    b.classList.toggle('show', n > 0 && !!M.whatsapp);
    b.innerHTML = `<span>Pedir por WhatsApp · ${n}</span><span>${money(t)}</span>`;
  }
  document.body.addEventListener('click', (e) => {
    const a = e.target.dataset.a, ctl = e.target.closest('.ctl');
    if (a && ctl) { const k = ctl.dataset.k; cart[k] = Math.max(0, (cart[k] || 0) + (a === '+' ? 1 : -1)); if (!cart[k]) delete cart[k]; draw(); }
    if (e.target.dataset.i) document.getElementById('c' + e.target.dataset.i).scrollIntoView({ behavior: 'smooth' });
    if (e.target.closest('#cart')) {
      let txt = `Hola ${M.nombre}! Quiero pedir:\n`, t = 0;
      for (const k in cart) { const it = find(k); txt += `• ${cart[k]} x ${it.nombre}\n`; t += cart[k] * it.precio; }
      txt += `Total: ${money(t)}`;
      window.open(`https://wa.me/${M.whatsapp}?text=${encodeURIComponent(txt)}`, '_blank');
    }
  });
  const tabs = document.querySelectorAll('.tabs button');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) tabs.forEach((b) => b.classList.toggle('on', 'c' + b.dataset.i === e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section').forEach((s) => io.observe(s));
  draw();
})();
