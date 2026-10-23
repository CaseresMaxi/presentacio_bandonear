// Escenas de la presentación: tipos (cómo se dibujan y qué se edita) y el guion por defecto.
//
// Cada elemento con data-in se anima al entrar la escena: el motor (index.html) calcula
// su estado según el tiempo de la escena, así la animación se puede pausar y rebobinar.
//   data-in  = up | left | right | zoom | fade | draw | wipe | count | type
//   data-at  = segundo en el que empieza (desde que entra la escena)
//   data-dur = duración en segundos
// Cuando terminan todas, la escena queda en pausa hasta el próximo "siguiente".
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // *texto* va en color de acento
  const md = (s) => esc(s).replace(/\*(.+?)\*/g, '<span class="accent">$1</span>');
  const lines = (v) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((x) => String(x).trim()).filter(Boolean);
  const pairs = (v) => lines(v).map((l) => { const [t, ...d] = l.split('|'); return { t: t.trim(), d: d.join('|').trim() }; });

  // ---------- Tipos de escena ----------
  // campos: text, area, lines (una por línea), pairs ("título | detalle" por línea), image, video
  const TIPOS = {
    portada: {
      nombre: 'Portada',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'text', 'Título (*AR* en color)'], ['subtitulo', 'area', 'Subtítulo'],
        ['equipo', 'text', 'Equipo'], ['institucion', 'text', 'Institución'], ['imagen', 'image', 'Imagen de fondo']],
      render: (d, ctx) => `
        <div class="bg-photo" data-in="zoom" data-at="0" data-dur="2.4"><img src="${esc(d.imagen)}" alt=""></div>
        <div class="cover">
          <div class="kicker" data-in="fade" data-at="0.3">${md(d.kicker)}</div>
          <div class="lockup" data-in="up" data-at="0.5" data-dur="1.1">${ctx.logo()}<h1>${md(d.titulo)}</h1></div>
          <p class="sub" data-in="up" data-at="1.1">${md(d.subtitulo)}</p>
          <div class="meta" data-in="fade" data-at="1.7"><b>${esc(d.equipo)}</b><span>${esc(d.institucion)}</span></div>
        </div>`,
    },

    texto: {
      nombre: 'Texto con puntos',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['cuerpo', 'area', 'Párrafo (opcional)'], ['puntos', 'lines', 'Puntos (uno por línea)']],
      render: (d) => `
        <div class="pad">
          <div class="kicker" data-in="fade" data-at="0">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15" data-dur="1">${md(d.titulo)}</h2>
          ${d.cuerpo ? `<p class="body" data-in="up" data-at="0.6">${md(d.cuerpo)}</p>` : ''}
          <ol class="points">${lines(d.puntos).map((p, i) => `
            <li data-in="left" data-at="${(0.8 + i * 0.25).toFixed(2)}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${md(p)}</span></li>`).join('')}
          </ol>
        </div>`,
    },

    requisitos: {
      nombre: 'Tarjetas (requisitos)',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['items', 'pairs', 'Tarjetas: "título | detalle" por línea']],
      render: (d) => `
        <div class="pad">
          <div class="kicker" data-in="fade">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
          <div class="cards">${pairs(d.items).map((it, i) => `
            <div class="card" data-in="up" data-at="${(0.7 + i * 0.18).toFixed(2)}"><i></i><b>${md(it.t)}</b><span>${md(it.d)}</span></div>`).join('')}
          </div>
        </div>`,
    },

    arquitectura: {
      nombre: 'Diagrama de arquitectura',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'],
        ['bloques', 'pairs', 'Bloques, en orden: botonera, fuelle, procesamiento, síntesis, USB, parlantes, jack, computadora ("título | detalle")'],
        ['nota', 'text', 'Nota al pie']],
      render: (d) => {
        const b = pairs(d.bloques);
        const box = (i, x, y, w, col, at) => `
          <g class="box ${col}" data-in="zoom" data-at="${at}"><rect x="${x}" y="${y}" width="${w}" height="120" rx="18"/>
          <text x="${x + 24}" y="${y + 50}" class="bt">${esc(b[i]?.t || '')}</text>
          <text x="${x + 24}" y="${y + 86}" class="bd">${esc(b[i]?.d || '')}</text></g>`;
        // Conectores: de borde derecho a borde izquierdo, con curva suave
        const link = (x1, y1, x2, y2, at) => `<path class="flow" data-in="draw" data-at="${at}" data-dur="0.8" d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}"/>`;
        return `
        <div class="pad">
          <div class="kicker" data-in="fade">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
          <svg class="diagram" viewBox="0 0 1720 560">
            <text x="30" y="20" class="col" data-in="fade" data-at="0.5">ENTRADAS</text>
            <text x="460" y="20" class="col" data-in="fade" data-at="1.3">PROCESAMIENTO</text>
            <text x="1310" y="20" class="col" data-in="fade" data-at="2.2">SALIDAS</text>
            ${link(420, 170, 460, 300, 1.2)}${link(420, 430, 460, 300, 1.2)}
            ${link(840, 300, 880, 170, 1.9)}${link(840, 300, 880, 430, 1.9)}
            ${link(1260, 170, 1310, 110, 2.6)}${link(1260, 170, 1310, 290, 2.6)}${link(1260, 430, 1310, 470, 2.6)}
            ${box(0, 30, 110, 390, 'in', 0.6)}${box(1, 30, 370, 390, 'in', 0.8)}
            ${box(2, 460, 240, 380, 'core', 1.4)}
            ${box(3, 880, 110, 380, 'core', 2.0)}${box(4, 880, 370, 380, 'core', 2.15)}
            ${box(5, 1310, 50, 400, 'out', 2.7)}${box(6, 1310, 230, 400, 'out', 2.85)}${box(7, 1310, 410, 400, 'out', 3.0)}
            <g class="packets"></g>
          </svg>
          ${d.nota ? `<p class="foot-note" data-in="fade" data-at="3.3">${md(d.nota)}</p>` : ''}
        </div>`;
      },
      // Pulsos de señal viajando por los conectores
      tick(root, t) {
        const g = root.querySelector('.packets');
        if (!g) return;
        const paths = [...root.querySelectorAll('.flow')];
        if (!g.childElementCount) paths.forEach(() => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', 7); g.appendChild(c); });
        paths.forEach((p, i) => {
          const len = p.getTotalLength(), k = ((t * 0.45 + i * 0.17) % 1);
          const pt = p.getPointAtLength(len * k), c = g.children[i];
          c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
          c.style.opacity = t > 3.4 ? 1 : 0;
        });
      },
    },

    imagen: {
      nombre: 'Imagen con puntos',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['imagen', 'image', 'Imagen'], ['puntos', 'lines', 'Puntos (uno por línea)']],
      render: (d) => `
        <div class="split">
          <div class="photo" data-in="wipe" data-at="0" data-dur="1.3"><img src="${esc(d.imagen)}" alt=""></div>
          <div class="pad">
            <div class="kicker" data-in="fade" data-at="0.4">${md(d.kicker)}</div>
            <h2 data-in="up" data-at="0.55">${md(d.titulo)}</h2>
            <ul class="bullets">${lines(d.puntos).map((p, i) => `<li data-in="up" data-at="${(1.1 + i * 0.22).toFixed(2)}">${md(p)}</li>`).join('')}</ul>
          </div>
        </div>`,
    },

    fuelle: {
      nombre: 'Señal del fuelle (gráfico animado)',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['cuerpo', 'area', 'Párrafo'], ['puntos', 'lines', 'Puntos (uno por línea)']],
      render: (d) => `
        <div class="split wide">
          <div class="pad">
            <div class="kicker" data-in="fade">${md(d.kicker)}</div>
            <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
            <p class="body" data-in="up" data-at="0.5">${md(d.cuerpo)}</p>
            <ul class="bullets">${lines(d.puntos).map((p, i) => `<li data-in="up" data-at="${(0.9 + i * 0.2).toFixed(2)}">${md(p)}</li>`).join('')}</ul>
          </div>
          <svg class="scope" viewBox="0 0 900 700" data-in="fade" data-at="0.6" data-dur="1">
            <g class="lane" transform="translate(0 30)"><text x="0" y="0" class="ll">POSICIÓN DEL FUELLE · encoder</text><path class="sig s1"/><line x1="0" x2="900" y1="100" y2="100" class="axis"/></g>
            <g class="lane" transform="translate(0 260)"><text x="0" y="0" class="ll">VELOCIDAD · dirección</text><path class="sig s2"/><line x1="0" x2="900" y1="100" y2="100" class="axis"/></g>
            <g class="lane" transform="translate(0 490)"><text x="0" y="0" class="ll">VOLUMEN · dinámica</text><path class="sig s3"/><line x1="0" x2="900" y1="160" y2="160" class="axis"/></g>
            <line class="playhead" x1="840" x2="840" y1="10" y2="690"/>
            <text class="dir" x="830" y="250" text-anchor="end"></text>
          </svg>
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
      nombre: 'Lógica bisonora (tabla y código)',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['cuerpo', 'area', 'Párrafo'],
        ['tabla', 'pairs', 'Filas: "botón | abriendo / cerrando"'], ['codigo', 'area', 'Código o pseudocódigo'], ['nota', 'text', 'Nota al pie']],
      render: (d) => `
        <div class="pad">
          <div class="kicker" data-in="fade">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
          <p class="body" data-in="up" data-at="0.5">${md(d.cuerpo)}</p>
          <div class="two">
            <table class="map" data-in="up" data-at="0.9"><thead><tr><th>Botón</th><th>Abriendo</th><th>Cerrando</th></tr></thead><tbody>
              ${pairs(d.tabla).map((r, i) => { const [a, c] = r.d.split('/'); return `<tr data-in="left" data-at="${(1.1 + i * 0.2).toFixed(2)}"><td>${esc(r.t)}</td><td>${esc(a || '')}</td><td>${esc(c || '')}</td></tr>`; }).join('')}
            </tbody></table>
            <pre class="code" data-in="fade" data-at="1.2"><code data-in="type" data-at="1.5" data-dur="3">${esc(d.codigo)}</code></pre>
          </div>
          ${d.nota ? `<p class="foot-note" data-in="fade" data-at="2.5">${md(d.nota)}</p>` : ''}
        </div>`,
    },

    modos: {
      nombre: 'Dos columnas (modos de operación)',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['izqTitulo', 'text', 'Columna izquierda: título'], ['izq', 'lines', 'Columna izquierda: puntos'],
        ['derTitulo', 'text', 'Columna derecha: título'], ['der', 'lines', 'Columna derecha: puntos'], ['nota', 'text', 'Nota (sobre los mensajes MIDI)']],
      render: (d) => `
        <div class="pad">
          <div class="kicker" data-in="fade">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
          <div class="two">
            <div class="col-card" data-in="left" data-at="0.6"><h3>${md(d.izqTitulo)}</h3><ul class="bullets">${lines(d.izq).map((p) => `<li>${md(p)}</li>`).join('')}</ul></div>
            <div class="col-card" data-in="right" data-at="0.9"><h3>${md(d.derTitulo)}</h3><ul class="bullets">${lines(d.der).map((p) => `<li>${md(p)}</li>`).join('')}</ul>
              <div class="midi" data-in="fade" data-at="1.6"><small>${md(d.nota)}</small><pre></pre></div></div>
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
      nombre: 'Cifra destacada',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['numero', 'text', 'Número'], ['prefijo', 'text', 'Antes del número (ej. ≈)'], ['unidad', 'text', 'Unidad'],
        ['texto', 'text', 'Texto bajo la cifra'], ['barras', 'pairs', 'Barras: "etiqueta | porcentaje"'], ['nota', 'text', 'Nota al pie']],
      render: (d) => `
        <div class="pad">
          <div class="kicker" data-in="fade">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
          <div class="two">
            <div><div class="figure" data-in="zoom" data-at="0.6">${esc(d.prefijo)}<span data-in="count" data-at="0.7" data-dur="1.6" data-to="${esc(d.numero)}">0</span><small>${esc(d.unidad)}</small></div>
              <p class="body" data-in="up" data-at="1">${md(d.texto)}</p></div>
            <div class="bars">${pairs(d.barras).map((b, i) => `
              <div class="bar" data-in="fade" data-at="${(1 + i * 0.3).toFixed(2)}"><div class="bl"><span>${esc(b.t)}</span><span>${esc(b.d)} %</span></div>
              <div class="track"><i data-in="wipe" data-at="${(1.2 + i * 0.35).toFixed(2)}" data-dur="1.3" style="width:${parseFloat(b.d) || 0}%"></i></div></div>`).join('')}
            </div>
          </div>
          ${d.nota ? `<p class="foot-note" data-in="fade" data-at="2.4">${md(d.nota)}</p>` : ''}
        </div>`,
    },

    video: {
      nombre: 'Video',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'text', 'Título'], ['video', 'video', 'Video'], ['imagen', 'image', 'Imagen de portada del video']],
      render: (d) => `
        <div class="pad center">
          <div class="kicker" data-in="fade">${md(d.kicker)}</div>
          <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
          <div class="player" data-in="zoom" data-at="0.5"><video src="${esc(d.video)}" poster="${esc(d.imagen)}" preload="metadata" playsinline controls></video></div>
        </div>`,
      // En la pausa de la escena, arranca el video; al salir, se detiene
      onHold(root) { const v = root.querySelector('video'); if (v) v.play().catch(() => {}); },
      onLeave(root) { const v = root.querySelector('video'); if (v) v.pause(); },
    },

    cierre: {
      nombre: 'Cierre (conclusiones y preguntas)',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['puntos', 'lines', 'Conclusiones (una por línea)'], ['final', 'text', 'Cierre grande'], ['equipo', 'text', 'Equipo'], ['institucion', 'text', 'Institución']],
      render: (d, ctx) => `
        <div class="split wide">
          <div class="pad">
            <div class="kicker" data-in="fade">${md(d.kicker)}</div>
            <h2 data-in="up" data-at="0.15">${md(d.titulo)}</h2>
            <ol class="points">${lines(d.puntos).map((p, i) => `<li data-in="left" data-at="${(0.6 + i * 0.3).toFixed(2)}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${md(p)}</span></li>`).join('')}</ol>
          </div>
          <div class="closing">
            <div data-in="zoom" data-at="1.6" data-dur="1.1">${ctx.logo('big')}</div>
            <div class="final" data-in="up" data-at="1.9">${md(d.final)}</div>
            <div class="meta" data-in="fade" data-at="2.3"><b>${esc(d.equipo)}</b><span>${esc(d.institucion)}</span></div>
          </div>
        </div>`,
    },
  };

  // ---------- Guion por defecto: técnico y académico ----------
  const EQUIPO = 'Brenda · Maxi · Antonio · Leo · Franco';
  const INSTITUCION = 'Expo Proyecto 2026 · DIIT · Universidad Nacional de La Matanza';
  const ESCENAS = [
    {
      tipo: 'portada', mantener: 7,
      kicker: 'Expo Proyecto 2026 · DIIT · UNLaM',
      titulo: 'Bandone*AR*',
      subtitulo: 'Bandoneón digital para el aprendizaje: un instrumento accesible que conserva la ergonomía, la botonera y el tacto del original.',
      equipo: EQUIPO, institucion: 'Universidad Nacional de La Matanza', imagen: '../assets/img/bandonear-mesa.jpg',
      notas: 'Presentación del equipo y del proyecto en una frase: un bandoneón digital pensado para aprender, con transferencia directa al instrumento tradicional.',
    },
    {
      tipo: 'texto', mantener: 9,
      kicker: 'Planteo del problema',
      titulo: 'Aprender bandoneón exige un instrumento que *casi no existe*.',
      cuerpo: '',
      puntos: 'Fabricación artesanal y escasa: pocos luthiers, la mayoría de los instrumentos son usados restaurados.\nCosto de miles de dólares, incluso para un instrumento de estudio.\nEs bisonoro: cada botón da dos notas, lo que equivale a memorizar cuatro teclados.\nSin un instrumento propio, la práctica no se sostiene.',
      notas: 'Contexto mínimo: no es falta de interés sino de acceso. Las tres barreras: disponibilidad, costo y aprendizaje.',
    },
    {
      tipo: 'texto', mantener: 9,
      kicker: 'Objetivo',
      titulo: 'Un instrumento de estudio con *transferencia directa* al tradicional.',
      cuerpo: 'La técnica aprendida en BandoneAR tiene que servir, sin adaptación, frente a un bandoneón real.',
      puntos: 'Replicar la ergonomía, las distancias, la distribución y el tacto de la botonera.\nReproducir el comportamiento bisonoro y la dinámica del fuelle.\nFuncionar como instrumento autónomo y como controlador MIDI.\nAlcanzar un costo cercano al 25 % de un bandoneón tradicional.',
      notas: 'El criterio que ordena todas las decisiones de diseño: transferencia técnica directa. No buscamos reemplazar al instrumento.',
    },
    {
      tipo: 'requisitos', mantener: 10,
      kicker: 'Requisitos de diseño',
      titulo: 'De la técnica del instrumento a *requisitos medibles*.',
      items: 'Fidelidad física | Distribución, distancia y altura de los botones iguales al original\nTacto | Switches mecánicos lineales: recorrido parejo, sin escalón\nBisonoridad | El mismo botón da una nota abriendo y otra cerrando\nDinámica | Intensidad y volumen según el movimiento del fuelle\nAutonomía | Batería, síntesis y amplificación integradas\nInteroperabilidad | Conexión USB-MIDI con cualquier computadora',
      notas: 'Cada requisito sale de una característica del instrumento real que tiene que conservarse para que el aprendizaje sea transferible.',
    },
    {
      tipo: 'arquitectura', mantener: 12,
      kicker: 'Arquitectura del sistema',
      titulo: 'Entradas, procesamiento y salidas.',
      bloques: 'Botonera | 71 switches · 38 der. / 33 izq.\nFuelle | Encoder: apertura y cierre\nProcesamiento | Lectura y mapeo bisonoro\nSíntesis | Generación digital del sonido\nUSB-MIDI | Modo controlador\nAmplificador | Parlantes estéreo\nSalida auxiliar | Jack 3,5 mm\nComputadora | Producción musical (DAW)',
      nota: 'El sonido es cien por ciento digital: el fuelle no mueve aire, controla el gesto, la postura y la dinámica.',
      notas: 'Recorrer el diagrama de izquierda a derecha. Dos entradas físicas, un núcleo de procesamiento y dos caminos de salida: autónomo y MIDI.',
    },
    {
      tipo: 'imagen', mantener: 9,
      kicker: 'Interfaz física',
      titulo: 'Cabezales y botonera *fieles al original*.',
      imagen: '../assets/img/tacto-switches.webp',
      puntos: 'Cabezales impresos en 3D con la distribución exacta del instrumento.\nTeclas impresas a medida, con la misma distancia y altura.\nSwitches mecánicos lineales: respuesta rápida y recorrido parejo.\n71 botones: 38 en el lado derecho y 33 en el izquierdo.\nFuelle inicial, reemplazable por uno artesanal de luthier.',
      notas: 'Elegimos switches lineales porque su recorrido parejo es lo más parecido a la pulsación de un bandoneón real. La memoria muscular es transferible.',
    },
    {
      tipo: 'fuelle', mantener: 12,
      kicker: 'Sensado del fuelle',
      titulo: 'Del gesto a la *dinámica*.',
      cuerpo: 'Un encoder rotativo convierte la apertura y el cierre del fuelle en una señal de posición. El software deriva de ella la dirección, la velocidad y la aceleración.',
      puntos: 'Dirección: define qué nota da cada botón.\nVelocidad y aceleración: definen intensidad, volumen y dinámica.\nEl fuelle conserva su rol ergonómico y postural.',
      notas: 'Señal ilustrativa: arriba la posición, en el medio su derivada (signo = dirección), abajo el volumen resultante.',
    },
    {
      tipo: 'bisonoro', mantener: 11,
      kicker: 'Lógica bisonora',
      titulo: 'La nota depende del botón *y del sentido del fuelle*.',
      cuerpo: 'Un mapa por lado asocia cada botón a dos notas, una por dirección, siguiendo la disposición del instrumento original.',
      tabla: 'Botón A | La / Sol\nBotón B | Do / Re\nBotón C | Mi / Fa',
      codigo: 'dir  = signo(Δposición)   // +1 abre · −1 cierra\nnota = mapa[lado][botón][dir]\nvel  = f(|Δposición| / Δt)\n\nsi dir cambia mientras hay botones apretados:\n    apagar notas actuales\n    encender mapa[lado][botón][dir]',
      nota: 'Tabla y código ilustrativos: muestran el esquema, no la disposición real de notas.',
      notas: 'Explicar el esquema de mapeo. Aclarar que la tabla es de ejemplo.',
    },
    {
      tipo: 'modos', mantener: 11,
      kicker: 'Modos de operación',
      titulo: 'Instrumento autónomo o *controlador MIDI*.',
      izqTitulo: 'Modo autónomo',
      izq: 'Batería integrada.\nSintetizador y amplificador internos.\nParlantes estéreo: graves a la izquierda y agudos a la derecha, como en el original.\nSalida auxiliar jack 3,5 mm.',
      derTitulo: 'Modo controlador MIDI',
      der: 'Conexión USB a cualquier computadora.\nIntegración con programas de producción musical.\nLibrerías de sonido personalizadas.',
      nota: 'Mensajes MIDI de ejemplo',
      notas: 'Dos modalidades con el mismo instrumento. La distribución estéreo respeta la espacialidad acústica del bandoneón.',
    },
    {
      tipo: 'cifra', mantener: 9,
      kicker: 'Viabilidad',
      titulo: 'Accesible para empezar. *Serio para aprender.*',
      prefijo: '≈', numero: '25', unidad: '%', texto: 'del costo de un bandoneón tradicional.',
      barras: 'Bandoneón tradicional | 100\nBandoneAR | 25',
      nota: 'No lo reemplaza: quien empieza acá puede seguir allá.',
      notas: 'El costo como condición de acceso. El objetivo es facilitar el salto al instrumento tradicional, no sustituirlo.',
    },
    {
      tipo: 'video', mantener: 60,
      kicker: 'Demostración',
      titulo: 'BandoneAR en uso.',
      video: '../assets/video/proyecto_video_final.mp4', imagen: '../assets/img/orquestabandonear.jpg',
      notas: 'El video arranca solo al llegar a esta escena. Siguiente para continuar.',
    },
    {
      tipo: 'texto', mantener: 8,
      kicker: 'Trabajo futuro',
      titulo: 'Próximos pasos.',
      cuerpo: '',
      puntos: 'Fuelle artesanal de luthier hecho a medida.\nLibrerías de sonido personalizadas.\nUso en escuelas: que aprender bandoneón sea tan cotidiano como la flauta dulce.',
      notas: 'Líneas de continuidad del proyecto.',
    },
    {
      tipo: 'cierre', mantener: 15,
      kicker: 'Conclusiones',
      titulo: 'Un instrumento terminado, pensado para *aprender*.',
      puntos: 'Conserva la ergonomía, la botonera y el tacto: la técnica es transferible.\nEl sonido digital desacopla el aprendizaje del costo y la escasez del instrumento.\nFunciona solo o integrado a un estudio vía MIDI.',
      final: '¿Preguntas?',
      equipo: EQUIPO, institucion: INSTITUCION,
      notas: 'Cierre y preguntas.',
    },
  ];

  window.PRESENTACION = { TIPOS, ESCENAS, md, esc, lines, pairs };
})();
