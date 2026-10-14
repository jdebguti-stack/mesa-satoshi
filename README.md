# Mesa Satoshi

Oficina en pixel art donde cinco empleados virtuales operan Bitcoin con dinero ficticio y precios reales.

- Web estática (un solo `index.html`), sin servidor ni claves.
- Datos: API pública de Binance (con Binance Vision y Kraken como alternativa) y el índice de miedo y codicia de alternative.me.
- Decisiones por reglas fijas (medias de 50 y 200 velas, RSI, ATR). No usa modelos de IA.
- Todo el dinero es ficticio. El estado se guarda en el navegador (localStorage).
- El botón "Probar variantes" compara 4 variantes fijadas de antemano (control de 4 h, diaria, stop móvil y filtro de EMA200 diaria) sobre hasta 3 años de datos, con comisiones y deslizamiento, frente a comprar y mantener.
- Criterio, fijado antes de ver resultados: una variante pasa si gana dinero en los dos primeros tercios, sigue ganando en el último y su caída máxima es menor que la de comprar y mantener a la misma escala. Con menos de 30 operaciones el resultado es orientativo.
- La tabla incluye el capital medio que cada variante tuvo en BTC y qué habría dado comprar y mantener solo esa fracción, para separar el resultado de simplemente arriesgar poco.
- La oficina en vivo revisa el mercado una vez al día (cierre de la vela diaria, 00:00 UTC) con la variante Diaria: velas de 1 día, volatilidad máxima del 6 %, stop a 2 ATR, objetivo a 3 ATR y salida si el cierre baja de la media de 50 días. Pasó la prueba por poco; no tiene ventaja demostrada. El capital ficticio empieza de cero (10.000 USDT) con esta versión.

No es asesoramiento financiero.
