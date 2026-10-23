"""Genera los SVG del logo de BandoneAR en assets/logo/.

El isotipo cuenta el producto de izquierda a derecha: el cabezal tradicional
(botones redondos), el fuelle que pasa del crema al dorado y el cabezal digital
(teclas cuadradas, los switches). La palabra "BandoneAR" es Playfair Display 800
convertida a curvas, así el SVG no depende de tener la fuente instalada.

Uso (necesita fonttools y brotli):
    pip install fonttools brotli
    python assets/logo/generar_logo.py
"""
import math
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "logo"

# Las tres paletas del deck, las variantes celestes y dos monocromas.
PALETTES = {
    "noche": {"ink": "#f4f1eb", "acc": "#d7a54a"},
    "carmin": {"ink": "#f7efe8", "acc": "#d44a45"},
    "programa": {"ink": "#140f0c", "acc": "#9a6b1f"},
    # Variantes de color del logo (independientes de la paleta)
    "celeste": {"ink": "#ffffff", "acc": "#74acdf"},
    "celeste-fondo-claro": {"ink": "#140f0c", "acc": "#3f86c6"},
    "celeste-sol": {"ink": "#ffffff", "acc": "#74acdf", "sol": True},
    "celeste-sol-fondo-claro": {"ink": "#140f0c", "acc": "#3f86c6", "sol": True},
    "mono-claro": {"ink": "#ffffff", "acc": "#ffffff"},
    "mono-oscuro": {"ink": "#000000", "acc": "#000000"},
}


def mix(a, b, t):
    """Mezcla dos colores hex: t=0 da a, t=1 da b."""
    ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(ca, cb))


# ---------- Sol de Mayo minimalista (mismo dibujo que el editor, logo/index.html) ----------
SOL_AMARILLO = "#f6b40e"


def sol_mayo(color, cx=60, cy=40, radius=9.5, sw=1.3):
    """Disco con 16 rayos: rectos y ondulados alternados."""
    def rd(n):
        return f"{round(n, 2):g}"

    def pt(ang, d):
        return cx + math.cos(ang) * d, cy + math.sin(ang) * d

    rays = []
    for i in range(16):
        ang = i * 2 * math.pi / 16 - math.pi / 2
        if i % 2 == 0:
            (x1, y1), (x2, y2) = pt(ang, radius * 0.64), pt(ang, radius)
            rays.append(f'<line x1="{rd(x1)}" y1="{rd(y1)}" x2="{rd(x2)}" y2="{rd(y2)}"/>')
        else:
            a, b = radius * 0.64, radius * 0.94
            nx, ny, amp = -math.sin(ang), math.cos(ang), radius * 0.09

            def at(t, o):
                x, y = pt(ang, a + (b - a) * t)
                return f"{rd(x + nx * o)} {rd(y + ny * o)}"
            rays.append(f'<path fill="none" d="M{at(0, 0)} C{at(0.33, amp)} {at(0.66, -amp)} {at(1, 0)}"/>')
    return (f'<circle cx="{cx}" cy="{cy}" r="{rd(radius * 0.46)}" fill="{color}"/>'
            f'<g stroke="{color}" stroke-width="{sw}" stroke-linecap="round">{"".join(rays)}</g>')


# ---------- Isotipo (viewBox 0 0 120 80) ----------
ISO_W, ISO_H = 120, 80
HEAD = "M{a} 17 L{b} 8 H{c} L{d} 17 V63 L{c} 72 H{b} L{a} 63 Z"


def isotipo(ink, acc, sol=False):
    left = HEAD.format(a=6, b=16, c=30, d=36)
    right = HEAD.format(a=84, b=94, c=108, d=114)
    dots = [(15, 27), (15, 37), (15, 47), (15, 57),
            (21.5, 32), (21.5, 42), (21.5, 52),
            (28, 27), (28, 37), (28, 47), (28, 57)]
    keys = [(x, y) for y in (25, 34, 43, 52) for x in (92, 101)]
    # Cuatro pliegues en perspectiva; el color avanza del crema al dorado.
    # Con sol, van en franjas como la bandera y se recortan alrededor del sol.
    pleats = []
    # Fuelle centrado entre los cabezales: de x 42 a 78, centro en 60
    for i, x in enumerate((42, 52, 62, 72)):
        color = (acc if i in (0, 3) else ink) if sol else mix(ink, acc, i / 3)
        pleats.append(f'<path fill="{color}" d="M{x} 12 L{x + 6} 8 V72 L{x} 68Z"/>')
    if sol:
        pleats = ['<mask id="solcorte" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="80">'
                  '<rect width="120" height="80" fill="#fff"/><circle cx="60" cy="40" r="11.5" fill="#000"/></mask>'
                  '<g mask="url(#solcorte)">' + "".join(pleats) + "</g>", sol_mayo(SOL_AMARILLO)]
    return "\n".join([
        f'<path d="{left}" fill="none" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/>',
        f'<g fill="{ink}">' + "".join(f'<circle cx="{x}" cy="{y}" r="2.4"/>' for x, y in dots) + "</g>",
        *pleats,
        f'<path d="{right}" fill="none" stroke="{acc}" stroke-width="4" stroke-linejoin="round"/>',
        f'<g fill="{acc}">' + "".join(f'<rect x="{x}" y="{y}" width="5" height="5" rx="1"/>' for x, y in keys) + "</g>",
    ])


# ---------- Palabra en curvas ----------
def wordmark():
    font = instantiateVariableFont(TTFont(ROOT / "assets/fonts/playfair-latin.woff2"), {"wght": 800})
    glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    track = -20  # el mismo ajuste negativo que usan los títulos del deck

    def run(text, x):
        pen, bounds = SVGPathPen(glyphs), BoundsPen(glyphs)
        for ch in text:
            name = cmap[ord(ch)]
            glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
            glyphs[name].draw(TransformPen(bounds, (1, 0, 0, -1, x, 0)))
            x += hmtx[name][0] + track
        return pen.getCommands(), x, bounds.bounds

    bandone, x, b1 = run("Bandone", 0)
    ar, _, b2 = run("AR", x)
    box = (min(b1[0], b2[0]), min(b1[1], b2[1]), max(b1[2], b2[2]), max(b1[3], b2[3]))
    return bandone, ar, box, font["OS/2"].sCapHeight


def svg(view, body, title="BandoneAR"):
    x, y, w, h = view
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:g} {y:g} {w:g} {h:g}" '
            f'role="img" aria-label="{title}">\n<title>{title}</title>\n{body}\n</svg>\n')


def main():
    bandone, ar, (bx0, by0, bx1, by1), cap = wordmark()
    word_w = bx1 - bx0

    for name, c in PALETTES.items():
        iso = isotipo(c["ink"], c["acc"], c.get("sol", False))
        (OUT / f"isotipo-{name}.svg").write_text(svg((0, 0, ISO_W, ISO_H), iso))

        word = (f'<path fill="{c["ink"]}" d="{bandone}"/>\n'
                f'<path fill="{c["acc"]}" d="{ar}"/>')

        # Horizontal: isotipo centrado sobre la altura de mayúscula
        s = cap * 1.3 / ISO_H
        gap = cap * 0.42
        iso_w, iso_h = ISO_W * s, ISO_H * s
        tx = iso_w + gap - bx0
        iso_y = -cap / 2 - iso_h / 2
        top, bottom = min(iso_y, by0), max(iso_y + iso_h, by1)
        body = (f'<g transform="translate(0 {iso_y:.1f}) scale({s:.4f})">\n{iso}\n</g>\n'
                f'<g transform="translate({tx:.1f} 0)">\n{word}\n</g>')
        (OUT / f"logo-horizontal-{name}.svg").write_text(
            svg((0, top, iso_w + gap + word_w, bottom - top), body))

        # Vertical: isotipo arriba, palabra abajo
        s = word_w * 0.5 / ISO_W
        iso_w, iso_h = ISO_W * s, ISO_H * s
        gap = cap * 0.55
        word_y = iso_h + gap - by0
        body = (f'<g transform="translate({(word_w - iso_w) / 2:.1f} 0) scale({s:.4f})">\n{iso}\n</g>\n'
                f'<g transform="translate({-bx0:.1f} {word_y:.1f})">\n{word}\n</g>')
        (OUT / f"logo-vertical-{name}.svg").write_text(
            svg((0, 0, word_w, word_y + by1), body))

    # Favicon: isotipo noche sobre un cuadrado oscuro
    iso = isotipo(PALETTES["noche"]["ink"], PALETTES["noche"]["acc"])
    body = (f'<rect width="128" height="128" rx="28" fill="#0d0d0f"/>\n'
            f'<g transform="translate(6 30) scale(.966)">\n{iso}\n</g>')
    (OUT / "favicon.svg").write_text(svg((0, 0, 128, 128), body))
    print("Listo:", ", ".join(sorted(p.name for p in OUT.glob("*.svg"))))


if __name__ == "__main__":
    main()
