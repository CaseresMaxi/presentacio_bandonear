# BandoneAR · contexto para Claude Code

Material de presentación del proyecto BandoneAR (bandoneón digital, UNLaM). Todo es
HTML/CSS/JS estático: se abre con el navegador, sin servidor ni build. Se escribe y
se comenta en castellano rioplatense.

## Qué hay

| Ruta | Qué es |
|------|--------|
| `index.html` | Deck comercial original (15 min), todo inline |
| `presentacion/index.html` | Presentación técnica "video" con editor; contenido en `escenas.js` |
| `presentacion/motion.html` + `motion-tipos.js` | Presentación motion graphics: una sola línea de tiempo con puntos clave (→ avanza, ← rebobina, Shift salta) |
| `presentacion/timeline.html` + `timeline-escenas.js` + `timeline-tipos.js` | Presentación timeline: el desarrollo del proyecto por etapas (origen, viabilidad, solución, desafíos, demo) sobre el motor de motion, con un riel de etapas en el pie. Las ilustraciones son SVG generado en `timeline-tipos.js` (sin fotos), editables y animadas con `tick`; componentes y demo usan el modelo 3D de `bandonear-3d.js` (Three.js r149 en `assets/vendor/`, script clásico para que ande desde `file://`) |
| `poster/index.html` | Póster A1 con panel de parámetros; `bash poster/exportar.sh [cfg]` genera PNG 300 dpi y PDF en `poster/salida/` |
| `landing/index.html` | Landing con sección Aprendé |
| `practica/index.html` | Práctica con los teclados por Web MIDI: muestra cada botón y su nota, guía escalas iluminando el botón que sigue y tiene modo canción (rollo de notas que suben; escuchar o tocar con espera; ejemplos de dominio público, importa .mid y acepta canciones escritas como texto); `practica/canciones.js` suma canciones locales con derechos de autor y está en `.gitignore`, no se versiona). Layout Rheinische 142 (el de `bandoneon.py`), sonido con Web Audio. Estado en `localStorage` `bandonear-practica` (incluye el mapeo aprendido de botones) |
| `logo/index.html` | Editor del logo vectorial; `logo.js` (`BandoneARLogo`) + `glifos.js` (wordmark en curvas, generado por `generar_glifos.py`) |
| `assets/logo/*.svg` | Isotipo y lockups horizontal/vertical por variante (generados con `generar_logo.py`) |
| `assets/logo/paquetes/*.zip` | Un zip por variante (12, incluida «celeste barrotes perspectiva», la del sol entre barrotes con pliegues en perspectiva): SVG + PNG 2048 px de horizontal, vertical e isotipo, con y sin fondo, más `ajustes.json`. Exportados con «Todas las variantes (.zip)» del editor |
| `reel/index.html` | Reel «Un pliegue que respira»; `node reel/render.mjs beats\|full` renderiza en `reel/salida/` |

Ramas: `main` es la buena. `expo-final` y `experimental-motion` ya están mergeadas.
Los renders (`poster/salida/`, `reel/salida/`) se versionan a propósito.

## Estado del navegador

Lo que se edita en las páginas vive en `localStorage`, no en archivos:
`bandonear-motion` (motion), `bandonear-timeline` (timeline), `bandonear-presentacion` (clásica), `bandonear-logo-editor`
(logo), `bandonear-poster-cfg` y `bandonear-poster-obs` (póster). Para moverlo de máquina se usa «Exportar .json» /
«Importar .json» en las presentaciones y el zip del editor del logo (`ajustes.json`).
`presentacion/exportado/` tiene el `.json` de cada presentación tal como está en el
código; es estado para importar, no código.

## Motion: cómo está armado

- `render(T)` es función pura del tiempo T; cada escena es un `section.scene` con
  transform = foco (cámara dentro de la escena, `focos` por paso) × cámara entre escenas.
- Atributos en las plantillas de `motion-tipos.js`: `data-m` (tipo de entrada),
  `data-s` (paso), `data-at`/`data-dur`/`data-stagger`, `data-k` (elemento compartido
  para el morph entre escenas consecutivas), `data-par`, `data-dim`, `data-f` (campo editable).
- Campos extra por escena: `pasos`, `entrada`, `logo`, `ocultar`, `correcciones`.
- Timeline: mismo motor (copiado en `timeline.html`), más el campo `fase` por escena, `estilo.fases`
  (etapas del riel) y `data-out="a-b"` (aparta un elemento en esos pasos, para los zooms de cámara).
  El guion tiene versión: si se cambia el contenido por defecto, sumar una función a `MIGRACIONES` en
  `timeline-escenas.js` para que el estado guardado en el navegador se ponga al día (solo pisa lo que no se editó).
- URL: `?escena=N&paso=M`, `?t=segundos` (congela), `&tema=`, `&ui=0`.
- El encabezado dibuja el lockup vectorial con `buildSVG`, sigue el logo de cada escena
  y, si hay diseño guardado en el editor del logo, lo usa por defecto.
- Correcciones: botón «Corregir» o tecla `C`, clic en la escena; se exportan en .md.
  Cuando el usuario pega correcciones, cada una trae escena, paso y punto (x, y).

## Cómo verificar

Siempre mirar el resultado en un navegador real antes de dar algo por hecho:
capturas con Chrome headless (`google-chrome-stable --headless=new --screenshot=...`)
o scripts con `playwright-core` (`npm i playwright-core` en una carpeta temporal,
`executablePath` al Chrome del sistema). Revisar que no haya errores en consola.

## Hardware real (de `infoextra/`, la guía de armado)

Matrices de switches cableadas a mano, un diodo por switch. Una Raspberry Pi Pico por cabezal:
la derecha lee 38 botones y el mute y manda por UART (LINK) a la izquierda, que lee 33 botones,
el encoder del fuelle, el encoder del panel, la llave y el volumen. La Pico izquierda habla por
UART con una Raspberry Pi Zero, que genera el sonido con FluidSynth y lo saca por I2S a dos
MAX98357A en estéreo. Placas perforadas (la PCB propia se descartó por costo).

## Pendientes conocidos

- `assets/img/bandoneon-plano.jpg` y `bandonear-mesa.jpg` pesan ~2,2 MB; convendría pasarlas a WebP (ver README).
- `pacho.jpg` es de baja resolución.
- Textos del póster (tildes, nombres de docentes) a confirmar con el usuario.
