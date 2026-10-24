# Guion · última versión

Presentación timeline de BandoneAR (`presentacion/timeline.html`) · cinco oradores · **15 minutos como máximo, con la demo incluida**. Hablado, son unos 10 minutos y medio entre los cinco.

## El reloj

| Persona | Diapositivas | Tema | Lectura | En vivo |
| --- | --- | --- | --- | --- |
| Persona 1 | 1 a 5 | Portada y origen de la idea | 1:54 | ~2:10 |
| Persona 2 | 6 a 9 | ¿Es viable? El instrumento por dentro | 1:43 | ~2:00 |
| Persona 3 | 10 a 13 | El fuelle, el veredicto y los componentes | 2:05 | ~2:25 |
| Persona 4 | 14 a 16 | Software, tacto y conexiones | 1:50 | ~2:05 |
| Persona 5 | 17 a 20 | Desafíos y pase a la demo | 1:07 | ~1:15 |
| Quien toca | 20 | Demo en vivo | | ~2:30 |
| Persona 5 | 21 y 22 | Conclusiones y gracias | 0:33 | ~0:40 |
| | | Pases entre personas | | ~0:30 |
| **Total** | **22** | | **9:12** | **~13:35** |

«Lectura» es el texto leído de corrido a 130 palabras por minuto, que es un ritmo tranquilo. «En vivo» suma un 15 % por las pausas, por esperar que entre cada animación y por apretar la flecha. Quedan unos **85 segundos de margen** para llegar a 15. Las preguntas no están contadas: si entran dentro de los 15 minutos, usen ese margen y apliquen los recortes del final.

Quién es cada persona lo deciden ustedes. Una sugerencia: que la Persona 1 sea quien aprendió bandoneón con la guía de papel, porque cuenta esa historia en primera persona, y que esa misma persona toque en la demo.

---

## Persona 1 · Origen de la idea (diapositivas 1 a 5, ~2:20)

**1. Portada: BandoneAR** · ~25 s

> Buenas tardes. Somos el grupo 106: Brenda, Maxi, Antonio, Leo y Franco. Les presentamos BandoneAR, un bandoneón digital pensado para aprender. Lo vamos a contar como lo vivimos: de dónde salió la idea, si era posible hacerlo, cómo lo resolvimos, qué nos costó y, al final, el instrumento tocando en vivo.

**2. Etapa 01: Origen de la idea** · ~5 s

> Empecemos por el principio: de dónde salió la idea.

**3. Aprender con una guía de papel** · ~45 s

> Todo empezó porque uno de nosotros, aficionado al tango, se puso a aprender bandoneón. Y nos mostró cómo se estudia: con guías de papel como esta. Cada círculo es un botón, con su número arriba. *(→)* Y adentro de cada círculo hay dos notas, porque el bandoneón es bisonoro: el mismo botón da una nota al abrir el fuelle y otra distinta al cerrarlo. *(→)* Para practicar con esto, sin el instrumento en la mano, no había ninguna alternativa.

**4. Una cuestión de accesibilidad** · ~35 s

> Y ahí está el problema, que es de accesibilidad. *(→)* Un bandoneón cuesta miles de dólares, incluso uno para estudiar. *(→)* Casi no se fabrican: hay pocos luthiers y la mayoría de los que se consiguen son usados restaurados. *(→)* Y sin un instrumento propio, la práctica no se sostiene. Mucha gente que quiere aprender se queda en el camino.

**5. Los demás instrumentos ya tienen su versión digital** · ~30 s

> Entonces nos preguntamos qué pasa con otros instrumentos. El piano tiene el teclado digital; la batería, la electrónica; el violín, el eléctrico. Son más baratos y fáciles de conseguir, y así se democratiza el instrumento y su aprendizaje. *(→)* Al bandoneón le faltaba la suya. *(→)* Esa es BandoneAR.
>
> *(Pase)* Ahora [Persona 2] les cuenta si era posible hacerlo.

---

## Persona 2 · ¿Es viable? (diapositivas 6 a 9, ~2:10)

**6. Etapa 02: ¿Es viable?** · ~10 s

> Antes de diseñar nada, teníamos que entender el instrumento por dentro: cómo está construido, qué particularidades tiene y cómo se toca.

**7. Cómo está construido un bandoneón** · ~40 s

> Un bandoneón tiene tres partes. *(→)* El cabezal izquierdo, con 33 botones para las notas graves. *(→)* El fuelle, en el medio, que funciona como un pulmón: aspira aire al abrirse y lo sopla al cerrarse. *(→)* El cabezal derecho, con 38 botones para las agudas e intermedias. *(→)* Y adentro de cada cabezal, la máquina: brazos, zapatas y voces de acero. *(→)* Por eso decimos que es bisonoro: cada botón da una nota abriendo y otra cerrando.

**8. Del botón al sonido** · ~35 s

> Veamos la máquina en acción. *(→)* Al apretar el botón, un brazo levanta la zapata y destapa una ranura. *(→)* El aire que mueve el fuelle pasa por esa ranura y hace vibrar una lengüeta de acero, que es la voz. *(→)* Si el fuelle cierra, el aire va al revés y suena otra voz. Esa es la mecánica que teníamos que reproducir.

**9. De lo mecánico a lo electrónico** · ~45 s

> Con eso claro, buscamos el equivalente electrónico de cada parte. *(→)* Los botones y sus brazos pasan a ser switches mecánicos. *(→)* La máquina de cada cabezal, una Raspberry Pi Pico, que convierte cada lado en un teclado MIDI. *(→)* Las voces de acero, síntesis por software con FluidSynth. *(→)* La presión del aire, un encoder que lee el movimiento. *(→)* Y la caja de madera, cabezales impresos en 3D.
>
> *(Pase)* [Persona 3] les cuenta la parte más difícil.

---

## Persona 3 · El fuelle y la solución (diapositivas 10 a 13, ~2:15)

**10. Que el fuelle se sienta como el real** · ~45 s

> El mayor desafío fue el fuelle. No queríamos un aparato que solo enseñe a apretar botones: el instrumento tiene que acompañar el movimiento, la postura y el agarre, porque eso también se aprende. Como acá no hay aire, pusimos un encoder adentro de un cabezal, con un hilo atado al centro del otro. Cuando el fuelle abre, el hilo se desenrolla y el encoder gira; cuando cierra, se enrolla. Así sabemos para qué lado va y a qué velocidad, y con eso definimos la nota y la intensidad. El gesto es el mismo que en el bandoneón real, y por eso el paso al tradicional es natural.

**11. Era viable, en los dos frentes** · ~20 s

> La conclusión de esta etapa fue que era viable. *(→)* Técnicamente, con teclados MIDI y un fuelle que no depende del aire. *(→)* Y económicamente, porque los componentes son accesibles: cerca del 25 % de lo que cuesta un bandoneón tradicional.

**12. Etapa 03: La solución** · ~5 s

> Con eso, pasamos a construirlo.

**13. Componentes principales** · ~65 s

> Acá lo ven en 3D y en corte, y cada número sigue a su pieza. Los cabezales están impresos en 3D. Adentro hay 71 switches, 38 a la derecha y 33 a la izquierda, cada uno con su diodo y con una tecla impresa a medida, a la misma altura y distancia que en el original. Una Raspberry Pi Pico por cabezal escanea la botonera, y el encoder con su hilo lee el fuelle. El sonido lo genera una Raspberry Pi Zero con FluidSynth y sale por dos amplificadores y dos parlantes: graves a la izquierda y agudos a la derecha, como en el bandoneón. Además tiene batería, jack de 3,5 milímetros y USB-MIDI.
>
> *(Pase)* [Persona 4] les cuenta cómo funciona por dentro.

---

## Persona 4 · Software, tacto y conexiones (diapositivas 14 a 16, ~2:00)

**14. De la tecla al sonido, con FluidSynth** · ~60 s

> Sigamos un botón desde que se aprieta hasta que suena. Los botones están cableados en matrices de filas y columnas, con un diodo por switch para que no se confundan cuando se aprietan varios a la vez. Las dos Pico escanean esas matrices; la izquierda además lee el fuelle, el volumen y la llave de encendido, y recibe lo de la derecha por UART. *(→)* Todo llega a la Raspberry Pi Zero, que arma cada nota con dos datos: qué botón y hacia dónde va el fuelle. En el registro se ve: el mismo botón da otra nota cuando el fuelle cambia de sentido. *(→)* Esa nota la hace sonar FluidSynth, un sintetizador por software, con un banco de sonidos de bandoneón, y el audio sale por I2S a los dos amplificadores, uno por parlante.

**15. Un switch mecánico lineal bajo cada botón** · ~25 s

> Para el tacto elegimos switches mecánicos lineales. El recorrido es parejo, sin escalón ni clic, que es lo más parecido a la pulsación de un bandoneón. Y eso importa, porque lo que la mano aprende acá sirve en el instrumento real.

**16. Cómo se conecta todo** · ~35 s

> En resumen, el sistema tiene dos entradas: la botonera y el fuelle. *(→)* El procesamiento está en las Pico y en la Pi Zero, que hacen el mapeo bisonoro y la síntesis. *(→)* Y hay dos caminos de salida: uno autónomo, con sus parlantes o auriculares, y otro como controlador USB-MIDI, para usarlo con cualquier programa de música en la computadora.
>
> *(Pase)* [Persona 5] les cuenta lo que nos costó.

---

## Persona 5 · Desafíos y pase a la demo (diapositivas 17 a 20, ~1:20)

**17. Etapa 04: Desafíos y decisiones** · ~5 s

> Ahora, lo que nos costó, que es también lo que más aprendimos.

**18. Nueve desafíos, nueve decisiones** · ~65 s

> Al ser un proyecto mayormente de hardware, tuvimos que investigar a fondo cada componente y cómo funciona, y conseguir las herramientas y los materiales. La impresión 3D llevó su tiempo, porque cada pieza suma horas de diseño y de impresión. *(→)* El teclado tenía que respetar exactamente la distribución del original. El fuelle fue lo más difícil: montarlo sin perder el gesto y leerlo con precisión con el encoder. Y probamos tipos de switch hasta dar con el tacto. *(→)* Evaluamos hacer una placa de circuito propia, pero era inviable por costo, así que cableamos las matrices a mano sobre placas perforadas. Y construimos un fuelle con pliegues que respondan como el real.

**19. Etapa 05: Demo del BandoneAR** · ~5 s

> Y ahora, lo que estaban esperando.

**20. Ahora, a tocarlo** · ~10 s

> [Nombre] lo va a tocar en vivo. Fíjense cómo cambia la nota cuando el fuelle abre y cierra.

### Demo en vivo · ~2:30

Esta escena queda de fondo, con el instrumento en 3D tocando y los mensajes MIDI. Un guion corto para quien toca, para que no se coma el tiempo:

1. **~20 s.** Mostrarlo y nombrar las partes con la mano: los dos cabezales, el fuelle y la correa.
2. **~40 s.** Un solo botón, abriendo y cerrando el fuelle despacio: la misma tecla, dos notas.
3. **~30 s.** La dinámica: el mismo botón con el fuelle lento y después rápido, para que se escuche el cambio de intensidad.
4. **~60 s.** Una escala o una frase corta de tango. Mejor clara que virtuosa.

Si algo falla, no lo arreglen en vivo: digan «les mostramos el video después» y sigan con las conclusiones.

---

## Persona 5 · Cierre (diapositivas 21 y 22, ~40 s)

**21. Conclusiones** · ~30 s

> BandoneAR conserva la botonera, el tacto y el gesto del fuelle, así que lo que se aprende acá sirve en el instrumento real. *(→)* El sonido digital separa el aprendizaje del costo y de la escasez del instrumento. Y funciona solo o conectado por MIDI. Empezamos con una guía de papel y terminamos con un instrumento. *(→)* ¿Preguntas?

**22. ¡Gracias!** · ~10 s

> Gracias a los docentes, a nuestras familias y a todos los que nos acompañaron en este proyecto.

---

## Pases y ensayo

Cada bloque termina con una frase de pase que nombra a quien sigue; reemplacen [Persona N] por el nombre real.

| Pase | Después de la diapositiva | Frase |
| --- | --- | --- |
| 1 → 2 | 5 | «Ahora [nombre] les cuenta si era posible hacerlo.» |
| 2 → 3 | 9 | «[nombre] les cuenta la parte más difícil.» |
| 3 → 4 | 13 | «[nombre] les cuenta cómo funciona por dentro.» |
| 4 → 5 | 16 | «[nombre] les cuenta lo que nos costó.» |
| 5 → demo | 20 | «[nombre] lo va a tocar en vivo.» |

- **Cuándo avanzar.** *(→)* marca cuándo apretar la flecha para el siguiente punto clave de la misma diapositiva. La timeline se frena en cada punto y no pasa sola, así que si se olvidan de avanzar, la pantalla queda atrasada. Conviene que una sola persona maneje la compu toda la presentación, con el guion impreso.
- **Si se pasan de tiempo**, recorten en este orden:
  1. La diapositiva 18 a tres desafíos: impresión 3D, fuelle y PCB (−30 s).
  2. La 13, sin la última oración (−10 s).
  3. La demo, sin el paso 3 (−30 s).
  4. La 14, sin la explicación de los diodos (−10 s).
- **Datos que no se pueden perder**, aunque no lo digan palabra por palabra: 71 botones (38 y 33), bisonoro, cerca del 25 % del costo, encoder con hilo, dos Pico más una Pi Zero, FluidSynth.
- **Ensayo.** Hagan dos pasadas completas con cronómetro, demo incluida. La primera, para ver dónde se traban; la segunda, para medir. Si la segunda da más de 14 minutos, apliquen los recortes.
- **Tiempo por persona.** Que cada uno cronometre su bloque contra la columna «En vivo». Si alguien se pasa más de 20 segundos, recorta en su propio bloque y no le come tiempo al siguiente.
- **Antes de empezar**, en el mismo lugar: batería cargada, volumen probado, la timeline abierta en pantalla completa (tecla F) y en la diapositiva 1.
