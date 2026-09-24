#!/usr/bin/env python3
"""Genera content/writeups/index.json y sitemap.xml a partir de los .md de content/writeups/.
Uso: python3 build.py   (los archivos que empiezan con _ se ignoran)"""
import json, pathlib, re
from html import escape
BASE = 'https://xx-darthbear-xx.github.io/'
D = pathlib.Path(__file__).parent / 'content' / 'writeups'
items = []
for f in sorted(D.glob('*.md')):
    if f.name.startswith('_'):
        continue
    m = re.match(r'---\r?\n(.*?)\r?\n---\r?\n?(.*)', f.read_text(encoding='utf-8'), re.S)
    if not m:
        print('sin frontmatter, omitido:', f.name); continue
    meta = {}
    for line in m[1].splitlines():
        if ':' in line:
            k, v = line.split(':', 1); meta[k.strip()] = v.strip()
    items.append({
        'slug': f.stem, 'title': meta.get('title', f.stem), 'date': meta.get('date', ''),
        'os': meta.get('os', ''), 'difficulty': meta.get('difficulty', ''),
        'tags': [t.strip() for t in meta.get('tags', '').split(',') if t.strip()],
        'summary': meta.get('summary', ''), 'minutes': max(1, round(len(m[2].split()) / 200)),
    })
items.sort(key=lambda i: i['date'], reverse=True)
(D / 'index.json').write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding='utf-8')
BASE = 'https://xx-darthbear-xx.github.io'  # cámbialo si usas otro dominio
urls = ['/', '/writeups.html'] + ['/writeup.html?w=' + i['slug'] for i in items]
(D.parent.parent / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + ''.join('  <url><loc>%s%s</loc></url>\n' % (BASE, u) for u in urls) + '</urlset>\n', encoding='utf-8')
print(len(items), 'writeup(s) en index.json y sitemap.xml actualizados')

urls = [(BASE, ''), (BASE + 'writeups.html', '')] + [(BASE + 'writeup.html?w=' + i['slug'], i['date']) for i in items]
rows = ''.join('<url><loc>%s</loc>%s</url>' % (escape(u), '<lastmod>%s</lastmod>' % d if d else '') for u, d in urls)
(pathlib.Path(__file__).parent / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + rows + '</urlset>', encoding='utf-8')
print('sitemap.xml actualizado')
