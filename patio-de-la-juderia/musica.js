/* Música de ambiente · control compacto
   Una bocina redonda. Al tocarla:
   - si está en silencio, empieza a sonar al último volumen (30 % la primera vez);
   - se despliega una línea vertical con + y − para subir y bajar, y un botón para silenciar.
   La línea se cierra sola a los 4 s sin tocarla, al tocar fuera o con Escape.
   Empieza siempre en silencio y no hay reproducción automática.
   El reproductor queda montado al navegar a los menús (navigation.js no lo reemplaza). */
(() => {
  const audio = document.createElement('audio');
  audio.id = 'patio-background-audio';
  audio.src = 'assets/audio/corazon-flamenco.mp3';
  audio.loop = true;
  audio.preload = 'none';
  audio.defaultMuted = true;
  audio.muted = true;
  audio.volume = 0;

  const panel = document.createElement('section');
  panel.className = 'music-control';
  panel.setAttribute('aria-label', 'Música de ambiente');
  panel.innerHTML = `
    <div class="music-pop" id="music-pop" hidden>
      <button class="music-step music-up" type="button" aria-label="Subir volumen">+</button>
      <div class="music-track" role="slider" tabindex="0" aria-label="Volumen de la música" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0 por ciento, en silencio">
        <span class="music-fill"></span><span class="music-thumb"></span>
      </div>
      <button class="music-step music-down" type="button" aria-label="Bajar volumen">−</button>
      <output class="music-level" aria-hidden="true">0 %</output>
      <button class="music-mute" type="button">Silenciar</button>
    </div>
    <button class="music-toggle" type="button" aria-label="Activar música" aria-expanded="false" aria-controls="music-pop" title="Música">
      <svg class="music-speaker" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path class="music-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="music-cross" d="m16 9 6 6m0-6-6 6"/></svg>
    </button>
    <span class="visually-hidden music-status" aria-live="polite">Música en silencio</span>`;

  const toggle = panel.querySelector('.music-toggle');
  const pop = panel.querySelector('.music-pop');
  const track = panel.querySelector('.music-track');
  const output = panel.querySelector('.music-level');
  const status = panel.querySelector('.music-status');
  const down = panel.querySelector('.music-down');
  const up = panel.querySelector('.music-up');
  const mute = panel.querySelector('.music-mute');
  let lastVolume = 30;
  let level = 0;
  let request = 0;
  let cierre = 0;

  function show(value, message) {
    level = value;
    track.setAttribute('aria-valuenow', String(value));
    track.setAttribute('aria-valuetext', value ? `${value} por ciento` : '0 por ciento, en silencio');
    track.style.setProperty('--music-level', `${value}%`);
    output.value = `${value} %`;
    down.disabled = value <= 0;
    up.disabled = value >= 100;
    mute.disabled = value <= 0;
    panel.classList.toggle('is-playing', value > 0);
    const label = value ? `Música sonando al ${value} %. Tocar para ajustar el volumen` : 'Activar música';
    toggle.setAttribute('aria-label', label);
    status.textContent = message || (value ? `Música sonando al ${value} %` : 'Música en silencio');
  }
  function silence() {
    request++;
    audio.pause();
    audio.muted = true;
    audio.volume = 0;
    show(0);
  }
  async function setVolume(value) {
    value = Math.max(0, Math.min(100, Math.round(value)));
    if (!value) { silence(); return; }
    const current = ++request;
    lastVolume = value;
    audio.volume = value / 100;
    audio.muted = false;
    show(value, audio.paused ? 'Cargando la música…' : undefined);
    try {
      await audio.play();
      if (current === request) show(value);
    } catch {
      if (current === request) { silence(); status.textContent = 'Toca la bocina para escuchar'; }
    }
  }

  function programarCierre() {
    clearTimeout(cierre);
    cierre = setTimeout(cerrar, 4000);
  }
  function abrir() {
    pop.hidden = false;
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    programarCierre();
  }
  function cerrar() {
    clearTimeout(cierre);
    pop.hidden = true;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    if (!level) { void setVolume(lastVolume); abrir(); return; }
    if (pop.hidden) abrir(); else cerrar();
  });
  up.addEventListener('click', () => { void setVolume(level + 10); programarCierre(); });
  down.addEventListener('click', () => { void setVolume(level - 10); programarCierre(); });
  mute.addEventListener('click', () => { silence(); cerrar(); toggle.focus(); });

  // Línea vertical: se arrastra con el dedo o el mouse, y con las flechas del teclado.
  function desdePuntero(e) {
    const r = track.getBoundingClientRect();
    const v = (r.bottom - e.clientY) / r.height * 100;
    void setVolume(v);
    programarCierre();
  }
  track.addEventListener('pointerdown', e => {
    e.preventDefault();
    track.setPointerCapture(e.pointerId);
    desdePuntero(e);
    const mover = ev => desdePuntero(ev);
    const soltar = () => { track.removeEventListener('pointermove', mover); track.removeEventListener('pointerup', soltar); track.removeEventListener('pointercancel', soltar); };
    track.addEventListener('pointermove', mover);
    track.addEventListener('pointerup', soltar);
    track.addEventListener('pointercancel', soltar);
  });
  track.addEventListener('keydown', e => {
    const pasos = { ArrowUp: 5, ArrowRight: 5, ArrowDown: -5, ArrowLeft: -5, PageUp: 20, PageDown: -20 };
    if (e.key in pasos) { e.preventDefault(); void setVolume(level + pasos[e.key]); programarCierre(); }
    else if (e.key === 'Home') { e.preventDefault(); silence(); }
    else if (e.key === 'End') { e.preventDefault(); void setVolume(100); }
  });

  document.addEventListener('pointerdown', e => { if (!pop.hidden && !panel.contains(e.target)) cerrar(); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { cerrar(); toggle.focus(); } });
  panel.addEventListener('focusin', programarCierre);

  audio.addEventListener('error', () => { silence(); status.textContent = 'Audio no disponible'; });
  document.body.append(audio, panel);
  show(0);
})();
