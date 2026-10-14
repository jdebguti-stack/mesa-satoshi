# Mesa Satoshi

Oficina en pixel art donde cinco empleados virtuales operan Bitcoin con dinero ficticio y precios reales.

- Web estática (un solo `index.html`), sin servidor ni claves.
- Datos: API pública de Binance (con Binance Vision y Kraken como alternativa) y el índice de miedo y codicia de alternative.me.
- Decisiones por reglas fijas (medias de 50 y 200 velas, RSI, ATR). No usa modelos de IA.
- Todo el dinero es ficticio. El estado se guarda en el navegador (localStorage).
- El botón "Probar variantes" compara 8 variantes de dos familias nuevas, fijadas antes de ver datos, con unos 3 años de velas diarias:
  - A, rebote en tendencia: entra si el cierre está sobre la EMA200 y el RSI de 2 días baja de 10; sale si el RSI de 2 días pasa de 70 o el cierre supera el máximo del día anterior, a los 10 días como mucho, o en el stop a 3 ATR. Variantes: base, RSI < 5 (señal más exigente), solo con miedo (miedo y codicia < 50) y con el tamaño antiguo.
  - B, ruptura: entra si el cierre supera el máximo de los 55 días anteriores; sale si el cierre baja del mínimo de los 20 días anteriores o en el stop a 2 ATR. Variantes: base, 20/10 (más rápida), sin codicia extrema (miedo y codicia < 80) y con el tamaño antiguo.
  - Por qué esas: cada variante cambia una sola pieza respecto a la base de su familia, para medir qué aporta cada empleado (Nova: señal, Lia: sentimiento, Rex: tamaño).
  - Tamaño nuevo (Rex): la posición se ajusta para que un día normal (1 ATR) mueva como mucho un 2 % del capital, hasta el 100 %. El antiguo (1 % de riesgo, máximo 50 %) dejaba la posición en torno al 10 % del capital y era la principal causa del rendimiento bajo.
  - Elección: solo con los dos primeros tercios de BTC, entre las que ganan con al menos 10 operaciones cerradas, la de mayor beneficio entre caída máxima. La elegida se examina una vez con el último tercio de BTC (ya visto en pruebas anteriores) y con ETH completo; las demás quedan como "reservado".
- Meta: ganar dinero tras comisiones en entrenamiento y en examen (último tercio de BTC y ETH), caer menos que comprar y mantener y acertar al menos el 55 % de las operaciones. El 70 % es un extra. Con menos de 30 operaciones el resultado es orientativo. También se muestra si la elegida bate a comprar y mantener con el mismo capital medio dentro, que es la prueba de ventaja real.
- La oficina en vivo revisa el mercado una vez al día (cierre de la vela diaria, 00:00 UTC) con la variante Diaria: velas de 1 día, volatilidad máxima del 6 %, stop a 2 ATR, objetivo a 3 ATR y salida si el cierre baja de la media de 50 días. Pasó la prueba por poco; no tiene ventaja demostrada. El capital ficticio empieza de cero (10.000 USDT) con esta versión.

- El botón "Probar financiación" simula cobrar la tasa de financiación de los futuros perpetuos de Binance: comprar BTC al contado y vender la misma cantidad en futuros, de modo que el precio no importa. Usa el historial público de tasas (cada 8 horas) y velas diarias de unos 3 años.
  - 4 variantes fijadas antes de ver datos: siempre dentro con el 50 % del capital en cada lado; siempre dentro con el 67 % (Rex arriesga más); entrar solo si la media de las tasas de los últimos 3 días es positiva (Lia); y solo si supera el 0,01 % cada 8 horas (Lia exigente).
  - Costes de 0,25 % del nocional por entrar o salir, reequilibrio si el nocional se desvía más de un 25 % del objetivo, y una liquidación (1 % del nocional) si el máximo del día habría agotado el 90 % del margen.
  - Elección con los dos primeros tercios de BTC (mayor rendimiento anual entre caída máxima) y examen una sola vez con el último tercio de BTC y con ETH.
  - Meta: ganar tras costes en entrenamiento, último tercio de BTC y ETH; caída máxima < 5 %; más de un 4 % al año; y al menos el 55 % de los días dentro con ganancia.
  - Simplificaciones y riesgos no simulados: se ignora la diferencia entre el precio de futuros y el de contado, se cobra la financiación del día entero, y no se recoge el riesgo de que el exchange quiebre o congele fondos.

- Observatorio de memecoins (solo mira, no opera ni promociona): `scripts/collect.mjs` se ejecuta cada hora con GitHub Actions (`.github/workflows/memes.yml`, gratis en repos públicos) y apunta los pools nuevos de Solana de GeckoTerminal (API pública, sin clave) con al menos 1.000 USD de liquidez, hasta 40 por pasada. Mide su precio y liquidez a las 6 h, 1 día, 3 días y 7 días, incluidos los que desaparecen, y deja `data/memes/summary.json`, que la página muestra. Muerto = liquidez < 1.000 USD, precio 90 % o más por debajo del inicial, o pool desaparecido. El objetivo es juntar semanas de datos sin sesgo de supervivencia antes de preguntarse si existe alguna señal.

No es asesoramiento financiero.
