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
    │   └── milonga.webp          Milonga porteña, parejas bailando
    └── video/
        └── video.mp4             (falta, ver abajo)
```

Las imágenes están en WebP a calidad 82 (1536×1024): pesan 352 KB entre las cuatro
contra los 7,6 MB que ocupaban en PNG, sin diferencia visible en proyector. Si
agregás imágenes nuevas, convertilas igual:
`magick entrada.png -quality 82 -define webp:method=6 assets/img/nombre.webp`

## Falta agregar

`assets/video/video.mp4` es el video del pitch (hasta 3 min) de la slide "Video".
Mientras no exista, la slide muestra un placeholder con instrucciones en pantalla;
el resto de la presentación funciona normalmente. Para agregarlo, copiá el archivo
con ese nombre exacto en esa ruta.

## Uso de las imágenes por slide

| # | Slide | Imagen |
|---|-------|--------|
| 1 | Portada | `hero-bandoneon.webp` |
| 2 | ¿Qué es el bandoneón? | `fuelle.webp` |
| 3 | Impacto cultural | `orquesta.webp` |
| 4 | Gardel y el tango | `milonga.webp` |
| 5 | Situación actual | `hero-bandoneon.webp` |
| 6 | El problema | `milonga.webp` |
| 7 | El video | `orquesta.webp` |
| 8 | Video | `milonga.webp` (póster) + `video.mp4` |
| 9 | El instrumento | `hero-bandoneon.webp` |
| 10 | Cómo funciona | `fuelle.webp` |
| 11 | Propuesta de valor | `orquesta.webp` |
| 12 | Cierre | `milonga.webp` |

Las cuatro imágenes se reutilizan a lo largo de las doce slides. Si se suman
imágenes nuevas, van en `assets/img/` con nombre descriptivo del contenido.
