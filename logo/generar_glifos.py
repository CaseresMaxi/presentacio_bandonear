"""Genera logo/glifos.js: las letras de "BandoneAR" en Playfair Display como
curvas SVG, en los pesos 400 a 900. Lo usa el editor del logo para exportar
SVG sin depender de la fuente.

Uso (necesita fonttools y brotli):
    python logo/generar_glifos.py
"""
import json
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
data = {}
for weight in range(400, 1000, 100):
    font = instantiateVariableFont(TTFont(ROOT / "assets/fonts/playfair-latin.woff2"), {"wght": weight})
    glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    letters = {}
    for ch in sorted(set("BandoneAR")):
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, 0, 0)))
        letters[ch] = {"d": pen.getCommands(), "adv": hmtx[name][0]}
    data[weight] = {"cap": font["OS/2"].sCapHeight, "letters": letters}

out = ROOT / "logo" / "glifos.js"
out.write_text("// Generado por logo/generar_glifos.py. No editar a mano.\nwindow.GLIFOS = "
               + json.dumps(data, separators=(",", ":")) + ";\n")
print("Listo:", out, out.stat().st_size // 1024, "KB")
