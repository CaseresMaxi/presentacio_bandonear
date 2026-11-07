// Datos del proyecto BandoneAR: presentación de producto y funcionalidad.
// Solo contenido: el look lo pone el estilo (proyecto/estilo/, noche-dorada).
window.PROYECTO = {
  id: 'bandonear-producto',
  nombre: 'Bandone*AR*',
  descripcion: 'Un bandoneón digital para aprender: misma botonera, mismo tacto y mismo gesto del fuelle, con sonido digital.',
  autores: 'Brenda · Maxi · Antonio · Leo · Franco',
  contexto: 'Universidad Nacional de La Matanza',

  marca: {
    base: { palabra: 'BandoneAR' },
  },

  estilo: { pie: 'BandoneAR · UNLaM', logo: 'archivo:../proyecto/assets/logo/bandonear-horizontal-barrotes-perspectiva.svg' },

  poster: {
    formato: 'A1',
    evento: 'PROYECTO FINAL', edicion: 'UNLaM', anio: '2026',
    frase: 'Un bandoneón *para aprender*.',
    bajada: 'Misma botonera, mismo tacto, mismo gesto del fuelle. Sonido digital, solo o por MIDI.',
    atributos: '71 botones, Bisonoro, USB-MIDI',
    equipo: 'Brenda · Maxi · Antonio · Leo · Franco', docentes: '',
    qrUrl: '', qrTitulo: 'Miralo.', qrSub: 'Escaneá y abrí la presentación.',
    foto: '../proyecto/assets/img/bandonear-mesa.webp',
  },

  // Hoja de ruta (poster/ruta.html): la presentación momento a momento, sacada de las escenas y sus notas
  ruta: {
    leyenda: '→ avanza · ← vuelve · N muestra las notas del presentador · I vuelve al índice',
    anexoTitulo: 'Para las preguntas',
    anexoNota: 'Desde ¿Preguntas?, un clic en el índice salta a cada una. ↩ Índice o la tecla I vuelven.',
  },

  reel: {
    partes: [
      { tipo: 'barras', pulsos: 4 },
      { tipo: 'palabras', pulsos: 4, palabras: 'Abrís.\nCerrás.\nOtra\nnota.' },
      { tipo: 'dato', pulsos: 4, numero: '71', unidad: '', texto: 'botones, como el original' },
      { tipo: 'titulo', pulsos: 4, texto: 'Mismo gesto. Otro *corazón*.', entrada: 'escala' },
      { tipo: 'logo', pulsos: 12, bajada: 'Un bandoneón digital para aprender', cierre: true },
    ],
  },

  landing: {
    hero: { kicker: 'Proyecto final · UNLaM', titulo: 'Un bandoneón *para aprender*.', bajada: 'BandoneAR conserva la botonera, el tacto y el gesto del fuelle del instrumento real, con sonido digital. Funciona solo o conectado por MIDI.', cta: 'Ver la presentación', ctaUrl: '../motion/index.html', imagen: '../proyecto/assets/img/bandonear-mesa.webp' },
    secciones: [
      { kicker: 'El instrumento', titulo: 'Fiel al *original*.', items: 'Botonera | 71 botones: 38 a la derecha, 33 a la izquierda.\nTacto | Switches mecánicos lineales bajo cada tecla.\nFuelle | Un encoder lee dirección y velocidad.' },
      { kicker: 'Dos modos', titulo: 'Solo, o *conectado*.', texto: 'Modo autónomo con batería, sintetizador y parlantes estéreo, o controlador USB-MIDI para cualquier programa de música.' },
    ],
    pie: 'BandoneAR · UNLaM',
  },
};
