#!/usr/bin/env python3
"""Genera, a partir de content/writeups/*.md:
 - content/writeups/index.json (índice para la home y writeups.html)
 - writeups/<slug>.html (página estática de cada writeup, para compartir e indexar en buscadores)
 - sitemap.xml
 - rss.xml

Uso: python3 build.py   (los archivos que empiezan con _ se ignoran)
"""
import json, pathlib, re
from html import escape as esc
from email.utils import format_datetime
from datetime import datetime, timezone

BASE = 'https://xx-darthbear-xx.github.io/'  # cámbialo si usas otro dominio
ROOT = pathlib.Path(__file__).parent
D = ROOT / 'content' / 'writeups'
OUT = ROOT / 'writeups'
OUT.mkdir(exist_ok=True)

# ---------- mini-renderizador de Markdown (debe reflejar writeups.js -> md()) ----------
def safe(u):
    return '#' if re.match(r'^\s*(javascript|data|vbscript):', u, re.I) else u

def inl(s):
    s = esc(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'!\[([^\]]*)\]\(([^)\s]+)\)', lambda m: f'<img src="{safe(m.group(2))}" alt="{m.group(1)}" loading="lazy">', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', lambda m: f'<a href="{safe(m.group(2))}" target="_blank" rel="noopener">{m.group(1)}</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', s)
    return s

def md(t):
    L = t.replace('\r', '').split('\n')
    o, i = [], 0
    li = re.compile(r'^\s*([-*]|\d+\.)\s+')
    while i < len(L):
        l = L[i]
        if l.startswith('```'):
            lang = l[3:].strip(); b = []; i += 1
            while i < len(L) and not L[i].startswith('```'):
                b.append(L[i]); i += 1
            i += 1
            o.append(f'<pre><code class="lang-{esc(lang)}">{esc(chr(10).join(b))}</code></pre>')
            continue
        m = re.match(r'^(#{1,4})\s+(.*)', l)
        if m:
            n = len(m.group(1)); o.append(f'<h{n}>{inl(m.group(2))}</h{n}>'); i += 1; continue
        if re.match(r'^(-{3,}|\*{3,})$', l.strip()):
            o.append('<hr>'); i += 1; continue
        if l.startswith('>'):
            b = []
            while i < len(L) and L[i].startswith('>'):
                b.append(re.sub(r'^>\s?', '', L[i])); i += 1
            o.append(f'<blockquote>{inl(" ".join(b))}</blockquote>'); continue
        if li.match(l):
            ol = bool(re.match(r'^\s*\d+\.', l)); b = []
            while i < len(L) and li.match(L[i]):
                b.append(f'<li>{inl(li.sub("", L[i]))}</li>'); i += 1
            tag = 'ol' if ol else 'ul'; o.append(f'<{tag}>{"".join(b)}</{tag}>'); continue
        if not l.strip():
            i += 1; continue
        b = [L[i]]; i += 1
        while i < len(L) and L[i].strip() and not re.match(r'^(```|#{1,4}\s|>|\s*([-*]|\d+\.)\s)', L[i]):
            b.append(L[i]); i += 1
        o.append(f'<p>{inl(" ".join(b))}</p>')
    return ''.join(o)

PAGE = '''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · DarthBear</title><meta name="description" content="{desc}">
<link rel="canonical" href="{url}"><meta name="theme-color" content="#080a0e">
<meta property="og:type" content="article"><meta property="og:title" content="{title} · DarthBear"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{base}assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="{base}assets/logo.png">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Chakra+Petch:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{base}styles.css"></head>
<body class="page"><main class="doc">
<nav class="top2"><a href="{base}index.html">← DARTHBEAR</a><a href="{base}writeups.html">Writeups</a></nav>
<header><h1>{title}</h1><p class="wmeta">{meta}</p><p class="tag">{tags}</p></header>
<article class="md">{body}</article>
</main><script src="{base}i18n.js"></script></body></html>
'''

items = []
for f in sorted(D.glob('*.md')):
    if f.name.startswith('_'):
        continue
    text = f.read_text(encoding='utf-8-sig')  # utf-8-sig ignora el BOM si el archivo lo trae
    m = re.match(r'---\r?\n(.*?)\r?\n---\r?\n?(.*)', text, re.S)
    if not m:
        print('sin frontmatter, omitido:', f.name); continue
    meta = {}
    for line in m[1].splitlines():
        if ':' in line:
            k, v = line.split(':', 1); meta[k.strip()] = v.strip()
    slug = f.stem
    tags = [t.strip() for t in meta.get('tags', '').split(',') if t.strip()]
    title = meta.get('title', slug)
    summary = meta.get('summary', '')
    body_src = m[2]
    item = {
        'slug': slug, 'title': title, 'date': meta.get('date', ''),
        'os': meta.get('os', ''), 'difficulty': meta.get('difficulty', ''),
        'tags': tags, 'summary': summary,
        'minutes': max(1, round(len(body_src.split()) / 200)),
        'url': f'writeups/{slug}.html',
    }
    items.append(item)
    page_meta = ' · '.join(x for x in [item['date'], item['os'], item['difficulty']] if x)
    page_tags = ' '.join('#' + esc(t) for t in tags)
    (OUT / f'{slug}.html').write_text(PAGE.format(
        title=esc(title), desc=esc(summary or f'Writeup de {title} por DarthBear.'),
        url=BASE + item['url'], base=BASE, meta=esc(page_meta), tags=page_tags,
        body=md(body_src)), encoding='utf-8')

items.sort(key=lambda i: i['date'], reverse=True)
(D / 'index.json').write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding='utf-8')

# limpiar páginas estáticas huérfanas (writeup borrado pero su .html quedó atrás)
live = {i['slug'] + '.html' for i in items}
for f in OUT.glob('*.html'):
    if f.name not in live:
        f.unlink(); print('eliminado (huérfano):', f.name)

# ---------- sitemap.xml ----------
urls = [(BASE, ''), (BASE + 'writeups.html', '')] + [(BASE + i['url'], i['date']) for i in items]
rows = ''.join('<url><loc>%s</loc>%s</url>' % (esc(loc), f'<lastmod>{d}</lastmod>' if d else '') for loc, d in urls)
(ROOT / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + rows + '</urlset>',
    encoding='utf-8')

# ---------- rss.xml ----------
def rfc822(d):
    try:
        return format_datetime(datetime.strptime(d, '%Y-%m-%d').replace(tzinfo=timezone.utc))
    except Exception:
        return format_datetime(datetime.now(timezone.utc))

rss_items = ''.join(
    f'<item><title>{esc(i["title"])}</title><link>{esc(BASE + i["url"])}</link>'
    f'<guid>{esc(BASE + i["url"])}</guid><pubDate>{rfc822(i["date"])}</pubDate>'
    f'<description>{esc(i["summary"])}</description></item>'
    for i in items
)
(ROOT / 'rss.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>'
    f'<title>DarthBear · Writeups</title><link>{esc(BASE)}</link>'
    '<description>Writeups de Hack The Box y laboratorios de ciberseguridad ofensiva.</description>'
    f'<language>es</language>{rss_items}</channel></rss>',
    encoding='utf-8')

print(len(items), 'writeup(s) · index.json, sitemap.xml, rss.xml y páginas estáticas actualizadas')
