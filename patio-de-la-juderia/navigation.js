// Swap only the page content. The audio element and its controls stay mounted.
(() => {
  const views = new Map();
  // «/carpeta/» y «/carpeta/index.html» son la misma página (al publicar se entra por la carpeta).
  const routeKey = url => url.pathname.replace(/\/$/, '/index.html') + url.search;
  let current = routeKey(new URL(location.href));
  let pending = 0;
  history.scrollRestoration = 'manual';

  function remember() {
    views.set(current, {
      main: document.querySelector('main'),
      header: document.querySelector('header'),
      bodyClass: document.body.className,
      title: document.title,
      scroll: window.scrollY
    });
  }

  async function navigate(url, push) {
    const key = routeKey(url);
    if (key === current) return;
    const version = ++pending;
    remember();
    try {
      let view = views.get(key);
      let fresh = false;
      if (!view) {
        const response = await fetch(url.pathname + url.search);
        if (!response.ok) throw new Error('Page unavailable');
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        view = {main: doc.querySelector('main'), header: doc.querySelector('header'),
          bodyClass: doc.body.className, title: doc.title, scroll: 0};
        if (!view.main || !view.header) throw new Error('Incomplete page');
        fresh = true;
      }
      if (version !== pending) return;
      // Cortina animada (animaciones.js). Si no está, el cambio es directo como antes.
      if (window.PatioTransicion) await window.PatioTransicion.salir();
      if (version !== pending) return;
      if (push) history.pushState(null, '', url.href);
      document.querySelector('main').replaceWith(view.main);
      document.querySelector('header').replaceWith(view.header);
      document.body.className = view.bodyClass;
      document.title = view.title;
      const skip = document.querySelector('.skip');
      if (skip) {
        skip.href = view.main.querySelector('#menu-detail') ? '#menu-detail' : '#carta';
        skip.textContent = view.main.querySelector('#menu-detail') ? 'Ir al menú' : 'Ir a la carta';
      }
      current = key;
      if (fresh) {
        window.PatioInitCarta();
        window.PatioInitDetail();
        window.PatioInitService();
      }
      // Textos fijos, selector de idioma y enlaces de WhatsApp de la página nueva, en el idioma elegido.
      window.PatioIdioma?.alNavegar();
      views.set(key, view);
      document.querySelector('.navigation-error')?.remove();
      requestAnimationFrame(() => {
        if (version !== pending) return;
        const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (target && push) target.scrollIntoView({behavior: 'instant'});
        else window.scrollTo({top: view.scroll, behavior: 'instant'});
        const heading = view.main.querySelector('h1');
        if (heading) {heading.tabIndex = -1; heading.focus({preventScroll: true});}
        window.PatioTransicion?.entrar();
      });
    } catch {
      if (version !== pending) return;
      // Keep playback and the current page intact if a connection fails.
      let notice = document.querySelector('.navigation-error');
      if (!notice) {
        notice = document.createElement('p');
        notice.className = 'navigation-error';
        notice.setAttribute('role', 'alert');
        document.querySelector('main').prepend(notice);
      }
      notice.textContent = 'No se ha podido abrir el menú. Vuelve a tocar el enlace para intentarlo de nuevo.';
      notice.scrollIntoView({block: 'center'});
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/\/(index|menu)\.html$/.test(url.pathname)) return;
    if (routeKey(url) === current) return;
    event.preventDefault();
    void navigate(url, true);
  });
  // Al cambiar de idioma se olvidan las páginas guardadas (estaban en el idioma anterior).
  window.PatioVistas = { olvidar() { for (const k of [...views.keys()]) if (k !== current) views.delete(k); } };
  window.addEventListener('popstate', () => void navigate(new URL(location.href), false));
})();
