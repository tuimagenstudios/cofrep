/* FG Automotores · arma la portada oscura con video, la banda de descargas y las animaciones al bajar */
(function () {
  var d = document, quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.documentElement.classList.add('js-fg');
  var wrap = d.querySelector('.wrap'), header = wrap && wrap.querySelector('header'), intro = wrap && wrap.querySelector('.intro');

  // Portada: header + intro dentro de una banda oscura con el video de la web
  if (header && intro) {
    var hero = d.createElement('section'); hero.className = 'fg-hero';
    hero.innerHTML = '<span class="fg-linea2" aria-hidden="true"></span>';
    var media;
    if (quieto) { media = d.createElement('img'); media.className = 'fg-poster'; media.src = 'fondo.jpg'; media.alt = ''; }
    else {
      media = d.createElement('video');
      media.muted = true; media.loop = true; media.autoplay = true; media.playsInline = true;
      media.setAttribute('muted', ''); media.setAttribute('playsinline', ''); media.poster = 'fondo.jpg';
      media.src = 'https://automotoresfg.com/assets/portada-cliente-web.mp4';
    }
    media.setAttribute('aria-hidden', 'true');
    hero.prepend(media);
    var w2 = d.createElement('div'); w2.className = 'wrap';
    w2.append(header, intro); hero.append(w2);
    d.body.prepend(hero);
  }

  // Descargas en una banda oscura de ancho completo
  var desc = d.getElementById('descargas');
  if (desc) {
    var banda = d.createElement('div'); banda.className = 'fg-banda';
    var w3 = d.createElement('div'); w3.className = 'wrap';
    desc.parentNode.insertBefore(banda, desc.parentNode === wrap ? null : desc);
    w3.append(desc); banda.append(w3);
    wrap.after(banda);
  }

  // Barra de progreso
  var bar = d.createElement('div'); bar.className = 'fg-progreso'; d.body.append(bar);
  var t = false;
  addEventListener('scroll', function () {
    if (t) return; t = true;
    requestAnimationFrame(function () { var m = d.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', m > 0 ? scrollY / m : 0); t = false; });
  }, { passive: true });

  // Láminas y tarjetas que aparecen al bajar
  var piezas = d.querySelectorAll('.laminas figure, .item, .links');
  piezas.forEach(function (el, i) { el.classList.add('fg-rev'); el.style.transitionDelay = (i % 3) * 90 + 'ms'; });
  if (quieto || !('IntersectionObserver' in window)) { piezas.forEach(function (el) { el.classList.add('visto'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  piezas.forEach(function (el) { io.observe(el); });
})();
