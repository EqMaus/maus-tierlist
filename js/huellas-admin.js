(function () {
  'use strict';

  const API = 'https://maus-huellas.enriquegonzalvezastiz.workers.dev';
  const tab = document.getElementById('huellasAdminTab');
  const panel = document.getElementById('huellasAdminPanel');
  const tokenInput = document.getElementById('huellasAdminToken');
  const connectButton = document.getElementById('huellasConnectButton');
  const refreshButton = document.getElementById('huellasRefreshButton');
  const content = document.getElementById('huellasAdminContent');
  const list = document.getElementById('huellasAdminList');
  const count = document.getElementById('huellasAdminCount');
  const status = document.getElementById('huellasAdminStatus');
  const gameSidebar = document.querySelector('.game-sidebar');
  const gameForm = document.getElementById('gameForm');
  const contentRoot = document.getElementById('contentEditorRoot');
  const editorPanel = document.getElementById('editorPanel');
  const editorTitle = document.getElementById('editorTitle');
  const editorSubtitle = document.getElementById('editorSubtitle');
  const publishActions = document.querySelector('.publish-actions');
  if (!tab || !panel) return;

  let adminToken = sessionStorage.getItem('mausHuellasAdminToken') || '';
  if (adminToken) tokenInput.value = adminToken;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatDate = (value) => {
    if (!value) return 'Sin fecha';
    const d = new Date(String(value).replace(' ', 'T') + (String(value).includes('Z') ? '' : 'Z'));
    return Number.isNaN(d.getTime()) ? String(value) : new Intl.DateTimeFormat('es-ES', {dateStyle:'medium', timeStyle:'short'}).format(d);
  };
  function setStatus(message, error) {
    status.textContent = message || '';
    status.classList.toggle('is-error', Boolean(error));
  }
  async function request(path, options = {}) {
    const response = await fetch(API + path, {
      ...options,
      headers: {
        ...(options.body ? {'Content-Type':'application/json'} : {}),
        'Authorization': 'Bearer ' + adminToken,
        ...(options.headers || {})
      }
    });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data.error || ('Error HTTP ' + response.status));
    return data;
  }
  function render(items) {
    count.textContent = items.length + (items.length === 1 ? ' huella' : ' huellas');
    if (!items.length) {
      list.innerHTML = '<div class="huellas-admin-empty">No hay huellas todavía.</div>';
      return;
    }
    list.innerHTML = items.map((item) => `
      <article class="huella-admin-card ${item.aprobado ? '' : 'is-hidden'}" data-huella-id="${Number(item.id)}">
        <div class="huella-admin-main">
          <div class="huella-admin-head">
            <strong>${esc(item.nombre)}</strong>
            <span class="huella-admin-state">${item.aprobado ? 'VISIBLE' : 'OCULTA'}</span>
          </div>
          <p>${esc(item.mensaje).replace(/\n/g, '<br>')}</p>
          <small>#${Number(item.id)} · ${esc(formatDate(item.created_at))}</small>
        </div>
        <div class="huella-admin-actions">
          <button class="ghost-button" type="button" data-toggle-huella="${item.aprobado ? 'hide' : 'show'}">${item.aprobado ? 'Ocultar' : 'Restaurar'}</button>
          <button class="huella-delete-button" type="button" data-delete-huella>Eliminar</button>
        </div>
      </article>`).join('');
  }
  async function load() {
    if (!adminToken) { setStatus('Introduce tu ADMIN_TOKEN.', true); return; }
    setStatus('Cargando huellas…');
    connectButton.disabled = true;
    refreshButton.disabled = true;
    try {
      const data = await request('/admin/huellas');
      sessionStorage.setItem('mausHuellasAdminToken', adminToken);
      content.hidden = false;
      render(Array.isArray(data.huellas) ? data.huellas : []);
      setStatus('Moderación conectada.');
    } catch (error) {
      content.hidden = true;
      setStatus(error.message === 'No autorizado.' ? 'ADMIN_TOKEN incorrecto.' : error.message, true);
    } finally {
      connectButton.disabled = false;
      refreshButton.disabled = false;
    }
  }
  function showPanel() {
    document.querySelectorAll('[data-editor-view]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    tab.setAttribute('aria-pressed', 'true');
    if (gameSidebar) gameSidebar.hidden = true;
    if (gameForm) gameForm.hidden = true;
    if (contentRoot) contentRoot.hidden = true;
    panel.hidden = false;
    editorPanel.classList.add('content-editing', 'huellas-editing');
    editorTitle.textContent = 'Moderación de huellas';
    editorSubtitle.textContent = 'Oculta, restaura o elimina mensajes sin entrar en Cloudflare.';
    if (publishActions) publishActions.hidden = true;
    if (adminToken && content.hidden) load();
  }
  function hidePanel() {
    panel.hidden = true;
    tab.setAttribute('aria-pressed', 'false');
    editorPanel.classList.remove('huellas-editing');
    if (publishActions) publishActions.hidden = false;
  }
  tab.addEventListener('click', showPanel);
  document.querySelectorAll('[data-editor-view]').forEach((button) => button.addEventListener('click', hidePanel));
  connectButton.addEventListener('click', () => { adminToken = tokenInput.value.trim(); load(); });
  tokenInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); adminToken = tokenInput.value.trim(); load(); } });
  refreshButton.addEventListener('click', load);
  list.addEventListener('click', async (event) => {
    const card = event.target.closest('[data-huella-id]');
    if (!card) return;
    const id = Number(card.dataset.huellaId);
    const toggle = event.target.closest('[data-toggle-huella]');
    const del = event.target.closest('[data-delete-huella]');
    if (!toggle && !del) return;
    try {
      if (toggle) {
        const show = toggle.dataset.toggleHuella === 'show';
        toggle.disabled = true;
        await request('/admin/huellas/' + id, {method:'PATCH', body:JSON.stringify({aprobado:show})});
        setStatus(show ? 'Huella restaurada.' : 'Huella ocultada.');
      } else {
        if (!confirm('¿Eliminar definitivamente esta huella? Esta acción no se puede deshacer.')) return;
        del.disabled = true;
        await request('/admin/huellas/' + id, {method:'DELETE'});
        setStatus('Huella eliminada definitivamente.');
      }
      await load();
    } catch (error) {
      setStatus(error.message, true);
      if (toggle) toggle.disabled = false;
      if (del) del.disabled = false;
    }
  });
})();
