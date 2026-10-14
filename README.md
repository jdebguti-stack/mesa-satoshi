# Mesa Satoshi

Oficina en pixel art donde cinco empleados virtuales operan Bitcoin con dinero ficticio y precios reales.

- Web estática (un solo `index.html`), sin servidor ni claves.
- Datos: API pública de Binance (con Binance Vision y Kraken como alternativa) y el índice de miedo y codicia de alternative.me.
- Decisiones por reglas fijas (medias de 50 y 200 velas, RSI, ATR). No usa modelos de IA.
- Todo el dinero es ficticio. El estado se guarda en el navegador (localStorage).
- El botón "Probar variantes" prueba 8 variantes de la regla Diaria (la propia Diaria, quitar una pieza de Lia, Nova, Rex o Marta, y tres versiones más estrictas) sobre hasta 3 años de velas diarias, con comisiones y deslizamiento. Elige una solo con los dos primeros tercios (entre las que ganan, mayor beneficio entre caída máxima) y mira el último tercio una sola vez, solo para la elegida. Muestra también qué aporta cada empleado.
- Meta: ganar dinero tras comisiones, pasar el criterio (gana en los dos primeros tercios y en el último, y su caída máxima es menor que la de comprar y mantener) y acertar al menos el 55 % de las operaciones. El 70 % cuenta como extra, no como objetivo: acertar mucho no implica ganar dinero y buscar hasta dar con un 70 % es sobreajustar. Con menos de 30 operaciones el resultado es orientativo.
- La oficina en vivo revisa el mercado una vez al día (cierre de la vela diaria, 00:00 UTC) con la variante Diaria: velas de 1 día, volatilidad máxima del 6 %, stop a 2 ATR, objetivo a 3 ATR y salida si el cierre baja de la media de 50 días. Pasó la prueba por poco; no tiene ventaja demostrada. El capital ficticio empieza de cero (10.000 USDT) con esta versión.

No es asesoramiento financiero.
