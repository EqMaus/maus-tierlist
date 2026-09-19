(function () {
  'use strict';

  const OWNER = 'EqMaus';
  const REPO = 'maus-tierlist';
  const BRANCH = 'main';
  const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
  const TOKEN_KEY = 'mausTierGithubAdminToken';
  const REMEMBER_KEY = 'mausTierGithubAdminRemember';
  const API_VERSION = '2022-11-28';
  const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
  const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

  const LEGACY_COVERS = {
    'gow1': 'assets/covers/gow1.png',
    'gow2': 'assets/covers/gow2.webp',
    'gow3': 'assets/covers/gow3.jpg',
    're3-og': 'assets/covers/re3-og.webp',
    'majoras-mask': 'assets/covers/majoras-mask.webp',
    'sotc': 'assets/covers/sotc.jpg',
    're9': 'assets/covers/re9.jpg',
    're2-og': 'assets/covers/re2-og.jpg',
    're4-og': 'assets/covers/re4-og.jpg',
    'medievil': 'assets/covers/medievil.webp',
    're3-remake': 'assets/covers/re3-remake.webp',
    're1-remaster': 'assets/covers/re1-remaster.webp',
    'pokemon-diamond': 'assets/covers/pokemon-diamond.webp',
    'pokemon-black': 'assets/covers/pokemon-black.webp',
    'twilight-princess': 'assets/covers/twilight-princess.jpg'
  };

  const LEGACY_BACKGROUNDS = {
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

  const LEGACY_MUSIC = {
    'gow2': { title: 'Battle of Perseus', src: 'assets/audio/gow2-battle-of-perseus.mp3' },
    'pokemon-diamond': { title: 'Lake', src: 'assets/audio/pokemon-diamond-lake.mp3' },
    'majoras-mask': { title: 'Final Hours', src: 'assets/audio/majoras-mask-final-hours.mp3' },
    'medievil': { title: 'Crypt & Graveyard', src: 'assets/audio/medievil-crypt-graveyard.mp3' },
    'gow3': { title: 'Melody of Pandora', src: 'assets/audio/gow3-melody-of-pandora.mp3' },
    'pokemon-black': { title: 'Route 10', src: 'assets/audio/pokemon-black-route-10.mp3' },
    're2-og': { title: 'Secure Place', src: 'assets/audio/re2-save-room.mp3' },
    're3-og': { title: 'Free From Fear', src: 'assets/audio/re3-og-free-from-fear.mp3' },
    're3-remake': { title: 'Save Room Theme', src: 'assets/audio/re3-remake-save-room.mp3' },
    're4-og': { title: 'Serenity', src: 'assets/audio/re4-serenity.mp3' },
    're9': { title: 'Respite', src: 'assets/audio/re9-save-room.mp3', startAt: 2 },
    're1-remaster': { title: 'Safe Heaven', src: 'assets/audio/re1-remaster-safe-heaven.mp3' },
    'sotc': { title: 'The Opened Way', src: 'assets/audio/sotc-the-opened-way.mp3', startAt: 5 },
    'twilight-princess': { title: 'Twilight', src: 'assets/audio/twilight-princess-twilight.mp3', startAt: 76 }
  };

  const $ = (id) => document.getElementById(id);
  const loginPanel = $('loginPanel');
  const editorPanel = $('editorPanel');
  const tokenInput = $('tokenInput');
  const connectButton = $('connectButton');
  const rememberSession = $('rememberSession');
  const logoutButton = $('logoutButton');
  const loginError = $('loginError');
  const connectionBadge = $('connectionBadge');
  const versionBadge = $('versionBadge');
  const gameCount = $('gameCount');
  const catalogOfflineButton = $('catalogOfflineButton');
  const catalogOnlineButton = $('catalogOnlineButton');
  const catalogOfflineCount = $('catalogOfflineCount');
  const catalogOnlineCount = $('catalogOnlineCount');
  const gameSearch = $('gameSearch');
  const gameList = $('gameList');
  const addGameButton = $('addGameButton');
  const gameForm = $('gameForm');
  const editorTitle = $('editorTitle');
  const editorSubtitle = $('editorSubtitle');
  const gameIdBadge = $('gameIdBadge');
  const newGameBadge = $('newGameBadge');
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
  const fieldAmbientEffect = $('fieldAmbientEffect');
  const fieldExcerpt = $('fieldExcerpt');
  const fieldReview = $('fieldReview');
  const reviewVisualEditor = $('reviewVisualEditor');
  const reviewFormatToolbar = $('reviewFormatToolbar');
  const addReviewSectionButton = $('addReviewSectionButton');
  const reviewEditModeButton = $('reviewEditModeButton');
  const reviewPreviewModeButton = $('reviewPreviewModeButton');
  const reviewPublicPreview = $('reviewPublicPreview');
  const reviewPreviewContent = $('reviewPreviewContent');
  const reviewPreviewViewport = $('reviewPreviewViewport');
  const reviewPreviewScene = $('reviewPreviewScene');
  const reviewPreviewAtmosphere = $('reviewPreviewAtmosphere');
  const reviewDesktopPreviewButton = $('reviewDesktopPreviewButton');
  const reviewMobilePreviewButton = $('reviewMobilePreviewButton');
  const reviewUndoButton = $('reviewUndoButton');
  const reviewRedoButton = $('reviewRedoButton');
  const reviewSplitButton = $('reviewSplitButton');
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

  const coverPreview = $('coverPreview');
  const coverPlaceholder = $('coverPlaceholder');
  const coverStatus = $('coverStatus');
  const coverFile = $('coverFile');
  const clearCoverButton = $('clearCoverButton');
  const backgroundPreview = $('backgroundPreview');
  const backgroundPlaceholder = $('backgroundPlaceholder');
  const backgroundStatus = $('backgroundStatus');
  const backgroundFile = $('backgroundFile');
  const clearBackgroundButton = $('clearBackgroundButton');
  const musicFile = $('musicFile');
  const musicFileName = $('musicFileName');
  const musicFileStatus = $('musicFileStatus');
  const musicPreview = $('musicPreview');
  const clearMusicButton = $('clearMusicButton');

  const musicFields = {
    title: $('fieldMusicTitle'),
    startAt: $('fieldMusicStart'),
    composer: $('fieldMusicComposer'),
    context: $('fieldMusicContext'),
    where: $('fieldMusicWhere'),
    sound: $('fieldMusicSound'),
    meaning: $('fieldMusicMeaning'),
    feeling: $('fieldMusicFeeling'),
    intent: $('fieldMusicIntent'),
    detail: $('fieldMusicDetail')
  };

  const newGameModal = $('newGameModal');
  const newGameTitle = $('newGameTitle');
  const newGameId = $('newGameId');
  const newGameError = $('newGameError');
  const cancelNewGameButton = $('cancelNewGameButton');
  const createNewGameButton = $('createNewGameButton');

  let token = '';
  let games = [];
  let activeCatalog = 'offline';
  let scale = [];
  let selectedId = '';
  let currentVersion = '';
  let baseSnapshot = '';
  let baseShas = { siteData: '', index: '', version: '' };
  let pendingFiles = {};
  let previewUrls = {};
  let newGameIds = new Set();
  let idEditedManually = false;
  let reviewViewMode = 'edit';
  let reviewPreviewDevice = 'desktop';
  let reviewFocusSnapshot = '';
  let reviewDragState = null;
  const reviewHistory = new Map();

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function slugify(value) {
    return normalize(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

const ADMIN_CURATED_REVIEW_SPECS = {
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

  function guessAdminSectionTitle(text, index, total) {
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

  function curatedAdminSections(gameId, value) {
    const spec = ADMIN_CURATED_REVIEW_SPECS[gameId];
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

  function automaticAdminSections(value) {
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
      const title = guessAdminSectionTitle(paragraph, index, working.length);
      const previous = groups[groups.length - 1];
      if (previous && previous.title === title) previous.paragraphs.push(paragraph);
      else groups.push({ title, paragraphs: [paragraph] });
    });
    const sections = groups.map((group) => ({ title: group.title, verdict: false, paragraphs: group.paragraphs }));
    if (verdict) sections.push({ title: 'Veredicto final', verdict: true, paragraphs: [verdict] });
    return sections;
  }

  function normalizeReviewSections(game) {
    if (Array.isArray(game?.reviewSections) && game.reviewSections.length) {
      return game.reviewSections.map((section, index) => {
        const verdict = Boolean(section?.verdict);
        let paragraphs = Array.isArray(section?.paragraphs)
          ? section.paragraphs.map((paragraph) => String(paragraph || '').trim()).filter(Boolean)
          : [];
        if (!paragraphs.length && section?.text) paragraphs = proseParagraphs(section.text);
        if (!paragraphs.length) paragraphs = [''];
        return {
          title: verdict ? 'Veredicto final' : String(section?.title || `Sección ${index + 1}`).trim(),
          verdict,
          paragraphs
        };
      });
    }

    const derived = curatedAdminSections(game?.id, game?.review) || automaticAdminSections(game?.review) || [];
    return derived.map((section, index) => ({
      title: section.verdict ? 'Veredicto final' : String(section.title || `Sección ${index + 1}`).trim(),
      verdict: Boolean(section.verdict),
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs : proseParagraphs(section.text)
    })).filter((section) => section.paragraphs.length);
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

  function sectionsToLegacyReview(sections) {
    if (window.MausReviewRenderer) return window.MausReviewRenderer.legacyText(sections);
    return sections.flatMap((section) => section.paragraphs || [])
      .map((paragraph) => String(paragraph || '').trim())
      .filter(Boolean)
      .join('\n\n')
      .trim();
  }

  function reviewSnapshot(game = selectedGame()) {
    return JSON.stringify(normalizeReviewSections(game));
  }

  function historyState(gameId) {
    if (!reviewHistory.has(gameId)) reviewHistory.set(gameId, { undo: [], redo: [] });
    return reviewHistory.get(gameId);
  }

  function pushReviewUndo(snapshot = reviewSnapshot()) {
    const game = selectedGame();
    if (!game || !snapshot) return;
    const history = historyState(game.id);
    if (history.undo[history.undo.length - 1] !== snapshot) history.undo.push(snapshot);
    if (history.undo.length > 60) history.undo.shift();
    history.redo = [];
    updateReviewHistoryButtons();
  }

  function restoreReviewSnapshot(snapshot) {
    const game = selectedGame();
    if (!game || !snapshot) return;
    const sections = JSON.parse(snapshot);
    game.reviewSections = sections;
    game.review = sectionsToLegacyReview(sections);
    fieldReview.value = game.review;
    renderVisualReviewEditor(game);
    renderReviewPreview(game);
    updateCounts();
    updateDirtyUi();
  }

  function undoReview() {
    const game = selectedGame();
    if (!game) return;
    const history = historyState(game.id);
    const current = reviewSnapshot(game);
    if (reviewFocusSnapshot && reviewFocusSnapshot !== current && history.undo[history.undo.length - 1] !== reviewFocusSnapshot) {
      history.undo.push(reviewFocusSnapshot);
      reviewFocusSnapshot = '';
    }
    const previous = history.undo.pop();
    if (!previous) return;
    history.redo.push(reviewSnapshot(game));
    restoreReviewSnapshot(previous);
    updateReviewHistoryButtons();
  }

  function redoReview() {
    const game = selectedGame();
    if (!game) return;
    const history = historyState(game.id);
    const next = history.redo.pop();
    if (!next) return;
    history.undo.push(reviewSnapshot(game));
    restoreReviewSnapshot(next);
    updateReviewHistoryButtons();
  }

  function updateReviewHistoryButtons() {
    const game = selectedGame();
    const history = game ? historyState(game.id) : { undo: [], redo: [] };
    if (reviewUndoButton) reviewUndoButton.disabled = !history.undo.length;
    if (reviewRedoButton) reviewRedoButton.disabled = !history.redo.length;
  }

  function reviewSectionMarkup(section, sectionIndex) {
    const verdict = Boolean(section.verdict);
    const paragraphs = section.paragraphs?.length ? section.paragraphs : [''];
    return `
      <article class="review-editor-section ${verdict ? 'review-verdict is-verdict' : 'review-section'}" data-review-section="${sectionIndex}">
        <div class="review-editor-section-controls">
          <button type="button" class="review-drag-handle section-drag-handle" data-review-drag-section="${sectionIndex}" draggable="true" title="Arrastrar sección">⋮⋮</button>
          <label class="review-section-title-field">
            <span>${verdict ? 'TIPO DE BLOQUE' : 'TÍTULO DEL BLOQUE'}</span>
            <input type="text" data-review-section-title value="${esc(verdict ? 'Veredicto final' : section.title)}" ${verdict ? 'readonly' : ''} aria-label="Título de la sección">
          </label>
          <label class="review-section-type-field">
            <span>FORMATO</span>
            <select data-review-section-type aria-label="Formato de la sección">
              <option value="normal"${verdict ? '' : ' selected'}>Bloque normal</option>
              <option value="verdict"${verdict ? ' selected' : ''}>Veredicto final</option>
            </select>
          </label>
          <div class="review-section-actions" aria-label="Acciones de la sección">
            <button type="button" data-review-section-move="up" title="Subir sección">↑</button>
            <button type="button" data-review-section-move="down" title="Bajar sección">↓</button>
            <button type="button" data-review-section-duplicate title="Duplicar sección">⧉</button>
            <button type="button" class="danger" data-review-section-delete title="Eliminar sección">×</button>
          </div>
        </div>
        <div class="review-editor-public-head review-section-head">${verdict ? 'VEREDICTO FINAL' : esc(section.title)}</div>
        <div class="review-editor-copy${verdict ? ' review-verdict-body' : ' review-copy'}">
          ${paragraphs.map((paragraph, paragraphIndex) => `
            <div class="review-paragraph-shell" data-review-paragraph-shell="${paragraphIndex}">
              <button type="button" class="review-drag-handle paragraph-drag-handle" data-review-drag-paragraph="${paragraphIndex}" draggable="true" title="Arrastrar párrafo">⋮⋮</button>
              <div class="review-editable-paragraph" contenteditable="true" spellcheck="true" data-review-paragraph="${paragraphIndex}" role="textbox" aria-multiline="true">${inlineMarkdown(paragraph).replace(/\n/g, '<br>')}</div>
              <div class="review-paragraph-actions">
                <button type="button" data-review-paragraph-move="up" title="Subir párrafo">↑</button>
                <button type="button" data-review-paragraph-move="down" title="Bajar párrafo">↓</button>
                <button type="button" data-review-paragraph-join title="Unir con el párrafo anterior" ${paragraphIndex === 0 ? 'disabled' : ''}>↥+</button>
                <button type="button" class="danger" data-review-paragraph-delete title="Eliminar párrafo">×</button>
              </div>
            </div>
          `).join('')}
        </div>
        <button type="button" class="review-add-paragraph" data-review-add-paragraph>＋ Añadir párrafo aquí</button>
      </article>`;
  }

  function renderReviewPreview(game = selectedGame()) {
    if (!reviewPreviewContent || !reviewPreviewScene) return;
    if (!game) {
      reviewPreviewContent.innerHTML = '<p class="review-editor-empty">Selecciona un juego.</p>';
      return;
    }
    const sections = normalizeReviewSections(game);
    const tier = tierForScore(game.score);
    const pending = pendingFiles[game.id] || {};
    const background = pending.background ? previewUrls[`${game.id}:background`] : legacyOrCustomBackground(game);
    reviewPreviewScene.style.setProperty('--tier', tier?.color || '#7aa7c6');
    reviewPreviewScene.style.setProperty('--review-tier', tier?.color || '#7aa7c6');
    reviewPreviewScene.style.setProperty('--preview-bg', background ? `url("${String(background).replace(/"/g, '%22')}")` : 'none');
    if (reviewPreviewAtmosphere) {
      const effect = String(game.ambientEffect || 'none');
      reviewPreviewAtmosphere.dataset.effect = effect;
      reviewPreviewAtmosphere.innerHTML = effect === 'none' ? '' : Array.from({ length: 24 }, () => '<i></i>').join('');
      reviewPreviewAtmosphere.querySelectorAll('i').forEach((particle, index) => {
        particle.style.setProperty('--x', `${(index * 37 + 9) % 101}%`);
        particle.style.setProperty('--y', `${(index * 53 + 17) % 101}%`);
        particle.style.setProperty('--s', `${2 + ((index * 7) % 8)}px`);
        particle.style.setProperty('--delay', `${-((index * 11) % 14)}s`);
        particle.style.setProperty('--d', `${7 + ((index * 5) % 12)}s`);
      });
    }
    reviewPreviewContent.innerHTML = window.MausReviewRenderer
      ? window.MausReviewRenderer.render(sections, { navigator: true, idPrefix: `admin-preview-${game.id}` })
      : '<p>No se pudo cargar el renderer compartido.</p>';
  }

  function setReviewViewMode(mode) {
    reviewViewMode = mode === 'preview' ? 'preview' : 'edit';
    const preview = reviewViewMode === 'preview';
    if (reviewVisualEditor) reviewVisualEditor.hidden = preview;
    if (reviewFormatToolbar) reviewFormatToolbar.hidden = preview;
    if (addReviewSectionButton) addReviewSectionButton.hidden = preview;
    if (reviewPublicPreview) reviewPublicPreview.hidden = !preview;
    reviewEditModeButton?.classList.toggle('is-active', !preview);
    reviewPreviewModeButton?.classList.toggle('is-active', preview);
    if (preview) renderReviewPreview();
  }

  function setReviewPreviewDevice(device) {
    reviewPreviewDevice = device === 'mobile' ? 'mobile' : 'desktop';
    reviewPreviewViewport?.classList.toggle('is-mobile', reviewPreviewDevice === 'mobile');
    reviewPreviewViewport?.classList.toggle('is-desktop', reviewPreviewDevice !== 'mobile');
    reviewDesktopPreviewButton?.classList.toggle('is-active', reviewPreviewDevice !== 'mobile');
    reviewMobilePreviewButton?.classList.toggle('is-active', reviewPreviewDevice === 'mobile');
  }

  function renderVisualReviewEditor(game = selectedGame()) {
    if (!reviewVisualEditor) return;
    if (!game) {
      reviewVisualEditor.innerHTML = '<p class="review-editor-empty">Selecciona un juego.</p>';
      return;
    }
    const sections = normalizeReviewSections(game);
    if (!sections.length) {
      reviewVisualEditor.innerHTML = '<div class="review-editor-empty"><strong>Esta review está vacía.</strong><button type="button" data-review-create-first>Crear primera sección</button></div>';
      return;
    }
    reviewVisualEditor.innerHTML = sections.map(reviewSectionMarkup).join('');
    renderReviewPreview(game);
    updateReviewHistoryButtons();
  }

  function collectVisualReviewSections() {
    if (!reviewVisualEditor) return [];
    return Array.from(reviewVisualEditor.querySelectorAll('[data-review-section]')).map((sectionElement, sectionIndex) => {
      const verdict = sectionElement.querySelector('[data-review-section-type]')?.value === 'verdict';
      const titleInput = sectionElement.querySelector('[data-review-section-title]');
      const title = verdict ? 'Veredicto final' : String(titleInput?.value || `Sección ${sectionIndex + 1}`).trim();
      const paragraphs = Array.from(sectionElement.querySelectorAll('[data-review-paragraph]'))
        .map(editableNodeToMarkdown)
        .filter((paragraph, index, list) => paragraph || list.length === 1);
      return { title: title || `Sección ${sectionIndex + 1}`, verdict, paragraphs: paragraphs.length ? paragraphs : [''] };
    });
  }

  function syncVisualReviewToGame() {
    const game = selectedGame();
    if (!game || !reviewVisualEditor) return;
    const sections = collectVisualReviewSections();
    game.reviewSections = sections;
    game.review = sectionsToLegacyReview(sections);
    fieldReview.value = game.review;
    renderReviewPreview(game);
    updateCounts();
    updateDirtyUi();
    clearNotice();
  }

  function focusReviewParagraph(sectionIndex, paragraphIndex, atEnd = true) {
    requestAnimationFrame(() => {
      const section = reviewVisualEditor?.querySelector(`[data-review-section="${sectionIndex}"]`);
      const paragraph = section?.querySelector(`[data-review-paragraph="${paragraphIndex}"]`);
      if (!paragraph) return;
      paragraph.focus();
      if (!atEnd) return;
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  }

  function mutateVisualSections(mutator, focusTarget = null) {
    const game = selectedGame();
    if (!game) return;
    pushReviewUndo(reviewSnapshot(game));
    const sections = collectVisualReviewSections();
    mutator(sections);
    game.reviewSections = sections;
    game.review = sectionsToLegacyReview(sections);
    fieldReview.value = game.review;
    renderVisualReviewEditor(game);
    updateCounts();
    updateDirtyUi();
    clearNotice();
    if (focusTarget) focusReviewParagraph(focusTarget.section, focusTarget.paragraph, focusTarget.end !== false);
  }

  let savedReviewRange = null;

  function rememberReviewSelection() {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const element = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    if (!element?.closest?.('[data-review-paragraph]')) return;
    savedReviewRange = range.cloneRange();
  }

  function applyReviewFormat(command) {
    if (!savedReviewRange) return;
    pushReviewUndo(reviewSnapshot());
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedReviewRange);
    if (command === 'bold') document.execCommand('bold', false);
    else if (command === 'italic') document.execCommand('italic', false);
    else if (command === 'remove') document.execCommand('removeFormat', false);
    rememberReviewSelection();
    syncVisualReviewToGame();
  }

  function fragmentToMarkdown(fragment) {
    const holder = document.createElement('div');
    holder.appendChild(fragment);
    return editableNodeToMarkdown(holder);
  }

  function splitSelectedParagraph() {
    if (!savedReviewRange || !savedReviewRange.collapsed) return;
    const element = savedReviewRange.startContainer.nodeType === Node.ELEMENT_NODE ? savedReviewRange.startContainer : savedReviewRange.startContainer.parentElement;
    const paragraph = element?.closest?.('[data-review-paragraph]');
    if (!paragraph) return;
    const sectionElement = paragraph.closest('[data-review-section]');
    const sectionIndex = Number(sectionElement?.dataset.reviewSection);
    const paragraphIndex = Number(paragraph.dataset.reviewParagraph);
    const beforeRange = document.createRange();
    beforeRange.selectNodeContents(paragraph);
    beforeRange.setEnd(savedReviewRange.startContainer, savedReviewRange.startOffset);
    const afterRange = document.createRange();
    afterRange.selectNodeContents(paragraph);
    afterRange.setStart(savedReviewRange.startContainer, savedReviewRange.startOffset);
    const before = fragmentToMarkdown(beforeRange.cloneContents());
    const after = fragmentToMarkdown(afterRange.cloneContents());
    mutateVisualSections((sections) => {
      const items = sections[sectionIndex]?.paragraphs;
      if (!items) return;
      items.splice(paragraphIndex, 1, before, after);
    }, { section: sectionIndex, paragraph: paragraphIndex + 1, end: false });
  }

  function currentSnapshot() {
    return JSON.stringify({ games, scale, editorial: contentEditor.snapshot() });
  }

  function hasPendingFiles() {
    return contentEditor.hasPendingFiles() || Object.values(pendingFiles).some((entry) => entry && (entry.cover || entry.background || entry.music));
  }

  function isDirty() {
    return (Boolean(baseSnapshot) && currentSnapshot() !== baseSnapshot) || hasPendingFiles();
  }

  function updateDirtyUi() {
    const dirty = isDirty();
    dirtyBadge.hidden = !dirty;
    discardButton.disabled = !dirty;
    publishButton.disabled = !dirty;
  }

  function setBusy(active, title = 'Publicando cambios…', text = 'No cierres esta pestaña.') {
    busyOverlay.hidden = !active;
    editorPanel.inert = active;
    loginPanel.inert = active;
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
    for (let i = 0; i < bytes.length; i += size) binary += String.fromCharCode(...bytes.subarray(i, i + size));
    return btoa(binary);
  }

  async function fileToBase64(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    const size = 0x8000;
    for (let i = 0; i < bytes.length; i += size) binary += String.fromCharCode(...bytes.subarray(i, i + size));
    return btoa(binary);
  }

  async function getFile(path, ref = BRANCH) {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    const data = await apiFetch(`${API}/contents/${encoded}?ref=${encodeURIComponent(ref)}&_=${Date.now()}`);
    if (!data || data.type !== 'file' || typeof data.content !== 'string') throw new Error(`No se pudo leer ${path}`);
    return { sha: data.sha, content: decodeBase64(data.content) };
  }

  // Prepare Git objects without changing the published branch.
  let publicationEntries = [];
  async function putBinaryFile(path, file) {
    const blob = await apiFetch(API + '/git/blobs', {
      method: 'POST', body: JSON.stringify({ content: await fileToBase64(file), encoding: 'base64' })
    });
    publicationEntries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  async function gitBlobSha(content) {
    const bytes = new TextEncoder().encode(content);
    const prefix = new TextEncoder().encode('blob ' + bytes.length + '\0');
    const input = new Uint8Array(prefix.length + bytes.length);
    input.set(prefix); input.set(bytes, prefix.length);
    return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', input)), b => b.toString(16).padStart(2, '0')).join('');
  }

  async function commitPublication(head, entries, message) {
    const parent = await apiFetch(API + '/git/commits/' + head);
    const tree = await apiFetch(API + '/git/trees', {
      method: 'POST', body: JSON.stringify({ base_tree: parent.tree.sha, tree: entries })
    });
    const commit = await apiFetch(API + '/git/commits', {
      method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [head] })
    });
    // A concurrent commit makes this non-fast-forward and GitHub rejects it.
    await apiFetch(API + '/git/refs/heads/' + BRANCH, {
      method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false })
    });
    return tree.tree;
  }

  function readDataArray(text, name, optional = false) {
    const marker = new RegExp('window\\.' + name + '\\s*=\\s*').exec(text);
    if (!marker) {
      if (optional) return [];
      throw new Error('Falta ' + name + ' en js/site-data.js.');
    }
    const start = marker.index + marker[0].length;
    if (text[start] !== '[') throw new Error('Se esperaba un array en ' + name);
    let depth = 0, quoted = false, escaped = false;
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (quoted) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') quoted = false;
      } else if (char === '"') quoted = true;
      else if (char === '[') depth++;
      else if (char === ']' && --depth === 0) return JSON.parse(text.slice(start, i + 1));
    }
    throw new Error('Array incompleto: ' + name);
  }

  function parseSiteData(source) {
    const text = String(source);
    const offline = readDataArray(text, 'MAUS_GAMES');
    const online = readDataArray(text, 'MAUS_ONLINE_GAMES', true);
    const parsedScale = readDataArray(text, 'MAUS_SCALE');

    if (!Array.isArray(offline) || !Array.isArray(online) || !Array.isArray(parsedScale)) {
      throw new Error('Los datos del sitio no tienen el formato esperado.');
    }

    const combined = [
      ...offline.map((game) => ({ ...game, _catalog: 'offline' })),
      ...online.map((game) => ({ ...game, _catalog: 'online' }))
    ];
    return { games: combined, scale: parsedScale };
  }

  function publicGameData(game) {
    const copy = clone(game);
    delete copy._catalog;
    return copy;
  }

  function serializeSiteData(nextGames, nextScale) {
    const offline = nextGames.filter((game) => game._catalog !== 'online').map(publicGameData);
    const online = nextGames.filter((game) => game._catalog === 'online').map(publicGameData);
    return `(function () {\n  'use strict';\n\n  window.MAUS_GAMES = ${JSON.stringify(offline, null, 2)};\n\n  window.MAUS_ONLINE_GAMES = ${JSON.stringify(online, null, 2)};\n\n  window.MAUS_SCALE = ${JSON.stringify(nextScale, null, 2)};\n})();\n`;
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

  function normalizeCatalog(value) {
    return value === 'online' ? 'online' : 'offline';
  }

  function gamesInCatalog(catalog = activeCatalog) {
    const normalized = normalizeCatalog(catalog);
    return games.filter((game) => normalizeCatalog(game._catalog) === normalized);
  }

  function sortedGames(catalog = activeCatalog) {
    return [...gamesInCatalog(catalog)].sort((a, b) => (b.score - a.score) || ((a.tierOrder ?? 999) - (b.tierOrder ?? 999)) || String(a.title).localeCompare(String(b.title), 'es'));
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
        <input type="color" data-tier-color="${index}" value="${esc(row.color)}" aria-label="Color del tier ${esc(row.score)}">
      </label>`).join('');
  }

  function renderCatalogControls() {
    const offlineCount = gamesInCatalog('offline').length;
    const onlineCount = gamesInCatalog('online').length;
    if (catalogOfflineCount) catalogOfflineCount.textContent = String(offlineCount);
    if (catalogOnlineCount) catalogOnlineCount.textContent = String(onlineCount);
    catalogOfflineButton?.classList.toggle('is-active', activeCatalog === 'offline');
    catalogOnlineButton?.classList.toggle('is-active', activeCatalog === 'online');
  }

  function renderGameList() {
    const query = normalize(gameSearch.value).trim();
    const catalogGames = sortedGames(activeCatalog);
    const filtered = catalogGames.filter((game) => !query || normalize(`${game.title} ${game.franchise} ${game.id}`).includes(query));
    gameCount.textContent = `${catalogGames.length} ${activeCatalog === 'online' ? 'online' : 'offline'}`;
    renderCatalogControls();
    gameList.innerHTML = filtered.map((game) => `
      <button class="game-list-button${game.id === selectedId ? ' active' : ''}" type="button" data-game-id="${esc(game.id)}" role="option" aria-selected="${game.id === selectedId ? 'true' : 'false'}">
        <span class="game-score">${esc(game.score)}</span>
        <span class="game-list-copy"><strong>${esc(game.title)}</strong><small>${esc(game.franchise || game.platform || '')}</small></span>
        ${newGameIds.has(game.id) ? '<span class="game-new-dot">NUEVO</span>' : `<span class="game-list-order">#${esc(game.tierOrder ?? '—')}</span>`}
      </button>`).join('');
  }

  function switchCatalog(catalog) {
    const next = normalizeCatalog(catalog);
    if (next === activeCatalog) return;
    activeCatalog = next;
    gameSearch.value = '';
    reviewFocusSnapshot = '';
    selectedId = sortedGames(activeCatalog)[0]?.id || '';
    renderGameList();
    renderSelectedGame();
    clearNotice();
  }

  function updateCounts() {
    excerptCount.textContent = `${fieldExcerpt.value.length} caracteres`;
    reviewCount.textContent = `${fieldReview.value.length} caracteres`;
  }

  function legacyOrCustomCover(game) {
    return game?.cover || LEGACY_COVERS[game?.id] || '';
  }

  function legacyOrCustomBackground(game) {
    return game?.background || LEGACY_BACKGROUNDS[game?.id] || '';
  }

  function musicForEditor(game) {
    return { ...(LEGACY_MUSIC[game?.id] || {}), ...(game?.music || {}) };
  }

  function revokePreview(key) {
    if (previewUrls[key]) {
      URL.revokeObjectURL(previewUrls[key]);
      delete previewUrls[key];
    }
  }

  function setImagePreview(img, placeholder, src) {
    if (src) {
      img.src = src;
      img.hidden = false;
      placeholder.hidden = true;
    } else {
      img.removeAttribute('src');
      img.hidden = true;
      placeholder.hidden = false;
    }
  }

  function renderMedia() {
    const game = selectedGame();
    if (!game) return;
    const pending = pendingFiles[game.id] || {};

    const coverSrc = pending.cover ? previewUrls[`${game.id}:cover`] : legacyOrCustomCover(game);
    setImagePreview(coverPreview, coverPlaceholder, coverSrc);
    coverStatus.textContent = pending.cover
      ? `${pending.cover.name} · ${(pending.cover.size / 1024 / 1024).toFixed(2)} MB · pendiente de publicar`
      : (legacyOrCustomCover(game) ? `Actual: ${legacyOrCustomCover(game)}` : 'Usa JPG, PNG, WEBP o AVIF.');
    clearCoverButton.hidden = !pending.cover;

    const backgroundSrc = pending.background ? previewUrls[`${game.id}:background`] : legacyOrCustomBackground(game);
    setImagePreview(backgroundPreview, backgroundPlaceholder, backgroundSrc);
    backgroundStatus.textContent = pending.background
      ? `${pending.background.name} · ${(pending.background.size / 1024 / 1024).toFixed(2)} MB · pendiente de publicar`
      : (legacyOrCustomBackground(game) ? `Actual: ${legacyOrCustomBackground(game)}` : 'Imagen horizontal recomendada.');
    clearBackgroundButton.hidden = !pending.background;

    const musicInfo = musicForEditor(game);
    if (pending.music) {
      musicFileName.textContent = pending.music.name;
      musicFileStatus.textContent = `${(pending.music.size / 1024 / 1024).toFixed(2)} MB · pendiente de publicar`;
      musicPreview.src = previewUrls[`${game.id}:music`] || '';
      musicPreview.hidden = false;
      clearMusicButton.hidden = false;
    } else {
      musicFileName.textContent = musicInfo.src ? (musicInfo.title || 'Tema actual') : 'Sin MP3 nuevo seleccionado';
      musicFileStatus.textContent = musicInfo.src ? `Actual: ${musicInfo.src}` : 'Puedes añadir un MP3 para esta ficha.';
      musicPreview.src = musicInfo.src || '';
      musicPreview.hidden = !musicInfo.src;
      clearMusicButton.hidden = true;
    }

    Object.entries(musicFields).forEach(([key, input]) => {
      const value = musicInfo[key];
      input.value = key === 'startAt' ? (Number.isFinite(Number(value)) ? String(Number(value)) : '') : (value || '');
    });
    renderReviewPreview(game);
  }

  function renderSelectedGame() {
    const game = selectedGame();
    const disabled = !game;
    Array.from(gameForm.elements).forEach((element) => { element.disabled = disabled; });
    if (!game) {
      editorTitle.textContent = 'Selecciona un juego';
      editorSubtitle.textContent = 'Los cambios no se publican hasta pulsar “Guardar y publicar”.';
      gameIdBadge.textContent = '—';
      newGameBadge.hidden = true;
      if (reviewVisualEditor) reviewVisualEditor.innerHTML = '<p class="review-editor-empty">Selecciona un juego.</p>';
      if (reviewPreviewContent) reviewPreviewContent.innerHTML = '<p class="review-editor-empty">Selecciona un juego.</p>';
      updateReviewHistoryButtons();
      return;
    }

    editorTitle.textContent = game.title;
    editorSubtitle.textContent = `${game._catalog === 'online' ? 'ONLINE' : 'OFFLINE'} · ${game.platform || 'Sin plataforma'} · ${game.year || 'Sin año'}`;
    gameIdBadge.textContent = game.id;
    newGameBadge.hidden = !newGameIds.has(game.id);
    fieldTitle.value = game.title || '';
    $('fieldCatalog').value = game._catalog || 'offline';
    fieldYear.value = game.year || '';
    fieldPlatform.value = game.platform || '';
    fieldFranchise.value = game.franchise || '';
    fieldScore.value = String(game.score);
    fieldLabel.value = tierForScore(game.score)?.label || game.label || '';
    fieldTierOrder.value = Number.isFinite(Number(game.tierOrder)) ? String(game.tierOrder) : '';
    fieldTierVisible.checked = game.tierVisible !== false;
    fieldReviewDate.value = game.reviewDate || '';
    fieldSpoilers.checked = Boolean(game.spoilers);
    fieldAmbientEffect.value = game.ambientEffect || 'none';
    fieldExcerpt.value = game.excerpt || '';
    fieldReview.value = game.review || '';
    renderVisualReviewEditor(game);
    renderReviewPreview(game);
    setReviewViewMode(reviewViewMode);
    setReviewPreviewDevice(reviewPreviewDevice);
    updateReviewHistoryButtons();
    updateCounts();
    renderMedia();
  }

  function selectGame(id) {
    if (!games.some((game) => game.id === id)) return;
    reviewFocusSnapshot = '';
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
    } else game[field] = target.value;

    if (field === '_catalog') activeCatalog = normalizeCatalog(game._catalog);
    editorTitle.textContent = game.title || game.id;
    editorSubtitle.textContent = `${game._catalog === 'online' ? 'ONLINE' : 'OFFLINE'} · ${game.platform || 'Sin plataforma'} · ${game.year || 'Sin año'}`;
    updateCounts();
    renderGameList();
    renderReviewPreview(game);
    updateDirtyUi();
    clearNotice();
  }

  function ensureMusicPatch(game) {
    if (!game.music || typeof game.music !== 'object') game.music = {};
    return game.music;
  }

  function syncMusicField(target) {
    const game = selectedGame();
    if (!game || !target.dataset.musicField) return;
    const field = target.dataset.musicField;
    const music = ensureMusicPatch(game);
    if (field === 'startAt') {
      const raw = target.value.trim();
      if (!raw) delete music.startAt;
      else music.startAt = Math.max(0, Number(raw) || 0);
    } else {
      const value = target.value;
      if (value.trim()) music[field] = value;
      else delete music[field];
    }
    if (!Object.keys(music).length) delete game.music;
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
    contentEditor.validate();
    const ids = new Set();
    for (const game of games) {
      if (!game.id || ids.has(game.id)) throw new Error(`ID inválido o duplicado: ${game.id || '(vacío)'}`);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.id)) throw new Error(`El ID ${game.id} solo puede usar minúsculas, números y guiones.`);
      ids.add(game.id);
      if (!String(game.title || '').trim()) throw new Error(`El juego ${game.id} no puede quedarse sin título.`);
      if (!tierForScore(game.score)) throw new Error(`La nota ${game.score} de ${game.title} no existe en la escala.`);
      if (game.music?.startAt !== undefined && (!Number.isFinite(Number(game.music.startAt)) || Number(game.music.startAt) < 0)) {
        throw new Error(`El segundo inicial de la música de ${game.title} no es válido.`);
      }
    }
    for (const row of scale) {
      if (!String(row.label || '').trim()) throw new Error(`El tier ${row.score} no puede quedarse sin nombre.`);
    }
  }

  function clearSavedToken() {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REMEMBER_KEY); } catch (_) {}
  }

  function saveAuthenticatedToken() {
    const remember = Boolean(rememberSession?.checked);
    try {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REMEMBER_KEY, 'true');
        sessionStorage.removeItem(TOKEN_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch (_) {}
  }

  async function authenticate(candidateToken) {
    token = String(candidateToken || '').trim();
    if (!token) throw new Error('Introduce un token de GitHub.');
    const user = await apiFetch('https://api.github.com/user');
    if (!user || String(user.login || '').toLowerCase() !== OWNER.toLowerCase()) throw new Error(`Este editor solo acepta la cuenta ${OWNER}.`);
    const repo = await apiFetch(API);
    if (!repo?.permissions?.push) throw new Error('La cuenta autenticada no tiene permiso de escritura en este repositorio.');
    saveAuthenticatedToken();
    return user;
  }

  function resetPendingFiles() {
    Object.keys(previewUrls).forEach(revokePreview);
    pendingFiles = {};
    previewUrls = {};
    coverFile.value = '';
    backgroundFile.value = '';
    musicFile.value = '';
  }

  async function getEditorialFile(ref = BRANCH) {
    try { return await getFile('js/content-data.js',ref); }
    catch(error) { if(error.status === 404) return { sha: '', content: window.MausContentModel.serialize(window.MausContentModel.defaults()) }; throw error; }
  }

  async function loadRemoteData() {
    setBusy(true, 'Cargando datos…', 'Leyendo la versión publicada desde GitHub.');
    try {
      const branch = await apiFetch(API + '/git/ref/heads/' + BRANCH);
      const head = branch.object.sha;
      const [siteDataFile, indexFile, versionFile, editorialFile] = await Promise.all([
        getFile('js/site-data.js',head), getFile('index.html',head), getFile('version.json',head), getEditorialFile(head)
      ]);
      const parsed = parseSiteData(siteDataFile.content);
      games = clone(parsed.games);
      scale = clone(parsed.scale);
      contentEditor.load(window.MausContentModel.parse(editorialFile.content));
      activeCatalog = 'offline';
      reviewHistory.clear();
      reviewFocusSnapshot = '';
      currentVersion = parseVersion(versionFile.content);
      baseShas = { siteData: siteDataFile.sha, index: indexFile.sha, version: versionFile.sha, editorial: editorialFile.sha };
      baseSnapshot = currentSnapshot();
      newGameIds = new Set();
      resetPendingFiles();
      selectedId = sortedGames(activeCatalog)[0]?.id || '';
      versionBadge.textContent = `v${currentVersion}`;
      renderScoreOptions();
      renderTierEditor();
      renderGameList();
      renderSelectedGame();
      contentEditor.refresh();
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
      clearSavedToken();
      loginError.textContent = error.message || 'No se pudo conectar con GitHub.';
      loginPanel.hidden = false;
      editorPanel.hidden = true;
    } finally {
      setBusy(false);
      connectButton.disabled = false;
    }
  }

  function logout() {
    contentEditor.reset();
    token = '';
    games = [];
    scale = [];
    activeCatalog = 'offline';
    selectedId = '';
    currentVersion = '';
    baseSnapshot = '';
    baseShas = { siteData: '', index: '', version: '' };
    newGameIds = new Set();
    resetPendingFiles();
    clearSavedToken();
    if (rememberSession) rememberSession.checked = false;
    tokenInput.value = '';
    connectionBadge.textContent = 'Sin conectar';
    connectionBadge.classList.remove('connected');
    logoutButton.hidden = true;
    editorPanel.hidden = true;
    loginPanel.hidden = false;
    clearNotice();
  }

  function imageExtension(file) {
    const type = String(file.type || '').toLowerCase();
    if (type === 'image/jpeg') return 'jpg';
    if (type === 'image/png') return 'png';
    if (type === 'image/webp') return 'webp';
    if (type === 'image/avif') return 'avif';
    const ext = String(file.name || '').split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : '';
  }

  function validateAssetFile(kind, file) {
    if (!file) return;
    if (kind === 'music') {
      if (file.size > MAX_AUDIO_BYTES) throw new Error('El MP3 supera 50 MB. Comprímelo antes de subirlo.');
      const isMp3 = file.type === 'audio/mpeg' || /\.mp3$/i.test(file.name);
      if (!isMp3) throw new Error('La música debe estar en formato MP3.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) throw new Error('La imagen supera 15 MB. Redúcela antes de subirla.');
    if (!imageExtension(file)) throw new Error('La imagen debe ser JPG, PNG, WEBP o AVIF.');
  }

  function stageFile(kind, file) {
    const game = selectedGame();
    if (!game || !file) return;
    try {
      validateAssetFile(kind, file);
    } catch (error) {
      showNotice(esc(error.message), true);
      return;
    }
    pendingFiles[game.id] ||= {};
    pendingFiles[game.id][kind] = file;
    const key = `${game.id}:${kind}`;
    revokePreview(key);
    previewUrls[key] = URL.createObjectURL(file);
    clearNotice();
    renderMedia();
    updateDirtyUi();
  }

  function unstageFile(kind) {
    const game = selectedGame();
    if (!game || !pendingFiles[game.id]?.[kind]) return;
    delete pendingFiles[game.id][kind];
    if (!Object.keys(pendingFiles[game.id]).length) delete pendingFiles[game.id];
    revokePreview(`${game.id}:${kind}`);
    if (kind === 'cover') coverFile.value = '';
    if (kind === 'background') backgroundFile.value = '';
    if (kind === 'music') musicFile.value = '';
    renderMedia();
    updateDirtyUi();
  }

  function versionSlug(version) {
    return String(version).replace(/[^0-9a-z]+/gi, '-');
  }

  async function uploadPendingAssets(publishGames, nextVersion) {
    const total = Object.values(pendingFiles).reduce((count, entry) => count + ['cover', 'background', 'music'].filter((kind) => entry?.[kind]).length, 0);
    if (!total) return;
    let done = 0;

    for (const [gameId, files] of Object.entries(pendingFiles)) {
      const game = publishGames.find((item) => item.id === gameId);
      if (!game) continue;
      const suffix = versionSlug(nextVersion);

      if (files.cover) {
        done += 1;
        busyText.textContent = `Subiendo portada ${done}/${total}: ${game.title}`;
        const path = `assets/covers/${game.id}-v${suffix}.${imageExtension(files.cover)}`;
        await putBinaryFile(path, files.cover, `Editor: portada de ${game.title} v${nextVersion}`);
        game.cover = path;
      }

      if (files.background) {
        done += 1;
        busyText.textContent = `Subiendo fondo ${done}/${total}: ${game.title}`;
        const path = `assets/backgrounds/${game.id}-bg-v${suffix}.${imageExtension(files.background)}`;
        await putBinaryFile(path, files.background, `Editor: fondo de ${game.title} v${nextVersion}`);
        game.background = path;
      }

      if (files.music) {
        done += 1;
        busyText.textContent = `Subiendo música ${done}/${total}: ${game.title}`;
        const path = `assets/audio/${game.id}-theme-v${suffix}.mp3`;
        await putBinaryFile(path, files.music, `Editor: música de ${game.title} v${nextVersion}`);
        game.music ||= {};
        game.music.src = path;
        if (!String(game.music.title || '').trim()) game.music.title = files.music.name.replace(/\.mp3$/i, '').replace(/[_-]+/g, ' ').trim() || 'Tema del juego';
      }
    }
  }

  async function publish() {
    if (!isDirty()) return;
    try {
      validateData();
      Object.values(pendingFiles).forEach((entry) => {
        if (entry.cover) validateAssetFile('cover', entry.cover);
        if (entry.background) validateAssetFile('background', entry.background);
        if (entry.music) validateAssetFile('music', entry.music);
      });
    } catch (error) {
      showNotice(esc(error.message), true);
      return;
    }

    publishButton.disabled = true;
    discardButton.disabled = true;
    clearNotice();
    setBusy(true, 'Publicando cambios…', 'Comprobando que nadie haya modificado los archivos desde que abriste el editor.');

    try {
      const branch = await apiFetch(API + '/git/ref/heads/' + BRANCH);
      const head = branch.object.sha;
      const [freshSiteData, freshIndex, freshVersion, freshEditorial] = await Promise.all([
        getFile('js/site-data.js', head), getFile('index.html', head), getFile('version.json', head), getEditorialFile(head)
      ]);
      publicationEntries = [];

      if (freshSiteData.sha !== baseShas.siteData || freshIndex.sha !== baseShas.index || freshVersion.sha !== baseShas.version || freshEditorial.sha !== baseShas.editorial) {
        throw new Error('El repositorio cambió desde que abriste el editor. Pulsa “Descartar” para recargar la versión actual y vuelve a aplicar tu cambio.');
      }

      const remoteVersion = parseVersion(freshVersion.content);
      const nextVersion = nextPatchVersion(remoteVersion);
      const publishGames = clone(games);
      publishGames.forEach((game) => {
        const structured = normalizeReviewSections(game);
        if (structured.length) {
          game.reviewSections = structured;
          game.review = sectionsToLegacyReview(structured);
        }
      });

      await uploadPendingAssets(publishGames, nextVersion);

      const publishEditorial = await contentEditor.prepare(nextVersion, (path,file) => putBinaryFile(path,file));
      const nextEditorial = window.MausContentModel.serialize(publishEditorial);
      const nextIndex = window.MausContentModel.applyHtml(bumpIndexVersion(freshIndex.content, remoteVersion, nextVersion),publishEditorial,nextVersion);
      const nextSiteData = serializeSiteData(publishGames, scale);
      const nextVersionJson = `${JSON.stringify({ version: nextVersion }, null, 2)}\n`;

      busyText.textContent = 'Publicando todos los cambios en un único commit…';
      const entries = [...publicationEntries,
        { path: 'index.html', mode: '100644', type: 'blob', content: nextIndex },
        { path: 'js/site-data.js', mode: '100644', type: 'blob', content: nextSiteData },
        { path: 'version.json', mode: '100644', type: 'blob', content: nextVersionJson },
        { path: 'js/content-data.js', mode: '100644', type: 'blob', content: nextEditorial }
      ];
      const nextShas = { siteData: await gitBlobSha(nextSiteData), index: await gitBlobSha(nextIndex), version: await gitBlobSha(nextVersionJson), editorial: await gitBlobSha(nextEditorial) };
      await commitPublication(head, entries, 'Editor: publica v' + nextVersion);
      games = publishGames;
      contentEditor.accept(publishEditorial);
      currentVersion = nextVersion;
      versionBadge.textContent = 'v' + currentVersion;
      baseShas = nextShas;

      baseSnapshot = currentSnapshot();
      newGameIds = new Set();
      resetPendingFiles();
      renderGameList();
      renderSelectedGame();
      contentEditor.refresh();
      updateDirtyUi();
      showNotice(`Publicado como <strong>v${esc(nextVersion)}</strong>. Los juegos, el archivo musical, las portadas de la web y los recursos se han guardado juntos. GitHub Pages puede tardar unos segundos en desplegarlo. <a href="./?v=${encodeURIComponent(nextVersion)}#tierlist" target="_blank" rel="noreferrer">Abrir la versión publicada ↗</a>`);
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

  function openNewGameModal() {
    newGameModal.hidden = false;
    newGameTitle.value = '';
    newGameId.value = '';
    newGameError.textContent = '';
    idEditedManually = false;
    requestAnimationFrame(() => newGameTitle.focus());
  }

  function closeNewGameModal() {
    newGameModal.hidden = true;
    newGameError.textContent = '';
  }

  function createNewGame() {
    const title = newGameTitle.value.trim();
    const id = newGameId.value.trim();
    if (!title) {
      newGameError.textContent = 'Escribe el nombre del juego.';
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      newGameError.textContent = 'El ID solo puede contener minúsculas, números y guiones.';
      return;
    }
    if (games.some((game) => game.id === id)) {
      newGameError.textContent = 'Ya existe un juego con ese ID.';
      return;
    }

    const defaultTier = scale.find((row) => Number(row.score) === 7) || scale[0];
    const score = Number(defaultTier?.score ?? 7);
    const order = Math.max(0, ...gamesInCatalog(activeCatalog).filter((game) => Number(game.score) === score).map((game) => Number(game.tierOrder) || 0)) + 1;
    const game = {
      _catalog: activeCatalog,
      id,
      title,
      year: '',
      platform: '',
      franchise: '',
      score,
      label: defaultTier?.label || 'Muy bueno',
      tierOrder: order,
      tierVisible: true,
      reviewDate: '',
      spoilers: false,
      ambientEffect: 'none',
      excerpt: '',
      review: '',
      reviewSections: []
    };
    games.push(game);
    newGameIds.add(id);
    selectedId = id;
    gameSearch.value = '';
    closeNewGameModal();
    renderGameList();
    renderSelectedGame();
    updateDirtyUi();
    showNotice('Borrador creado. Completa la ficha, añade los archivos que quieras y pulsa <strong>Guardar y publicar</strong>.');
  }

  const contentEditor = window.MausContentEditor.create({
    getGames: () => games,
    getGameMedia: game => ({ cover: legacyOrCustomCover(game), music: musicForEditor(game) }),
    onChange: updateDirtyUi,
    notice: (text,error) => showNotice(esc(text),error),
    onGamesView: renderSelectedGame
  });

  tierEditor.addEventListener('input', event => {
    if (event.target.dataset.tierColor === undefined) return;
    scale[Number(event.target.dataset.tierColor)].color = event.target.value;
    renderReviewPreview(); updateDirtyUi();
  });
  $('deleteGameButton').addEventListener('click', () => {
    const game = selectedGame();
    if (!game || !confirm('¿Eliminar «' + game.title + '»? Se aplicará cuando publiques. Los archivos del juego se conservarán.')) return;
    games = games.filter(item => item.id !== game.id);
    delete pendingFiles[game.id];
    Object.keys(previewUrls).filter(key => key.startsWith(game.id + ':')).forEach(revokePreview);
    contentEditor.removeGameReference(game.id);
    newGameIds.delete(game.id);
    selectedId = sortedGames(activeCatalog)[0]?.id || '';
    renderGameList(); renderSelectedGame(); updateDirtyUi();
  });
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
    if (event.target.matches('[data-music-field]')) syncMusicField(event.target);
  });
  gameForm.addEventListener('change', (event) => {
    if (event.target.matches('[data-field]')) syncFormField(event.target);
    if (event.target.matches('[data-music-field]')) syncMusicField(event.target);
  });

  let reviewFloatingToolbar = null;

  function ensureReviewFloatingToolbar() {
    if (reviewFloatingToolbar) return reviewFloatingToolbar;
    const element = document.createElement('div');
    element.className = 'review-floating-toolbar';
    element.hidden = true;
    element.innerHTML = '<button type="button" data-review-float-format="bold"><strong>B</strong></button><button type="button" data-review-float-format="italic"><em>I</em></button><button type="button" data-review-float-format="remove">Aa</button>';
    document.body.appendChild(element);
    element.addEventListener('mousedown', (event) => event.preventDefault());
    element.addEventListener('click', (event) => {
      const button = event.target.closest('[data-review-float-format]');
      if (!button) return;
      applyReviewFormat(button.dataset.reviewFloatFormat);
      positionReviewFloatingToolbar();
    });
    reviewFloatingToolbar = element;
    return element;
  }

  function positionReviewFloatingToolbar() {
    const toolbar = ensureReviewFloatingToolbar();
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      toolbar.hidden = true;
      return;
    }
    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    if (!node?.closest?.('[data-review-paragraph]')) {
      toolbar.hidden = true;
      return;
    }
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      toolbar.hidden = true;
      return;
    }
    toolbar.hidden = false;
    const width = toolbar.offsetWidth || 122;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left + (rect.width / 2) - (width / 2)));
    const top = Math.max(8, rect.top - 44);
    toolbar.style.left = `${left}px`;
    toolbar.style.top = `${top}px`;
  }

  function clearReviewDropTargets() {
    reviewVisualEditor?.querySelectorAll('.is-drop-target').forEach((element) => element.classList.remove('is-drop-target'));
  }

  reviewVisualEditor?.addEventListener('focusin', (event) => {
    reviewVisualEditor.querySelectorAll('.review-paragraph-shell.is-active').forEach((element) => element.classList.remove('is-active'));
    const shell = event.target.closest('.review-paragraph-shell');
    if (shell) shell.classList.add('is-active');
    reviewFocusSnapshot = reviewSnapshot();
    rememberReviewSelection();
  });

  reviewVisualEditor?.addEventListener('focusout', () => {
    const current = reviewSnapshot();
    if (reviewFocusSnapshot && reviewFocusSnapshot !== current) pushReviewUndo(reviewFocusSnapshot);
    reviewFocusSnapshot = '';
    window.setTimeout(() => {
      if (!reviewFloatingToolbar?.matches(':hover')) reviewFloatingToolbar && (reviewFloatingToolbar.hidden = true);
    }, 80);
  });

  reviewVisualEditor?.addEventListener('mouseup', () => {
    rememberReviewSelection();
    positionReviewFloatingToolbar();
  });
  reviewVisualEditor?.addEventListener('keyup', () => {
    rememberReviewSelection();
    positionReviewFloatingToolbar();
  });

  reviewVisualEditor?.addEventListener('input', (event) => {
    const section = event.target.closest('[data-review-section]');
    if (event.target.matches('[data-review-section-title]')) {
      const head = section?.querySelector('.review-editor-public-head');
      if (head) head.textContent = event.target.value || 'Nueva sección';
    }
    if (event.target.matches('[data-review-paragraph], [data-review-section-title]')) syncVisualReviewToGame();
  });

  reviewVisualEditor?.addEventListener('change', (event) => {
    if (!event.target.matches('[data-review-section-type]')) return;
    const sectionIndex = Number(event.target.closest('[data-review-section]')?.dataset.reviewSection);
    mutateVisualSections((sections) => {
      const section = sections[sectionIndex];
      if (!section) return;
      section.verdict = event.target.value === 'verdict';
      if (section.verdict) section.title = 'Veredicto final';
      else if (!section.title || section.title === 'Veredicto final') section.title = 'Nueva sección';
    });
  });

  reviewVisualEditor?.addEventListener('keydown', (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      rememberReviewSelection();
      applyReviewFormat('bold');
      return;
    }
    if (modifier && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      rememberReviewSelection();
      applyReviewFormat('italic');
      return;
    }
    if (modifier && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) redoReview(); else undoReview();
      return;
    }
    if (modifier && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      redoReview();
      return;
    }

    const paragraph = event.target.closest('[data-review-paragraph]');
    if (!paragraph || event.key !== 'Enter') return;
    if (event.shiftKey) return;
    event.preventDefault();
    const sectionElement = paragraph.closest('[data-review-section]');
    const sectionIndex = Number(sectionElement?.dataset.reviewSection);
    const paragraphIndex = Number(paragraph.dataset.reviewParagraph);
    syncVisualReviewToGame();
    mutateVisualSections((sections) => {
      const section = sections[sectionIndex];
      if (!section) return;
      section.paragraphs.splice(paragraphIndex + 1, 0, '');
    }, { section: sectionIndex, paragraph: paragraphIndex + 1 });
  });

  reviewVisualEditor?.addEventListener('dragstart', (event) => {
    const sectionHandle = event.target.closest('[data-review-drag-section]');
    const paragraphHandle = event.target.closest('[data-review-drag-paragraph]');
    if (sectionHandle) {
      reviewDragState = { type: 'section', fromSection: Number(sectionHandle.dataset.reviewDragSection) };
    } else if (paragraphHandle) {
      const section = paragraphHandle.closest('[data-review-section]');
      reviewDragState = { type: 'paragraph', fromSection: Number(section?.dataset.reviewSection), fromParagraph: Number(paragraphHandle.dataset.reviewDragParagraph) };
    } else {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', 'review-block');
  });

  reviewVisualEditor?.addEventListener('dragover', (event) => {
    if (!reviewDragState) return;
    const target = reviewDragState.type === 'section'
      ? event.target.closest('[data-review-section]')
      : event.target.closest('[data-review-paragraph-shell]');
    if (!target) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    clearReviewDropTargets();
    target.classList.add('is-drop-target');
  });

  reviewVisualEditor?.addEventListener('drop', (event) => {
    if (!reviewDragState) return;
    event.preventDefault();
    const drag = reviewDragState;
    reviewDragState = null;
    if (drag.type === 'section') {
      const target = event.target.closest('[data-review-section]');
      const toSection = Number(target?.dataset.reviewSection);
      clearReviewDropTargets();
      if (!Number.isFinite(toSection) || toSection === drag.fromSection) return;
      mutateVisualSections((sections) => {
        const [moved] = sections.splice(drag.fromSection, 1);
        let insertAt = toSection;
        if (drag.fromSection < toSection) insertAt -= 1;
        sections.splice(Math.max(0, insertAt), 0, moved);
      });
      return;
    }

    const targetParagraph = event.target.closest('[data-review-paragraph-shell]');
    const targetSection = targetParagraph?.closest('[data-review-section]');
    const toSection = Number(targetSection?.dataset.reviewSection);
    const toParagraph = Number(targetParagraph?.dataset.reviewParagraphShell);
    clearReviewDropTargets();
    if (!Number.isFinite(toSection) || !Number.isFinite(toParagraph)) return;
    mutateVisualSections((sections) => {
      const sourceItems = sections[drag.fromSection]?.paragraphs;
      const targetItems = sections[toSection]?.paragraphs;
      if (!sourceItems || !targetItems) return;
      const [moved] = sourceItems.splice(drag.fromParagraph, 1);
      let insertAt = toParagraph;
      if (drag.fromSection === toSection && drag.fromParagraph < toParagraph) insertAt -= 1;
      targetItems.splice(Math.max(0, insertAt), 0, moved);
      if (!sourceItems.length) sourceItems.push('');
    });
  });

  reviewVisualEditor?.addEventListener('dragend', () => {
    reviewDragState = null;
    clearReviewDropTargets();
  });

  reviewVisualEditor?.addEventListener('click', (event) => {
    if (event.target.closest('[data-review-create-first]')) {
      mutateVisualSections((sections) => sections.push({ title: 'Primera impresión', verdict: false, paragraphs: [''] }), { section: 0, paragraph: 0 });
      return;
    }
    const sectionElement = event.target.closest('[data-review-section]');
    if (!sectionElement) return;
    const sectionIndex = Number(sectionElement.dataset.reviewSection);

    if (event.target.closest('[data-review-add-paragraph]')) {
      const before = collectVisualReviewSections();
      const nextIndex = before[sectionIndex]?.paragraphs.length || 0;
      mutateVisualSections((sections) => sections[sectionIndex]?.paragraphs.push(''), { section: sectionIndex, paragraph: nextIndex });
      return;
    }

    const paragraphShell = event.target.closest('[data-review-paragraph-shell]');
    const paragraphIndex = Number(paragraphShell?.dataset.reviewParagraphShell);

    if (event.target.closest('[data-review-paragraph-move="up"]')) {
      if (!Number.isFinite(paragraphIndex) || paragraphIndex <= 0) return;
      mutateVisualSections((sections) => {
        const items = sections[sectionIndex]?.paragraphs;
        if (!items) return;
        [items[paragraphIndex - 1], items[paragraphIndex]] = [items[paragraphIndex], items[paragraphIndex - 1]];
      }, { section: sectionIndex, paragraph: paragraphIndex - 1 });
      return;
    }

    if (event.target.closest('[data-review-paragraph-move="down"]')) {
      mutateVisualSections((sections) => {
        const items = sections[sectionIndex]?.paragraphs;
        if (!items || paragraphIndex < 0 || paragraphIndex >= items.length - 1) return;
        [items[paragraphIndex + 1], items[paragraphIndex]] = [items[paragraphIndex], items[paragraphIndex + 1]];
      }, { section: sectionIndex, paragraph: paragraphIndex + 1 });
      return;
    }

    if (event.target.closest('[data-review-paragraph-join]')) {
      if (!Number.isFinite(paragraphIndex) || paragraphIndex <= 0) return;
      mutateVisualSections((sections) => {
        const items = sections[sectionIndex]?.paragraphs;
        if (!items) return;
        const joined = `${String(items[paragraphIndex - 1] || '').trim()} ${String(items[paragraphIndex] || '').trim()}`.trim();
        items.splice(paragraphIndex - 1, 2, joined);
      }, { section: sectionIndex, paragraph: paragraphIndex - 1 });
      return;
    }

    if (event.target.closest('[data-review-paragraph-delete]')) {
      mutateVisualSections((sections) => {
        const items = sections[sectionIndex]?.paragraphs;
        if (!items) return;
        if (items.length <= 1) items[0] = '';
        else items.splice(paragraphIndex, 1);
      });
      return;
    }

    if (event.target.closest('[data-review-section-move="up"]')) {
      if (sectionIndex <= 0) return;
      mutateVisualSections((sections) => {
        [sections[sectionIndex - 1], sections[sectionIndex]] = [sections[sectionIndex], sections[sectionIndex - 1]];
      });
      return;
    }

    if (event.target.closest('[data-review-section-move="down"]')) {
      mutateVisualSections((sections) => {
        if (sectionIndex >= sections.length - 1) return;
        [sections[sectionIndex + 1], sections[sectionIndex]] = [sections[sectionIndex], sections[sectionIndex + 1]];
      });
      return;
    }

    if (event.target.closest('[data-review-section-duplicate]')) {
      mutateVisualSections((sections) => {
        const source = sections[sectionIndex];
        if (!source) return;
        const copy = clone(source);
        if (!copy.verdict) copy.title = `${copy.title} (copia)`;
        sections.splice(sectionIndex + 1, 0, copy);
      });
      return;
    }

    if (event.target.closest('[data-review-section-delete]')) {
      if (!window.confirm('¿Eliminar esta sección de la review?')) return;
      mutateVisualSections((sections) => sections.splice(sectionIndex, 1));
    }
  });

  reviewFormatToolbar?.addEventListener('mousedown', (event) => {
    if (event.target.closest('button')) event.preventDefault();
  });
  reviewFormatToolbar?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-review-format]');
    if (button) applyReviewFormat(button.dataset.reviewFormat);
  });

  reviewUndoButton?.addEventListener('click', undoReview);
  reviewRedoButton?.addEventListener('click', redoReview);
  reviewSplitButton?.addEventListener('click', splitSelectedParagraph);

  reviewEditModeButton?.addEventListener('click', () => setReviewViewMode('edit'));
  reviewPreviewModeButton?.addEventListener('click', () => setReviewViewMode('preview'));
  reviewDesktopPreviewButton?.addEventListener('click', () => setReviewPreviewDevice('desktop'));
  reviewMobilePreviewButton?.addEventListener('click', () => setReviewPreviewDevice('mobile'));
  reviewPublicPreview?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-review-jump]');
    if (!button) return;
    const target = document.getElementById(button.dataset.reviewJump);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  addReviewSectionButton?.addEventListener('click', () => {
    const current = collectVisualReviewSections();
    mutateVisualSections((sections) => sections.push({ title: 'Nueva sección', verdict: false, paragraphs: [''] }), { section: current.length, paragraph: 0 });
  });

  coverFile.addEventListener('change', () => {
    const file = coverFile.files?.[0];
    if (file) stageFile('cover', file);
  });
  backgroundFile.addEventListener('change', () => {
    const file = backgroundFile.files?.[0];
    if (file) stageFile('background', file);
  });
  musicFile.addEventListener('change', () => {
    const file = musicFile.files?.[0];
    if (file) stageFile('music', file);
  });
  clearCoverButton.addEventListener('click', () => unstageFile('cover'));
  clearBackgroundButton.addEventListener('click', () => unstageFile('background'));
  clearMusicButton.addEventListener('click', () => unstageFile('music'));

  addGameButton.addEventListener('click', openNewGameModal);
  cancelNewGameButton.addEventListener('click', closeNewGameModal);
  createNewGameButton.addEventListener('click', createNewGame);
  newGameTitle.addEventListener('input', () => {
    if (!idEditedManually) newGameId.value = slugify(newGameTitle.value);
  });
  newGameId.addEventListener('input', () => {
    idEditedManually = true;
    const clean = slugify(newGameId.value);
    if (newGameId.value !== clean) newGameId.value = clean;
  });
  newGameTitle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); createNewGame(); }
  });
  newGameId.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); createNewGame(); }
  });
  newGameModal.addEventListener('click', (event) => {
    if (event.target === newGameModal) closeNewGameModal();
  });

  discardButton.addEventListener('click', () => void discard());
  catalogOfflineButton?.addEventListener('click', () => switchCatalog('offline'));
  catalogOnlineButton?.addEventListener('click', () => switchCatalog('online'));
  publishButton.addEventListener('click', () => void publish());
  window.addEventListener('beforeunload', (event) => {
    if (!isDirty()) return;
    event.preventDefault();
    event.returnValue = '';
  });
  window.addEventListener('unload', () => Object.keys(previewUrls).forEach(revokePreview));

  try {
    const remembered = localStorage.getItem(REMEMBER_KEY) === 'true';
    const savedToken = remembered ? localStorage.getItem(TOKEN_KEY) : sessionStorage.getItem(TOKEN_KEY);
    if (rememberSession) rememberSession.checked = remembered;
    if (savedToken) void connect(savedToken);
  } catch (_) {}
})();
