// BandoneAR en 3D (Three.js r149, script clásico en assets/vendor: anda desde file://).
// Fiel al instrumento: cabezales celestes impresos en 3D con filetes blancos, tapa blanca
// con la botonera en domo, correa de cuero, fuelle marrón de muchos pliegues. En modo
// "corte" las cajas se vuelven translúcidas y se ve adentro: switches con su diodo, una
// Raspberry Pi Pico por lado, la Pi Zero con FluidSynth, los dos MAX98357A, los parlantes
// y el encoder del fuelle con su hilo atado al centro del cabezal derecho.
//
// Uso: const b = BandoneAR3D.en(contenedor, 'clave', { corte, encuadre })
//      b.cuadro(t, { abre, teclas, acento })  → dibuja el instante t (segundos)
//      b.anclas()                             → posiciones en pantalla de cada parte
// Los renderers se reutilizan por clave: reconstruir la escena no abre contextos WebGL nuevos.
(function () {
  const T3 = window.THREE;
  const W = 18, H = 20, T = 9, R = 2.4; // cabezal: ancho (z), alto (y), espesor (x), radio
  const WB = 16.4, HB = 18.4, PL = 26; // fuelle: sección y cantidad de pliegues
  const CELESTE = 0x5ab4e5, BLANCO = 0xf3f1ea, CREMA = 0xefe6d2, CUERO = 0x7b4a2b, FUELLE = 0x1e100a;

  function redondeado(w, h, r) {
    const s = new T3.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // Extruye una forma del plano (z, y) a lo largo de x, centrada en x = 0
  function placa(shape, prof, bevel = 0) {
    const g = new T3.ExtrudeGeometry(shape, { depth: prof, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
    g.translate(0, 0, -prof / 2); g.rotateY(Math.PI / 2);
    return g;
  }
  function anillo(w, h, r, grosor, prof) {
    const s = redondeado(w, h, r); s.holes.push(redondeado(w - grosor * 2, h - grosor * 2, Math.max(0.2, r - grosor)));
    return placa(s, prof);
  }
  // Botonera en domo, como la guía: filas en arco sobre la mitad de arriba de la tapa
  function botonera(filas) {
    const out = [];
    filas.forEach((n, f) => {
      for (let i = 0; i < n; i++) {
        const u = n > 1 ? (i - (n - 1) / 2) / ((n - 1) / 2 + 0.5) : 0;
        out.push([(i - (n - 1) / 2) * 1.55, 7.4 - f * 1.5 + 1.1 * (1 - u * u)]);
      }
    });
    return out;
  }
  const mat = (color, o = {}) => new T3.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...o });

  function crear(opts) {
    const corte = !!opts.corte;
    const renderer = new T3.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const escena = new T3.Scene(), cam = new T3.PerspectiveCamera(28, 16 / 9, 1, 500);
    escena.add(new T3.HemisphereLight(0xffffff, 0x2a2018, 0.75));
    const key = new T3.DirectionalLight(0xffffff, 1.0); key.position.set(30, 50, 60); escena.add(key);
    const rim = new T3.DirectionalLight(0xd7a54a, 0.9); rim.position.set(-50, 20, -40); escena.add(rim);
    const fill = new T3.PointLight(0xffffff, 0.35, 0); fill.position.set(-30, -10, 50); escena.add(fill);

    const vidrio = (m) => (corte ? Object.assign(m, { transparent: true, opacity: m.opacity ?? 0.2, depthWrite: false }) : m);
    const raiz = new T3.Group(); escena.add(raiz);
    const partes = {};

    // ---------- Cabezales ----------
    function cabezal(lado) {
      const g = new T3.Group(), s = lado; // s = -1 izquierda, +1 derecha (la cara exterior mira hacia s·x)
      g.add(new T3.Mesh(placa(redondeado(W, H, R), T - 0.6, 0.3), vidrio(mat(CELESTE, { opacity: 0.18 }))));
      [-1, 1].forEach((k) => { const a = new T3.Mesh(anillo(W + 0.9, H + 0.9, R + 0.3, 0.45, 0.5), vidrio(mat(BLANCO, { opacity: 0.5 }))); a.position.x = k * (T / 2 - 1.3); g.add(a); });
      // Tapa blanca con tornillos
      const tapa = new T3.Mesh(placa(redondeado(W - 2.2, H - 2.2, R - 0.8), 0.4), vidrio(mat(BLANCO, { opacity: 0.35 })));
      tapa.position.x = s * (T / 2 + 0.05); g.add(tapa);
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => {
        const t = new T3.Mesh(new T3.CylinderGeometry(0.32, 0.32, 0.3, 12), mat(0x9a9a9a, { metalness: 0.6 }));
        t.rotation.z = Math.PI / 2; t.position.set(s * (T / 2 + 0.3), b * (H / 2 - 2.2), a * (W / 2 - 2.2)); g.add(t);
      });
      // Botones (y, en corte, el switch rojo con su diodo debajo de cada uno)
      const pos = botonera(s < 0 ? [4, 6, 7, 8, 8] : [5, 7, 8, 9, 9]);
      const botones = pos.map(([z, y]) => {
        const b = new T3.Mesh(new T3.CylinderGeometry(0.55, 0.6, 1.0, 18), mat(CREMA, { roughness: 0.35, emissive: 0x000000 }));
        b.rotation.z = Math.PI / 2; b.position.set(s * (T / 2 + 0.6), y, z * -s); b.userData.x0 = b.position.x; g.add(b);
        return b;
      });
      if (corte) {
        pos.forEach(([z, y]) => {
          const sw = new T3.Mesh(new T3.BoxGeometry(1.1, 1.05, 1.05), mat(0xd9362b, { roughness: 0.4 }));
          sw.position.set(s * (T / 2 - 0.9), y, z * -s); g.add(sw);
          const di = new T3.Mesh(new T3.CylinderGeometry(0.12, 0.12, 0.5, 6), mat(0x222222));
          di.position.set(s * (T / 2 - 1.8), y - 0.45, z * -s + 0.4); g.add(di);
        });
      }
      // Correa de cuero: una banda que se separa de la tapa en el medio
      const curva = new T3.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => { const u = i / 8; return new T3.Vector3(s * (T / 2 + 0.5 + 1.9 * Math.sin(Math.PI * u)), H / 2 - 1.6 - u * (H - 3.2), 0); }));
      const correa = new T3.Mesh(new T3.TubeGeometry(curva, 40, 0.42, 8, false), mat(CUERO, { roughness: 0.7 }));
      correa.scale.z = 2.6; correa.position.z = -s * -W * 0.3; g.add(correa);
      [H / 2 - 1.6, -H / 2 + 1.6].forEach((y) => { const h = new T3.Mesh(new T3.BoxGeometry(0.6, 1.2, 2.6), mat(0x8a8a8a, { metalness: 0.6 })); h.position.set(s * (T / 2 + 0.4), y, -s * -W * 0.3); g.add(h); });
      return { g, botones, pos };
    }
    const izq = cabezal(-1), der = cabezal(1);
    raiz.add(izq.g, der.g);

    // ---------- Interior (solo en corte) ----------
    const placaPCB = (w, h, color = 0x1f7a3a) => new T3.Mesh(new T3.BoxGeometry(0.18, h, w), mat(color, { roughness: 0.6 }));
    function parlante() {
      const g = new T3.Group();
      const aro = new T3.Mesh(new T3.CylinderGeometry(3.1, 3.1, 0.6, 32), mat(0x2b2b2e, { metalness: 0.5 })); aro.rotation.z = Math.PI / 2; g.add(aro);
      const cono = new T3.Mesh(new T3.ConeGeometry(2.6, 1.6, 32, 1, true), mat(0x151517, { side: T3.DoubleSide })); cono.rotation.z = Math.PI / 2; cono.position.x = 0.6; g.add(cono);
      const iman = new T3.Mesh(new T3.CylinderGeometry(1.1, 1.1, 1.0, 20), mat(0x77777c, { metalness: 0.8 })); iman.rotation.z = Math.PI / 2; iman.position.x = -0.6; g.add(iman);
      return g;
    }
    let hilo = null, encoder = null;
    if (corte) {
      // Derecha: Pico A, MAX98357A, parlante
      const picoD = placaPCB(5.1, 2.1); picoD.position.set(T / 2 - 4.6, -1.3, 3.2); der.g.add(picoD); partes.pico = picoD;
      const maxD = placaPCB(1.9, 1.8, 0x5b2a86); maxD.position.set(T / 2 - 4.6, -1.4, -4.6); der.g.add(maxD); partes.ampli = maxD;
      const parD = parlante(); parD.position.set(T / 2 - 1.8, -5.6, 0); der.g.add(parD); partes.parlanteD = parD;
      // Izquierda: Pico, Pi Zero (FluidSynth), MAX98357A, parlante, batería, USB, encoder
      const picoI = placaPCB(5.1, 2.1); picoI.position.set(-T / 2 + 4.6, -1.3, -3.2); izq.g.add(picoI);
      const zero = placaPCB(6.5, 3.0, 0x1d6b34); zero.position.set(-T / 2 + 3.4, 5.6, 2.6); izq.g.add(zero); partes.pizero = zero;
      const chipZ = new T3.Mesh(new T3.BoxGeometry(0.3, 1.2, 1.2), mat(0x1b1b1b)); chipZ.position.set(-T / 2 + 3.6, 5.6, 2.4); izq.g.add(chipZ);
      const maxI = placaPCB(1.9, 1.8, 0x5b2a86); maxI.position.set(-T / 2 + 4.6, -1.4, 4.6); izq.g.add(maxI);
      const parI = parlante(); parI.rotation.y = Math.PI; parI.position.set(-T / 2 + 1.8, -5.6, 0); izq.g.add(parI); partes.parlante = parI;
      const bat = new T3.Mesh(new T3.BoxGeometry(1.6, 2.4, 6.0), mat(0x3a4d63, { roughness: 0.5 })); bat.position.set(-T / 2 + 5.6, -6.2, -4.8); izq.g.add(bat); partes.bateria = bat;
      const usb = new T3.Mesh(new T3.BoxGeometry(1.4, 0.7, 0.5), mat(0xb8b8b8, { metalness: 0.7 })); usb.position.set(-T / 2 + 3.4, 4.6, -W / 2 - 0.2); izq.g.add(usb); partes.puertos = usb;
      // Encoder adentro del cabezal izquierdo, del lado del fuelle, con su carretel
      encoder = new T3.Group();
      const cuerpo = new T3.Mesh(new T3.CylinderGeometry(1.3, 1.3, 1.1, 24), mat(0x1c1c1e, { metalness: 0.4 })); cuerpo.rotation.z = Math.PI / 2; encoder.add(cuerpo);
      const carretel = new T3.Mesh(new T3.CylinderGeometry(0.9, 0.9, 0.8, 24), mat(0xf2f2f2)); carretel.rotation.z = Math.PI / 2; carretel.position.x = 1.0; encoder.add(carretel);
      const marca = new T3.Mesh(new T3.BoxGeometry(0.82, 0.25, 1.9), mat(0xd7a54a, { emissive: 0x6a4a10 })); marca.position.x = 1.0; encoder.add(marca);
      encoder.position.set(-T / 2 + 1.6, 0, 0); izq.g.add(encoder); partes.encoder = encoder; encoder.userData.marca = marca;
      const ghilo = new T3.BufferGeometry().setFromPoints([new T3.Vector3(), new T3.Vector3()]);
      hilo = new T3.Line(ghilo, new T3.LineBasicMaterial({ color: 0xffd36a })); raiz.add(hilo);
      const nudo = new T3.Mesh(new T3.SphereGeometry(0.35, 12, 12), mat(0xffd36a, { emissive: 0x6a4a10 })); nudo.position.set(-T / 2 + 0.35, 0, 0); der.g.add(nudo);
    }

    // ---------- Fuelle: una superficie continua de pliegues ----------
    const NP = 64, NC = PL * 2 + 1;
    const contorno = (() => { // puntos del contorno redondeado, en (z, y)
      const pts = redondeado(WB, HB, 2.0).getSpacedPoints(NP);
      return pts.slice(0, NP);
    })();
    const posF = new Float32Array(NC * NP * 3), colF = new Float32Array(NC * NP * 3), idx = [];
    for (let c = 0; c < NC - 1; c++) for (let p = 0; p < NP; p++) {
      const a = c * NP + p, b = c * NP + ((p + 1) % NP), a2 = a + NP, b2 = b + NP;
      idx.push(a, a2, b, b, a2, b2);
    }
    const gF = new T3.BufferGeometry();
    gF.setAttribute('position', new T3.BufferAttribute(posF, 3));
    gF.setAttribute('color', new T3.BufferAttribute(colF, 3));
    gF.setIndex(idx);
    const base = new T3.Color(FUELLE), filo = new T3.Color(0x4a2c1c);
    for (let c = 0; c < NC; c++) { const col = c % 2 ? base : filo; for (let p = 0; p < NP; p++) colF.set([col.r, col.g, col.b], (c * NP + p) * 3); }
    const fuelle = new T3.Mesh(gF, new T3.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: T3.DoubleSide, flatShading: true, ...(corte ? { transparent: true, opacity: 0.4, depthWrite: false } : {}) }));
    raiz.add(fuelle); partes.fuelle = fuelle;
    // Filetes claros en las crestas
    const gL = new T3.BufferGeometry(), posL = new Float32Array((PL + 1) * NP * 2 * 3);
    gL.setAttribute('position', new T3.BufferAttribute(posL, 3));
    const filetes = new T3.LineSegments(gL, new T3.LineBasicMaterial({ color: 0xc9a77a, transparent: true, opacity: corte ? 0.35 : 0.8 }));
    raiz.add(filetes);
    function armarFuelle(L) {
      for (let c = 0; c < NC; c++) {
        const x = -L / 2 + (c / (NC - 1)) * L, k = c % 2 ? 0.86 : 1;
        contorno.forEach((pt, p) => posF.set([x, pt.y * k, pt.x * k], (c * NP + p) * 3));
      }
      gF.attributes.position.needsUpdate = true; gF.computeVertexNormals(); gF.computeBoundingSphere();
      let j = 0;
      for (let c = 0; c < NC; c += 2) {
        const x = -L / 2 + (c / (NC - 1)) * L;
        for (let p = 0; p < NP; p++) { const a = contorno[p], b = contorno[(p + 1) % NP]; posL.set([x, a.y * 1.003, a.x * 1.003, x, b.y * 1.003, b.x * 1.003], j); j += 6; }
      }
      gL.attributes.position.needsUpdate = true; gL.computeBoundingSphere();
    }

    // ---------- Ondas de sonido (demo) ----------
    const ondas = [];
    if (opts.ondas) {
      [-1, 1].forEach((s) => { for (let i = 0; i < 3; i++) {
        const m = new T3.Mesh(new T3.TorusGeometry(6, 0.12, 8, 64), new T3.MeshBasicMaterial({ color: 0xd7a54a, transparent: true, opacity: 0.5 }));
        m.rotation.y = Math.PI / 2; m.userData = { s, i }; raiz.add(m); ondas.push(m);
      } });
    }
    const notas = [];
    if (opts.ondas) {
      for (let i = 0; i < 26; i++) {
        const m = new T3.Mesh(new T3.SphereGeometry(0.32, 10, 10), new T3.MeshBasicMaterial({ color: 0xffd36a, transparent: true }));
        m.userData.i = i; raiz.add(m); notas.push(m);
      }
    }

    // ---------- Un cuadro ----------
    let L = 24;
    function cuadro(t, o = {}) {
      const abre = o.abre ?? Math.sin(t * 1.0) * 0.5 + Math.sin(t * 0.37) * 0.2;
      L = 24 + 7 * abre;
      armarFuelle(L);
      izq.g.position.x = -(L / 2 + T / 2); der.g.position.x = L / 2 + T / 2;
      // Teclas apretadas: se hunden y se encienden
      const ac = new T3.Color(o.acento || '#d7a54a');
      rim.color.copy(ac);
      [izq, der].forEach((h, hi) => h.botones.forEach((b, i) => {
        const on = o.teclas ? o.teclas(hi, i, t) : false;
        b.position.x = b.userData.x0 - Math.sign(b.userData.x0) * (on ? 0.45 : 0);
        b.material.emissive.copy(on ? ac : new T3.Color(0x000000)); b.material.emissiveIntensity = on ? 0.9 : 0;
      }));
      if (encoder) {
        const giro = (L - 24) / 0.9; // el hilo se desenrolla del carretel
        encoder.rotation.x = giro;
        const a = new T3.Vector3(izq.g.position.x - T / 2 + 2.6, 0, 0.9), b = new T3.Vector3(der.g.position.x - T / 2 + 0.35, 0, 0);
        hilo.geometry.setFromPoints([a, b]);
      }
      ondas.forEach((m) => {
        const k = ((t * 0.55 + m.userData.i / 3) % 1), h = m.userData.s > 0 ? der.g : izq.g;
        m.position.set(h.position.x + m.userData.s * (T / 2 + 1 + k * 16), 0, 0);
        m.scale.setScalar(0.6 + k * 1.6); m.material.opacity = 0.55 * (1 - k); m.material.color.copy(ac);
      });
      notas.forEach((m) => {
        const i = m.userData.i, k = ((t * 0.3 + i * 0.137) % 1), s = i % 2 ? 1 : -1, h = s > 0 ? der.g : izq.g;
        const ang = i * 2.39;
        m.position.set(h.position.x + s * (T / 2 + 2 + k * 14), Math.sin(ang) * 6 + k * 10, Math.cos(ang) * 8);
        m.material.opacity = Math.sin(Math.PI * k) * 0.9; m.material.color.copy(ac);
      });
      // Cámara: órbita suave alrededor del instrumento
      const e = opts.encuadre || {}, az = (e.az ?? 32) * Math.PI / 180 + (e.vaiven ?? 0.12) * Math.sin(t * 0.22), el = (e.el ?? 16) * Math.PI / 180, rad = e.dist ?? 92;
      cam.position.set(Math.sin(az) * Math.cos(el) * rad, Math.sin(el) * rad, Math.cos(az) * Math.cos(el) * rad);
      cam.lookAt(0, e.y ?? 0, 0);
      tam();
      renderer.render(escena, cam);
    }
    let cw = 0, ch = 0, cr = 0;
    function tam() {
      const c = renderer.domElement, w = c.clientWidth || 800, h = c.clientHeight || 450;
      const k = Math.min(2, (window.devicePixelRatio || 1) * ((c.getBoundingClientRect().width || w) / w));
      if (w !== cw || h !== ch || Math.abs(k - cr) > 0.05) {
        cw = w; ch = h; cr = k;
        renderer.setPixelRatio(k); renderer.setSize(w, h, false);
        cam.aspect = w / h;
        const e = opts.encuadre || {};
        if (e.corrimiento) cam.setViewOffset(w, h, -w * e.corrimiento, 0, w, h); else cam.clearViewOffset();
        cam.updateProjectionMatrix();
      }
    }
    // Posición en pantalla (px del lienzo) de cada parte
    const v = new T3.Vector3();
    function anclas() {
      const out = {}, P = (obj, dx = 0, dy = 0, dz = 0) => { obj.updateWorldMatrix(true, false); v.set(dx, dy, dz).applyMatrix4(obj.matrixWorld).project(cam); return [(v.x + 1) / 2 * cw, (1 - v.y) / 2 * ch]; };
      out.cabezal = P(der.g, 0, H / 2 + 0.6, W / 2);
      out.teclas = P(der.botones[der.botones.length - 5]);
      out.switches = P(der.g, T / 2 - 0.9, 3.5, -5.0);
      out.fuelle = P(fuelle, 0, -HB / 2, WB / 2);
      ['pico', 'encoder', 'pizero', 'parlante', 'bateria', 'puertos', 'ampli'].forEach((k) => { if (partes[k]) out[k] = P(partes[k]); });
      return out;
    }
    return { renderer, cuadro, anclas };
  }

  const cache = {};
  window.BandoneAR3D = {
    // Devuelve el modelo de esa clave (lo crea una vez) con su lienzo puesto en el contenedor
    en(cont, clave, opts) {
      if (!T3) return null;
      let m = cache[clave];
      if (!m) { try { m = cache[clave] = crear(opts); } catch (e) { console.warn('BandoneAR3D:', e); return null; } }
      const c = m.renderer.domElement;
      if (c.parentNode !== cont) { c.className = 'b3d'; cont.prepend(c); }
      return m;
    },
  };
})();
