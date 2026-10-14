# Mesa Satoshi

Oficina en pixel art donde cinco empleados virtuales operan Bitcoin con dinero ficticio y precios reales.

- Web estática (un solo `index.html`), sin servidor ni claves.
- Datos: API pública de Binance (con Binance Vision y Kraken como alternativa) y el índice de miedo y codicia de alternative.me.
- Decisiones por reglas fijas (medias de 50 y 200 velas, RSI, ATR). No usa modelos de IA.
- Todo el dinero es ficticio. El estado se guarda en el navegador (localStorage).
- El botón "Probar variantes" compara 4 variantes fijadas de antemano (control de 4 h, diaria, stop móvil y filtro de EMA200 diaria) sobre hasta 3 años de datos, con comisiones y deslizamiento, frente a comprar y mantener.
- Criterio, fijado antes de ver resultados: una variante pasa si gana dinero en los dos primeros tercios, sigue ganando en el último y su caída máxima es menor que la de comprar y mantener a la misma escala. Con menos de 30 operaciones el resultado es orientativo.
- Las reglas que usa la oficina en vivo (control) no tienen ventaja demostrada.

No es asesoramiento financiero.
