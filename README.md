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


## v4.6.2
- Añadida previsualización social mediante Open Graph para WhatsApp, Discord, Telegram y otras plataformas compatibles.
- La imagen de previsualización es la captura del Modo presentación elegida por Maus (`social-preview-v4.6.2.png`).
- Añadidos metadatos Twitter Card como compatibilidad adicional.
- Build y recursos CSS/JS actualizados a `v4.6.2`.


## v4.6.3

- Corregida la miniatura de WhatsApp: la captura social se exporta como JPEG optimizado de 1200×675.
- Peso reducido por debajo de 300 KB para evitar que WhatsApp descarte la imagen del enlace.
- Añadidos `og:image:url` y `image_src` como compatibilidad extra para crawlers de previsualización.
- Build y recursos CSS/JS actualizados a `v4.6.3`.



## Editor de juegos y recursos (v4.7.0)

- El panel privado permite crear juegos nuevos sin tocar código.
- Portadas y fondos se pueden seleccionar desde el editor y se suben al repositorio al publicar.
- También se pueden subir MP3, elegir el segundo inicial y editar la información del tema.
- Los nuevos juegos guardan sus rutas de portada, fondo y música dentro de `js/site-data.js`, por lo que funcionan automáticamente en la tier list, reviews y modo presentación.
- Los nombres de archivo de recursos nuevos incluyen la versión para evitar problemas de caché.

## Editor privado (v4.6.4)

Existe en `admin.html`. Requiere autenticación mediante un Fine-grained Personal Access Token de GitHub limitado exclusivamente al repositorio `maus-tierlist` con permiso `Contents: Read and write`. El token se conserva solo durante la pestaña/sesión del navegador y no está incluido en el código.


## Sesión persistente del editor (v4.7.1)

El login de `admin.html` incluye **Recordar sesión en este dispositivo**. Si se activa, el token de GitHub se conserva en el almacenamiento local del navegador y el editor vuelve a conectar automáticamente al abrirlo de nuevo. **Cerrar sesión** elimina tanto la sesión temporal como la persistente. Usa esta opción únicamente en un dispositivo personal.
