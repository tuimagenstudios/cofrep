/* Animaciones de la carta del Patio de la Judería · kit COFREP
   GSAP + ScrollTrigger + SplitText (gratis incluso para uso comercial).
   - Titular palabra por palabra, foto del tablao que se descubre y se mueve con el scroll.
   - Destacados en cascada con precio que cuenta e inclinación al pasar el mouse.
   - Títulos de sección que suben, fotos que se descubren como telón.
   - Acordeón que se abre suave con los platos en cascada; la búsqueda resalta lo encontrado.
   - Ecualizador real de la música y botón que late; botones magnéticos.
   - Cortina entre la carta y las páginas de menús (se engancha en navigation.js).
   Con «reducir movimiento» activado no se anima nada y la carta queda como antes. */
(() => {
  const html = document.documentElement;
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (!window.gsap || quieto) { html.classList.remove('anim'); return; }
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const euros = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

  /* Cuenta un precio como «11,90 € / ud.» desde cero hasta su valor y deja el texto original. */
  function contarPrecio(el) {
    if (!el || el.dataset.contado) return;
    const original = el.textContent;
    const m = original.match(/^([\d.]+,\d{2})\s*€(.*)$/s);
    if (!m) return;
    el.dataset.contado = '1';
    const valor = parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
    const o = { v: 0 };
    gsap.to(o, { v: valor, duration: 1.2, ease: 'expo.out',
      onUpdate: () => { el.textContent = euros(o.v) + m[2]; },
      onComplete: () => { el.textContent = original; } });
  }

  /* ================= ANIMACIONES DE CADA PÁGINA ================= */
  let ctx = null;
  let intro = null;

  function animarPagina() {
    ctx?.revert();
    $$('[data-contado]').forEach(el => delete el.dataset.contado);
    ctx = gsap.context(() => {
      intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

      /* --- cabecera --- */
      intro.from('header .brand img', { y: -16, opacity: 0, duration: .8 }, 0);
      intro.from('header nav > a, header .back-to-menu', { y: -12, opacity: 0, stagger: .08, duration: .6 }, .1);

      /* --- portada de la carta --- */
      const h1 = $('.hero h1');
      if (h1) {
        const t = SplitText.create(h1, { type: 'lines,words', mask: 'lines' });
        const enRojo = $$('em', h1).flatMap(em => t.words.filter(w => em.contains(w)));
        intro
          .from('.hero .eyebrow', { opacity: 0, letterSpacing: '.6em', duration: 1.1 }, .15)
          .from(t.words.filter(w => !enRojo.includes(w)), { yPercent: 110, duration: 1, stagger: .07, ease: 'power4.out' }, .25)
          .from(enRojo, { yPercent: 110, rotate: 6, duration: 1.1, stagger: .09, ease: 'power4.out' }, '-=.55')
          .from('.hero .red-line', { scaleX: 0, transformOrigin: 'left center', duration: .9, ease: 'expo.inOut' }, '-=.6')
          .from(['.hero .intro', '.hero .primary', '.hero .hero-foot'], { y: 24, opacity: 0, stagger: .1, duration: .8 }, '-=.5')
          .fromTo('.hero-photo', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, .2)
          .from('.hero-photo > img', { scale: 1.45, duration: 2, ease: 'expo.out' }, .35)
          .from('.photo-caption > *', { y: 30, opacity: 0, stagger: .12, duration: .9 }, 1.1)
          .from('.photo-number', { opacity: 0, x: 20, duration: .8 }, 1.2);

        // la foto del tablao se mueve más lento que la página
        gsap.fromTo('.hero-photo > img', { yPercent: 0, scale: 1.12 }, { yPercent: 9, scale: 1.12, ease: 'none',
          scrollTrigger: { trigger: '.hero-photo', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.photo-caption', { yPercent: -35, ease: 'none',
          scrollTrigger: { trigger: '.hero-photo', start: 'top top', end: 'bottom top', scrub: true } });
      }

      /* --- página de un menú --- */
      if ($('#menu-detail')) {
        intro
          .from('.detail-atmosphere img', { scale: 1.35, duration: 2.2, ease: 'expo.out' }, 0)
          .from('.detail-atmosphere p', { y: 40, opacity: 0, duration: 1 }, .4)
          .from('#menu-detail > *', { y: 28, opacity: 0, stagger: .07, duration: .8 }, .2);
        $$('.detail-courses').forEach(lista => gsap.from($$('li', lista), { x: -24, opacity: 0, stagger: .08, duration: .7, ease: 'power3.out',
          scrollTrigger: { trigger: lista, start: 'top 88%' } }));
      }

      /* --- franja de azulejos que corre con el scroll --- */
      if ($('.tile-strip')) gsap.fromTo('.tile-strip', { backgroundPosition: '0px 0px' }, { backgroundPosition: '264px 0px', ease: 'none',
        scrollTrigger: { trigger: '.tile-strip', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* --- títulos de sección: suben palabra por palabra --- */
      $$('main h2').forEach(h => {
        if (h.closest('.hero, #menu-results')) return;
        const t = SplitText.create(h, { type: 'lines,words', mask: 'lines' });
        gsap.from(t.words, { yPercent: 110, duration: .95, stagger: .06, ease: 'power4.out',
          scrollTrigger: { trigger: h, start: 'top 86%' } });
      });
      $$('main .eyebrow').forEach(e => {
        if (e.closest('.hero, #menu-results, #menu-detail')) return;
        gsap.from(e, { opacity: 0, letterSpacing: '.55em', duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: e, start: 'top 90%' } });
      });
      $$('.featured-intro, .menu-intro > p, .glimpse-copy > p:not(.eyebrow), .experience-copy > p:not(.eyebrow), .experience-copy .primary, .toolbar, .accordion-hint, .service-alert').forEach(el =>
        gsap.from(el, { y: 26, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));

      /* --- los 8 destacados --- */
      const cards = $$('.featured-card');
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 60, rotationX: -14, transformPerspective: 900, transformOrigin: '50% 0%' });
        ScrollTrigger.batch(cards, { start: 'top 92%', once: true, onEnter: lote => {
          gsap.to(lote, { opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: .1, ease: 'power3.out' });
          lote.forEach((c, i) => gsap.delayedCall(.25 + i * .1, () => contarPrecio($('.price', c))));
        } });
        if (fino) cards.forEach(c => {
          const rx = gsap.quickTo(c, 'rotationX', { duration: .5 }), ry = gsap.quickTo(c, 'rotationY', { duration: .5 });
          c.addEventListener('pointermove', e => {
            const r = c.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - .5) * 10);
            rx(-((e.clientY - r.top) / r.height - .5) * 10);
          });
          c.addEventListener('pointerleave', () => { rx(0); ry(0); });
        });
      }

      /* --- fotos que se descubren como un telón y se mueven al bajar --- */
      $$('.patio-glimpse figure, .experience-media figure').forEach((fig, i) => {
        const img = $('img', fig);
        gsap.fromTo(fig, { clipPath: i % 2 ? 'inset(0% 0% 0% 100%)' : 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
          scrollTrigger: { trigger: fig, start: 'top 85%' } });
        if (img) {
          gsap.from(img, { scale: 1.4, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 85%' } });
          gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
        const cap = $('figcaption', fig);
        if (cap) gsap.from(cap, { y: 16, opacity: 0, duration: .8, delay: .7, scrollTrigger: { trigger: fig, start: 'top 85%' } });
      });

      /* --- aviso de servicio y pie --- */
      $$('.restaurant-notice > div').forEach(el => gsap.from(el, { y: 30, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
      const minimo = $('.notice-minimum strong');
      if (minimo) gsap.from(minimo, { scale: .7, opacity: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: minimo, start: 'top 90%' } });
    });
  }

  /* ================= ACORDEÓN: apertura suave (solo cuando la abre la persona) ================= */
  let ultimoToque = { panel: null, t: 0 };
  document.addEventListener('click', e => {
    const s = e.target.closest('.accordion-summary');
    if (s) ultimoToque = { panel: s.parentElement, t: performance.now() };
  }, true);
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (!d.open || !d.matches?.('.menu-accordion, .wine-accordion')) return;
    if (ultimoToque.panel !== d || performance.now() - ultimoToque.t > 800) return;
    const cont = d.classList.contains('wine-accordion') ? $(':scope > .dishes', d) : $(':scope > .accordion-content', d);
    if (!cont) return;
    gsap.fromTo(cont, { height: 0, opacity: 0, overflow: 'hidden' }, { height: 'auto', opacity: 1, duration: .6, ease: 'power3.out', clearProps: 'height,opacity,overflow' });
    let hijos = [...cont.children];
    if (hijos.length === 1 && hijos[0].children.length) hijos = [...hijos[0].children];
    gsap.from(hijos.slice(0, 14), { y: 20, opacity: 0, stagger: .045, duration: .55, delay: .08, ease: 'power2.out', clearProps: 'transform,opacity' });
  }, true);

  /* ================= BÚSQUEDA: resaltar lo encontrado ================= */
  const sinTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function marcar(el, q) {
    const t = el.textContent;
    let norm = '';
    const mapa = [];
    for (let i = 0; i < t.length; i++) for (const ch of sinTildes(t[i])) { norm += ch; mapa.push(i); }
    const k = norm.indexOf(q);
    if (k < 0) return;
    const a = mapa[k], b = mapa[k + q.length - 1] + 1;
    const mark = document.createElement('mark');
    mark.textContent = t.slice(a, b);
    el.replaceChildren(t.slice(0, a), mark, t.slice(b));
  }
  document.addEventListener('input', e => {
    if (e.target.id !== 'search') return;
    const q = sinTildes(e.target.value.trim());
    if (q.length < 2) return;
    $$('#menu-results .dish h4, #menu-results .dish > p, #menu-results .tasting-menu h4').forEach(el => marcar(el, q));
  });

  /* ================= BOTONES MAGNÉTICOS (computadora) ================= */
  if (fino) {
    const SEL = '.reserve, .primary, .reservation-bar a, .social-button, .footer-directions';
    document.addEventListener('pointermove', e => {
      const b = e.target.closest?.(SEL);
      if (!b) return;
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, overwrite: 'auto' });
    });
    document.addEventListener('pointerout', e => {
      const b = e.target.closest?.(SEL);
      if (b && !b.contains(e.relatedTarget)) gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.35)', overwrite: 'auto' });
    });
  }

  /* ================= MÚSICA: ecualizador al ritmo real ================= */
  const panel = $('.music-control'), audio = $('#patio-background-audio');
  if (panel && audio) {
    const eq = document.createElement('span');
    eq.className = 'music-eq';
    eq.setAttribute('aria-hidden', 'true');
    eq.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
    $('.music-toggle', panel)?.append(eq);
    const barras = $$('i', eq);
    let actx = null, analizador = null, datos = null, intentado = false;
    html.classList.add('eq-css'); // hasta que el analizador funcione, barras animadas por CSS

    // El contexto de audio se crea dentro del toque de la persona (exigencia de iPhone).
    function prepararAudio() {
      if (intentado) { if (actx?.state === 'suspended') actx.resume(); return; }
      intentado = true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        actx = new AC();
        actx.resume().then(() => {
          // Solo se conecta si el contexto quedó andando; si no, la música sigue sonando normal.
          if (actx.state !== 'running') return;
          const fuente = actx.createMediaElementSource(audio);
          analizador = actx.createAnalyser();
          analizador.fftSize = 64;
          analizador.smoothingTimeConstant = .72;
          fuente.connect(analizador);
          analizador.connect(actx.destination);
          datos = new Uint8Array(analizador.frequencyBinCount);
          html.classList.remove('eq-css');
        }).catch(() => {});
      } catch { actx = null; }
    }
    panel.addEventListener('pointerdown', prepararAudio, true);
    panel.addEventListener('keydown', prepararAudio, true);

    gsap.ticker.add(() => {
      if (!analizador) return;
      const sonando = panel.classList.contains('is-playing') && !audio.paused;
      if (sonando) analizador.getByteFrequencyData(datos);
      barras.forEach((b, i) => {
        const v = sonando ? datos[1 + i * 3] / 255 : 0;
        b.style.transform = `scaleY(${(.18 + v * .82).toFixed(3)})`;
      });
    });
  }

  /* ================= CORTINA ENTRE PÁGINAS (la usa navigation.js) ================= */
  const cortina = document.createElement('div');
  cortina.className = 'cortina';
  cortina.setAttribute('aria-hidden', 'true');
  cortina.innerHTML = '<img src="assets/logo.webp" alt="">';
  document.body.append(cortina);
  let cubierta = false;
  window.PatioTransicion = {
    salir() {
      if (cubierta) return Promise.resolve();
      cubierta = true;
      return new Promise(listo => {
        gsap.timeline({ onComplete: listo })
          .set(cortina, { display: 'grid', yPercent: 100 })
          .to(cortina, { yPercent: 0, duration: .55, ease: 'power3.inOut' })
          .fromTo('.cortina img', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .35 }, '-=.2');
      });
    },
    entrar() {
      animarPagina();
      intro.play();
      ScrollTrigger.refresh();
      if (!cubierta) return;
      gsap.timeline({ onComplete: () => { gsap.set(cortina, { display: 'none' }); cubierta = false; } })
        .to('.cortina img', { opacity: 0, y: -20, duration: .3 })
        .to(cortina, { yPercent: -100, duration: .65, ease: 'power3.inOut' }, '-=.1');
    }
  };

  /* ================= ENTRADA DE LA PÁGINA (sin telón: arranca directo) ================= */
  animarPagina();
  // En celular, la primera vez hay pantalla de presentación (CSS, ~2,2 s): la portada entra justo cuando empieza a desvanecerse.
  if (html.classList.contains('con-splash')) {
    let listo = false;
    const entrar = () => { if (!listo) { listo = true; intro.play(); } };
    document.addEventListener('animationstart', e => { if (e.animationName === 'splash-salir') entrar(); });
    gsap.delayedCall(4, entrar); // tope por si el navegador no avisa
  }
  else intro.play();
  addEventListener('load', () => ScrollTrigger.refresh());
})();
