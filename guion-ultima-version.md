# Guion · última versión

Presentación timeline de BandoneAR (`presentacion/timeline.html`) · 24 de octubre de 2026

La presentación timeline de BandoneAR (22 diapositivas) dura **unos 9 minutos** hablada entre cinco personas. La demo en vivo va aparte, después: en la diapositiva 20 se le pasa la palabra a quien toca, y las conclusiones y el agradecimiento se dicen al terminar la demo.

| Persona | Diapositivas | Tema | Tiempo |
| --- | --- | --- | --- |
| Persona 1 | 1 a 5 | Portada y origen de la idea | ~1:50 |
| Persona 2 | 6 a 9 | ¿Es viable? El instrumento por dentro | ~1:30 |
| Persona 3 | 10 a 13 | El fuelle, el veredicto y los componentes | ~1:40 |
| Persona 4 | 14 a 16 | Software, switches y conexiones | ~1:35 |
| Persona 5 | 17 a 22 | Desafíos, pase a la demo, conclusiones y gracias | ~1:50 |
| **Total** | **22** | | **~8:25 + ~20 s de pases ≈ 8:45** |

Los tiempos salen de leer cada texto a un ritmo tranquilo (unas 130 palabras por minuto) y dejan unos 15 segundos de margen para llegar a 9. No incluyen la demo ni las preguntas.

Quién es cada persona lo deciden ustedes. Una sugerencia: que la Persona 1 sea quien aprendió bandoneón con la guía de papel, porque cuenta esa historia, y que esa misma persona toque en la demo.

## Persona 1 · Origen de la idea (diapositivas 1 a 5, ~1:50)

**1. Portada: BandoneAR** · ~20 s

> Buenas tardes. Somos el grupo 106: Brenda, Maxi, Antonio, Leo y Franco. Les presentamos BandoneAR, un bandoneón digital, contado como lo vivimos: la idea, si era viable, la solución y lo que nos costó.

**2. Etapa 01: Origen de la idea** · ~5 s

> Primero, de dónde salió la idea.

**3. Aprender con una guía de papel** · ~35 s

> Uno de nosotros, aficionado al tango, estaba aprendiendo bandoneón, y nos mostró cómo se estudia: con guías de papel como esta. Cada círculo es un botón, y cada botón da dos notas: una al abrir el fuelle y otra al cerrarlo. Para practicar, no había alternativa al instrumento real.

**4. Una cuestión de accesibilidad** · ~25 s

> Y ese es el problema. Un bandoneón cuesta miles de dólares, casi no se fabrican y la mayoría son usados restaurados. Sin instrumento propio, la práctica no se sostiene.

**5. Los demás instrumentos ya tienen su versión digital** · ~25 s

> El piano tiene el teclado digital; la batería, la electrónica; el violín, el eléctrico. Son más baratos y democratizan el aprendizaje. Al bandoneón le faltaba la suya: BandoneAR. *(Pase)* Ahora Persona 2 les cuenta si era posible.

## Persona 2 · ¿Es viable? (diapositivas 6 a 9, ~1:30)

**6. Etapa 02: ¿Es viable?** · ~5 s

> Para saber si se podía, primero entendimos el instrumento por dentro.

**7. Cómo está construido un bandoneón** · ~30 s

> Tiene dos cabezales: el izquierdo, con 33 botones para los graves, y el derecho, con 38 para los agudos. En el medio, el fuelle, que funciona como un pulmón. Y adentro de cada cabezal, la máquina: brazos, zapatas y voces de acero.

**8. Del botón al sonido** · ~25 s

> Al apretar un botón, un brazo destapa una ranura y el aire del fuelle hace vibrar una voz de acero: una abriendo y otra cerrando. Por eso cada botón tiene dos notas; se dice que es bisonoro.

**9. De lo mecánico a lo electrónico** · ~30 s

> Después buscamos el equivalente electrónico de cada parte. Los botones, switches mecánicos. La máquina, una Raspberry Pi Pico por cabezal. Las voces, síntesis por software con FluidSynth. El aire, un encoder. Y la caja de madera, cabezales impresos en 3D. *(Pase)* Persona 3 les cuenta la parte más difícil.

## Persona 3 · El fuelle y la solución (diapositivas 10 a 13, ~1:40)

**10. Que el fuelle se sienta como el real** · ~35 s

> El mayor desafío fue el fuelle: tenía que acompañar el movimiento, la postura y el agarre, no solo las notas. Como no hay aire, un encoder dentro de un cabezal, con un hilo atado al otro, lee si abrís o cerrás y a qué velocidad. Así el paso al bandoneón tradicional es natural.

**11. Era viable, en los dos frentes** · ~15 s

> Conclusión: era viable. Técnicamente, con teclados MIDI y ese fuelle sin aire. Y económicamente, por cerca del 25 % de lo que cuesta un bandoneón.

**12. Etapa 03: La solución** · ~5 s

> Vamos a la solución.

**13. Componentes principales** · ~45 s

> Los cabezales están impresos en 3D, con 71 switches: 38 a la derecha y 33 a la izquierda, cada uno con su tecla impresa a medida. Una Raspberry Pi Pico por cabezal lee la botonera, y el encoder con hilo lee el fuelle. Una Raspberry Pi Zero genera el sonido y lo saca por dos parlantes: graves a la izquierda, agudos a la derecha. Tiene batería, jack de 3,5 mm y USB-MIDI. *(Pase)* Persona 4 les cuenta cómo funciona por dentro.

## Persona 4 · Software, tacto y conexiones (diapositivas 14 a 16, ~1:35)

**14. De la tecla al sonido, con FluidSynth** · ~40 s

> Las dos Pico escanean las matrices de botones; la izquierda además lee el fuelle y recibe a la derecha por UART. La Raspberry Pi Zero arma cada nota con dos datos: qué botón y hacia dónde va el fuelle. FluidSynth la hace sonar con un SoundFont de bandoneón. En la consola se ve: mismo botón, otra nota cuando el fuelle cambia de sentido.

**15. Un switch mecánico lineal bajo cada botón** · ~25 s

> Para el tacto elegimos switches mecánicos lineales: recorrido parejo, sin escalón ni clic, lo más parecido a la pulsación del original. Lo que la mano aprende acá sirve en el instrumento real.

**16. Cómo se conecta todo** · ~30 s

> En resumen: dos entradas, la botonera y el fuelle; el procesamiento en las Pico y la Pi Zero; y dos salidas. Una autónoma, con parlantes o auriculares, y otra como controlador USB-MIDI para usarlo en la computadora. *(Pase)* Persona 5 les cuenta lo que nos costó.

## Persona 5 · Desafíos, demo y cierre (diapositivas 17 a 22, ~1:50)

**17. Etapa 04: Desafíos y decisiones** · ~5 s

> Ahora, lo que nos costó.

**18. Nueve desafíos, nueve decisiones** · ~50 s

> Al ser un proyecto de hardware, tuvimos que investigar a fondo cada componente y conseguir herramientas. La impresión 3D llevó tiempo, y el teclado tenía que respetar exactamente la distribución original. El fuelle fue lo más difícil: construirlo, montarlo y leerlo con precisión con el encoder. Y evaluamos una PCB propia, pero era inviable por costo, así que cableamos todo a mano.

**19. Etapa 05: Demo del BandoneAR** · ~5 s

> Y ahora, lo que estaban esperando.

**20. Ahora, a tocarlo** · ~10 s, y después la demo

> [Nombre] lo va a tocar en vivo: fíjense cómo cambia la nota cuando el fuelle abre y cierra.

Acá arranca la demo en vivo, que va aparte de los 9 minutos.

**21. Conclusiones** · ~30 s (al terminar la demo)

> BandoneAR conserva la botonera, el tacto y el gesto del fuelle, así que lo que se aprende acá sirve en el instrumento real. El sonido digital separa el aprendizaje del costo. Y funciona solo o conectado por MIDI. Empezamos con una guía de papel y terminamos con un instrumento. ¿Preguntas?

**22. ¡Gracias!** · ~10 s

> Gracias a los docentes, a nuestras familias y a todos los que nos acompañaron.

## Pases y ensayo

Cada bloque termina con una frase de pase (marcada *(Pase)*) que nombra a quien sigue; reemplacen «Persona N» por el nombre real.

| Pase | Después de la diapositiva | Frase |
| --- | --- | --- |
| 1 → 2 | 5 | «Ahora [nombre] les cuenta si era posible.» |
| 2 → 3 | 9 | «[nombre] les cuenta la parte más difícil.» |
| 3 → 4 | 13 | «[nombre] les cuenta cómo funciona por dentro.» |
| 4 → 5 | 16 | «[nombre] les cuenta lo que nos costó.» |
| 5 → demo | 20 | «[nombre] lo va a tocar en vivo.» |

- No hace falta decirlo palabra por palabra: lo importante son los datos (71 botones, 38 y 33, cerca del 25 % del costo, FluidSynth, el encoder con hilo).
- Ensayen una vez de corrido con cronómetro, hasta la diapositiva 20. Si pasan de 9 minutos, recorten primero la 18 (desafíos) y la 13 (componentes), que son las más largas.
- Avancen con → apenas terminan de hablar: la timeline se frena en cada punto clave y no pasa sola.
- Prueben la demo antes, en el mismo lugar: batería cargada, volumen y la pantalla mostrando los mensajes MIDI.
