(() => {
  'use strict';

  const API = 'https://maus-huellas.enriquegonzalvezastiz.workers.dev';
  const SITE_KEY = '0x4AAAAAAE8lOL9pelCi0DrV';
  let widgetId = null;
  let token = '';
  let renderEpoch = 0;

  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  function card(item) {
    const date = item.created_at ? new Date(item.created_at.replace(' ', 'T') + 'Z') : null;
    const when = date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat('es-ES', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(date)
      : '';
    return `<article class="huella-card"><div class="huella-card-head"><strong>${esc(item.nombre)}</strong><time>${esc(when)}</time></div><p>${esc(item.mensaje)}</p></article>`;
  }

  async function loadList(root) {
    const list = root.querySelector('#huellasList');
    if (!list) return;
    list.innerHTML = '<div class="huellas-loading">Cargando huellas…</div>';
    try {
      const response = await fetch(`${API}/huellas`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudieron cargar las huellas.');
      list.innerHTML = data.huellas.length
        ? data.huellas.map(card).join('')
        : '<div class="huellas-empty"><strong>Todavía no hay huellas.</strong><span>Puedes ser la primera persona en dejar una.</span></div>';
    } catch (error) {
      list.innerHTML = `<div class="huellas-error">${esc(error.message || 'No se pudieron cargar las huellas.')}</div>`;
    }
  }

  function mountTurnstile(root, epoch) {
    const slot = root.querySelector('#huellasTurnstile');
    if (!slot || epoch !== renderEpoch) return;
    if (!window.turnstile) {
      setTimeout(() => mountTurnstile(root, epoch), 150);
      return;
    }
    token = '';
    widgetId = window.turnstile.render(slot, {
      sitekey: SITE_KEY,
      theme: 'dark',
      callback(value) { token = value; },
      'expired-callback'() { token = ''; },
      'error-callback'() { token = ''; }
    });
  }

  function resetTurnstile() {
    token = '';
    if (window.turnstile && widgetId !== null) {
      try { window.turnstile.reset(widgetId); } catch (_) {}
    }
  }

  function render(app) {
    renderEpoch += 1;
    const epoch = renderEpoch;
    widgetId = null;
    token = '';
    app.innerHTML = `
      <div class="page huellas-page">
        <section class="huellas-hero">
          <span class="eyebrow">LIBRO DE VISITAS</span>
          <h1 class="page-title">Deja tu huella.</h1>
          <p class="page-lead">Si has pasado por aquí, puedes dejar un mensaje. Quedará guardado en la web junto al de quienes vengan después.</p>
        </section>
        <div class="huellas-layout">
          <section class="huellas-compose" aria-labelledby="huellasFormTitle">
            <div class="huellas-section-head"><span>01</span><div><h2 id="huellasFormTitle">Escribe algo</h2><p>Nombre y mensaje. Sin cuentas ni registros.</p></div></div>
            <form id="huellasForm" class="huellas-form">
              <label><span>Tu nombre</span><input id="huellasNombre" name="nombre" type="text" maxlength="40" autocomplete="nickname" required placeholder="¿Quién eres?"></label>
              <label><span>Tu huella</span><textarea id="huellasMensaje" name="mensaje" maxlength="500" rows="6" required placeholder="Escribe lo que quieras dejar por aquí…"></textarea><small><b id="huellasCount">0</b> / 500</small></label>
              <div id="huellasTurnstile" class="huellas-turnstile"></div>
              <div class="huellas-submit-row"><button class="primary-button" type="submit">Dejar mi huella</button><p id="huellasStatus" role="status" aria-live="polite"></p></div>
            </form>
          </section>
          <section class="huellas-wall" aria-labelledby="huellasWallTitle">
            <div class="huellas-section-head"><span>02</span><div><h2 id="huellasWallTitle">Huellas</h2><p>Las últimas 100 que han dejado por aquí.</p></div></div>
            <div id="huellasList" class="huellas-list"></div>
          </section>
        </div>
      </div>`;

    const form = app.querySelector('#huellasForm');
    const message = app.querySelector('#huellasMensaje');
    const count = app.querySelector('#huellasCount');
    const status = app.querySelector('#huellasStatus');
    message?.addEventListener('input', () => { count.textContent = String(message.value.length); });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const nombre = app.querySelector('#huellasNombre').value.trim();
      const mensaje = message.value.trim();
      status.className = '';
      if (!token) { status.textContent = 'Completa la verificación antes de enviar.'; status.className = 'is-error'; return; }
      button.disabled = true;
      status.textContent = 'Guardando…';
      try {
        const response = await fetch(`${API}/huellas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, mensaje, turnstileToken: token })
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudo guardar la huella.');
        form.reset(); count.textContent = '0'; resetTurnstile();
        status.textContent = 'Huella guardada.'; status.className = 'is-success';
        await loadList(app);
      } catch (error) {
        status.textContent = error.message || 'No se pudo guardar la huella.';
        status.className = 'is-error';
        resetTurnstile();
      } finally { button.disabled = false; }
    });

    mountTurnstile(app, epoch);
    void loadList(app);
  }

  window.MausHuellas = { render };
})();
