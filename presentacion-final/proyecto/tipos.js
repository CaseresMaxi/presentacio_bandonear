// Tipos de escena propios de BandoneAR. Se suman a los de motion/tipos.js.
//
// - tecnico/tipos-tecnicos.js: las escenas técnicas de la presentación timeline del repo
//   presentacio_bandonear (guía de papel, anatomía, mecanismo, fuelle, componentes en 3D,
//   software, switch, demo en 3D), con Three.js y el modelo de tecnico/bandonear-3d.js.
// - indice: el cierre con «¿Preguntas?» y un índice discreto para saltar a las secciones
//   técnicas durante las preguntas (cada una tiene `ancla`; el motor salta con data-ir).
// - Toda escena con `anexo: true` lleva abajo un «↩ Índice» discreto, y la tecla I vuelve
//   al índice desde cualquier lado.
(function () {
  if (!window.MOTION) return; // esta parte es de la presentación
  const { md, esc, pairs } = window.TRAMOYA;
  const { kicker } = window.MOTION.helpers;

  // Los scripts del 3D y de las escenas técnicas, en orden y antes de escenas.js
  const base = document.currentScript.src.replace(/tipos\.js(\?.*)?$/, 'tecnico/');
  ['three-0.149.0.min.js', 'bandonear-3d.js', 'tipos-tecnicos.js'].forEach((f) => document.write(`<script src="${base}${f}"><\/script>`));

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
