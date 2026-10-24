// Montaje de las escenas para la versión motion (motion.html). Usa los mismos tipos y
// datos que escenas.js; lo que cambia es cómo se mueve cada cosa.
//
// Atributos que lee el motor:
//   data-m      entrada: up | left | right | fade | pop | zoom | wipe | reveal | draw | count | type | words | letters
//   data-s      punto clave en el que entra (0 = al llegar a la escena; 1, 2… = cada avance)
//   data-at     segundos desde que empieza ese punto clave · data-dur duración · data-stagger desfase entre palabras
//   data-k      clave compartida: si la escena siguiente tiene la misma, el elemento viaja de una a la otra
//   data-shape  cómo viaja: text (se escala, por defecto) | bar (pliegue) | box (tarjeta) | img (foto)
//   data-par    paralaje durante el movimiento de cámara (1 = se mueve con la escena)
//   data-dim    se atenúa cuando entra el punto siguiente
//   data-f      campo de la escena que muestra: con el editor abierto, un clic lo edita
(function () {
  const { md, esc, lines, pairs } = window.PRESENTACION;
  const nn = (i) => String(i).padStart(2, '0');
  const f2 = (x) => x.toFixed(2);
  const modo = (d, def) => (d.pasos === 'uno' || d.pasos === 'todo' ? d.pasos : def);

  const kicker = (d, at = 0) => `<div class="kicker" data-f="kicker" data-k="kicker" data-m="wipe" data-at="${at}" data-dur=".8"><i></i><span>${md(d.kicker)}</span></div>`;
  const titulo = (d, at = 0.12, cls = '') => `<h2 class="${cls}" data-f="titulo" data-k="titulo" data-m="words" data-at="${at}">${md(d.titulo)}</h2>`;
  const numeral = (ctx) => `<div class="numeral" data-m="fade" data-dur="1.4" data-par="1.8">${nn(ctx.n)}</div>`;
  // Puntos de una lista: todos juntos, o uno por punto clave (el título queda solo en el primero)
  const lista = (items, uno, base, build) => items.map((x, i) => build(x, i, uno ? `data-s="${i + 1}" data-at=".05" data-dim` : `data-at="${f2(base + i * 0.16)}"`)).join('');

  const TIPOS = {
    portada: {
      render: (d, ctx) => `
        <div class="bg-photo" data-f="imagen" data-k="hero" data-shape="img" data-m="reveal" data-dur="1.8" data-par=".45"><img src="${esc(d.imagen)}" alt=""></div>
        <div class="bg-shade" data-m="fade" data-at=".3" data-dur="1.4"></div>
        <div class="cover">
          ${kicker(d, 0.6)}
          <div class="lockup"><div class="lk-logo" data-f="logo" data-m="pop" data-at=".8" data-dur="1.1">${ctx.logo()}</div><h1 data-f="titulo" data-m="letters" data-at="1">${md(d.titulo)}</h1></div>
          <p class="sub" data-f="subtitulo" data-m="words" data-at="1.7" data-dur=".6" data-stagger=".022">${md(d.subtitulo)}</p>
          <div class="meta" data-f="equipo" data-m="up" data-at="2.4"><b>${esc(d.equipo)}</b><span>${esc(d.institucion)}</span></div>
        </div>`,
    },

    texto: {
      pasos: 'uno',
      render: (d, ctx) => `${numeral(ctx)}
        <div class="pad">${kicker(d)}${titulo(d)}
          ${d.cuerpo ? `<p class="body" data-f="cuerpo" data-m="up" data-at=".7">${md(d.cuerpo)}</p>` : ''}
          <ol class="points">${lista(lines(d.puntos), modo(d, 'uno') === 'uno', 0.9, (p, i, a) => `
            <li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="left" ${a}><span class="num">${nn(i + 1)}</span><span>${md(p)}</span></li>`)}
          </ol>
        </div>`,
    },

    requisitos: {
      pasos: 'todo',
      render: (d, ctx) => `${numeral(ctx)}
        <div class="pad">${kicker(d)}${titulo(d)}
          <div class="cards">${lista(pairs(d.items), modo(d, 'todo') === 'uno', 0.8, (it, i, a) => `
            <div class="card" data-f="items" data-k="item-${i}" data-shape="box" data-m="up" ${a}><i></i><b>${md(it.t)}</b><span>${md(it.d)}</span></div>`)}
          </div>
        </div>`,
    },

    arquitectura: {
      pasos: 'uno',
      // La cámara recorre el diagrama: entradas, procesamiento y, al final, el sistema completo
      focos: (d) => (modo(d, 'uno') === 'uno' ? [{ x: 620, y: 478, s: 1.16 }, { x: 800, y: 462, s: 1.06 }, { x: 960, y: 540, s: 1 }] : []),
      render: (d) => {
        const b = pairs(d.bloques), uno = modo(d, 'uno') === 'uno';
        const BW = 350, BH = 130;
        // [x, y, columna, punto clave, segundo]
        const BOX = [[140, 430, 'in', 0, 0.7], [140, 720, 'in', 0, 0.85], [570, 575, 'core', 1, 0.15], [1000, 430, 'core', 1, 0.75], [1000, 720, 'core', 1, 0.9],
          [1430, 360, 'out', 2, 0.45], [1430, 575, 'out', 2, 0.6], [1430, 790, 'out', 2, 0.75]];
        // [desde, hasta, punto clave, segundo]
        const LINKS = [[0, 2, 1, 0], [1, 2, 1, 0], [2, 3, 1, 0.55], [2, 4, 1, 0.55], [3, 5, 2, 0.15], [3, 6, 2, 0.15], [4, 7, 2, 0.3]];
        const st = (s, at) => (uno ? `data-s="${s}" data-at="${at}"` : `data-at="${f2(0.6 + s * 0.8 + at * 0.5)}"`);
        const link = ([a, c, s, at]) => {
          const x1 = BOX[a][0] + BW, y1 = BOX[a][1] + BH / 2, x2 = BOX[c][0], y2 = BOX[c][1] + BH / 2, mx = (x1 + x2) / 2;
          return `<path data-m="draw" data-dur=".7" ${st(s, at)} d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}"/>`;
        };
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="alabel" style="left:140px" data-m="wipe" ${st(0, 0.5)}>ENTRADAS</div>
        <div class="alabel" style="left:570px" data-m="wipe" ${st(1, 0)}>PROCESAMIENTO</div>
        <div class="alabel" style="left:1430px" data-m="wipe" ${st(2, 0)}>SALIDAS</div>
        <svg class="links" viewBox="0 0 1920 1080">${LINKS.map(link).join('')}<g class="packets"></g></svg>
        ${BOX.map(([x, y, col, s, at], i) => `
          <div class="abox ${col}" data-f="bloques" style="left:${x}px; top:${y}px" data-k="item-${i}" data-shape="box" data-m="pop" ${st(s, at)}><b>${esc(b[i]?.t || '')}</b><span>${esc(b[i]?.d || '')}</span></div>`).join('')}
        ${d.nota ? `<p class="anota" data-f="nota" data-m="up" ${st(2, 1.1)}>${md(d.nota)}</p>` : ''}`;
      },
      // Pulsos de señal por cada conector ya dibujado
      tick(root, t) {
        const g = root.querySelector('.packets');
        if (!g) return;
        const paths = [...root.querySelectorAll('.links path')];
        if (!g.childElementCount) paths.forEach(() => g.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).setAttribute('r', 7));
        paths.forEach((p, i) => {
          const c = g.children[i];
          if (!(p._p >= 1)) { c.style.opacity = 0; return; }
          const len = p._len || (p._len = p.getTotalLength()), pt = p.getPointAtLength(len * ((t * 0.45 + i * 0.17) % 1));
          c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = p.style.opacity;
        });
      },
    },

    imagen: {
      pasos: 'todo',
      render: (d) => `
        <div class="photo-half" data-f="imagen" data-k="hero" data-shape="img" data-m="reveal" data-dur="1.4"><img src="${esc(d.imagen)}" alt=""></div>
        <div class="side">${kicker(d, 0.35)}${titulo(d, 0.5)}
          <ul class="bullets">${lista(lines(d.puntos), modo(d, 'todo') === 'uno', 1.0, (p, i, a) => `
            <li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="up" ${a}>${md(p)}</li>`)}
          </ul>
        </div>`,
    },

    fuelle: {
      pasos: 'todo',
      render: (d) => `
        <div class="split2">
          <div>${kicker(d)}${titulo(d)}
            <p class="body" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>
            <ul class="bullets">${lista(lines(d.puntos), modo(d, 'todo') === 'uno', 1.0, (p, i, a) => `
              <li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="up" ${a}>${md(p)}</li>`)}
            </ul>
          </div>
          <div class="scope-card" data-k="hero" data-shape="box" data-m="pop" data-at=".5" data-dur="1">
            <svg class="scope" viewBox="0 0 900 700">
              <g transform="translate(0 30)"><text x="0" y="0" class="ll">POSICIÓN DEL FUELLE · encoder</text><path class="sig s1"/><line x1="0" x2="900" y1="100" y2="100" class="axis"/></g>
              <g transform="translate(0 260)"><text x="0" y="0" class="ll">VELOCIDAD · dirección</text><path class="sig s2"/><line x1="0" x2="900" y1="100" y2="100" class="axis"/></g>
              <g transform="translate(0 490)"><text x="0" y="0" class="ll">VOLUMEN · dinámica</text><path class="sig s3"/><line x1="0" x2="900" y1="160" y2="160" class="axis"/></g>
              <line class="playhead" x1="840" x2="840" y1="10" y2="690"/>
              <text class="dir" x="830" y="250" text-anchor="end"></text>
            </svg>
          </div>
        </div>`,
      // Señal simulada: posición del fuelle, su derivada y un volumen suavizado
      tick(root, t) {
        const pos = (x) => Math.sin(x * 1.1) * 0.75 + Math.sin(x * 2.3 + 1) * 0.2;
        const vel = (x) => (pos(x + 0.01) - pos(x - 0.01)) / 0.02;
        const W = 840, span = 7, N = 140;
        const pts = (f, base, amp) => Array.from({ length: N + 1 }, (_, i) => {
          const x = (i / N) * W, tt = t - span + (i / N) * span;
          return `${i ? 'L' : 'M'}${x.toFixed(1)} ${(base - f(tt) * amp).toFixed(1)}`;
        }).join(' ');
        const set = (sel, d) => { const p = root.querySelector(sel); if (p) p.setAttribute('d', d); };
        set('.s1', pts(pos, 100, 80));
        set('.s2', pts((x) => vel(x) / 1.6, 100, 80));
        set('.s3', pts((x) => Math.min(1, Math.abs(vel(x)) / 1.4), 160, 130));
        const dir = root.querySelector('.dir');
        if (dir) dir.textContent = vel(t) >= 0 ? 'abre ▲' : 'cierra ▼';
      },
    },

    bisonoro: {
      pasos: 'uno',
      // El panel llega vacío con la tabla; en el punto clave siguiente se escribe el código
      render: (d, ctx) => {
        const uno = modo(d, 'uno') === 'uno', s1 = (at) => (uno ? `data-s="1" data-at="${at}"` : `data-at="${f2(at + 1.6)}"`);
        return `${numeral(ctx)}
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md')}
          <p class="body" data-f="cuerpo" data-m="up" data-at=".6">${md(d.cuerpo)}</p>
          <div class="two">
            <div class="maprows">
              <div class="mhead" data-m="fade" data-at=".9"><span>Botón</span><span>Abriendo</span><span>Cerrando</span></div>
              ${pairs(d.tabla).map((r, i) => { const [a, c] = r.d.split('/'); return `
              <div class="pt mrow" data-f="tabla" data-k="item-${i}" data-shape="bar" data-m="left" data-at="${f2(1.05 + i * 0.16)}"><span>${esc(r.t)}</span><span>${esc((a || '').trim())}</span><span>${esc((c || '').trim())}</span></div>`; }).join('')}
            </div>
            <pre class="code" data-f="codigo" data-k="hero" data-shape="box" data-m="up" data-at="1"><code data-m="type" ${s1(0.15)} data-dur="2.6">${esc(d.codigo)}</code></pre>
          </div>
          ${d.nota ? `<p class="foot-note" data-f="nota" data-m="fade" ${s1(1.4)}>${md(d.nota)}</p>` : ''}
        </div>`;
      },
    },

    modos: {
      pasos: 'uno',
      render: (d, ctx) => `${numeral(ctx)}
        <div class="pad">${kicker(d)}${titulo(d)}
          <div class="two even">
            <div class="col-card" data-f="izq" data-k="item-0" data-shape="box" data-m="left" data-at=".6"><h3>${md(d.izqTitulo)}</h3><ul class="bullets">${lines(d.izq).map((p) => `<li>${md(p)}</li>`).join('')}</ul></div>
            <div class="col-card" data-f="der" data-k="item-1" data-shape="box" data-m="right" ${modo(d, 'uno') === 'uno' ? 'data-s="1" data-at=".1"' : 'data-at="1"'}><h3>${md(d.derTitulo)}</h3><ul class="bullets">${lines(d.der).map((p) => `<li>${md(p)}</li>`).join('')}</ul>
              <div class="midi"><small data-f="nota">${md(d.nota)}</small><pre></pre></div></div>
          </div>
        </div>`,
      // Mensajes MIDI de ejemplo pasando por el monitor
      tick(root, t) {
        const pre = root.querySelector('.midi pre');
        if (!pre) return;
        const notes = [69, 71, 72, 74, 76, 74, 72, 71];
        const k = Math.floor(t * 2.2), rows = [];
        for (let i = Math.max(0, k - 3); i <= k; i++) {
          const n = notes[i % notes.length], on = i % 2 === 0;
          rows.push(`${on ? 'Note On ' : 'Note Off'}  ch 1  nota ${n}  vel ${on ? 64 + ((i * 13) % 50) : 0}`);
        }
        pre.textContent = rows.join('\n');
      },
    },

    cifra: {
      render: (d) => `
        <div class="pad">${kicker(d)}${titulo(d)}
          <div class="two">
            <div><div class="figure" data-f="numero" data-m="pop" data-at=".6" data-dur="1.1">${esc(d.prefijo)}<span data-m="count" data-at=".7" data-dur="1.6" data-to="${esc(d.numero)}">0</span><small>${esc(d.unidad)}</small></div>
              <p class="body" data-f="texto" data-m="up" data-at="1.1">${md(d.texto)}</p></div>
            <div class="bars-card" data-f="barras" data-k="hero" data-shape="box" data-m="up" data-at=".8">${pairs(d.barras).map((b, i) => `
              <div class="bar"><div class="bl"><span>${esc(b.t)}</span><span>${esc(b.d)} %</span></div>
                <div class="track"><i data-m="wipe" data-at="${f2(1.2 + i * 0.35)}" data-dur="1.3" style="width:${parseFloat(b.d) || 0}%"></i></div></div>`).join('')}
              ${d.nota ? `<p class="bnote" data-f="nota" data-m="fade" data-at="2.2">${md(d.nota)}</p>` : ''}
            </div>
          </div>
        </div>`,
    },

    video: {
      render: (d) => `
        <div class="pad center">${kicker(d)}${titulo(d, 0.12, 'md')}
          <div class="player" data-f="video" data-k="hero" data-shape="box" data-m="pop" data-at=".5" data-dur="1"><video src="${esc(d.video)}" poster="${esc(d.imagen)}" preload="metadata" playsinline controls></video></div>
        </div>`,
      // En el punto clave arranca el video; al moverse, se detiene
      onHold(root) { const v = root.querySelector('video'); if (v) v.play().catch(() => {}); },
      onLeave(root) { const v = root.querySelector('video'); if (v) v.pause(); },
    },

    cierre: {
      pasos: 'uno',
      // Conclusiones primero; el logo y las preguntas en el punto clave siguiente
      render: (d, ctx) => {
        const s = (at) => (modo(d, 'uno') === 'uno' ? `data-s="1" data-at="${at}"` : `data-at="${f2(at + 1.6)}"`);
        return `
        <div class="split2">
          <div>${kicker(d)}${titulo(d, 0.12, 'md')}
            <ol class="points sm">${lines(d.puntos).map((p, i) => `
              <li class="pt" data-f="puntos" data-k="item-${i}" data-shape="bar" data-m="left" data-at="${f2(0.7 + i * 0.2)}"><span class="num">${nn(i + 1)}</span><span>${md(p)}</span></li>`).join('')}
            </ol>
          </div>
          <div class="closing">
            <div class="cl-logo" data-f="logo" data-m="pop" data-dur="1.2" ${s(0.1)}>${ctx.logo('big')}</div>
            <div class="final" data-f="final" data-m="letters" ${s(0.5)}>${md(d.final)}</div>
            <div class="meta" data-f="equipo" data-m="up" ${s(1)}><b>${esc(d.equipo)}</b><span>${esc(d.institucion)}</span></div>
          </div>
        </div>`;
      },
    },
  };

  window.MOTION = { TIPOS };
})();
