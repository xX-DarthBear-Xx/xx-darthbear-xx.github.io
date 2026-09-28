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
Edítala en `index.html` (sección `id="timeline"`): cada `<li>` es un hito; la clase `now` marca el actual y `nx` el próximo. Si agregas un hito con texto propio, márcalo con `data-i18n` y agrega la clave en `i18n.js` (ver la sección de idioma más abajo).

## Idioma (ES/EN)
Todo el sitio (menú, secciones, terminal, CV, mensajes de error y páginas de writeups) usa `i18n.js`, que se carga en todas las páginas. La preferencia se guarda en el navegador (y si no hay ninguna, se usa el idioma del navegador).
- En el HTML: `data-i18n="clave"` (texto), `data-i18n-html="clave"` (con etiquetas) o `data-i18n-attr="aria-label:clave;placeholder:otra"` (atributos).
- En `i18n.js`, dentro del objeto `D`: `clave: {es:'...', en:'...'}`. Los valores pueden ser funciones (`s=>'texto '+s`) para mensajes con datos.
- En JS: `DB.t('clave')`. Para redibujar contenido dinámico al cambiar de idioma, escucha el evento `darthbear:lang`.
- Si el texto tiene un ícono al lado, envuélvelo en un `<span data-i18n>` para no borrar el ícono.
No se traduce automáticamente el contenido de los writeups (cada uno queda en el idioma en que lo escribiste) ni los datos que vienen de GitHub.

## CV en PDF (español e inglés)
`scripts/gen_cv.py` genera `assets/cv.pdf` (ES) y `assets/cv-en.pdf` (EN) con reportlab; el botón "Descargar CV" enlaza al que corresponde al idioma activo. Para actualizarlos cuando cambien tus certificados, stats de HTB, etc.:
    pip install reportlab --break-system-packages   # si no lo tienes
    cd scripts && python3 gen_cv.py
Edita los textos en el diccionario `TXT` del script (hay uno por idioma).

## Stats en vivo de GitHub
La tarjeta del proyecto `recon` consulta `api.github.com/repos/xX-DarthBear-Xx/recon` desde el navegador del visitante para mostrar estrellas y fecha de la última actualización. Si el repo cambia de nombre o la API falla (límite de 60 solicitudes/hora sin autenticación), simplemente no se muestra esa línea y el resto de la tarjeta sigue igual.
