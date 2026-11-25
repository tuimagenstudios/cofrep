/* Botón «Buscar» que aparece al bajar dentro de la carta y lleva al buscador.
   Vive en <body>, así sigue funcionando cuando navigation.js cambia de página. */
(() => {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'volver-buscar';
  boton.hidden = true;
  boton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg><span>Buscar</span>';
  boton.setAttribute('aria-label', 'Volver al buscador y a las secciones de la carta');
  document.body.append(boton);

  let pendiente = false;
  function revisar() {
    pendiente = false;
    const barra = document.querySelector('.toolbar');
    const carta = document.querySelector('#menu-results');
    let ver = false;
    if (barra && carta) {
      const b = barra.getBoundingClientRect(), c = carta.getBoundingClientRect();
      ver = b.bottom < 0 && c.bottom > innerHeight * .6;
    }
    if (boton.hidden === ver) boton.hidden = !ver;
  }
  addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); } }, { passive: true });
  addEventListener('resize', revisar);

  boton.addEventListener('click', () => {
    const barra = document.querySelector('.toolbar');
    if (!barra) return;
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
    barra.scrollIntoView({ block: 'start', behavior: quieto ? 'instant' : 'smooth' });
    setTimeout(() => document.querySelector('#search')?.focus({ preventScroll: true }), quieto ? 0 : 450);
  });
})();
