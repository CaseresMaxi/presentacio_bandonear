// Tipos de escena de la presentación timeline (timeline.html). Se suman a los de
// motion-tipos.js y usan los mismos atributos de movimiento (data-m, data-s, data-at…).
// Además, data-out="1-4" aparta un elemento durante esos puntos clave (la cámara hace
// zoom sobre un dibujo y el título no tiene que quedar debajo del encabezado).
//
// Todas las ilustraciones son SVG generado acá: toman los colores del tema (var(--…)),
// sus rótulos salen de los campos de la escena (se editan con un clic) y se animan con
// tick(root, t), así sirven tal cual para motion graphics.
(function () {
  const { md, esc, lines, pairs } = window.PRESENTACION;
  const nn = (i) => String(i).padStart(2, '0');
  const f2 = (x) => x.toFixed(2);
  const modo = (d, def) => (d.pasos === 'uno' || d.pasos === 'todo' ? d.pasos : def);
  const NS = 'http://www.w3.org/2000/svg';

  const kicker = (d, at = 0, x = '') => `<div class="kicker" data-f="kicker" data-k="kicker" data-m="wipe" data-at="${at}" data-dur=".8" ${x}><i></i><span>${md(d.kicker)}</span></div>`;
  const titulo = (d, at = 0.12, cls = '', x = '') => `<h2 class="${cls}" data-f="titulo" data-k="titulo" data-m="words" data-at="${at}" ${x}>${md(d.titulo)}</h2>`;
  // Puntos: todos juntos o uno por punto clave (desde el paso "desde")
  const paso = (uno, i, base, desde = 1, dim = true) => (uno ? `data-s="${i + desde}" data-at=".05"${dim ? ' data-dim' : ''}` : `data-at="${f2(base + i * 0.16)}"`);
  // Marca oculta de un punto clave: el tick lee su opacidad para saber en qué paso está la escena
  const marca = (s) => `<i class="mk" data-mk="${s}" data-m="fade" data-s="${s}" data-dur=".4"></i>`;
  const enPaso = (root, s) => +(root.querySelector(`[data-mk="${s}"]`)?.style.opacity || 0) > 0.5;

  // ---------- El bandoneón, de frente ----------
  // viewBox 0 0 1000 520. Botones en arcos: 33 a la izquierda, 38 a la derecha.
  const oct = (x0, y0, x1, y1, c) => `${x0 + c},${y0} ${x1 - c},${y0} ${x1},${y0 + c} ${x1},${y1 - c} ${x1 - c},${y1} ${x0 + c},${y1} ${x0},${y1 - c} ${x0},${y0 + c}`;
  function botonera(cx, filas) {
    const out = [];
    filas.forEach((n, r) => {
      for (let i = 0; i < n; i++) {
        const u = n > 1 ? (i - (n - 1) / 2) / ((n - 1) / 2 + 0.5) : 0;
        out.push([cx + (i - (n - 1) / 2) * 25, 128 + r * 33 - 18 * (1 - u * u)]);
      }
    });
    return out;
  }
  function cabezal(x0, lado, filas) {
    const x1 = x0 + 280, cx = (x0 + x1) / 2;
    const ros = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<circle cx="${f2(cx + Math.cos(a) * 42)}" cy="${f2(372 + Math.sin(a) * 42)}" r="7"/>`; }).join('');
    return `<g class="bn-${lado}">
      <polygon class="bn-caja" points="${oct(x0, 60, x1, 460, 34)}"/>
      <polygon class="bn-filete" points="${oct(x0 + 16, 76, x1 - 16, 444, 26)}"/>
      <g class="bn-calado"><circle cx="${cx}" cy="372" r="16"/>${ros}</g>
      <rect class="bn-correa" x="${x0 + 34}" y="252" width="212" height="18" rx="9"/>
      <g class="bn-botones">${botonera(cx, filas).map(([x, y]) => `<circle class="bk" cx="${f2(x)}" cy="${f2(y)}" r="9"/>`).join('')}</g>
    </g>`;
  }
  function fuelleFrente(x0 = 300, x1 = 700, n = 14) {
    const w = (x1 - x0) / n;
    return `<g class="bn-fuelle">${Array.from({ length: n }, (_, i) => {
      const x = x0 + i * w;
      return `<polygon class="bn-pl ${i % 2 ? 'b' : 'a'}" points="${f2(x)},92 ${f2(x + w / 2)},78 ${f2(x + w)},92 ${f2(x + w)},428 ${f2(x + w / 2)},442 ${f2(x)},428"/>` +
        `<path class="bn-esq" d="M${f2(x + w / 2 - 6)} 80 h12 M${f2(x + w / 2 - 6)} 440 h12"/>`;
    }).join('')}</g>`;
  }
  const bandoneon = (cls = '', x = '') => `<svg class="bn ${cls}" viewBox="0 0 1000 520" ${x}>${fuelleFrente()}${cabezal(20, 'l', [4, 6, 7, 8, 8])}${cabezal(700, 'r', [5, 7, 8, 9, 9])}</svg>`;
  // Respira: el fuelle se estira y los cabezales lo acompañan
  function respirar(root, t, amp = 1) {
    root.querySelectorAll('svg.bn').forEach((svg) => {
      const o = Math.sin(t * 1.15) * 0.5 + Math.sin(t * 0.43) * 0.18, sx = 1 + 0.16 * o * amp;
      svg.querySelector('.bn-fuelle')?.setAttribute('transform', `translate(500 0) scale(${f2(sx)} 1) translate(-500 0)`);
      svg.querySelector('.bn-l')?.setAttribute('transform', `translate(${f2(-200 * (sx - 1))} 0)`);
      svg.querySelector('.bn-r')?.setAttribute('transform', `translate(${f2(200 * (sx - 1))} 0)`);
    });
  }
  // Botones que se encienden como si alguien tocara
  function tocar(root, t, cada = 0.32, cuantos = 3) {
    const ks = root.querySelectorAll('svg.bn .bk');
    if (!ks.length) return;
    const k = Math.floor(t / cada), on = new Set();
    for (let j = 0; j < cuantos; j++) on.add(Math.abs(Math.floor(Math.sin((k + j * 0.37) * 12.9898 + j * 78.233) * 43758.5453)) % ks.length);
    ks.forEach((b, i) => b.classList.toggle('on', on.has(i)));
  }

  // ---------- Íconos (viewBox 0 0 120 80 para instrumentos, 0 0 90 90 para desafíos) ----------
  const ICO_INS = {
    piano: '<path d="M10 34 L30 10 L110 10 L110 34"/><rect x="10" y="34" width="100" height="36" rx="3"/>' + Array.from({ length: 9 }, (_, i) => `<line x1="${20 + i * 10}" y1="34" x2="${20 + i * 10}" y2="70"/>`).join('') + [0, 1, 3, 4, 5, 7, 8].map((i) => `<rect class="fill" x="${17 + i * 10}" y="34" width="6" height="20"/>`).join(''),
    bateria: '<circle cx="60" cy="50" r="24"/><circle cx="60" cy="50" r="9"/><ellipse cx="24" cy="36" rx="16" ry="6"/><path d="M8 36 v14 a16 6 0 0 0 32 0 v-14"/><line x1="86" y1="20" x2="114" y2="14"/><line x1="100" y1="17" x2="100" y2="74"/>',
    violin: '<path d="M52 12 C40 12 38 26 44 32 C34 36 32 52 40 60 C30 66 34 78 52 78 L68 78 C86 78 90 66 80 60 C88 52 86 36 76 32 C82 26 80 12 68 12 Z"/><line x1="60" y1="2" x2="60" y2="70"/><path d="M50 44 q-4 6 0 12 M70 44 q4 6 0 12"/>',
    guitarra: '<circle cx="44" cy="54" r="20"/><circle cx="66" cy="38" r="14"/><line x1="72" y1="32" x2="110" y2="8"/><circle cx="50" cy="50" r="5"/>',
    bandoneon: '<rect x="6" y="18" width="30" height="48" rx="5"/><rect x="84" y="18" width="30" height="48" rx="5"/><path d="M36 22 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 M36 62 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4"/><line x1="36" y1="22" x2="36" y2="62"/><line x1="84" y1="22" x2="84" y2="62"/>' + [48, 60, 72].map((x) => `<line x1="${x}" y1="20" x2="${x}" y2="64"/>`).join(''),
  };
  const icoIns = (nombre) => {
    const n = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const k = Object.keys(ICO_INS).find((x) => n.includes(x.slice(0, 5)));
    return ICO_INS[k] || ICO_INS.piano;
  };
  const chip = '<g class="chip"><rect x="92" y="52" width="22" height="22" rx="3"/>' + [0, 1, 2].map((i) => `<path d="M${97 + i * 6} 52 v-5 M${97 + i * 6} 74 v5"/>`).join('') + '</g>';

  const ICO = {
    lupa: '<circle cx="38" cy="38" r="22"/><line x1="54" y1="54" x2="78" y2="78" class="grueso"/><path d="M28 36 a10 10 0 0 1 10 -10"/>',
    herramientas: '<path d="M14 76 L46 44"/><rect x="40" y="26" width="34" height="14" rx="4" transform="rotate(-45 57 33)"/><path d="M68 22 L80 10"/><path d="M50 60 q14 4 18 20" class="fino"/><path d="M14 20 l10 10 m-4 -14 l-10 10 l20 20 l10 -10 z"/>',
    impresora: '<rect x="10" y="8" width="70" height="74" rx="4"/><line x1="10" y1="26" x2="80" y2="26"/><g class="cabezal"><rect x="34" y="22" width="16" height="10" rx="2"/><path d="M38 32 l4 7 l4 -7"/></g><g class="capas"></g><line x1="18" y1="74" x2="72" y2="74"/>',
    teclado: Array.from({ length: 3 }, (_, r) => Array.from({ length: 5 - (r % 2) }, (_, i) => `<circle cx="${(r % 2 ? 23 : 13) + i * 16}" cy="${24 + r * 20 - (i === 2 ? 4 : 0)}" r="6"/>`).join('')).join(''),
    fuelle: '<rect x="6" y="20" width="16" height="52" rx="3"/><rect x="68" y="20" width="16" height="52" rx="3"/><path class="pl" d="M22 24 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l4 4 M22 68 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l4 -4"/>',
    encoder: '<circle cx="45" cy="45" r="32"/><g class="rueda">' + Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${f2(45 + Math.cos(a) * 20)}" y1="${f2(45 + Math.sin(a) * 20)}" x2="${f2(45 + Math.cos(a) * 28)}" y2="${f2(45 + Math.sin(a) * 28)}"/>`; }).join('') + '</g><circle cx="45" cy="45" r="6" class="fill"/>',
    switch: '<path d="M14 52 h62 l-6 26 h-50 z"/><path d="M18 52 l4 -18 h46 l4 18"/><g class="vastago"><rect x="34" y="12" width="22" height="22" rx="2" class="fill"/></g><path d="M30 78 v8 M60 78 v8"/>',
    pcb: '<rect x="10" y="14" width="70" height="62" rx="4"/><rect x="34" y="34" width="22" height="22"/><path d="M10 30 h18 v8 M80 60 h-18 v-8 M45 14 v20 M45 56 v20" class="fino"/><path class="tacha" d="M6 84 L84 6"/>',
    construccion: '<path class="pl" d="M8 30 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10"/><path class="pl" d="M8 60 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10"/><line x1="8" y1="45" x2="88" y2="45"/>' + Array.from({ length: 9 }, (_, i) => `<line x1="${12 + i * 9}" y1="41" x2="${12 + i * 9}" y2="${i % 2 ? 45 : 49}"/>`).join(''),
  };

  const TIPOS = {
    // ---------- Portada: el título y el instrumento respirando ----------
    'tl-portada': {
      render: (d, ctx) => `
        <div class="tlp">
          ${kicker(d, 0.5)}
          <div class="lockup"><div class="lk-logo" data-f="logo" data-m="pop" data-at=".7" data-dur="1.1">${ctx.logo()}</div><h1 data-f="titulo" data-m="letters" data-at=".9">${md(d.titulo)}</h1></div>
          <p class="sub" data-f="subtitulo" data-m="words" data-at="1.5" data-dur=".6" data-stagger=".022">${md(d.subtitulo)}</p>
          <ol class="tlp-fases">${ctx.fases.map((f, i) => `<li data-m="up" data-at="${f2(2.1 + i * 0.12)}"><em>${nn(i + 1)}</em>${esc(f)}</li>`).join('')}</ol>
          <div class="meta" data-f="equipo" data-m="up" data-at="2.8"><b>${esc(d.equipo)}</b><span>${esc(d.institucion)}</span></div>
        </div>
        <div class="tlp-art" data-k="hero" data-m="zoom" data-at=".2" data-dur="1.6">${bandoneon()}</div>`,
      tick(root, t) { respirar(root, t); tocar(root, t, 0.45, 2); },
    },

    // ---------- Apertura de etapa: número grande y el riel en grande ----------
    hito: {
      render: (d, ctx) => {
        const n = ctx.fases.length || 1, f = Math.max(1, ctx.fase);
        return `
        <div class="h-num" data-m="fade" data-dur="1.2" data-par="1.6"><span>${nn(f)}</span></div>
        <div class="h-num lleno" data-m="wipe" data-at=".35" data-dur="1.2" data-par="1.6"><span>${nn(f)}</span></div>
        <div class="h-txt">${kicker(d, 0.3)}${titulo(d, 0.45, 'h-tit')}
          ${d.cuerpo ? `<p class="body" data-f="cuerpo" data-m="up" data-at="1">${md(d.cuerpo)}</p>` : ''}</div>
        <div class="h-rail">
          <div class="h-line" data-m="wipe" data-at=".2" data-dur="1.4"><b style="width:${((f - 1) / n) * 100}%"></b></div>
          ${ctx.fases.map((t, k) => `<div class="h-node${k + 1 < f ? ' pas' : ''}${k + 1 === f ? ' cur' : ''}" style="left:${(k / n) * 100}%" data-m="pop" data-at="${f2(0.5 + k * 0.1)}"><i></i><span><em>${nn(k + 1)}</em>${esc(t)}</span></div>`).join('')}
        </div>`;
      },
      tick(root, t) {
        const i = root.querySelector('.h-node.cur i');
        if (i) i.style.boxShadow = `0 0 0 ${f2(10 + 16 * ((t * 0.7) % 1))}px color-mix(in srgb, var(--accent) ${Math.round(40 * (1 - ((t * 0.7) % 1)))}%, transparent)`;
      },
    },

    // ---------- La guía de papel ----------
    guia: {
      pasos: 'uno',
      render: (d) => {
        const bs = lines(d.botones).map((l) => { const [num, notas = '', pos = ''] = l.split('|').map((x) => x.trim()); const [a, b] = notas.split('/').map((x) => x.trim()); const [x, y] = pos.split(',').map(Number); return { num, a, b, x: x || 0, y: y || 0 }; });
        const uno = modo(d, 'uno') === 'uno';
        // Botón destacado en la lupa: el "6", o el del medio
        const fi = Math.max(0, bs.findIndex((b) => b.num === '6')), fb = bs[fi] || bs[Math.floor(bs.length / 2)] || { num: '', a: '', b: '', x: 400, y: 260 };
        const K = 1.073, X0 = 860, Y0 = 231, sx = X0 + fb.x * K, sy = Y0 + fb.y * K;
        const LX = 1560, LY = 770;
        const s = (k, at) => (uno ? `data-s="${k}" data-at="${at}"` : `data-at="${f2(1.6 + k * 0.6 + at)}"`);
        return `
        <div class="g-col">${kicker(d)}${titulo(d, 0.12, 'md')}
          <p class="body sm" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>
          <ol class="points sm g-pts">${lines(d.puntos).map((p, i) => `<li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="left" ${paso(uno, i, 1.4)}><span class="num">${nn(i + 1)}</span><span>${md(p)}</span></li>`).join('')}</ol>
        </div>
        <div class="paper" data-k="hero" data-shape="box" data-m="reveal" data-at=".2" data-dur="1.3">
          <svg class="g-svg" viewBox="0 0 820 520">${bs.map((b, i) => `
            <g class="gb" data-f="botones" data-m="pop" data-at="${f2(0.7 + i * 0.028)}" data-dur=".6">
              <text class="gn" x="${b.x}" y="${b.y - 38}">${esc(b.num)}</text><circle cx="${b.x}" cy="${b.y}" r="30"/>
              ${b.b ? `<text class="ga" x="${b.x}" y="${b.y - 5}">${esc(b.a)}</text><line x1="${b.x - 17}" x2="${b.x + 17}" y1="${b.y + 2}" y2="${b.y + 2}"/><text class="ga" x="${b.x}" y="${b.y + 24}">${esc(b.b)}</text>`
                : `<text class="ga uno" x="${b.x}" y="${b.y + 9}">${esc(b.a)}</text>`}</g>`).join('')}
            <circle class="g-ring" cx="${fb.x}" cy="${fb.y}" r="38" data-m="draw" ${s(1, 0)} data-dur=".6"/>
          </svg>
          <p class="g-nota" data-f="nota" data-m="fade" data-at="1.8">${md(d.nota)}</p>
        </div>
        <svg class="g-hilo" viewBox="0 0 1920 1080"><path data-m="draw" ${s(1, 0.2)} data-dur=".6" d="M${f2(sx + 30)} ${f2(sy + 26)} L${LX - 108} ${LY - 108}"/></svg>
        <div class="lupa" style="left:${LX - 150}px; top:${LY - 150}px" data-m="pop" ${s(1, 0.4)} data-dur=".8">
          <span class="ln">${esc(fb.num)}</span><span class="lc">${fb.b ? `<b>${esc(fb.a)}</b><i></i><b>${esc(fb.b)}</b>` : `<b>${esc(fb.a)}</b>`}</span>
        </div>
        <div class="tag" style="left:${LX - 420}px; top:${LY - 118}px" data-m="left" ${s(1, 0.7)}>N.º de botón →</div>
        <div class="tag ac" style="left:${LX - 380}px; top:${LY - 30}px" data-m="left" ${s(2, 0.1)}>abriendo →</div>
        <div class="tag ac" style="left:${LX - 380}px; top:${LY + 40}px" data-m="left" ${s(2, 0.3)}>cerrando →</div>`;
      },
    },

    // ---------- Cada instrumento y su versión digital ----------
    instrumentos: {
      pasos: 'uno',
      render: (d, ctx) => {
        const ps = pairs(d.pares), uno = modo(d, 'uno') === 'uno', last = ps.length - 1;
        const at = (i, x) => (i === last && uno ? `data-s="1" data-at="${x}"` : i === last ? `data-at="${f2(2.4 + x)}"` : `data-at="${f2(0.9 + i * 0.25 + x)}"`);
        const fin = uno ? 'data-s="2" data-at=".1"' : 'data-at="3.6"';
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}
          ${d.cuerpo ? `<p class="body sm wide" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>` : ''}</div>
        <div class="ins">${ps.map((p, i) => `
          <div class="ins-row${i === last ? ' ult' : ''}">
            <div class="ins-a" data-f="pares" data-k="item-${i}" data-shape="box" data-m="left" ${at(i, 0)}><svg class="ico" viewBox="0 0 120 80">${icoIns(p.t)}</svg><b>${esc(p.t)}</b></div>
            <svg class="ins-flecha" viewBox="0 0 300 40"><path data-m="draw" ${at(i, 0.3)} data-dur=".6" d="M10 20 H280 M266 8 L282 20 L266 32"/></svg>
            <div class="ins-b${p.d === '?' ? ' q' : ''}" data-f="pares" data-m="pop" ${at(i, 0.65)}>${p.d === '?' ? '<b class="qq">?</b>' : `<svg class="ico dig" viewBox="0 0 120 80">${icoIns(p.t)}${chip}</svg><b>${esc(p.d)}</b>`}</div>
            ${i === last && d.respuesta ? `<div class="ins-b resp" data-f="respuesta" data-m="pop" ${fin} data-dur="1">${ctx.logo()}<b>${md(d.respuesta)}</b></div>` : ''}
          </div>`).join('')}
        </div>`;
      },
      tick(root, t) { const q = root.querySelector('.qq'); if (q) q.style.transform = `scale(${f2(1 + 0.08 * Math.sin(t * 4))})`; },
    },

    // ---------- Anatomía: la cámara recorre las partes ----------
    anatomia: {
      pasos: 'uno',
      // Mundo de la escena: el dibujo va de 410 a 1510 (x) y de 330 a 902 (y)
      focos: (d) => (modo(d, 'uno') === 'uno' ? [{ x: 960, y: 540, s: 1 }, { x: 640, y: 640, s: 1.3 }, { x: 960, y: 610, s: 1.3 }, { x: 1280, y: 640, s: 1.3 }, { x: 1320, y: 600, s: 1.55 }, { x: 960, y: 540, s: 1 }] : []),
      render: (d) => {
        const ps = pairs(d.partes), uno = modo(d, 'uno') === 'uno';
        // [left, top, ancla x, ancla y] de cada rótulo (coordenadas de la escena)
        const POS = [[140, 760, 586, 640], [770, 300, 960, 430], [1440, 760, 1334, 640], [1520, 330, 1334, 726]];
        const last = ps.length;
        const st = (i) => (uno ? `data-s="${i + 1}" data-at=".55"${i + 2 < last + 1 ? ` data-out="${i + 2}-${last}"` : ''}` : `data-at="${f2(1.2 + i * 0.3)}"`);
        return `
        <div class="pad">${kicker(d, 0, uno ? 'data-out="1-4"' : '')}${titulo(d, 0.12, 'md wide', uno ? 'data-out="1-4"' : '')}</div>
        <div class="an-art" data-k="hero" data-m="zoom" data-at=".3" data-dur="1.4">${bandoneon()}
          <svg class="an-rayos" viewBox="0 0 1000 520" data-m="fade" ${uno ? 'data-s="4" data-at=".2"' : 'data-at="2.4"'} data-dur=".8">
            <rect x="738" y="300" width="204" height="128" rx="10"/>
            ${Array.from({ length: 6 }, (_, i) => `<path d="M${758 + i * 30} 312 v40 l26 26 v38"/><rect x="${751 + i * 30}" y="392" width="20" height="10" rx="2"/>`).join('')}
          </svg>
        </div>
        <svg class="an-lineas" viewBox="0 0 1920 1080">${POS.slice(0, ps.length).map(([x, y, ax, ay], i) => {
          const ex = x + (x < ax ? 380 : 0), ey = y + 40;
          return `<path data-m="draw" ${st(i)} data-dur=".6" d="M${ax} ${ay} L${ex} ${ey}"/><circle cx="${ax}" cy="${ay}" r="9" data-m="pop" ${st(i)}/>`;
        }).join('')}</svg>
        ${ps.map((p, i) => { const [x, y] = POS[i] || [140, 300]; return `<div class="an-card${x > 1500 ? ' angosta' : ''}" style="left:${x}px; top:${y}px" data-f="partes" data-m="up" ${st(i)}><b>${esc(p.t)}</b><span>${md(p.d)}</span></div>`; }).join('')}
        ${d.nota ? `<p class="anota" data-f="nota" data-m="up" ${uno ? `data-s="${ps.length + 1}" data-at=".6"` : 'data-at="2.8"'}>${md(d.nota)}</p>` : ''}`;
      },
      tick(root, t) { respirar(root, t, 0.6); },
    },

    // ---------- La máquina por dentro: botón, brazo, zapata, voces ----------
    mecanismo: {
      pasos: 'uno',
      render: (d) => {
        const L = lines(d.partes), uno = modo(d, 'uno') === 'uno';
        const lab = (i, x, y, ax, ay, anchor = 'start') => `<g data-f="partes" data-m="fade" data-at="${f2(1.2 + i * 0.12)}"><path class="lead" d="M${ax} ${ay} L${x + (anchor === 'end' ? 8 : -8)} ${y - 8}"/><circle class="dot" cx="${ax}" cy="${ay}" r="5"/><text class="lbl" x="${x}" y="${y}" text-anchor="${anchor}">${esc(L[i] || '')}</text></g>`;
        return `${marca(1)}${marca(2)}
        <div class="m-col">${kicker(d)}${titulo(d, 0.12, 'md')}
          <ol class="points sm">${lines(d.puntos).map((p, i) => `<li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="left" ${uno ? `data-s="${i + 1}" data-at=".05" data-dim` : `data-at="${f2(0.9 + i * 0.2)}"`}><span class="num">${nn(i + 1)}</span><span>${md(p)}</span></li>`).join('')}</ol>
        </div>
        <div class="m-card" data-k="hero" data-shape="box" data-m="pop" data-at=".3" data-dur="1">
          <svg class="mec" viewBox="0 0 900 640">
            <rect class="tabla" x="60" y="300" width="565" height="30" rx="4" data-m="wipe" data-at=".5"/>
            <rect class="tabla" x="675" y="300" width="185" height="30" rx="4" data-m="wipe" data-at=".6"/>
            <g class="camara" data-m="up" data-at=".8">
              <rect x="560" y="330" width="180" height="230" rx="8"/>
              <line x1="560" y1="448" x2="740" y2="448"/>
              <circle class="rem" cx="582" cy="392" r="6"/><path class="voz va" d="M582 392 L718 392"/>
              <circle class="rem" cx="582" cy="506" r="6"/><path class="voz vc" d="M582 506 L718 506"/>
            </g>
            <g class="aire">${Array.from({ length: 9 }, () => '<circle r="6"/>').join('')}</g>
            <g class="brazo"><path class="arm" d="M200 214 L270 228 L650 248"/><path class="arm-r" d="M650 248 V270"/><rect class="zapata" x="595" y="270" width="110" height="24" rx="5"/><rect class="cuero" x="595" y="290" width="110" height="8" rx="3"/></g>
            <circle class="pivote" cx="270" cy="228" r="9"/>
            <g class="boton"><rect class="vara" x="194" y="150" width="12" height="66"/><ellipse class="nacar" cx="200" cy="140" rx="34" ry="16"/></g>
            ${lab(0, 260, 120, 230, 140)}${lab(1, 380, 200, 420, 236)}${lab(2, 760, 260, 705, 280)}${lab(3, 360, 400, 650, 316, 'start')}${lab(4, 760, 380, 718, 392)}${lab(5, 760, 520, 718, 506)}
            <text class="dir" x="120" y="590"></text>
          </svg>
        </div>`;
      },
      tick(root, t) {
        const s1 = enPaso(root, 1), s2 = enPaso(root, 2);
        // Ciclo de 2,4 s: aprieta, sostiene (suena) y suelta. En el paso 2 alterna abre / cierra
        const c = (t % 2.4) / 2.4, ciclo = Math.floor(t / 2.4);
        const p = !s1 ? 0 : c < 0.15 ? c / 0.15 : c < 0.75 ? 1 : c < 0.9 ? 1 - (c - 0.75) / 0.15 : 0;
        const e = p * p * (3 - 2 * p), abre = !s2 || ciclo % 2 === 0;
        root.querySelector('.mec .boton')?.setAttribute('transform', `translate(0 ${f2(16 * e)})`);
        root.querySelector('.mec .brazo')?.setAttribute('transform', `rotate(${f2(-9 * e)} 270 228)`);
        const sonando = e > 0.8;
        [['.va', abre], ['.vc', !abre]].forEach(([sel, on]) => {
          const v = root.querySelector('.mec ' + sel);
          if (!v) return;
          const y = +v.getAttribute('d').split(' ')[1], amp = on && sonando ? 7 * Math.sin(t * 60) : 0;
          v.setAttribute('d', `M582 ${y} Q650 ${f2(y + amp)} 718 ${f2(y + amp * 1.6)}`);
          v.classList.toggle('on', on && sonando);
        });
        [...(root.querySelector('.mec .aire')?.children || [])].forEach((b, i) => {
          const k = ((t * 0.9 + i / 9) % 1), y = abre ? 170 + k * 420 : 590 - k * 420;
          b.setAttribute('cx', 650 + Math.sin(k * 9 + i) * 10); b.setAttribute('cy', f2(y));
          b.style.opacity = sonando ? f2(Math.sin(k * Math.PI)) : 0;
        });
        const dir = root.querySelector('.mec .dir');
        if (dir) dir.textContent = !s1 ? '' : abre ? 'fuelle abriendo ▲ · aspira' : 'fuelle cerrando ▼ · sopla';
      },
    },

    // ---------- De lo mecánico a lo electrónico ----------
    traduccion: {
      pasos: 'uno',
      render: (d) => {
        const ps = pairs(d.pares), uno = modo(d, 'uno') === 'uno';
        const st = (i, at) => (uno ? `data-s="${i + 1}" data-at="${at}"` : `data-at="${f2(0.9 + i * 0.3 + at)}"`);
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="tr-h" style="left:140px" data-f="izqTitulo" data-m="wipe" data-at=".5">${esc(d.izqTitulo)}</div>
        <div class="tr-h ac" style="left:1060px" data-f="derTitulo" data-m="wipe" data-at=".6">${esc(d.derTitulo)}</div>
        <svg class="links" viewBox="0 0 1920 1080">${ps.map((p, i) => { const y = 433 + i * 102; return `<path data-m="draw" data-dur=".6" ${st(i, 0.25)} d="M760 ${y} C900 ${y} 920 ${y} 1050 ${y}"/>`; }).join('')}<g class="packets"></g></svg>
        ${ps.map((p, i) => `
          <div class="tr-a" style="top:${390 + i * 102}px" data-f="pares" data-k="item-${i}" data-shape="box" data-m="left" ${st(i, 0)}><span class="num">${nn(i + 1)}</span>${md(p.t)}</div>
          <div class="tr-b" style="top:${390 + i * 102}px" data-f="pares" data-m="pop" ${st(i, 0.6)}>${md(p.d)}</div>`).join('')}`;
      },
      tick(root, t) {
        const g = root.querySelector('.packets');
        if (!g) return;
        const paths = [...root.querySelectorAll('.links path')];
        if (!g.childElementCount) paths.forEach(() => g.appendChild(document.createElementNS(NS, 'circle')).setAttribute('r', 7));
        paths.forEach((p, i) => {
          const c = g.children[i];
          if (!(p._p >= 1)) { c.style.opacity = 0; return; }
          const len = p._len || (p._len = p.getTotalLength()), pt = p.getPointAtLength(len * ((t * 0.5 + i * 0.21) % 1));
          c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = p.style.opacity;
        });
      },
    },

    // ---------- El fuelle y el encoder ----------
    'fuelle-desafio': {
      pasos: 'todo',
      render: (d) => {
        const uno = modo(d, 'todo') === 'uno';
        return `
        <div class="fd-col">${kicker(d)}${titulo(d, 0.12, 'md')}
          <p class="body sm" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>
          <ul class="bullets">${lines(d.puntos).map((p, i) => `<li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="up" ${paso(uno, i, 1.0)}>${md(p)}</li>`).join('')}</ul>
        </div>
        <div class="fd-card" data-k="hero" data-shape="box" data-m="pop" data-at=".4" data-dur="1">
          <svg class="fd" viewBox="0 0 880 640">
            <g class="fd-fuelle"></g>
            <rect class="fd-cab" x="40" y="130" width="130" height="330" rx="16"/>
            <g class="fd-der"><rect class="fd-cab" x="0" y="130" width="130" height="330" rx="16"/></g>
            <g class="fd-enc" transform="translate(105 92)"><circle r="44"/><g class="rueda">${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<line x1="${f2(Math.cos(a) * 26)}" y1="${f2(Math.sin(a) * 26)}" x2="${f2(Math.cos(a) * 38)}" y2="${f2(Math.sin(a) * 38)}"/>`; }).join('')}</g><circle r="8" class="eje"/></g>
            <text class="ll" x="160" y="74">ENCODER</text>
            <g transform="translate(40 520)">
              <text class="ll" x="0" y="0">POSICIÓN</text><rect class="trk" x="160" y="-16" width="600" height="16" rx="8"/><rect class="pos" x="160" y="-16" width="0" height="16" rx="8"/>
              <text class="ll" x="0" y="50">VELOCIDAD</text><rect class="trk" x="160" y="34" width="600" height="16" rx="8"/><rect class="vel" x="460" y="34" width="0" height="16" rx="8"/>
              <text class="fd-dir" x="0" y="104"></text>
            </g>
          </svg>
        </div>`;
      },
      tick(root, t) {
        const svg = root.querySelector('svg.fd');
        if (!svg) return;
        const pos = (x) => 0.5 + 0.42 * Math.sin(x * 1.05) + 0.06 * Math.sin(x * 2.7);
        const o = pos(t), v = (pos(t + 0.02) - pos(t - 0.02)) / 0.04;
        const x0 = 170, x1 = 170 + 260 + o * 330, n = 12, w = (x1 - x0) / n;
        let top = `M${x0} 150`, bot = `M${x0} 440`, folds = '';
        for (let i = 0; i < n; i++) {
          const a = x0 + i * w;
          top += ` L${f2(a + w / 2)} ${i % 2 ? 150 : 128} L${f2(a + w)} 150`;
          bot += ` L${f2(a + w / 2)} ${i % 2 ? 440 : 462} L${f2(a + w)} 440`;
          folds += `<line x1="${f2(a + w)}" y1="150" x2="${f2(a + w)}" y2="440"/>`;
        }
        svg.querySelector('.fd-fuelle').innerHTML = `<path class="fd-body" d="M${x0} 150 H${f2(x1)} V440 H${x0} Z"/><g class="fd-folds">${folds}</g><path class="fd-edge" d="${top}"/><path class="fd-edge" d="${bot}"/>`;
        svg.querySelector('.fd-der').setAttribute('transform', `translate(${f2(x1)} 0)`);
        svg.querySelector('.fd-enc .rueda').setAttribute('transform', `rotate(${f2(o * 540)})`);
        svg.querySelector('.pos').setAttribute('width', f2(600 * o));
        const vw = Math.max(-1, Math.min(1, v / 0.6)) * 300;
        const vel = svg.querySelector('.vel');
        vel.setAttribute('x', f2(vw < 0 ? 460 + vw : 460)); vel.setAttribute('width', f2(Math.abs(vw)));
        svg.querySelector('.fd-dir').textContent = v >= 0 ? 'abre ▲ · nota de abrir' : 'cierra ▼ · nota de cerrar';
      },
    },

    // ---------- Veredicto: dos sellos ----------
    veredicto: {
      pasos: 'uno',
      render: (d) => {
        const ps = pairs(d.items), uno = modo(d, 'uno') === 'uno';
        const st = (i, at) => (uno ? `data-s="${i}" data-at="${f2(at + (i ? 0 : 0.6))}"` : `data-at="${f2(0.8 + i * 0.6 + at)}"`);
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="vd">${ps.slice(0, 2).map((p, i) => `
          <div class="vd-card" data-f="items" data-k="item-${i}" data-shape="box" data-m="up" ${st(i, 0)}>
            <svg class="sello" viewBox="0 0 200 200"><circle class="anillo" cx="100" cy="100" r="88"/><circle cx="100" cy="100" r="70" class="fondo"/>
              <path class="tilde" data-m="draw" ${st(i, 0.4)} data-dur=".7" d="M62 102 L90 130 L142 74"/></svg>
            <b>${md(p.t)}</b><span>${md(p.d)}</span>
          </div>`).join('')}</div>
        ${d.nota ? `<p class="anota" data-f="nota" data-m="up" ${uno ? 'data-s="1" data-at="1"' : 'data-at="2.4"'}>${md(d.nota)}</p>` : ''}`;
      },
      tick(root, t) { root.querySelectorAll('.sello .anillo').forEach((c) => c.setAttribute('transform', `rotate(${f2(t * 12)} 100 100)`)); },
    },

    // ---------- Componentes y su función ----------
    componentes: {
      pasos: 'todo',
      render: (d) => {
        const ps = pairs(d.items).slice(0, 10), uno = modo(d, 'todo') === 'uno';
        const st = (i, at = 0) => (uno ? `data-s="${i + 1}" data-at="${f2(0.05 + at)}"` : `data-at="${f2(0.8 + i * 0.18 + at)}"`);
        // Posición de cada número sobre el dibujo (viewBox 0 0 900 600)
        const MK = [[40, 112], [848, 140], [292, 140], [120, 278], [450, 74], [450, 496], [290, 298], [222, 372], [772, 384], [884, 346]];
        const pins = (x, y) => [0, 1, 2, 3].map((i) => `<path d="M${x + 8 + i * 12} ${y} v-8 M${x + 8 + i * 12} ${y + 50} v8 M${x} ${y + 8 + i * 12} h-8 M${x + 50} ${y + 8 + i * 12} h8"/>`).join('');
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="cp-art" data-k="hero" data-shape="box" data-m="pop" data-at=".3" data-dur="1">
          <svg class="cp" viewBox="0 0 900 600">
            <rect class="cab" x="40" y="110" width="260" height="370" rx="26"/><rect class="cab" x="600" y="110" width="260" height="370" rx="26"/>
            <path class="fu" d="M300 150 ${Array.from({ length: 10 }, (_, i) => `L${330 + i * 30 - 15} ${i % 2 ? 150 : 132} L${330 + i * 30} 150`).join(' ')} V440 ${Array.from({ length: 10 }, (_, i) => `L${600 - i * 30 - 15} ${i % 2 ? 440 : 458} L${600 - i * 30 - 30} 440`).join(' ')} Z"/>
            ${Array.from({ length: 9 }, (_, i) => `<line class="fu-l" x1="${330 + i * 30}" y1="150" x2="${330 + i * 30}" y2="440"/>`).join('')}
            <g class="teclas">${Array.from({ length: 3 }, (_, r) => Array.from({ length: 6 }, (_, i) => `<circle cx="${80 + i * 34 + (r % 2) * 17}" cy="${168 + r * 32}" r="11"/>`).join('')).join('')}</g>
            <g class="sw">${Array.from({ length: 3 }, (_, r) => Array.from({ length: 6 }, (_, i) => `<rect x="${630 + i * 34 + (r % 2) * 17}" y="${156 + r * 32}" width="22" height="22" rx="4"/>`).join('')).join('')}</g>
            <g class="chipg"><rect x="80" y="280" width="50" height="50" rx="6"/>${pins(80, 280)}<rect x="640" y="280" width="50" height="50" rx="6"/>${pins(640, 280)}</g>
            <path class="onda" d="M160 306 q12 -26 24 0 t24 0 t24 0 t24 0 t24 0"/>
            <g class="parl"><circle cx="170" cy="410" r="40"/><circle cx="170" cy="410" r="24"/><circle cx="170" cy="410" r="8"/><circle cx="780" cy="300" r="30"/><circle cx="780" cy="300" r="16"/></g>
            <g class="bat"><rect x="640" y="388" width="120" height="50" rx="8"/><rect x="760" y="402" width="10" height="22" rx="3"/><rect class="carga" x="650" y="398" width="70" height="30" rx="4"/></g>
            <g class="puertos"><rect x="860" y="320" width="22" height="18" rx="3"/><rect x="860" y="356" width="22" height="14" rx="7"/></g>
            <g class="enc"><circle cx="450" cy="116" r="26"/>${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<line x1="${f2(450 + Math.cos(a) * 14)}" y1="${f2(116 + Math.sin(a) * 14)}" x2="${f2(450 + Math.cos(a) * 22)}" y2="${f2(116 + Math.sin(a) * 22)}"/>`; }).join('')}</g>
            ${ps.map((p, i) => { const [x, y] = MK[i]; return `<g class="mk-n" data-f="items" data-m="pop" ${st(i, 0.15)}><circle cx="${x}" cy="${y}" r="19"/><text x="${x}" y="${y + 7}">${i + 1}</text></g>`; }).join('')}
          </svg>
        </div>
        <ol class="cp-list">${ps.map((p, i) => `<li class="pt" data-f="items" data-k="item-${i}" data-shape="bar" data-m="left" ${st(i)}${uno ? ' data-dim' : ''}><span class="num">${i + 1}</span><span><b>${md(p.t)}</b><small>${md(p.d)}</small></span></li>`).join('')}</ol>`;
      },
      tick(root, t) {
        root.querySelector('.cp .enc')?.setAttribute('transform', `rotate(${f2(Math.sin(t * 1.1) * 90)} 450 116)`);
        const c = root.querySelector('.cp .carga'); if (c) c.setAttribute('width', f2(20 + 80 * ((t * 0.25) % 1)));
        const o = root.querySelector('.cp .onda'); if (o) o.setAttribute('transform', `translate(0 ${f2(Math.sin(t * 5) * 3)})`);
      },
    },

    // ---------- Switch mecánico en corte ----------
    switch: {
      pasos: 'todo',
      render: (d) => {
        const L = lines(d.partes), uno = modo(d, 'todo') === 'uno';
        const lab = (i, x, y, ax, ay, anchor = 'end') => `<g data-f="partes" data-m="fade" data-at="${f2(1.3 + i * 0.12)}"><path class="lead" d="M${ax} ${ay} L${x + (anchor === 'end' ? 10 : -10)} ${y - 8}"/><circle class="dot" cx="${ax}" cy="${ay}" r="5"/><text class="lbl" x="${x}" y="${y}" text-anchor="${anchor}">${esc(L[i] || '')}</text></g>`;
        return `
        <div class="fd-col">${kicker(d)}${titulo(d, 0.12, 'md')}
          <p class="body sm" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>
          <ul class="bullets">${lines(d.puntos).map((p, i) => `<li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="up" ${paso(uno, i, 1.0)}>${md(p)}</li>`).join('')}</ul>
        </div>
        <div class="fd-card" data-k="hero" data-shape="box" data-m="pop" data-at=".4" data-dur="1">
          <svg class="sw-svg" viewBox="0 0 880 640">
            <path class="pinz" d="M210 560 v50 M330 560 v50"/>
            <polygon class="base" points="120,430 420,430 440,560 100,560"/>
            <path class="resorte"/>
            <g class="cont"><path class="hoja a" d="M372 370 L372 500"/><path class="hoja b" d="M392 370 L384 500"/></g>
            <g class="vast"><rect class="eje" x="252" y="300" width="36" height="150" rx="4"/><rect class="cruz" x="220" y="170" width="100" height="136" rx="10"/><path class="mas" d="M270 196 v40 M250 216 h40"/></g>
            <polygon class="tapa" points="100,300 440,300 420,430 120,430"/>
            <circle class="led" cx="470" cy="330" r="12"/>
            ${lab(0, 190, 160, 230, 196)}${lab(1, 190, 520, 262, 510)}${lab(2, 90, 420, 112, 400)}${lab(3, 470, 470, 392, 450, 'start')}
            <g transform="translate(560 160)">
              <text class="ll" x="0" y="0">FUERZA</text>
              <path class="ax" d="M0 20 V320 H290"/>
              <path class="curva" d="M0 230 L280 190"/>
              <line class="act" x1="120" y1="40" x2="120" y2="320"/>
              <text class="ll" x="126" y="58">ACTUACIÓN</text>
              <text class="ll" x="290" y="350" text-anchor="end">RECORRIDO</text>
              <circle class="pt-c" r="10" cx="0" cy="230"/>
              <text class="lin" x="0" y="400">lineal: parejo, sin escalón</text>
            </g>
          </svg>
        </div>`;
      },
      tick(root, t) {
        const svg = root.querySelector('svg.sw-svg');
        if (!svg) return;
        const c = (t % 2.2) / 2.2, p0 = c < 0.3 ? c / 0.3 : c < 0.5 ? 1 : c < 0.8 ? 1 - (c - 0.5) / 0.3 : 0, p = p0 * p0 * (3 - 2 * p0);
        const dy = 110 * p;
        svg.querySelector('.vast').setAttribute('transform', `translate(0 ${f2(dy)})`);
        const y0 = 450 + dy, y1 = 552, n = 7, h = (y1 - y0) / n;
        let s = `M270 ${f2(y0)}`;
        for (let i = 0; i < n; i++) s += ` L${i % 2 ? 236 : 304} ${f2(y0 + h * (i + 0.5))}`;
        svg.querySelector('.resorte').setAttribute('d', s + ` L270 ${y1}`);
        const on = p > 0.43;
        svg.querySelector('.hoja.b').setAttribute('d', on ? 'M392 370 L374 500' : 'M392 370 L384 500');
        svg.querySelector('.cont').classList.toggle('on', on);
        svg.querySelector('.led').classList.toggle('on', on);
        const pc = svg.querySelector('.pt-c'); pc.setAttribute('cx', f2(280 * p)); pc.setAttribute('cy', f2(230 - 40 * p));
      },
    },

    // ---------- Desafíos y decisiones: tres filas, la cámara baja de una en una ----------
    desafios: {
      pasos: 'uno',
      render: (d) => {
        const it = lines(d.items).map((l) => { const [ico, t, ...r] = l.split('|').map((x) => x.trim()); return { ico, t, d: r.join(' | ') }; });
        const uno = modo(d, 'uno') === 'uno';
        const st = (i, at = 0) => { const r = Math.floor(i / 3), c = i % 3; return uno ? `data-s="${r}" data-at="${f2((r ? 0.15 : 0.7) + c * 0.22 + at)}"` : `data-at="${f2(0.7 + i * 0.16 + at)}"`; };
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <svg class="links ds-links" viewBox="0 0 1920 1080">${it.map((_, i) => { if (i % 3 === 2 || i === it.length - 1) return ''; const y = 330 + Math.floor(i / 3) * 210 + 85, x = 140 + (i % 3) * 570 + 500; return `<path data-m="draw" data-dur=".4" ${st(i, 0.2)} d="M${x + 6} ${y} H${x + 64}"/>`; }).join('')}</svg>
        ${it.slice(0, 9).map((x, i) => `
          <div class="ds-card" style="left:${140 + (i % 3) * 570}px; top:${330 + Math.floor(i / 3) * 210}px" data-f="items" data-k="item-${i}" data-shape="box" data-m="up" ${st(i)}>
            <svg class="ico ds-ico i-${esc(x.ico)}" viewBox="0 0 90 90">${ICO[x.ico] || ICO.lupa}</svg>
            <div><em>${nn(i + 1)}</em><b>${md(x.t)}</b><span>${md(x.d)}</span></div>
          </div>`).join('')}`;
      },
      tick(root, t) {
        root.querySelectorAll('.i-encoder .rueda').forEach((g) => g.setAttribute('transform', `rotate(${f2(t * 60)} 45 45)`));
        root.querySelectorAll('.i-lupa > *').forEach((g) => g.setAttribute('transform', `translate(${f2(Math.sin(t * 1.4) * 3)} ${f2(Math.cos(t * 1.4) * 3)})`));
        root.querySelectorAll('.i-fuelle .pl').forEach((g) => g.setAttribute('transform', `translate(22 0) scale(${f2(0.85 + 0.15 * Math.sin(t * 2))} 1) translate(-22 0)`));
        root.querySelectorAll('.i-switch .vastago').forEach((g) => g.setAttribute('transform', `translate(0 ${f2(Math.max(0, Math.sin(t * 3)) * 10)})`));
        root.querySelectorAll('.i-impresora').forEach((svg) => {
          const k = (t * 0.35) % 1, n = Math.floor(k * 7);
          svg.querySelector('.capas').innerHTML = Array.from({ length: n }, (_, i) => `<rect x="${30 + i}" y="${67 - i * 5}" width="${30 - i * 2}" height="5" class="fill"/>`).join('');
          svg.querySelector('.cabezal').setAttribute('transform', `translate(${f2(Math.sin(t * 6) * 14)} ${f2(36 - n * 5)})`);
        });
        root.querySelectorAll('.i-teclado circle').forEach((c, i) => c.classList.toggle('on', Math.floor(t * 2.5) % 14 === i));
      },
    },

    // ---------- Demo en vivo ----------
    demo: {
      render: (d) => `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}
          ${d.cuerpo ? `<p class="body sm wide" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>` : ''}</div>
        <div class="vivo" data-m="pop" data-at=".9"><i></i>EN VIVO</div>
        <div class="dm-art" data-k="hero" data-m="zoom" data-at=".4" data-dur="1.4">${bandoneon()}</div>
        <div class="dm-mon" data-m="up" data-at="1.2"><small data-f="nota">${md(d.nota)}</small><pre></pre></div>`,
      tick(root, t) {
        respirar(root, t, 1.2); tocar(root, t, 0.28, 3);
        const pre = root.querySelector('.dm-mon pre');
        if (!pre) return;
        const notes = [69, 71, 72, 74, 76, 74, 72, 71], k = Math.floor(t * 2.6), rows = [];
        for (let i = Math.max(0, k - 5); i <= k; i++) {
          const n = notes[i % notes.length], on = i % 2 === 0;
          rows.push(`${on ? 'Note On ' : 'Note Off'}  ch 1  nota ${n}  vel ${on ? 64 + ((i * 13) % 50) : 0}`);
        }
        pre.textContent = rows.join('\n');
      },
    },
  };

  Object.assign(window.MOTION.TIPOS, TIPOS);
})();
