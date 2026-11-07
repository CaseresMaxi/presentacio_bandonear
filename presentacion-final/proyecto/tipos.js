// Tipos de escena propios de BandoneAR. Se suman a los de motion/tipos.js.
//
// - tecnico/tipos-tecnicos.js: las escenas técnicas de la presentación timeline del repo
//   presentacio_bandonear (guía de papel, anatomía, mecanismo, fuelle, componentes en 3D,
//   software, switch, demo en 3D), con Three.js y el modelo de tecnico/bandonear-3d.js.
// - indice: el cierre con «¿Preguntas?» y un índice discreto para saltar a las secciones
//   técnicas durante las preguntas (cada una tiene `ancla`; el motor salta con data-ir).
// - collage: «¡Gracias!» con un collage de fotos que entran de a una y flotan. Cada lugar es un
//   campo de imagen (foto1, foto2…): con el editor abierto, un clic en una foto la cambia; sin
//   foto queda un marco vacío. `huecos` es la cantidad de lugares.
// - Toda escena con `anexo: true` lleva abajo un «↩ Índice» discreto, y la tecla I vuelve
//   al índice desde cualquier lado.
// Dorso de la hoja de ruta (poster/ruta.html): la hoja de estudio de la escena «guia» de la
// presentación (la botonera derecha con el número de cada botón y sus dos notas), en grande para
// imprimir del otro lado. Lee los botones, los puntos y la nota de esa escena, así que sigue a
// la diapositiva; si la presentación no tiene esa escena, la hoja de ruta queda de una cara.
(function () {
  window.RUTA_CARAS = (window.RUTA_CARAS || []).concat([{
    id: 'dorso', nombre: 'Dorso (hoja de estudio)',
    campos: [
      { group: 'Dorso: la hoja de estudio' },
      { key: 'dorsoRotulo', label: 'Rótulo', type: 'text', def: 'Guía de estudio' },
      { key: 'dorsoTitulo', label: 'Título (*palabra* en acento)', type: 'text', def: 'Mano *derecha*' },
      { key: 'dorsoBajada', label: 'Bajada', type: 'text', def: 'La disposición de las teclas, junto con sus notas.' },
      { key: 'dorsoLeyenda', label: 'Cómo se lee (el botón en grande)', type: 'check', def: true },
      { key: 'dorsoNotacion', label: 'Cómo se escriben las notas', type: 'textarea', def: 'Cifrado americano (c = Do, d = Re, e = Mi, f = Fa, g = Sol, a = La, b = Si, ♯ = sostenido). Las marcas ′ ″ ‴ dicen la octava: c′ es el Do central y cada marca más es una octava más aguda.' },
    ],
    css: `
      .poster[data-cara="dorso"]{justify-content:flex-start}
      .dr-cab .rotulo{display:flex; align-items:center; gap:26px; font:700 30px var(--kicker-fuente, var(--font-body)); letter-spacing:.34em; text-transform:uppercase; color:var(--accent)}
      .dr-cab .rotulo::before{content:""; width:96px; height:4px; background:var(--accent)}
      .dr-cab h1{margin-top:30px; font-family:var(--font-display); font-weight:var(--titulo-peso, 800); font-style:var(--titulo-estilo, normal); text-transform:var(--titulo-caja, none); font-size:170px; line-height:1; letter-spacing:-.03em; color:var(--strong)}
      .dr-cab p{margin-top:22px; font-size:46px; line-height:1.25; color:var(--lead)}
      .dr-hoja{position:relative; margin-top:96px; padding:60px 62px 48px; background:#f4efe4; border-radius:8px; box-shadow:0 40px 90px rgba(0,0,0,.5)}
      .dr-hoja::before{content:""; position:absolute; left:50%; top:-22px; width:260px; height:46px; margin-left:-130px; background:rgba(232,220,190,.8); transform:rotate(-2deg)}
      .dr-svg{display:block; width:100%; height:auto; overflow:visible}
      .dr-svg circle{fill:none; stroke:#2b2622; stroke-width:2.4}
      .dr-svg line{stroke:#2b2622; stroke-width:1.6}
      .dr-svg text{fill:#2b2622; text-anchor:middle; font-family:var(--font-display)}
      .dr-svg .gn{font-size:20px; font-weight:700}
      .dr-svg .ga{font-size:19px; font-style:italic}
      .dr-svg .ga.uno{font-size:26px}
      .dr-hoja .nota{position:absolute; left:62px; top:22px; font-size:30px; color:#7a6f62; font-style:italic}
      .dr-leer{display:grid; grid-template-columns:auto 420px 1fr; gap:60px; align-items:center; margin:auto 0}
      .dr-tags{position:relative; width:380px; height:420px}
      .dr-tags span{position:absolute; right:0; display:block; font-size:34px; font-weight:700; padding:14px 28px; border-radius:60px; white-space:nowrap; background:var(--panel); border:2px solid var(--line); color:var(--strong)}
      .dr-tags span.ac{background:var(--accent); border-color:var(--accent); color:#141414}
      .dr-lupa{width:420px; height:420px; border-radius:50%; background:#f4efe4; border:12px solid var(--accent); box-shadow:0 30px 70px rgba(0,0,0,.5); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:#2b2622; font-family:var(--font-display)}
      .dr-lupa .ln{font-size:60px; font-weight:800; line-height:1}
      .dr-lupa .lc{width:210px; height:210px; border-radius:50%; border:6px solid #2b2622; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px}
      .dr-lupa .lc b{font-size:62px; font-style:italic; font-weight:600; line-height:1}
      .dr-lupa .lc i{width:110px; height:4px; background:#2b2622}
      .dr-pts{list-style:none; padding:0; display:grid; gap:28px}
      .dr-pts li{display:grid; grid-template-columns:70px 1fr; gap:22px; font-size:44px; line-height:1.3; color:var(--lead)}
      .dr-pts li b{font:var(--titulo-peso, 800) 50px/1.1 var(--font-display); color:var(--accent); font-variant-numeric:lining-nums}
      .dr-pts li em{color:var(--accent); font-style:var(--acento-estilo, italic); font-weight:var(--acento-peso, 700)}
      .dr-notacion{padding-top:44px; border-top:2px solid var(--line); font-size:30px; line-height:1.4; color:var(--muted)}
      .dr-pie{display:flex; justify-content:space-between; gap:60px; margin-top:30px; font-size:30px; color:var(--muted)}
      .dr-pie b{color:var(--text); font-weight:600}`,
    render({ U, cfg, escenas }) {
      const g = escenas.find((s) => s.tipo === 'guia' && s.botones);
      if (!g) return null;
      const bs = U.lines(g.botones).map((l) => {
        const [num, notas = '', pos = ''] = l.split('|').map((x) => x.trim());
        const [a, b] = notas.split('/').map((x) => x.trim()), [x, y] = pos.split(',').map(Number);
        return { num, a, b, x: x || 0, y: y || 0 };
      });
      // El botón que se muestra en grande: el «6» (como en la diapositiva) o el del medio
      const fb = bs.find((b) => b.num === '6') || bs[Math.floor(bs.length / 2)];
      const svg = bs.map((b) => `<g><text class="gn" x="${b.x}" y="${b.y - 38}">${U.esc(b.num)}</text><circle cx="${b.x}" cy="${b.y}" r="30"/>${b.b
        ? `<text class="ga" x="${b.x}" y="${b.y - 5}">${U.esc(b.a)}</text><line x1="${b.x - 17}" x2="${b.x + 17}" y1="${b.y + 2}" y2="${b.y + 2}"/><text class="ga" x="${b.x}" y="${b.y + 24}">${U.esc(b.b)}</text>`
        : `<text class="ga uno" x="${b.x}" y="${b.y + 9}">${U.esc(b.a)}</text>`}</g>`).join('');
      const puntos = U.lines(g.puntos);
      // La hoja a lo ancho: el cuadro justo alrededor de los botones (con su número arriba)
      const vb = [Math.min(...bs.map((b) => b.x)) - 48, Math.min(...bs.map((b) => b.y)) - 62, Math.max(...bs.map((b) => b.x)) - Math.min(...bs.map((b) => b.x)) + 96, Math.max(...bs.map((b) => b.y)) - Math.min(...bs.map((b) => b.y)) + 104].join(' ');
      return `
        <header class="dr-cab" data-part="Encabezado del dorso">
          ${cfg.dorsoRotulo ? `<div class="rotulo">${U.esc(cfg.dorsoRotulo)}</div>` : ''}
          <h1>${U.md(cfg.dorsoTitulo, 'em')}</h1>
          ${cfg.dorsoBajada ? `<p>${U.esc(cfg.dorsoBajada)}</p>` : ''}
        </header>
        <section class="dr-hoja" data-part="La hoja">
          ${g.nota ? `<p class="nota">${U.esc(U.plain(g.nota))}</p>` : ''}
          <svg class="dr-svg" viewBox="${vb}">${svg}</svg>
        </section>
        ${cfg.dorsoLeyenda ? `<section class="dr-leer" data-part="Cómo se lee">
          <div class="dr-tags"><span style="top:62px">N.º de botón →</span><span class="ac" style="top:166px">abriendo →</span><span class="ac" style="top:252px">cerrando →</span></div>
          <div class="dr-lupa"><span class="ln">${U.esc(fb.num)}</span><span class="lc">${fb.b ? `<b>${U.esc(fb.a)}</b><i></i><b>${U.esc(fb.b)}</b>` : `<b>${U.esc(fb.a)}</b>`}</span></div>
          <ol class="dr-pts">${puntos.map((t, i) => `<li><b>${U.nn(i + 1)}</b><span>${U.md(t, 'em')}</span></li>`).join('')}</ol>
        </section>` : ''}
        ${cfg.dorsoNotacion ? `<p class="dr-notacion" data-part="Notación">${U.esc(cfg.dorsoNotacion)}</p>` : ''}
        <footer class="dr-pie"><span>${cfg.equipo ? `<b>${U.esc(cfg.equipo)}</b>` : ''}</span><span>${U.esc(cfg.contexto || '')}</span></footer>`;
    },
  }]);
})();

(function () {
  if (!window.MOTION) return; // esta parte es de la presentación
  const { md, esc, pairs } = window.TRAMOYA;
  const { kicker } = window.MOTION.helpers;

  // Los scripts del 3D y de las escenas técnicas, en orden y antes de escenas.js
  const base = document.currentScript.src.replace(/tipos\.js(\?.*)?$/, 'tecnico/');
  ['three-0.149.0.min.js', 'bandonear-3d.js', 'tipos-tecnicos.js'].forEach((f) => document.write(`<script src="${base}${f}"><\/script>`));

  // Lugares del collage: los pedidos (huecos) o, si hay más fotos cargadas, los que hagan falta
  const cantidad = (d) => {
    const cargadas = Object.keys(d).filter((k) => /^foto\d+$/.test(k) && d[k]).map((k) => +k.slice(4));
    return Math.min(40, Math.max(+d.huecos || 0, ...cargadas, 1));
  };

  // Las fotos del collage: flotan sueltas y se acercan despacio (cada una con su fase)
  window.MOTION.registrarMovimiento('deriva', {
    nombre: 'Deriva', fase: 'bucle', usar: 'Fotos sueltas que flotan con un leve giro, cada una a su ritmo.',
    aplicar: (c, r) => {
      const a = c.amb * 0.35 + (+c.d.i || 0) * 1.7;
      r.tr = `translate(${(Math.sin(a) * 6 * c.e).toFixed(2)}px, ${(Math.cos(a * 0.8) * 8 * c.e).toFixed(2)}px) rotate(${(Math.sin(a * 0.6) * 1.5 * c.e).toFixed(2)}deg)`;
    },
  });
  window.MOTION.registrarMovimiento('paneo', {
    nombre: 'Paneo suave', fase: 'bucle', usar: 'Una foto que se acerca y se corre despacio dentro de su marco.',
    aplicar: (c, r) => {
      const i = +c.d.i || 0, a = c.amb;
      r.tr = `scale(${(1 + (0.08 + 0.06 * Math.sin(a * 0.18 + i)) * c.e).toFixed(4)}) translate(${(Math.sin(a * 0.13 + i) * 2 * c.e).toFixed(2)}%, ${(Math.cos(a * 0.11 + i) * 2 * c.e).toFixed(2)}%)`;
    },
  });

  window.TIPOS_PROYECTO = Object.assign(window.TIPOS_PROYECTO || {}, {
    // El instrumento en 3D como protagonista, sin datos técnicos: para presentarlo
    vitrina: {
      nombre: 'Vitrina 3D', conLogo: true,
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'text', 'Nombre (*parte* en acento)'], ['subtitulo', 'area', 'Bajada']],
      ejemplo: { kicker: 'Les presentamos', titulo: 'Bandone*AR*', subtitulo: 'Un bandoneón digital, pensado para aprender.' },
      css: `
        .vt-3d{position:absolute; left:820px; right:-60px; top:40px; bottom:40px}
        .vt-luz{position:absolute; left:900px; top:150px; width:1100px; height:800px; border-radius:50%; pointer-events:none;
          background:radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent)}
        .vt-txt{position:absolute; left:140px; top:0; bottom:0; width:760px; display:flex; flex-direction:column; justify-content:center}
        .vt-txt .vt-logo .logo-iso{height:110px}
        .vt-txt h1{margin:26px 0 0; font-size:150px; line-height:1; letter-spacing:-.04em; white-space:nowrap}
        .vt-txt p{margin:34px 0 0; font-size:40px; line-height:1.3; color:var(--lead); max-width:20ch}`,
      render: (d, ctx) => `
        <div class="vt-luz" data-m="fade" data-at=".2" data-dur="2"></div>
        <div class="vt-3d" data-k="hero" data-r="hero" data-m="zoom" data-at=".3" data-dur="1.8"></div>
        <div class="vt-txt">
          <div class="vt-logo" data-r="logo" data-m="pop" data-at=".5" data-dur="1">${ctx.logo('big')}</div>
          ${d.kicker ? kicker(d, 0.7) : ''}
          <h1 data-f="titulo" data-k="titulo" data-m="letters" data-at=".9">${md(d.titulo)}</h1>
          ${d.subtitulo ? `<p data-f="subtitulo" data-m="renglones" data-at="1.6">${md(d.subtitulo)}</p>` : ''}
        </div>`,
      // El modelo gira despacio y el fuelle respira: nada de teclas ni datos
      tick(root, t) {
        const box = root.querySelector('.vt-3d');
        const m = box && window.BandoneAR3D?.en(box, 'vitrina', { encuadre: { az: 30, el: 14, dist: 122, vaiven: 0.45, y: 0 } });
        if (m) m.cuadro(t, { abre: Math.sin(t * 0.5) * 0.5, acento: getComputedStyle(root).getPropertyValue('--accent').trim() });
      },
    },
    // Cierre con agradecimiento y un collage de fotos (venía de la timeline del repo, como «gracias»)
    collage: {
      nombre: 'Gracias con collage de fotos', conLogo: true,
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'text', 'Título grande'], ['cuerpo', 'area', 'Texto de agradecimiento'], ['equipo', 'text', 'Equipo'],
        ['institucion', 'text', 'Institución'], ['huecos', 'number', 'Lugares del collage (los que no tienen foto quedan como marco vacío)'],
        ['enfoques', 'pairs', 'Enfoque de las fotos que se recortan: "N | x% y%" por línea (N = número de foto; 50% 50% es el centro)']],
      // Un campo de imagen por lugar: se elige con el selector o con un clic en la foto
      camposDe(d) {
        const n = cantidad(d);
        return [...window.TIPOS_PROYECTO.collage.campos, ...Array.from({ length: n }, (_, i) => [`foto${i + 1}`, 'image', `Foto ${i + 1}`])];
      },
      ejemplo: { kicker: 'Fin', titulo: '¡Gracias!', cuerpo: 'A quienes nos acompañaron.', equipo: 'Equipo', institucion: 'Institución', huecos: 12 },
      css: `
        .gr-txt{position:absolute; left:140px; top:0; bottom:0; width:640px; display:flex; flex-direction:column; justify-content:center}
        .gr-logo{margin-bottom:34px}
        .gr-logo .logo-iso{height:120px}
        .gr-tit{margin:0; font-size:150px; line-height:1; letter-spacing:-.04em; white-space:nowrap}
        .gr-txt .body{font-size:30px; max-width:24ch}
        .gr-txt .meta{margin-top:40px; font-size:26px; color:var(--muted)}
        .gr-txt .meta b{display:block; color:var(--strong); font-size:32px; margin-bottom:6px}
        .gr-col{position:absolute; inset:0; pointer-events:none}
        .gr-foto{position:absolute; pointer-events:auto}
        .gr-in{position:absolute; inset:0; background:#f4efe4; padding:4% 4% 14%; box-shadow:0 18px 40px rgba(0,0,0,.45); overflow:hidden}
        .gr-in img{width:100%; height:100%; object-fit:cover; display:block; transform-origin:center}
        .gr-in span{display:flex; width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; gap:6px; border:2px dashed #c9bda8; color:#a89a83; font:italic 800 40px var(--font-display)}
        .gr-in span small{font:600 14px var(--font-body); letter-spacing:.2em; text-transform:uppercase}`,
      render: (d, ctx) => {
        const n = cantidad(d);
        // Grilla suelta en el costado derecho: las columnas que dejan las fotos más grandes y,
        // a igual tamaño, menos lugares vacíos; cada foto con un corrimiento y un giro fijos
        const X0 = 830, Y0 = 110, AW = 970, AH = 840;
        let cols = 1, mejor = -1;
        for (let c = 1; c <= 10; c++) { const r = Math.ceil(n / c), t = Math.min(AW / c, (AH / r) * 1.05) - (c * r - n) * 0.5; if (t > mejor) { mejor = t; cols = c; } }
        const filas = Math.ceil(n / cols), cw = AW / cols, chh = AH / filas;
        const fw = Math.min(cw * 0.98, chh * 0.92 * 1.05), fh = fw * 0.95;
        const azar = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
        const r2 = (x) => Math.round(x * 100) / 100;
        // Qué parte de cada foto queda a la vista cuando el marco la recorta (por defecto, el centro)
        const enfoque = Object.fromEntries(pairs(d.enfoques).map((p) => [p.t, p.d]));
        const ultima = n - (filas - 1) * cols; // la última fila, si queda corta, se centra
        const fotos = Array.from({ length: n }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols), f = d[`foto${i + 1}`], enf = enfoque[String(i + 1)];
          const x = X0 + c * cw + (r === filas - 1 ? ((cols - ultima) * cw) / 2 : 0) + (cw - fw) / 2 + (azar(i, 1) - 0.5) * cw * 0.22, y = Y0 + r * chh + (chh - fh) / 2 + (azar(i, 2) - 0.5) * chh * 0.2;
          return `<div class="gr-foto" style="left:${r2(x)}px; top:${r2(y)}px; width:${r2(fw)}px; height:${r2(fh)}px" data-f="foto${i + 1}" data-m="pop" data-at="${r2(0.5 + azar(i, 4) * 1.6)}" data-dur="1" data-e="deriva" data-i="${i}">
            <div class="gr-in" style="transform:rotate(${r2((azar(i, 3) - 0.5) * 12)}deg)">${f ? `<img src="${esc(f)}" alt="" ${enf ? `style="object-position:${esc(enf)}" ` : ''}data-e="paneo" data-i="${i}">` : `<span>${String(i + 1).padStart(2, '0')}<small>foto</small></span>`}</div></div>`;
        }).join('');
        return `
        <div class="gr-txt">
          <div class="gr-logo" data-r="logo" data-m="pop" data-at=".2" data-dur="1.1">${ctx.logo('big')}</div>
          ${d.kicker ? kicker(d, 0.4) : ''}
          <h1 class="gr-tit" data-f="titulo" data-m="letters" data-at=".6">${md(d.titulo)}</h1>
          ${d.cuerpo ? `<p class="body" data-f="cuerpo" data-m="up" data-at="1.3">${md(d.cuerpo)}</p>` : ''}
          <div class="meta" data-m="up" data-at="1.7"><b data-f="equipo">${esc(d.equipo)}</b><span data-f="institucion">${esc(d.institucion)}</span></div>
        </div>
        <div class="gr-col">${fotos}</div>`;
      },
    },
    indice: {
      nombre: 'Cierre con índice', conLogo: true,
      campos: [['titulo', 'text', 'Frase grande'], ['autores', 'text', 'Autores'], ['contexto', 'text', 'Contexto'],
        ['rotulo', 'text', 'Rótulo del índice'], ['indice', 'pairs', 'Índice: "ancla | texto" por línea (ancla = campo ancla de la escena)']],
      ejemplo: { titulo: '¿Preguntas?', rotulo: 'Para las preguntas', indice: 'fuelle | El fuelle' },
      css: `
        .ix-fin{position:absolute; left:0; right:0; top:140px; text-align:center}
        .ix-fin .ix-logo .logo-iso{height:150px}
        .ix-fin h2{margin:40px 0 0; font-size:150px; line-height:1}
        .ix-fin .meta{margin-top:34px; font-size:28px; color:var(--muted)}
        .ix-fin .meta b{display:block; color:var(--text); font-size:32px; margin-bottom:6px}
        .ix-nav{position:absolute; left:140px; right:140px; bottom:190px; border-top:1px solid var(--line); padding-top:22px}
        .ix-nav small{display:block; font-size:16px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); opacity:.7}
        .ix-nav ol{list-style:none; margin:14px 0 0; padding:0; display:grid; grid-template-columns:repeat(5, 1fr); gap:6px 28px}
        .ix-nav li{font-size:21px; line-height:1.3; color:var(--muted); opacity:.75; padding:6px 0}
        .ix-nav li em{font-style:normal; color:var(--accent); margin-right:10px; font-size:16px}
        .ix-nav li:hover{opacity:1; color:var(--strong)}`,
      render: (d, ctx) => `
        <div class="ix-fin">
          <div class="ix-logo" data-r="logo" data-m="pop" data-at=".2" data-dur="1">${ctx.logo('big')}</div>
          <h2 data-f="titulo" data-k="titulo" data-m="caer" data-at=".5">${md(d.titulo)}</h2>
          <div class="meta" data-m="up" data-at="1"><b data-f="autores">${esc(d.autores)}</b><span data-f="contexto">${esc(d.contexto)}</span></div>
        </div>
        <nav class="ix-nav" data-f="indice" data-m="fade" data-at="1.6" data-dur="1.2">
          <small data-f="rotulo">${esc(d.rotulo || '')}</small>
          <ol>${pairs(d.indice).map((p, i) => `<li data-ir="${esc(p.t)}"><em>${String(i + 1).padStart(2, '0')}</em>${md(p.d)}</li>`).join('')}</ol>
        </nav>`,
    },
  });

  // Después de que se registran las escenas técnicas: el «↩ Índice» de las escenas de anexo
  window.__bandonearAnexo = () => {
    const css = document.createElement('style');
    css.textContent = `.ix-volver{position:absolute; right:140px; top:96px; z-index:3; font-size:18px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); opacity:.55; padding:6px 0}
      .ix-volver:hover{opacity:1; color:var(--accent)}`;
    document.head.appendChild(css);
    const todos = [window.MOTION.TIPOS, window.TIPOS_PROYECTO];
    todos.forEach((reg) => Object.values(reg).forEach((t) => {
      if (!t.render || t._anexo) return;
      const r = t.render;
      t.render = (d, ctx) => r(d, ctx) + (d.anexo ? `<div class="ix-volver" data-ir="indice" data-m="fade" data-at="1">↩ Índice</div>` : '');
      t._anexo = true;
    }));
  };
  document.write('<script>window.__bandonearAnexo()<\/script>');

  // Tecla I: vuelve al índice (sin interferir con campos de texto ni con el editor)
  addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[iI]$/.test(e.key)) window.MOTION.ir?.('indice');
  });
})();
