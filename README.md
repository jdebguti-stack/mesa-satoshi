# Mesa Satoshi

Oficina en pixel art donde cinco empleados virtuales operan Bitcoin con dinero ficticio y precios reales.

- Web estática (un solo `index.html`), sin servidor ni claves.
- Datos: API pública de Binance (con Binance Vision y Kraken como alternativa) y el índice de miedo y codicia de alternative.me.
- Decisiones por reglas fijas (medias de 50 y 200 velas, RSI, ATR). No usa modelos de IA.
- Todo el dinero es ficticio. El estado se guarda en el navegador (localStorage).
- El botón "Probar reglas" ejecuta las mismas reglas sobre hasta 3 años de velas de 4 horas.

No es asesoramiento financiero.
