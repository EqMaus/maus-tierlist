# Tier List de Maus v4.2.6

Cambios de esta versión:
- Añadidos fondos reales para Pokémon Negro y Pokémon Diamante.
- Añadidos fondos reales para Resident Evil 4, Resident Evil 3 Remake, Resident Evil 3 PS1 y Resident Evil 2.
- Añadidos fondos reales para Zelda: Twilight Princess y Majora's Mask.
- Restaurado el fondo real previamente aprobado de Shadow of the Colossus.
- Se conservan los fondos reales de God of War 1, 2 y 3.
- Se conserva la eliminación de los brillos de color en las tarjetas y el delineado sutil del color del tier en la Tier List.
- Se conserva la edición inline de reviews y el resto de cambios de v4.2.5.


## v4.2.9
Incluye los 15 temas MP3 definitivos y el nuevo fondo de God of War III.

## v4.3.0
- Reproductor musical compacto, arrastrable y situado abajo a la derecha por defecto.
- Fade-in de 3,6 segundos desde volumen muy bajo hasta el volumen elegido.
- Slider de volumen persistente por navegador.
- Panel “Información del tema” con contexto, uso, sonido, significado, sensación, función musical y detalles para los 15 temas.
- Reorganización editorial manual de las 15 reviews: cada texto queda en una sección coherente con su contenido, evitando los errores del clasificador automático.
- Se mantienen los 15 MP3, los fondos reales y el nuevo fondo de God of War III.
- Build pública.


## v4.5.2
- “Ver fondo” solo se ofrece cuando la ficha tiene una imagen de fondo dedicada.
- Nuevo slider temporal en el reproductor para avanzar y retroceder dentro de la canción, con tiempo actual y duración.
- Fade-in de las fichas más lento y escalonado para dar más presencia a fondo, cabecera, review y reproductor.
- Nueva sección “Features” en la navegación principal con una guía rápida de las partes interactivas de la web.
- Las tarjetas de Reviews crecen ligeramente al pasar el ratón para reforzar que son clicables.
- Recursos CSS/JS versionados como 4.4.0 para evitar caché antigua tras publicar.


## v4.6.0
- El contador del slider musical se presenta como una sola lectura: `1:37 / 5:00`.
- Nuevo selector “Apariencia” con tres paletas persistentes por navegador: Original, Negro & Rojo y Azul & Amarillo.
- Las paletas cambian la interfaz, pero conservan los fondos propios de cada juego y el color individual de los tiers.
- La guía Features documenta también Apariencia y Modo presentación.
- Corregido el bloque CSS heredado de v4.4 que contenía saltos de línea escapados (`\n`) y podía impedir que se aplicasen hover, fade-in, Features y estilos del timeline.
- Caché forzada a v4.6.0 para CSS y JavaScript.
- Se mantienen los avisos de spoilers universales con “Cerrar review”, Modo presentación, transición elegante de “Ver fondo” y los inicios musicales: RE Requiem 0:02, Shadow of the Colossus 0:05 y Twilight Princess 1:16.


## v4.6.1
- Añadido un comprobador automático de versión mediante `version.json`.
- La comprobación se realiza con `cache: no-store` y un parámetro único para evitar reutilizar una versión antigua del archivo de versión.
- Si hay una build nueva, la web conserva la sección actual (`#tierlist`, `#games`, etc.) y recarga el HTML con `?v=<versión>` para saltarse la caché del documento.
- También se vuelve a comprobar al restaurar una página desde la caché de navegación del navegador (bfcache).
- CSS y JavaScript actualizados a `v4.6.1`.
