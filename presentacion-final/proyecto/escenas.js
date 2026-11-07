// BandoneAR · presentación final (guion: «Presentacion Final», Google Docs).
//
// Es una puesta en escena: los integrantes actúan en silencio mientras otro relata. La
// presentación queda de fondo y acompaña al relato con poco texto; el que maneja la compu
// avanza con → cuando el relato llega a cada momento (las notas, tecla N, tienen el texto
// que se dice). Al final, un índice discreto lleva a las secciones técnicas para las
// preguntas: clic en una sección; «↩ Índice» o la tecla I vuelven.
//
// Partitura del acto (qué tiene que entender quien mira → qué lo muestra):
//  1 Así se practica hoy ..... Franco con la hoja impresa ....... la guía de papel se dibuja; la lupa en un botón
//  2 La barrera del precio ... cuesta mucho ..................... la cifra cuenta hasta US$ 2500
//  3 La del aprendizaje ...... cuatro teclados de memoria ....... cuatro botoneras; después «reaprender» cae
//  4 Les presentamos ......... el cambio ........................ fundido a la portada con la foto del producto
//  5 Misma botonera .......... 71 botones, como el original ..... la cifra cuenta y se parte en 33 + 38
//  6 Bisonoro ................ un botón, dos notas ............... se enciende un botón: Mi abriendo, Fa♯ cerrando
//  7 Menos de un cuarto ...... accesible ........................ la barra de BandoneAR al lado de la del tradicional
//  8 Franco toca ............. BandoneAR, sin datos técnicos ...... el modelo 3D gira despacio con el logo (queda de fondo)
//  9 Cómo suena .............. parlantes, jack y auriculares ..... tres tarjetas sobrias
// 10 Por qué así ............. ergonomía, postura, transición, evolución: una palabra por avance
// 11 Cierre .................. ¿Preguntas? + índice discreto
// Anexo técnico (12 en adelante): se llega desde el índice; cada escena vuelve con «↩ Índice».
(function () {
  // Botonera derecha (Rheinische 142, la de practica/): 38 botones; '' = hueco.
  const FILAS = [6, 7, 7, 8, 8, 9], HUECOS = [[0, 1], [0, 1], [0], [0], [], [0]];
  const ON = [3, 2]; // fila 3, columna 2: Mi abriendo, Fa♯ cerrando
  let c = '';
  FILAS.forEach((n, r) => {
    for (let k = 0; k < n; k++) {
      if (HUECOS[r].includes(k)) continue;
      const x = 44 + k * 82 + (r % 2 ? 0 : 41), y = 44 + r * 74, on = r === ON[0] && k === ON[1];
      c += on
        ? `<circle class="b on" cx="${x}" cy="${y}" r="30" data-m="pop" data-at="1.3" data-dur=".7"/>`
        : `<circle class="b" cx="${x}" cy="${y}" r="30"/>`;
    }
  });
  window.BOTONERA_DER = `<svg class="botonera" viewBox="0 0 800 460" data-m="fade" data-at=".7" data-dur="1">${c}</svg>`;
})();

const GUIA = `15 | b‴ / a‴ | 300, 95
16 | g♯‴ | 390, 80
17 | g‴ / f♯‴ | 485, 92
18 | f‴ | 572, 112
4/4 | c♯′ / c′ | 262, 160
0/0 | a‴ / g‴ | 350, 150
1/1 | f♯‴ / a♯‴ | 438, 148
2/2 | e‴ / c‴ | 522, 160
3/3 | d♯‴ | 612, 178
* | c′ / d′ | 222, 222
⌖ | d′ / c♯′ | 312, 214
0/1 | g′ / g♯′ | 396, 208
1/2 | a♯″ / a♯′ | 482, 214
2/3 | c‴ / c″ | 562, 228
3/4 | d‴ | 650, 246
6/0 | b | 180, 292
+ | e′ / f♯′ | 272, 284
0 | c♯″ / f♯″ | 352, 274
1 | f♯′ / g′ | 432, 280
2 | a′ / b′ | 514, 290
3 | c″ / d″ | 594, 302
4 | e″ / g″ | 678, 316
8/0 | a | 126, 372
4/0 | f′ | 210, 350
2/0 | a♯′ / e′ | 296, 340
5 | g♯′ / a′ | 376, 330
6 | b′ / c♯″ | 458, 338
7 | d″ / e″ | 538, 350
8 | g♯″ / a″ | 616, 364
9 | b″ / c♯‴ | 696, 380
7/0 | a♯ | 156, 444
5/0 | d♯′ | 240, 420
3/0 | f″ | 326, 412
10 | d♯″ / e″ | 408, 406
11 | f♯″ / g♯″ | 486, 412
12 | a″ / b″ | 566, 422
13 | c♯‴ / e‴ | 642, 436
14 | g″ / d♯″ | 720, 456`;

// Los cuatro teclados del bandoneón (Rheinische 142): mano derecha (38 botones) e izquierda (33),
// cada botón con su nota abriendo y otra cerrando (bisonoro). Es el mismo layout y el mismo cálculo de
// posiciones, en domo, que practica/index.html. '' = hueco.
const RHEINISCHE = {
  right: {
    open: [['', '', 'B6', 'G#6', 'G6', 'F6'], ['', '', 'C#4', 'A6', 'F#6', 'E6', 'D#6'], ['', 'C4', 'D4', 'G4', 'A#5', 'C6', 'D6'],
      ['', 'B3', 'E4', 'C#5', 'F#4', 'A4', 'C5', 'E5'], ['A3', 'F4', 'A#4', 'G#4', 'B4', 'D5', 'G#5', 'B5'], ['', 'A#3', 'D#4', 'F5', 'D#5', 'F#5', 'A5', 'C#6', 'G5']],
    close: [['', '', 'A6', 'G#6', 'F#6', 'F6'], ['', '', 'C4', 'G6', 'A#5', 'C6', 'D#6'], ['', 'D4', 'C#4', 'G#4', 'A#4', 'C5', 'D6'],
      ['', 'B3', 'F#4', 'F#5', 'G4', 'B4', 'D5', 'G5'], ['A3', 'F4', 'E4', 'A4', 'C#5', 'E5', 'A5', 'C#6'], ['', 'A#3', 'D#4', 'F5', 'E5', 'G#5', 'B5', 'E6', 'D#5']],
  },
  left: {
    open: [[], ['', '', 'G#2', 'A#2', 'C#3', 'F3', 'G#4'], ['E2', 'A2', 'G3', 'D#3', 'F4', 'A#3', 'F2'], ['', 'D3', 'A3', 'C4', 'E4', 'C3', 'G2'],
      ['E3', 'G#3', 'B3', 'D4', 'F#4', 'C#4', 'F#2'], ['D2', 'B2', 'G4', 'A4', 'D#4', 'F#3', 'D#2', 'C2']],
    close: [[], ['', '', 'G#2', 'A#2', 'D#3', 'D#4', 'G4'], ['D2', 'D3', 'A#3', 'C4', 'C#3', 'C3', 'F#2'], ['', 'G2', 'G3', 'B3', 'D4', 'F4', 'F#3'],
      ['A2', 'E3', 'A3', 'C#4', 'E4', 'G#3', 'B2'], ['E2', 'E3', 'F#4', 'G#4', 'B4', 'F3', 'C#2', 'F2']],
  },
};
// Los botones que se encienden, en orden (fila, columna): el mismo botón en abriendo y en cerrando,
// para que se vea que cada uno da dos notas distintas
const LUCES = { right: [[3, 2], [2, 4], [4, 5], [1, 3]], left: [[2, 1], [3, 3], [4, 2], [5, 4]] };
const SOLFEO = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
const solfeo = (n) => SOLFEO[n[0]] + (n[1] === '#' ? '<sup>♯</sup>' : '');
const GEO = {};
for (const mano of ['right', 'left']) {
  const keys = RHEINISCHE[mano].open, cols = Math.max(...keys.map((r) => r.length)), filas = keys.filter((r) => r.length).length;
  const offX = cols < 9 ? 39 * (9 - cols) : 0, offY = filas < 6 ? -32 * (6 - filas) : 0, gapX = cols >= 10 ? 65 : 79;
  const bs = [];
  keys.forEach((r, row) => r.forEach((n, col) => {
    if (!n) return;
    const x = offX + col * gapX + 40 - (row % 2) * 40, y = offY + row * 60 + (row / 2 + 1) * 15 * (1 - Math.sin((x / 320) * Math.PI / 2));
    bs.push({ row, col, cx: x + 29, cy: y + 29 });
  }));
  const x0 = Math.min(...bs.map((b) => b.cx)) - 34, y0 = Math.min(...bs.map((b) => b.cy)) - 34;
  GEO[mano] = { bs, x0, y0, w: Math.max(...bs.map((b) => b.cx)) + 34 - x0, h: Math.max(...bs.map((b) => b.cy)) + 34 - y0 };
}
// Escala común para que los cuatro quepan en una fila (ancho útil 1640 px, huecos y márgenes de cada tarjeta)
const ESC = (1640 - 3 * 24 - 4 * 38) / (2 * (GEO.right.w + GEO.left.w));
// Un teclado: botones <b class="bt"> con su posición en px y su nota; entran en ola (por fila y columna)
// a partir de `t0`, y los de LUCES se encienden después, de a uno (una capa .luz que aparece).
function teclado(mano, sentido, t0, t1) {
  const g = GEO[mano], nombres = RHEINISCHE[mano][sentido];
  const luces = LUCES[mano];
  const bts = g.bs.map((b) => {
    const k = luces.findIndex(([r, c]) => r === b.row && c === b.col), nota = solfeo(nombres[b.row][b.col]);
    const at = (t0 + b.row * 0.09 + b.col * 0.025).toFixed(2);
    const luz = k < 0 ? '' : `<span class="luz" data-m="pop" data-at="${(t1 + k * 0.35).toFixed(2)}" data-dur=".5">${nota}</span>`;
    return `<b class="bt" style="left:${Math.round((b.cx - g.x0) * ESC)}px;top:${Math.round((b.cy - g.y0) * ESC)}px" data-m="pop" data-at="${at}" data-dur=".45">${nota}${luz}</b>`;
  }).join('');
  return `<div class="tabw" style="height:${Math.round(GEO.right.h * ESC)}px"><div class="tab" style="width:${Math.round(g.w * ESC)}px;height:${Math.round(g.h * ESC)}px">${bts}</div></div>`;
}

window.ESCENAS = [
  // ================= El acto =================
  {
    tipo: 'guia', mantener: 14, cromo: false,
    kicker: 'Hoy',
    titulo: 'Así se practica *hoy*.',
    cuerpo: 'Con una hoja impresa: la disposición de las teclas, junto con sus notas.',
    puntos: 'Cada círculo es un botón, con su número.\nY cada botón da *dos notas*: una al abrir el fuelle y otra al cerrarlo.',
    botones: GUIA,
    nota: 'Botonera del lado derecho, redibujada de una guía de estudio.',
    notas: 'Franco está sentado practicando escalas con la hoja impresa.\n\n«Acá podemos ver a un estudiante que aspira a ser un gran bandoneonista, practicando de la manera más común que hay hoy en día: con una hoja de papel que tiene impresa la disposición de las teclas junto con sus notas.»\n\n(→ en «junto con sus notas»: se marca un botón y sus dos notas.)',
  },
  {
    tipo: 'libre', mantener: 8, transicion: 'fundido',
    kicker: 'La primera barrera',
    titulo: 'El bandoneón usado *más barato*.',
    desde: 'desde, para empezar a estudiar',
    html: `<div class="pad">{{kicker}}{{titulo}}</div>
<div class="precio" data-r="dato" data-m="pop" data-at=".6" data-dur="1"><span data-m="count" data-at=".7" data-dur="1.8" data-to="2.500">0</span><small>dólares</small></div>
<p class="precio-sub" data-f="desde" data-m="up" data-at="1.6">{{desde}}</p>`,
    css: `.precio{position:absolute; left:140px; top:380px; font:var(--titulo-peso,800) 320px/1 var(--font-display); font-variant-numeric:lining-nums; color:var(--accent); letter-spacing:-.03em}
.precio small{font-size:110px; color:var(--muted); margin-left:36px; letter-spacing:0}
.precio-sub{position:absolute; left:140px; top:760px; font-size:44px; color:var(--lead)}`,
    notas: '«Esto sucede principalmente porque el bandoneón es un instrumento carísimo: el bandoneón usado más barato que podés encontrar arranca en 2.500 dólares.»\n\nEl precio sube hasta 2.500 dólares.',
  },
  {
    tipo: 'libre', mantener: 10, transicion: 'corte',
    kicker: 'La segunda barrera',
    titulo: '¿Se puede aprender *así*?',
    remate: 'Y cuando lo aprendiste, hay que *reaprender* la postura y el movimiento.',
    html: `<div class="pad">{{kicker}}{{titulo}}</div>
<div class="cuatro">${[['Derecha', 'abriendo', 'right', 'open', 0], ['Derecha', 'cerrando', 'right', 'close', 1], ['Izquierda', 'abriendo', 'left', 'open', 2], ['Izquierda', 'cerrando', 'left', 'close', 3]].map(([m, s, mano, sentido, i]) => `
  <div class="tec" data-m="up" data-dim data-at="${(0.6 + i * 0.18).toFixed(2)}">
    ${teclado(mano, sentido, 0.95 + i * 0.18, 2.75 + (mano === 'left' ? 0.17 : 0))}
    <b>${m}</b><span>${s}</span></div>`).join('')}
</div>
<p class="cuatro-n" data-r="dato" data-m="caer" data-at="4.3"><b>4</b> teclados para memorizar</p>
<p class="remate" data-f="remate" data-m="renglones" data-s="1" data-at=".1">{{remate}}</p>`,
    css: `.cuatro{position:absolute; left:140px; right:140px; top:320px; display:grid; grid-template-columns:${GEO.right.w}fr ${GEO.right.w}fr ${GEO.left.w}fr ${GEO.left.w}fr; gap:24px}
.tec{border:1px solid var(--line); background:var(--panel); border-radius:22px; padding:34px 18px 26px; display:flex; flex-direction:column; align-items:center; perspective:1100px}
.tec .tabw{display:flex; align-items:center; justify-content:center; margin-bottom:30px}
.tec .tab{position:relative; transform:rotateX(22deg)}
.tec .tab::before{content:""; position:absolute; inset:-14px; border-radius:20px; background:linear-gradient(165deg,var(--panel-2),var(--bg)); border:1px solid var(--line); box-shadow:0 9px 0 rgba(0,0,0,.4), 0 26px 30px rgba(0,0,0,.5)}
.tec .bt{position:absolute; width:${Math.round(56 * ESC)}px; height:${Math.round(56 * ESC)}px; margin:${-Math.round(28 * ESC)}px 0 0 ${-Math.round(28 * ESC)}px; border-radius:50%; background:radial-gradient(circle at 34% 28%, color-mix(in srgb,var(--text) 26%,var(--panel-2)), var(--panel-2) 64%); border:1px solid var(--line); box-shadow:0 4px 0 rgba(0,0,0,.55), 0 7px 7px rgba(0,0,0,.4); font:700 12px/${Math.round(56 * ESC)}px var(--font-body); text-align:center; color:var(--lead); letter-spacing:-.02em; font-style:normal}
.tec .bt sup{font-size:.72em; line-height:0; vertical-align:.35em; margin-left:1px}
.tec .luz{position:absolute; inset:-1px; border-radius:50%; background:radial-gradient(circle at 34% 28%, color-mix(in srgb,#fff 42%,var(--accent)), var(--accent) 68%); color:var(--bg); box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 38%,transparent), 0 0 20px var(--accent)}
.tec > b{display:block; font-size:32px; color:var(--strong)}
.tec > span{font-size:28px; color:var(--muted)}
.cuatro-n{position:absolute; left:140px; top:770px; margin:0; font-size:44px; color:var(--lead)}
.cuatro-n b{font:var(--titulo-peso,800) 90px/1 var(--font-display); color:var(--accent); margin-right:16px; vertical-align:-10px}
.remate{position:absolute; left:140px; right:140px; top:880px; margin:0; font-size:42px; color:var(--strong)}`,
    notas: '«Salimos de la primera barrera con la que se encuentra el futuro músico, que es la monetaria. Hablemos de la que más nos concierne: la del aprendizaje. ¿A ustedes les parece que es posible aprender a tocar un instrumento de cuatro teclados así?»\n\n(→) «Y cuando finalmente lo aprendiste, hay que reaprender todo, porque la posición y el movimiento no son los correctos.»\n\nEntran los cuatro teclados con sus botones y se iluminan; al final aparece el remate sobre reaprender.',
  },
  {
    tipo: 'portada', mantener: 10, transicion: 'fundido', logo: 'archivo:../proyecto/assets/logo/bandonear-celeste-barrotes-perspectiva.svg',
    kicker: 'Les presentamos',
    titulo: 'Bandone*AR*',
    subtitulo: 'Un bandoneón digital, pensado para aprender.',
    autores: 'Brenda · Maxi · Antonio · Leo · Franco', contexto: 'Universidad Nacional de La Matanza',
    imagen: '../proyecto/assets/img/bandonear-mesa.webp',
    notas: '«Hoy Franco está practicando así, pero eso está a punto de cambiar gracias a nuestro proyecto. Les presentamos BandoneAR.»\n\nEntra el bandoneón con el estuche. Franco lo saca y prepara todo para tocar.',
  },
    {
    tipo: 'libre', mantener: 9, 
    kicker: 'La botonera',
    titulo: 'Todos los botones, *en su lugar*.',
    izq: 'izquierda · graves', der: 'derecha · agudas e intermedias',
    nota: 'Misma distribución, altura y distancia que el original.',
    html: `<div class="pad">{{kicker}}{{titulo}}</div>
<div class="n71" data-r="dato" data-m="pop" data-at=".5" data-dur="1"><span data-m="count" data-at=".6" data-dur="1.6" data-to="71">0</span><small>botones</small></div>
<div class="lados">
  <div class="lado" data-m="left" data-s="1" data-at=".1"><b>33</b><span data-f="izq">{{izq}}</span></div>
  <div class="lado" data-m="right" data-s="1" data-at=".35"><b>38</b><span data-f="der">{{der}}</span></div>
</div>
<p class="nota71" data-f="nota" data-m="up" data-s="2" data-at=".1">{{nota}}</p>`,
    css: `.n71{position:absolute; left:140px; top:390px; font:var(--titulo-peso,800) 300px/1 var(--font-display); color:var(--accent); letter-spacing:-.03em; font-variant-numeric:lining-nums}
.n71 small{display:block; margin-top:24px; font:500 44px/1 var(--font-body); color:var(--muted); letter-spacing:.02em}
.lados{position:absolute; left:820px; right:140px; top:430px; display:grid; grid-template-columns:1fr 1fr; gap:60px}
.lado{border-top:4px solid var(--line); padding-top:28px}
.lado b{display:block; font:var(--titulo-peso,800) 150px/1 var(--font-display); font-variant-numeric:lining-nums; color:var(--strong)}
.lado span{display:block; margin-top:16px; font-size:36px; line-height:1.3; color:var(--lead)}
.nota71{position:absolute; left:820px; right:140px; top:820px; font-size:38px; line-height:1.35; color:var(--text)}`,
    notas: '«Con mis compañeros logramos crear una alternativa al bandoneón tradicional. Presenta la misma cantidad de teclas y disposición…» 71 botones, como el original: 33 en el cabezal izquierdo, para las graves, y 38 en el derecho, para las agudas e intermedias. Los cabezales están impresos en 3D y replican la ergonomía, la distancia y la distribución física de los botones.',
  },
    {
    tipo: 'libre', mantener: 10, transicion: 'fundido',
    kicker: 'Bisonoro',
    titulo: 'Un botón, *dos notas*.',
    abre: 'Mi', cierra: 'Fa♯',
    html: `<div class="pad">{{kicker}}{{titulo}}</div>
<div class="bot-wrap">${window.BOTONERA_DER}<p class="bot-lbl" data-m="fade" data-at="1.1">Mano derecha · 38 botones</p></div>
<div class="sentidos">
  <div class="sent" data-m="right" data-s="1" data-at=".1" data-dim><small>Abriendo el fuelle →</small><b data-f="abre">{{abre}}</b></div>
  <div class="sent" data-m="left" data-s="2" data-at=".1"><small>← Cerrando el fuelle</small><b data-f="cierra">{{cierra}}</b></div>
</div>`,
    css: `.bot-wrap{position:absolute; left:140px; top:400px; width:800px}
.botonera{width:800px; height:460px; overflow:visible}
.botonera .b{fill:var(--panel-2); stroke:var(--line); stroke-width:3}
.botonera .b.on{fill:var(--accent); stroke:var(--accent-2); stroke-width:6}
.bot-lbl{margin:18px 0 0; font-size:28px; color:var(--muted)}
.sentidos{position:absolute; left:1080px; right:140px; top:420px; display:grid; gap:44px}
.sent{border-left:6px solid var(--accent); padding:10px 0 10px 40px}
.sent small{display:block; font-size:34px; color:var(--muted)}
.sent b{display:block; margin-top:6px; font:var(--titulo-peso,800) 150px/1 var(--font-display); font-variant-numeric:lining-nums; color:var(--strong)}`,
    notas: '«…replica las notas e imita la bisonoridad, que es una característica particular del instrumento, la que lo hace único.» El bandoneón es bisonoro: el mismo botón da una nota al abrir el fuelle y otra distinta al cerrarlo. Este, en la mano derecha, da Mi abriendo y Fa sostenido cerrando. BandoneAR lo reproduce igual.',
  },
  {
    tipo: 'cifra', mantener: 9, transicion: 'morph',
    kicker: 'Fiel al original',
    titulo: 'Por menos de *un cuarto* del precio.',
    prefijo: '<', numero: '25', unidad: '%', texto: 'de lo que cuesta un bandoneón tradicional.',
    barras: 'Bandoneón tradicional | 100\nBandoneAR | 25',
    unidadBarras: '%',
    notas: '«Todo este conjunto de features hace que el estudiante pueda practicar desde el primer momento con un instrumento cien por ciento fiel al original, pagando menos de un cuarto del precio que pagaría si comprara uno tradicional.»',
  },
  {
    tipo: 'vitrina', mantener: 60, transicion: 'fundido', cromo: false, logo: 'archivo:../proyecto/assets/logo/bandonear-celeste-barrotes-perspectiva.svg',
    ruta: 'Demo', // nombre en la hoja de ruta (la escena repite el título de la portada)
    kicker: 'Les presentamos',
    titulo: 'Bandone*AR*',
    subtitulo: 'Un bandoneón digital, pensado para aprender.',
    notas: 'Franco ya tiene todo listo y se pone a tocar escalas. Esta escena queda de fondo mientras toca.',
  },
  {
    tipo: 'tarjetas', mantener: 10, coreografia: 'sobria',
    kicker: 'El sonido',
    titulo: 'Suena *donde lo necesites*.',
    items: 'Un parlante en cada carcasa | Graves a la izquierda, agudos a la derecha, como en el bandoneón.\nSalida jack | A un parlante, para que suene todavía más fuerte.\nAuriculares | Para practicar sin molestar a nadie.',
    notas: '«Como pueden ver y escuchar, el instrumento tiene amplificadores en cada carcasa. Además cuenta con una salida jack por si quiere conectarlo a un parlante para que suene aún más fuerte, y si no quiere molestar a nadie puede conectar sus auriculares y escucharlo él solo.»\n\nFranco muestra la entrada de auriculares, después lo conecta al parlante y lo hace sonar.',
  },
  {
    tipo: 'libre', mantener: 12, transicion: 'fundido', coreografia: 'editorial', pasos: 'uno',
    kicker: 'Lo que se aprende acá, sirve allá',
    p1: 'Ergonomía', p2: 'Postura', p3: 'Transición natural', p4: 'Evolución',
    imagen: '../proyecto/assets/img/abuelo.webp', // se cambia desde el editor (clic en la foto)
    html: `<div class="ev-foto" data-f="imagen" data-k="hero" data-shape="img" data-m="reveal" data-dur="1.4"><img src="{{img:imagen}}" alt=""></div>
<div class="ev-txt">{{kicker}}
  <ol class="ev">
    <li data-f="p1" data-m="up" data-at=".6" data-dim>{{p1}}</li>
    <li data-f="p2" data-m="up" data-s="1" data-at=".1" data-dim>{{p2}}</li>
    <li data-f="p3" data-m="up" data-s="2" data-at=".1" data-dim>{{p3}}</li>
    <li data-f="p4" data-m="up" data-s="3" data-at=".1">{{p4}}</li>
  </ol>
</div>`,
    css: `.ev-foto{position:absolute; left:0; top:0; bottom:0; width:820px; overflow:hidden}
.ev-foto img{width:100%; height:100%; object-fit:cover}
.ev-txt{position:absolute; left:960px; right:140px; top:250px}
.ev{list-style:none; margin:50px 0 0; padding:0}
.ev li{font:var(--titulo-peso,800) 104px/1.15 var(--font-display); color:var(--strong); letter-spacing:-.02em}`,
    notas: 'Ergonomía, postura, transición natural y evolución: un → por palabra, a medida que se nombran.',
  },
  {
    tipo: 'collage', mantener: 15, transicion: 'fundido', logo: 'archivo:../proyecto/assets/logo/bandonear-celeste-barrotes-perspectiva.svg',
    kicker: 'Fin', titulo: '¡Gracias!',
    cuerpo: 'A los docentes, a nuestras familias y a todos los que nos acompañaron en este proyecto.',
    equipo: 'Brenda · Maxi · Antonio · Leo · Franco', institucion: 'Universidad Nacional de La Matanza',
    huecos: 11, // lugares del collage; cada foto es un campo (foto1, foto2…) que se elige desde el editor
    foto1: '../proyecto/assets/img/taller-protoboards.webp', foto2: '../proyecto/assets/img/taller-soldadura.webp', foto3: '../proyecto/assets/img/cabezal-switches.webp',
    foto4: '../proyecto/assets/img/cabezal-interior.webp', foto5: '../proyecto/assets/img/taller-placa-switches.webp', foto6: '../proyecto/assets/img/video-grabando.webp',
    foto7: '../proyecto/assets/img/video-laptop.webp', foto8: '../proyecto/assets/img/video-edicion.webp', foto9: '../proyecto/assets/img/equipo-dormido.webp',
    foto10: '../proyecto/assets/img/equipo.webp', foto11: '../proyecto/assets/img/certificados.webp',
    // Las verticales se recortan en el marco: qué parte queda a la vista (la 8 es una captura con un emoji abajo, que así queda afuera)
    enfoques: '1 | 50% 55%\n2 | 50% 25%\n3 | 50% 28%\n4 | 50% 40%\n7 | 50% 33%\n8 | 50% 19%',
    notas: 'Agradecer a los docentes y a las familias. El collage entra foto por foto mientras se agradece.',
  },
  {
    tipo: 'indice', mantener: 15, ancla: 'indice', transicion: 'fundido', logo: 'archivo:../proyecto/assets/logo/bandonear-celeste-barrotes-perspectiva.svg',
    titulo: '¿Preguntas?',
    autores: 'Brenda · Maxi · Antonio · Leo · Franco', contexto: 'Universidad Nacional de La Matanza',
    rotulo: 'Secciones técnicas',
    indice: 'construccion | Cómo está construido\nmecanismo | Del botón al sonido\ntraduccion | De lo mecánico a lo electrónico\nfuelle | El fuelle\ncomponentes | Componentes en 3D\nsoftware | De la tecla al sonido\ntacto | El tacto: switches\nconexiones | Cómo se conecta todo\nmodos | Solo o conectado\npractica | Software de práctica',
    notas: 'Cierre y preguntas. Clic en una sección del índice para ir a ella; desde ahí, ↩ Índice (abajo a la derecha) o la tecla I vuelven acá.',
  },

  // ================= Anexo técnico (desde el índice) =================
  {
    tipo: 'anatomia', mantener: 12, anexo: true, ancla: 'construccion', transicion: 'corte',
    kicker: 'Entender el instrumento',
    titulo: 'Cómo está construido un *bandoneón*.',
    partes: 'Cabezal izquierdo | 33 botones · las notas graves\nFuelle | Actúa como un pulmón: aspira al abrir, sopla al cerrar\nCabezal derecho | 38 botones · las notas agudas e intermedias\nLa máquina | Brazos, zapatas y voces de acero dentro de cada cabezal',
    nota: 'Bisonoro: cada botón da una nota al abrir el fuelle y otra al cerrarlo.',
    notas: 'Dos cabezales con distinta cantidad de botones, el fuelle que mueve el aire y la máquina adentro de cada cabezal.',
  },
  {
    tipo: 'mecanismo', mantener: 12, anexo: true, ancla: 'mecanismo', transicion: 'corte',
    kicker: 'La máquina por dentro',
    titulo: 'Del botón *al sonido*.',
    puntos: 'Al apretar el botón, el brazo levanta la zapata y destapa la ranura.\nEl fuelle hace pasar el aire: abriendo vibra una voz de acero…\n…y cerrando, la otra. Por eso cada botón tiene dos notas.',
    partes: 'Botón de nácar\nBrazo\nZapata\nRanura\nVoz al abrir\nVoz al cerrar',
    notas: 'El botón acciona un brazo que levanta una zapata. Con la ranura abierta, el aire hace vibrar una lengüeta de acero; hay una voz para cada sentido del fuelle.',
  },
  {
    tipo: 'traduccion', mantener: 11, anexo: true, ancla: 'traduccion', transicion: 'corte',
    kicker: 'Replicarlo en electrónica',
    titulo: 'De lo mecánico a *lo electrónico*.',
    izqTitulo: 'En el bandoneón', derTitulo: 'En BandoneAR',
    pares: 'Botones y brazos | Switches mecánicos lineales\nLa máquina de cada cabezal | Una Raspberry Pi Pico por teclado: teclados MIDI\nVoces de acero y aire | FluidSynth: síntesis por software\nPresión de aire del fuelle | Un encoder con hilo que lee el gesto\nCaja de madera | Cabezales impresos en 3D',
    notas: 'Cada parte del bandoneón y su equivalente electrónico.',
  },
  {
    tipo: 'fuelle-desafio', mantener: 11, anexo: true, ancla: 'fuelle', transicion: 'corte',
    kicker: 'El fuelle',
    titulo: 'Que el fuelle se *sienta* como el real.',
    cuerpo: 'El instrumento tiene que acompañar el movimiento, la postura y el agarre.',
    puntos: 'Sin aire: un encoder adentro del cabezal, con un hilo atado al otro, lee la apertura, el cierre y la velocidad.\nEl gesto define la dirección y la dinámica de cada nota.\nAsí la evolución hacia el bandoneón tradicional es natural.',
    notas: 'Encoder en un cabezal, hilo atado al centro del otro: al abrir se desenrolla y gira, al cerrar se enrolla. Sentido = nota; velocidad = intensidad.',
  },
  {
    tipo: 'componentes', mantener: 14, anexo: true, ancla: 'componentes', transicion: 'corte',
    kicker: 'Componentes principales',
    titulo: 'Cada pieza cumple *una función del bandoneón*.',
    items: 'Cabezales impresos en 3D | La caja de madera de cada lado\n71 switches, un diodo cada uno | Los botones: 38 a la derecha, 33 a la izquierda\nTeclas impresas a medida | Misma altura, distancia y distribución\nUna Raspberry Pi Pico por cabezal | La máquina: escanea la botonera y el fuelle\nEncoder con hilo | El aire: un hilo atado al cabezal derecho lo hace girar\nFuelle | El gesto, la postura y el agarre\nRaspberry Pi Zero con FluidSynth | Las voces: genera el sonido de cada nota\nDos MAX98357A y parlantes | Estéreo: graves a la izquierda, agudos a la derecha\nBatería integrada | Se toca en cualquier lugar\nUSB-MIDI y jack 3,5 mm | Computadora, auriculares o amplificación',
    notas: 'Los números siguen a cada parte en el modelo 3D, en corte.',
  },
  {
    tipo: 'software', mantener: 14, anexo: true, ancla: 'software', transicion: 'corte',
    kicker: 'El software',
    titulo: 'De la tecla al sonido, *con FluidSynth*.',
    etapas: 'Matrices de botones | Filas y columnas, con un diodo por switch\nDos Raspberry Pi Pico | Escanean cada lado; la izquierda lee además el fuelle, el volumen y la llave\nRaspberry Pi Zero | Recibe todo por UART y arma cada nota: botón + sentido del fuelle\nFluidSynth | Sintetizador por software: hace sonar la nota con un SoundFont de bandoneón\nAudio estéreo | Dos MAX98357A por I2S, uno por parlante',
    enlaces: 'escaneo\nUART\nnotas MIDI\nI2S',
    consola: 'pico-der   botón 23 ↓\npico-izq   fuelle +0,38 · abre\npi-zero    note_on  ch1 69 vel 91\nfluidsynth noteon 0 69 91\npico-izq   fuelle −0,21 · cierra\npi-zero    note_off ch1 69 · note_on ch1 71\nfluidsynth noteoff 0 69 · noteon 0 71 74\npico-der   botón 23 ↑\nfluidsynth noteoff 0 71',
    nota: 'FluidSynth · SoundFont (.sf2)',
    notas: 'Las Pico leen las matrices (la izquierda también el fuelle, el volumen y la llave, y recibe la derecha por UART). La Pi Zero arma la nota con botón + sentido del fuelle y FluidSynth la hace sonar. Sale por I2S a dos MAX98357A.',
  },
  {
    tipo: 'switch', mantener: 10, anexo: true, ancla: 'tacto', transicion: 'corte',
    kicker: 'El tacto',
    titulo: 'Un switch mecánico *lineal* bajo cada botón.',
    cuerpo: 'Recorrido parejo, sin escalón: lo más parecido a la pulsación de un bandoneón.',
    puntos: 'Respuesta rápida y precisa.\nTeclas impresas a medida encima de cada switch.\nLa memoria muscular se transfiere al instrumento real.',
    partes: 'Vástago\nResorte\nCarcasa\nContactos',
    notas: 'Baja parejo, sin el clic de un switch táctil.',
  },
  {
    tipo: 'flujo', mantener: 12, anexo: true, ancla: 'conexiones', transicion: 'corte', coreografia: 'tecnica',
    kicker: 'Cómo se conecta todo',
    titulo: 'Entradas, procesamiento *y salidas*.',
    bloques: 'Entradas | Botonera | 71 switches · 38 der. / 33 izq.\nEntradas | Fuelle | Encoder con hilo: apertura y cierre\nProcesamiento | 2 Pico + Pi Zero | Mapeo bisonoro\nProcesamiento | Síntesis | FluidSynth en la Pi Zero\nSalidas | Amplificador | 2 MAX98357A · parlantes estéreo\nSalidas | Salida auxiliar | Jack 3,5 mm\nSalidas | USB-MIDI | A la computadora (DAW)',
    nota: 'El sonido es cien por ciento digital: el fuelle no mueve aire, controla el gesto.',
    notas: 'Dos entradas físicas, un núcleo de procesamiento y dos caminos de salida: autónomo y MIDI.',
  },
    {
    tipo: 'columnas', mantener: 11, anexo: true, ancla: 'modos', transicion: 'corte',
    kicker: 'Dos formas de tocarlo',
    titulo: 'Solo, o *conectado*.',
    izqTitulo: 'Modo autónomo',
    izq: 'Batería integrada.\nSintetizador y amplificador internos.\nParlantes estéreo: graves a la izquierda, agudos a la derecha.\nSalida de auriculares de 3,5 mm.',
    derTitulo: 'Controlador USB-MIDI',
    der: 'Se conecta por USB a cualquier computadora.\nFunciona con cualquier programa de música.\nToca con librerías de sonido propias.',
    monitorTitulo: 'USB-MIDI · mensajes',
    monitor: 'note_on   Mi4   vel 72   abre\nnote_off  Mi4\nnote_on   Fa♯4  vel 64   cierra\nnote_on   La3   vel 80   cierra\nnote_off  Fa♯4\nnote_off  La3\nnote_on   Do5   vel 90   abre\nnote_off  Do5',
    notas: 'Modo autónomo: batería, sintetizador y amplificador internos, parlantes estéreo que respetan la espacialidad del bandoneón, y jack de 3,5 mm. Modo controlador: por USB a cualquier computadora, para usarlo con programas de producción musical y librerías propias.',
  },
    {
    tipo: 'tarjetas', mantener: 11, anexo: true, ancla: 'practica', transicion: 'corte',
    kicker: 'Software de práctica',
    titulo: 'Una app que *te guía*.',
    items: 'Tocar libre | Cada botón se ilumina con su nota, abriendo o cerrando.\nEscalas | Se enciende el botón que sigue: elegís mano y sentido del fuelle.\nCanciones | Las notas suben hasta la línea: escuchala o tocala con espera.\nTus canciones | Importá un .mid o escribila con notas; se ajusta a la botonera.',
    notas: 'Además del instrumento, hicimos una app de práctica que se conecta por MIDI desde el navegador. Muestra cada botón con su nota en Do Re Mi o en cifrado americano, guía escalas iluminando el botón que sigue y tiene un modo canción: escuchar, o tocar y que espere a que aciertes.',
  },
];
