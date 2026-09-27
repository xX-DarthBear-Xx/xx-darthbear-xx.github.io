# Notas de mantenimiento (solo para mí)

## Probar en local
    python3 -m http.server 8000   # http://localhost:8000

## Publicar en GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

## Personalizar
- Los datos de contacto están en `index.html` (barra lateral y tarjeta "Current Setup") y en `README.md`.
- Colores: variables en `:root` de `styles.css`.

## Agregar un writeup
1. Copia `content/writeups/_template.md` a `content/writeups/nombre-maquina.md` y escríbelo (usa solo minúsculas y guiones en el nombre del archivo).
2. Ejecuta `python3 build.py`.
3. `git add . && git commit -m "Writeup: nombre" && git push`.

`build.py` ahora genera, además del índice:
- `writeups/nombre-maquina.html` — página estática del writeup (se ve y se indexa bien al compartirla, sin depender de JavaScript). Si borras el `.md`, el `.html` huérfano se borra solo en la siguiente corrida.
- `sitemap.xml` — actualizado con cada writeup.
- `rss.xml` — feed para que alguien pueda seguir tus writeups nuevos.

El sitio también los muestra en la home, en `writeups.html` (con búsqueda y tags) y en la terminal (`ls writeups`, `cat`, `open`).
Nota: en HTB solo se publican writeups de máquinas retiradas.

## Timeline
Edítala en `index.html` (sección `id="timeline"`): cada `<li>` es un hito; la clase `now` marca el actual y `nx` el próximo. Si agregas texto en español, envuélvelo en `<span data-i18n="clave">` y agrega esa clave al diccionario `I18N` en `script.js` (ver sección de idioma más abajo).

## Idioma (ES/EN)
El botón de arriba a la derecha alterna el sitio entre español e inglés. Funciona marcando el texto traducible con `data-i18n="clave"` en el HTML y agregando `clave: {es:'...', en:'...'}` al objeto `I18N` en `script.js`. No traduce automáticamente el contenido de los writeups (cada uno se queda en el idioma en que lo escribiste) ni los textos de la terminal.

## CV en PDF
`assets/cv.pdf` se genera con `scripts/gen_cv.py` (usa reportlab). Para actualizarlo cuando cambien tus certificados, stats de HTB, etc.:
    pip install reportlab --break-system-packages   # si no lo tienes
    cd scripts && python3 gen_cv.py
Sobrescribe `assets/cv.pdf`. El botón "Descargar CV" ya está enlazado en la sección About.

## Stats en vivo de GitHub
La tarjeta del proyecto `recon` consulta `api.github.com/repos/xX-DarthBear-Xx/recon` desde el navegador del visitante para mostrar estrellas y fecha de la última actualización. Si el repo cambia de nombre o la API falla (límite de 60 solicitudes/hora sin autenticación), simplemente no se muestra esa línea y el resto de la tarjeta sigue igual.
