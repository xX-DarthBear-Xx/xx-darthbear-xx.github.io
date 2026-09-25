# Notas de mantenimiento (solo para mí)

## Probar en local
    python3 -m http.server 8000   # http://localhost:8000

## Publicar en GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

## Personalizar
- Los datos de contacto están en `index.html` y `README.md`.
- Colores: variables en `:root` de `styles.css`.


## Agregar un writeup
1. Copia `content/writeups/_template.md` a `content/writeups/nombre-maquina.md` y escríbelo (usa solo minúsculas y guiones en el nombre del archivo).
2. Ejecuta `python3 build.py` (actualiza `content/writeups/index.json`).
3. `git add . && git commit -m "Writeup: nombre" && git push`.
El sitio lo muestra solo en la home, en `writeups.html` y en la terminal (`ls writeups`, `cat`, `open`). `build.py` también actualiza `sitemap.xml`.
Nota: en HTB solo se publican writeups de máquinas retiradas.

## Timeline
Edítala en `index.html` (sección `id="timeline"`): cada `<li>` es un hito; la clase `now` marca el actual y `nx` el próximo.
