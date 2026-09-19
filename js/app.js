(function () {
  'use strict';

  let editorial = window.MausContentModel.normalize(window.MAUS_CONTENT);
  const copy = key => editorial.settings[key] || '';
  const textLines = value => esc(value).replace(/\n/g, '<br>');
  const byId = (id) => document.getElementById(id);
  const app = byId('app');
  const body = document.body;
  const sceneArt = byId('sceneArt');
  const audio = byId('audio');
  const player = byId('player');
  const playerTitle = byId('playerTitle');
  const playerGame = byId('playerGame');
  const playerVolume = byId('playerVolume');
  const playerSeek = byId('playerSeek');
  const playerCurrentTime = byId('playerCurrentTime');
  const playerDuration = byId('playerDuration');
  const themeInfoButton = byId('themeInfoButton');
  const mobileMusicToggleButton = byId('mobileMusicToggleButton');
  const themeInfoModal = byId('themeInfoModal');
  const themeInfoClose = byId('themeInfoClose');
  const themeInfoContent = byId('themeInfoContent');
  const backgroundViewButton = byId('backgroundViewButton');
  const restoreUiButton = byId('restoreUiButton');
  const presentationModeButton = byId('presentationModeButton');
  const presentationMode = byId('presentationMode');
  const presentationTiers = byId('presentationTiers');
  const presentationStats = byId('presentationStats');
  const presentationCloseButton = byId('presentationCloseButton');
  const presentationFullscreenButton = byId('presentationFullscreenButton');
  const appearanceButton = byId('appearanceButton');
  const appearancePopover = byId('appearancePopover');
  const appearanceCloseButton = byId('appearanceCloseButton');
  const editModeButton = byId('editModeButton');
  const adminGate = byId('adminGate');
  const adminGateForm = byId('adminGateForm');
  const adminGateClose = byId('adminGateClose');
  const adminPassword = byId('adminPassword');
  const adminGateError = byId('adminGateError');
  const editToolbar = byId('editToolbar');
  const exitEditButton = byId('exitEditButton');
  const exportEditsButton = byId('exportEditsButton');
  const importEditsButton = byId('importEditsButton');
  const importEditsInput = byId('importEditsInput');
  const saveToast = byId('saveToast');

  const offlineGames = (Array.isArray(window.MAUS_GAMES) ? window.MAUS_GAMES : []).map((game) => ({ ...game, _catalog: 'offline' }));
  const onlineGames = (Array.isArray(window.MAUS_ONLINE_GAMES) ? window.MAUS_ONLINE_GAMES : []).map((game) => ({ ...game, _catalog: 'online' }));
  const games = [...offlineGames, ...onlineGames];
  const scale = Array.isArray(window.MAUS_SCALE) ? window.MAUS_SCALE : [];
  const builtInMusic = window.MAUS_GAME_MUSIC && typeof window.MAUS_GAME_MUSIC === 'object' ? window.MAUS_GAME_MUSIC : {};
  const musicDeepDive = window.MAUS_GAME_MUSIC_DEEP && typeof window.MAUS_GAME_MUSIC_DEEP === 'object' ? window.MAUS_GAME_MUSIC_DEEP : {};

  const coverFiles = {
    'gow1': 'gow1.png',
    'gow2': 'gow2.webp',
    'gow3': 'gow3.jpg',
    're3-og': 're3-og.webp',
    'majoras-mask': 'majoras-mask.webp',
    'sotc': 'sotc.jpg',
    're9': 're9.jpg',
    're2-og': 're2-og.jpg',
    're4-og': 're4-og.jpg',
    'medievil': 'medievil.webp',
    're3-remake': 're3-remake.webp',
    're1-remaster': 're1-remaster.webp',
    'pokemon-diamond': 'pokemon-diamond.webp',
    'pokemon-black': 'pokemon-black.webp',
    'twilight-princess': 'twilight-princess.jpg'
  };

  const gameScenes = {
    're3-og': 're3-og', 're3-remake': 're3-remake', 're2-og': 're2-og', 're1-remaster': 're1-remaster', 're4-og': 're4-og', 're9': 're9',
    'gow1': 'gow1', 'gow2': 'gow2', 'gow3': 'gow3', 'majoras-mask': 'majoras-mask', 'twilight-princess': 'twilight-princess', 'sotc': 'sotc',
    'medievil': 'medievil', 'pokemon-diamond': 'pokemon-diamond', 'pokemon-black': 'pokemon-black'
  };

  const scenePhotoFiles = {
    'gow1': 'assets/backgrounds/gow1-real-bg.webp',
    'gow2': 'assets/backgrounds/gow2-real-bg.webp',
    'gow3': 'assets/backgrounds/gow3-real-bg.webp',
    'sotc': 'assets/backgrounds/sotc-real-bg.webp',
    're9': 'assets/backgrounds/re9-real-bg.webp',
    're1-remaster': 'assets/backgrounds/re1-remaster-real-bg.webp',
    'medievil': 'assets/backgrounds/medievil-real-bg.webp',
    'pokemon-black': 'assets/backgrounds/pokemon-black-real-bg.webp',
    'pokemon-diamond': 'assets/backgrounds/pokemon-diamond-real-bg.webp',
    're4-og': 'assets/backgrounds/re4-og-real-bg.webp',
    're3-remake': 'assets/backgrounds/re3-remake-real-bg.webp',
    're3-og': 'assets/backgrounds/re3-og-real-bg.webp',
    're2-og': 'assets/backgrounds/re2-og-real-bg.webp',
    'twilight-princess': 'assets/backgrounds/twilight-princess-real-bg.webp',
    'majoras-mask': 'assets/backgrounds/majoras-mask-real-bg.webp'
  };

  const EDIT_STORAGE_KEY = 'mausTierPermanentEditsV1';
  const ADMIN_SESSION_KEY = 'mausTierEditUnlocked';
  const THEME_META_KEY = 'mausTierThemeMetaV1';
  const AUDIO_DB_NAME = 'mausTierAudioDbV1';
  const AUDIO_DB_STORE = 'themes';


  function getStorage(name) {
    try { return window[name] || null; } catch (_) { return null; }
  }

  const localStore = getStorage('localStorage');
  const sessionStore = getStorage('sessionStorage');

  function safeGet(storage, key, fallback = null) {
    try {
      const value = storage?.getItem(key);
      return value === null || value === undefined ? fallback : value;
    } catch (_) {
      return fallback;
    }
  }

  function safeSet(storage, key, value) {
    try {
      storage?.setItem(key, value);
      return true;
    } catch (_) {
      return false;
    }
  }

  function safeRemove(storage, key) {
    try { storage?.removeItem(key); } catch (_) {}
  }

  function readJsonStorage(storage, key, fallback = {}) {
    try {
      const raw = safeGet(storage, key, '');
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  let editStore = {};
  let themeMeta = readJsonStorage(localStore, THEME_META_KEY, {});
  let editMode = false;
  const MUSIC_VOLUME_KEY = 'mausTierVolumeV2';
  const MUSIC_WIDGET_POS_KEY = 'mausTierMusicWidgetPositionV1';
  const UI_THEME_KEY = 'mausTierUiThemeV1';
  let volume = clamp(Number(safeGet(localStore, MUSIC_VOLUME_KEY, '.52')), 0, 1, .52);
  let uiTheme = String(safeGet(localStore, UI_THEME_KEY, copy('defaultTheme')) || copy('defaultTheme'));
  let toastTimer = 0;
  let themeRequestId = 0;
  let currentGameSceneId = null;
  let presentationCatalog = 'offline';

  let sceneMotionFrame = 0;
  let sceneDriftFrame = 0;
  let sceneEnterTimer = 0;
  let sceneEnterFrame = 0;
  const effectsMotionAllowed = () => window.MausEffects?.motionAllowed() ?? true;
  const sceneMotion = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    driftX: 0,
    driftY: 0,
    rumbleX: 0,
    rumbleY: 0,
    rumbleRot: 0
  };

  let sceneRumbleFrame = 0;
  let sceneRumbleTimer = 0;
  let autoCameraTimer = 0;
  const SCENE_DIRECTION = {
    'super-smash-bros-ultimate': { lightX:'62%', lightY:'27%', lightA:'rgba(126,207,255,.30)', lightB:'rgba(112,118,255,.18)', camX:21, camY:12, camMin:6500, camMax:11500, depth:.92, pos:'56% 48%', backSolid:'36%', backFade:'66%', frontSolid:'25%', frontFade:'60%' },
    'gow1': { lightX:'73%', lightY:'8%', lightA:'rgba(171,202,255,.24)', lightB:'rgba(239,184,109,.11)', camX:10, camY:6, camMin:17000, camMax:29000, depth:.72, pos:'55% 50%', backSolid:'35%', backFade:'68%', frontSolid:'28%', frontFade:'65%' },
    'gow2': { lightX:'54%', lightY:'7%', lightA:'rgba(155,199,255,.30)', lightB:'rgba(255,179,89,.18)', camX:11, camY:7, camMin:16000, camMax:28000, depth:.86, pos:'50% 50%', backSolid:'46%', backFade:'72%', frontSolid:'24%', frontFade:'57%' },
    'gow3': { lightX:'47%', lightY:'44%', lightA:'rgba(255,99,49,.32)', lightB:'rgba(255,181,92,.13)', camX:12, camY:7, camMin:14000, camMax:25000, depth:.92, pos:'53% 52%', backSolid:'32%', backFade:'62%', frontSolid:'34%', frontFade:'70%' },
    'majoras-mask': { lightX:'71%', lightY:'30%', lightA:'rgba(167,107,255,.25)', lightB:'rgba(111,255,97,.14)', camX:7, camY:5, camMin:19000, camMax:33000, depth:.62, pos:'50% 50%', backSolid:'30%', backFade:'61%', frontSolid:'22%', frontFade:'55%' },
    'medievil': { lightX:'66%', lightY:'12%', lightA:'rgba(160,185,255,.23)', lightB:'rgba(82,158,100,.13)', camX:9, camY:6, camMin:19000, camMax:32000, depth:.78, pos:'50% 50%', backSolid:'40%', backFade:'69%', frontSolid:'30%', frontFade:'66%' },
    'pokemon-black': { lightX:'68%', lightY:'22%', lightA:'rgba(255,239,177,.36)', lightB:'rgba(255,197,116,.13)', camX:7, camY:5, camMin:21000, camMax:35000, depth:.58, pos:'50% 50%', backSolid:'44%', backFade:'74%', frontSolid:'20%', frontFade:'52%' },
    'pokemon-diamond': { lightX:'19%', lightY:'18%', lightA:'rgba(255,246,197,.38)', lightB:'rgba(135,211,255,.16)', camX:7, camY:5, camMin:21000, camMax:35000, depth:.6, pos:'50% 50%', backSolid:'48%', backFade:'76%', frontSolid:'22%', frontFade:'54%' },
    're1-remaster': { lightX:'77%', lightY:'12%', lightA:'rgba(191,216,234,.22)', lightB:'rgba(92,122,105,.10)', camX:6, camY:4, camMin:22000, camMax:36000, depth:.55, pos:'50% 50%', backSolid:'34%', backFade:'62%', frontSolid:'25%', frontFade:'57%' },
    're2-og': { lightX:'51%', lightY:'48%', lightA:'rgba(194,45,44,.22)', lightB:'rgba(92,137,181,.11)', camX:5, camY:4, camMin:22000, camMax:38000, depth:.48, pos:'50% 50%', backSolid:'27%', backFade:'58%', frontSolid:'29%', frontFade:'60%' },
    're3-og': { lightX:'84%', lightY:'72%', lightA:'rgba(255,102,46,.28)', lightB:'rgba(94,131,174,.10)', camX:8, camY:5, camMin:18000, camMax:31000, depth:.72, pos:'50% 50%', backSolid:'38%', backFade:'67%', frontSolid:'35%', frontFade:'68%' },
    're3-remake': { lightX:'61%', lightY:'12%', lightA:'rgba(176,215,235,.23)', lightB:'rgba(236,54,52,.16)', camX:8, camY:5, camMin:18000, camMax:30000, depth:.68, pos:'50% 50%', backSolid:'39%', backFade:'69%', frontSolid:'29%', frontFade:'63%' },
    're4-og': { lightX:'17%', lightY:'38%', lightA:'rgba(177,188,116,.20)', lightB:'rgba(105,119,69,.10)', camX:7, camY:5, camMin:20000, camMax:34000, depth:.64, pos:'50% 50%', backSolid:'41%', backFade:'71%', frontSolid:'31%', frontFade:'64%' },
    're9': { lightX:'8%', lightY:'44%', lightA:'rgba(255,173,102,.24)', lightB:'rgba(143,174,210,.11)', camX:7, camY:4, camMin:21000, camMax:35000, depth:.54, pos:'50% 50%', backSolid:'32%', backFade:'63%', frontSolid:'24%', frontFade:'58%' },
    'sotc': { lightX:'54%', lightY:'18%', lightA:'rgba(255,58,75,.34)', lightB:'rgba(182,129,115,.12)', camX:12, camY:7, camMin:15000, camMax:27000, depth:.9, pos:'50% 50%', backSolid:'50%', backFade:'78%', frontSolid:'27%', frontFade:'60%' },
    'twilight-princess': { lightX:'49%', lightY:'50%', lightA:'rgba(102,222,235,.28)', lightB:'rgba(255,157,71,.11)', camX:7, camY:5, camMin:19000, camMax:33000, depth:.7, pos:'50% 50%', backSolid:'36%', backFade:'66%', frontSolid:'31%', frontFade:'64%' }
  };

  function sceneDirectionFor(gameId) {
    return SCENE_DIRECTION[gameId] || { lightX:'50%', lightY:'18%', lightA:'rgba(255,255,255,.18)', lightB:'rgba(116,188,235,.08)', camX:6, camY:4, camMin:20000, camMax:34000, depth:.55, pos:'50% 50%', backSolid:'42%', backFade:'70%', frontSolid:'24%', frontFade:'61%' };
  }

  const SCENE_RUMBLE_PROFILES = {
    'super-smash-bros-ultimate': {
      waitMin: 4400,
      waitMax: 9200,
      durationMin: 620,
      durationMax: 1050,
      ampX: 2.25,
      ampY: 1.35,
      rot: 0.075,
      heavyChance: 0.28,
      heavyMultiplier: 1.72
    }
  };

  function sceneRumbleProfileFor(gameId) {
    return SCENE_RUMBLE_PROFILES[gameId] || null;
  }

  function stopSceneRumble(reset = true) {
    window.clearTimeout(sceneRumbleTimer);
    sceneRumbleTimer = 0;

    if (sceneRumbleFrame) cancelAnimationFrame(sceneRumbleFrame);
    sceneRumbleFrame = 0;

    body.classList.remove('scene-rumbling', 'scene-rumble-heavy');

    if (reset) {
      sceneMotion.rumbleX = 0;
      sceneMotion.rumbleY = 0;
      sceneMotion.rumbleRot = 0;
      updateSceneMotionVars();
    }
  }

  function triggerSceneRumble(gameId) {
    const profile = sceneRumbleProfileFor(gameId);
    if (!profile || mobilePerformance || document.hidden || currentGameSceneId !== gameId) return;

    if (sceneRumbleFrame) cancelAnimationFrame(sceneRumbleFrame);

    const heavy = Math.random() < profile.heavyChance;
    const strength = heavy ? profile.heavyMultiplier : 1;
    const cinematic = body.classList.contains('background-only') ? 1.20 : 1;
    const ampX = profile.ampX * strength * cinematic;
    const ampY = profile.ampY * strength * cinematic;
    const ampRot = profile.rot * strength * cinematic;
    const duration = randomIntBetween(
      profile.durationMin + (heavy ? 150 : 0),
      profile.durationMax + (heavy ? 280 : 0)
    );
    const startedAt = performance.now();

    body.classList.add('scene-rumbling');
    body.classList.toggle('scene-rumble-heavy', heavy);

    const tick = (now) => {
      if (document.hidden || currentGameSceneId !== gameId || !body.classList.contains('scene-active')) {
        sceneMotion.rumbleX = 0;
        sceneMotion.rumbleY = 0;
        sceneMotion.rumbleRot = 0;
        updateSceneMotionVars();
        sceneRumbleFrame = 0;
        body.classList.remove('scene-rumbling', 'scene-rumble-heavy');
        return;
      }

      const elapsed = now - startedAt;
      const t = Math.min(1, elapsed / duration);
      const envelope = Math.pow(Math.sin(t * Math.PI), .72);

      // Dos frecuencias bajas superpuestas: retumbe, no vibración mecánica constante.
      const lowX = Math.sin(elapsed * .041) + Math.sin(elapsed * .071 + 1.2) * .42;
      const lowY = Math.sin(elapsed * .052 + .7) + Math.sin(elapsed * .089) * .34;
      const grit = ((Math.random() * 2) - 1) * .18;

      sceneMotion.rumbleX = (lowX + grit) * ampX * envelope;
      sceneMotion.rumbleY = (lowY + grit * .65) * ampY * envelope;
      sceneMotion.rumbleRot = (Math.sin(elapsed * .036 + .4) + grit * .28) * ampRot * envelope;
      updateSceneMotionVars();

      if (t < 1) {
        sceneRumbleFrame = requestAnimationFrame(tick);
      } else {
        sceneMotion.rumbleX = 0;
        sceneMotion.rumbleY = 0;
        sceneMotion.rumbleRot = 0;
        updateSceneMotionVars();
        body.classList.remove('scene-rumbling', 'scene-rumble-heavy');
        sceneRumbleFrame = 0;
      }
    };

    sceneRumbleFrame = requestAnimationFrame(tick);
  }

  function startSceneRumble(gameId) {
    stopSceneRumble(true);
    const profile = sceneRumbleProfileFor(gameId);
    if (!profile || mobilePerformance || !gameId || !effectsMotionAllowed() || (gameId === 'super-smash-bros-ultimate' && window.MAUS_SMASH_SYNC)) return;

    const queueNext = () => {
      if (currentGameSceneId !== gameId || !body.classList.contains('scene-active')) return;

      if (document.hidden) {
        sceneRumbleTimer = window.setTimeout(queueNext, 1500);
        return;
      }

      triggerSceneRumble(gameId);
      sceneRumbleTimer = window.setTimeout(
        queueNext,
        randomIntBetween(profile.waitMin, profile.waitMax)
      );
    };

    sceneRumbleTimer = window.setTimeout(queueNext, randomIntBetween(1600, 3200));
  }

  function applySceneDirection(gameId) {
    const profile = sceneDirectionFor(gameId);
    body.style.setProperty('--scene-light-x', profile.lightX);
    body.style.setProperty('--scene-light-y', profile.lightY);
    body.style.setProperty('--scene-light-a-color', profile.lightA);
    body.style.setProperty('--scene-light-b-color', profile.lightB);
    body.style.setProperty('--scene-depth-strength', String(profile.depth));
    body.style.setProperty('--scene-object-position', profile.pos);
    body.style.setProperty('--scene-depth-back-solid', profile.backSolid || '42%');
    body.style.setProperty('--scene-depth-back-fade', profile.backFade || '70%');
    body.style.setProperty('--scene-depth-front-solid', profile.frontSolid || '24%');
    body.style.setProperty('--scene-depth-front-fade', profile.frontFade || '61%');
  }

  function stopAutonomousCamera(reset = true) {
    window.clearTimeout(autoCameraTimer);
    autoCameraTimer = 0;
    if (reset) resetSceneMotion();
  }

  function stopSceneDrift(reset = false) {
    if (sceneDriftFrame) cancelAnimationFrame(sceneDriftFrame);
    sceneDriftFrame = 0;
    if (reset) {
      sceneMotion.driftX = 0;
      sceneMotion.driftY = 0;
      updateSceneMotionVars();
    }
  }

  function startSceneDrift(gameId) {
    stopSceneDrift(false);
    if (mobilePerformance || !effectsMotionAllowed()) {
      sceneMotion.driftX = 0;
      sceneMotion.driftY = 0;
      updateSceneMotionVars();
      return;
    }
    if (!gameId || document.hidden) return;
    const profile = sceneDirectionFor(gameId);
    const phaseX = Math.random() * Math.PI * 2;
    const phaseY = Math.random() * Math.PI * 2;
    const startedAt = performance.now();
    const tick = (now) => {
      if (document.hidden || currentGameSceneId !== gameId || !body.classList.contains('scene-active')) {
        sceneDriftFrame = 0;
        return;
      }
      const elapsed = now - startedAt;
      const boost = body.classList.contains('background-only') ? 1.65 : 1.24;
      const power = body.classList.contains('low-power') ? 0.82 : 1;
      const ampX = Math.max(0.75, profile.camX * 0.16) * boost * power;
      const ampY = Math.max(0.55, profile.camY * 0.16) * boost * power;
      sceneMotion.driftX = (
        Math.sin(elapsed * 0.00014 + phaseX) +
        Math.sin(elapsed * 0.000047 + phaseX * 1.9) * 0.55
      ) * ampX;
      sceneMotion.driftY = (
        Math.cos(elapsed * 0.00012 + phaseY) +
        Math.sin(elapsed * 0.000039 + phaseY * 1.6) * 0.45
      ) * ampY;
      updateSceneMotionVars();
      sceneDriftFrame = requestAnimationFrame(tick);
    };
    sceneDriftFrame = requestAnimationFrame(tick);
  }

  function scheduleAutonomousCamera(gameId, immediate = false) {
    window.clearTimeout(autoCameraTimer);
    if (mobilePerformance || !effectsMotionAllowed()) {
      sceneMotion.targetX = 0;
      sceneMotion.targetY = 0;
      queueSceneMotion();
      return;
    }
    if (!gameId || document.hidden) return;
    const profile = sceneDirectionFor(gameId);
    const move = () => {
      if (document.hidden || currentGameSceneId !== gameId || !body.classList.contains('scene-active')) return;
      const boost = body.classList.contains('background-only') ? 1.93 : 1.45;
      sceneMotion.targetX = ((Math.random() * 2) - 1) * profile.camX * boost;
      sceneMotion.targetY = ((Math.random() * 2) - 1) * profile.camY * boost;
      queueSceneMotion();
      const wait = randomIntBetween(profile.camMin, profile.camMax);
      autoCameraTimer = window.setTimeout(move, wait);
    };
    if (immediate) move();
    else autoCameraTimer = window.setTimeout(move, 900);
  }

  function updateSceneMotionVars() {
    const combinedX = sceneMotion.currentX + sceneMotion.driftX + sceneMotion.rumbleX;
    const combinedY = sceneMotion.currentY + sceneMotion.driftY + sceneMotion.rumbleY;
    body.style.setProperty('--parallax-x', `${combinedX.toFixed(2)}px`);
    body.style.setProperty('--parallax-y', `${combinedY.toFixed(2)}px`);
    body.style.setProperty('--scene-rotation', `${sceneMotion.rumbleRot.toFixed(3)}deg`);
  }

  function animateSceneMotion() {
    sceneMotion.currentX += (sceneMotion.targetX - sceneMotion.currentX) * 0.085;
    sceneMotion.currentY += (sceneMotion.targetY - sceneMotion.currentY) * 0.085;
    updateSceneMotionVars();
    if (Math.abs(sceneMotion.targetX - sceneMotion.currentX) < 0.12 && Math.abs(sceneMotion.targetY - sceneMotion.currentY) < 0.12) {
      sceneMotion.currentX = sceneMotion.targetX;
      sceneMotion.currentY = sceneMotion.targetY;
      updateSceneMotionVars();
      sceneMotionFrame = 0;
      return;
    }
    sceneMotionFrame = requestAnimationFrame(animateSceneMotion);
  }

  function queueSceneMotion() {
    if (sceneMotionFrame || !effectsMotionAllowed() || document.hidden) return;
    sceneMotionFrame = requestAnimationFrame(animateSceneMotion);
  }

  function resetSceneMotion() {
    sceneMotion.targetX = 0;
    sceneMotion.targetY = 0;
    sceneMotion.rumbleX = 0;
    sceneMotion.rumbleY = 0;
    sceneMotion.rumbleRot = 0;
    queueSceneMotion();
    updateSceneMotionVars();
  }

  function updateSceneScrollDepth() {
    if (mobilePerformance || !effectsMotionAllowed()) {
      body.style.setProperty('--scene-scroll-y', '0px');
      body.style.setProperty('--scene-scroll-progress', '0');
      return;
    }
    if (!body.classList.contains('scene-active')) {
      body.style.setProperty('--scene-scroll-y', '0px');
      body.style.setProperty('--scene-scroll-progress', '0');
      return;
    }
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const boost = body.classList.contains('background-only') ? 1.35 : 1;
    body.style.setProperty('--scene-scroll-y', `${(-42 * progress * boost).toFixed(2)}px`);
    body.style.setProperty('--scene-scroll-progress', progress.toFixed(4));
  }

  function updateSceneFocusState() {
    const cinematic = body.classList.contains('background-only');
    body.classList.toggle('scene-cinematic', cinematic);
  }

  function nudgeSceneEntrance() {
    body.classList.remove('scene-entering');
    window.clearTimeout(sceneEnterTimer);
    cancelAnimationFrame(sceneEnterFrame);
    if (!effectsMotionAllowed()) return;
    sceneEnterFrame = requestAnimationFrame(() => { sceneEnterFrame = 0; if (effectsMotionAllowed() && currentGameSceneId) body.classList.add('scene-entering'); });
    sceneEnterTimer = window.setTimeout(() => body.classList.remove('scene-entering'), 1450);
  }

  let climateCycleTimer = 0;
  let climateEventTimer = 0;
  let climateEventEndTimer = 0;
  let currentClimateState = 'normal';

  const CLIMATE_STATE_VALUES = {
    calm: { mid: 0.56, front: 0.48, light: 0.84, speed: 1.14, frontSpeed: 1.18, glow: 0.92 },
    normal: { mid: 0.92, front: 0.9, light: 1, speed: 1, frontSpeed: 1, glow: 1 },
    intense: { mid: 1.08, front: 1.1, light: 1.12, speed: 0.9, frontSpeed: 0.9, glow: 1.08 },
    surge: { mid: 1.22, front: 1.26, light: 1.22, speed: 0.78, frontSpeed: 0.82, glow: 1.16 }
  };

  const DEFAULT_CLIMATE_PROFILE = {
    pool: ['calm', 'normal', 'normal', 'intense'],
    stateMin: 12000,
    stateMax: 22000,
    eventChance: 0.35,
    eventMin: 18000,
    eventMax: 36000,
    eventDurationMin: 2200,
    eventDurationMax: 4200,
    eventType: 'gust'
  };

  const CLIMATE_PROFILES = {
    'gow1': { pool: ['normal', 'normal', 'intense', 'surge'], stateMin: 12000, stateMax: 23000, eventChance: 0.46, eventMin: 18000, eventMax: 32000, eventDurationMin: 2500, eventDurationMax: 4200, eventType: 'gust' },
    'gow2': { pool: ['calm', 'normal', 'normal', 'intense'], stateMin: 13000, stateMax: 24000, eventChance: 0.32, eventMin: 24000, eventMax: 42000, eventDurationMin: 2200, eventDurationMax: 3800, eventType: 'flare' },
    'gow3': { pool: ['normal', 'intense', 'intense', 'surge'], stateMin: 11000, stateMax: 21000, eventChance: 0.52, eventMin: 16000, eventMax: 29000, eventDurationMin: 2600, eventDurationMax: 4600, eventType: 'burst' },
    're3-og': { pool: ['normal', 'normal', 'intense', 'surge'], stateMin: 13000, stateMax: 24000, eventChance: 0.44, eventMin: 20000, eventMax: 34000, eventDurationMin: 2200, eventDurationMax: 3800, eventType: 'rain' },
    're3-remake': { pool: ['normal', 'normal', 'intense', 'surge'], stateMin: 13000, stateMax: 24000, eventChance: 0.44, eventMin: 20000, eventMax: 34000, eventDurationMin: 2200, eventDurationMax: 3800, eventType: 'rain' },
    're2-og': { pool: ['calm', 'normal', 'normal', 'intense'], stateMin: 15000, stateMax: 26000, eventChance: 0.24, eventMin: 26000, eventMax: 42000, eventDurationMin: 2000, eventDurationMax: 3200, eventType: 'dust' },
    're1-remaster': { pool: ['calm', 'normal', 'normal', 'intense'], stateMin: 14000, stateMax: 25000, eventChance: 0.3, eventMin: 22000, eventMax: 38000, eventDurationMin: 2200, eventDurationMax: 3600, eventType: 'leaf' },
    're4-og': { pool: ['normal', 'normal', 'intense', 'surge'], stateMin: 12000, stateMax: 22000, eventChance: 0.38, eventMin: 22000, eventMax: 36000, eventDurationMin: 2200, eventDurationMax: 3800, eventType: 'gust' },
    're9': { pool: ['normal', 'intense', 'intense', 'surge'], stateMin: 11000, stateMax: 21000, eventChance: 0.42, eventMin: 18000, eventMax: 32000, eventDurationMin: 2400, eventDurationMax: 3800, eventType: 'dust' },
    'sotc': { pool: ['normal', 'intense', 'intense', 'surge', 'surge'], stateMin: 10000, stateMax: 18000, eventChance: 0.72, eventMin: 12000, eventMax: 22000, eventDurationMin: 2800, eventDurationMax: 5200, eventType: 'storm' },
    'majoras-mask': { pool: ['calm', 'normal', 'intense', 'surge'], stateMin: 11000, stateMax: 21000, eventChance: 0.62, eventMin: 14000, eventMax: 26000, eventDurationMin: 2500, eventDurationMax: 4200, eventType: 'swarm' },
    'twilight-princess': { pool: ['calm', 'normal', 'intense', 'surge'], stateMin: 12000, stateMax: 22000, eventChance: 0.42, eventMin: 17000, eventMax: 30000, eventDurationMin: 2400, eventDurationMax: 3800, eventType: 'twilight' },
    'medievil': { pool: ['calm', 'normal', 'intense', 'surge'], stateMin: 12000, stateMax: 22000, eventChance: 0.44, eventMin: 18000, eventMax: 32000, eventDurationMin: 2400, eventDurationMax: 3800, eventType: 'leaf' },
    'pokemon-diamond': { pool: ['calm', 'normal', 'normal', 'intense'], stateMin: 15000, stateMax: 28000, eventChance: 0.28, eventMin: 26000, eventMax: 44000, eventDurationMin: 2200, eventDurationMax: 3400, eventType: 'sun' },
    'pokemon-black': { pool: ['calm', 'normal', 'normal', 'intense'], stateMin: 15000, stateMax: 28000, eventChance: 0.28, eventMin: 26000, eventMax: 44000, eventDurationMin: 2200, eventDurationMax: 3400, eventType: 'sun' }
  };

  function climateProfileFor(gameId) {
    return CLIMATE_PROFILES[gameId] || DEFAULT_CLIMATE_PROFILE;
  }

  function randomIntBetween(min, max) {
    const floor = Math.max(0, Math.floor(min));
    const ceil = Math.max(floor, Math.floor(max));
    return floor + Math.floor(Math.random() * (ceil - floor + 1));
  }

  function pickClimateState(gameId) {
    const profile = climateProfileFor(gameId);
    const pool = Array.isArray(profile.pool) && profile.pool.length ? profile.pool : DEFAULT_CLIMATE_PROFILE.pool;
    let next = pool[Math.floor(Math.random() * pool.length)] || 'normal';
    if (pool.length > 1 && next === currentClimateState) {
      next = pool[(pool.indexOf(next) + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length] || next;
    }
    return next;
  }

  function applyClimateState(state) {
    currentClimateState = state || 'normal';
    const values = CLIMATE_STATE_VALUES[currentClimateState] || CLIMATE_STATE_VALUES.normal;
    body.dataset.climateState = currentClimateState;
    body.style.setProperty('--climate-mid-opacity', String(values.mid));
    body.style.setProperty('--climate-front-opacity', String(values.front));
    body.style.setProperty('--climate-light-opacity', String(values.light));
    body.style.setProperty('--climate-speed', String(values.speed));
    body.style.setProperty('--climate-front-speed', String(values.frontSpeed));
    body.style.setProperty('--climate-glow', String(values.glow));
  }

  function clearClimateEvent() {
    window.clearTimeout(climateEventEndTimer);
    body.classList.remove('climate-event');
    body.dataset.climateEvent = 'none';
  }

  function stopClimateCycle() {
    window.clearTimeout(climateCycleTimer);
    window.clearTimeout(climateEventTimer);
    climateCycleTimer = climateEventTimer = 0;
    clearClimateEvent();
    currentClimateState = 'normal';
    body.dataset.climateState = 'normal';
    body.dataset.climateEvent = 'none';
    body.style.setProperty('--climate-mid-opacity', '0.92');
    body.style.setProperty('--climate-front-opacity', '0.9');
    body.style.setProperty('--climate-light-opacity', '1');
    body.style.setProperty('--climate-speed', '1');
    body.style.setProperty('--climate-front-speed', '1');
    body.style.setProperty('--climate-glow', '1');
  }

  function scheduleClimateEvent(gameId) {
    window.clearTimeout(climateEventTimer);
    const profile = climateProfileFor(gameId);
    const baseWait = randomIntBetween(profile.eventMin || DEFAULT_CLIMATE_PROFILE.eventMin, profile.eventMax || DEFAULT_CLIMATE_PROFILE.eventMax);
    const rarityMultiplier = body.classList.contains('background-only') ? 1.30 : 2.25;
    const wait = Math.round(baseWait * rarityMultiplier);
    climateEventTimer = window.setTimeout(() => {
      if (!currentGameSceneId || currentGameSceneId !== gameId || !body.classList.contains('scene-active')) return;
      if (Math.random() <= (profile.eventChance ?? DEFAULT_CLIMATE_PROFILE.eventChance)) {
        body.dataset.climateEvent = profile.eventType || 'gust';
        body.classList.add('climate-event');
        const duration = randomIntBetween(profile.eventDurationMin || DEFAULT_CLIMATE_PROFILE.eventDurationMin, profile.eventDurationMax || DEFAULT_CLIMATE_PROFILE.eventDurationMax);
        climateEventEndTimer = window.setTimeout(() => {
          clearClimateEvent();
        }, duration);
      }
      scheduleClimateEvent(gameId);
    }, wait);
  }

  function scheduleClimateCycle(gameId) {
    window.clearTimeout(climateCycleTimer);
    const profile = climateProfileFor(gameId);
    const nextState = pickClimateState(gameId);
    applyClimateState(nextState);
    const baseWait = randomIntBetween(profile.stateMin || DEFAULT_CLIMATE_PROFILE.stateMin, profile.stateMax || DEFAULT_CLIMATE_PROFILE.stateMax);
    const wait = Math.round(baseWait * 1.45);
    climateCycleTimer = window.setTimeout(() => {
      if (!currentGameSceneId || currentGameSceneId !== gameId || !body.classList.contains('scene-active')) return;
      scheduleClimateCycle(gameId);
    }, wait);
  }

  function startClimateCycle(gameId) {
    stopClimateCycle();
    if (!gameId || !effectsMotionAllowed() || document.hidden) return;
    applyClimateState('normal');
    scheduleClimateCycle(gameId);
    scheduleClimateEvent(gameId);
  }

  let currentGameMusicId = null;
  let currentThemeSignature = '';
  let activeObjectUrl = null;
  let volumeFadeFrame = 0;
  let pendingAudioRetry = false;
  let playbackIntent = false;
  let playbackEpoch = 0;
  let audioHasPlayed = false;
  let metadataCleanup = null;
  let musicDrag = null;
  let currentThemeStartAt = 0;

  const gameById = new Map(games.map((game) => [game.id, game]));

  function registerMusicEntries() {
    for (const key of gameById.keys()) if (key.startsWith('music:')) gameById.delete(key);
    for (const track of editorial.tracks) {
      const original = gameById.get(track.gameId);
      const fallback = original ? { ...builtInMusic[original.id], ...musicDeepDive[original.id], ...original.music } : {};
      gameById.set('music:' + track.id, { id: 'music:' + track.id, title: track.game,
        cover: track.cover, background: track.background || (original ? backgroundSrcFor(original.id) : ''),
        _sceneGameId: track.gameId || 'music:' + track.id,
        music: { ...fallback, src: track.audio, title: track.title, composer: track.composer,
          startAt: Number(track.startAt) || 0, detail: (track.sections || []).flatMap(section => section.paragraphs || []).join('\n\n') }
      });
    }
  }
  function applyEditorialSettings() {
    const setText = (selector, text) => { const node = document.querySelector(selector); if (node) node.textContent = text; };
    setText('.brand-copy strong', copy('brand')); setText('.brand-copy small', copy('tagline'));
    const brand = document.querySelector('.brand'); if (brand) brand.href = '#' + copy('homeRoute');
    const logo = document.querySelector('.brand-mark'); if (logo) { if (copy('logo')) logo.src = copy('logo'); logo.alt = copy('brand'); logo.hidden = !copy('logo'); }
    for (const [nav,key] of [['offline','navOffline'],['online','navOnline'],['music','navMusic'],['games','navReviews'],['features','navFeatures']]) setText('[data-nav="'+nav+'"]',copy(key));
    setText('#presentationModeButton',copy('navPresentation')); setText('#appearanceButton',copy('navAppearance'));
    setText('.presentation-footer span',copy('presentationFooter'));
    document.title = copy('documentTitle') + ' — v' + window.MAUS_BUILD_VERSION;
    document.querySelector('meta[name="description"]')?.setAttribute('content',copy('description'));
    const root = document.documentElement;
    root.style.setProperty('--accent',copy('accent'));
    root.style.setProperty('--max',Math.min(1800,Math.max(960,Number(copy('maxWidth'))||1220))+'px');
    root.style.setProperty('--music-paper',copy('musicPaper'));
    root.style.setProperty('--music-ink',copy('musicInk'));
    root.style.setProperty('--music-accent',copy('musicAccent'));
    root.style.setProperty('--music-columns',['2','3','4'].includes(copy('musicColumns'))?copy('musicColumns'):'3');
    if (new URL(location.href).searchParams.has('preview')) applyUiTheme(copy('defaultTheme'),false);
  }
  function renderMusicPage(id) {
    updateNav('music');
    const track = editorial.tracks.find(item => item.id === id && item.published);
    if (!id) { stopGameTheme(true); app.innerHTML = window.MausMusic.collection(editorial); return; }
    if (!track) {
      stopGameTheme(true);
      app.innerHTML = '<div class="page music-page"><h1>Esta ficha no está publicada.</h1><p><a href="#music">Volver a la colección →</a></p></div>';
      return;
    }
    applyScene(track.background ? 'music:' + track.id : track.gameId || 'music:' + track.id);
    app.innerHTML = window.MausMusic.detail(track, editorial);
    void startGameTheme('music:' + track.id);
  }


  const MOBILE_PERFORMANCE_QUERY = '(max-width: 900px) and (hover: none) and (pointer: coarse)';
  const mobilePerformance = window.matchMedia(MOBILE_PERFORMANCE_QUERY).matches;
  body.classList.toggle('mobile-performance', mobilePerformance);



  const LEGACY_AMBIENT_EFFECTS = {
    'gow1': 'ember-dust',
    'gow2': 'divine-sparks',
    'gow3': 'ash-embers',
    're3-og': 'rain-sparks',
    're3-remake': 'rain-embers',
    're2-og': 'cold-rain',
    're1-remaster': 'mansion-dust',
    're4-og': 'village-ash',
    're9': 'ominous-motes',
    'sotc': 'wind-dust',
    'majoras-mask': 'moon-motes',
    'twilight-princess': 'twilight-motes',
    'medievil': 'ghost-mist',
    'pokemon-diamond': 'crystal-sparkles',
    'pokemon-black': 'dark-motes'
  };

  const AMBIENT_EFFECT_COUNTS = {
    'ash-embers': 68,
    'divine-sparks': 54,
    'ember-dust': 72,
    'rain-sparks': 54,
    'rain-embers': 56,
    'cold-rain': 64,
    'mansion-dust': 56,
    'village-ash': 66,
    'ominous-motes': 72,
    'wind-dust': 82,
    'moon-motes': 80,
    'twilight-motes': 78,
    'ghost-mist': 42,
    'crystal-sparkles': 32,
    'dark-motes': 34
  };

  function ambientEffectFor(gameId) {
    const configured = String(gameById.get(gameId)?.ambientEffect || '').trim();
    return configured || LEGACY_AMBIENT_EFFECTS[gameId] || 'none';
  }

  function specialSceneEffectId(gameId) {
    const game = gameById.get(gameId);
    const fingerprint = `${String(gameId || '')} ${String(game?.title || '')}`.toLowerCase();
    if (fingerprint.includes('smash') && fingerprint.includes('ultimate')) return 'smash-kazuya-lightning';
    return '';
  }

  function specialLightningZonePhotoHtml(zoneClass, x, y, w, h, layers, flashCount = 2) {
    const photoLayers = layers.map((layer, index) => {
      const [src, px, py, pw, ph, rotation, delay, duration, opacity = .95, scale = 1, blend = 'screen', hue = '0deg', blur = 0] = layer;
      return `<img class="special-lightning-photo layer-${index % 6}" src="${esc(src)}" alt="" aria-hidden="true" style="--x:${px}%;--y:${py}%;--w:${pw}px;--h:${ph}px;--r:${rotation}deg;--delay:${delay}s;--d:${duration}s;--a:${opacity};--scale:${scale};--blend:${blend};--hue:${hue};--blur:${blur}px">`;
    }).join('');
    const flashes = Array.from({ length: flashCount }, (_, index) => {
      const size = 44 + index * 12;
      const delay = -(index * 1.2 + .55);
      const duration = 6.2 + index * .8;
      return `<i class="special-spark spark-${index % 3}" style="--x:${18 + index * 19}%;--y:${23 + (index*17)%50}%;--s:${size}px;--delay:${delay}s;--d:${duration}s;--a:.68"></i>`;
    }).join('');
    return `<div class="special-lightning-zone ${zoneClass}" style="--zone-x:${x}%;--zone-y:${y}%;--zone-w:${w}%;--zone-h:${h}%"><span class="special-zone-glow"></span>${photoLayers}${flashes}</div>`;
  }

  function specialSceneEffectHtml(gameId) {
    const effectId = specialSceneEffectId(gameId);
    if (!effectId || mobilePerformance) return '';

    if (effectId === 'smash-kazuya-lightning') {
      const network = 'assets/effects/smash-lightning/network.png';
      const cloud = 'assets/effects/smash-lightning/cloud.png';
      const strike = 'assets/effects/smash-lightning/strike.png';

      const leftZone = specialLightningZonePhotoHtml(
        'zone-left',
        9.2, 18.5, 39.6, 29.5,
        [
          [network, 18, 54, 172, 172, -17, -0.5, 6.8, .92, 1.02, 'screen', '0deg', 0],
          [strike, 56, 48, 112, 170, 14, -2.1, 7.5, .96, 1.0, 'screen', '0deg', 0],
          [network, 72, 44, 130, 130, 32, -3.8, 7.1, .82, .92, 'screen', '8deg', .5],
          [strike, 36, 30, 86, 138, -34, -5.0, 8.2, .74, .86, 'screen', '-6deg', .5]
        ],
        5
      );

      const rightZone = specialLightningZonePhotoHtml(
        'zone-right',
        49.1, 10.4, 36.6, 59.6,
        [
          [cloud, 46, 19, 244, 170, 7, -0.8, 7.6, .92, 1.02, 'screen', '0deg', 0],
          [strike, 56, 34, 166, 302, -3, -2.6, 8.0, 1.0, 1.0, 'screen', '0deg', 0],
          [network, 38, 58, 192, 192, 18, -4.1, 7.2, .84, .94, 'screen', '4deg', 0],
          [strike, 72, 67, 132, 222, 24, -5.6, 8.8, .82, .88, 'screen', '-4deg', .2],
          [cloud, 68, 42, 206, 146, 25, -3.4, 9.1, .66, .88, 'screen', '12deg', .8]
        ],
        7
      );

      return `<div class="scene-special-effects effect-${esc(effectId)}" aria-hidden="true"><span class="special-scene-flash flash-left"></span><span class="special-scene-flash flash-right"></span>${leftZone}${rightZone}</div>`;
    }

    return '';
  }

  function ambientEffectHtml(gameId) {
    const effect = ambientEffectFor(gameId);
    if (!effect || effect === 'none') return '';
    const baseCount = AMBIENT_EFFECT_COUNTS[effect] || 24;
    const count = mobilePerformance ? Math.min(baseCount, 22) : baseCount;
    const particles = Array.from({ length: count }, (_, index) => {
      const x = (index * 37 + 11) % 101;
      const y = (index * 53 + 17) % 101;
      const size = 2 + ((index * 7) % 7);
      const duration = 8 + ((index * 11) % 18);
      const delay = -((index * 13) % 23);
      const drift = ((index * 29) % 151) - 75;
      const rotation = (index * 47) % 360;
      const opacity = (30 + ((index * 17) % 55)) / 100;
      const variant = index % 5;
      return `<i class="ambient-particle ambient-v${variant}" style="--x:${x}%;--y:${y}%;--s:${size}px;--d:${duration}s;--delay:${delay}s;--drift:${drift}px;--r:${rotation}deg;--o:${opacity}"></i>`;
    }).join('');
    return `<div class="scene-effects effect-${esc(effect)}" aria-hidden="true">${particles}</div>`;
  }


  function foregroundEffectHtml(gameId) {
    const effect = ambientEffectFor(gameId);
    if (!effect || effect === 'none') return '';
    const baseCount = effect === 'wind-dust' ? 26 : 18;
    const count = mobilePerformance ? Math.min(baseCount, 7) : baseCount;
    const particles = Array.from({ length: count }, (_, index) => {
      const x = (index * 61 + 7) % 106 - 3;
      const y = (index * 43 + 19) % 106 - 3;
      const size = 8 + ((index * 13) % 20);
      const duration = 7 + ((index * 17) % 16);
      const delay = -((index * 19) % 21);
      const drift = ((index * 41) % 241) - 120;
      const rotation = (index * 67) % 360;
      const opacity = (18 + ((index * 23) % 42)) / 100;
      const variant = index % 5;
      return `<i class="foreground-particle foreground-v${variant}" style="--x:${x}%;--y:${y}%;--s:${size}px;--d:${duration}s;--delay:${delay}s;--drift:${drift}px;--r:${rotation}deg;--o:${opacity}"></i>`;
    }).join('');
    return `<div class="scene-foreground foreground-${esc(effect)}" aria-hidden="true">${particles}</div>`;
  }

  function sceneLightHtml(gameId) {
    const effect = ambientEffectFor(gameId);
    if (!effect || effect === 'none') return '';
    return `<div class="scene-lighting lighting-${esc(effect)}" aria-hidden="true"><span></span><span></span></div>`;
  }

  function sceneEventHtml(gameId) {
    const effect = ambientEffectFor(gameId);
    if (!effect || effect === 'none') return '';
    const countMap = {
      'wind-dust': 18,
      'moon-motes': 16,
      'twilight-motes': 16,
      'ghost-mist': 14,
      'mansion-dust': 14,
      'ash-embers': 16,
      'ember-dust': 16,
      'rain-sparks': 18,
      'rain-embers': 18,
      'cold-rain': 14,
      'crystal-sparkles': 12,
      'dark-motes': 12,
      'divine-sparks': 12,
      'village-ash': 16,
      'ominous-motes': 16
    };
    const baseCount = countMap[effect] || 14;
    const count = mobilePerformance ? Math.min(baseCount, 6) : baseCount;
    const particles = Array.from({ length: count }, (_, index) => {
      const x = (index * 59 + 9) % 106 - 3;
      const y = (index * 47 + 13) % 106 - 3;
      const size = 8 + ((index * 11) % 20);
      const duration = 2 + ((index * 7) % 5);
      const delay = -((index * 5) % 9);
      const drift = ((index * 31) % 241) - 120;
      const rotation = (index * 73) % 360;
      const opacity = (25 + ((index * 19) % 50)) / 100;
      const variant = index % 5;
      return `<i class="scene-event-particle event-v${variant}" style="--x:${x}%;--y:${y}%;--s:${size}px;--d:${duration}s;--delay:${delay}s;--drift:${drift}px;--r:${rotation}deg;--o:${opacity}"></i>`;
    }).join('');
    return `<div class="scene-event event-${esc(effect)}" aria-hidden="true">${particles}</div>`;
  }

  function clamp(value, min, max, fallback) {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  }

  const UI_THEMES = {
    default: { label: 'Original', color: '#071018' },
    'black-red': { label: 'Negro & Rojo', color: '#08090c' },
    'blue-yellow': { label: 'Azul & Amarillo', color: '#07142c' }
  };

  function normalizeUiTheme(value) {
    return Object.prototype.hasOwnProperty.call(UI_THEMES, value) ? value : 'default';
  }

  function syncAppearanceUi() {
    if (appearanceButton) {
      appearanceButton.dataset.theme = uiTheme;
      appearanceButton.title = `Apariencia actual: ${UI_THEMES[uiTheme].label}`;
    }
    appearancePopover?.querySelectorAll('[data-ui-theme-choice]').forEach((option) => {
      const selected = option.dataset.uiThemeChoice === uiTheme;
      option.setAttribute('aria-pressed', selected ? 'true' : 'false');
      option.classList.toggle('is-selected', selected);
    });
  }

  function applyUiTheme(value, persist = true) {
    uiTheme = normalizeUiTheme(value);
    body.dataset.uiTheme = uiTheme;
    document.documentElement.dataset.uiTheme = uiTheme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', UI_THEMES[uiTheme].color);
    if (persist) safeSet(localStore, UI_THEME_KEY, uiTheme);
    syncAppearanceUi();
  }

  function setAppearanceOpen(open) {
    if (!appearancePopover || !appearanceButton) return;
    const active = Boolean(open);
    appearancePopover.hidden = !active;
    appearanceButton.setAttribute('aria-expanded', active ? 'true' : 'false');
    body.classList.toggle('appearance-open', active);
    if (active) syncAppearanceUi();
  }

  function tierInfo(score) {
    return scale.find((row) => Number(row.score) === Number(score)) || { score, label: String(score), tone: 'default', color: '#7edfb9' };
  }

  function coverSrc(game) {
    if (game && typeof game.cover === 'string' && game.cover.trim()) return game.cover.trim();
    const file = game && coverFiles[game.id];
    return file ? `assets/covers/${file}` : '';
  }

  function backgroundSrcFor(gameId) {
    const game = gameById.get(gameId);
    if (game && typeof game.background === 'string' && game.background.trim()) return game.background.trim();
    return scenePhotoFiles[gameId] || '';
  }

  function musicConfigFor(gameId) {
    const built = builtInMusic[gameId] && typeof builtInMusic[gameId] === 'object' ? builtInMusic[gameId] : {};
    const custom = gameById.get(gameId)?.music;
    return custom && typeof custom === 'object' ? { ...built, ...custom } : built;
  }

  function normalizeCatalog(value) {
    return value === 'online' ? 'online' : 'offline';
  }

  function gamesForCatalog(catalog = 'offline') {
    const normalized = normalizeCatalog(catalog);
    return games.filter((game) => normalizeCatalog(game._catalog) === normalized);
  }

  function visibleTierGames(catalog = 'offline') {
    return gamesForCatalog(catalog).filter((game) => game.tierVisible !== false);
  }

  function rankedJourney(catalog = 'offline') {
    return [...visibleTierGames(catalog)].sort((a, b) => (b.score - a.score) || ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || a.title.localeCompare(b.title, 'es'));
  }

  function catalogHome(catalog) {
    return normalizeCatalog(catalog) === 'online' ? 'online' : 'tierlist';
  }

  function catalogReviewsRoute(catalog) {
    return `games/${normalizeCatalog(catalog)}`;
  }

  function applyCatalogMode(catalog) {
    const normalized = normalizeCatalog(catalog);
    body.dataset.catalog = normalized;
    body.classList.toggle('online-mode', normalized === 'online');
  }

  function sortGames(list) {
    return [...list].sort((a, b) => (b.score - a.score) || ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || a.title.localeCompare(b.title, 'es'));
  }

  function preview(value, max = 170) {
    const clean = String(value || '').replace(/[*_#>-]/g, '').replace(/\s+/g, ' ').trim();
    return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
  }

  function inlineMarkdown(value) {
    let html = esc(value);
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return html;
  }

  function splitSentences(value) {
    const text = String(value || '').replace(/\r/g, '').trim();
    if (!text) return [];
    const parts = text.match(/[^.!?…]+(?:[.!?…]+|$)/gu);
    return (parts || [text]).map((part) => part.trim()).filter(Boolean);
  }

  function proseParagraphs(value) {
    const raw = String(value || '').replace(/\r/g, '').trim();
    if (!raw) return [];
    const blocks = raw.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    const result = [];
    for (const block of blocks.length ? blocks : [raw]) {
      if (block.length <= 430) {
        result.push(block);
        continue;
      }
      const sentences = splitSentences(block);
      if (sentences.length <= 1) {
        result.push(block);
        continue;
      }
      let current = '';
      for (const sentence of sentences) {
        const next = current ? `${current} ${sentence}` : sentence;
        if (current && next.length > 390) {
          result.push(current.trim());
          current = sentence;
        } else {
          current = next;
        }
      }
      if (current.trim()) result.push(current.trim());
    }
    return result;
  }

  function paragraphHtml(paragraphs) {
    return paragraphs.map((paragraph) => `<p>${inlineMarkdown(paragraph).replace(/\n/g, '<br>')}</p>`).join('');
  }

  const curatedReviewSpecs = {
  "gow2": [
    {
      "title": "Escenarios y combate",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Ritmo, puzles y jefes",
      "marker": "El ritmo es muy bueno",
      "verdict": false
    },
    {
      "title": "Música, enemigos y feedback",
      "marker": "La banda sonora es la polla",
      "verdict": false
    },
    {
      "title": "Final y doblaje",
      "marker": "El final, a nivel de lore",
      "verdict": false
    },
    {
      "title": "Modo Titán",
      "marker": "Me he visto obligado a jugar",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Le doy un sólido 7",
      "verdict": true
    }
  ],
  "re3-og": [
    {
      "title": "Nemesis y atmósfera",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Esquiva y combate",
      "marker": "El sistema de esquiva es buenísimo",
      "verdict": false
    },
    {
      "title": "Escenarios y ritmo",
      "marker": "Los escenarios están tremendos.",
      "verdict": false
    },
    {
      "title": "Música, sonido y personajes",
      "marker": "La música, aunque suena",
      "verdict": false
    },
    {
      "title": "Dificultad, recursos y duración",
      "marker": "Me he pasado el juego en la dificultad más alta",
      "verdict": false
    },
    {
      "title": "Sensación final",
      "marker": "Tirar abajo a Nemesis",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Un 8. Juegazo",
      "verdict": true
    }
  ],
  "majoras-mask": [
    {
      "title": "Primera impresión",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Gameplay y sistema de tres días",
      "marker": "El gameplay funciona muy bien.",
      "verdict": false
    },
    {
      "title": "Tono y atmósfera",
      "marker": "Lo más fuerte que tiene Majora’s Mask",
      "verdict": false
    },
    {
      "title": "Mazmorras e Ikana",
      "marker": "La estructura general me parece",
      "verdict": false
    },
    {
      "title": "Secundarias y personajes",
      "marker": "Las subtramas y misiones secundarias",
      "verdict": false
    },
    {
      "title": "Música y balance final",
      "marker": "La música en general es buenísima.",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "La nota a día de hoy",
      "verdict": true
    }
  ],
  "gow3": [
    {
      "title": "Visuales y escenarios",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Objetos, magias y armas",
      "marker": "Luego, los \"objetos utilizables\"",
      "verdict": false
    },
    {
      "title": "Jefes, música y doblaje",
      "marker": "GOW3 tiene las mejores batallas",
      "verdict": false
    },
    {
      "title": "Secretos y feedback",
      "marker": "También, los cofres *secretos*",
      "verdict": false
    },
    {
      "title": "Modo Caos y dificultad",
      "marker": "Luego, el modo Caos",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Un 7.5.",
      "verdict": true
    }
  ],
  "gow1": [
    {
      "title": "Escenarios y estructura",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Magias y armas",
      "marker": "God of War 1 tiene la magia",
      "verdict": false
    },
    {
      "title": "Jefes, música y doblaje",
      "marker": "Los bosses son quizás",
      "verdict": false
    },
    {
      "title": "Progresión, feedback y dificultad",
      "marker": "Los cofres secretos de este juego",
      "verdict": false
    },
    {
      "title": "Puzles, presentación y duración",
      "marker": "Ah, y este juego tiene los mejores puzzles",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "**Un 7**",
      "verdict": true
    }
  ],
  "sotc": [
    {
      "title": "Mundo y primera impresión",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Agro y colosos",
      "marker": "Moverse con Agro",
      "verdict": false
    },
    {
      "title": "El peso de cada victoria",
      "marker": "Derrotarlos no se siente",
      "verdict": false
    },
    {
      "title": "Jugabilidad y cámara",
      "marker": "La jugabilidad está bien",
      "verdict": false
    },
    {
      "title": "Música e historia",
      "marker": "La música es uno de los puntos fuertes.",
      "verdict": false
    },
    {
      "title": "Final",
      "marker": "Te conviertes en aquello",
      "verdict": false
    },
    {
      "title": "Conclusión",
      "marker": "Un juego que mucha gente",
      "verdict": false
    }
  ],
  "re9": [
    {
      "title": "Atmósfera y Raccoon City",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Historia y encuentros",
      "marker": "Lo más memorable del juego es su historia",
      "verdict": false
    },
    {
      "title": "Combate y personajes jugables",
      "marker": "Los controles se ven muy fluidos",
      "verdict": false
    },
    {
      "title": "Escenarios y tensión",
      "marker": "Raccoon City es el escenario que más me gustó",
      "verdict": false
    },
    {
      "title": "Música y sonido",
      "marker": "La música cumple como acompañamiento",
      "verdict": false
    },
    {
      "title": "Puzles y exploración",
      "marker": "Los puzzles están bien",
      "verdict": false
    },
    {
      "title": "Doblaje y apartado técnico",
      "marker": "El doblaje Inglés del juego",
      "verdict": false
    },
    {
      "title": "Dificultad, ritmo y duración",
      "marker": "La dificultad es intermedia",
      "verdict": false
    },
    {
      "title": "Decisiones y final",
      "marker": "También añadir que al final del juego",
      "verdict": false
    },
    {
      "title": "Conclusión",
      "marker": "Como juego, es **excelente**",
      "verdict": false
    }
  ],
  "re2-og": [
    {
      "title": "Primera impresión y comisaría",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Controles y ritmo",
      "marker": "Además, entre que te mueves",
      "verdict": false
    },
    {
      "title": "Enemigos y tensión",
      "marker": "Los zombies siguen siendo lo que son",
      "verdict": false
    },
    {
      "title": "Personajes y música",
      "marker": "Los personajes están guays.",
      "verdict": false
    },
    {
      "title": "Jefes y rejugabilidad",
      "marker": "Los bosses son bastante flojos",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Nota: 6.5 / 7",
      "verdict": true
    }
  ],
  "re4-og": [
    {
      "title": "Gameplay y control",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Ritmo y acción",
      "marker": "El ritmo general es muy bueno",
      "verdict": false
    },
    {
      "title": "Leon, música y Buhonero",
      "marker": "Leon S. Kennedy aquí ya está",
      "verdict": false
    },
    {
      "title": "Ashley y acompañamiento",
      "marker": "Por último, Ashley",
      "verdict": false
    },
    {
      "title": "Terror, enemigos y tensión",
      "marker": "**Lo malo:**",
      "verdict": false
    },
    {
      "title": "Tramo final y duración",
      "marker": "El tramo final es, claramente",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "**Veredicto**",
      "verdict": true
    }
  ],
  "medievil": [
    {
      "title": "Primera impresión y ritmo",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Sir Daniel y control",
      "marker": "Sir Daniel Fortesque",
      "verdict": false
    },
    {
      "title": "Cámara, combate y armas",
      "marker": "La cámara tampoco es ninguna maravilla",
      "verdict": false
    },
    {
      "title": "Dificultad y Barco Fantasma",
      "marker": "La dificultad generalmente está bien.",
      "verdict": false
    },
    {
      "title": "Niveles, Cálices y Galería",
      "marker": "Por suerte, el diseño de niveles",
      "verdict": false
    },
    {
      "title": "Jefes y enemigos",
      "marker": "Los jefes... sin más.",
      "verdict": false
    },
    {
      "title": "Ambientación, música y sonido",
      "marker": "Pero si hay dos cosas donde MediEvil",
      "verdict": false
    },
    {
      "title": "Historia y envejecimiento",
      "marker": "La historia, en cambio",
      "verdict": false
    },
    {
      "title": "Balance final",
      "marker": "Tiene defectos claros y el tramo final",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Nota: 7",
      "verdict": true
    }
  ],
  "re3-remake": [
    {
      "title": "Como remake y como juego",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Nemesis",
      "marker": "Nemesis en este juego",
      "verdict": false
    },
    {
      "title": "Esquiva y combate",
      "marker": "El sistema de esquiva en este juego",
      "verdict": false
    },
    {
      "title": "Escenarios y adaptación",
      "marker": "- Los escenarios son visualmente chulos",
      "verdict": false
    },
    {
      "title": "Música, personajes y puzles",
      "marker": "La música por lo general es buena",
      "verdict": false
    },
    {
      "title": "Acción, ritmo y sensaciones",
      "marker": "Y bueno, el juego se mantiene gracias a la acción",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Nota: 6,5 como juego independiente",
      "verdict": true
    }
  ],
  "re1-remaster": [
    {
      "title": "Atmósfera y controles",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Mansión y backtracking",
      "marker": "El diseño de niveles es **regulero**.",
      "verdict": false
    },
    {
      "title": "Enemigos y puzles",
      "marker": "Los zombies son en su mayoría obstáculos",
      "verdict": false
    },
    {
      "title": "Zonas y música",
      "marker": "El juego aunque el 70% del tiempo",
      "verdict": false
    },
    {
      "title": "Inventario y estructura",
      "marker": "**El mayor problema del juego es su estructura:**",
      "verdict": false
    },
    {
      "title": "Sensación y rejugabilidad",
      "marker": "No me parece un juego que se pueda considerar",
      "verdict": false
    },
    {
      "title": "Balance final",
      "marker": "¿Me ha gustado más este remastered",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "Nota: 5 / 5.5",
      "verdict": true
    }
  ],
  "pokemon-diamond": [
    {
      "title": "Primera impresión",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Lo bueno",
      "marker": "***Lo bueno:***",
      "verdict": false
    },
    {
      "title": "Lo malo",
      "marker": "*Lo malo:*",
      "verdict": false
    },
    {
      "title": "Ritmo y estructura",
      "marker": "Buen juego **en estructura**",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "**Notita:**",
      "verdict": true
    }
  ],
  "pokemon-black": [
    {
      "title": "Primera impresión",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Lo bueno",
      "marker": "***Lo bueno***",
      "verdict": false
    },
    {
      "title": "Lo malo",
      "marker": "***Lo malo:***",
      "verdict": false
    },
    {
      "title": "Comparación con Diamante",
      "marker": "No dista mucho del Pokémon Diamante",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "**Notita:**",
      "verdict": true
    }
  ],
  "twilight-princess": [
    {
      "title": "Inicio y ritmo",
      "marker": null,
      "verdict": false
    },
    {
      "title": "Link lobo y combate",
      "marker": "Link lobo me encanta.",
      "verdict": false
    },
    {
      "title": "Hyrule y mazmorras",
      "marker": "Hyrule me parece correcto.",
      "verdict": false
    },
    {
      "title": "Personajes y Ganondorf",
      "marker": "Los personajes están bastante bien.",
      "verdict": false
    },
    {
      "title": "Música e historia",
      "marker": "La banda sonora es espectacular.",
      "verdict": false
    },
    {
      "title": "Conclusión",
      "marker": "En conjunto, Twilight Princess",
      "verdict": false
    },
    {
      "title": "Veredicto final",
      "marker": "**NOTA: 8**",
      "verdict": true
    }
  ]
};

  function guessSectionTitle(text, index, total) {
    const n = normalize(text);
    if (index === 0) return 'Primera impresión';
    if (/(musica|banda sonora|sonido|doblaje|voz|efectos de sonido)/.test(n)) return 'Música y sonido';
    if (/(historia|lore|personaj|protagon|final|villan|narrativ)/.test(n)) return 'Historia y personajes';
    if (/(escenario|mundo|atmosfera|ambient|nivel|explor|backtracking|mazmorr|zona)/.test(n)) return 'Mundo y atmósfera';
    if (/(combate|gameplay|control|arma|enemig|boss|jefe|esquiva|feedback|puzzle|puzle)/.test(n)) return 'Jugabilidad y combate';
    if (/(dificultad|ritmo|duracion|rejug|horas|muertes|reto)/.test(n)) return 'Ritmo, dificultad y rejugabilidad';
    if (index === total - 1) return 'Conclusión';
    return 'Análisis';
  }

  function curatedReviewSections(gameId, value) {
    const spec = curatedReviewSpecs[gameId];
    const raw = String(value || '').replace(/\r/g, '').trim();
    if (!spec || !raw) return null;
    const starts = [];
    for (let index = 0; index < spec.length; index += 1) {
      const marker = spec[index].marker;
      const start = index === 0 ? 0 : raw.indexOf(marker);
      if (start < 0 || (starts.length && start <= starts[starts.length - 1])) return null;
      starts.push(start);
    }
    return spec.map((item, index) => ({
      title: item.title,
      verdict: Boolean(item.verdict),
      text: raw.slice(starts[index], index + 1 < starts.length ? starts[index + 1] : raw.length).trim()
    })).filter((section) => section.text);
  }

  function automaticReviewSections(value) {
    const paragraphs = proseParagraphs(value);
    if (!paragraphs.length) return [];
    const working = [...paragraphs];
    let verdict = '';
    const last = working[working.length - 1] || '';
    if (last && (last.length <= 150 || /(?:^|\b)(nota|veredicto|juegazo|muy buen juego|obra maestra|excelente|sublime)(?:\b|:)/i.test(last))) {
      verdict = working.pop();
    }
    const groups = [];
    working.forEach((paragraph, index) => {
      const title = guessSectionTitle(paragraph, index, working.length);
      const previous = groups[groups.length - 1];
      if (previous && previous.title === title) previous.paragraphs.push(paragraph);
      else groups.push({ title, paragraphs: [paragraph] });
    });
    const sections = groups.map((group) => ({ title: group.title, verdict: false, text: group.paragraphs.join('\n\n') }));
    if (verdict) sections.push({ title: 'Veredicto final', verdict: true, text: verdict });
    return sections;
  }

  function structuredReviewSections(gameId) {
    const game = gameById.get(gameId);
    const sections = game?.reviewSections;
    const hasLocalReviewOverride = Boolean(editStore?.games?.[gameId]?.review);
    if (hasLocalReviewOverride || !Array.isArray(sections) || !sections.length) return null;

    const normalized = sections.map((section, index) => {
      if (!section || typeof section !== 'object') return null;
      const verdict = Boolean(section.verdict);
      const title = verdict
        ? 'Veredicto final'
        : String(section.title || `Sección ${index + 1}`).trim();
      const paragraphs = Array.isArray(section.paragraphs)
        ? section.paragraphs.map((paragraph) => String(paragraph || '').trim()).filter(Boolean)
        : [];
      const text = paragraphs.length
        ? paragraphs.join('\n\n')
        : String(section.text || '').trim();
      if (!text) return null;
      return { title, verdict, text };
    }).filter(Boolean);

    return normalized.length ? normalized : null;
  }

  function reviewSectionsFor(gameId, value) {
    return structuredReviewSections(gameId) || curatedReviewSections(gameId, value) || automaticReviewSections(value);
  }

  function reviewHtml(value, gameId) {
    const sections = reviewSectionsFor(gameId, value);
    if (window.MausReviewRenderer) {
      return window.MausReviewRenderer.render(sections, { navigator: true, idPrefix: `review-${gameId}` });
    }
    if (!sections.length) return '<div class="review-layout"><p class="empty-review">Sin review todavía.</p></div>';
    return `<div class="review-layout">${sections.map((section) => {
      if (section.verdict) return `<section class="review-verdict"><span>Veredicto final</span><div class="review-verdict-body">${inlineMarkdown(section.text).replace(/\n/g, '<br>')}</div></section>`;
      return `<section class="review-section"><div class="review-section-head">${esc(section.title)}</div><div class="review-copy">${paragraphHtml(proseParagraphs(section.text))}</div></section>`;
    }).join('')}</div>`;
  }

  function editableParagraphHtml(paragraph, gameId, index) {
    return `<p class="review-inline-editor" contenteditable="true" spellcheck="true" data-review-edit-part="${index}" data-edit-game="${esc(gameId)}">${inlineMarkdown(paragraph).replace(/\n/g, '<br>')}</p>`;
  }

  function reviewEditorHtml(value, gameId) {
    const sections = reviewSectionsFor(gameId, value);
    if (!sections.length) return '<div class="review-layout"><p class="empty-review">Sin review todavía.</p></div>';
    let partIndex = 0;
    const html = sections.map((section) => {
      if (section.verdict) {
        const index = partIndex++;
        return `<section class="review-verdict"><span>Veredicto final</span><div class="review-verdict-body review-inline-editor review-inline-verdict" contenteditable="true" spellcheck="true" data-review-edit-part="${index}" data-edit-game="${esc(gameId)}">${inlineMarkdown(section.text).replace(/\n/g, '<br>')}</div></section>`;
      }
      const paragraphs = proseParagraphs(section.text);
      const content = paragraphs.map((paragraph) => editableParagraphHtml(paragraph, gameId, partIndex++)).join('');
      return `<section class="review-section"><div class="review-section-head">${esc(section.title)}</div><div class="review-copy">${content}</div></section>`;
    }).join('');
    return `<div class="review-layout review-layout-editable">${html}</div>`;
  }

  function editableNodeToMarkdown(element) {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || '';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const tag = node.tagName.toLowerCase();
      const inner = Array.from(node.childNodes).map(walk).join('');
      if (tag === 'br') return '\n';
      if (tag === 'strong' || tag === 'b') return `**${inner}**`;
      if (tag === 'em' || tag === 'i') return `*${inner}*`;
      if (tag === 'div' || tag === 'p') return `${inner}\n`;
      return inner;
    };
    return Array.from(element.childNodes).map(walk).join('').replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  function collectInlineReview(gameId) {
    const parts = Array.from(app.querySelectorAll('[data-review-edit-part][data-edit-game]'))
      .filter((element) => element.dataset.editGame === gameId)
      .sort((a, b) => Number(a.dataset.reviewEditPart) - Number(b.dataset.reviewEditPart))
      .map(editableNodeToMarkdown)
      .filter(Boolean);
    return parts.join('\n\n').trim();
  }

  function applyStoredEdits() {
    const storedGames = editStore.games && typeof editStore.games === 'object' ? editStore.games : {};
    games.forEach((game) => {
      const patch = storedGames[game.id];
      if (!patch || typeof patch !== 'object') return;
      if (typeof patch.title === 'string' && patch.title.trim()) game.title = patch.title.trim();
      if (typeof patch.review === 'string' && patch.review.trim()) game.review = patch.review.trim();
      const score = Number(patch.score);
      if (Number.isFinite(score) && scale.some((row) => Number(row.score) === score)) game.score = score;
    });

    const storedTiers = editStore.tiers && typeof editStore.tiers === 'object' ? editStore.tiers : {};
    scale.forEach((row) => {
      const patch = storedTiers[String(row.score)];
      if (patch && typeof patch.label === 'string' && patch.label.trim()) row.label = patch.label.trim();
    });
  }

  function persistEditStore() {
    safeSet(localStore, EDIT_STORAGE_KEY, JSON.stringify(editStore));
  }

  function saveGameField(gameId, field, value) {
    const game = gameById.get(gameId);
    if (!game) return false;
    editStore.games ||= {};
    editStore.games[gameId] ||= {};

    if (field === 'score') {
      const score = Number(value);
      if (!scale.some((row) => Number(row.score) === score)) return false;
      game.score = score;
      editStore.games[gameId].score = score;
    } else if (field === 'title' || field === 'review') {
      const text = String(value ?? '').trim();
      if (!text) return false;
      game[field] = text;
      editStore.games[gameId][field] = text;
    } else {
      return false;
    }

    persistEditStore();
    showSavedToast();
    return true;
  }

  function saveTierLabel(score, value) {
    const row = scale.find((item) => Number(item.score) === Number(score));
    const label = String(value ?? '').trim();
    if (!row || !label) return false;
    row.label = label;
    editStore.tiers ||= {};
    editStore.tiers[String(row.score)] ||= {};
    editStore.tiers[String(row.score)].label = label;
    persistEditStore();
    showSavedToast();
    return true;
  }

  function showSavedToast(message = 'Guardado') {
    if (!saveToast) return;
    saveToast.textContent = message;
    saveToast.hidden = false;
    saveToast.classList.remove('show');
    void saveToast.offsetWidth;
    saveToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      saveToast.classList.remove('show');
      window.setTimeout(() => { saveToast.hidden = true; }, 220);
    }, 1500);
  }

  function updateEditUi() {
    body.classList.toggle('edit-mode', editMode);
    if (editModeButton) {
      editModeButton.classList.toggle('is-unlocked', editMode);
      editModeButton.innerHTML = editMode ? '🔓 <span>Edición activa</span>' : '🔒 <span>Editar</span>';
      editModeButton.setAttribute('aria-label', editMode ? 'Salir del modo edición' : 'Abrir modo edición');
    }
    if (editToolbar) editToolbar.hidden = !editMode;
  }

  async function passwordMatches() { return false; }

  function openAdminGate() {
    if (!adminGate) return;
    adminGate.hidden = false;
    adminGateError.textContent = '';
    adminPassword.value = '';
    requestAnimationFrame(() => adminPassword.focus());
  }

  function closeAdminGate() {
    if (!adminGate) return;
    adminGate.hidden = true;
    adminGateError.textContent = '';
    adminPassword.value = '';
  }

  function exitEditMode() {
    editMode = false;
    safeRemove(sessionStore, ADMIN_SESSION_KEY);
    updateEditUi();
    renderRoute();
  }

  function exportEdits() {
    const payload = { exportedAt: new Date().toISOString(), version: 1, edits: editStore };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tier-list-maus-edits-backup.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importEditsFile(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = parsed?.edits && typeof parsed.edits === 'object' ? parsed.edits : parsed;
      if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) throw new Error('invalid');
      editStore = incoming;
      persistEditStore();
      location.reload();
    } catch (_) {
      showSavedToast('La copia no es válida');
    }
  }

  function openAudioDb() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB no disponible'));
        return;
      }
      const request = indexedDB.open(AUDIO_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(AUDIO_DB_STORE)) db.createObjectStore(AUDIO_DB_STORE, { keyPath: 'gameId' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('No se pudo abrir IndexedDB'));
      request.onblocked = () => reject(new Error('IndexedDB bloqueada'));
    });
  }

  async function getStoredTheme(gameId) {
    const db = await openAudioDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(AUDIO_DB_STORE, 'readonly');
        const request = tx.objectStore(AUDIO_DB_STORE).get(gameId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('Error leyendo tema'));
      });
    } finally {
      db.close();
    }
  }

  async function saveStoredTheme(gameId, title, blob) {
    const db = await openAudioDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(AUDIO_DB_STORE, 'readwrite');
        tx.objectStore(AUDIO_DB_STORE).put({ gameId, title, blob, updatedAt: Date.now() });
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error('Error guardando tema'));
        tx.onabort = () => reject(tx.error || new Error('Guardado cancelado'));
      });
    } finally {
      db.close();
    }
    themeMeta[gameId] = { title };
    safeSet(localStore, THEME_META_KEY, JSON.stringify(themeMeta));
  }

  async function deleteStoredTheme(gameId) {
    const db = await openAudioDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(AUDIO_DB_STORE, 'readwrite');
        tx.objectStore(AUDIO_DB_STORE).delete(gameId);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error('Error eliminando tema'));
        tx.onabort = () => reject(tx.error || new Error('Eliminación cancelada'));
      });
    } finally {
      db.close();
    }
    delete themeMeta[gameId];
    safeSet(localStore, THEME_META_KEY, JSON.stringify(themeMeta));
  }

  function themeLabelFor(gameId) {
    return themeMeta[gameId]?.title || musicConfigFor(gameId)?.title || '';
  }

  function sceneSvg(key) {
    const open = `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.18)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient><filter id="blur18"><feGaussianBlur stdDeviation="18"/></filter><filter id="blur7"><feGaussianBlur stdDeviation="7"/></filter></defs><style>.sky{opacity:.96}.far{opacity:.58}.mid{opacity:.82}.near{opacity:.96}.glow{mix-blend-mode:screen}.soft{filter:url(#blur18)}</style>`;
    const close = `</svg>`;
    const svgs = {
      'gow1': `${open}
        <rect width="1600" height="900" fill="url(#g1bg)"/>
        <defs><linearGradient id="g1bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a13"/><stop offset="0.45" stop-color="#1d120e"/><stop offset="1" stop-color="#090c10"/></linearGradient></defs>
        <g class="glow soft"><ellipse cx="785" cy="225" rx="320" ry="90" fill="rgba(255,156,92,.16)"/></g>
        <g class="far" fill="#0d0f12"><path d="M0 820 L210 670 L380 720 L570 540 L720 575 L855 370 L1045 585 L1245 470 L1440 645 L1600 560 V900 H0 Z"/></g>
        <g class="mid" fill="#251811" stroke="rgba(226,166,108,.22)" stroke-width="3"><path d="M475 820 V260 H1125 V820"/><path d="M440 260 H1160 L1025 165 H575 Z"/><path d="M575 820 V325 M715 820 V325 M885 820 V325 M1025 820 V325"/></g>
        <g class="near" stroke="rgba(255,141,86,.42)" stroke-width="5" fill="none"><path d="M175 170 L340 565"/><path d="M1438 120 L1260 520"/></g>
        <g class="glow"><ellipse cx="802" cy="255" rx="220" ry="48" fill="rgba(255,201,124,.13)"/></g>
        <g class="float-slow" fill="rgba(255,126,76,.28)"><circle cx="230" cy="180" r="3"/><circle cx="1320" cy="220" r="4"/><circle cx="710" cy="120" r="3"/><circle cx="915" cy="140" r="2"/></g>
      ${close}`,
      'gow2': `${open}
        <defs><linearGradient id="g2bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#142038"/><stop offset="0.48" stop-color="#0f1727"/><stop offset="1" stop-color="#090d16"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#g2bg)"/>
        <g class="glow soft"><ellipse cx="805" cy="245" rx="340" ry="140" fill="rgba(255,224,160,.14)"/><ellipse cx="800" cy="380" rx="280" ry="220" fill="rgba(110,139,255,.09)"/></g>
        <g class="far" fill="#0e1119"><path d="M0 840 L180 710 L330 780 L470 660 L610 725 L760 600 L960 735 L1160 585 L1310 700 L1600 620 V900 H0 Z"/></g>
        <g class="mid" fill="none" stroke="rgba(124,163,255,.68)"><circle cx="800" cy="438" r="250" stroke-width="8"/><circle cx="800" cy="438" r="186" stroke-width="4" stroke-dasharray="18 18"/><circle cx="800" cy="438" r="108" stroke-width="3" stroke-dasharray="8 14"/></g>
        <g class="pulse-slow" stroke="rgba(255,222,157,.88)" stroke-width="11" fill="none"><path d="M620 438 H980"/><path d="M800 258 V618"/><path d="M680 310 C730 360 870 360 920 310"/><path d="M680 566 C730 516 870 516 920 566"/></g>
        <g class="mid" fill="#191f2f" stroke="rgba(255,226,162,.26)" stroke-width="3"><path d="M300 815 V520 H435 V815 M1165 815 V520 H1300 V815"/><path d="M270 520 H465 L420 470 H315 Z M1135 520 H1330 L1285 470 H1180 Z"/></g>
        <g class="float-mid" stroke="rgba(157,188,255,.44)" stroke-width="4" fill="none"><path d="M210 148 C385 208 480 310 535 430"/><path d="M1388 150 C1218 210 1122 315 1068 430"/></g>
      ${close}`,
      'gow3': `${open}
        <defs><linearGradient id="g3bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2426"/><stop offset="0.5" stop-color="#17171b"/><stop offset="1" stop-color="#0a0b10"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#g3bg)"/>
        <g class="glow soft"><ellipse cx="1225" cy="140" rx="240" ry="130" fill="rgba(250,197,112,.14)"/></g>
        <g class="far" fill="#0e1117"><path d="M0 860 L170 750 L340 760 L525 630 L650 670 L835 440 L935 505 L1130 295 L1240 375 L1415 185 L1600 350 V900 H0 Z"/></g>
        <g class="mid" fill="#121419" stroke="rgba(223,191,132,.32)" stroke-width="3"><path d="M1175 292 V120 H1385 V292"/><path d="M1140 120 H1420 L1362 80 H1198 Z"/><path d="M1235 290 V150 M1280 290 V150 M1325 290 V150"/></g>
        <g class="pulse-slow" stroke="rgba(202,226,255,.72)" stroke-width="5" fill="none"><path d="M300 120 L418 240 L370 240 L495 410"/><path d="M360 90 L455 185"/><path d="M1080 104 L1150 168 L1122 168 L1200 258"/></g>
        <g class="float-slow" fill="rgba(215,114,79,.22)"><circle cx="900" cy="170" r="4"/><circle cx="975" cy="210" r="3"/><circle cx="1080" cy="240" r="2"/></g>
      ${close}`,
      're3-og': `${open}
        <defs><linearGradient id="re3bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#09121b"/><stop offset="0.45" stop-color="#0c1115"/><stop offset="1" stop-color="#06080b"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#re3bg)"/>
        <g class="glow soft"><ellipse cx="1160" cy="220" rx="240" ry="120" fill="rgba(177,46,53,.2)"/><ellipse cx="270" cy="220" rx="210" ry="90" fill="rgba(53,117,154,.14)"/></g>
        <g class="far" fill="#0d1318"><path d="M0 820 V515 H145 V820 M125 820 V410 H285 V820 M270 820 V585 H435 V820 M420 820 V335 H635 V820 M620 820 V470 H780 V820 M760 820 V295 H965 V820 M948 820 V515 H1150 V820 M1135 820 V355 H1365 V820 M1345 820 V600 H1600 V820"/></g>
        <g class="mid" fill="#111820"><rect x="0" y="790" width="1600" height="110"/><path d="M90 790 H640 L730 675 H1085 L1198 790 H1600" opacity=".25"/></g>
        <g class="near" fill="rgba(13,16,19,.95)"><path d="M1160 790 C1132 665 1145 520 1182 440 C1214 370 1276 335 1325 357 C1378 383 1397 472 1388 580 C1378 680 1356 748 1342 790 Z"/></g>
        <g class="pulse-slow" fill="rgba(255,64,72,.2)"><rect x="1060" y="470" width="110" height="14" rx="5"/><rect x="240" y="450" width="82" height="12" rx="5"/></g>
        <g class="twinkle" stroke="rgba(156,210,233,.18)" stroke-width="2"><path d="M180 740 l0 60 M176 770 h20"/><path d="M905 720 l0 60 M895 750 h20"/></g>
      ${close}`,
      're3-remake': `${open}
        <defs><linearGradient id="re3rbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#211316"/><stop offset="0.5" stop-color="#161012"/><stop offset="1" stop-color="#08090c"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#re3rbg)"/>
        <g class="glow soft"><ellipse cx="410" cy="235" rx="250" ry="140" fill="rgba(255,136,75,.2)"/><ellipse cx="1110" cy="155" rx="220" ry="110" fill="rgba(190,44,39,.18)"/></g>
        <g class="far" fill="#151010"><path d="M0 820 V540 H140 V820 M120 820 V420 H315 V820 M295 820 V600 H490 V820 M470 820 V300 H730 V820 M710 820 V460 H930 V820 M910 820 V340 H1190 V820 M1170 820 V500 H1400 V820 M1380 820 V635 H1600 V820"/></g>
        <g class="mid" fill="#0e1013"><path d="M0 785 H420 L600 670 L780 700 L920 610 L1120 650 L1285 590 L1600 640 V900 H0 Z"/></g>
        <g class="pulse-slow" fill="rgba(255,118,64,.28)"><circle cx="405" cy="430" r="85"/><circle cx="1140" cy="510" r="65"/><circle cx="1280" cy="465" r="42"/></g>
        <g class="float-mid" fill="rgba(247,171,109,.22)"><circle cx="385" cy="340" r="3"/><circle cx="1125" cy="430" r="4"/><circle cx="1210" cy="410" r="2"/><circle cx="1300" cy="360" r="3"/></g>
      ${close}`,
      're2-og': `${open}
        <defs><linearGradient id="re2bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101722"/><stop offset="0.45" stop-color="#10131a"/><stop offset="1" stop-color="#090b10"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#re2bg)"/>
        <g class="glow soft"><ellipse cx="800" cy="212" rx="220" ry="95" fill="rgba(180,214,255,.15)"/></g>
        <g class="mid" fill="#121920" stroke="rgba(122,160,210,.34)" stroke-width="4"><path d="M430 810 V300 H1170 V810"/><path d="M385 300 H1215 L1095 210 H505 Z"/><path d="M645 810 V458 H955 V810"/><path d="M540 810 V390 M1060 810 V390"/></g>
        <text x="800" y="395" text-anchor="middle" fill="rgba(176,214,255,.45)" font-size="72" font-family="Georgia,serif" letter-spacing="18">RPD</text>
        <g class="far" fill="rgba(255,255,255,.06)"><circle cx="800" cy="492" r="110"/><circle cx="800" cy="492" r="152" fill="none" stroke="rgba(108,157,215,.15)" stroke-width="4"/></g>
        <g class="twinkle" fill="rgba(248,235,192,.14)"><circle cx="760" cy="255" r="4"/><circle cx="830" cy="246" r="3"/><circle cx="872" cy="260" r="2"/></g>
      ${close}`,
      're1-remaster': `${open}
        <defs><linearGradient id="re1bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151411"/><stop offset="0.5" stop-color="#11100f"/><stop offset="1" stop-color="#09090a"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#re1bg)"/>
        <g class="glow soft"><ellipse cx="803" cy="180" rx="185" ry="85" fill="rgba(255,213,151,.1)"/></g>
        <g class="mid" fill="#141110" stroke="rgba(192,156,107,.28)" stroke-width="4"><path d="M380 820 V292 H1220 V820"/><path d="M330 292 H1270 L1115 195 H485 Z"/><path d="M540 820 V395 M700 820 V395 M900 820 V395 M1060 820 V395"/></g>
        <g class="near" stroke="rgba(255,214,146,.18)" stroke-width="6" fill="none"><path d="M800 190 V345"/><path d="M750 325 Q800 385 850 325"/><path d="M758 338 L720 405 M842 338 L880 405"/></g>
      ${close}`,
      're4-og': `${open}
        <defs><linearGradient id="re4bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f1e"/><stop offset="0.46" stop-color="#141413"/><stop offset="1" stop-color="#090908"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#re4bg)"/>
        <g class="glow soft"><ellipse cx="1260" cy="208" rx="170" ry="105" fill="rgba(255,196,120,.13)"/></g>
        <g class="far" fill="#10110f" stroke="rgba(155,119,77,.22)" stroke-width="3"><path d="M80 820 V610 L250 492 L420 610 V820"/><path d="M438 820 V570 L610 468 L760 570 V820"/><path d="M1040 820 V600 L1215 500 L1398 600 V820"/><path d="M720 820 V388 H930 V820"/><path d="M698 388 H952 L820 250 Z"/></g>
        <g class="mid" fill="rgba(125,136,109,.08)"><rect x="0" y="625" width="1600" height="260"/></g>
        <g class="float-slow" fill="rgba(205,217,180,.12)"><circle cx="230" cy="320" r="3"/><circle cx="510" cy="280" r="2"/><circle cx="1160" cy="300" r="3"/><circle cx="1330" cy="260" r="4"/></g>
      ${close}`,
      're9': `${open}
        <defs><linearGradient id="re9bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171326"/><stop offset="0.5" stop-color="#10121a"/><stop offset="1" stop-color="#08080d"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#re9bg)"/>
        <g class="glow soft"><ellipse cx="800" cy="236" rx="250" ry="110" fill="rgba(214,124,255,.16)"/></g>
        <g class="far" fill="#0e1118" stroke="rgba(151,98,132,.22)" stroke-width="3"><path d="M0 820 V560 H170 V820 M150 820 V420 H365 V820 M345 820 V598 H545 V820 M525 820 V350 H760 V820 M740 820 V510 H940 V820 M920 820 V392 H1175 V820 M1155 820 V585 H1360 V820 M1340 820 V450 H1555 V820 M1535 820 V640 H1600 V820"/></g>
        <g class="pulse-slow" fill="none" stroke="rgba(208,136,245,.28)" stroke-width="5"><circle cx="800" cy="272" r="92" stroke-dasharray="11 15"/><path d="M612 240 C700 176 900 176 988 240"/></g>
      ${close}`,
      'majoras-mask': `${open}
        <defs><linearGradient id="mmBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1226"/><stop offset="0.48" stop-color="#130f1d"/><stop offset="1" stop-color="#090914"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#mmBg)"/>
        <g class="glow soft"><ellipse cx="1260" cy="185" rx="215" ry="115" fill="rgba(255,216,160,.18)"/></g>
        <g class="near"><circle cx="1265" cy="185" r="170" fill="rgba(230,205,155,.16)" stroke="rgba(255,230,185,.3)" stroke-width="5"/><circle cx="1203" cy="165" r="20" fill="rgba(29,22,30,.45)"/><circle cx="1318" cy="165" r="20" fill="rgba(29,22,30,.45)"/><path d="M1202 255 Q1265 305 1327 255" stroke="rgba(29,22,30,.42)" stroke-width="12" fill="none"/></g>
        <g class="mid" fill="#0d0e17" stroke="rgba(140,93,198,.26)" stroke-width="3"><path d="M0 835 H1600 V900 H0 Z"/><path d="M620 835 V520 H980 V835"/><path d="M588 520 H1012 L800 408 Z"/><path d="M768 520 V285 H832 V520"/></g>
        <g class="twinkle" fill="rgba(195,139,255,.28)"><circle cx="420" cy="145" r="4"/><circle cx="390" cy="192" r="2"/><circle cx="980" cy="120" r="3"/><circle cx="890" cy="170" r="2"/></g>
      ${close}`,
      'twilight-princess': `${open}
        <defs><linearGradient id="tpbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131820"/><stop offset="0.5" stop-color="#11131a"/><stop offset="1" stop-color="#08090d"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#tpbg)"/>
        <g class="glow soft"><ellipse cx="1135" cy="210" rx="245" ry="120" fill="rgba(98,196,220,.13)"/></g>
        <g class="mid" fill="#10151b" stroke="rgba(89,135,214,.24)" stroke-width="4"><path d="M420 820 V420 H1180 V820"/><path d="M365 420 H1235 L1112 320 H488 Z"/><path d="M767 820 V258 H833 V820"/><path d="M707 258 H893 L800 138 Z"/></g>
        <g class="near" fill="rgba(12,16,18,.95)"><path d="M225 770 C246 706 275 660 322 650 C337 619 360 592 393 574 C427 596 447 628 456 656 C500 667 529 710 546 770 Z"/></g>
        <g class="float-mid" fill="rgba(110,196,218,.18)"><path d="M140 176 l18 34 -18 34 -18 -34z"/><path d="M1390 290 l14 27 -14 27 -14 -27z"/><path d="M1220 130 l10 20 -10 20 -10 -20z"/></g>
      ${close}`,
      'sotc': `${open}
        <defs><linearGradient id="sotcbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d251f"/><stop offset="0.45" stop-color="#141814"/><stop offset="1" stop-color="#090a0b"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#sotcbg)"/>
        <g class="glow soft"><ellipse cx="1080" cy="150" rx="260" ry="105" fill="rgba(235,227,176,.11)"/></g>
        <path d="M0 835 C320 760 500 790 760 826 C1010 860 1310 790 1600 822 V900 H0 Z" fill="rgba(9,12,10,.92)"/>
        <g class="near" fill="#111411" stroke="rgba(169,194,160,.18)" stroke-width="4"><path d="M1060 824 C1025 700 1030 555 1082 438 C1120 350 1205 320 1267 372 C1330 423 1342 530 1322 655 C1307 740 1285 792 1267 824 Z"/><path d="M1098 512 L1002 625 L1038 660 L1140 565 Z"/><path d="M1266 510 L1394 622 L1359 664 L1238 565 Z"/></g>
        <path d="M780 625 L890 372" stroke="rgba(245,250,210,.35)" stroke-width="5"/>
      ${close}`,
      'medievil': `${open}
        <defs><linearGradient id="medbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#102117"/><stop offset="0.5" stop-color="#0d1613"/><stop offset="1" stop-color="#07080a"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#medbg)"/>
        <g class="glow soft"><ellipse cx="1260" cy="180" rx="170" ry="100" fill="rgba(181,221,170,.14)"/></g>
        <circle cx="1268" cy="188" r="130" fill="rgba(181,221,170,.11)" stroke="rgba(145,205,142,.16)" stroke-width="4"/>
        <g class="mid" fill="#0d1110" stroke="rgba(101,161,109,.24)" stroke-width="3"><path d="M0 835 H1600 V900 H0 Z"/><path d="M220 835 V620 H300 V835 M200 620 H320 L260 555 Z"/><path d="M520 835 V680 H580 V835 M500 680 H600 L550 630 Z"/><path d="M940 835 V620 H1020 V835 M920 620 H1040 L980 555 Z"/><path d="M1180 835 V650 H1260 V835 M1160 650 H1280 L1220 590 Z"/></g>
        <g class="float-slow" stroke="rgba(126,177,116,.18)" stroke-width="3" fill="none"><path d="M405 740 q-55 -100 -105 -25"/><path d="M1360 755 q-80 -130 -125 -25"/></g>
        <g class="twinkle" fill="rgba(112,226,146,.22)"><circle cx="382" cy="260" r="3"/><circle cx="445" cy="235" r="2"/><circle cx="1180" cy="275" r="3"/></g>
      ${close}`,
      'pokemon-diamond': `${open}
        <defs><linearGradient id="pkdbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3653"/><stop offset="0.5" stop-color="#12243a"/><stop offset="1" stop-color="#0a1220"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#pkdbg)"/>
        <g class="glow soft"><ellipse cx="920" cy="165" rx="280" ry="110" fill="rgba(214,240,255,.16)"/></g>
        <path d="M0 850 C320 760 530 800 780 730 C1030 660 1320 720 1600 650 V900 H0 Z" fill="rgba(8,13,21,.9)"/>
        <path d="M350 785 L724 285 L1085 785 Z" fill="rgba(32,56,91,.62)" stroke="rgba(151,205,255,.28)" stroke-width="5"/>
        <path d="M655 392 L724 285 L800 398 L765 425 L724 370 L690 420 Z" fill="rgba(212,239,255,.22)"/>
        <g class="float-mid" fill="rgba(210,242,255,.18)"><circle cx="205" cy="210" r="2"/><circle cx="242" cy="180" r="3"/><circle cx="1260" cy="195" r="3"/><circle cx="1310" cy="220" r="2"/></g>
      ${close}`,
      'pokemon-black': `${open}
        <defs><linearGradient id="pkbbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1d22"/><stop offset="0.5" stop-color="#111317"/><stop offset="1" stop-color="#08090d"/></linearGradient></defs>
        <rect width="1600" height="900" fill="url(#pkbbg)"/>
        <g class="glow soft"><ellipse cx="980" cy="160" rx="235" ry="95" fill="rgba(103,155,255,.13)"/></g>
        <g class="far" fill="#0e1217" stroke="rgba(112,129,163,.2)" stroke-width="3"><path d="M0 835 V600 H170 V835 M150 835 V450 H330 V835 M310 835 V560 H470 V835 M450 835 V360 H670 V835 M650 835 V510 H820 V835 M800 835 V390 H1030 V835 M1010 835 V540 H1190 V835 M1170 835 V430 H1390 V835 M1370 835 V590 H1600 V835"/></g>
        <path d="M120 690 C470 520 980 520 1480 680" stroke="rgba(92,137,223,.22)" stroke-width="14" fill="none"/>
        <path d="M210 690 C530 560 990 570 1390 690" stroke="rgba(193,207,235,.1)" stroke-width="4" fill="none"/>
      ${close}`
    };
    return svgs[key] || '';
  }

  let backgroundUiTimer = 0;

  function setBackgroundOnly(enabled) {
    if (enabled) setAppearanceOpen(false);
    const canShow = body.classList.contains('scene-active') && Boolean(backgroundSrcFor(currentGameSceneId || ''));
    const active = Boolean(enabled && canShow);
    window.clearTimeout(backgroundUiTimer);

    if (active) {
      if (restoreUiButton) restoreUiButton.hidden = false;
      body.classList.remove('background-restoring');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.classList.add('background-only');
        updateSceneFocusState();
        updateSceneScrollDepth();
        if (currentGameSceneId) scheduleAutonomousCamera(currentGameSceneId, true);
      }));
      if (adminGate && !adminGate.hidden) closeAdminGate();
      return;
    }

    if (!body.classList.contains('background-only')) {
      if (restoreUiButton) restoreUiButton.hidden = true;
      return;
    }

    body.classList.add('background-restoring');
    body.classList.remove('background-only');
    updateSceneFocusState();
    updateSceneScrollDepth();
    if (currentGameSceneId) scheduleAutonomousCamera(currentGameSceneId, true);
    backgroundUiTimer = window.setTimeout(() => {
      body.classList.remove('background-restoring');
      if (restoreUiButton) restoreUiButton.hidden = true;
    }, 720);
  }

  function stopSceneEffects() {
    stopClimateCycle();
    stopAutonomousCamera(false);
    stopSceneDrift(true);
    stopSceneRumble(true);
    cancelAnimationFrame(sceneMotionFrame);
    sceneMotionFrame = 0;
    cancelAnimationFrame(sceneEnterFrame);
    sceneEnterFrame = 0;
    clearTimeout(sceneEnterTimer);
    sceneEnterTimer = 0;
    for (const key of Object.keys(sceneMotion)) sceneMotion[key] = 0;
    updateSceneMotionVars();
    body.classList.remove('scene-entering');
    body.style.setProperty('--scene-scroll-y', '0px');
    body.style.setProperty('--scene-scroll-progress', '0');
  }

  function refreshSceneEffects() {
    const id = currentGameSceneId;
    stopSceneEffects();
    if (id) applyScene(id);
  }

  function clearScene() {
    stopSceneEffects();
    setBackgroundOnly(false);
    currentGameSceneId = null;
    stopClimateCycle();
    stopAutonomousCamera();
    stopSceneDrift(true);
    stopSceneRumble(true);
    body.classList.remove('scene-active', 'scene-entering', 'scene-cinematic');
    body.dataset.scene = 'default';
    body.dataset.ambientEffect = 'none';
    resetSceneMotion();
    updateSceneScrollDepth();
    if (backgroundViewButton) backgroundViewButton.hidden = true;
    if (sceneArt) sceneArt.innerHTML = '';
  }

  function applyScene(gameId) {
    stopSceneEffects();
    const photoSrc = backgroundSrcFor(gameId);
    const key = gameScenes[gameId] || (photoSrc ? 'custom' : '');
    currentGameSceneId = photoSrc ? gameId : null;
    if (!key) {
      clearScene();
      return;
    }

    body.classList.add('scene-active');
    body.dataset.scene = key;
    body.dataset.ambientEffect = mobilePerformance || !effectsMotionAllowed() ? 'none' : ambientEffectFor(gameId);
    applySceneDirection(gameId);
    updateSceneFocusState();

    if (backgroundViewButton) backgroundViewButton.hidden = !photoSrc;
    if (!sceneArt) return;

    // MÓVIL LITE:
    // una única imagen estática. Sin partículas, clima, luces, profundidad,
    // parallax, cámara, drift ni eventos.
    if (mobilePerformance || !effectsMotionAllowed()) {
      stopClimateCycle();
      stopAutonomousCamera(false);
      stopSceneDrift(true);
      stopSceneRumble(true);
      body.classList.remove('scene-entering', 'climate-event');
      body.dataset.climateState = 'normal';
      updateSceneScrollDepth();

      if (photoSrc) {
        sceneArt.innerHTML = `<div class="scene-background-motion"><img class="scene-photo" src="${esc(photoSrc)}" alt=""></div>`;
      } else {
        sceneArt.innerHTML = sceneSvg(key);
      }
      if (!mobilePerformance && window.MausEffects?.effective() === 'reduced') sceneArt.insertAdjacentHTML('beforeend', sceneLightHtml(gameId));
      return;
    }

    nudgeSceneEntrance();
    const lighting = sceneLightHtml(gameId);
    const ambient = ambientEffectHtml(gameId);
    const foreground = foregroundEffectHtml(gameId);
    const climateEvent = sceneEventHtml(gameId);
    const specialEffect = specialSceneEffectHtml(gameId);

    startClimateCycle(gameId);
    startSceneDrift(gameId);
    scheduleAutonomousCamera(gameId, true);
    startSceneRumble(gameId);
    updateSceneScrollDepth();

    if (photoSrc) {
      sceneArt.innerHTML = `<div class="scene-background-motion"><div class="scene-depth scene-depth-back" style="background-image:url('${esc(photoSrc)}')"></div><img class="scene-photo" src="${esc(photoSrc)}" alt=""><div class="scene-depth scene-depth-front" style="background-image:url('${esc(photoSrc)}')"></div></div>${lighting}${ambient}${foreground}${climateEvent}${specialEffect}`;
      return;
    }
    sceneArt.innerHTML = `${sceneSvg(key)}${lighting}${ambient}${foreground}${climateEvent}${specialEffect}`;
  }

  function presentationRows(catalog = presentationCatalog) {
    const ranked = rankedJourney(catalog);
    const rankById = new Map(ranked.map((game, index) => [game.id, index + 1]));
    return scale
      .map((row) => ({
        ...row,
        games: ranked
          .filter((game) => Number(game.score) === Number(row.score))
          .sort((a, b) => ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || a.title.localeCompare(b.title, 'es'))
          .map((game) => ({ ...game, globalRank: rankById.get(game.id) || 0 }))
      }))
      .filter((row) => row.games.length);
  }

  function renderPresentationMode(catalog = presentationCatalog) {
    if (!presentationMode || !presentationTiers || !presentationStats) return;
    presentationCatalog = normalizeCatalog(catalog);
    const ranked = rankedJourney(presentationCatalog);
    const rows = presentationRows(presentationCatalog);
    const topScore = ranked.length ? Math.max(...ranked.map((game) => Number(game.score))) : 0;
    const isOnline = presentationCatalog === 'online';

    const kicker = presentationMode.querySelector('.presentation-kicker');
    const title = presentationMode.querySelector('.presentation-title-block h1');
    const lead = presentationMode.querySelector('.presentation-title-block p');
    if (kicker) kicker.textContent = isOnline ? 'TIER LIST ONLINE · EDICIÓN DE MAUS' : 'TIER LIST OFFLINE · EDICIÓN DE MAUS';
    if (title) title.textContent = copy(isOnline ? 'onlinePresentationTitle' : 'offlinePresentationTitle');
    if (lead) lead.textContent = copy(isOnline ? 'onlinePresentationLead' : 'offlinePresentationLead');

    presentationMode.classList.toggle('presentation-online', isOnline);
    presentationStats.innerHTML = `
      <div><strong>${ranked.length}</strong><span>JUEGOS</span></div>
      <div><strong>${rows.length}</strong><span>TIERS OCUPADOS</span></div>
      <div><strong>${esc(topScore)}/10</strong><span>NOTA MÁS ALTA</span></div>`;
    presentationTiers.innerHTML = rows.length ? rows.map((row) => `
      <section class="presentation-tier" style="--tier:${esc(row.color)}">
        <div class="presentation-tier-label">
          <strong class="tier-font-${esc(row.tone)}">${esc(row.label)}</strong>
          <span>${esc(row.score)}/10</span>
        </div>
        <div class="presentation-tier-games">
          ${row.games.map((game) => {
            const cover = coverSrc(game);
            return `<button class="presentation-game" type="button" data-presentation-game="${esc(game.id)}" title="Abrir review de ${esc(game.title)}">
              <span class="presentation-rank">#${game.globalRank}</span>
              ${cover ? `<img src="${esc(cover)}" alt="Portada de ${esc(game.title)}">` : ''}
              <span class="presentation-game-copy"><strong>${esc(game.title)}</strong><small>${esc(game.score)}/10 · ${esc(row.label)}</small></span>
            </button>`;
          }).join('')}
        </div>
      </section>`).join('') : `<div class="presentation-empty">${isOnline ? 'Todavía no hay juegos online publicados.' : 'Todavía no hay juegos publicados.'}</div>`;
  }

  async function requestPresentationFullscreen() {
    if (!presentationMode || document.fullscreenElement) return;
    try {
      await presentationMode.requestFullscreen?.({ navigationUI: 'hide' });
    } catch (_) {
      try { await presentationMode.requestFullscreen?.(); } catch (_) {}
    }
  }

  async function openPresentationMode() {
    if (!presentationMode) return;
    setAppearanceOpen(false);
    setBackgroundOnly(false);
    closeThemeInfo();
    stopGameTheme(true);
    presentationCatalog = normalizeCatalog(body.dataset.catalog);
    renderPresentationMode(presentationCatalog);
    presentationMode.hidden = false;
    body.classList.add('presentation-active');
    requestAnimationFrame(() => presentationMode.classList.add('is-open'));
    await requestPresentationFullscreen();
  }

  async function closePresentationMode(options = {}) {
    if (!presentationMode || presentationMode.hidden) return;
    presentationMode.classList.remove('is-open');
    body.classList.remove('presentation-active');
    if (document.fullscreenElement === presentationMode) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    window.setTimeout(() => {
      if (!body.classList.contains('presentation-active')) presentationMode.hidden = true;
    }, 420);
    if (options.gameId) go(`game/${options.gameId}`);
  }

  function parseRoute() {
    const clean = (location.hash || '#tierlist').replace(/^#/, '');
    const parts = clean.split('/').filter(Boolean);
    return { section: parts[0] || 'tierlist', id: parts[1] || null };
  }

  function go(path) {
    const next = path.startsWith('#') ? path : `#${path}`;
    if (location.hash === next) renderRoute();
    else location.hash = next;
  }

  function updateNav(section, catalog = body.dataset.catalog || 'offline') {
    const normalized = normalizeCatalog(catalog);
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const nav = link.dataset.nav;
      let active = false;
      if (nav === 'offline') active = normalized === 'offline' && ['tierlist', 'game', 'ranking'].includes(section);
      else if (nav === 'online') active = normalized === 'online' && ['online', 'game', 'ranking'].includes(section);
      else if (nav === 'games') active = section === 'games';
      else if (nav === section) active = true;
      link.classList.toggle('is-active', active);
    });
  }

  function renderFallback(error) {
    console.error(error);
    stopGameTheme(true);
    clearScene();
    updateNav('tierlist', 'offline');
    app.innerHTML = `<div class="page"><section class="recovery-card"><span class="eyebrow">RECUPERACIÓN</span><h1>La vista no pudo cargarse.</h1><p>La aplicación ha evitado quedarse bloqueada. Puedes volver a la tier list y seguir usando la web.</p><button class="primary-button" type="button" data-go="tierlist">Volver a la tier list offline</button></section></div>`;
  }

  function renderRoute() {
    try {
      setAppearanceOpen(false);
      const route = parseRoute();
      clearScene();
      body.classList.toggle('music-space', route.section === 'music');
      if (themeInfoButton) themeInfoButton.textContent = route.section === 'music' ? 'Más información sobre esta pieza' : 'Información de la música';
      if (presentationModeButton) presentationModeButton.hidden = route.section === 'music';

      if (route.section === 'music') {
        renderMusicPage(route.id);
      } else if (route.section === 'game' && route.id && gameById.has(route.id)) {
        const catalog = normalizeCatalog(gameById.get(route.id)?._catalog);
        applyCatalogMode(catalog);
        updateNav('game', catalog);
        renderGame(route.id, false);
      } else if (route.section === 'ranking' && route.id && gameById.has(route.id)) {
        const catalog = normalizeCatalog(gameById.get(route.id)?._catalog);
        applyCatalogMode(catalog);
        updateNav('ranking', catalog);
        renderGame(route.id, true);
      } else if (route.section === 'games') {
        const catalog = normalizeCatalog(route.id);
        applyCatalogMode(catalog);
        updateNav('games', catalog);
        renderGames(catalog);
      } else if (route.section === 'online') {
        applyCatalogMode('online');
        updateNav('online', 'online');
        renderTierList('online');
      } else if (route.section === 'features') {
        applyCatalogMode('offline');
        updateNav('features', 'offline');
        renderFeatures();
      } else {
        if (route.section !== 'tierlist' || route.id) history.replaceState(null, '', '#tierlist');
        applyCatalogMode('offline');
        updateNav('tierlist', 'offline');
        renderTierList('offline');
      }

      // An embedded preview must never steal the editor's typing focus.
      if (app && !new URL(location.href).searchParams.has('preview')) app.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } catch (error) {
      renderFallback(error);
    }
  }

  function renderTierList(catalog = 'offline') {
    stopGameTheme(true);
    const normalized = normalizeCatalog(catalog);
    const isOnline = normalized === 'online';
    const ranked = visibleTierGames(normalized);
    const rows = scale.filter((row) => Number(row.score) >= 3);
    const topScore = ranked.length ? Math.max(...ranked.map((game) => Number(game.score))) : 0;

    const prefix = isOnline ? 'online' : 'offline';
    const title = textLines(copy(prefix+'Title'));
    const lead = textLines(copy(prefix+'Lead'));
    const eyebrow = esc(copy(prefix+'Eyebrow'));
    const pageClass = isOnline ? 'online-tier-page' : 'offline-tier-page';

    app.innerHTML = `<div class="page ${pageClass}">
      <div class="catalog-switch" aria-label="Elegir tier list">
        <button type="button" class="catalog-switch-button offline${!isOnline ? ' is-active' : ''}" data-go="tierlist"><span>${esc(copy('navOffline'))}</span><small>${esc(copy('offlineSwitch'))}</small></button>
        <button type="button" class="catalog-switch-button online${isOnline ? ' is-active' : ''}" data-go="online"><span>${esc(copy('navOnline'))}</span><small>${esc(copy('onlineSwitch'))}</small></button>
        <button type="button" class="catalog-switch-button music" data-go="music"><span>♫ ${esc(copy('navMusic'))}</span><small>${esc(copy('musicSwitch'))}</small></button>
      </div>
      <section class="tier-hero">
        <div>
          <span class="eyebrow">${eyebrow}</span>
          <h1 class="page-title">${title}</h1>
          <p class="page-lead">${lead}</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-start-ranking="${normalized}">${esc(copy('readRanking'))}</button>
            <button class="secondary-button" type="button" data-go="${catalogReviewsRoute(normalized)}">${esc(copy(isOnline ? 'onlineReviewsButton' : 'offlineReviewsButton'))}</button>
          </div>
          <p class="tour-explainer">${textLines(copy(prefix+'Note'))}</p>
        </div>
        <aside class="tier-hero-panel ${isOnline ? 'online-hero-panel' : ''}">
          ${copy(prefix+'HeroImage') ? '<img class="home-feature-image" src="'+esc(copy(prefix+'HeroImage'))+'" alt="">' : ''}
          <span class="catalog-hero-badge">${isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          <strong>${ranked.length} reviews</strong>
          <small>${esc(copy(prefix+'Stats'))}</small>
          <div class="hero-stat-grid"><div class="hero-stat"><b>${ranked.length ? `${esc(topScore)}/10` : '—'}</b><span>nota más alta</span></div><div class="hero-stat"><b>${new Set(ranked.map((game) => game.score)).size}</b><span>tiers ocupados</span></div></div>
        </aside>
      </section>
      ${isOnline && !ranked.length ? `<section class="online-empty-intro"><span>LISTA NUEVA</span><strong>La tier list online está preparada.</strong><p>Los juegos online se añaden desde el editor privado y quedan completamente separados de los juegos offline.</p></section>` : ''}
      <div class="tier-list">${rows.map((row) => {
        const tierGames = ranked.filter((game) => Number(game.score) === Number(row.score)).sort((a, b) => ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || a.title.localeCompare(b.title, 'es'));
        return `<section class="tier-row" style="--tier:${esc(row.color)}">
          <div class="tier-label"><strong class="tier-font-${esc(row.tone)}" ${editMode && !isOnline ? `contenteditable="true" spellcheck="true" data-edit-tier-score="${esc(row.score)}"` : ''}>${esc(row.label)}</strong><span>${esc(row.score)}</span></div>
          <div class="tier-games">${tierGames.length ? tierGames.map((game, index) => tierCard(game, index, row)).join('') : `<div class="tier-empty">${isOnline ? 'Sin juegos online todavía' : 'Sin juegos todavía'}</div>`}</div>
        </section>`;
      }).join('')}</div>
    </div>`;
  }

  function tierCard(game, index, row) {
    const cover = coverSrc(game);
    return `<button class="tier-card" type="button" data-open-game="${esc(game.id)}" style="--tier:${esc(row.color)}" aria-label="Abrir review de ${esc(game.title)}">
      ${cover ? `<img class="tier-cover" src="${esc(cover)}" alt="" loading="lazy">` : `<div class="tier-cover cover-fallback">${esc(game.title.slice(0, 1))}</div>`}
      <div class="tier-card-copy"><div class="tier-card-rank"><span>#${index + 1} EN EL TIER</span><span class="tier-card-score">${esc(game.score)}/10</span></div><h3>${esc(game.title)}</h3><p>${esc(preview(game.review, 115))}</p></div>
    </button>`;
  }

  function renderGames(catalog = 'offline') {
    stopGameTheme(true);
    const normalized = normalizeCatalog(catalog);
    const isOnline = normalized === 'online';
    const sorted = sortGames(gamesForCatalog(normalized));
    app.innerHTML = `<div class="page review-library-page${isOnline ? ' online-library-page' : ''}">
      <div class="catalog-switch compact" aria-label="Elegir biblioteca de reviews">
        <button type="button" class="catalog-switch-button offline${!isOnline ? ' is-active' : ''}" data-go="games/offline"><span>REVIEWS OFFLINE</span><small>${offlineGames.length} juegos</small></button>
        <button type="button" class="catalog-switch-button online${isOnline ? ' is-active' : ''}" data-go="games/online"><span>REVIEWS ONLINE</span><small>${onlineGames.length} juegos</small></button>
      </div>
      <div class="library-top"><div><span class="eyebrow">${isOnline ? 'REVIEWS · ONLINE' : 'REVIEWS · OFFLINE'}</span><h1 class="page-title">${textLines(copy(isOnline ? 'onlineReviewsTitle' : 'offlineReviewsTitle'))}</h1><p class="page-lead">${textLines(copy(isOnline ? 'onlineReviewsLead' : 'offlineReviewsLead'))}</p></div></div>
      <div class="library-toolbar"><label class="search-field"><input id="gameSearch" type="search" autocomplete="off" placeholder="${esc(copy('reviewSearch'))}"></label><span id="gameCount" class="library-count">${sorted.length} reviews</span></div>
      <div id="gameGrid" class="game-grid" data-catalog="${normalized}" style="margin-top:18px">${sorted.length ? sorted.map(gameCard).join('') : `<div class="library-empty-state"><strong>No hay reviews online todavía.</strong><span>Añádelas desde el editor privado.</span></div>`}</div>
    </div>`;
  }

  function renderFeatures() {
    stopGameTheme(true);
    app.innerHTML = '<div class="page features-page"><section class="features-hero"><div><span class="eyebrow">GUÍA DE LA WEB</span><h1 class="page-title">'+textLines(copy('featuresTitle'))+'</h1><p class="page-lead">'+textLines(copy('featuresLead'))+'</p></div></section><div class="features-grid">'+editorial.features.map((item,i)=>'<article class="feature-card"><span class="feature-index">'+String(i+1).padStart(2,'0')+'</span><h2>'+esc(item.title)+'</h2><p>'+textLines(item.text)+'</p><button type="button" data-go="'+esc(item.route||'tierlist')+'">'+esc(item.label||'Explorar')+' →</button></article>').join('')+'</div></div>';
  }

  function gameCard(game) {
    const tier = tierInfo(game.score);
    const cover = coverSrc(game);
    return `<article class="game-card" style="--tier:${esc(tier.color)}"><button type="button" data-open-game="${esc(game.id)}" aria-label="Abrir review de ${esc(game.title)}"><span class="card-arrow">↗</span>${cover ? `<img class="game-card-cover" src="${esc(cover)}" alt="" loading="lazy">` : `<div class="game-card-cover cover-fallback">${esc(game.title.slice(0, 1))}</div>`}<div class="game-card-content"><div class="game-score"><b>${esc(game.score)}</b><small>/10</small></div><span class="game-tier tier-font-${esc(tier.tone)}">${esc(tier.label)}</span><h3>${esc(game.title)}</h3><p>${esc(preview(game.review, 235))}</p></div></button></article>`;
  }

  function preloadSceneBackgrounds(ids) {
    ids.filter(Boolean).slice(0, 2).forEach((gameId) => {
      const src = backgroundSrcFor(gameId);
      if (!src) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }


  function renderGame(id, rankingMode) {
    const game = gameById.get(id);
    if (!game) {
      go('tierlist');
      return;
    }

    const catalog = normalizeCatalog(game._catalog);
    const isOnline = catalog === 'online';
    applyCatalogMode(catalog);
    applyScene(game.id);
    const tier = tierInfo(game.score);
    const inTier = visibleTierGames(catalog).filter((item) => Number(item.score) === Number(game.score)).sort((a, b) => ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || a.title.localeCompare(b.title, 'es'));
    const tierIndex = inTier.findIndex((item) => item.id === game.id);
    const tierPrev = tierIndex > 0 ? inTier[tierIndex - 1] : null;
    const tierNext = tierIndex >= 0 && tierIndex < inTier.length - 1 ? inTier[tierIndex + 1] : null;

    const journey = rankedJourney(catalog);
    const journeyIndex = journey.findIndex((item) => item.id === game.id);
    const journeyPrev = journeyIndex > 0 ? journey[journeyIndex - 1] : null;
    const journeyNext = journeyIndex >= 0 && journeyIndex < journey.length - 1 ? journey[journeyIndex + 1] : null;
    const themeTitle = themeLabelFor(game.id);
    preloadSceneBackgrounds([journeyPrev?.id, journeyNext?.id]);

    const reviewRead = reviewHtml(game.review, game.id);
    const reviewEditor = reviewEditorHtml(game.review, game.id);
    const hasSpoilers = Boolean(game.spoilers);
    const reviewDisplay = editMode
      ? reviewEditor
      : hasSpoilers
        ? `<details class="spoiler-review"><summary><span class="spoiler-open-label">⚠ Esta review contiene spoilers · abrir review</span><span class="spoiler-close-label">Cerrar review</span></summary>${reviewRead}</details>`
        : reviewRead;
    const scoreEditor = editMode ? `<select class="score-editor" data-edit-game="${esc(game.id)}" data-edit-field="score">${scale.map((row) => `<option value="${esc(row.score)}" ${Number(row.score) === Number(game.score) ? 'selected' : ''}>${esc(row.score)} · ${esc(row.label)}</option>`).join('')}</select>` : `<strong>${esc(game.score)}/10</strong>`;
    const titleDisplay = editMode ? `<input class="title-editor" data-edit-game="${esc(game.id)}" data-edit-field="title" value="${esc(game.title)}" aria-label="Título del juego">` : esc(game.title);
    const cover = coverSrc(game);

    app.innerHTML = `<div class="page game-page">
      <div class="detail-top"><button class="back-button" type="button" data-go="${catalogHome(catalog)}">← Volver a la tier list ${isOnline ? 'online' : 'offline'}</button><span class="eyebrow">${rankingMode ? `${isOnline ? 'ONLINE' : 'OFFLINE'} · RANKING · LECTURA EN ORDEN` : `${isOnline ? 'ONLINE' : 'OFFLINE'} · REVIEW PERSONAL`}</span></div>
      <section class="detail-hero" style="--tier:${esc(tier.color)}">
        ${cover ? `<img class="detail-cover" src="${esc(cover)}" alt="Portada de ${esc(game.title)}">` : ''}
        <div class="detail-hero-copy"><span class="eyebrow">${esc(tier.label)}</span><h1>${titleDisplay}</h1><div class="detail-scoreline"><span class="score-badge">${scoreEditor}</span><span class="tier-badge tier-font-${esc(tier.tone)}">${esc(tier.label)}</span>${themeTitle ? `<span class="music-badge">♫ ${esc(themeTitle)}</span>` : ''}</div></div>
      </section>
      <div class="detail-grid">
        <article class="review-card" style="--tier:${esc(tier.color)};--review-tier:${esc(tier.color)}"><div class="review-card-head"><div><span class="eyebrow">MI REVIEW</span><h2>Review</h2></div></div>${reviewDisplay}</article>
        <aside class="side-stack">
          <section class="side-card" style="--tier:${esc(tier.color)}"><h3>Nota actual</h3><div class="big-score">${esc(game.score)}<small>/10</small></div><strong class="side-tier tier-font-${esc(tier.tone)}">${esc(tier.label)}</strong></section>
          ${tierIndex >= 0 && (tierPrev || tierNext) ? `<section class="side-card"><h3>Dentro de este tier</h3><div class="rank-nav">${tierPrev ? `<button type="button" data-open-game="${esc(tierPrev.id)}"><small>← Por encima</small>${esc(tierPrev.title)}</button>` : ''}${tierNext ? `<button type="button" data-open-game="${esc(tierNext.id)}"><small>Por debajo →</small>${esc(tierNext.title)}</button>` : ''}</div></section>` : ''}
          ${rankingMode && journeyIndex >= 0 ? rankingPanel(journey, journeyIndex, journeyPrev, journeyNext, catalog) : ''}
          ${editMode ? themeEditor(game, themeTitle) : ''}
        </aside>
      </div>
      ${journeyIndex >= 0 ? reviewJourneyNav(journeyPrev, game, journeyNext, rankingMode) : ''}
    </div>`;

    void startGameTheme(game.id);
  }

  function reviewJourneyNav(previous, current, next, rankingMode) {
    const prevAttr = rankingMode ? 'data-ranking-open' : 'data-open-game';
    const nextAttr = rankingMode ? 'data-ranking-open' : 'data-open-game';
    return `<nav class="review-journey-nav" aria-label="Navegación entre reviews">
      <div class="review-journey-head"><span>SEGUIR RECORRIENDO</span><small>Ordenado según la tier list actual</small></div>
      <div class="review-journey-links">
        ${previous ? `<button class="journey-link journey-link-prev" type="button" ${prevAttr}="${esc(previous.id)}"><span>← ANTERIOR</span><strong>${esc(previous.title)}</strong><small>${esc(previous.score)}/10</small></button>` : `<span class="journey-edge">Estás en el primer juego del ranking.</span>`}
        <div class="journey-current"><small>AHORA</small><strong>${esc(current.title)}</strong></div>
        ${next ? `<button class="journey-link journey-link-next" type="button" ${nextAttr}="${esc(next.id)}"><span>SIGUIENTE →</span><strong>${esc(next.title)}</strong><small>${esc(next.score)}/10</small></button>` : `<span class="journey-edge journey-edge-end">Has llegado al final del ranking.</span>`}
      </div>
    </nav>`;
  }

  function rankingPanel(journey, index, previous, next, catalog = 'offline') {
    const percent = journey.length ? ((index + 1) / journey.length) * 100 : 0;
    return `<section class="side-card tour-card"><h3>Ranking completo</h3><div class="tour-position"><span>Posición global</span><strong>#${index + 1} de ${journey.length}</strong></div><div class="tour-progress"><i style="width:${percent}%"></i></div><p class="tour-help">Avanza por la lista completa, de mejor a peor.</p><div class="rank-nav">${previous ? `<button type="button" data-ranking-open="${esc(previous.id)}"><small>← Anterior</small>${esc(previous.title)}</button>` : ''}${next ? `<button type="button" data-ranking-open="${esc(next.id)}"><small>Siguiente →</small>${esc(next.title)}</button>` : `<button type="button" data-go="${catalogHome(catalog)}"><small>Fin del ranking</small>Volver a la tier list</button>`}</div><button class="tour-exit" type="button" data-go="${catalogHome(catalog)}">Terminar recorrido</button></section>`;
  }

  function themeEditor(game, currentTitle) {
    return `<section class="side-card theme-editor"><h3>Banda sonora de la ficha</h3><label class="theme-title-field"><span>Nombre del tema</span><input type="text" data-theme-title="${esc(game.id)}" value="${esc(currentTitle)}" placeholder="Ej. Save Room"></label><label class="theme-file-label">Elegir MP3<input type="file" accept="audio/*,.mp3" data-theme-file="${esc(game.id)}" hidden></label>${themeMeta[game.id] ? `<button class="theme-remove" type="button" data-theme-remove="${esc(game.id)}">Quitar tema personalizado</button>` : ''}<small>El MP3 se guarda localmente en este navegador.</small></section>`;
  }

  function renderSearchResults(query) {
    const grid = byId('gameGrid');
    const count = byId('gameCount');
    if (!grid || !count) return;
    const catalog = normalizeCatalog(grid.dataset.catalog || body.dataset.catalog);
    const sorted = sortGames(gamesForCatalog(catalog));
    const q = normalize(query);
    const filtered = q ? sorted.filter((game) => normalize(game.title).includes(q)) : sorted;
    grid.innerHTML = filtered.length ? filtered.map(gameCard).join('') : '<div class="empty-state">No encuentro ese juego.</div>';
    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'review' : 'reviews'}`;
  }

  async function resolveTheme(gameId) {
    try {
      const stored = await getStoredTheme(gameId);
      if (stored?.blob) {
        return { title: stored.title || themeMeta[gameId]?.title || 'Tema del juego', blob: stored.blob, signature: `custom:${gameId}:${stored.updatedAt || 0}` };
      }
    } catch (_) {}
    const built = musicConfigFor(gameId);
    if (built?.src) return { ...built, title: built.title || 'Tema del juego', src: built.src, signature: `built:${gameId}:${built.src}` };
    return null;
  }

  function cancelVolumeFade() {
    if (volumeFadeFrame) cancelAnimationFrame(volumeFadeFrame);
    volumeFadeFrame = 0;
  }

  function fadeAudioToTarget(duration = 3600) {
    cancelVolumeFade();
    const target = clamp(volume, 0, 1, .52);
    if (target <= 0) {
      audio.volume = 0;
      return;
    }
    const initial = Math.min(target, Math.max(.006, target * .045));
    audio.volume = initial;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, Math.max(0, (now - started) / duration));
      const eased = 1 - Math.pow(1 - progress, 2.2);
      audio.volume = initial + ((target - initial) * eased);
      if (progress < 1 && !audio.paused) volumeFadeFrame = requestAnimationFrame(tick);
      else volumeFadeFrame = 0;
    };
    volumeFadeFrame = requestAnimationFrame(tick);
  }

  function syncPlaybackUi() {
    const active = playbackIntent || !audio.paused;
    const label = active ? '❚❚ Pausar' : audioHasPlayed ? '▶ Reanudar' : '▶ Reproducir';
    if (mobileMusicToggleButton) {
      mobileMusicToggleButton.hidden = false;
      mobileMusicToggleButton.textContent = label;
      mobileMusicToggleButton.setAttribute('aria-label', active ? 'Pausar música' : audioHasPlayed ? 'Reanudar música' : 'Reproducir música');
      mobileMusicToggleButton.setAttribute('aria-pressed', String(active));
    }
    document.querySelectorAll('[data-music-play]').forEach(button => {
      button.textContent = label;
      button.setAttribute('aria-pressed', String(active));
    });
    body.classList.toggle('mobile-music-active', audioHasPlayed);
    body.classList.toggle('music-is-playing', !audio.paused);
  }

  function pauseCurrentTheme() {
    playbackIntent = false;
    playbackEpoch += 1;
    pendingAudioRetry = false;
    cancelVolumeFade();
    audio.pause();
    syncPlaybackUi();
  }

  async function playCurrentThemeWithFade(automatic = false) {
    if (!audio.getAttribute('src')) return false;
    const epoch = ++playbackEpoch;
    const request = themeRequestId;
    playbackIntent = true;
    pendingAudioRetry = false;
    audio.preload = 'metadata';
    syncPlaybackUi();
    try {
      audio.volume = Math.min(volume, Math.max(.006, volume * .045));
      await audio.play();
      if (epoch !== playbackEpoch || request !== themeRequestId) {
        if (!playbackIntent) audio.pause();
        return false;
      }
      fadeAudioToTarget(automatic ? 3600 : 600);
      audioHasPlayed = true;
      syncPlaybackUi();
      return true;
    } catch (_) {
      if (epoch !== playbackEpoch || request !== themeRequestId) return false;
      playbackIntent = false;
      pendingAudioRetry = automatic && !mobilePerformance;
      syncPlaybackUi();
      return false;
    }
  }

  function retryPendingAudio(event) {
    if (event?.target?.closest?.('#mobileMusicToggleButton,[data-music-play]')) return;
    if (!pendingAudioRetry || !audio.getAttribute('src') || !audio.paused) return;
    void playCurrentThemeWithFade(false);
  }

  function themeInfoFor(gameId) {
    const built = builtInMusic[gameId] && typeof builtInMusic[gameId] === 'object' ? builtInMusic[gameId] : {};
    const deep = musicDeepDive[gameId] && typeof musicDeepDive[gameId] === 'object' ? musicDeepDive[gameId] : {};
    const custom = gameById.get(gameId)?.music;
    const info = custom && typeof custom === 'object' ? { ...built, ...deep, ...custom } : { ...built, ...deep };
    return Object.keys(info).length ? info : null;
  }

  function infoSection(title, text) {
    if (!text) return '';
    return `<section class="theme-lore-section"><span>${esc(title)}</span><p>${esc(text)}</p></section>`;
  }

  function openThemeInfo() {
    if (!themeInfoModal || !themeInfoContent || !currentGameMusicId) return;
    const info = themeInfoFor(currentGameMusicId);
    if (!info) return;
    const game = gameById.get(currentGameMusicId);
    themeInfoContent.innerHTML = `
      <span class="eyebrow">BANDA SONORA</span>
      <h2 id="themeInfoHeading">${esc(info.title || 'Tema del juego')}</h2>
      <p class="theme-info-game">${esc(game?.title || '')}</p>
      <div class="theme-info-meta">
        ${info.composer ? `<span><small>CRÉDITOS</small>${esc(info.composer)}</span>` : ''}
        ${info.context ? `<span><small>CONTEXTO</small>${esc(info.context)}</span>` : ''}
      </div>
      ${info.thesis ? `<div class="theme-thesis"><small>LECTURA DEL TEMA</small><strong>${esc(info.thesis)}</strong></div>` : ''}
      <div class="theme-lore-grid">
        ${infoSection('Dónde suena', info.where)}
        ${infoSection('Cómo suena', info.sound)}
        ${infoSection('Qué representa', info.meaning)}
        ${infoSection('Qué hace sentir', info.feeling)}
        ${infoSection('Función e intención musical', info.intent)}
        ${infoSection('Cómo dialoga con el gameplay', info.gameplay)}
        ${infoSection('Detalle musical clave', info.craft)}
        ${infoSection('El contraste que crea', info.contrast)}
        ${infoSection('Por qué se queda en la memoria', info.memory)}
        ${infoSection('Por qué funciona', info.detail)}
      </div>
      <p class="theme-info-note">Las secciones de uso y créditos describen datos del juego y su banda sonora. Cuando no existe una declaración pública que fije la intención exacta del compositor, las secciones interpretativas explican la lectura narrativa y musical que se desprende de cómo se utiliza el tema.</p>`;
    themeInfoModal.hidden = false;
    body.classList.add('theme-info-open');
  }

  function closeThemeInfo() {
    if (!themeInfoModal) return;
    themeInfoModal.hidden = true;
    body.classList.remove('theme-info-open');
  }

  function clampMusicWidgetPosition(x, y) {
    if (!player) return { x: 0, y: 0 };
    const rect = player.getBoundingClientRect();
    const margin = 10;
    return {
      x: Math.max(margin, Math.min(window.innerWidth - rect.width - margin, x)),
      y: Math.max(margin, Math.min(window.innerHeight - rect.height - margin, y))
    };
  }

  function setMusicWidgetPosition(x, y, persist = false) {
    if (!player) return;
    const next = clampMusicWidgetPosition(x, y);
    player.style.left = `${Math.round(next.x)}px`;
    player.style.top = `${Math.round(next.y)}px`;
    player.style.right = 'auto';
    player.style.bottom = 'auto';
    if (persist) safeSet(localStore, MUSIC_WIDGET_POS_KEY, JSON.stringify(next));
  }

  function restoreMusicWidgetPosition() {
    if (!player) return;
    const saved = readJsonStorage(localStore, MUSIC_WIDGET_POS_KEY, null);
    if (saved && Number.isFinite(Number(saved.x)) && Number.isFinite(Number(saved.y))) {
      requestAnimationFrame(() => setMusicWidgetPosition(Number(saved.x), Number(saved.y), false));
    }
  }

  function startMusicDrag(event) {
    if (!player || event.button !== 0 || event.target.closest('input,button,a')) return;
    const rect = player.getBoundingClientRect();
    musicDrag = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    player.classList.add('is-dragging');
    try { player.setPointerCapture(event.pointerId); } catch (_) {}
    event.preventDefault();
  }

  function moveMusicDrag(event) {
    if (!musicDrag || event.pointerId !== musicDrag.pointerId) return;
    setMusicWidgetPosition(event.clientX - musicDrag.dx, event.clientY - musicDrag.dy, false);
  }

  function endMusicDrag(event) {
    if (!musicDrag || event.pointerId !== musicDrag.pointerId) return;
    const rect = player.getBoundingClientRect();
    setMusicWidgetPosition(rect.left, rect.top, true);
    player.classList.remove('is-dragging');
    musicDrag = null;
  }

  async function startGameTheme(gameId) {
    const requestId = ++themeRequestId;
    metadataCleanup?.();
    metadataCleanup = null;
    pauseCurrentTheme();
    const theme = await resolveTheme(gameId);
    if (requestId !== themeRequestId) return;
    if (!theme) { stopGameTheme(true); return; }
    const source = theme.blob ? URL.createObjectURL(theme.blob) : theme.src || '';
    if (!source) { stopGameTheme(true); return; }
    if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = theme.blob ? source : null;
    currentGameMusicId = gameId;
    currentThemeSignature = theme.signature;
    currentThemeStartAt = Math.max(0, Number(theme.startAt) || 0);
    audioHasPlayed = false;
    playbackIntent = !mobilePerformance && !new URL(location.href).searchParams.has('preview');
    audio.preload = mobilePerformance ? 'none' : 'metadata';
    audio.dataset.sceneGameId = gameById.get(gameId)?._sceneGameId || gameId;
    audio.src = source;
    audio.muted = false;
    if (playerSeek) playerSeek.value = '0';
    if (playerCurrentTime) playerCurrentTime.textContent = '0:00';
    if (playerDuration) playerDuration.textContent = '0:00';
    player.hidden = false;
    body.classList.add('player-visible');
    playerTitle.textContent = theme.title || 'Música del juego';
    playerGame.textContent = gameById.get(gameId)?.title || '';
    playerVolume.value = String(Math.round(volume * 100));
    restoreMusicWidgetPosition();
    syncPlaybackUi();
    const initialStart = currentThemeStartAt;
    const seek = () => {
      if (requestId !== themeRequestId) return;
      const duration = audio.duration;
      const at = Number.isFinite(duration) && duration > 0 ? Math.min(initialStart, Math.max(0, duration - .05)) : initialStart;
      try { audio.currentTime = at; } catch (_) {}
    };
    let settle;
    const ready = new Promise(resolve => { settle = resolve; });
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onReady);
      audio.removeEventListener('error', onError);
      if (metadataCleanup === cleanup) metadataCleanup = null;
      settle(false);
    };
    const onReady = () => { seek(); settle(true); cleanup(); };
    const onError = () => { settle(false); cleanup(); };
    metadataCleanup = cleanup;
    audio.addEventListener('loadedmetadata', onReady);
    audio.addEventListener('error', onError);
    if (mobilePerformance) return;
    audio.load();
    const loaded = await ready;
    if (!loaded || requestId !== themeRequestId || !playbackIntent) return;
    const played = await playCurrentThemeWithFade(true);
    if (!played && pendingAudioRetry) showSavedToast('Pulsa Reproducir para escuchar la música');
  }

  async function toggleMobileMusic() {
    if (!audio.getAttribute('src')) return;
    if (playbackIntent || !audio.paused) pauseCurrentTheme();
    else await playCurrentThemeWithFade(false);
  }

  function stopGameTheme(reset = true) {
    themeRequestId += 1;
    metadataCleanup?.();
    metadataCleanup = null;
    pauseCurrentTheme();
    audioHasPlayed = false;
    pendingAudioRetry = false;
    cancelVolumeFade();
    audio.pause();
    body.classList.remove('mobile-music-active');
    if (mobileMusicToggleButton) {
      mobileMusicToggleButton.hidden = true;
      mobileMusicToggleButton.textContent = '▶ Activar música';
      mobileMusicToggleButton.setAttribute('aria-pressed', 'false');
    }
    player.hidden = true;
    body.classList.remove('player-visible');
    closeThemeInfo();
    if (reset) {
      audio.removeAttribute('src');
      audio.load();
      currentGameMusicId = null;
      currentThemeSignature = '';
      playerTitle.textContent = '—';
      playerGame.textContent = '—';
      if (playerSeek) playerSeek.value = '0';
      if (playerCurrentTime) playerCurrentTime.textContent = '0:00';
      if (playerDuration) playerDuration.textContent = '0:00';
      if (activeObjectUrl) {
        URL.revokeObjectURL(activeObjectUrl);
        activeObjectUrl = null;
      }
    }
  }

  async function saveThemeFromInput(input) {
    const file = input.files?.[0];
    if (!file) return;
    const gameId = input.dataset.themeFile;
    const titleInput = app.querySelector(`[data-theme-title="${gameId}"]`);
    const filenameTitle = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    const title = String(titleInput?.value || filenameTitle || 'Tema del juego').trim();
    try {
      await saveStoredTheme(gameId, title, file);
      showSavedToast('Tema musical guardado');
      renderRoute();
    } catch (_) {
      showSavedToast('No se pudo guardar el MP3');
    }
  }

  function handleAppClick(event) {
    if (event.target.closest('[data-music-play]')) { void toggleMobileMusic(); return; }
    if (event.target.closest('[data-music-scroll]')) { event.preventDefault(); byId('musicCollection')?.scrollIntoView({behavior: window.MausEffects?.motionAllowed() ? 'smooth' : 'instant'}); return; }
    const reviewJump = event.target.closest('[data-review-jump]');
    if (reviewJump && app.contains(reviewJump)) {
      const target = document.getElementById(reviewJump.dataset.reviewJump);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const action = event.target.closest('[data-go],[data-open-game],[data-start-ranking],[data-ranking-open],[data-theme-remove]');
    if (!action || !app.contains(action)) return;

    if (action.dataset.go) {
      go(action.dataset.go);
      return;
    }
    if (action.dataset.openGame) {
      go(`game/${action.dataset.openGame}`);
      return;
    }
    if (action.hasAttribute('data-start-ranking')) {
      const catalog = normalizeCatalog(action.dataset.startRanking);
      const journey = rankedJourney(catalog);
      if (journey.length) go(`ranking/${journey[0].id}`);
      return;
    }
    if (action.dataset.rankingOpen) {
      go(`ranking/${action.dataset.rankingOpen}`);
      return;
    }
    if (action.dataset.themeRemove) {
      const gameId = action.dataset.themeRemove;
      void deleteStoredTheme(gameId).then(() => {
        showSavedToast('Tema eliminado');
        renderRoute();
      }).catch(() => showSavedToast('No se pudo eliminar el tema'));
    }
  }

  function handleAppInput(event) {
    if (event.target.id === 'musicSearch') { window.MausMusic.filter(editorial,event.target.value); return; }
    if (event.target.id === 'gameSearch') renderSearchResults(event.target.value);
  }

  function handleAppChange(event) {
    const target = event.target;
    if (target.matches('[data-edit-game][data-edit-field="score"]')) {
      if (saveGameField(target.dataset.editGame, 'score', target.value)) renderRoute();
      else showSavedToast('Esa nota no es válida');
      return;
    }
    if (target.matches('[data-theme-file]')) {
      void saveThemeFromInput(target);
    }
  }

  function handleAppBlur(event) {
    const target = event.target;
    if (target.matches('[data-edit-game][data-edit-field="title"]')) {
      if (!saveGameField(target.dataset.editGame, 'title', target.value)) {
        showSavedToast('El título no puede quedar vacío');
        renderRoute();
      }
      return;
    }
    if (target.matches('[data-review-edit-part][data-edit-game]')) {
      const gameId = target.dataset.editGame;
      const review = collectInlineReview(gameId);
      if (!saveGameField(gameId, 'review', review)) {
        showSavedToast('La review no puede quedar vacía');
        renderRoute();
      }
      return;
    }
    if (target.matches('[data-edit-game][data-edit-field="review"]')) {
      if (!saveGameField(target.dataset.editGame, 'review', target.value)) {
        showSavedToast('La review no puede quedar vacía');
        renderRoute();
      }
      return;
    }
    if (target.matches('[data-edit-tier-score]')) {
      if (!saveTierLabel(target.dataset.editTierScore, target.textContent)) renderRoute();
      return;
    }
    if (target.matches('[data-theme-title]')) {
      const gameId = target.dataset.themeTitle;
      const title = String(target.value || '').trim();
      if (!title || !themeMeta[gameId]) return;
      themeMeta[gameId].title = title;
      safeSet(localStore, THEME_META_KEY, JSON.stringify(themeMeta));
      void getStoredTheme(gameId).then((stored) => {
        if (stored?.blob) return saveStoredTheme(gameId, title, stored.blob);
      }).then(() => showSavedToast('Nombre del tema guardado')).catch(() => showSavedToast('No se pudo guardar el nombre'));
    }
  }

  function handleAppKeydown(event) {
    const target = event.target;
    if (target.matches('[data-edit-tier-score]') && event.key === 'Enter') {
      event.preventDefault();
      target.blur();
    }
  }

  function bindStaticEvents() {
    const lowPower = mobilePerformance || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    body.classList.toggle('low-power', Boolean(lowPower));
    window.addEventListener('scroll', () => {
      updateSceneScrollDepth();
    }, { passive: true });
    window.addEventListener('maus:effectschange', refreshSceneEffects);
    document.addEventListener('visibilitychange', () => {
      body.classList.toggle('page-hidden', document.hidden);
      if (document.hidden) stopSceneEffects();
      else refreshSceneEffects();
    });

    app.addEventListener('click', handleAppClick);
    app.addEventListener('input', handleAppInput);
    app.addEventListener('change', handleAppChange);
    app.addEventListener('focusout', handleAppBlur);
    app.addEventListener('keydown', handleAppKeydown);

    // Navegación de secciones: si no caben todas, la rueda del ratón
    // desplaza la banda horizontalmente. En móvil el swipe sigue siendo nativo.
    app.addEventListener('wheel', (event) => {
      const track = event.target.closest?.('.review-section-nav-track');
      if (!track || track.scrollWidth <= track.clientWidth + 1) return;

      const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

      if (!horizontalDelta) return;

      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const next = Math.min(maxScrollLeft, Math.max(0, track.scrollLeft + horizontalDelta));
      const canMove = Math.abs(next - track.scrollLeft) > 0.5;

      if (canMove) {
        event.preventDefault();
        track.scrollLeft = next;
      }
    }, { passive: false });

    if (playerSeek) {
      playerSeek.value = '0';
      playerSeek.addEventListener('input', () => {
        const duration = audio.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const next = (Number(playerSeek.value) / 1000) * duration;
        if (Number.isFinite(next)) audio.currentTime = Math.min(duration, Math.max(0, next));
      });
    }

    const syncMusicTimeline = () => {
      const duration = audio.duration;
      const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      if (playerCurrentTime) playerCurrentTime.textContent = formatTime(current);
      if (playerDuration) playerDuration.textContent = Number.isFinite(duration) && duration > 0 ? formatTime(duration) : '0:00';
      if (playerSeek) {
        const ratio = Number.isFinite(duration) && duration > 0 ? current / duration : 0;
        playerSeek.value = String(Math.round(Math.min(1, Math.max(0, ratio)) * 1000));
      }
    };
    audio.addEventListener('loadedmetadata', syncMusicTimeline);
    audio.addEventListener('durationchange', syncMusicTimeline);
    audio.addEventListener('timeupdate', syncMusicTimeline);
    audio.addEventListener('emptied', syncMusicTimeline);

    if (playerVolume) {
      playerVolume.value = String(Math.round(volume * 100));
      playerVolume.addEventListener('input', () => {
        cancelVolumeFade();
        volume = clamp(Number(playerVolume.value) / 100, 0, 1, .52);
        audio.muted = false;
        audio.volume = volume;
        safeSet(localStore, MUSIC_VOLUME_KEY, String(volume));
      });
    }

    mobileMusicToggleButton?.addEventListener('click', () => { void toggleMobileMusic(); });
    audio.addEventListener('playing', () => { audioHasPlayed = true; syncPlaybackUi(); });
    audio.addEventListener('pause', () => { body.classList.remove('music-is-playing'); syncPlaybackUi(); });
    audio.addEventListener('ended', () => { playbackIntent = false; syncPlaybackUi(); });
    themeInfoButton?.addEventListener('click', openThemeInfo);
    themeInfoClose?.addEventListener('click', closeThemeInfo);
    themeInfoModal?.addEventListener('click', (event) => { if (event.target === themeInfoModal) closeThemeInfo(); });

    player?.addEventListener('pointerdown', startMusicDrag);
    player?.addEventListener('pointermove', moveMusicDrag);
    player?.addEventListener('pointerup', endMusicDrag);
    player?.addEventListener('pointercancel', endMusicDrag);
    window.addEventListener('resize', () => {
      updateSceneScrollDepth();
      if (!player || player.hidden || player.style.left === '') return;
      const rect = player.getBoundingClientRect();
      setMusicWidgetPosition(rect.left, rect.top, false);
    });

    document.addEventListener('pointerdown', retryPendingAudio, { capture: true });
    document.addEventListener('keydown', retryPendingAudio, { capture: true });

    audio.addEventListener('error', () => {
      pauseCurrentTheme();
      metadataCleanup?.();
      if (!player.hidden) showSavedToast('No se pudo cargar este tema musical');
    });

    backgroundViewButton?.addEventListener('click', () => setBackgroundOnly(true));
    restoreUiButton?.addEventListener('click', () => setBackgroundOnly(false));

    appearanceButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      setAppearanceOpen(appearancePopover?.hidden !== false);
    });
    appearanceCloseButton?.addEventListener('click', () => setAppearanceOpen(false));
    appearancePopover?.addEventListener('click', (event) => {
      const option = event.target.closest('[data-ui-theme-choice]');
      if (!option) return;
      applyUiTheme(option.dataset.uiThemeChoice);
      setAppearanceOpen(false);
    });
    document.addEventListener('pointerdown', (event) => {
      if (!appearancePopover || appearancePopover.hidden) return;
      if (appearancePopover.contains(event.target) || appearanceButton?.contains(event.target)) return;
      setAppearanceOpen(false);
    });

    presentationModeButton?.addEventListener('click', () => { void openPresentationMode(); });
    presentationCloseButton?.addEventListener('click', () => { void closePresentationMode(); });
    presentationFullscreenButton?.addEventListener('click', () => { void requestPresentationFullscreen(); });
    presentationMode?.addEventListener('click', (event) => {
      const gameButton = event.target.closest('[data-presentation-game]');
      if (gameButton) void closePresentationMode({ gameId: gameButton.dataset.presentationGame });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (appearancePopover && !appearancePopover.hidden) { setAppearanceOpen(false); return; }
      if (body.classList.contains('presentation-active')) { void closePresentationMode(); return; }
      if (themeInfoModal && !themeInfoModal.hidden) { closeThemeInfo(); return; }
      if (body.classList.contains('background-only')) setBackgroundOnly(false);
    });
    window.addEventListener('storage', (event) => {
      if (event.key === UI_THEME_KEY) applyUiTheme(event.newValue || 'default', false);
    });

    editModeButton?.addEventListener('click', () => editMode ? exitEditMode() : openAdminGate());
    adminGateClose?.addEventListener('click', closeAdminGate);
    adminGate?.addEventListener('click', (event) => { if (event.target === adminGate) closeAdminGate(); });
    adminGateForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      adminGateError.textContent = '';
      const valid = await passwordMatches(adminPassword.value);
      if (!valid) {
        adminGateError.textContent = 'Contraseña incorrecta.';
        adminPassword.select();
        return;
      }
      editMode = true;
      safeSet(sessionStore, ADMIN_SESSION_KEY, 'true');
      closeAdminGate();
      updateEditUi();
      renderRoute();
    });
    exitEditButton?.addEventListener('click', exitEditMode);
    exportEditsButton?.addEventListener('click', exportEdits);
    importEditsButton?.addEventListener('click', () => importEditsInput?.click());
    importEditsInput?.addEventListener('change', () => {
      const file = importEditsInput.files?.[0];
      void importEditsFile(file);
      importEditsInput.value = '';
    });

    window.addEventListener('hashchange', renderRoute);
    window.addEventListener('beforeunload', () => {
      themeRequestId += 1;
      if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
    });
  }

  function validateInitialData() {
    const ids = new Set();
    for (const game of games) {
      if (!game?.id || ids.has(game.id)) throw new Error(`ID de juego inválido o duplicado: ${game?.id || 'vacío'}`);
      ids.add(game.id);
      if (!scale.some((row) => Number(row.score) === Number(game.score))) throw new Error(`La nota ${game.score} de ${game.title} no existe en la escala`);
    }
  }

  window.__MAUS_TEST__ = {
    effectsState: () => ({ scene: currentGameSceneId, drift: Boolean(sceneDriftFrame), camera: Boolean(autoCameraTimer), motion: Boolean(sceneMotionFrame), climate: Boolean(climateCycleTimer), enter: Boolean(sceneEnterFrame) }),
    getRoute: parseRoute,
    rankedIds: () => rankedJourney().map((game) => game.id),
    renderRoute,
    gameIds: () => games.map((game) => game.id),
    visibleIds: () => visibleTierGames().map((game) => game.id)
  };

  registerMusicEntries();
  applyEditorialSettings();
  window.addEventListener('message', event => {
    if (!new URL(location.href).searchParams.has('preview') || parent === window || event.source !== parent || event.origin !== location.origin || event.data?.type !== 'maus-editor-preview') return;
    editorial = window.MausContentModel.normalize(event.data.content);
    if (event.data.previewTrack) { const entry = editorial.tracks.find(t => t.id === event.data.previewTrack); if (entry) entry.published = true; }
    registerMusicEntries(); applyEditorialSettings(); renderRoute();
  });
  validateInitialData();
  applyUiTheme(uiTheme, false);
  bindStaticEvents();
  updateEditUi();
  if (!location.hash) history.replaceState(null, '', '#' + copy('homeRoute'));
  updateSceneMotionVars();
  updateSceneScrollDepth();
  renderRoute();
})();
