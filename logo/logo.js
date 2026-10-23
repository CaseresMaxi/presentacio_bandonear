// Dibujo del logo de BandoneAR: isotipo, sol y palabra en curvas.
// Lo usan el editor (logo/index.html) y el póster (poster/index.html).
// Necesita logo/glifos.js cargado antes.
(function () {
  // ---------- Puntos de partida: paletas del deck y variantes del logo ----------
  const PRESETS = {
    noche: { tinta: '#f4f1eb', acento: '#d7a54a', fondo: '#0d0d0f' },
    carmin: { tinta: '#f7efe8', acento: '#d44a45', fondo: '#14090b' },
    programa: { tinta: '#140f0c', acento: '#9a6b1f', fondo: '#f3eadc' },
    celeste: { tinta: '#ffffff', acento: '#74acdf', fondo: '#0d0d0f' },
    'celeste claro': { tinta: '#140f0c', acento: '#3f86c6', fondo: '#f3eadc' },
    'celeste con sol': { tinta: '#ffffff', acento: '#74acdf', fondo: '#0d0d0f', sol: 'mayo', pliegues: 'bandera' },
    'celeste con sol claro': { tinta: '#140f0c', acento: '#3f86c6', fondo: '#f3eadc', sol: 'mayo', pliegues: 'bandera' },
    'celeste barrotes': { tinta: '#ffffff', acento: '#74acdf', fondo: '#0d0d0f', sol: 'barrotes', pliegues: 'bandera', inclinacion: 0, grosorPliegue: 6.5, solTam: 7.5, solRecorte: 1.75, cabezales: 'contorno' },
    'barrotes solos': { tinta: '#ffffff', acento: '#74acdf', fondo: '#0d0d0f', sol: 'barrotes', pliegues: 'bandera', inclinacion: 0, grosorPliegue: 6.5, solTam: 7.5, solRecorte: 1.75, cabezales: 'ninguno' },
    'mono blanco': { tinta: '#ffffff', acento: '#ffffff', fondo: '#0d0d0f' },
    'mono negro': { tinta: '#000000', acento: '#000000', fondo: '#ffffff' },
  };

  const SCHEMA = [
    { group: 'Composición' },
    { key: 'layout', label: 'Versión', type: 'select', options: { horizontal: 'Horizontal', vertical: 'Vertical', isotipo: 'Solo isotipo', palabra: 'Solo palabra' }, def: 'horizontal' },
    { key: 'isoEscala', label: 'Tamaño del isotipo', type: 'range', min: 0.8, max: 2.2, step: 0.05, def: 1.3 },
    { key: 'separacion', label: 'Separación', type: 'range', min: 0.1, max: 1.2, step: 0.02, def: 0.42 },
    { key: 'margen', label: 'Margen', type: 'range', min: 0, max: 30, step: 1, def: 8, unit: '%' },
    { group: 'Colores' },
    { key: 'tinta', label: 'Tinta (cabezal tradicional)', type: 'color', def: '#f4f1eb' },
    { key: 'acento', label: 'Acento (cabezal digital)', type: 'color', def: '#d7a54a' },
    { key: 'pliegues', label: 'Color de los pliegues', type: 'select', options: { degradado: 'Degradado de tinta a acento', bandera: 'Bandera (acento afuera, tinta adentro)', tinta: 'Todo tinta', acento: 'Todo acento', alternado: 'Alternado' }, def: 'degradado' },
    { key: 'colorPalabra', label: '"Bandone" en', type: 'select', options: { tinta: 'Tinta', acento: 'Acento' }, def: 'tinta' },
    { key: 'colorAR', label: '"AR" en', type: 'select', options: { acento: 'Acento', tinta: 'Tinta' }, def: 'acento' },
    { group: 'Sol' },
    { key: 'sol', label: 'Estilo del sol', type: 'select', options: { ninguno: 'Sin sol', mayo: 'Sol de Mayo (rayos rectos y ondulados)', barrotes: 'Entre barrotes (se ve por las barras del medio)', rayos16: '16 rayos', rayos: '8 rayos', anillo: 'Anillo con rayos', circulo: 'Círculo', destello: 'Destello de 4 puntas' }, def: 'ninguno' },
    { key: 'solTam', label: 'Tamaño del sol', type: 'range', min: 5, max: 16, step: 0.5, def: 9.5 },
    { key: 'solColor', label: 'Color del sol', type: 'select', options: { sol: 'Amarillo sol', acento: 'Acento', tinta: 'Tinta', propio: 'Propio (abajo)' }, def: 'sol' },
    { key: 'solPropio', label: 'Color propio del sol', type: 'color', def: '#f6b40e' },
    { key: 'solGrosor', label: 'Grosor de los rayos', type: 'range', min: 0.6, max: 2.4, step: 0.1, def: 1.3 },
    { key: 'solRecorte', label: 'Aire alrededor (recorta el fuelle)', type: 'range', min: 0, max: 6, step: 0.25, def: 2 },
    { key: 'solY', label: 'Altura', type: 'range', min: -20, max: 20, step: 0.5, def: 0 },
    { group: 'Isotipo' },
    { key: 'cabezales', label: 'Cabezales', type: 'select', options: { contorno: 'Contorno', relleno: 'Rellenos (botones calados)', ninguno: 'Sin cabezales (solo el fuelle)' }, def: 'contorno' },
    { key: 'trazo', label: 'Grosor del contorno', type: 'range', min: 1.5, max: 7, step: 0.25, def: 4 },
    { key: 'esquinas', label: 'Esquinas', type: 'select', options: { round: 'Redondeadas', miter: 'Rectas' }, def: 'round' },
    { key: 'nPliegues', label: 'Pliegues del fuelle', type: 'range', min: 2, max: 6, step: 1, def: 4 },
    { key: 'grosorPliegue', label: 'Grosor de cada pliegue', type: 'range', min: 2, max: 10, step: 0.5, def: 6 },
    { key: 'inclinacion', label: 'Perspectiva de los pliegues', type: 'range', min: 0, max: 10, step: 0.5, def: 4 },
    { key: 'radioBoton', label: 'Botones (cabezal tradicional)', type: 'range', min: 1.2, max: 3.6, step: 0.1, def: 2.4 },
    { key: 'tecla', label: 'Teclas (cabezal digital)', type: 'range', min: 2.5, max: 7, step: 0.25, def: 5 },
    { key: 'teclaRadio', label: 'Redondeo de las teclas', type: 'range', min: 0, max: 3.5, step: 0.25, def: 1 },
    { group: 'Fondo y lienzo' },
    { key: 'fondo', label: 'Color de fondo', type: 'color', def: '#0d0d0f' },
    { key: 'fondoExport', label: 'Fondo al exportar', type: 'select', options: { transparente: 'Sin fondo (transparente)', elegido: 'Con el color de fondo', blanco: 'Blanco', negro: 'Negro' }, def: 'transparente' },
    { key: 'lienzo', label: 'Lienzo', type: 'select', options: { ajustado: 'Ajustado al logo', cuadrado: 'Cuadrado (avatar, redes)', ancho: '16:9 (portada, slide)', posteo: '4:5 (posteo)' }, def: 'ajustado' },
    { key: 'radioFondo', label: 'Esquinas del fondo', type: 'range', min: 0, max: 50, step: 1, def: 0, unit: '%' },
    { group: 'Palabra' },
    { key: 'peso', label: 'Peso de Playfair', type: 'range', min: 400, max: 900, step: 100, def: 800 },
    { key: 'tracking', label: 'Espaciado entre letras', type: 'range', min: -60, max: 60, step: 2, def: -20 },
  ];
  const FIELDS = SCHEMA.filter((f) => f.key);
  const DEFAULTS = Object.fromEntries(FIELDS.map((f) => [f.key, f.def]));

  function mix(a, b, t) {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return '#' + pa.map((x, i) => Math.round(x + (pb[i] - x) * t).toString(16).padStart(2, '0')).join('');
  }
  const r = (n) => +n.toFixed(2);

  // ---------- Isotipo (viewBox 0 0 120 80), misma geometría que generar_logo.py ----------
  const head = (a, b, c, d) => `M${a} 17 L${b} 8 H${c} L${d} 17 V63 L${c} 72 H${b} L${a} 63 Z`;
  const DOTS = [[15, 27], [15, 37], [15, 47], [15, 57], [21.5, 32], [21.5, 42], [21.5, 52], [28, 27], [28, 37], [28, 47], [28, 57]];
  const KEYS = [27.5, 36.5, 45.5, 54.5].flatMap((y) => [[94.5, y], [103.5, y]]);

  const SOL_AMARILLO = '#f6b40e';
  let uid = 0;

  const solColor = (c) => (c.solColor === 'acento' ? c.acento : c.solColor === 'tinta' ? c.tinta
    : c.solColor === 'propio' ? c.solPropio : SOL_AMARILLO);

  // Sol minimalista centrado en el fuelle (60, 40)
  function sol(c) {
    const cx = 60, cy = 40 + c.solY, R0 = c.solTam;
    const color = solColor(c);
    const sw = r(c.solGrosor);
    const pt = (ang, d) => [r(cx + Math.cos(ang) * d), r(cy + Math.sin(ang) * d)];
    const ray = (ang, a, b) => { const [x1, y1] = pt(ang, a), [x2, y2] = pt(ang, b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; };
    const wavy = (ang, a, b) => {
      // Rayo ondulado: una S suave a lo largo del rayo
      const n = [-Math.sin(ang), Math.cos(ang)], amp = R0 * 0.09;
      const at = (t, o) => { const [x, y] = pt(ang, a + (b - a) * t); return `${r(x + n[0] * o)} ${r(y + n[1] * o)}`; };
      return `<path fill="none" d="M${at(0, 0)} C${at(0.33, amp)} ${at(0.66, -amp)} ${at(1, 0)}"/>`;
    };
    const disk = (k) => `<circle cx="${cx}" cy="${r(cy)}" r="${r(R0 * k)}" fill="${color}"/>`;
    const rays = (n, f) => Array.from({ length: n }, (_, i) => f(i * 2 * Math.PI / n - Math.PI / 2, i)).join('');
    const stroke = (inner) => `<g stroke="${color}" stroke-width="${sw}" stroke-linecap="round">${inner}</g>`;
    switch (c.sol) {
      case 'circulo': return disk(0.62);
      case 'rayos': return disk(0.46) + stroke(rays(8, (a) => ray(a, R0 * 0.66, R0)));
      case 'rayos16': return disk(0.46) + stroke(rays(16, (a, i) => ray(a, R0 * 0.66, i % 2 ? R0 * 0.84 : R0)));
      case 'mayo': return disk(0.46) + stroke(rays(16, (a, i) => (i % 2 ? wavy(a, R0 * 0.64, R0 * 0.94) : ray(a, R0 * 0.64, R0))));
      case 'anillo': return `<circle cx="${cx}" cy="${r(cy)}" r="${r(R0 * 0.4)}" fill="none" stroke="${color}" stroke-width="${sw}"/>` + stroke(rays(8, (a) => ray(a, R0 * 0.66, R0)));
      case 'destello': {
        const q = (x, y) => `${r(x)} ${r(y)}`;
        return `<path fill="${color}" d="M${q(cx, cy - R0)} Q${q(cx, cy)} ${q(cx + R0, cy)} Q${q(cx, cy)} ${q(cx, cy + R0)} Q${q(cx, cy)} ${q(cx - R0, cy)} Q${q(cx, cy)} ${q(cx, cy - R0)}Z"/>`;
      }
      default: return '';
    }
  }

  // Caja del isotipo: sin cabezales queda solo el fuelle
  const isoBox = (c) => (c.cabezales === 'ninguno' ? { x: 38, w: 44 } : { x: 0, w: 120 });

  function isotipo(c) {
    const { tinta, acento } = c;
    const join = `stroke-linejoin="${c.esquinas}"`;
    const n = c.nPliegues, w = c.grosorPliegue, s = c.inclinacion;
    const pitch = n > 1 ? (36 - w) / (n - 1) : 0;
    const cy = r(40 + c.solY);
    const barrotes = c.sol === 'barrotes';
    const pleats = [];
    for (let i = 0; i < n; i++) {
      // Fuelle centrado entre los cabezales (x 42 a 78, centro en 60)
      const x = 42 + i * pitch;
      const t = n > 1 ? i / (n - 1) : 1;
      const fill = c.pliegues === 'tinta' ? tinta : c.pliegues === 'acento' ? acento
        : c.pliegues === 'alternado' ? (i % 2 ? acento : tinta)
        : c.pliegues === 'bandera' ? (i === 0 || i === n - 1 ? acento : tinta) : mix(tinta, acento, t);
      const d = `M${r(x)} ${r(8 + s)} L${r(x + w)} 8 V72 L${r(x)} ${r(72 - s)}Z`;
      pleats.push({ d, fill, inner: i > 0 && i < n - 1 });
    }
    const draw = (list) => list.map((p) => `<path fill="${p.fill}" d="${p.d}"/>`).join('');
    const cut = () => {
      const id = 'solcorte' + (++uid);
      return { id, mask: `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="80"><rect width="120" height="80" fill="#fff"/><circle cx="60" cy="${cy}" r="${r(c.solTam + c.solRecorte)}" fill="#000"/></mask>` };
    };

    let pleatsSvg, sun = '';
    if (barrotes) {
      // El sol se ve solo a través de las barras del medio, con aire curvo arriba y abajo
      const inner = pleats.filter((p) => p.inner), outer = pleats.filter((p) => !p.inner);
      const clip = 'solbarras' + (++uid);
      const m = c.solRecorte > 0 ? cut() : null;
      pleatsSvg = draw(outer)
        + (m ? `${m.mask}<g mask="url(#${m.id})">${draw(inner)}</g>` : draw(inner))
        + `<clipPath id="${clip}">${inner.map((p) => `<path d="${p.d}"/>`).join('')}</clipPath>`;
      sun = `<circle cx="60" cy="${cy}" r="${r(c.solTam)}" fill="${solColor(c)}" clip-path="url(#${clip})"/>`;
    } else {
      sun = c.sol !== 'ninguno' ? sol(c) : '';
      pleatsSvg = draw(pleats);
      // Con sol, los pliegues se recortan en círculo para dejarle aire
      if (sun && c.solRecorte > 0) { const m = cut(); pleatsSvg = `${m.mask}<g mask="url(#${m.id})">${pleatsSvg}</g>`; }
    }

    // Cabezales: contorno, rellenos con los botones calados, o ninguno
    const k = c.tecla, kr = Math.min(c.teclaRadio, k / 2);
    const dots = DOTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${c.radioBoton}"/>`).join('');
    const keys = KEYS.map(([x, y]) => `<rect x="${r(x - k / 2)}" y="${r(y - k / 2)}" width="${k}" height="${k}" rx="${kr}"/>`).join('');
    const headSvg = (d, color, marks) => {
      if (c.cabezales === 'relleno') {
        const id = 'calado' + (++uid);
        return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="80"><rect width="120" height="80" fill="#fff"/><g fill="#000">${marks}</g></mask>`
          + `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="${c.trazo}" ${join} mask="url(#${id})"/>`;
      }
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${c.trazo}" ${join}/><g fill="${color}">${marks}</g>`;
    };
    const heads = c.cabezales === 'ninguno' ? ['', '']
      : [headSvg(head(6, 16, 30, 36), tinta, dots), headSvg(head(84, 94, 108, 114), acento, keys)];
    return [heads[0], pleatsSvg, sun, heads[1]].join('\n');
  }

  // ---------- Palabra en curvas ----------
  const bboxCache = {};
  function palabra(c) {
    const font = GLIFOS[c.peso];
    let x = 0;
    const run = (text) => text.split('').map((ch) => {
      const g = font.letters[ch];
      const p = `<path transform="translate(${x} 0)" d="${g.d}"/>`;
      x += g.adv + c.tracking;
      return p;
    }).join('');
    const bandone = run('Bandone'), ar = run('AR');
    const key = c.peso + '|' + c.tracking;
    if (!bboxCache[key]) {
      // Caja real de las letras, medida en el navegador
      let m = document.getElementById('bandonear-measure');
      if (!m) {
        m = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        m.id = 'bandonear-measure';
        m.setAttribute('aria-hidden', 'true');
        m.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
        document.body.appendChild(m);
      }
      m.innerHTML = `<g>${bandone}${ar}</g>`;
      const b = m.firstChild.getBBox();
      bboxCache[key] = { x: b.x, y: b.y, w: b.width, h: b.height };
    }
    const col = (v) => (v === 'acento' ? c.acento : c.tinta);
    return {
      svg: `<g fill="${col(c.colorPalabra)}">${bandone}</g><g fill="${col(c.colorAR)}">${ar}</g>`,
      box: bboxCache[key], cap: font.cap,
    };
  }

  // ---------- Composición completa ----------
  // Color de fondo de la exportación (null = transparente)
  const exportBg = (c) => ({ transparente: null, elegido: c.fondo, blanco: '#ffffff', negro: '#000000' })[c.fondoExport];
  const RATIOS = { cuadrado: 1, ancho: 16 / 9, posteo: 4 / 5 };

  function buildSVG(c, { background = exportBg(c) } = {}) {
    const word = palabra(c);
    const iso = isotipo(c);
    const B = isoBox(c);
    const { cap } = word, b = word.box;
    let body, W, H, x0 = 0, y0 = 0;

    if (c.layout === 'isotipo') {
      body = iso; x0 = B.x; W = B.w; H = 80;
    } else if (c.layout === 'palabra') {
      body = word.svg; x0 = b.x; y0 = b.y; W = b.w; H = b.h;
    } else if (c.layout === 'horizontal') {
      const s = cap * c.isoEscala / 80;
      const iw = B.w * s, ih = 80 * s, gap = cap * c.separacion;
      const iy = -cap / 2 - ih / 2;
      const top = Math.min(iy, b.y), bottom = Math.max(iy + ih, b.y + b.h);
      body = `<g transform="translate(${r(-B.x * s)} ${r(iy)}) scale(${s.toFixed(4)})">${iso}</g>`
        + `<g transform="translate(${r(iw + gap - b.x)} 0)">${word.svg}</g>`;
      y0 = top; W = iw + gap + b.w; H = bottom - top;
    } else {
      const ih = cap * c.isoEscala * 1.9, s = ih / 80, iw = B.w * s;
      const gap = cap * c.separacion * 1.3;
      const W0 = Math.max(iw, b.w);
      body = `<g transform="translate(${r((W0 - iw) / 2 - B.x * s)} 0) scale(${s.toFixed(4)})">${iso}</g>`
        + `<g transform="translate(${r((W0 - b.w) / 2 - b.x)} ${r(ih + gap - b.y)})">${word.svg}</g>`;
      W = W0; H = ih + gap + b.h;
    }
    const m = Math.max(W, H) * c.margen / 100;
    let vx = x0 - m, vy = y0 - m, vw = W + 2 * m, vh = H + 2 * m;
    // Lienzo con proporción fija: se agranda el lado corto, el logo queda centrado
    const ratio = RATIOS[c.lienzo];
    if (ratio) {
      if (vw / vh < ratio) { const nw = vh * ratio; vx -= (nw - vw) / 2; vw = nw; }
      else { const nh = vw / ratio; vy -= (nh - vh) / 2; vh = nh; }
    }
    const vb = [vx, vy, vw, vh].map(r);
    const rad = r(Math.min(vw, vh) / 2 * c.radioFondo / 50);
    const bg = background ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" rx="${rad}" fill="${background}"/>` : '';
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="BandoneAR">\n<title>BandoneAR</title>\n${bg}\n${body}\n</svg>\n`,
      ratio: vb[2] / vb[3],
    };
  }

  window.BandoneARLogo = { PRESETS, SCHEMA, FIELDS, DEFAULTS, mix, sol, isotipo, isoBox, palabra, buildSVG, exportBg };
})();
