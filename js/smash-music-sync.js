(function () {
  'use strict';

  /*
   * v5.1.8 · Super Smash Bros. Ultimate
   * Sincroniza los retumbares de cámara con The Dark Realm.
   *
   * Este archivo se carga ANTES de app.js para impedir que el motor
   * aleatorio de retumbares de v5.1.7 programe golpes fuera de la música.
   */

  const nativeSetTimeout = window.setTimeout.bind(window);

  window.setTimeout = function patchedSetTimeout(callback, delay, ...args) {
    if (typeof callback === 'function') {
      try {
        const source = Function.prototype.toString.call(callback);

        // Es específicamente el queueNext del retumbar aleatorio de v5.1.7.
        // No afecta al clima, cámara autónoma ni al resto de timers.
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
  const PERIOD = 42;
  const MOBILE_QUERY = '(max-width: 900px) and (hover: none) and (pointer: coarse)';

  const BASE_EVENTS = [
    { at: 8.00, kind: 'opening' },

    { at: 15.00, kind: 'triple' },
    { at: 15.22, kind: 'triple' },
    { at: 15.44, kind: 'triple' },

    { at: 16.00, kind: 'very-strong' },

    { at: 24.00, kind: 'sustain' },

    { at: 30.00, kind: 'quad' },
    { at: 30.18, kind: 'quad' },
    { at: 30.36, kind: 'quad' },
    { at: 30.54, kind: 'quad' },

    { at: 34.00, kind: 'super' }
  ];

  let frame = 0;
  let lastAudioTime = null;
  let pulses = [];
  let superClassTimer = 0;

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

  function clearVars() {
    body.style.setProperty('--music-rumble-x', '0px');
    body.style.setProperty('--music-rumble-y', '0px');
    body.style.setProperty('--music-rumble-rot', '0deg');
    body.style.setProperty('--music-rumble-fx-x', '0px');
    body.style.setProperty('--music-rumble-fx-y', '0px');
    body.style.setProperty('--music-rumble-fx-rot', '0deg');
    body.classList.remove('music-rumble-active', 'music-super-rumble');
  }

  function stopSync(clearPulseState = true) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastAudioTime = null;

    if (clearPulseState) {
      pulses = [];
      clearVars();
    }
  }

  function pulsePreset(kind, cycleIndex) {
    const laterCycle = cycleIndex >= 1;

    switch (kind) {
      case 'opening':
        // 0:08 muy flojo; 0:50 y siguientes, fuerte.
        return laterCycle
          ? { strength: 1.38, duration: 720, speed: 1.00 }
          : { strength: 0.38, duration: 430, speed: 1.08 };

      case 'triple':
        // Primer bloque: decente. Desde 0:57: triple fuerte.
        return laterCycle
          ? { strength: 1.42, duration: 205, speed: 1.55 }
          : { strength: 0.86, duration: 185, speed: 1.55 };

      case 'very-strong':
        return { strength: 2.15, duration: 930, speed: 0.96 };

      case 'sustain':
        // 24 → 26: retumbar largo y fuerte.
        return { strength: 1.52, duration: 2000, speed: 0.54 };

      case 'quad':
        return { strength: 0.96, duration: 155, speed: 1.72 };

      case 'super':
        return { strength: 2.95, duration: 1480, speed: 0.82 };

      default:
        return { strength: 1, duration: 600, speed: 1 };
    }
  }

  function flashSuper() {
    body.classList.remove('music-super-rumble');

    requestAnimationFrame(() => {
      body.classList.add('music-super-rumble');
    });

    window.clearTimeout(superClassTimer);
    superClassTimer = nativeSetTimeout(() => {
      body.classList.remove('music-super-rumble');
    }, 1500);
  }

  function addPulse(kind, cycleIndex) {
    const preset = pulsePreset(kind, cycleIndex);

    pulses.push({
      kind,
      startedAt: performance.now(),
      duration: preset.duration,
      strength: preset.strength,
      speed: preset.speed,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2
    });

    if (kind === 'super') flashSuper();
  }

  function processTimeline(previous, current) {
    if (!Number.isFinite(previous) || !Number.isFinite(current)) return;
    if (current <= previous) return;

    // Al mover la barra o tras un salto de reproducción no disparamos
    // de golpe todos los impactos que quedaron atrás.
    if ((current - previous) > 0.80) return;

    const firstCycle = Math.max(0, Math.floor(previous / PERIOD) - 1);
    const lastCycle = Math.max(firstCycle, Math.floor(current / PERIOD) + 1);

    for (let cycleIndex = firstCycle; cycleIndex <= lastCycle; cycleIndex += 1) {
      const cycleStart = cycleIndex * PERIOD;

      for (const event of BASE_EVENTS) {
        const eventTime = cycleStart + event.at;

        if (eventTime > previous && eventTime <= current + 0.024) {
          addPulse(event.kind, cycleIndex);
        }
      }
    }
  }

  function renderPulses(now) {
    let x = 0;
    let y = 0;
    let rot = 0;
    let strongest = 0;

    const cinematic = body.classList.contains('background-only') ? 1.20 : 1;
    const next = [];

    for (const pulse of pulses) {
      const elapsed = now - pulse.startedAt;
      const t = elapsed / pulse.duration;

      if (t >= 1) continue;

      next.push(pulse);

      const envelope = Math.pow(Math.sin(Math.PI * Math.max(0, t)), 0.70);
      const speed = pulse.speed;
      const s = pulse.strength * cinematic;
      const grit = ((Math.random() * 2) - 1) * 0.15;

      const waveX =
        Math.sin(elapsed * 0.040 * speed + pulse.phaseX) +
        Math.sin(elapsed * 0.071 * speed + pulse.phaseX * 1.71) * 0.42;

      const waveY =
        Math.sin(elapsed * 0.052 * speed + pulse.phaseY) +
        Math.sin(elapsed * 0.089 * speed + pulse.phaseY * 1.49) * 0.34;

      x += (waveX + grit) * 2.25 * s * envelope;
      y += (waveY + grit * 0.62) * 1.35 * s * envelope;
      rot += (Math.sin(elapsed * 0.036 * speed + 0.4) + grit * 0.28) *
        0.075 * s * envelope;

      strongest = Math.max(strongest, s * envelope);
    }

    pulses = next;

    // Evita que varios impactos solapados desplacen la imagen demasiado.
    x = Math.max(-14, Math.min(14, x));
    y = Math.max(-9, Math.min(9, y));
    rot = Math.max(-0.46, Math.min(0.46, rot));

    body.style.setProperty('--music-rumble-x', `${x.toFixed(2)}px`);
    body.style.setProperty('--music-rumble-y', `${y.toFixed(2)}px`);
    body.style.setProperty('--music-rumble-rot', `${rot.toFixed(3)}deg`);

    // Rayos/iluminación acompañan a la cámara, pero un poco menos.
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
      // Loop o seek hacia atrás.
      lastAudioTime = current;
      pulses = [];
    } else {
      processTimeline(lastAudioTime, current);
      lastAudioTime = current;
    }

    renderPulses(now);
    frame = requestAnimationFrame(tick);
  }

  function startSync() {
    if (!shouldSync()) return;

    if (frame) cancelAnimationFrame(frame);
    lastAudioTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    frame = requestAnimationFrame(tick);
  }

  audio.addEventListener('play', startSync);

  audio.addEventListener('pause', () => {
    stopSync(true);
  });

  audio.addEventListener('seeking', () => {
    stopSync(true);
  });

  audio.addEventListener('seeked', () => {
    lastAudioTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    if (!audio.paused) startSync();
  });

  audio.addEventListener('emptied', () => {
    stopSync(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSync(true);
    else if (!audio.paused) startSync();
  });

  window.addEventListener('hashchange', () => {
    stopSync(true);
    if (!audio.paused) startSync();
  });
})();
