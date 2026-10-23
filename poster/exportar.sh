#!/usr/bin/env bash
# Exporta el poster en A1 (594 x 841 mm):
#   poster/salida/bandonear-poster-a1.png  7016 x 9933 px a 300 dpi
#   poster/salida/bandonear-poster-a1.pdf  PDF vectorial (texto nitido a cualquier escala)
#
# Uso: bash poster/exportar.sh [config]
# "config" es el codigo que genera el boton "Copiar comando de exportacion" del
# panel de parametros. Sin el, exporta los valores por defecto.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$DIR/salida"
CHROME="$(command -v google-chrome-stable || command -v google-chrome || command -v chromium)"
URL="file://$DIR/index.html?export${1:+#cfg=$1}"
mkdir -p "$OUT"

# El poster mide 2245 x 3179 px de CSS; a escala 3.125 da 300 dpi.
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=3.125 --window-size=2245,3179 \
  --virtual-time-budget=5000 \
  --screenshot="$OUT/raw.png" "$URL" 2>/dev/null

magick "$OUT/raw.png" -crop 7016x9933+0+0 +repage \
  -units PixelsPerInch -density 300 "$OUT/bandonear-poster-a1.png"
rm "$OUT/raw.png"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf="$OUT/bandonear-poster-a1.pdf" "$URL" 2>/dev/null

echo "Listo:"
ls -lh "$OUT"
