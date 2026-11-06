// Escenas técnicas de BandoneAR, traídas de la presentación timeline del repo
// presentacio_bandonear (presentacion/timeline-tipos.js + su CSS de timeline.html),
// adaptadas al motor de Tramoya: se suman a window.TIPOS_PROYECTO.
// Tipos: guia, anatomia, mecanismo, traduccion, fuelle-desafio, componentes (3D),
// software, switch, demo (3D). El 3D sale de tecnico/bandonear-3d.js (Three.js r149).
(function () {
  const { md, esc, lines, pairs } = window.TRAMOYA;
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
  // Sin marca (todo junto, por ejemplo en el modo presentar) la animación corre completa desde el principio
  const enPaso = (root, s) => { const m = root.querySelector(`[data-mk="${s}"]`); return !m || +(m.style.opacity || 0) > 0.5; };

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
      <rect class="bn-correa" x="${x0 + 34}" y="290" width="212" height="16" rx="8"/>
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
        return `${uno ? marca(1) + marca(2) : ''}
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

    // ---------- El fuelle y el encoder: el hilo tira del centro del cabezal derecho ----------
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
            <rect class="fd-cab" x="20" y="120" width="170" height="350" rx="18"/>
            <rect class="fd-ventana" x="44" y="200" width="122" height="190" rx="10"/>
            <g class="fd-der"><rect class="fd-cab" x="0" y="120" width="170" height="350" rx="18"/><circle class="fd-nudo" cx="14" cy="295" r="9"/></g>
            <line class="fd-hilo" x1="140" y1="273" x2="400" y2="295"/>
            <g class="fd-enc" transform="translate(105 295)"><circle r="40" class="cuerpo"/><circle r="24" class="carretel"/><g class="rueda">${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${f2(Math.cos(a) * 28)}" y1="${f2(Math.sin(a) * 28)}" x2="${f2(Math.cos(a) * 36)}" y2="${f2(Math.sin(a) * 36)}"/>`; }).join('')}<line class="marca" x1="0" y1="0" x2="0" y2="-22"/></g><circle r="5" class="eje"/></g>
            <text class="ll" x="20" y="96">ENCODER · ADENTRO DEL CABEZAL</text>
            <text class="ll fd-lh" x="300" y="268">HILO</text>
            <g transform="translate(40 540)">
              <text class="ll" x="0" y="0">POSICIÓN</text><rect class="trk" x="160" y="-16" width="600" height="16" rx="8"/><rect class="pos" x="160" y="-16" width="0" height="16" rx="8"/>
              <text class="ll" x="0" y="44">VELOCIDAD</text><rect class="trk" x="160" y="28" width="600" height="16" rx="8"/><rect class="vel" x="460" y="28" width="0" height="16" rx="8"/>
              <text class="fd-dir" x="0" y="92"></text>
            </g>
          </svg>
        </div>`;
      },
      tick(root, t) {
        const svg = root.querySelector('svg.fd');
        if (!svg) return;
        const pos = (x) => 0.5 + 0.42 * Math.sin(x * 1.05) + 0.06 * Math.sin(x * 2.7);
        const o = pos(t), v = (pos(t + 0.02) - pos(t - 0.02)) / 0.04;
        const x0 = 190, x1 = 190 + 230 + o * 300, n = 12, w = (x1 - x0) / n;
        let top = `M${x0} 140`, bot = `M${x0} 450`, folds = '';
        for (let i = 0; i < n; i++) {
          const a = x0 + i * w;
          top += ` L${f2(a + w / 2)} ${i % 2 ? 140 : 118} L${f2(a + w)} 140`;
          bot += ` L${f2(a + w / 2)} ${i % 2 ? 450 : 472} L${f2(a + w)} 450`;
          folds += `<line x1="${f2(a + w)}" y1="140" x2="${f2(a + w)}" y2="450"/>`;
        }
        svg.querySelector('.fd-fuelle').innerHTML = `<path class="fd-body" d="M${x0} 140 H${f2(x1)} V450 H${x0} Z"/><g class="fd-folds">${folds}</g><path class="fd-edge" d="${top}"/><path class="fd-edge" d="${bot}"/>`;
        svg.querySelector('.fd-der').setAttribute('transform', `translate(${f2(x1)} 0)`);
        // El hilo sale tangente del carretel y llega al centro del cabezal derecho
        const h = svg.querySelector('.fd-hilo'); h.setAttribute('x2', f2(x1 + 14)); h.setAttribute('y2', 295);
        svg.querySelector('.fd-lh').setAttribute('x', f2((140 + x1) / 2 - 20));
        svg.querySelector('.fd-enc .rueda').setAttribute('transform', `rotate(${f2(o * 720)})`);
        svg.querySelector('.pos').setAttribute('width', f2(600 * o));
        const vw = Math.max(-1, Math.min(1, v / 0.6)) * 300;
        const vel = svg.querySelector('.vel');
        vel.setAttribute('x', f2(vw < 0 ? 460 + vw : 460)); vel.setAttribute('width', f2(Math.abs(vw)));
        svg.querySelector('.fd-dir').textContent = v >= 0 ? 'abre ▲ · el hilo se desenrolla' : 'cierra ▼ · el resorte lo enrolla';
      },
    },

    // ---------- Veredicto: dos sellos ----------
    componentes: {
      pasos: 'todo',
      render: (d) => {
        const ps = pairs(d.items).slice(0, 10), uno = modo(d, 'todo') === 'uno';
        const st = (i, at = 0) => (uno ? `data-s="${i + 1}" data-at="${f2(0.05 + at)}"` : `data-at="${f2(0.8 + i * 0.18 + at)}"`);
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="cp-art" data-k="hero" data-m="zoom" data-at=".2" data-dur="1.4">
          ${ps.map((p, i) => `<div class="cp-mk" data-f="items" data-m="pop" ${st(i, 0.15)}><b>${i + 1}</b></div>`).join('')}
        </div>
        <ol class="cp-list">${ps.map((p, i) => `<li class="pt" data-f="items" data-k="item-${i}" data-shape="bar" data-m="left" ${st(i)}${uno ? ' data-dim' : ''}><span class="num">${i + 1}</span><span><b>${md(p.t)}</b><small>${md(p.d)}</small></span></li>`).join('')}</ol>`;
      },
      tick(root, t) {
        const box = root.querySelector('.cp-art');
        const m = box && window.BandoneAR3D?.en(box, 'componentes', { corte: true, encuadre: { az: 38, el: 20, dist: 82, vaiven: 0.16, y: -1.5 } });
        if (!m) return;
        m.cuadro(t, { acento: getComputedStyle(root).getPropertyValue('--accent').trim() });
        // Cada número sigue a su parte: el orden es el de la lista
        const A = m.anclas(), K = ['cabezal', 'switches', 'teclas', 'pico', 'encoder', 'fuelle', 'pizero', 'parlante', 'bateria', 'puertos'];
        box.querySelectorAll('.cp-mk').forEach((el, i) => { const p = A[K[i]]; if (p) { el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px'; } });
      },
    },

    // ---------- El software: de la tecla al sonido, con FluidSynth ----------
    software: {
      pasos: 'uno',
      render: (d) => {
        const et = pairs(d.etapas).slice(0, 5), en = lines(d.enlaces), uno = modo(d, 'uno') === 'uno';
        const PASO = [0, 0, 1, 2, 2];
        // data-at nunca negativo: si no, el elemento asoma en el punto clave anterior
        const st = (i, at = 0) => (uno ? `data-s="${PASO[i]}" data-at="${f2(Math.max(0, (PASO[i] ? 0.1 : 0.7) + (i === 1 || i === 4 ? 0.35 : 0) + at))}"` : `data-at="${f2(0.8 + i * 0.3 + at)}"`);
        const ICON = [
          Array.from({ length: 3 }, (_, r) => Array.from({ length: 4 }, (_, c) => `<rect x="${12 + c * 18}" y="${14 + r * 22}" width="11" height="11" rx="2"/><path class="fino" d="M${17 + c * 18} ${25 + r * 22} v6"/>`).join('')).join('') + '<path class="fino" d="M6 36 H86 M6 58 H86"/>',
          '<rect x="8" y="22" width="76" height="46" rx="5"/><rect x="34" y="34" width="22" height="22" rx="2" class="fill"/>' + Array.from({ length: 8 }, (_, i) => `<path class="fino" d="M${14 + i * 9} 22 v-7 M${14 + i * 9} 68 v7"/>`).join('') + '<rect x="80" y="38" width="9" height="14" rx="2"/>',
          '<rect x="4" y="26" width="84" height="40" rx="6"/><rect x="40" y="36" width="20" height="20" rx="2" class="fill"/>' + Array.from({ length: 10 }, (_, i) => `<circle cx="${12 + i * 8}" cy="31" r="1.8" class="fill"/>`).join('') + '<rect x="12" y="56" width="10" height="8" rx="1"/><rect x="66" y="56" width="10" height="8" rx="1"/>',
          '<path class="onda-ico" d="M4 46 C14 16 22 16 30 46 S46 76 54 46 S70 16 78 46 S86 60 88 46"/><circle cx="66" cy="22" r="7" class="fill"/><path d="M73 22 V4 l10 4"/>',
          '<path d="M10 34 h14 l20 -18 v58 l-20 -18 h-14 z"/><path class="o1" d="M56 30 q10 15 0 30"/><path class="o2" d="M66 22 q18 23 0 46"/><path class="o3" d="M76 14 q26 31 0 62"/>',
        ];
        return `${uno ? marca(1) + marca(2) : ''}
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <svg class="links sw-links" viewBox="0 0 1920 1080">${[0, 1, 2, 3].map((i) => `<path data-m="draw" data-dur=".5" ${st(i + 1, -0.15)} d="M${440 + i * 335} 470 H${475 + i * 335}"/>`).join('')}<g class="packets"></g></svg>
        ${[0, 1, 2, 3].map((i) => (en[i] ? `<div class="sw-en" style="left:${457 + i * 335}px" data-f="enlaces" data-m="fade" ${st(i + 1, 0)}>${esc(en[i])}</div>` : '')).join('')}
        ${et.map((e, i) => `
          <div class="sw-card${i === 3 ? ' fs' : ''}" style="left:${140 + i * 335}px" data-f="etapas" data-k="item-${i}" data-shape="box" data-m="up" ${st(i)}>
            <svg class="ico sw-ico i${i}" viewBox="0 0 92 92">${ICON[i]}</svg>
            <b>${md(e.t)}</b><span>${md(e.d)}</span>
          </div>`).join('')}
        <div class="sw-cons" data-f="consola" data-m="up" ${uno ? 'data-s="1" data-at=".5"' : 'data-at="2"'}><small>Registro de ejemplo</small><pre data-l="${esc(JSON.stringify(lines(d.consola)))}"></pre></div>
        <div class="sw-onda" data-m="up" ${uno ? 'data-s="2" data-at=".6"' : 'data-at="2.4"'}><small data-f="nota">${md(d.nota)}</small><svg viewBox="0 0 560 150"><path class="w"/><path class="w2"/></svg><b class="sw-nota"></b></div>`;
      },
      tick(root, t) {
        const s1 = enPaso(root, 1), s2 = enPaso(root, 2);
        const pre = root.querySelector('.sw-cons pre');
        if (pre) {
          const L = pre._l ??= JSON.parse(pre.dataset.l || '[]');
          const k = Math.floor(t * 1.4), n = L.length || 1, rows = [];
          for (let i = Math.max(0, k - 5); i <= k; i++) rows.push(L[i % n] || '');
          pre.textContent = rows.join('\n');
        }
        const NOTAS = ['La 4', 'Si 4', 'Do 5', 'Re 5', 'Mi 5'], nk = Math.floor(t / 1.2) % NOTAS.length, env = 0.35 + 0.65 * Math.exp(-((t % 1.2) * 1.6));
        const w = root.querySelector('.sw-onda .w'), w2 = root.querySelector('.sw-onda .w2');
        if (w && s2) {
          const f = 3 + nk * 0.4, pts = (amp, ph) => Array.from({ length: 141 }, (_, i) => { const x = i * 4, u = i / 140; return `${i ? 'L' : 'M'}${x} ${f2(75 + amp * env * (Math.sin(u * f * 6.28 + t * 9 + ph) * 0.7 + Math.sin(u * f * 12.56 + t * 5) * 0.3) * Math.sin(Math.PI * u))}`; }).join(' ');
          w.setAttribute('d', pts(60, 0)); w2.setAttribute('d', pts(34, 1.7));
          root.querySelector('.sw-nota').textContent = NOTAS[nk];
        }
        const g = root.querySelector('.sw-links .packets');
        if (!g) return;
        const paths = [...root.querySelectorAll('.sw-links path')];
        if (!g.childElementCount) paths.forEach(() => g.appendChild(document.createElementNS(NS, 'circle')).setAttribute('r', 7));
        paths.forEach((p, i) => {
          const c = g.children[i];
          if (!(p._p >= 1)) { c.style.opacity = 0; return; }
          const len = p._len || (p._len = p.getTotalLength()), pt = p.getPointAtLength(len * ((t * 0.9 + i * 0.25) % 1));
          c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = p.style.opacity;
        });
        root.querySelectorAll('.sw-ico.i4 .o1, .sw-ico.i4 .o2, .sw-ico.i4 .o3').forEach((o, i) => { o.style.opacity = s2 ? f2(0.25 + 0.75 * Math.max(0, Math.sin(t * 5 - i * 0.9))) : 0.25; });
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
    demo: {
      render: (d) => `
        <div class="dm3d" data-k="hero" data-m="fade" data-at=".1" data-dur="1.6"></div>
        <div class="dm-sombra" data-m="fade" data-at=".2" data-dur="1.2"></div>
        <div class="pad dm-txt">${kicker(d)}${titulo(d, 0.12, 'md')}
          ${d.cuerpo ? `<p class="body sm" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>` : ''}</div>
        <div class="vivo" data-m="pop" data-at=".9"><i></i>EN VIVO</div>
        <div class="dm-mon" data-m="up" data-at="1.2"><small data-f="nota">${md(d.nota)}</small><pre></pre></div>`,
      tick(root, t) {
        const box = root.querySelector('.dm3d');
        const m = box && window.BandoneAR3D?.en(box, 'demo', { ondas: true, encuadre: { az: 24, el: 12, dist: 118, vaiven: 0.32, corrimiento: 0.2, y: 0 } });
        // Teclas: tres a la vez, cambian cada 0,3 s (33 a la izquierda, 38 a la derecha)
        const k = Math.floor(t / 0.3), on = new Set([0, 1, 2].map((j) => Math.abs(Math.floor(Math.sin((k + j * 0.37) * 12.9898 + j * 78.233) * 43758.5453)) % 71));
        if (m) m.cuadro(t, { abre: Math.sin(t * 1.3) * 0.6 + Math.sin(t * 0.41) * 0.25, acento: getComputedStyle(root).getPropertyValue('--accent').trim(), teclas: (hi, i) => on.has(hi ? 33 + i : i) });
        const pre = root.querySelector('.dm-mon pre');
        if (!pre) return;
        const notes = [69, 71, 72, 74, 76, 74, 72, 71], kk = Math.floor(t * 2.6), rows = [];
        for (let i = Math.max(0, kk - 4); i <= kk; i++) {
          const n = notes[i % notes.length], o = i % 2 === 0;
          rows.push(`${o ? 'noteon ' : 'noteoff'} 0 ${n}${o ? ' ' + (64 + ((i * 13) % 50)) : ''}`);
        }
        pre.textContent = rows.join('\n');
      },
    },

    // ---------- Gracias: agradecimiento y un collage de fotos que flotan ----------
  };

  // CSS de estas escenas (el mismo de timeline.html)
  const st = document.createElement('style');
  st.dataset.origen = 'tecnico';
  st.textContent = `    svg [data-m]{transform-box:fill-box; transform-origin:center}
    .mk{position:absolute; width:0; height:0; overflow:hidden}
    .body.sm{font-size:28px; margin-top:22px}
    .body.wide{max-width:60ch}

    /* Bandoneón dibujado */
    .bn{width:100%; height:auto; display:block; overflow:visible}
    .bn-caja{fill:var(--panel-2); stroke:var(--line); stroke-width:3}
    .bn-filete{fill:none; stroke:var(--accent); stroke-width:2; opacity:.7}
    .bn-calado circle{fill:none; stroke:var(--accent); stroke-width:2; opacity:.55}
    .bn-correa{fill:color-mix(in srgb, var(--text) 10%, transparent); stroke:var(--muted); stroke-width:1.5}
    .bk{fill:var(--strong); stroke:var(--line); stroke-width:1.5; transition:fill .12s}
    .bk.on{fill:var(--accent); filter:drop-shadow(0 0 8px var(--accent))}
    .bn-pl{stroke:var(--line); stroke-width:1.5}
    .bn-pl.a{fill:color-mix(in srgb, var(--text) 9%, var(--panel))}
    .bn-pl.b{fill:color-mix(in srgb, var(--accent) 30%, var(--panel))}
    .bn-esq{stroke:var(--accent); stroke-width:4}

    /* Portada */
    .tlp{position:absolute; left:140px; top:180px; width:900px}
    .tlp .lockup h1{font-size:170px}
    .tlp .logo-iso{height:120px}
    .tlp .sub{font-size:34px; line-height:1.4; color:var(--lead); max-width:30ch; margin:30px 0 0}
    .tlp-fases{list-style:none; padding:0; margin:40px 0 0; display:flex; flex-wrap:wrap; gap:10px}
    .tlp-fases li{border:1px solid var(--line); background:var(--panel); border-radius:30px; padding:8px 18px; font-size:19px; font-weight:600; color:var(--lead)}
    .tlp-fases em{font:italic 800 19px 'Playfair Display',serif; color:var(--accent); margin-right:8px}
    .tlp-art{position:absolute; left:1040px; top:540px; width:760px}

    /* Etapa */
    .h-num{position:absolute; left:110px; top:120px; font:italic 800 560px/1 'Playfair Display',serif; letter-spacing:-.05em; color:transparent; -webkit-text-stroke:3px var(--line)}
    .h-num.lleno{color:var(--accent); -webkit-text-stroke:0; opacity:.9}
    .h-txt{position:absolute; left:860px; top:250px; right:140px}
    .h-tit{font-size:104px; max-width:14ch}
    .h-rail{position:absolute; left:140px; right:140px; top:820px; height:80px}
    .h-line{position:absolute; left:0; right:0; top:14px; height:4px; border-radius:2px; background:var(--line)}
    .h-line b{position:absolute; left:0; top:0; bottom:0; background:var(--accent); border-radius:2px}
    .h-node{position:absolute; top:0; width:0}
    .h-node i{position:absolute; left:-16px; top:0; width:32px; height:32px; border-radius:50%; background:var(--bg); border:3px solid var(--line)}
    .h-node.pas i{background:var(--accent); border-color:var(--accent)}
    .h-node.cur i{background:var(--strong); border-color:var(--accent); transform:scale(1.3)}
    .h-node span{position:absolute; left:-16px; top:50px; width:300px; font-size:20px; line-height:1.35; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted)}
    .h-node.cur span{color:var(--strong)}
    .h-node em{font:italic 800 24px 'Playfair Display',serif; letter-spacing:0; color:var(--accent); margin-right:10px}

    /* Guía de papel */
    .g-col{position:absolute; left:140px; top:130px; width:640px}
    .g-col h2{font-size:66px}
    .g-pts{margin-top:30px; gap:16px}
    .g-pts .pt{font-size:27px}
    .paper{position:absolute; left:820px; top:150px; width:960px; height:720px; background:#f4efe4; border-radius:6px; padding:40px; box-shadow:0 30px 70px rgba(0,0,0,.45)}
    .paper::before{content:""; position:absolute; left:50%; top:-14px; width:160px; height:32px; margin-left:-80px; background:rgba(232,220,190,.75); transform:rotate(-2deg)}
    .g-svg{width:100%; height:100%; overflow:visible}
    .gb circle{fill:none; stroke:#2b2622; stroke-width:2.4}
    .gb line{stroke:#2b2622; stroke-width:1.6}
    .gb text{fill:#2b2622; text-anchor:middle; font-family:'Playfair Display',serif}
    .gb .gn{font-size:20px; font-weight:700}
    .gb .ga{font-size:19px; font-style:italic}
    .gb .ga.uno{font-size:26px}
    .g-ring{fill:none; stroke:var(--accent); stroke-width:6}
    .g-nota{position:absolute; left:40px; top:18px; margin:0; font-size:18px; color:#7a6f62; font-style:italic}
    .g-hilo{position:absolute; left:0; top:0; width:1920px; height:1080px; pointer-events:none; overflow:visible}
    .g-hilo path{fill:none; stroke:var(--accent); stroke-width:4}
    .lupa{position:absolute; width:300px; height:300px; border-radius:50%; background:#f4efe4; border:8px solid var(--accent); box-shadow:0 24px 60px rgba(0,0,0,.5); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; color:#2b2622; font-family:'Playfair Display',serif}
    .lupa .ln{font-size:40px; font-weight:800}
    .lupa .lc{width:150px; height:150px; border-radius:50%; border:4px solid #2b2622; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px}
    .lupa .lc b{font-size:44px; font-style:italic; font-weight:600; line-height:1}
    .lupa .lc i{width:80px; height:3px; background:#2b2622}
    .tag{position:absolute; background:var(--panel); border:1px solid var(--line); color:var(--strong); font-size:24px; font-weight:700; padding:10px 18px; border-radius:30px; white-space:nowrap; box-shadow:0 10px 30px rgba(0,0,0,.35)}
    .tag.ac{background:var(--accent); border-color:var(--accent); color:#141414}

    /* Íconos */
    .ico{fill:none; stroke:currentColor; stroke-width:3; stroke-linecap:round; stroke-linejoin:round; overflow:visible}
    .ico .fill{fill:currentColor; stroke:none}
    .ico .grueso{stroke-width:7}
    .ico .fino{stroke-width:2}
    .ico.dig{color:var(--accent)}
    .ico .chip rect{fill:var(--accent); stroke:none}
    .ico .chip path{stroke:var(--accent); stroke-width:2}

    /* Instrumentos */
    .ins{position:absolute; left:140px; right:140px; top:430px; display:grid; gap:18px}
    .ins-row{position:relative; display:grid; grid-template-columns:620px 320px 1fr; align-items:center; height:98px}
    .ins-a, .ins-b{height:98px; border:1px solid var(--line); background:var(--panel); border-radius:20px; display:flex; align-items:center; gap:24px; padding:0 28px; color:var(--strong)}
    .ins-a b, .ins-b b{font-size:32px; font-weight:700}
    .ins-a .ico{width:96px; height:64px; color:var(--strong)}
    .ins-b .ico{width:96px; height:64px}
    .ins-b{border-color:color-mix(in srgb, var(--accent) 55%, var(--line))}
    .ins-flecha{width:300px; height:40px; justify-self:center; overflow:visible}
    .ins-flecha path{fill:none; stroke:var(--accent); stroke-width:3; stroke-linecap:round}
    .ins-b.q{justify-content:center; border-style:dashed}
    .qq{font:italic 800 70px/1 'Playfair Display',serif; color:var(--accent); display:inline-block}
    .ins-b.resp{position:absolute; left:940px; right:0; top:0; justify-content:center; background:var(--accent); border-color:var(--accent); color:#141414}
    .ins-b.resp .logo-iso{height:60px}
    .ins-b.resp b{font-family:'Playfair Display',serif; font-size:44px; font-weight:800}
    .ins-b.resp .accent{color:#141414}

    /* Anatomía */
    .an-art{position:absolute; left:410px; top:330px; width:1100px}
    .an-rayos{position:absolute; inset:0; width:100%; height:auto; overflow:visible}
    .an-rayos rect{fill:color-mix(in srgb, var(--bg) 70%, transparent); stroke:var(--accent); stroke-width:2}
    .an-rayos path{fill:none; stroke:var(--accent-2); stroke-width:3}
    .an-rayos rect + path ~ rect{fill:var(--accent)}
    .an-lineas{position:absolute; left:0; top:0; width:1920px; height:1080px; overflow:visible; pointer-events:none}
    .an-lineas path{fill:none; stroke:var(--accent); stroke-width:3}
    .an-lineas circle{fill:var(--accent)}
    .an-card{position:absolute; width:380px; border:1px solid var(--line); background:color-mix(in srgb, var(--panel) 92%, transparent); border-radius:20px; padding:20px 26px; display:grid; gap:6px; box-shadow:0 18px 40px rgba(0,0,0,.35)}
    .an-card.angosta{width:280px}
    .an-card b{font-family:'Playfair Display',serif; font-size:32px; color:var(--strong)}
    .an-card span{font-size:21px; line-height:1.4; color:var(--muted)}
    .anota{top:auto; bottom:150px}

    /* Mecanismo */
    .m-col{position:absolute; left:140px; top:130px; width:600px}
    .m-col h2{font-size:66px}
    .m-col .points{margin-top:36px; gap:22px}
    .m-col .points .pt{font-size:27px}
    .m-card{position:absolute; left:770px; top:160px; width:1010px; height:740px; background:var(--panel); border:1px solid var(--line); border-radius:28px; padding:30px 40px}
    .mec{width:100%; height:100%; overflow:visible}
    .mec .tabla{fill:color-mix(in srgb, var(--accent) 35%, var(--panel-2)); stroke:var(--accent); stroke-width:2}
    .mec .camara rect{fill:var(--panel-2); stroke:var(--line); stroke-width:3}
    .mec .camara line{stroke:var(--line); stroke-width:3}
    .mec .rem{fill:var(--muted)}
    .mec .voz{fill:none; stroke:var(--muted); stroke-width:6; stroke-linecap:round}
    .mec .voz.on{stroke:var(--accent); filter:drop-shadow(0 0 6px var(--accent))}
    .mec .aire circle{fill:var(--accent-2)}
    .mec .arm{fill:none; stroke:var(--strong); stroke-width:8; stroke-linecap:round; stroke-linejoin:round}
    .mec .arm-r{stroke:var(--strong); stroke-width:6}
    .mec .zapata{fill:var(--panel-2); stroke:var(--strong); stroke-width:2}
    .mec .cuero{fill:var(--accent)}
    .mec .pivote{fill:var(--accent); stroke:var(--bg); stroke-width:3}
    .mec .vara{fill:var(--muted)}
    .mec .nacar{fill:#f4efe4; stroke:var(--strong); stroke-width:2}
    .lead{fill:none; stroke:var(--muted); stroke-width:1.5; stroke-dasharray:4 5}
    .dot{fill:var(--accent)}
    .lbl{fill:var(--lead); font:600 24px 'Inter',sans-serif}
    .mec .dir, .fd-dir{fill:var(--accent); font:800 28px 'Inter',sans-serif}

    /* Traducción */
    .tr-h{position:absolute; top:330px; font-size:19px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--muted)}
    .tr-h.ac{color:var(--accent)}
    .tr-a, .tr-b{position:absolute; height:86px; border-radius:18px; display:flex; align-items:center; gap:20px; padding:0 28px; font-size:27px}
    .tr-a{left:140px; width:620px; background:var(--panel); border:1px solid var(--line); color:var(--lead)}
    .tr-a .num{font:italic 800 28px 'Playfair Display',serif; color:var(--muted)}
    .tr-b{left:1060px; width:720px; background:color-mix(in srgb, var(--accent) 10%, var(--panel)); border:2px solid var(--accent); color:var(--strong); font-weight:600}

    /* Fuelle y switch: columna de texto y panel */
    .fd-col{position:absolute; left:140px; top:130px; width:680px}
    .fd-col h2{font-size:66px}
    .fd-col .bullets li{font-size:27px}
    .fd-card{position:absolute; left:900px; top:160px; width:880px; height:740px; background:var(--panel); border:1px solid var(--line); border-radius:28px; padding:40px}
    .fd, .sw-svg{width:100%; height:100%; overflow:visible}
    .fd-cab{fill:var(--panel-2); stroke:var(--accent); stroke-width:3}
    .fd-body{fill:color-mix(in srgb, var(--accent) 10%, var(--panel))}
    .fd-folds line{stroke:var(--line); stroke-width:2}
    .fd-edge{fill:none; stroke:var(--accent); stroke-width:3; stroke-linejoin:round}
    .fd-enc circle{fill:var(--panel-2); stroke:var(--strong); stroke-width:3}
    .fd-enc line{stroke:var(--accent); stroke-width:5; stroke-linecap:round}
    .fd-enc .eje{fill:var(--strong)}
    .fd .ll, .sw-svg .ll{fill:var(--muted); font:700 18px 'Inter',sans-serif; letter-spacing:.16em}
    .fd .trk{fill:var(--line)}
    .fd .pos{fill:var(--strong)}
    .fd .vel{fill:var(--accent)}
    .sw-svg .base{fill:var(--panel-2); stroke:var(--muted); stroke-width:3}
    .sw-svg .tapa{fill:color-mix(in srgb, var(--strong) 6%, transparent); stroke:color-mix(in srgb, var(--text) 55%, transparent); stroke-width:3}
    .sw-svg .pinz{stroke:var(--accent-2); stroke-width:8; stroke-linecap:round}
    .sw-svg .cruz, .sw-svg .eje{fill:var(--accent)}
    .sw-svg .mas{stroke:var(--bg); stroke-width:8; stroke-linecap:round}
    .sw-svg .resorte{fill:none; stroke:var(--strong); stroke-width:4; stroke-linejoin:round}
    .sw-svg .hoja{fill:none; stroke:var(--muted); stroke-width:6; stroke-linecap:round}
    .sw-svg .cont.on .hoja{stroke:var(--accent-2)}
    .sw-svg .led{fill:var(--line)}
    .sw-svg .led.on{fill:var(--accent-2); filter:drop-shadow(0 0 10px var(--accent-2))}
    .sw-svg .ax{fill:none; stroke:var(--line); stroke-width:3}
    .sw-svg .curva{fill:none; stroke:var(--accent); stroke-width:5}
    .sw-svg .act{stroke:var(--muted); stroke-width:2; stroke-dasharray:6 8}
    .sw-svg .pt-c{fill:var(--strong); stroke:var(--accent); stroke-width:4}
    .sw-svg .lin{fill:var(--accent); font:italic 700 26px 'Playfair Display',serif}

    /* Veredicto */
    .vd{position:absolute; left:140px; right:140px; top:360px; display:grid; grid-template-columns:1fr 1fr; gap:60px}
    .vd-card{border:1px solid var(--line); background:var(--panel); border-radius:30px; padding:44px 50px; display:grid; grid-template-columns:200px 1fr; grid-template-rows:auto 1fr; column-gap:40px; row-gap:12px; align-items:start; min-height:360px}
    .vd-card .sello{grid-row:1 / 3; width:200px; height:200px; overflow:visible}
    .vd-card b{font-family:'Playfair Display',serif; font-size:50px; line-height:1.05; color:var(--strong); margin-top:20px}
    .vd-card span{font-size:27px; line-height:1.45; color:var(--lead)}
    .sello .anillo{fill:none; stroke:var(--accent); stroke-width:4; stroke-dasharray:10 9}
    .sello .fondo{fill:color-mix(in srgb, var(--accent) 16%, transparent)}
    .sello .tilde{fill:none; stroke:var(--accent); stroke-width:16; stroke-linecap:round; stroke-linejoin:round}

    /* Componentes */
    .cp-art{position:absolute; left:110px; top:300px; width:900px; height:600px}
    .cp{width:100%; height:100%; overflow:visible}
    .cp .cab{fill:var(--panel-2); stroke:var(--line); stroke-width:3}
    .cp .fu{fill:color-mix(in srgb, var(--accent) 8%, var(--panel)); stroke:var(--accent); stroke-width:2.5; stroke-linejoin:round}
    .cp .fu-l{stroke:var(--line); stroke-width:2}
    .cp .teclas circle{fill:var(--strong)}
    .cp .sw rect{fill:var(--accent); opacity:.85}
    .cp .chipg rect{fill:var(--panel); stroke:var(--accent-2); stroke-width:3}
    .cp .chipg path{stroke:var(--accent-2); stroke-width:3}
    .cp .onda{fill:none; stroke:var(--accent); stroke-width:4}
    .cp .parl circle{fill:none; stroke:var(--muted); stroke-width:3}
    .cp .bat rect{fill:none; stroke:var(--muted); stroke-width:3}
    .cp .bat .carga{fill:var(--accent-2); stroke:none}
    .cp .puertos rect{fill:var(--muted)}
    .cp .enc circle{fill:var(--panel-2); stroke:var(--strong); stroke-width:3}
    .cp .enc line{stroke:var(--accent); stroke-width:4}
    .mk-n circle{fill:var(--accent); stroke:var(--bg); stroke-width:4}
    .mk-n text{fill:#141414; font:800 20px 'Inter',sans-serif; text-anchor:middle}
    .cp-list{position:absolute; left:1060px; right:140px; top:290px; list-style:none; margin:0; padding:0; display:grid; gap:9px}
    .cp-list .pt{display:grid; grid-template-columns:44px 1fr; align-items:baseline; padding-left:26px}
    .cp-list .num{font:italic 800 26px 'Playfair Display',serif; color:var(--accent)}
    .cp-list b{display:block; font-size:24px; color:var(--strong); font-weight:700}
    .cp-list small{display:block; font-size:19px; color:var(--muted); line-height:1.3}

    /* Desafíos */
    .ds-card{position:absolute; width:500px; height:170px; border:1px solid var(--line); background:var(--panel); border-radius:22px; padding:22px 26px; display:grid; grid-template-columns:96px 1fr; gap:22px; align-items:center}
    .ds-ico{width:96px; height:96px; color:var(--accent)}
    .ds-ico.pcb .tacha{stroke:var(--accent-2); stroke-width:6}
    .ds-ico circle.on{fill:var(--accent)}
    .ds-card em{font:italic 800 22px 'Playfair Display',serif; color:var(--accent); display:block}
    .ds-card b{display:block; font-size:26px; color:var(--strong); margin:2px 0 6px}
    .ds-card span{display:block; font-size:19px; line-height:1.35; color:var(--muted)}
    .ds-links path{stroke-dasharray:none}

    /* Demo */
    .dm-art{position:absolute; left:250px; top:380px; width:1000px}
    .vivo{position:absolute; right:140px; top:150px; display:flex; align-items:center; gap:14px; font-size:24px; font-weight:800; letter-spacing:.2em; color:var(--strong); border:2px solid var(--line); border-radius:40px; padding:12px 26px}
    .vivo i{width:18px; height:18px; border-radius:50%; background:#e5484d; box-shadow:0 0 0 6px rgba(229,72,77,.25); animation:latido 1.2s infinite}
    @keyframes latido{50%{opacity:.35}}
    .dm-mon{position:absolute; left:1330px; right:140px; top:480px; background:var(--code); border:1px solid var(--line); border-radius:22px; padding:24px 28px}
    .dm-mon small{font-size:16px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted)}
    .dm-mon pre{margin:12px 0 0; font:400 19px/1.6 ui-monospace,Menlo,monospace; color:var(--accent); min-height:180px}

    /* ---------- BandoneAR en 3D ---------- */
    .b3d{position:absolute; inset:0; width:100%; height:100%; display:block}
    .cp-art{position:absolute; left:90px; top:250px; width:960px; height:690px}
    .cp-mk{position:absolute; left:0; top:0; width:0; height:0; z-index:2}
    .cp-mk b{position:absolute; left:-19px; top:-19px; width:38px; height:38px; border-radius:50%; background:var(--accent); color:#141414; border:3px solid var(--bg); display:grid; place-items:center; font:800 19px 'Inter',sans-serif; box-shadow:0 6px 18px rgba(0,0,0,.45)}
    .dm3d{position:absolute; inset:0}
    .dm-sombra{position:absolute; inset:0; pointer-events:none; background:linear-gradient(90deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 70%, transparent) 30%, transparent 55%)}
    .dm-txt{right:auto; width:780px}
    .dm-txt h2{font-size:88px}
    .dm-mon{left:140px; right:auto; top:auto; bottom:150px; width:520px; background:color-mix(in srgb, var(--code) 80%, transparent); backdrop-filter:blur(6px)}
    .dm-mon pre{min-height:150px; font-size:18px}

    /* Fuelle: encoder adentro y el hilo */
    .fd-ventana{fill:color-mix(in srgb, var(--bg) 55%, transparent); stroke:var(--accent); stroke-width:2; stroke-dasharray:6 6}
    .fd-enc .cuerpo{fill:var(--panel-2); stroke:var(--strong); stroke-width:3}
    .fd-enc .carretel{fill:var(--strong); stroke:none; opacity:.9}
    .fd-enc .marca{stroke:var(--bg) !important; stroke-width:5 !important}
    .fd-hilo{stroke:var(--accent-2); stroke-width:3}
    .fd-nudo{fill:var(--accent-2)}
    .fd-lh{fill:var(--accent-2)}

    /* Software */
    .sw-card{position:absolute; top:320px; width:300px; height:270px; border:1px solid var(--line); background:var(--panel); border-radius:22px; padding:24px 24px 20px; display:flex; flex-direction:column; gap:8px}
    .sw-card.fs{border:2px solid var(--accent); background:color-mix(in srgb, var(--accent) 10%, var(--panel))}
    .sw-card b{font-size:26px; color:var(--strong)}
    .sw-card span{font-size:19px; line-height:1.38; color:var(--muted)}
    .sw-ico{width:84px; height:84px; color:var(--accent); flex:none}
    .sw-ico .onda-ico{stroke-width:4}
    .sw-en{position:absolute; top:420px; transform:translateX(-50%); font-size:15px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); white-space:nowrap; background:var(--bg); padding:2px 8px; border-radius:6px; z-index:2}
    .sw-links path{stroke-width:4}
    .sw-cons{position:absolute; left:140px; top:630px; width:1000px; height:270px; background:var(--code); border:1px solid var(--line); border-radius:22px; padding:22px 30px}
    .sw-cons small, .sw-onda small{font-size:15px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted)}
    .sw-cons pre{margin:12px 0 0; font:400 22px/1.6 ui-monospace,'JetBrains Mono',Menlo,monospace; color:var(--lead)}
    .sw-onda{position:absolute; left:1180px; right:140px; top:630px; height:270px; background:var(--panel); border:1px solid var(--line); border-radius:22px; padding:22px 26px}
    .sw-onda svg{width:100%; height:170px; overflow:visible}
    .sw-onda .w{fill:none; stroke:var(--accent); stroke-width:4}
    .sw-onda .w2{fill:none; stroke:var(--accent-2); stroke-width:2.5; opacity:.7}
    .sw-nota{position:absolute; right:26px; top:16px; font:italic 800 30px 'Playfair Display',serif; color:var(--strong)}`;
  document.head.appendChild(st);

  window.TIPOS_PROYECTO = Object.assign(window.TIPOS_PROYECTO || {}, TIPOS);
})();
