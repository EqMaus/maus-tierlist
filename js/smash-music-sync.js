(function () {
  'use strict';

  /*
   * v5.2.0 · Smash Ultimate / The Dark Realm
   *
   * CAMBIO CLAVE:
   * Ya no "disparamos" efectos cuando el reloj cruza un timestamp.
   * En cada frame calculamos qué retumbar corresponde EXACTAMENTE al
   * audio.currentTime actual. Así los efectos:
   *   - no se pierden;
   *   - se mantienen durante todo su intervalo;
   *   - se recolocan instantáneamente al mover la barra;
   *   - repiten exactamente cada 1:39 (99 s).
   */

  window.MAUS_SMASH_SYNC = true;

  const body = document.body;
  const audio = document.getElementById('audio');
  if (!body || !audio) return;

  const SMASH_ID = 'super-smash-bros-ultimate';
  const LOOP = 99;
  const MOBILE_QUERY = '(max-width: 900px) and (hover: none) and (pointer: coarse)';

  /*
   * Timeline de UN loop (0:00 → 1:39).
   * start/end están en segundos del loop musical.
   *
   * kind:
   *   hit     = golpe corto con ataque/caída rápida.
   *   sustain = retumbar continuo durante TODO el intervalo.
   */
  const EVENTS = [
    { start: 8.00, end: 8.48, kind: 'hit', strength: 0.40, speed: 1.00 },

    { start: 15.00, end: 15.17, kind: 'hit', strength: 0.90, speed: 1.65 },
    { start: 15.28, end: 15.45, kind: 'hit', strength: 0.90, speed: 1.65 },
    { start: 15.56, end: 15.73, kind: 'hit', strength: 0.90, speed: 1.65 },

    { start: 16.00, end: 17.50, kind: 'sustain', strength: 2.20, speed: 0.95 },

    { start: 24.00, end: 26.50, kind: 'sustain', strength: 1.72, speed: 0.72 },

    /* 6 mini-retumbares entre 0:30 y 0:31.5 */
    { start: 30.00, end: 30.18, kind: 'hit', strength: 1.02, speed: 1.85 },
    { start: 30.30, end: 30.48, kind: 'hit', strength: 1.02, speed: 1.85 },
    { start: 30.60, end: 30.78, kind: 'hit', strength: 1.02, speed: 1.85 },
    { start: 30.90, end: 31.08, kind: 'hit', strength: 1.02, speed: 1.85 },
    { start: 31.20, end: 31.38, kind: 'hit', strength: 1.02, speed: 1.85 },
    { start: 31.50, end: 31.68, kind: 'hit', strength: 1.02, speed: 1.85 },

    { start: 34.00, end: 37.50, kind: 'sustain', strength: 3.05, speed: 0.66, cinematic: true },

    { start: 42.00, end: 43.50, kind: 'sustain', strength: 1.82, speed: 0.82 },

    { start: 50.00, end: 51.50, kind: 'sustain', strength: 1.68, speed: 0.88 },

    { start: 57.00, end: 57.18, kind: 'hit', strength: 1.50, speed: 1.70 },
    { start: 57.28, end: 57.46, kind: 'hit', strength: 1.50, speed: 1.70 },
    { start: 57.56, end: 57.74, kind: 'hit', strength: 1.50, speed: 1.70 },

    { start: 58.00, end: 60.00, kind: 'sustain', strength: 1.78, speed: 0.82 },

    { start: 74.00, end: 74.55, kind: 'hit', strength: 0.54, speed: 1.05 },

    { start: 85.00, end: 87.00, kind: 'sustain', strength: 3.65, speed: 0.60, cinematic: true }
  ];

  let frame = 0;

  function isMobileLite() {
    return body.classList.contains('mobile-performance') ||
      window.matchMedia(MOBILE_QUERY).matches;
  }

  function isSmashRoute() {
    return String(location.hash || '').includes(SMASH_ID);
  }

  function isSmashTrack() {
    const src = String(audio.currentSrc || audio.src || '').toLowerCase();
    return src.includes('super-smash-bros-ultimate-theme') ||
      src.includes('the-dark-realm');
  }

  function shouldRun() {
    return (window.MausEffects?.motionAllowed() ?? true) && !isMobileLite() &&
      !document.hidden &&
      !audio.paused &&
      isSmashRoute() &&
      isSmashTrack();
  }

  function loopPosition(seconds) {
    return ((seconds % LOOP) + LOOP) % LOOP;
  }

  function envelope(event, position) {
    const local = position - event.start;
    const duration = event.end - event.start;

    if (event.kind === 'hit') {
      const t = Math.min(1, Math.max(0, local / duration));
      return Math.pow(Math.sin(Math.PI * t), 0.58);
    }

    /*
     * Sustain: entra rápido, permanece fuerte TODO el tramo y cae sólo
     * durante los últimos ~120 ms. No vuelve a cero en mitad del retumbar.
     */
    const attack = Math.min(1, local / 0.085);
    const release = Math.min(1, Math.max(0, event.end - position) / 0.12);
    return Math.min(attack, release);
  }

  function clearEffect() {
    body.style.setProperty('--music-rumble-x', '0px');
    body.style.setProperty('--music-rumble-y', '0px');
    body.style.setProperty('--music-rumble-rot', '0deg');
    body.style.setProperty('--music-rumble-fx-x', '0px');
    body.style.setProperty('--music-rumble-fx-y', '0px');
    body.style.setProperty('--music-rumble-fx-rot', '0deg');
    body.style.setProperty('--music-rumble-power', '0');
    body.classList.remove('music-rumble-active', 'music-super-rumble');
  }

  function renderAtAudioTime(audioTime) {
    const position = loopPosition(audioTime);

    let x = 0;
    let y = 0;
    let rotation = 0;
    let power = 0;
    let cinematic = false;

    for (let i = 0; i < EVENTS.length; i += 1) {
      const event = EVENTS[i];
      if (position < event.start || position >= event.end) continue;

      const env = envelope(event, position);
      if (env <= 0) continue;

      const local = position - event.start;
      const strength = event.strength;
      const speed = event.speed;

      /*
       * Ondas determinadas exclusivamente por el tiempo de la canción.
       * No dependen de performance.now(), timers ni del momento en que
       * empezaste a reproducir: al hacer seek caemos en la fase correcta.
       */
      const phase = event.start * 0.731 + i * 1.173;
      const waveX =
        Math.sin((local * 48 * speed) + phase) +
        Math.sin((local * 79 * speed) + phase * 1.63) * 0.42;

      const waveY =
        Math.sin((local * 59 * speed) + phase * 0.71) +
        Math.sin((local * 91 * speed) + phase * 1.29) * 0.34;

      const waveR =
        Math.sin((local * 41 * speed) + phase * 0.43);

      x += waveX * 2.65 * strength * env;
      y += waveY * 1.62 * strength * env;
      rotation += waveR * 0.092 * strength * env;

      power = Math.max(power, strength * env);
      cinematic = cinematic || Boolean(event.cinematic);
    }

    if (body.classList.contains('background-only')) {
      x *= 1.18;
      y *= 1.18;
      rotation *= 1.18;
      power *= 1.10;
    }

    x = Math.max(-20, Math.min(20, x));
    y = Math.max(-13, Math.min(13, y));
    rotation = Math.max(-0.62, Math.min(0.62, rotation));

    body.style.setProperty('--music-rumble-x', `${x.toFixed(2)}px`);
    body.style.setProperty('--music-rumble-y', `${y.toFixed(2)}px`);
    body.style.setProperty('--music-rumble-rot', `${rotation.toFixed(3)}deg`);

    body.style.setProperty('--music-rumble-fx-x', `${(x * 0.76).toFixed(2)}px`);
    body.style.setProperty('--music-rumble-fx-y', `${(y * 0.76).toFixed(2)}px`);
    body.style.setProperty('--music-rumble-fx-rot', `${(rotation * 0.54).toFixed(3)}deg`);
    body.style.setProperty('--music-rumble-power', Math.min(1, power / 3.65).toFixed(3));

    body.classList.toggle('music-rumble-active', power > 0.025);
    body.classList.toggle('music-super-rumble', cinematic && power > 0.08);
  }

  function tick() {
    if (!shouldRun()) {
      frame = 0;
      clearEffect();
      return;
    }

    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    renderAtAudioTime(current);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;

    if (!shouldRun()) {
      clearEffect();
      return;
    }

    /* Aplicación inmediata: también hace que un seek se vea al instante. */
    renderAtAudioTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    clearEffect();
  }

  window.addEventListener('maus:effectschange', start);
  audio.addEventListener('play', start);
  audio.addEventListener('playing', start);

  /*
   * NO detenemos el motor durante seeking.
   * Mientras arrastras/saltas, currentTime cambia y el siguiente frame
   * recalcula directamente el efecto correcto para esa posición.
   */
  audio.addEventListener('seeking', start);
  audio.addEventListener('seeked', start);
  audio.addEventListener('timeupdate', () => {
    if (!audio.paused) start();
  });

  audio.addEventListener('pause', stop);
  audio.addEventListener('emptied', stop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!audio.paused) start();
  });

  window.addEventListener('hashchange', () => {
    if (isSmashRoute() && !audio.paused) start();
    else stop();
  });
})();
