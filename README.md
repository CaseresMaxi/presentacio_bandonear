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
    │   ├── pacho.jpg             Juan Maglio "Pacho" (206×310, ver aviso abajo)
    │   ├── abuelo.jpg            Luthier mostrándole el BandoneAR a un joven
    │   ├── nenesaprendiendo.jpg  Chicos aprendiendo bandoneón en el aula
    │   ├── orquestabandonear.jpg Orquesta típica tocando con BandoneAR
    │   ├── greco.jpg             Vicente Greco
    │   ├── gardel.webp           Carlos Gardel
    │   ├── troilo.webp           Aníbal Troilo tocando el bandoneón
    │   ├── piazzolla.webp        Ástor Piazzolla tocando el bandoneón
    │   ├── bandoneon-plano.jpg   Los dos teclados y el fuelle, lámina explicativa
    │   ├── bandonear-mesa.jpg    BandoneAR, foto del producto
    │   ├── tacto-switches.webp   Cabezales abiertos: switches mecánicos y tapas
    │   ├── logo-mark.png         Isotipo, fondo transparente
    │   └── logo-mark-original.png  Isotipo como llegó, con fondo gris opaco
    └── video/
        └── proyecto_video_final.mp4   El video del pitch (~58 MB)
```

Las imágenes están en WebP a calidad 82 (1536×1024): pesan 352 KB entre las cuatro
contra los 7,6 MB que ocupaban en PNG, sin diferencia visible en proyector. Si
agregás imágenes nuevas, convertilas igual:
`magick entrada.png -quality 82 -define webp:method=6 assets/img/nombre.webp`

> **Pendiente:** `bandoneon-plano.jpg` y `bandonear-mesa.jpg` entraron en JPEG sin
> pasar por esa conversión y pesan ~2,2 MB cada una, más que el resto de las
> imágenes juntas. Conviene pasarlas a WebP con el comando de arriba y actualizar
> las rutas en `index.html`.

> **Aviso:** `pacho.jpg` mide 206×310 y los retratos se muestran a 400×500, así
> que se agranda casi al doble y en proyector se va a ver blanda. Si aparece una
> copia de mayor resolución, conviene reemplazarla.

`logo-mark.png` es el isotipo con el fondo gris recortado a transparencia, que es
lo que usa el deck. Se conserva `logo-mark-original.png` por si hay que rehacer el
recorte.

## El video

`assets/video/proyecto_video_final.mp4` es el video del pitch (hasta 3 min) de la
slide "Video", y **sí está versionado**: se decidió tenerlo en el repo para que un
clon quede listo para presentar sin pasos manuales. Pesa unos 58 MB, así que tenerlo
en cuenta al clonar, y GitHub avisa por archivos de más de 50 MB (el límite duro son
100 MB). Si alguna vez hay que sacarlo, no alcanza con borrarlo: queda en el
historial y hay que reescribirlo o migrarlo a Git LFS.

Si el archivo faltara, la slide muestra un placeholder con instrucciones en pantalla
y el resto de la presentación funciona normalmente.

## Uso de las imágenes por slide

| # | Slide | Imagen |
|---|-------|--------|
| 1 | Portada | `hero-bandoneon.webp` + `logo-mark.png` |
| 2 | ¿Qué es el bandoneón? | `bandoneon-plano.jpg` |
| 3 | Impacto cultural | `pacho.jpg` + `greco.jpg` |
| 4 | El tango | `gardel.webp` + `troilo.webp` + `piazzolla.webp` |
| 5 | Situación actual | `hero-bandoneon.webp` |
| 6 | El problema | `milonga.webp` |
| 7 | El video | `orquesta.webp` |
| 8 | Video | `milonga.webp` (póster) + `proyecto_video_final.mp4` |
| 9 | El instrumento | `bandonear-mesa.jpg` |
| 10 | El tacto | `tacto-switches.webp` |
| 11 | Cómo funciona | `abuelo.jpg` |
| 12 | Modalidades de uso | — |
| 13 | Propuesta de valor | `orquesta.webp` |
| 14 | Nuestra visión | `nenesaprendiendo.jpg` |
| 15 | Gracias | `orquestabandonear.jpg` (de fondo) |

El isotipo aparece además en el sidebar y como favicon. Si se suman imágenes
nuevas, van en `assets/img/` con nombre descriptivo del contenido, en minúsculas
y separado con guiones (sin espacios: obligan a escapar la URL).
