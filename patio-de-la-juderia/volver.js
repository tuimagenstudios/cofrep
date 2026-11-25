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

  // Franja «Volver a la propuesta»: solo si se llegó desde la propuesta (?desde=propuesta).
  // Se recuerda durante la visita, así sigue en las páginas de los menús. No aparece al entrar por el QR.
  let desdePropuesta = false;
  try {
    if (new URLSearchParams(location.search).get('desde') === 'propuesta') sessionStorage.setItem('patio-desde-propuesta', '1');
    desdePropuesta = sessionStorage.getItem('patio-desde-propuesta') === '1';
  } catch (e) {}
  if (desdePropuesta) {
    const franja = document.createElement('a');
    franja.className = 'volver-propuesta';
    franja.href = '../p/patio-de-la-juderia/#hoy';
    franja.innerHTML = '<span>Está viendo una demostración</span><b>← <span>Volver a la propuesta</span></b>';
    document.body.prepend(franja);
  }

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
