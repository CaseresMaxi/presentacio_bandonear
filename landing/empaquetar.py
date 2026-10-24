#!/usr/bin/env python3
"""Arma la landing con todo adentro, lista para soltar en Netlify (o cualquier hosting estático).

    python3 landing/empaquetar.py [carpeta de salida]     # por defecto: dist/netlify

Genera index.html de producción (sin lo marcado como dev:inicio / dev:fin) y autocontenido: fuentes, favicon, imágenes, el script del logo y el video,
embebidos.

Las imágenes se pasan a WebP (como mucho 1600 px de ancho) y el video a 720p antes de
embeberlos, para que la página no pese 80 MB. Necesita ImageMagick (magick) y ffmpeg.
"""
import base64
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / 'dist' / 'netlify'
TMP = Path(tempfile.mkdtemp(prefix='bandonear-'))
TIPOS = {'.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4', '.js': 'text/javascript'}


def b64(ruta):
    return base64.b64encode(Path(ruta).read_bytes()).decode('ascii')


def data_uri(ruta):
    ruta = Path(ruta)
    return f'data:{TIPOS[ruta.suffix]};base64,{b64(ruta)}'


def imagen(ruta):
    """WebP de como mucho 1600 px de ancho, calidad 80."""
    ruta = Path(ruta)
    sal = TMP / (ruta.stem + '.webp')
    if not sal.exists():
        subprocess.run(['magick', str(ruta), '-resize', '1600x>', '-quality', '80', '-define', 'webp:method=6', str(sal)], check=True)
    return data_uri(sal)


def video(ruta):
    """720p H.264 con el índice al principio, para que arranque sin esperar el final."""
    sal = TMP / 'video720.mp4'
    if not sal.exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(ruta), '-vf', 'scale=-2:720', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
                        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(sal)], check=True)
    return sal


def script_inline(ruta):
    codigo = Path(ruta).read_text(encoding='utf-8').replace('</script', '<\\/script')
    return f'<script>\n{codigo}\n</script>'


def comunes(html, desde):
    """Fuentes, favicon, imágenes y el script del logo, relativos a la carpeta "desde"."""
    def abs_(rel):
        return (desde / rel).resolve()
    html = re.sub(r"url\('(\.\./assets/fonts/[^']+\.woff2)'\)", lambda m: f"url('{data_uri(abs_(m.group(1)))}')", html)
    html = re.sub(r'href="(\.\./assets/logo/favicon\.svg)"', lambda m: f'href="{data_uri(abs_(m.group(1)))}"', html)
    html = re.sub(r'(src|poster)="(\.\./assets/img/[^"]+)"', lambda m: f'{m.group(1)}="{imagen(abs_(m.group(2)))}"', html)
    html = html.replace('<script src="../logo/logo.js"></script>', script_inline(RAIZ / 'logo' / 'logo.js'))
    return html


def produccion(html):
    """Saca lo de desarrollo: lo que está entre dev:inicio y dev:fin, en HTML, CSS o JS."""
    html, n = re.subn(r'[ \t]*(?:<!--|/\*|//) dev:inicio.*?dev:fin(?: -->| \*/)?[ \t]*\n', '', html, flags=re.S)
    if n == 0 or 'dev:' in html:
        sys.exit('landing: no se encontraron bien las marcas dev:inicio / dev:fin')
    return html


def landing():
    html = produccion((RAIZ / 'landing' / 'index.html').read_text(encoding='utf-8'))
    html = comunes(html, RAIZ / 'landing')
    # El video va al final, en base64: el resto de la página carga primero y el video se arma
    # como Blob recién cuando terminó de cargar todo
    mp4 = video(RAIZ / 'assets' / 'video' / 'proyecto_video_final.mp4')
    html = html.replace('src="../assets/video/proyecto_video_final.mp4" ', '')
    carga = f'''<script type="application/octet-stream" id="videoEmbebido">{b64(mp4)}</script>
<script>
  // Video embebido: se arma como Blob cuando la página terminó de cargar
  (function () {{
    const v = document.getElementById('video-el'), datos = document.getElementById('videoEmbebido');
    let listo = null;
    const armar = () => listo ??= fetch('data:video/mp4;base64,' + datos.textContent.trim()).then((r) => r.blob()).then((b) => {{ v.src = URL.createObjectURL(b); datos.remove(); }});
    addEventListener('load', () => setTimeout(armar, 300));
    // Si tocan reproducir antes de que esté listo, espera y arranca
    document.getElementById('playBtn').addEventListener('click', () => {{ if (!v.src) armar().then(() => v.play()); }}, true);
  }})();
</script>
</body>'''
    assert html.count('</body>') == 1
    html = html.replace('</body>', carga)
    return html


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    for nombre, html in (('index.html', landing()),):
        sueltos = re.findall(r'(?:src|href|poster)="(\.\./[^"]+)"|url\(\'(\.\./[^\']+)\'\)', html)
        if sueltos:
            sys.exit(f'{nombre}: quedan referencias sin embeber: {sueltos}')
        (SALIDA / nombre).write_text(html, encoding='utf-8')
        print(f'{SALIDA / nombre}  {len(html.encode()) / 1e6:.1f} MB')


main()
