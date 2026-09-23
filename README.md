# DarthBear · Portafolio

Sitio estático (HTML/CSS/JS), sin dependencias ni build.

## Probar en local
    python3 -m http.server 8000   # http://localhost:8000

## Publicar en GitHub Pages
1. Crea un repositorio público, por ejemplo `darthbear-portfolio` (o `TU-USUARIO.github.io` para usar la URL raíz).
2. Sube estos archivos:
       git init && git add . && git commit -m "Portafolio inicial"
       git branch -M main
       git remote add origin https://github.com/TU-USUARIO/darthbear-portfolio.git
       git push -u origin main
3. En GitHub: Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)`.
4. En un par de minutos estará en `https://TU-USUARIO.github.io/darthbear-portfolio/`.

## Personalizar
- Reemplaza `TU-USUARIO` y `tu@correo.com` en `index.html`.
- Nuevo writeup: copia `writeups/ghostlink.html`, edítalo y enlázalo desde `index.html`.
- Colores: variables en `:root` de `styles.css`.

## Imágenes opcionales
- `assets/hero.jpg`: fondo del hero (montañas + oso). Sin ella se ve un degradado.
- `assets/bear.jpg`: retrato de la tarjeta "About me".
