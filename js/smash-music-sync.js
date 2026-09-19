(function () {
  'use strict';

  /*
   * v5.1.9 · Super Smash Bros. Ultimate
   * The Dark Realm — retumbares sincronizados con el loop musical real.
   *
   * El patrón musical vuelve a empezar cada 1:39 (99 segundos).
   * Los eventos se calculan desde audio.currentTime, por lo que:
   * - siguen sincronizados durante todo el MP3 extendido;
   * - se reajustan al mover manualmente la barra;
   * - si se busca dentro de un retumbar largo, éste reaparece en el punto
   *   correcto de su duración;
   * - no hay retumbares fuera de los tiempos definidos aquí.
   */

  const nativeSetTimeout = window.setTimeout.bind(window);

  /*
   * app.js v5.1.7 todavía contiene un motor de retumbares aleatorios.
   * Este archivo carga antes que app.js y neutraliza únicamente el timer
   * que programa esos retumbares en Smash, sin tocar cámara, clima ni otros timers.
   */
  window.setTimeout = function patchedSetTimeout(callback, delay, ...args) {
    if (typeof callback === 'function') {
      try {
        const source = Function.prototype.toString.call(callback);
        if (
          source.includes('triggerSceneRumble(gameId)') &&
          source.includes('profile.waitMin') &&
          source.includes('profile.waitMax')
        ) {
          return 0;
        }
      } catch (_) {}
    }

    return nativeSetTimeout(callback, delay, ...args);
  };

  const body = document.body;
  const audio = document.getElementById('audio');
  if (!body || !audio) return;

  const SMASH_ID = 'super-smash-bros-ultimate';
  const LOOP_SECONDS = 99;
  const MOBILE_QUERY = '(max-width: 900px) and (hover: none) and (pointer: coarse)';

  /*
   * Timeline exacta de UN loop de The Dark Realm.
   *
   * duration está en milisegundos.
   * Los triples/cuádruples son golpes separados reales.
   */
  const EVENTS = [
    { at: 8.00,  kind: 'weak',          duration: 430,  strength: 0.38, speed: 1.08, mode: 'hit' },

    { at: 15.00, kind: 'triple-medium', duration: 180,  strength: 0.88, speed: 1.62, mode: 'hit' },
    { at: 15.23, kind: 'triple-medium', duration: 180,  strength: 0.88, speed: 1.62, mode: 'hit' },
    { at: 15.46, kind: 'triple-medium', duration: 180,  strength: 0.88, speed: 1.62, mode: 'hit' },

    { at: 16.00, kind: 'very-strong',   duration: 1500, strength: 2.20, speed: 0.96, mode: 'sustain' },

    { at: 24.00, kind: 'strong-long',   duration: 3500, strength: 1.58, speed: 0.58, mode: 'sustain' },

    { at: 30.00, kind: 'quad',          duration: 145,  strength: 0.96, speed: 1.78, mode: 'hit' },
    { at: 30.18, kind: 'quad',          duration: 145,  strength: 0.96, speed: 1.78, mode: 'hit' },
    { at: 30.36, kind: 'quad',          duration: 145,  strength: 0.96, speed: 1.78, mode: 'hit' },
    { at: 30.54, kind: 'quad',          duration: 145,  strength: 0.96, speed: 1.78, mode: 'hit' },

    { at: 34.00, kind: 'super',         duration: 3500, strength: 3.05, speed: 0.78, mode: 'sustain', cinematic: true },

    { at: 50.00, kind: 'strong',        duration: 1500, strength: 1.62, speed: 0.94, mode: 'sustain' },

    { at: 57.00, kind: 'triple-strong', duration: 205,  strength: 1.48, speed: 1.62, mode: 'hit' },
    { at: 57.23, kind: 'triple-strong', duration: 205,  strength: 1.48, speed: 1.62, mode: 'hit' },
    { at: 57.46, kind: 'triple-strong', duration: 205,  strength: 1.48, speed: 1.62, mode: 'hit' },

    { at: 58.00, kind: 'strong-short',  duration: 1000, strength: 1.62, speed: 1.00, mode: 'sustain' },

    { at: 74.00, kind: 'weak-late',     duration: 560,  strength: 0.52, speed: 1.06, mode: 'hit' },

    { at: 85.00, kind: 'giant',         duration: 2000, strength: 3.55, speed: 0.72, mode: 'sustain', cinematic: true }
  ];

  let frame = 0;
  let lastAudioTime = null;
  let pulses = [];
  let cinematicTimer = 0;

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

  function shouldSync() {
    return !isMobileLite() &&
      !document.hidden &&
      !audio.paused &&
      isSmashRoute() &&
      isSmashTrack();
  }

  function modLoop(seconds) {
    return ((seconds % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;
  }

  function clearVars() {
    body.style.setProperty('--music-rumble-x', '0px');
    body.style.setProperty('--music-rumble-y', '0px');
    body.style.setProperty('--music-rumble-rot', '0deg');
    body.style.setProperty('--music-rumble-fx-x', '0px');
    body.style.setProperty('--music-rumble-fx-y', '0px');
    body.style.setProperty('--music-rumble-fx-rot', '0deg');
    body.style.setProperty('--music-super-duration', '1.45s');
    body.classList.remove('music-rumble-active', 'music-super-rumble');
  }

  function stopSync(clearPulseState = true) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastAudioTime = null;

    if (clearPulseState) {
      pulses = [];
      window.clearTimeout(cinematicTimer);
      cinematicTimer = 0;
      clearVars();
    }
  }

  function setCinematicPulse(durationMs) {
    body.classList.remove('music-super-rumble');
    body.style.setProperty('--music-super-duration', `${Math.max(0.12, durationMs / 1000).toFixed(2)}s`);

    requestAnimationFrame(() => {
      body.classList.add('music-super-rumble');
    });

    window.clearTimeout(cinematicTimer);
    cinematicTimer = nativeSetTimeout(() => {
      body.classList.remove('music-super-rumble');
      cinematicTimer = 0;
    }, Math.max(120, durationMs));
  }

  function addPulse(event, elapsedMs = 0) {
    const safeElapsed = Math.max(0, Math.min(event.duration - 1, elapsedMs));
    const remaining = Math.max(1, event.duration - safeElapsed);

    pulses.push({
      ...event,
      startedAt: performance.now() - safeElapsed,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2
    });

    if (event.cinematic) setCinematicPulse(remaining);
  }

  function envelopeFor(pulse, elapsed) {
    const duration = pulse.duration;

    if (pulse.mode === 'sustain') {
      // Ataque rápido, cuerpo sostenido y caída al final.
      const attack = Math.min(1, elapsed / Math.min(120, duration * 0.14));
      const release = Math.min(1, Math.max(0, duration - elapsed) / Math.min(260, duration * 0.18));
      return Math.min(attack, release);
    }

    const t = Math.min(1, Math.max(0, elapsed / duration));
    return Math.pow(Math.sin(Math.PI * t), 0.68);
  }

  function processTimeline(previous, current, now) {
    if (!Number.isFinite(previous) || !Number.isFinite(current)) return;
    if (current <= previous) return;

    // Un salto grande es un seek: no reproducimos retrospectivamente
    // todos los golpes que quedaron entre ambos tiempos.
    if ((current - previous) > 0.80) return;

    const firstLoop = Math.max(0, Math.floor(previous / LOOP_SECONDS) - 1);
    const lastLoop = Math.max(firstLoop, Math.floor(current / LOOP_SECONDS) + 1);

    for (let loopIndex = firstLoop; loopIndex <= lastLoop; loopIndex += 1) {
      const loopStart = loopIndex * LOOP_SECONDS;

      for (const event of EVENTS) {
        const eventTime = loopStart + event.at;

        if (eventTime > previous && eventTime <= current + 0.024) {
          const latenessMs = Math.max(0, (current - eventTime) * 1000);
          addPulse(event, Math.min(latenessMs, event.duration - 1));
        }
      }
    }
  }

  function restoreActivePulsesAt(audioTime) {
    pulses = [];
    window.clearTimeout(cinematicTimer);
    cinematicTimer = 0;
    body.classList.remove('music-super-rumble');

    const position = modLoop(audioTime);

    for (const event of EVENTS) {
      const elapsedSeconds = position - event.at;
      const durationSeconds = event.duration / 1000;

      if (elapsedSeconds >= 0 && elapsedSeconds < durationSeconds) {
        addPulse(event, elapsedSeconds * 1000);
      }
    }

    renderPulses(performance.now());
  }

  function renderPulses(now) {
    let x = 0;
    let y = 0;
    let rot = 0;
    let strongest = 0;

    const cinematicBoost = body.classList.contains('background-only') ? 1.20 : 1;
    const next = [];

    for (const pulse of pulses) {
      const elapsed = now - pulse.startedAt;
      if (elapsed < 0 || elapsed >= pulse.duration) continue;

      next.push(pulse);

      const envelope = envelopeFor(pulse, elapsed);
      const speed = pulse.speed;
      const strength = pulse.strength * cinematicBoost;
      const grit = ((Math.random() * 2) - 1) * (pulse.mode === 'sustain' ? 0.12 : 0.17);

      const waveX =
        Math.sin(elapsed * 0.040 * speed + pulse.phaseX) +
        Math.sin(elapsed * 0.071 * speed + pulse.phaseX * 1.71) * 0.42;

      const waveY =
        Math.sin(elapsed * 0.052 * speed + pulse.phaseY) +
        Math.sin(elapsed * 0.089 * speed + pulse.phaseY * 1.49) * 0.34;

      x += (waveX + grit) * 2.25 * strength * envelope;
      y += (waveY + grit * 0.62) * 1.35 * strength * envelope;
      rot += (Math.sin(elapsed * 0.036 * speed + 0.4) + grit * 0.28) *
        0.075 * strength * envelope;

      strongest = Math.max(strongest, strength * envelope);
    }

    pulses = next;

    // Los golpes gigantes pueden ser muy bestias sin sacar la imagen del marco.
    x = Math.max(-17, Math.min(17, x));
    y = Math.max(-11, Math.min(11, y));
    rot = Math.max(-0.56, Math.min(0.56, rot));

    body.style.setProperty('--music-rumble-x', `${x.toFixed(2)}px`);
    body.style.setProperty('--music-rumble-y', `${y.toFixed(2)}px`);
    body.style.setProperty('--music-rumble-rot', `${rot.toFixed(3)}deg`);

    body.style.setProperty('--music-rumble-fx-x', `${(x * 0.76).toFixed(2)}px`);
    body.style.setProperty('--music-rumble-fx-y', `${(y * 0.76).toFixed(2)}px`);
    body.style.setProperty('--music-rumble-fx-rot', `${(rot * 0.52).toFixed(3)}deg`);

    body.classList.toggle('music-rumble-active', strongest > 0.02);
  }

  function tick(now) {
    if (!shouldSync()) {
      frame = 0;
      pulses = [];
      clearVars();
      return;
    }

    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    if (lastAudioTime === null) {
      lastAudioTime = current;
    } else if (current + 0.05 < lastAudioTime) {
      // El archivo ha hecho loop o se ha retrocedido.
      lastAudioTime = current;
      restoreActivePulsesAt(current);
    } else {
      processTimeline(lastAudioTime, current, now);
      lastAudioTime = current;
    }

    renderPulses(now);
    frame = requestAnimationFrame(tick);
  }

  function startSync({ restorePosition = false } = {}) {
    if (!shouldSync()) return;

    if (frame) cancelAnimationFrame(frame);

    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    lastAudioTime = current;

    if (restorePosition) restoreActivePulsesAt(current);

    frame = requestAnimationFrame(tick);
  }

  audio.addEventListener('play', () => {
    startSync({ restorePosition: true });
  });

  audio.addEventListener('pause', () => {
    stopSync(true);
  });

  audio.addEventListener('seeking', () => {
    stopSync(true);
  });

  audio.addEventListener('seeked', () => {
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    lastAudioTime = current;

    // Esto hace que mover la canción a 25 s, 35 s, 50.5 s, 85.5 s, etc.
    // reconstruya inmediatamente el retumbar que corresponde a ese instante.
    restoreActivePulsesAt(current);

    if (!audio.paused) startSync({ restorePosition: true });
  });

  audio.addEventListener('emptied', () => {
    stopSync(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSync(true);
    } else if (!audio.paused) {
      startSync({ restorePosition: true });
    }
  });

  window.addEventListener('hashchange', () => {
    stopSync(true);
    if (!audio.paused) startSync({ restorePosition: true });
  });
})();
