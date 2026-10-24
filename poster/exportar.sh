#!/usr/bin/env bash
# Exporta el poster en A1 (594 x 841 mm):
#   poster/salida/bandonear-poster-a1.png  4677 x 6622 px a 200 dpi (menos de 10 MB)
#   poster/salida/bandonear-poster-a1.pdf  PDF vectorial (texto nitido a cualquier escala)
#
# Uso: bash poster/exportar.sh [config]
#      DPI=300 bash poster/exportar.sh       PNG a otra resolucion (a 300 dpi pesa ~18 MB)
# "config" es el codigo que genera el boton "Copiar comando de exportacion" del
# panel de parametros. Sin el, exporta los valores por defecto.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$DIR/salida"
CHROME="$(command -v google-chrome-stable || command -v google-chrome || command -v chromium)"
URL="file://$DIR/index.html?export${1:+#cfg=$1}"
mkdir -p "$OUT"

# El poster mide 2245 x 3179 px de CSS (96 por pulgada): la escala DPI/96 da la resolucion
# pedida. Se renderiza a esa escala (no se achica despues), asi el texto queda nitido.
DPI="${DPI:-200}"
ESCALA="$(awk "BEGIN{print $DPI/96}")"
ANCHO="$(awk "BEGIN{printf \"%d\", 594/25.4*$DPI+0.5}")"
ALTO="$(awk "BEGIN{printf \"%d\", 841/25.4*$DPI+0.5}")"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor="$ESCALA" --window-size=2245,3179 \
  --virtual-time-budget=5000 \
  --screenshot="$OUT/raw.png" "$URL" 2>/dev/null

magick "$OUT/raw.png" -crop "${ANCHO}x${ALTO}+0+0" +repage \
  -units PixelsPerInch -density "$DPI" \
  -define png:compression-level=9 -define png:compression-filter=5 \
  "$OUT/bandonear-poster-a1.png"
rm "$OUT/raw.png"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf="$OUT/bandonear-poster-a1.pdf" "$URL" 2>/dev/null

echo "Listo:"
ls -lh "$OUT"
