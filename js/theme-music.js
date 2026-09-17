(function () {
  'use strict';

  // Un tema público por ficha. Los MP3 viven en assets/audio/ para funcionar también online.
  // Los campos de contexto separan hechos de uso/créditos de la lectura musical editorial.
  window.MAUS_GAME_MUSIC = {
    'gow2': {
      title: 'Battle of Perseus', src: 'assets/audio/gow2-battle-of-perseus.mp3',
      composer: 'Cris Velasco',
      context: 'Combate contra Perseo en God of War II.',
      where: 'Acompaña el duelo con Perseo, uno de los encuentros mitológicos de la Isla de la Creación. La pelea juega con su invisibilidad, el reflejo del agua y la necesidad de localizarlo antes de responder.',
      sound: 'Percusión agresiva, metales y masas orquestales empujan el tema hacia delante. No busca reposo: trabaja por oleadas, con ataques musicales cortos y una sensación de persecución constante.',
      meaning: 'Musicalmente convierte el enfrentamiento en un choque entre dos héroes griegos que han terminado en lados opuestos. Perseo no se presenta como un enemigo cualquiera, sino como otra figura legendaria atravesada por la obsesión y el destino.',
      feeling: 'Tiene una energía de duelo personal: tensión, orgullo y violencia controlada. Funciona especialmente bien porque el ritmo no deja que el combate pierda presencia aunque Perseo desaparezca de la vista.',
      intent: 'La función observable del tema es mantener a Perseo “presente” incluso cuando el jugador no puede verlo. La música llena ese vacío visual y hace que la invisibilidad no reduzca la intensidad del combate, sino que la aumente.',
      detail: 'Es una elección muy representativa de God of War II: épica mitológica, percusión enorme y una sensación de que cada rival importante forma parte de una tragedia más grande que el propio combate.'
    },
    'pokemon-diamond': {
      title: 'Lake', src: 'assets/audio/pokemon-diamond-lake.mp3',
      composer: 'Equipo de sonido de GAME FREAK — créditos de Sinnoh',
      context: 'Tema asociado a los grandes lagos de Sinnoh.',
      where: 'Está ligado al imaginario de los lagos Veraz, Valor y Agudeza, lugares conectados con Mesprit, Azelf y Uxie. Los tres lagos forman parte del núcleo mitológico de Sinnoh y terminan relacionados con el conflicto del Equipo Galaxia.',
      sound: 'Es una pieza lenta y contemplativa, con una melodía muy clara y espacio entre frases. La instrumentación de Nintendo DS es sencilla, pero precisamente esa limpieza hace que el tema parezca antiguo, tranquilo y ligeramente misterioso.',
      meaning: 'Los lagos no son simples zonas naturales: representan emoción, voluntad y conocimiento a través de sus guardianes. El tema ayuda a que esos lugares se sientan separados del resto de rutas, casi como pequeños santuarios.',
      feeling: 'Transmite calma, nostalgia y una sensación de misterio que nunca llega a convertirse en amenaza. Es de esas músicas que hacen que un lugar aparentemente vacío parezca tener historia detrás.',
      intent: 'No hay una declaración pública que fije una lectura única de esta pieza. Por su uso, la música funciona como pausa contemplativa y como señal de que estamos entrando en espacios vinculados a la mitología de creación de Sinnoh.',
      detail: 'La gracia está en el contraste: Pokémon Diamante puede ser muy mecánico y repetitivo en su ritmo, pero este tema detiene la aventura y da a Sinnoh una identidad más fría, silenciosa y casi sagrada.'
    },
    'majoras-mask': {
      title: 'Final Hours', src: 'assets/audio/majoras-mask-final-hours.mp3',
      composer: 'Kōji Kondō',
      context: 'Las últimas horas antes de la caída de la Luna.',
      where: 'Suena después de medianoche en el último día, cuando comienza la cuenta atrás definitiva antes del impacto de la Luna. En ese momento Clock Town ya está prácticamente vacía y el juego deja de fingir que todavía queda tiempo de sobra.',
      sound: 'La pieza es lenta, pesada y deliberadamente repetitiva. Los acordes parecen suspendidos mientras campanadas, vibraciones y el propio diseño sonoro del mundo hacen que cada segundo pese más que el anterior.',
      meaning: 'No representa una batalla ni un villano: representa el final inevitable. Majora’s Mask convierte el tiempo en una mecánica y este tema convierte esa mecánica en emoción, haciendo audible la idea de que el mundo está a punto de terminar.',
      feeling: 'Produce resignación más que adrenalina. Hay tristeza, vacío y una calma incómoda, como si Termina ya hubiese aceptado algo que el jugador todavía intenta impedir.',
      intent: 'La función musical es quitar al jugador cualquier sensación de aventura despreocupada. El reloj sigue corriendo, pero la música deja de empujarte heroicamente: te obliga a sentir el peso de lo que está a punto de ocurrir.',
      detail: 'Es uno de los mejores ejemplos de música, narrativa y sistema trabajando juntos. Si se escucha fuera del juego es melancólica; dentro de la cuenta atrás, cada repetición adquiere otro significado.'
    },
    'medievil': {
      title: 'Crypt & Graveyard', src: 'assets/audio/medievil-crypt-graveyard.mp3',
      composer: 'Andrew Barnabas y Paul Arnold (Bob & Barn)',
      context: 'Criptas y cementerios de Gallowmere.',
      where: 'Pertenece al lenguaje musical de las primeras zonas funerarias de MediEvil, donde Sir Daniel vuelve literalmente de la tumba y Gallowmere se presenta como un cuento macabro lleno de esqueletos, lápidas y humor negro.',
      sound: 'Mezcla escritura orquestal de cuento gótico con melodías juguetonas. Hay misterio y oscuridad, pero nunca intenta ser terror puro: la música sonríe mientras enseña los dientes.',
      meaning: 'Resume perfectamente la identidad de MediEvil: muerte, cementerios y monstruos tratados con el espíritu de una fábula grotesca. Daniel es un cadáver, pero el juego quiere que su mundo resulte encantador además de siniestro.',
      feeling: 'Da una mezcla muy particular de aventura, Halloween y comedia negra. Puede sonar lúgubre durante unos segundos y enseguida introducir una frase que parece burlarse de la propia solemnidad del escenario.',
      intent: 'La función del tema es establecer desde el principio que Gallowmere no es un mundo de horror realista. Es un escenario teatral y exagerado, y la música mantiene esa frontera entre lo siniestro y lo divertido.',
      detail: 'Ese equilibrio explica por qué el MediEvil original tiene una personalidad tan reconocible: incluso sin ver la pantalla, la música ya te está contando qué clase de cadáver es Sir Daniel y qué clase de mundo lo rodea.'
    },
    'gow3': {
      title: 'Melody of Pandora', src: 'assets/audio/gow3-melody-of-pandora.mp3',
      composer: 'Cris Velasco',
      context: 'Motivo ambiental asociado a Pandora en God of War III.',
      where: 'Aparece alrededor de estatuas y espacios relacionados con Pandora y su motivo musical, incluyendo distintas zonas del Hades y otros puntos de la aventura. En varias apariciones funciona de forma ambiental y aumenta su presencia al acercarnos al lugar asociado.',
      sound: 'Es mucho más etérea que la música de combate del juego: voces, capas sostenidas y una melodía frágil flotan sobre un fondo oscuro. La pieza evita el golpe orquestal típico de Kratos y se vuelve casi íntima.',
      meaning: 'Pandora es uno de los pocos elementos capaces de romper la brutalidad constante de Kratos. Su música introduce inocencia, pérdida y esperanza dentro de un juego construido alrededor de rabia, destrucción y venganza.',
      feeling: 'Produce una mezcla de calma y tristeza. No es una calma segura: se siente como algo delicado que existe dentro de un mundo que puede destruirlo en cualquier momento.',
      intent: 'Por su colocación y su comportamiento ambiental, el motivo sirve para anticipar a Pandora antes incluso de que su relación con Kratos quede completamente desarrollada. La música crea una asociación emocional previa a la explicación narrativa.',
      detail: 'Es precisamente la falta de grandilocuencia lo que la hace destacar dentro de God of War III. Entre dioses gigantes, titanes y batallas, una melodía pequeña termina teniendo un peso enorme.'
    },
    'pokemon-black': {
      title: 'Route 10', src: 'assets/audio/pokemon-black-route-10.mp3',
      composer: 'Shōta Kageyama',
      context: 'Ruta 10 de Teselia, antes del tramo final de la aventura.',
      where: 'Suena en la Ruta 10 de Pokémon Negro y Blanco, una de las últimas rutas importantes antes de afrontar el tramo final hacia la Liga Pokémon. Por su posición en la aventura, llega cuando el viaje por Teselia ya tiene memoria acumulada.',
      sound: 'Combina piano, cuerdas y un impulso rítmico constante. Es melódica y luminosa, pero tiene una nostalgia muy marcada: avanza mientras parece mirar hacia atrás.',
      meaning: 'La ruta funciona como transición entre la aventura cotidiana y la recta final. La música convierte un camino más en la sensación de estar dejando atrás algo que ya no se repetirá de la misma manera.',
      feeling: 'Es esperanzadora y melancólica a la vez. No suena a despedida definitiva, pero sí a ese momento de un viaje en el que sabes que estás acercándote al final.',
      intent: 'La función narrativa observable es dar importancia emocional a una ruta que, estructuralmente, prepara el cierre. En lugar de reservar toda la emoción para una batalla, la banda sonora hace que el simple hecho de caminar tenga peso.',
      detail: 'Esa combinación de avance y nostalgia es una de las razones por las que Route 10 suele recordarse mucho más que otras rutas de Pokémon: parece música de “último capítulo” sin dejar de ser música de exploración.'
    },
    're2-og': {
      title: 'Secure Place', src: 'assets/audio/re2-save-room.mp3',
      composer: 'Masami Ueda',
      context: 'Tema de las habitaciones seguras de Resident Evil 2 (1998).',
      where: 'Suena en las save rooms del Resident Evil 2 original. Son espacios donde los enemigos dejan de perseguirte, puedes organizar recursos y, normalmente, guardar la partida.',
      sound: 'Una melodía corta y muy reconocible se apoya sobre armonías suaves y ligeramente tristes. Es tranquila, pero nunca completamente cálida: sigue perteneciendo al mismo mundo enfermo que hay al otro lado de la puerta.',
      meaning: 'La pieza representa seguridad temporal, no victoria. El propio título, Secure Place, resume la idea: aquí puedes respirar, pero nada de lo que ocurre fuera ha desaparecido.',
      feeling: 'El alivio funciona precisamente porque vienes de pasillos hostiles y recursos limitados. La música baja las pulsaciones sin permitir que olvides que tarde o temprano tendrás que volver a salir.',
      intent: 'Su función es crear un contraste emocional muy fuerte con el resto del juego. Resident Evil necesita que el peligro sea agotador para que la seguridad tenga valor; esta melodía convierte una habitación pequeña en refugio.',
      detail: 'Es un ejemplo clásico de cómo una música muy breve puede quedar ligada para siempre a una mecánica. Escucharla acaba significando inventario, baúl, máquina de escribir y unos minutos sin zombies.'
    },
    're3-og': {
      title: 'Free From Fear', src: 'assets/audio/re3-og-free-from-fear.mp3',
      composer: 'Saori Maeda',
      context: 'Tema de las save rooms de Resident Evil 3: Nemesis (1999).',
      where: 'Suena en las habitaciones seguras de Resident Evil 3: Nemesis. Su nombre, Free From Fear, tiene especial sentido en un juego donde Nemesis convierte buena parte de Raccoon City en un espacio en el que nunca estás del todo cómodo.',
      sound: 'Teclados suaves y capas ambientales construyen una melodía lenta, casi flotante. No es alegre; simplemente sustituye la amenaza inmediata por una tristeza tranquila.',
      meaning: 'Representa un refugio momentáneo frente a Nemesis y frente al colapso de Raccoon City. La ciudad sigue muriendo, pero durante unos minutos Jill puede existir fuera de la persecución.',
      feeling: 'Alivio, cansancio y melancolía. Cuanto más agresivo se vuelve el exterior, más poderosa resulta esta música por contraste.',
      intent: 'La función musical es hacer que la seguridad se sienta física. Al cruzar una puerta y escucharla, el jugador entiende casi instantáneamente que puede bajar la guardia, gestionar recursos y pensar.',
      detail: 'En un juego tan identificado con la persecución, el tema de guardado termina siendo la cara opuesta de Nemesis: él es presión imprevisible; esta música es el raro momento en que la presión desaparece.'
    },
    're3-remake': {
      title: 'Save Room Theme', src: 'assets/audio/re3-remake-save-room.mp3',
      composer: 'Saori Maeda — nueva versión basada en Free From Fear',
      context: 'Relectura del tema de refugio de Resident Evil 3.',
      where: 'Se utiliza alrededor de los puntos seguros y del sistema de guardado del remake. Reinterpreta musicalmente la identidad de Free From Fear, el tema de save room del Resident Evil 3 de 1999.',
      sound: 'Mantiene el ADN melódico del original, pero con una producción más espaciosa, limpia y cinematográfica. Hay más aire entre sonidos y menos sensación de pieza puramente sintetizada de finales de los noventa.',
      meaning: 'Funciona como puente entre las dos versiones de Raccoon City. Aunque el remake cambia muchísimo la estructura y el comportamiento de Nemesis, esta música conecta directamente con la memoria del juego original.',
      feeling: 'Es más pulida y menos áspera que la de 1999, pero conserva la mezcla de alivio y tristeza. La seguridad sigue sintiéndose temporal.',
      intent: 'La decisión de conservar y rehacer el motivo original permite que el jugador veterano reconozca inmediatamente el lenguaje emocional de RE3. La nostalgia aquí no es un simple guiño: tiene función de orientación y refugio.',
      detail: 'Es uno de los puntos donde remake y original dialogan de forma más directa. La escena puede ser distinta, pero unas pocas notas bastan para volver a la misma idea de “aquí, por ahora, no te está persiguiendo nada”.'
    },
    're4-og': {
      title: 'Serenity', src: 'assets/audio/re4-serenity.mp3',
      composer: 'Banda sonora de Misao Senbongi y Shusaku Uchiyama; autoría individual no confirmada',
      context: 'Tema de zonas seguras y de muchas apariciones del Mercader.',
      where: 'Se escucha en espacios de guardado y también acompaña muchas apariciones del Mercader. Esa asociación hace que termine significando algo más que “save room”: significa pausa, compra, reorganización y preparación.',
      sound: 'Es ambiental, lenta y casi hipnótica. Utiliza texturas suaves y una melodía mínima que parece suspender el tiempo en lugar de marcar un ritmo.',
      meaning: 'En un Resident Evil mucho más orientado a la acción, Serenity conserva una tradición fundamental de la saga: crear pequeños oasis donde la hostilidad del exterior deja de imponerse.',
      feeling: 'Calma extraña. No parece una canción feliz, pero después de una aldea llena de Ganados o un castillo hostil, su simple quietud resulta reconfortante.',
      intent: 'Su función es cambiar el modo mental del jugador: de reaccionar y disparar a revisar inventario, pensar qué comprar y preparar la siguiente sección. El tema desacelera el juego sin necesidad de una transición explícita.',
      detail: 'La asociación con el Mercader le da además una cualidad casi doméstica: con el tiempo, escuchar Serenity puede sentirse como encontrarte a un personaje conocido en mitad de un lugar completamente hostil.'
    },
    're9': {
      title: 'Respite', src: 'assets/audio/re9-save-room.mp3',
      composer: 'Masahiro Ōki',
      context: 'Tema de las habitaciones seguras de Resident Evil Requiem.',
      where: 'Se utiliza como tema de save room en Resident Evil Requiem. Como en los Resident Evil clásicos, aparece en momentos donde el juego permite reorganizarse y respirar entre zonas de tensión y peligro.',
      sound: 'Es contenida y atmosférica, con una sensibilidad melancólica más que tranquilizadora. La pieza se sostiene en capas suaves que parecen dejar espacio al silencio de la habitación.',
      meaning: 'El título Respite significa precisamente respiro o tregua. Encaja con una entrega que vuelve a utilizar la seguridad como contraste directo frente a espacios hostiles y a la memoria traumática de Raccoon City.',
      feeling: 'No transmite “todo va bien”; transmite “durante un momento puedes parar”. Esa diferencia mantiene la inquietud incluso dentro del refugio.',
      intent: 'La función musical es heredar el lenguaje de las save rooms de la saga sin limitarse a copiarlo. La calma existe, pero está teñida por la identidad más oscura y reflexiva de Requiem.',
      detail: 'Funciona especialmente bien como tema de ficha porque deja respirar la lectura sin competir con ella, igual que dentro del juego deja respirar al jugador sin romper la atmósfera.'
    },
    're1-remaster': {
      title: 'Safe Heaven', src: 'assets/audio/re1-remaster-safe-heaven.mp3',
      composer: 'Shusaku Uchiyama, Makoto Tomozawa y Misao Senbongi — créditos del remake',
      context: 'Tema de refugio de Resident Evil (2002).',
      where: 'Acompaña las save rooms del remake de Resident Evil, pequeños espacios repartidos por la mansión y sus alrededores donde puedes guardar, usar el baúl y reorganizar el inventario.',
      sound: 'Cuerdas y capas ambientales construyen una melodía muy suave, pero con un fondo casi fantasmal. Es más envolvente que el tema del juego de 1996 y aprovecha el diseño sonoro del remake para que el refugio siga sintiéndose gótico.',
      meaning: 'La mansión Spencer es un espacio de puertas cerradas, backtracking y amenaza constante. Safe Heaven funciona como la respiración entre esos trayectos y convierte unas habitaciones muy pequeñas en puntos emocionales del mapa.',
      feeling: 'Alivio mezclado con soledad. Estás a salvo, pero la música no te hace sentir acompañado; parece recordarte que sigues atrapado dentro de la mansión.',
      intent: 'La función musical es bajar la tensión sin destruirla. El jugador debe recuperar claridad para ordenar objetos y planear, pero el tono conserva suficiente inquietud para que volver a abrir la puerta siga costando.',
      detail: 'Su efecto está muy unido al diseño de Resident Evil: cuanto más pesado resulta el viaje hasta un baúl o una máquina de escribir, más valor adquiere el momento en que esta música empieza a sonar.'
    },
    'sotc': {
      title: 'The Opened Way', src: 'assets/audio/sotc-the-opened-way.mp3',
      composer: 'Kow Otani',
      context: 'Tema de batalla contra los colosos.',
      where: 'Forma parte de la música de combate de Shadow of the Colossus y aparece en enfrentamientos donde la relación con el coloso deja de ser simple observación para convertirse en avance, escalada y conquista.',
      sound: 'Orquesta, percusión y una melodía ascendente construyen una épica muy limpia. A diferencia del silencio del mundo abierto, el tema llena de pronto todo el espacio y hace que cada movimiento del coloso parezca gigantesco.',
      meaning: 'La música te presenta como héroe justo cuando las imágenes empiezan a sembrar la duda. Estás venciendo una criatura imposible, pero el juego no tarda en mostrar que esa victoria tiene un coste.',
      feeling: 'Euforia, determinación y una escala casi religiosa. Es música de triunfo durante el proceso, lo que hace todavía más incómodo el silencio y la caída que llegan después.',
      intent: 'La función del contraste es fundamental: el viaje suele ser solitario y contenido, mientras que la batalla explota en música. Esa diferencia hace que subir por el cuerpo de un coloso se sienta como abrir literalmente un camino donde antes no lo había.',
      detail: 'El título “The Opened Way” encaja con la estructura de muchas peleas: descubrir la forma de avanzar transforma una criatura inabarcable en un recorrido posible. La música convierte ese descubrimiento en impulso.'
    },
    'gow1': {
      title: "The Architect's Mysteries", src: 'assets/audio/gow1-architects-mysteries.mp3',
      composer: 'Ron Fish',
      context: 'Motivo ambiental de los Anillos y el Templo de Pandora.',
      where: 'La versión de juego aparece varias veces en los Rings of Pandora: al entrar y después de distintos desafíos del Templo. Está vinculada al motivo de Pandora y a la arquitectura imposible que Kratos debe ir descifrando.',
      sound: 'Es ambiental y ceremonial. En lugar de empujar con percusión de batalla, utiliza capas oscuras y un motivo repetido que da sensación de mecanismo antiguo, templo y misterio.',
      meaning: 'El Templo de Pandora no es solo escenario: es una prueba construida por alguien. La música refuerza la sensación de estar caminando dentro de una máquina mitológica diseñada para evaluar, castigar y confundir.',
      feeling: 'Curiosidad, aislamiento y una tensión tranquila. No te dice que algo vaya a atacarte inmediatamente; te dice que el propio lugar es más grande y antiguo que tú.',
      intent: 'La función musical es mantener una identidad común entre desafíos distintos. Cada vez que vuelve el motivo, recuerda que Kratos sigue dentro del mismo gran rompecabezas del arquitecto, aunque cambie la sala o el tipo de prueba.',
      detail: 'Es una pieza que representa muy bien el primer God of War: la épica no depende siempre de gritar y golpear; también puede venir de sentir que estás penetrando en un lugar que no fue construido para seres humanos.'
    },
    'twilight-princess': {
      title: 'Twilight', src: 'assets/audio/twilight-princess-twilight.mp3',
      composer: 'Banda sonora de Toru Minegishi y Asuka Ohta, con Kōji Kondō como supervisor',
      context: 'Lenguaje musical asociado al Crepúsculo en Twilight Princess.',
      where: 'Está ligado a los espacios dominados por el Crepúsculo y a la identidad sonora de ese otro estado de Hyrule. Es el mundo en el que Link adopta su forma de lobo y Midna pasa a ser la guía fundamental.',
      sound: 'Timbres electrónicos, voces procesadas y armonías suspendidas crean una textura que no suena como el Hyrule tradicional. La música parece familiar y extraña al mismo tiempo, exactamente igual que el mundo que representa.',
      meaning: 'El Crepúsculo no es simplemente “oscuridad”: es otra realidad superpuesta a Hyrule. Su música necesita distinguirla sin convertirla en un infierno genérico, y por eso opta por algo espectral, digital y casi hermoso.',
      feeling: 'Extrañeza, soledad y fascinación. Hay amenaza, pero también una sensación hipnótica que hace que el jugador quiera observar ese mundo en lugar de limitarse a escapar de él.',
      intent: 'La función observable es marcar un cambio de reglas y de identidad. Cuando aparece este lenguaje sonoro, el juego comunica que Hyrule ya no está funcionando como debería y que Link está atravesando una frontera entre dos mundos.',
      detail: 'El procesamiento de las voces y los timbres encaja además con Midna, cuya propia “voz” utiliza habla manipulada. Todo el Crepúsculo comparte así una identidad sonora que parece humana y no humana a la vez.'
    }
  };
})();
