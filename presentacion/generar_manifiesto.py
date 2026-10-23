"""Genera presentacion/manifiesto.js: la lista de imágenes, logos y videos del
repo para el selector de assets del editor de la presentación. Un navegador no
puede listar carpetas desde file://, por eso la lista se arma acá.

Uso:
    python presentacion/generar_manifiesto.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRUPOS = {
    "imagenes": ("assets/img", {".jpg", ".jpeg", ".png", ".webp"}),
    "logos": ("assets/logo", {".svg"}),
    "videos": ("assets/video", {".mp4", ".webm"}),
}

manifiesto = {}
for grupo, (carpeta, exts) in GRUPOS.items():
    archivos = sorted(p for p in (ROOT / carpeta).iterdir() if p.suffix.lower() in exts)
    # Rutas relativas a presentacion/index.html
    manifiesto[grupo] = ["../" + p.relative_to(ROOT).as_posix() for p in archivos]

out = ROOT / "presentacion" / "manifiesto.js"
out.write_text("// Generado por presentacion/generar_manifiesto.py. No editar a mano.\n"
               "window.MANIFIESTO = " + json.dumps(manifiesto, indent=2, ensure_ascii=False) + ";\n")
print("Listo:", {k: len(v) for k, v in manifiesto.items()})
