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
W,H = letter; M = 20*mm; BOTTOM = 16*mm

EXP_ES = [
 'Ejecución de pruebas de penetración y evaluaciones de seguridad sobre aplicaciones, servicios e infraestructura.',
 'Identificación y análisis de vulnerabilidades, evaluando su impacto y posibles vectores de explotación.',
 'Reconocimiento y enumeración de activos, servicios, tecnologías y superficies de ataque.',
 'Evaluación de seguridad web: SQL Injection, XSS, Path Traversal y problemas de control de acceso.',
 'Uso de Nmap, Burp Suite, Gobuster, Dirbuster, Wfuzz, Metasploit, SQLmap, Hydra, John the Ripper y Hashcat.',
 'Análisis de servicios y protocolos: HTTP/HTTPS, SSH, SMB, FTP y Kerberos.',
 'Desarrollo de scripts en Python para automatizar reconocimiento, análisis y pruebas de seguridad.',
 'Documentación de vulnerabilidades, evidencia técnica y recomendaciones de remediación.',
 'Aplicación de metodologías y buenas prácticas de penetration testing y seguridad ofensiva.',
]
EXP_EN = [
 'Performed penetration tests and security assessments on applications, services and infrastructure.',
 'Identified and analyzed vulnerabilities, assessing their impact and potential exploitation vectors.',
 'Reconnaissance and enumeration of assets, services, technologies and attack surfaces.',
 'Web security assessment: SQL Injection, XSS, Path Traversal and access control issues.',
 'Used Nmap, Burp Suite, Gobuster, Dirbuster, Wfuzz, Metasploit, SQLmap, Hydra, John the Ripper and Hashcat.',
 'Analyzed services and protocols: HTTP/HTTPS, SSH, SMB, FTP and Kerberos.',
 'Developed Python scripts to automate reconnaissance, analysis and security testing.',
 'Documented vulnerabilities, technical evidence and remediation recommendations.',
 'Applied penetration testing methodologies and offensive security best practices.',
]
SKILLS = ['Penetration Testing','Vulnerability Assessment','Web App Security','Ethical Hacking','Network Security',
 'Burp Suite','Nmap','Metasploit','Python','OWASP','Linux','Active Directory']

TXT = {
 'es': dict(file='cv.pdf', subject='Curriculum Vitae - Seguridad Ofensiva',
  about_h='SOBRE MÍ', about='Apasionado por la ciberseguridad, con enfoque en seguridad ofensiva, redes y Linux. Actualmente en preparación de la certificación eJPT y desarrollando proyectos propios (automatización de reconocimiento, herramientas en Python) para seguir creciendo profesionalmente.',
  exp_h='EXPERIENCIA', job='Penetration Tester / Auditor de Ciberseguridad', company='VirtualProtection', dates='2021 – 2025', exp=EXP_ES,
  certs_h='CERTIFICACIONES', c1='Python Ofensivo', c2='Intro. Hacking', c3='Hacking Web', c4='eJPT', c4v='En preparación',
  htb_h='HACK THE BOX', profile='Perfil', level='Script Kiddie  ·  Nivel 26 (Apprentice)', machines='Máquinas', mv='15 / 552 resueltas  ·  racha semanal: 3 semanas', rooted='Completadas',
  areas_h='ÁREAS DE TRABAJO',
  areas=[('PENTESTING','Web, redes, Active Directory, escalada de privilegios, Red Team.'),('REDES','TCP/IP, DNS, HTTP/HTTPS, SMB, MQTT, routing.'),('LINUX','Administración, scripting, automatización, herramientas propias.'),('PYTHON','Automatización, scripting, herramientas de seguridad, análisis de datos.')],
  proj_h='PROYECTOS', proj='Framework de reconocimiento automatizado para laboratorios de pentesting (Python).', env_h='ENTORNO',
  foot='APRENDE  >  ROMPE  >  ENTIENDE  >  CONSTRUYE  >  PROTEGE'),
 'en': dict(file='cv-en.pdf', subject='Curriculum Vitae - Offensive Security',
  about_h='ABOUT ME', about='Passionate about cybersecurity, focused on offensive security, networking and Linux. Currently preparing the eJPT certification and building my own projects (reconnaissance automation, Python tooling) to keep growing professionally.',
  exp_h='EXPERIENCE', job='Penetration Tester / Cybersecurity Auditor', company='VirtualProtection', dates='2021 – 2025', exp=EXP_EN,
  certs_h='CERTIFICATIONS', c1='Offensive Python', c2='Intro. Hacking', c3='Web Hacking', c4='eJPT', c4v='In progress',
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
    page = [0]
    def new_page():
        c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0); page[0]+=1
    y = [0]
    new_page(); y[0] = H - 18*mm

    def ensure(space):
        if y[0]-space < BOTTOM:
            c.showPage(); new_page(); y[0] = H - 18*mm

    def para(t, sz=9.5, color=TX, leading=13, indent=0):
        ensure(leading)
        c.setFillColor(color); c.setFont('Courier', sz)
        for ln in wrap(t, 'Courier', sz, W - 2*M - indent):
            ensure(leading); c.drawString(M+indent, y[0], ln); y[0] -= leading

    def heading(t):
        ensure(11*mm + 6)
        c.setFillColor(RD); c.setFont('Courier-Bold', 12); c.drawString(M, y[0], t)
        y[0] -= 4.5*mm; c.setStrokeColor(LN); c.setLineWidth(.7); c.line(M, y[0], W-M, y[0]); y[0] -= 4.5*mm

    def row(label, value, sz=9.5, gap=42*mm, lh=11.5):
        ensure(lh)
        c.setFillColor(DM); c.setFont('Courier-Bold', sz); c.drawString(M, y[0], label)
        lines = wrap(value, 'Courier', sz, W - 2*M - gap)
        c.setFillColor(TX); c.setFont('Courier', sz)
        c.drawString(M+gap, y[0], lines[0]); y[0] -= lh
        for extra in lines[1:]:
            ensure(lh); c.drawString(M+gap, y[0], extra); y[0] -= lh

    # Header (solo en la primera página)
    c.setFillColor(TX); c.setFont('Courier-Bold', 25); c.drawString(M, y[0], 'KEVIN CARBALLO HERRERA')
    y[0] -= 8*mm
    c.setFillColor(RD); c.setFont('Courier-Bold', 12); c.drawString(M, y[0], 'DARTHBEAR')
    c.setFillColor(DM); c.setFont('Courier', 10)
    c.drawString(M + stringWidth('DARTHBEAR','Courier-Bold',12) + 6, y[0], '// OFFENSIVE SECURITY · NETWORKS · LINUX · PYTHON')
    y[0] -= 7*mm; c.setStrokeColor(RD); c.setLineWidth(1.2); c.line(M, y[0], W-M, y[0]); y[0] -= 7.5*mm
    for ln in ('Costa Rica  ·  kevincarballoherrera@gmail.com', 'github.com/xX-DarthBear-Xx  ·  linkedin.com/in/kevin-carballo-herrera-245428389', 'xx-darthbear-xx.github.io'):
        para(ln, sz=9, color=DM, leading=12)
    y[0] -= 4*mm

    heading(T['about_h']); para(T['about']); y[0] -= 3*mm

    heading(T['exp_h'])
    ensure(11)
    c.setFillColor(TX); c.setFont('Courier-Bold', 10.5); c.drawString(M, y[0], T['job'])
    c.setFillColor(RD); c.setFont('Courier-Bold', 9); c.drawString(M, y[0]-11, T['company'])
    c.setFillColor(DM); c.setFont('Courier', 9); c.drawRightString(W-M, y[0], T['dates'])
    y[0] -= 11 + 10
    for b in T['exp']:
        for i,ln in enumerate(wrap(b,'Courier',9,W-2*M-14)):
            ensure(10.8)
            c.setFillColor(RD if i==0 else DM); c.setFont('Courier', 9)
            if i==0: c.drawString(M, y[0], '›')
            c.setFillColor(TX); c.drawString(M+14, y[0], ln); y[0] -= 10.8
    y[0] -= 2*mm

    heading(T['certs_h'])
    row(T['c1'], 'Hack4u.io', lh=11.5); row('', 'hack4u.io/certificate/1647-6136-1045-3499', sz=8.4, lh=10.5)
    row(T['c2'], 'Hack4u.io', lh=11.5); row('', 'hack4u.io/certificate/9980-1075-3789-9197', sz=8.4, lh=10.5)
    row(T['c3'], 'Hack4u.io', lh=11.5); row('', 'hack4u.io/certificate/0853-7112-1765-0028', sz=8.4, lh=10.5)
    row(T['c4'], T['c4v'], lh=11.5); y[0] -= 3*mm

    heading(T['htb_h'])
    row(T['profile'], T['level'], lh=11.5); row('', 'app.hackthebox.com/users/828180', sz=8.4, lh=10.5)
    row(T['machines'], T['mv'], lh=11.5); row(T['rooted'], 'Reactor, Cap, Enigma', lh=11.5); y[0] -= 3*mm

    ensure(13.1*mm + 2*18*mm)  # título + las dos filas de la cuadrícula, o todo salta de página junto
    heading(T['areas_h'])
    colw = (W - 2*M - 10*mm) / 2; y0 = y[0]; row_h = 18*mm
    for i,(h,d) in enumerate(T['areas']):
        cx = M + (i%2)*(colw+10*mm); cy = y0 - (i//2)*row_h
        c.setFillColor(RD); c.setFont('Courier-Bold', 10); c.drawString(cx, cy, h); cy -= 5*mm
        c.setFillColor(DM); c.setFont('Courier', 8.6)
        for ln in wrap(d, 'Courier', 8.6, colw):
            c.drawString(cx, cy, ln); cy -= 11
    y[0] = y0 - 2*row_h + 2*mm; c.setStrokeColor(LN); c.line(M, y[0], W-M, y[0]); y[0] -= 6*mm

    heading(T['proj_h'])
    ensure(12)
    c.setFillColor(TX); c.setFont('Courier-Bold', 9.5); c.drawString(M, y[0], 'recon')
    c.setFillColor(DM); c.setFont('Courier', 8.6); c.drawString(M+22*mm, y[0], 'github.com/xX-DarthBear-Xx/recon'); y[0] -= 12
    para(T['proj'], sz=8.8, color=DM, leading=11); y[0] -= 3*mm

    heading(T['env_h'])
    para('Kali Linux  ·  zsh  ·  bspwm  ·  kitty', sz=9.3)
    para('  ·  '.join(SKILLS), sz=8.4, color=DM, leading=11)

    y[0] -= 3*mm; ensure(6*mm+8)
    c.setStrokeColor(RD); c.setLineWidth(1); c.line(M, y[0], W-M, y[0]); y[0] -= 6*mm
    c.setFillColor(DM); c.setFont('Courier', 8.5); c.drawCentredString(W/2, y[0], T['foot'])
    print(T['file'], '·', page[0], 'página(s) · margen inferior restante (mm):', round(y[0]/mm,1))
    c.showPage(); c.save()

for l in TXT: build(l)
