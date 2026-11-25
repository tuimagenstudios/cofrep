/* La cabecera permanece montada al cambiar de vista; solo cambia su altura. */
(() => {
  const html = document.documentElement;
  let pending = false;
  function update() {
    pending = false;
    const compact = html.classList.contains('cabecera-compacta');
    if (!compact && scrollY > 120) html.classList.add('cabecera-compacta');
    else if (compact && scrollY < 40) html.classList.remove('cabecera-compacta');
  }
  addEventListener('scroll', () => {
    if (!pending) {pending = true; requestAnimationFrame(update);}
  }, {passive: true});
  addEventListener('pageshow', update);
  update();
})();
