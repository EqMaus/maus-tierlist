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
      composer: 'Go Ichinose',
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
      composer: 'Masahiro Ohki',
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
      composer: 'Shusaku Uchiyama, Makoto Tomozawa y Misao Senbongi — autoría individual no confirmada',
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

  // Capas editoriales adicionales para la lectura extensa del tema.
  // Son interpretación musical/narrativa salvo cuando el propio texto describe un uso verificable dentro del juego.
  window.MAUS_GAME_MUSIC_DEEP = {
    'gow2': {
      thesis: 'Un duelo que utiliza la música para mantener la amenaza de Perseo incluso cuando el rival desaparece literalmente de la pantalla.',
      gameplay: 'La invisibilidad de Perseo obliga a leer agua, sonido y movimiento. La partitura evita que esos segundos de búsqueda se conviertan en espera: mantiene el pulso de combate y hace que localizarlo sea parte de la tensión, no una pausa entre ataques.',
      craft: 'La percusión funciona como motor y los metales dan al enfrentamiento una escala mayor que la arena en la que sucede. Las frases no descansan demasiado, de modo que la música parece estar buscando al enemigo al mismo tiempo que el jugador.',
      contrast: 'God of War II está lleno de criaturas enormes y escenarios monumentales; aquí el espectáculo se comprime en un enfrentamiento mucho más personal. La música conserva la épica de la saga, pero la aplica a un choque de orgullo entre dos figuras mitológicas.',
      memory: 'La combinación de invisibilidad, reflejos y una música que no deja de empujar hace que el combate tenga una identidad sonora inmediata. No depende solo del aspecto de Perseo: el tema ayuda a recordar cómo se sentía perseguirlo.'
    },
    'pokemon-diamond': {
      thesis: 'Una pieza de quietud que convierte tres espacios naturales en lugares que parecen anteriores al propio viaje del jugador.',
      gameplay: 'Llegar a los lagos interrumpe el patrón habitual de ruta, entrenadores y encuentros. La música baja el ritmo y permite observar; esa desaceleración hace que el jugador entienda intuitivamente que no está atravesando otra zona de paso.',
      craft: 'La melodía es sencilla y deja mucho aire entre ideas. Ese espacio es esencial: en vez de llenar el silencio de la Nintendo DS, lo utiliza para que el agua y el paisaje parezcan más amplios de lo que realmente permite la escala visual del juego.',
      contrast: 'Sinnoh puede sentirse mecánico cuando encadena rutas, combates y encuentros salvajes. Lake hace lo contrario: detiene la máquina y crea un pequeño estado contemplativo ligado a la mitología de Uxie, Mesprit y Azelf.',
      memory: 'Su fuerza está en que no necesita una batalla ni un gran acontecimiento para adquirir importancia. Basta volver a escuchar esas primeras frases para reconstruir mentalmente agua quieta, nieve o bosque y la sensación de estar ante un lugar especial.'
    },
    'majoras-mask': {
      thesis: 'No musicaliza una aventura: musicaliza la certeza de que el tiempo se ha terminado.',
      gameplay: 'El jugador sigue teniendo libertad de movimiento, pero el reloj ya está en sus últimas horas. La lentitud del tema crea fricción con cualquier intento desesperado por terminar tareas: tú puedes correr; la música parece haber aceptado ya el final.',
      craft: 'La repetición y las notas sostenidas convierten el paso del tiempo en algo pesado. Las campanadas y el temblor del mundo no son decoración separada: se integran con la pieza hasta que música y cuenta atrás parecen formar un único mecanismo.',
      contrast: 'Durante buena parte del ciclo de tres días, Clock Town tiene vida cotidiana, personajes y melodías reconocibles. En las últimas horas queda vacía y la música sustituye esa normalidad por una especie de funeral anticipado.',
      memory: 'Es difícil separar el tema de la imagen de la Luna ocupando cada vez más cielo. La música queda asociada a una experiencia jugable concreta: saber exactamente cuánto falta y sentir que cada segundo tiene peso.'
    },
    'medievil': {
      thesis: 'Una banda sonora que consigue que un cementerio sea siniestro y simpático a la vez, igual que Sir Daniel.',
      gameplay: 'Las primeras zonas enseñan a golpear, explorar y leer el tono del juego. La música acompaña ese aprendizaje sin convertirlo en terror: incluso cuando aparecen muertos y criptas, el jugador entiende que la aventura quiere ser macabra, no opresiva.',
      craft: 'Las melodías tienen gestos casi teatrales y cambios de carácter que recuerdan a una película de monstruos contada como cuento. La orquestación caricaturiza lo gótico en lugar de limitarse a oscurecerlo.',
      contrast: 'El argumento habla de muerte, nigromancia y un reino invadido por monstruos, pero la música evita que todo se vuelva solemne. Ese choque entre asunto oscuro y ejecución juguetona es una de las firmas de MediEvil.',
      memory: 'Pocas bandas sonoras describen tan rápido la personalidad de su juego. Unas frases bastan para imaginar lápidas torcidas, esqueletos, niebla y a Daniel avanzando de una forma más torpe que heroica.'
    },
    'gow3': {
      thesis: 'Una melodía deliberadamente frágil colocada dentro del God of War más gigantesco y violento.',
      gameplay: 'Cuando aparece este lenguaje musical, el jugador suele venir de espacios de escala enorme, combate o destrucción. La ausencia de percusión dominante cambia inmediatamente la forma de leer la escena: invita a acercarse, observar y escuchar en vez de atacar.',
      craft: 'Las voces y notas sostenidas crean una sensación de distancia casi espiritual. La melodía no necesita resolver con fuerza; su fragilidad es el recurso principal y deja que el silencio entre capas tenga tanto peso como las notas.',
      contrast: 'Kratos está destruyendo literalmente el Olimpo mientras Pandora introduce una idea opuesta: esperanza. La música es uno de los pocos lugares donde el juego permite que esa oposición se escuche sin necesidad de explicarla con diálogo.',
      memory: 'Destaca porque su volumen emocional es inverso al tamaño del juego. Entre titanes, dioses y coros brutales, una melodía íntima termina funcionando como una de las asociaciones más humanas de la aventura.'
    },
    'pokemon-black': {
      thesis: 'Música de camino que suena como si la aventura ya estuviera empezando a convertirse en recuerdo.',
      gameplay: 'Sigues avanzando como en cualquier ruta, pero la cercanía del tramo final hace que caminar, combatir y mirar el paisaje tengan otra lectura. El tema no frena el movimiento: lo acompaña con una sensación de “última vez”.',
      craft: 'Piano y cuerdas sostienen una melodía muy cantable mientras el ritmo continúa empujando hacia delante. Ese equilibrio evita que la nostalgia se vuelva estática: es una despedida que sigue caminando.',
      contrast: 'Muchas rutas de Pokémon funcionan principalmente como conexión entre puntos. Route 10 se siente emocionalmente más importante que su función estructural porque la música la presenta como umbral hacia el cierre.',
      memory: 'Su melodía puede separarse del mapa y seguir evocando la recta final de Teselia. Es uno de esos temas cuya memoria no depende de un personaje concreto, sino de la sensación acumulada de haber viajado mucho.'
    },
    're2-og': {
      thesis: 'La seguridad convertida en sonido: no elimina el horror, simplemente te concede unos minutos para respirar dentro de él.',
      gameplay: 'El cambio de música coincide con un cambio completo de conducta. Dejas de esquivar, disparar y decidir rápido; empiezas a ordenar objetos, contar munición y preparar rutas. El tema acompaña ese cambio mental casi como parte de la interfaz.',
      craft: 'La melodía es corta y reconocible, con armonías suaves que nunca terminan de sonar plenamente luminosas. Esa pequeña sombra armónica permite descansar sin romper el mundo sonoro del juego.',
      contrast: 'Los pasillos de la comisaría pueden ser hostiles y silenciosos. Entrar en una save room y escuchar una melodía definida crea un contraste enorme: por primera vez el espacio deja de exigirte una reacción.',
      memory: 'Se acaba asociando a objetos muy concretos —baúl, máquina de escribir, inventario— hasta que escuchar el tema fuera del juego puede provocar la misma sensación de alivio que entrar en una habitación segura.'
    },
    're3-og': {
      thesis: 'Un refugio musical especialmente poderoso porque existe dentro del Resident Evil donde la persecución puede sentirse más imprevisible.',
      gameplay: 'La save room permite pasar de reaccionar a Nemesis a planificar. Guardar, combinar objetos y decidir qué llevar adquiere más valor cuando el jugador viene de una ciudad donde no siempre sabe qué habrá detrás de la siguiente puerta.',
      craft: 'Los teclados y capas ambientales se mueven con mucha suavidad y dejan una sensación flotante. No celebran estar a salvo; parecen describir el agotamiento que queda cuando el peligro desaparece por un momento.',
      contrast: 'Nemesis es ruido, velocidad y presencia física. Free From Fear es lo contrario: espacio, lentitud y ausencia. Cuanto más agresiva es la persecución, más intensa resulta esta calma.',
      memory: 'El título y la función encajan casi literalmente. Para muchos jugadores, las primeras notas significan una sola cosa antes incluso de reconocer la melodía: “aquí no puede entrar”.'
    },
    're3-remake': {
      thesis: 'Una relectura que utiliza memoria musical para conservar una parte del Resident Evil 3 original incluso cuando el remake cambia casi todo lo demás.',
      gameplay: 'Sigue marcando el paso a un espacio de gestión: inventario, baúl y guardado. Esa función familiar ayuda a ordenar el ritmo de un juego mucho más lineal y orientado a secuencias que el original.',
      craft: 'La producción amplía el espacio alrededor del motivo clásico. Hay más profundidad, reverberación y limpieza, pero la melodía central permanece reconocible para que la modernización no borre su identidad.',
      contrast: 'El remake acelera persecuciones y escenas de acción, mientras esta pieza insiste en una emoción heredada de 1999. Es uno de los pocos momentos donde ambas versiones parecen hablar exactamente el mismo idioma.',
      memory: 'Su poder depende en parte del reconocimiento. Para quien conoce el original, unas pocas notas activan inmediatamente otra Raccoon City; para quien no, funciona igualmente como un refugio melancólico.'
    },
    're4-og': {
      thesis: 'Un descanso que termina asociado no solo a estar a salvo, sino al ritual de prepararse para seguir avanzando.',
      gameplay: 'Serenity acompaña inventario, compras y decisiones de equipo. Mientras el exterior exige reflejos, estos espacios te permiten pensar en economía, armas y estrategia; la música sostiene ese cambio sin cortar la atmósfera.',
      craft: 'Las texturas ambientales y la melodía mínima evitan una sensación de canción convencional. Parece más un estado sonoro que un tema con principio y final, perfecto para permanecer de fondo mientras el jugador gestiona recursos.',
      contrast: 'Resident Evil 4 es mucho más activo que sus predecesores, por eso una pieza tan inmóvil resulta aún más marcada. Después de gritos, disparos y presión, el silencio rítmico se siente casi físico.',
      memory: 'La asociación repetida con el Mercader le da una identidad social extraña: no solo recuerdas una habitación segura, recuerdas encontrarte con alguien conocido en medio de lugares hostiles.'
    },
    're9': {
      thesis: 'Una tregua moderna de Resident Evil que conserva la tradición de la save room pero la tiñe con el tono más introspectivo de Requiem.',
      gameplay: 'Su aparición separa los picos de tensión de los momentos de gestión. Al abrir inventario, revisar recursos o simplemente permanecer quieto, la música permite que el jugador procese lo que acaba de ocurrir antes de volver al peligro.',
      craft: 'Las capas son suaves y espaciosas, con una melodía contenida que evita llamar demasiado la atención. La producción prioriza profundidad y ambiente, haciendo que el silencio alrededor de las notas sea parte del efecto.',
      contrast: 'Requiem utiliza con frecuencia imágenes y espacios cargados de memoria traumática. Respite no responde con optimismo; crea una calma que todavía contiene esa sombra, de modo que el refugio pertenece al mismo mundo emocional.',
      memory: 'Continúa una tradición de casi treinta años de Resident Evil: reconocer una melodía tranquila y saber, antes de mirar la habitación, que el juego te está permitiendo bajar la guardia durante un momento.'
    },
    're1-remaster': {
      thesis: 'El refugio de una mansión que nunca llega a sentirse completamente amable, incluso cuando el juego te promete que estás a salvo.',
      gameplay: 'La estructura del remake obliga a pensar mucho en inventario y rutas. Por eso llegar a una habitación con baúl no es solo descanso: es un punto de planificación desde el que decides qué parte de la mansión vas a sufrir después.',
      craft: 'La combinación de capas ambientales y timbres suaves mantiene un color gótico. La música relaja la presión inmediata, pero deja suficientes sombras armónicas para que la mansión continúe presente dentro del refugio.',
      contrast: 'Fuera hay puertas, backtracking, zombies y espacios donde cada objeto ocupa un hueco importante. Dentro, el tiempo parece detenerse. Esa diferencia convierte habitaciones pequeñas en anclas emocionales del mapa.',
      memory: 'Cuanto más costoso resulta volver al baúl, más significado adquiere el tema. La melodía no recuerda solo seguridad: recuerda el alivio de haber conseguido llegar hasta ella con los recursos justos.'
    },
    'sotc': {
      thesis: 'Una explosión heroica que hace sentir gigantesca una victoria incluso mientras el juego empieza a cuestionar si esa victoria debería celebrarse.',
      gameplay: 'El tema suele entrar cuando el enfrentamiento ha pasado de observar a comprender: has encontrado una ruta, un punto de apoyo o una forma de subir. La música recompensa ese descubrimiento y transforma el progreso físico en impulso emocional.',
      craft: 'La melodía ascendente y la percusión orquestal empujan con claridad. No busca ambigüedad durante el ascenso: suena decididamente heroica, y precisamente por eso el corte posterior puede resultar tan incómodo.',
      contrast: 'El mundo abierto es inmenso y silencioso; los combates llenan de pronto ese vacío con orquesta. El cambio de escala sonora hace que el coloso parezca todavía mayor y que Wander parezca, durante unos minutos, capaz de vencer cualquier cosa.',
      memory: 'Queda ligada al momento exacto en que una criatura aparentemente imposible empieza a ser “resoluble”. Es música de descubrimiento, escalada y determinación; por eso vuelve a la cabeza junto a imágenes de manos aferrándose al pelaje.'
    },
    'gow1': {
      thesis: 'Música de arquitectura: hace que el Templo de Pandora parezca un mecanismo antiguo que está pensando mientras Kratos intenta descifrarlo.',
      gameplay: 'El templo alterna combate, orientación y puzles. Esta pieza permite que los momentos sin enemigos sigan teniendo tensión, porque convierte la propia estructura en presencia: aunque nada ataque, el lugar continúa poniendo a prueba al jugador.',
      craft: 'Las capas repetitivas y el carácter ceremonial funcionan casi como engranajes musicales. En lugar de una melodía heroica central, el tema construye textura y continuidad entre salas muy distintas.',
      contrast: 'God of War suele asociarse a percusión, coros y violencia. Aquí la épica surge de la escala y del misterio. Kratos no domina la escena: durante un rato es un intruso dentro de algo diseñado mucho antes que él.',
      memory: 'El motivo une mentalmente el Templo de Pandora. Aunque cambien los desafíos, volver a escuchar ese lenguaje hace que todo parezca parte de una misma máquina mitológica.'
    },
    'twilight-princess': {
      thesis: 'Un lenguaje sonoro que hace que Hyrule siga siendo reconocible mientras te comunica que algo fundamental en él ha cambiado.',
      gameplay: 'Entrar en el Crepúsculo cambia la forma de Link, la percepción del entorno y muchas reglas de exploración. La música acompaña esa transición con timbres que ya no pertenecen del todo al Hyrule acústico habitual.',
      craft: 'Voces procesadas, sintetizadores y armonías suspendidas crean una textura difícil de ubicar. Hay elementos casi humanos, pero transformados lo suficiente para sonar como si llegaran desde el otro lado de una barrera.',
      contrast: 'El Hyrule normal utiliza un lenguaje aventurero más reconocible; el Crepúsculo introduce una belleza extraña y digital. No convierte el otro mundo en puro horror, lo vuelve fascinante y ligeramente incómodo.',
      memory: 'La identidad sonora está muy ligada a Midna, a Link lobo y al color visual del Crepúsculo. Por eso escucharla puede reconstruir inmediatamente no solo un lugar, sino una forma distinta de habitar el mundo del juego.'
    }
  };
})();
