# BandoneAR · Presentación

Presentación comercial (15 min) en un único archivo HTML. Se abre directamente con
el navegador: `index.html`. No requiere servidor ni build.

## Estructura

```
.
├── index.html                    Toda la presentación (HTML + CSS + JS inline)
├── guion.md                      Guion y tiempos
└── assets/
    ├── img/
    │   ├── hero-bandoneon.webp   Bandoneón sobre mesa, luz cinematográfica
    │   ├── fuelle.webp           Detalle del fuelle
    │   ├── orquesta.webp         Orquesta típica de tango
    │   ├── milonga.webp          Milonga porteña, parejas bailando
    │   ├── bandoneon-plano.jpg   Los dos teclados y el fuelle, lámina explicativa
    │   ├── bandonear-mesa.jpg    BandoneAR, foto del producto
    │   ├── logo-mark.png         Isotipo, fondo transparente
    │   └── logo-mark-original.png  Isotipo como llegó, con fondo gris opaco
    └── video/
        └── proyecto_video_final.mp4   (no versionado, ver abajo)
```

Las imágenes están en WebP a calidad 82 (1536×1024): pesan 352 KB entre las cuatro
contra los 7,6 MB que ocupaban en PNG, sin diferencia visible en proyector. Si
agregás imágenes nuevas, convertilas igual:
`magick entrada.png -quality 82 -define webp:method=6 assets/img/nombre.webp`

> **Pendiente:** `bandoneon-plano.jpg` y `bandonear-mesa.jpg` entraron en JPEG sin
> pasar por esa conversión y pesan ~2,2 MB cada una, más que las otras seis juntas.
> Conviene pasarlas a WebP con el comando de arriba y actualizar las rutas en
> `index.html`.

`logo-mark.png` es el isotipo con el fondo gris recortado a transparencia, que es
lo que usa el deck. Se conserva `logo-mark-original.png` por si hay que rehacer el
recorte.

## Falta agregar

El video del pitch (hasta 3 min) de la slide "Video" **no se versiona**: pesa unos
58 MB y GitHub avisa a partir de los 50. Está ignorado en `.gitignore`, así que hay
que copiarlo a mano en `assets/video/proyecto_video_final.mp4`, que es la ruta que
espera `index.html`. Mientras no exista, la slide muestra un placeholder con
instrucciones en pantalla y el resto de la presentación funciona normalmente.

## Uso de las imágenes por slide

| # | Slide | Imagen |
|---|-------|--------|
| 1 | Portada | `hero-bandoneon.webp` + `logo-mark.png` |
| 2 | ¿Qué es el bandoneón? | `bandoneon-plano.jpg` |
| 3 | Impacto cultural | `orquesta.webp` + `fuelle.webp` + `milonga.webp` |
| 4 | El tango | `milonga.webp` + `orquesta.webp` + `hero-bandoneon.webp` |
| 5 | Situación actual | `hero-bandoneon.webp` |
| 6 | El problema | `milonga.webp` |
| 7 | El video | `orquesta.webp` |
| 8 | Video | `milonga.webp` (póster) + `proyecto_video_final.mp4` |
| 9 | El instrumento | `bandonear-mesa.jpg` |
| 10 | Cómo funciona | — |
| 11 | Modalidades de uso | — |
| 12 | Propuesta de valor | `orquesta.webp` |
| 13 | Nuestra visión | `milonga.webp` |
| 14 | Gracias | — |

El isotipo aparece además en el sidebar y como favicon. Si se suman imágenes
nuevas, van en `assets/img/` con nombre descriptivo del contenido, en minúsculas
y separado con guiones (sin espacios: obligan a escapar la URL).
