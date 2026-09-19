(function () {
  'use strict';
  const fields = [
    ['Identidad','brand','Nombre de la web','MAUS TIER LISTS'],
    ['Identidad','tagline','Subtítulo de la marca','offline · online · música'],
    ['Identidad','documentTitle','Título de la pestaña','Tier List de Maus'],
    ['Identidad','description','Descripción al compartir','Videojuegos, críticas y músicas que se quedan conmigo.','textarea'],
    ['Identidad','logo','Imagen de la marca','assets/brand/simba.jpg','asset'],
    ['Identidad','shareImage','Imagen al compartir','social-preview-v4.6.3.jpg','asset'],
    ['Navegación','homeRoute','Página inicial','tierlist','select',['tierlist','online','music']],
    ['Navegación','navOffline','Enlace offline','OFFLINE'],
    ['Navegación','navOnline','Enlace online','ONLINE'],
    ['Navegación','navMusic','Enlace musical','Resonancias'],
    ['Navegación','navReviews','Enlace a críticas','Reviews'],
    ['Navegación','navFeatures','Enlace a la guía','Features'],
    ['Navegación','navPresentation','Botón de presentación','Modo presentación'],
    ['Navegación','navAppearance','Botón de apariencia','Apariencia'],
    ['Portada offline','offlineEyebrow','Antetítulo','TIER LIST · OFFLINE'],
    ['Portada offline','offlineTitle','Título principal','Mi ranking offline,\ncon cada review detrás.','textarea'],
    ['Portada offline','offlineLead','Introducción','Campañas, aventuras y experiencias principalmente offline. Pulsa cualquier juego para abrir directamente su ficha.','textarea'],
    ['Portada offline','offlineNote','Nota bajo los botones','Dentro de un mismo tier, cuanto más a la izquierda está, más arriba lo tengo.','textarea'],
    ['Portada offline','offlineStats','Texto del resumen','ordenados según mi tier list offline actual'],
    ['Portada online','onlineEyebrow','Antetítulo','TIER LIST · ONLINE'],
    ['Portada online','onlineTitle','Título principal','Mi ranking online,\nseparado del resto.','textarea'],
    ['Portada online','onlineLead','Introducción','Aquí van únicamente juegos cuyo núcleo está en el multijugador, competitivo o cooperativo online. Su ranking es independiente del offline.','textarea'],
    ['Portada online','onlineNote','Nota bajo los botones','La posición de un juego online no afecta a su posición en la tier list offline.','textarea'],
    ['Portada online','onlineStats','Texto del resumen','ranking multijugador independiente'],
    ['Portadas y botones','readRanking','Botón para leer el ranking','▶ Leer ranking de arriba a abajo'],
    ['Portadas y botones','offlineReviewsButton','Botón de reviews offline','Ver reviews offline'],
    ['Portadas y botones','onlineReviewsButton','Botón de reviews online','Ver reviews online'],
    ['Portadas y botones','offlineSwitch','Descripción de offline','Campañas · single player'],
    ['Portadas y botones','onlineSwitch','Descripción de online','Competitivo · coop · multijugador'],
    ['Portadas y botones','musicSwitch','Descripción de la sección musical','Una colección para escuchar y leer'],
    ['Bibliotecas','offlineReviewsTitle','Título de reviews offline','Mis juegos offline.'],
    ['Bibliotecas','offlineReviewsLead','Introducción offline','Campañas y experiencias principalmente offline.','textarea'],
    ['Bibliotecas','onlineReviewsTitle','Título de reviews online','Mis juegos online.'],
    ['Bibliotecas','onlineReviewsLead','Introducción online','Biblioteca independiente para juegos multijugador y competitivos.','textarea'],
    ['Bibliotecas','reviewSearch','Texto del buscador','Buscar una review…'],
    ['Música: portada','musicEyebrow','Antetítulo','EL ARCHIVO SONORO DE MAUS'],
    ['Música: portada','musicTitle','Título de la colección','Resonancias'],
    ['Música: portada','musicSubtitle','Frase principal','Hay músicas que no se quedan en el juego.','textarea'],
    ['Música: portada','musicLead','Introducción','Un lugar para detenerme en las músicas de videojuegos que me encantan. Escucharlas, hablar de ellas y volver a lo que me hacen sentir.','textarea'],
    ['Música: portada','musicEmptyTitle','Título del catálogo vacío','La primera escucha está por llegar.'],
    ['Música: portada','musicEmptyText','Texto del catálogo vacío','Este archivo irá creciendo con mis músicas favoritas. Cada una tendrá su espacio, su historia y una escucha sin prisas.','textarea'],
    ['Música: portada','musicFooter','Firma del archivo','Una colección personal. Sin notas. Sin puestos. Solo música.'],
    ['Música: portada','musicSearch','Texto del buscador musical','Buscar música, juego o compositor…'],
    ['Presentación','offlinePresentationTitle','Título offline','Mi ranking de videojuegos offline'],
    ['Presentación','offlinePresentationLead','Introducción offline','Campañas, aventuras y experiencias principalmente offline.'],
    ['Presentación','onlinePresentationTitle','Título online','Mi ranking de videojuegos online'],
    ['Presentación','onlinePresentationLead','Introducción online','Experiencias multijugador, competitivas y cooperativas.'],
    ['Presentación','presentationFooter','Pie de presentación','Dentro de cada tier, el orden va de izquierda a derecha.'],
    ['Guía','featuresTitle','Título de la guía','Qué hay aquí y dónde tocar.'],
    ['Guía','featuresLead','Introducción','Una guía rápida para saber qué puedes explorar sin tener que descubrir cada función por accidente.','textarea'],
    ['Música: textos','musicKicker','Línea sobre el título','VIDEOJUEGOS / MÚSICA / MEMORIA'],
    ['Música: textos','musicExplore','Enlace a la colección','Explorar la colección'],
    ['Música: textos','musicShelf','Título de la colección','La colección'],
    ['Música: textos','musicFeatured','Etiqueta de ficha destacada','EN PRIMER PLANO'],
    ['Música: textos','musicEmptyArtLabel','Etiqueta del disco vacío','UNA ESCUCHA A LA VEZ'],
    ['Música: textos','musicEmptyArtText','Texto del disco vacío','El sonido también cuenta historias.'],
    ['Música: textos','musicListeningNotes','Título lateral de las fichas','NOTAS DE ESCUCHA'],
    ['Portada offline','offlineHeroImage','Imagen del resumen offline','','asset'],
    ['Portada online','onlineHeroImage','Imagen del resumen online','','asset'],
    ['Apariencia','defaultTheme','Paleta inicial','default','select',['default','black-red','blue-yellow']],
    ['Apariencia','accent','Acento de la web','#64dfb4','color'],
    ['Apariencia','maxWidth','Anchura de contenido (px)','1220','number'],
    ['Apariencia','musicPaper','Fondo de la sección musical','#eee7d9','color'],
    ['Apariencia','musicInk','Texto de la sección musical','#25231f','color'],
    ['Apariencia','musicAccent','Acento musical','#9b4225','color'],
    ['Apariencia','musicColumns','Columnas de fichas en escritorio','3','select',['2','3','4']]
  ];
  const defaults = () => ({ schema: 1, settings: Object.fromEntries(fields.map(([,key,,value])=>[key,value])), tracks: [], features: [
    {title:'Dos rankings, dos formas de jugar',text:'Offline y online tienen su propio ranking, sus reviews y su recorrido.',route:'tierlist',label:'Explorar los juegos'},
    {title:'Un archivo para la música',text:'Fichas dedicadas a músicas de videojuegos: escuchar, leer y descubrir sus detalles, sin puntuaciones.',route:'music',label:'Abrir el archivo sonoro'},
    {title:'Una escena para cada juego',text:'Fondos, ambiente y música acompañan las críticas. Desde Apariencia puedes elegir todos los efectos, ambiente reducido o un fondo sin efectos.',route:'games/offline',label:'Explorar las reviews'},
    {title:'Escucha a tu ritmo',text:'Pausa y reanuda sin perder la posición, ajusta el volumen o salta a otra parte de la canción. Los efectos musicales siguen el instante que estás escuchando.',route:'music',label:'Escuchar'},
    {title:'Presentación y fondo',text:'Modo presentación reúne las portadas del ranking. Ver fondo oculta la interfaz para disfrutar de la escena.',route:'tierlist',label:'Volver al ranking'}
  ] });
  function normalize(value) {
    const base=defaults();
    if(!value || typeof value!=='object' || Array.isArray(value)) return base;
    for(const [,key] of fields) if(typeof value.settings?.[key]==='string') base.settings[key]=value.settings[key];
    base.tracks=Array.isArray(value.tracks)?JSON.parse(JSON.stringify(value.tracks)):[];
    if(Array.isArray(value.features)) base.features=JSON.parse(JSON.stringify(value.features));
    return base;
  }
  function safeAsset(value, preview=false) {
    if(!value)return true;
    if(preview && /^blob:/.test(value))return true;
    return typeof value==='string' && /^(?:assets\/|social-preview-)[a-zA-Z0-9_./% ()áéíóúüñÁÉÍÓÚÜÑ-]+$/.test(value) && !value.split('/').includes('..');
  }
  function validate(data) {
    const ids=new Set();
    for(const track of data.tracks) {
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(track.id||'')||ids.has(track.id))throw Error('Cada ficha musical necesita un identificador único.');
      ids.add(track.id);
      if(!String(track.title||'').trim())throw Error('Hay una ficha musical sin título.');
      if(track.published && (!String(track.game||'').trim()||!track.audio))throw Error('Completa el videojuego y el MP3 antes de publicar «'+track.title+'».');
      if(!Number.isFinite(Number(track.startAt||0))||Number(track.startAt||0)<0)throw Error('El inicio de «'+track.title+'» debe ser un número positivo o cero.');
      for(const key of ['audio','cover','background'])if(!safeAsset(track[key]))throw Error('Recurso no válido en «'+track.title+'»: '+key);
      if(!Array.isArray(track.sections))throw Error('Las secciones musicales no tienen el formato esperado.');
    }
    for(const [,key,label,,type,options] of fields) {
      const value=data.settings[key];
      if(type==='color'&&!/^#[0-9a-f]{6}$/i.test(value))throw Error('Color no válido: '+label);
      if(type==='select'&&!options.includes(value))throw Error('Opción no válida: '+label);
      if(type==='asset'&&!safeAsset(value))throw Error('Imagen no válida: '+label);
    }
    if(+data.settings.maxWidth<960||+data.settings.maxWidth>1800||!Number.isFinite(+data.settings.maxWidth))throw Error('La anchura debe estar entre 960 y 1800 px.');
  }
  function parse(source) {
    const text=String(source).trim(), prefix='window.MAUS_CONTENT =';
    if(!text.startsWith(prefix)||!text.endsWith(';'))throw Error('No se pudo leer el contenido editorial.');
    return normalize(JSON.parse(text.slice(prefix.length,-1)));
  }
  function serialize(data) { return 'window.MAUS_CONTENT = '+JSON.stringify(data,null,2)+';\n'; }
  function applyHtml(html,data,version) {
    const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const settings=data.settings;
    let next=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(settings.documentTitle)+' — v'+version+'</title>');
    for(const [attribute,key,value] of [
      ['name','description',settings.description],['property','og:title',settings.documentTitle],
      ['property','og:description',settings.description],['name','twitter:title',settings.documentTitle],['name','twitter:description',settings.description],
      ...['og:image','og:image:url','og:image:secure_url'].map(key=>['property',key,new URL(settings.shareImage||'social-preview-v4.6.3.jpg','https://eqmaus.github.io/maus-tierlist/').href]),
      ['name','twitter:image',new URL(settings.shareImage||'social-preview-v4.6.3.jpg','https://eqmaus.github.io/maus-tierlist/').href]
    ])next=next.replace(new RegExp('(<meta '+attribute+'="'+key+'" content=")[^"]*("[^>]*>)'),(_,a,b)=>a+esc(value)+b);
    // Uploaded images may have a different size and format from the legacy preview.
    next=next.replace(/\s*<meta property="og:image:(?:type|width|height)"[^>]*>/g,'');
    next=next.replace(/(<link rel="image_src" href=")[^"]*(")/,(_,a,b)=>a+esc(new URL(settings.shareImage||'social-preview-v4.6.3.jpg','https://eqmaus.github.io/maus-tierlist/').href)+b);
    return next;
  }
  window.MausContentModel={fields,defaults,normalize,validate,parse,serialize,safeAsset,applyHtml};
})();
