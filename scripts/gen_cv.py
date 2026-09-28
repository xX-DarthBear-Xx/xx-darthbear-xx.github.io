#!/usr/bin/env python3
"""Genera assets/cv.pdf (español) y assets/cv-en.pdf (inglés) con reportlab.
Uso:  cd scripts && python3 gen_cv.py     (pip install reportlab --break-system-packages)"""
import pathlib
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

OUT = pathlib.Path(__file__).parent.parent / 'assets'
BG=HexColor('#080a0e'); LN=HexColor('#1e242d'); TX=HexColor('#d6dae0'); DM=HexColor('#7d8590'); RD=HexColor('#e5252f')
W,H = letter; M = 20*mm

TXT = {
 'es': dict(file='cv.pdf', subject='Curriculum Vitae - Seguridad Ofensiva',
  about_h='SOBRE MÍ', about='Apasionado por la ciberseguridad, con enfoque en seguridad ofensiva, redes y Linux. Actualmente en preparación de la certificación eJPT y desarrollando proyectos propios (automatización de reconocimiento, herramientas en Python) para seguir creciendo profesionalmente.',
  certs_h='CERTIFICACIONES', c1='Python Ofensivo', c2='Intro. Hacking', c3='eJPT', c3v='En preparación',
  htb_h='HACK THE BOX', profile='Perfil', level='Script Kiddie  ·  Nivel 26 (Apprentice)', machines='Máquinas', mv='15 / 552 resueltas  ·  racha semanal: 3 semanas', rooted='Completadas',
  areas_h='ÁREAS DE TRABAJO',
  areas=[('PENTESTING','Web, redes, Active Directory, escalada de privilegios, Red Team.'),('REDES','TCP/IP, DNS, HTTP/HTTPS, SMB, MQTT, routing.'),('LINUX','Administración, scripting, automatización, herramientas propias.'),('PYTHON','Automatización, scripting, herramientas de seguridad, análisis de datos.')],
  proj_h='PROYECTOS', proj='Framework de reconocimiento automatizado para laboratorios de pentesting (Python).', env_h='ENTORNO',
  foot='APRENDE  >  ROMPE  >  ENTIENDE  >  CONSTRUYE  >  PROTEGE'),
 'en': dict(file='cv-en.pdf', subject='Curriculum Vitae - Offensive Security',
  about_h='ABOUT ME', about='Passionate about cybersecurity, focused on offensive security, networking and Linux. Currently preparing the eJPT certification and building my own projects (reconnaissance automation, Python tooling) to keep growing professionally.',
  certs_h='CERTIFICATIONS', c1='Offensive Python', c2='Intro. Hacking', c3='eJPT', c3v='In progress',
  htb_h='HACK THE BOX', profile='Profile', level='Script Kiddie  ·  Level 26 (Apprentice)', machines='Machines', mv='15 / 552 rooted  ·  weekly streak: 3 weeks', rooted='Rooted',
  areas_h='FOCUS AREAS',
  areas=[('PENTESTING','Web, network, Active Directory, privilege escalation, Red Team.'),('NETWORKS','TCP/IP, DNS, HTTP/HTTPS, SMB, MQTT, routing.'),('LINUX','Administration, scripting, automation, custom tools.'),('PYTHON','Automation, scripting, security tools, data analysis.')],
  proj_h='PROJECTS', proj='Automated reconnaissance framework for penetration testing labs (Python).', env_h='ENVIRONMENT',
  foot='LEARN  >  BREAK  >  UNDERSTAND  >  BUILD  >  SECURE'),
}

def wrap(t, font, sz, maxw):
    lines, line = [], ''
    for w_ in t.split(' '):
        test = (line + ' ' + w_).strip()
        if stringWidth(test, font, sz) > maxw and line:
            lines.append(line); line = w_
        else:
            line = test
    if line: lines.append(line)
    return lines

def build(lang):
    T = TXT[lang]
    c = canvas.Canvas(str(OUT / T['file']), pagesize=letter)
    c.setTitle('Kevin Carballo Herrera (DarthBear) - CV'); c.setAuthor('Kevin Carballo Herrera'); c.setSubject(T['subject'])
    c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
    y = H - 18*mm

    def para(t, sz=9.5, color=TX, leading=13, indent=0):
        nonlocal y
        c.setFillColor(color); c.setFont('Courier', sz)
        for ln in wrap(t, 'Courier', sz, W - 2*M - indent):
            c.drawString(M+indent, y, ln); y -= leading

    def heading(t):
        nonlocal y
        c.setFillColor(RD); c.setFont('Courier-Bold', 12); c.drawString(M, y, t)
        y -= 5*mm; c.setStrokeColor(LN); c.setLineWidth(.7); c.line(M, y, W-M, y); y -= 6*mm

    def row(label, value, sz=9.5, gap=42*mm):
        nonlocal y
        c.setFillColor(DM); c.setFont('Courier-Bold', sz); c.drawString(M, y, label)
        lines = wrap(value, 'Courier', sz, W - 2*M - gap)
        c.setFillColor(TX); c.setFont('Courier', sz)
        c.drawString(M+gap, y, lines[0]); y -= 12.5
        for extra in lines[1:]:
            c.drawString(M+gap, y, extra); y -= 12.5

    c.setFillColor(TX); c.setFont('Courier-Bold', 25); c.drawString(M, y, 'KEVIN CARBALLO HERRERA')
    y -= 8*mm
    c.setFillColor(RD); c.setFont('Courier-Bold', 12); c.drawString(M, y, 'DARTHBEAR')
    c.setFillColor(DM); c.setFont('Courier', 10)
    c.drawString(M + stringWidth('DARTHBEAR','Courier-Bold',12) + 6, y, '// OFFENSIVE SECURITY · NETWORKS · LINUX · PYTHON')
    y -= 7*mm; c.setStrokeColor(RD); c.setLineWidth(1.2); c.line(M, y, W-M, y); y -= 7.5*mm
    for ln in ('Costa Rica  ·  kevincarballoherrera@gmail.com', 'github.com/xX-DarthBear-Xx  ·  linkedin.com/in/kevin-carballo-herrera-245428389', 'xx-darthbear-xx.github.io'):
        para(ln, sz=9, color=DM, leading=12)
    y -= 4*mm

    heading(T['about_h']); para(T['about']); y -= 3*mm
    heading(T['certs_h'])
    row(T['c1'], 'Hack4u.io'); row('', 'hack4u.io/certificate/1647-6136-1045-3499', sz=8.6); y -= 2
    row(T['c2'], 'Hack4u.io'); row('', 'hack4u.io/certificate/9980-1075-3789-9197', sz=8.6); y -= 2
    row(T['c3'], T['c3v']); y -= 4*mm
    heading(T['htb_h'])
    row(T['profile'], T['level']); row('', 'app.hackthebox.com/users/828180', sz=8.6)
    row(T['machines'], T['mv']); row(T['rooted'], 'Reactor, Cap, Enigma'); y -= 4*mm

    heading(T['areas_h'])
    colw = (W - 2*M - 10*mm) / 2; y0 = y; row_h = 20*mm
    for i,(h,d) in enumerate(T['areas']):
        cx = M + (i%2)*(colw+10*mm); cy = y0 - (i//2)*row_h
        c.setFillColor(RD); c.setFont('Courier-Bold', 10); c.drawString(cx, cy, h); cy -= 5*mm
        c.setFillColor(DM); c.setFont('Courier', 8.6)
        for ln in wrap(d, 'Courier', 8.6, colw):
            c.drawString(cx, cy, ln); cy -= 11
    y = y0 - 2*row_h + 2*mm; c.setStrokeColor(LN); c.line(M, y, W-M, y); y -= 6*mm

    heading(T['proj_h'])
    c.setFillColor(TX); c.setFont('Courier-Bold', 9.5); c.drawString(M, y, 'recon')
    c.setFillColor(DM); c.setFont('Courier', 8.6); c.drawString(M+22*mm, y, 'github.com/xX-DarthBear-Xx/recon'); y -= 12
    para(T['proj'], sz=8.8, color=DM, leading=12); y -= 4*mm
    heading(T['env_h']); para('Kali Linux  ·  zsh  ·  bspwm  ·  kitty', sz=9.3)
    y -= 3*mm; c.setStrokeColor(RD); c.setLineWidth(1); c.line(M, y, W-M, y); y -= 6*mm
    c.setFillColor(DM); c.setFont('Courier', 8.5); c.drawCentredString(W/2, y, T['foot'])
    print(T['file'], '· margen inferior restante (mm):', round(y/mm,1))
    if y < 12*mm: print('  ¡AVISO! el contenido roza el borde inferior')
    c.showPage(); c.save()

for l in TXT: build(l)
