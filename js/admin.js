(function () {
  'use strict';

  const OWNER = 'EqMaus';
  const REPO = 'maus-tierlist';
  const BRANCH = 'main';
  const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
  const TOKEN_KEY = 'mausTierGithubAdminToken';
  const API_VERSION = '2022-11-28';

  const $ = (id) => document.getElementById(id);
  const loginPanel = $('loginPanel');
  const editorPanel = $('editorPanel');
  const tokenInput = $('tokenInput');
  const connectButton = $('connectButton');
  const logoutButton = $('logoutButton');
  const loginError = $('loginError');
  const connectionBadge = $('connectionBadge');
  const versionBadge = $('versionBadge');
  const gameCount = $('gameCount');
  const gameSearch = $('gameSearch');
  const gameList = $('gameList');
  const gameForm = $('gameForm');
  const editorTitle = $('editorTitle');
  const editorSubtitle = $('editorSubtitle');
  const gameIdBadge = $('gameIdBadge');
  const fieldTitle = $('fieldTitle');
  const fieldYear = $('fieldYear');
  const fieldPlatform = $('fieldPlatform');
  const fieldFranchise = $('fieldFranchise');
  const fieldScore = $('fieldScore');
  const fieldLabel = $('fieldLabel');
  const fieldTierOrder = $('fieldTierOrder');
  const fieldTierVisible = $('fieldTierVisible');
  const fieldReviewDate = $('fieldReviewDate');
  const fieldSpoilers = $('fieldSpoilers');
  const fieldExcerpt = $('fieldExcerpt');
  const fieldReview = $('fieldReview');
  const excerptCount = $('excerptCount');
  const reviewCount = $('reviewCount');
  const tierEditor = $('tierEditor');
  const dirtyBadge = $('dirtyBadge');
  const discardButton = $('discardButton');
  const publishButton = $('publishButton');
  const publishNotice = $('publishNotice');
  const busyOverlay = $('busyOverlay');
  const busyTitle = $('busyTitle');
  const busyText = $('busyText');

  let token = '';
  let games = [];
  let scale = [];
  let selectedId = '';
  let currentVersion = '';
  let baseSnapshot = '';
  let baseShas = { siteData: '', index: '', version: '' };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function currentSnapshot() {
    return JSON.stringify({ games, scale });
  }

  function isDirty() {
    return Boolean(baseSnapshot) && currentSnapshot() !== baseSnapshot;
  }

  function updateDirtyUi() {
    const dirty = isDirty();
    dirtyBadge.hidden = !dirty;
    discardButton.disabled = !dirty;
    publishButton.disabled = !dirty;
  }

  function setBusy(active, title = 'Publicando cambios…', text = 'No cierres esta pestaña.') {
    busyOverlay.hidden = !active;
    busyTitle.textContent = title;
    busyText.textContent = text;
  }

  function showNotice(message, error = false) {
    publishNotice.hidden = false;
    publishNotice.classList.toggle('error', error);
    publishNotice.innerHTML = message;
  }

  function clearNotice() {
    publishNotice.hidden = true;
    publishNotice.classList.remove('error');
    publishNotice.textContent = '';
  }

  function headers(json = false) {
    const result = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': API_VERSION
    };
    if (json) result['Content-Type'] = 'application/json';
    return result;
  }

  async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers(Boolean(options.body)), ...(options.headers || {}) },
      cache: 'no-store'
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
    if (!response.ok) {
      const message = data && typeof data === 'object' && data.message ? data.message : `Error ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  function decodeBase64(value) {
    const binary = atob(String(value || '').replace(/\s/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    const size = 0x8000;
    for (let i = 0; i < bytes.length; i += size) {
      binary += String.fromCharCode(...bytes.subarray(i, i + size));
    }
    return btoa(binary);
  }

  async function getFile(path) {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    const data = await apiFetch(`${API}/contents/${encoded}?ref=${encodeURIComponent(BRANCH)}&_=${Date.now()}`);
    if (!data || data.type !== 'file' || typeof data.content !== 'string') throw new Error(`No se pudo leer ${path}`);
    return { sha: data.sha, content: decodeBase64(data.content) };
  }

  async function putFile(path, content, sha, message) {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    return apiFetch(`${API}/contents/${encoded}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodeBase64(content),
        sha,
        branch: BRANCH
      })
    });
  }

  function parseSiteData(source) {
    const match = String(source).match(/window\.MAUS_GAMES\s*=\s*(\[[\s\S]*?\]);\s*window\.MAUS_SCALE\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) throw new Error('No se pudo interpretar js/site-data.js.');
    const parsedGames = JSON.parse(match[1]);
    const parsedScale = JSON.parse(match[2]);
    if (!Array.isArray(parsedGames) || !Array.isArray(parsedScale)) throw new Error('Los datos del sitio no tienen el formato esperado.');
    return { games: parsedGames, scale: parsedScale };
  }

  function serializeSiteData(nextGames, nextScale) {
    return `(function () {\n  'use strict';\n\n  window.MAUS_GAMES = ${JSON.stringify(nextGames, null, 2)};\n\n  window.MAUS_SCALE = ${JSON.stringify(nextScale, null, 2)};\n})();\n`;
  }

  function parseVersion(source) {
    const parsed = JSON.parse(source);
    const version = String(parsed && parsed.version || '').trim();
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('version.json no contiene una versión válida.');
    return version;
  }

  function nextPatchVersion(version) {
    const parts = version.split('.').map(Number);
    parts[2] += 1;
    return parts.join('.');
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function bumpIndexVersion(source, fromVersion, toVersion) {
    let next = String(source);
    const from = escapeRegExp(fromVersion);
    next = next.replace(new RegExp(`(<title>Tier List de Maus — v)${from}(</title>)`), `$1${toVersion}$2`);
    next = next.replace(new RegExp(`(window\\.MAUS_BUILD_VERSION\\s*=\\s*['"])${from}(['"])`), `$1${toVersion}$2`);
    next = next.replace(new RegExp(`(\\?v=)${from}`, 'g'), `$1${toVersion}`);
    if (next === source) throw new Error(`No pude actualizar index.html de ${fromVersion} a ${toVersion}.`);
    if (!next.includes(`window.MAUS_BUILD_VERSION = '${toVersion}'`) && !next.includes(`window.MAUS_BUILD_VERSION = "${toVersion}"`)) {
      throw new Error('No pude confirmar la nueva versión dentro de index.html.');
    }
    return next;
  }

  function tierForScore(score) {
    return scale.find((row) => Number(row.score) === Number(score)) || null;
  }

  function sortedGames() {
    return [...games].sort((a, b) => (b.score - a.score) || ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || String(a.title).localeCompare(String(b.title), 'es'));
  }

  function selectedGame() {
    return games.find((game) => game.id === selectedId) || null;
  }

  function renderScoreOptions() {
    fieldScore.innerHTML = scale.map((row) => `<option value="${esc(row.score)}">${esc(row.score)} — ${esc(row.label)}</option>`).join('');
  }

  function renderTierEditor() {
    tierEditor.innerHTML = scale.map((row, index) => `
      <label class="tier-row">
        <span class="tier-score">${esc(row.score)}</span>
        <input type="text" data-tier-index="${index}" value="${esc(row.label)}" aria-label="Nombre del tier ${esc(row.score)}">
      </label>`).join('');
  }

  function renderGameList() {
    const query = normalize(gameSearch.value).trim();
    const filtered = sortedGames().filter((game) => !query || normalize(`${game.title} ${game.franchise} ${game.id}`).includes(query));
    gameCount.textContent = `${games.length} ${games.length === 1 ? 'juego' : 'juegos'}`;
    gameList.innerHTML = filtered.map((game) => `
      <button class="game-list-button${game.id === selectedId ? ' active' : ''}" type="button" data-game-id="${esc(game.id)}" role="option" aria-selected="${game.id === selectedId ? 'true' : 'false'}">
        <span class="game-score">${esc(game.score)}</span>
        <span class="game-list-copy"><strong>${esc(game.title)}</strong><small>${esc(game.franchise || game.platform || '')}</small></span>
        <span class="game-list-order">#${esc(game.tierOrder ?? '—')}</span>
      </button>`).join('');
  }

  function updateCounts() {
    excerptCount.textContent = `${fieldExcerpt.value.length} caracteres`;
    reviewCount.textContent = `${fieldReview.value.length} caracteres`;
  }

  function renderSelectedGame() {
    const game = selectedGame();
    const disabled = !game;
    Array.from(gameForm.elements).forEach((element) => { element.disabled = disabled; });
    if (!game) {
      editorTitle.textContent = 'Selecciona un juego';
      editorSubtitle.textContent = 'Los cambios no se publican hasta pulsar “Guardar y publicar”.';
      gameIdBadge.textContent = '—';
      return;
    }

    editorTitle.textContent = game.title;
    editorSubtitle.textContent = `${game.platform || 'Sin plataforma'} · ${game.year || 'Sin año'}`;
    gameIdBadge.textContent = game.id;
    fieldTitle.value = game.title || '';
    fieldYear.value = game.year || '';
    fieldPlatform.value = game.platform || '';
    fieldFranchise.value = game.franchise || '';
    fieldScore.value = String(game.score);
    fieldLabel.value = tierForScore(game.score)?.label || game.label || '';
    fieldTierOrder.value = Number.isFinite(Number(game.tierOrder)) ? String(game.tierOrder) : '';
    fieldTierVisible.checked = game.tierVisible !== false;
    fieldReviewDate.value = game.reviewDate || '';
    fieldSpoilers.checked = Boolean(game.spoilers);
    fieldExcerpt.value = game.excerpt || '';
    fieldReview.value = game.review || '';
    updateCounts();
  }

  function selectGame(id) {
    if (!games.some((game) => game.id === id)) return;
    selectedId = id;
    renderGameList();
    renderSelectedGame();
    clearNotice();
  }

  function syncFormField(target) {
    const game = selectedGame();
    if (!game || !target.dataset.field) return;
    const field = target.dataset.field;
    if (target.type === 'checkbox') game[field] = target.checked;
    else if (field === 'score') {
      const score = Number(target.value);
      game.score = score;
      const tier = tierForScore(score);
      if (tier) game.label = tier.label;
      fieldLabel.value = tier?.label || '';
    } else if (field === 'tierOrder') {
      const parsed = Number.parseInt(target.value, 10);
      game.tierOrder = Number.isFinite(parsed) ? parsed : 0;
    } else {
      game[field] = target.value;
    }
    editorTitle.textContent = game.title || game.id;
    editorSubtitle.textContent = `${game.platform || 'Sin plataforma'} · ${game.year || 'Sin año'}`;
    updateCounts();
    renderGameList();
    updateDirtyUi();
    clearNotice();
  }

  function syncTierLabel(input) {
    const index = Number(input.dataset.tierIndex);
    const row = scale[index];
    if (!row) return;
    const label = input.value.trim();
    row.label = label;
    games.forEach((game) => {
      if (Number(game.score) === Number(row.score)) game.label = label;
    });
    renderScoreOptions();
    const game = selectedGame();
    if (game) {
      fieldScore.value = String(game.score);
      fieldLabel.value = tierForScore(game.score)?.label || '';
    }
    renderGameList();
    updateDirtyUi();
    clearNotice();
  }

  function validateData() {
    const ids = new Set();
    for (const game of games) {
      if (!game.id || ids.has(game.id)) throw new Error(`ID inválido o duplicado: ${game.id || '(vacío)'}`);
      ids.add(game.id);
      if (!String(game.title || '').trim()) throw new Error(`El juego ${game.id} no puede quedarse sin título.`);
      if (!tierForScore(game.score)) throw new Error(`La nota ${game.score} de ${game.title} no existe en la escala.`);
    }
    for (const row of scale) {
      if (!String(row.label || '').trim()) throw new Error(`El tier ${row.score} no puede quedarse sin nombre.`);
    }
  }

  async function authenticate(candidateToken) {
    token = String(candidateToken || '').trim();
    if (!token) throw new Error('Introduce un token de GitHub.');
    const user = await apiFetch('https://api.github.com/user');
    if (!user || String(user.login || '').toLowerCase() !== OWNER.toLowerCase()) {
      throw new Error(`Este editor solo acepta la cuenta ${OWNER}.`);
    }
    const repo = await apiFetch(API);
    if (!repo?.permissions?.push) throw new Error('La cuenta autenticada no tiene permiso de escritura en este repositorio.');
    try { sessionStorage.setItem(TOKEN_KEY, token); } catch (_) {}
    return user;
  }

  async function loadRemoteData() {
    setBusy(true, 'Cargando datos…', 'Leyendo la versión publicada desde GitHub.');
    try {
      const [siteDataFile, indexFile, versionFile] = await Promise.all([
        getFile('js/site-data.js'),
        getFile('index.html'),
        getFile('version.json')
      ]);
      const parsed = parseSiteData(siteDataFile.content);
      games = clone(parsed.games);
      scale = clone(parsed.scale);
      currentVersion = parseVersion(versionFile.content);
      baseShas = { siteData: siteDataFile.sha, index: indexFile.sha, version: versionFile.sha };
      baseSnapshot = currentSnapshot();
      selectedId = games[0]?.id || '';
      versionBadge.textContent = `v${currentVersion}`;
      renderScoreOptions();
      renderTierEditor();
      renderGameList();
      renderSelectedGame();
      updateDirtyUi();
    } finally {
      setBusy(false);
    }
  }

  async function connect(candidateToken) {
    connectButton.disabled = true;
    loginError.textContent = '';
    setBusy(true, 'Conectando con GitHub…', `Comprobando que eres ${OWNER}.`);
    try {
      const user = await authenticate(candidateToken);
      connectionBadge.textContent = `Conectado como ${user.login}`;
      connectionBadge.classList.add('connected');
      logoutButton.hidden = false;
      loginPanel.hidden = true;
      editorPanel.hidden = false;
      await loadRemoteData();
    } catch (error) {
      token = '';
      try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
      loginError.textContent = error.message || 'No se pudo conectar con GitHub.';
      loginPanel.hidden = false;
      editorPanel.hidden = true;
    } finally {
      setBusy(false);
      connectButton.disabled = false;
    }
  }

  function logout() {
    token = '';
    games = [];
    scale = [];
    selectedId = '';
    currentVersion = '';
    baseSnapshot = '';
    baseShas = { siteData: '', index: '', version: '' };
    try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
    tokenInput.value = '';
    connectionBadge.textContent = 'Sin conectar';
    connectionBadge.classList.remove('connected');
    logoutButton.hidden = true;
    editorPanel.hidden = true;
    loginPanel.hidden = false;
    clearNotice();
  }

  async function publish() {
    if (!isDirty()) return;
    try {
      validateData();
    } catch (error) {
      showNotice(esc(error.message), true);
      return;
    }

    publishButton.disabled = true;
    discardButton.disabled = true;
    clearNotice();
    setBusy(true, 'Publicando cambios…', 'Comprobando que nadie haya modificado los archivos desde que abriste el editor.');

    try {
      const [freshSiteData, freshIndex, freshVersion] = await Promise.all([
        getFile('js/site-data.js'),
        getFile('index.html'),
        getFile('version.json')
      ]);

      if (freshSiteData.sha !== baseShas.siteData || freshIndex.sha !== baseShas.index || freshVersion.sha !== baseShas.version) {
        throw new Error('El repositorio cambió desde que abriste el editor. Pulsa “Descartar” para recargar la versión actual y vuelve a aplicar tu cambio.');
      }

      const remoteVersion = parseVersion(freshVersion.content);
      const nextVersion = nextPatchVersion(remoteVersion);
      const nextIndex = bumpIndexVersion(freshIndex.content, remoteVersion, nextVersion);
      const nextSiteData = serializeSiteData(games, scale);
      const nextVersionJson = `${JSON.stringify({ version: nextVersion }, null, 2)}\n`;

      busyText.textContent = `Preparando v${nextVersion}…`;
      const indexResult = await putFile('index.html', nextIndex, freshIndex.sha, `Editor: prepara v${nextVersion}`);

      busyText.textContent = 'Guardando juegos, notas y reviews…';
      const dataResult = await putFile('js/site-data.js', nextSiteData, freshSiteData.sha, `Editor: actualiza contenido v${nextVersion}`);

      busyText.textContent = 'Activando la nueva versión para todos…';
      const versionResult = await putFile('version.json', nextVersionJson, freshVersion.sha, `Editor: publica v${nextVersion}`);

      currentVersion = nextVersion;
      versionBadge.textContent = `v${currentVersion}`;
      baseShas = {
        siteData: dataResult?.content?.sha || '',
        index: indexResult?.content?.sha || '',
        version: versionResult?.content?.sha || ''
      };
      baseSnapshot = currentSnapshot();
      updateDirtyUi();
      showNotice(`Publicado como <strong>v${esc(nextVersion)}</strong>. GitHub Pages puede tardar unos segundos en desplegarlo. <a href="./?v=${encodeURIComponent(nextVersion)}#tierlist" target="_blank" rel="noreferrer">Abrir la versión publicada ↗</a>`);
    } catch (error) {
      showNotice(esc(error.message || 'No se pudieron publicar los cambios.'), true);
    } finally {
      setBusy(false);
      updateDirtyUi();
    }
  }

  async function discard() {
    if (isDirty() && !window.confirm('¿Descartar todos los cambios que todavía no has publicado?')) return;
    clearNotice();
    await loadRemoteData();
  }

  connectButton.addEventListener('click', () => void connect(tokenInput.value));
  tokenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void connect(tokenInput.value);
    }
  });
  logoutButton.addEventListener('click', logout);
  gameSearch.addEventListener('input', renderGameList);
  gameList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-game-id]');
    if (button) selectGame(button.dataset.gameId);
  });
  gameForm.addEventListener('input', (event) => {
    if (event.target.matches('[data-field]')) syncFormField(event.target);
    if (event.target.matches('[data-tier-index]')) syncTierLabel(event.target);
  });
  gameForm.addEventListener('change', (event) => {
    if (event.target.matches('[data-field]')) syncFormField(event.target);
  });
  discardButton.addEventListener('click', () => void discard());
  publishButton.addEventListener('click', () => void publish());
  window.addEventListener('beforeunload', (event) => {
    if (!isDirty()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  try {
    const savedToken = sessionStorage.getItem(TOKEN_KEY);
    if (savedToken) void connect(savedToken);
  } catch (_) {}
})();
