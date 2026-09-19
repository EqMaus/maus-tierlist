(function () {
  'use strict';
  const KEY = 'mausEffectsModeV1';
  const modes = ['full', 'reduced', 'off'];
  const system = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 900px) and (hover: none) and (pointer: coarse)');
  let mode = 'full';
  try { const saved = localStorage.getItem(KEY); if (modes.includes(saved)) mode = saved; } catch (_) {}
  const effective = () => mode === 'full' && system.matches ? 'reduced' : mode;
  function sync() {
    document.body.dataset.effects = effective();
    document.querySelectorAll('[name="effects-mode"]').forEach(input => { input.checked = input.value === mode; });
    const note = document.getElementById('effectsStatus');
    if (note) note.textContent = mode === 'full' && system.matches
      ? 'Tu sistema pide movimiento reducido: se aplica el ambiente estático.'
      : mode === 'full' && mobile.matches
        ? 'Todos los efectos disponibles para tu dispositivo. En móvil se mantiene la adaptación ligera.'
        : ({ full: 'Cámara, partículas, clima y efectos musicales. La música no cambia.', reduced: 'Ambiente estático, sin cámara, destellos ni temblores. La música no cambia.', off: 'Solo el fondo, sin capas ambientales ni movimiento. La música no cambia.' })[mode];
  }
  function refresh() {
    sync();
    window.dispatchEvent(new CustomEvent('maus:effectschange', { detail: { mode, effective: effective() } }));
  }
  function setMode(value) {
    if (!modes.includes(value)) return;
    if (value === mode) { sync(); return; }
    mode = value;
    try { localStorage.setItem(KEY, mode); } catch (_) {}
    refresh();
  }
  window.MausEffects = { getMode: () => mode, effective, motionAllowed: () => effective() === 'full' && !mobile.matches, setMode };
  document.querySelectorAll('[name="effects-mode"]').forEach(input => input.addEventListener('change', () => { if (input.checked) setMode(input.value); }));
  system.addEventListener('change', refresh);
  mobile.addEventListener('change', refresh);
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    mode = modes.includes(event.newValue) ? event.newValue : 'full';
    refresh();
  });
  sync();
})();
