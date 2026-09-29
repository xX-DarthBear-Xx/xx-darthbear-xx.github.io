/* i18n compartido por todas las páginas.
   HTML:  data-i18n="clave" (texto) · data-i18n-html="clave" (HTML) · data-i18n-attr="atributo:clave;otro:clave"
   JS:    DB.t('clave', ...args) · DB.get() · DB.set('es'|'en') · evento 'darthbear:lang' */
(()=>{
const D={
 nHome:{es:'inicio',en:'home'}, nAbout:{es:'sobre mí',en:'about'}, nLab:{es:'lab',en:'lab'},
 nWriteups:{es:'writeups',en:'writeups'}, nProjects:{es:'proyectos',en:'projects'}, nRoadmap:{es:'roadmap',en:'roadmap'},
 nTimeline:{es:'trayectoria',en:'timeline'}, nContact:{es:'contacto',en:'contact'},
 brandSub:{es:'SEGURIDAD OFENSIVA',en:'OFFENSIVE SECURITY'},
 quote:{es:'No quiero memorizar herramientas. Quiero entender qué pasa por debajo.',en:"I don't want to memorize tools. I want to understand what happens underneath."},
 hi:{es:'HOLA, SOY',en:"HEY, I'M"},
 tagCyber:{es:'CIBERSEGURIDAD',en:'CYBERSECURITY'}, tagNet:{es:'REDES',en:'NETWORKS'}, tagOff:{es:'SEGURIDAD OFENSIVA',en:'OFFENSIVE SECURITY'},
 tw:{es:['pentesting','linux','python ofensivo','redes','ctf en hack the box'],en:['pentesting','linux','offensive python','networking','ctf on hack the box']},
 motto:{es:'Rompe. Entiende. Protege.',en:'Break. Understand. Secure.'},
 btnProjects:{es:'VER MIS PROYECTOS',en:'VIEW MY PROJECTS'}, btnAbout:{es:'SOBRE MÍ',en:'ABOUT ME'},
 pilNet:{es:'REDES',en:'NETWORKS'},
 pentDesc:{es:'Web, redes, Active Directory, escalada de privilegios, Red Team.',en:'Web, Network, Active Directory, Privilege Escalation, Red Team.'},
 linuxDesc:{es:'Administración, scripting, automatización, herramientas propias.',en:'Administration, Scripting, Automation, Custom Tools.'},
 netDesc:{es:'TCP/IP, DNS, HTTP/HTTPS, SMB, MQTT, routing.',en:'TCP/IP, DNS, HTTP/HTTPS, SMB, MQTT, Routing.'},
 pyDesc:{es:'Automatización, scripting, herramientas de seguridad, análisis de datos.',en:'Automation, Scripting, Security Tools, Data Analysis.'},
 hWriteups:{es:'WRITEUPS DESTACADOS',en:'FEATURED WRITEUPS'}, hProjects:{es:'PROYECTOS RECIENTES',en:'LATEST PROJECTS'},
 hAbout:{es:'SOBRE MÍ',en:'ABOUT ME'}, hRoadmap:{es:'ROADMAP DE CONOCIMIENTO',en:'KNOWLEDGE ROADMAP'},
 hSetup:{es:'ENTORNO ACTUAL',en:'CURRENT SETUP'}, hTimeline:{es:'TRAYECTORIA',en:'TIMELINE'},
 comingTitle:{es:'Próximamente',en:'Coming soon'},
 soon:{es:'Aquí publicaré mis writeups de Hack The Box y laboratorios.',en:'My Hack The Box and lab writeups will go here.'},
 viewAllWriteups:{es:'Ver todos los writeups',en:'View all writeups'},
 reconDesc:{es:'Framework de reconocimiento automatizado para laboratorios de pentesting.',en:'Automated reconnaissance framework for penetration testing labs.'},
 viewAllProjects:{es:'Ver todos los proyectos',en:'View all projects'},
 level:{es:'Nivel 26 · Apprentice',en:'Level 26 · Apprentice'},
 machines:{es:'Máquinas',en:'Machines'}, streak:{es:'Racha semanal',en:'Weekly streak'}, weeks:{es:' semanas',en:' weeks'},
 recent:{es:'Máquinas recientes',en:'Recent machines'}, rooted:{es:'Completada',en:'Rooted'},
 completion:{es:'Completado por dificultad',en:'Completion by difficulty'},
 dEasy:{es:'Fácil',en:'Easy'}, dMedium:{es:'Media',en:'Medium'}, dHard:{es:'Difícil',en:'Hard'}, dInsane:{es:'Insana',en:'Insane'},
 viewProfile:{es:'Ver perfil de HTB',en:'View HTB profile'},
 aboutP:{es:'Soy un apasionado por la ciberseguridad, con enfoque en seguridad ofensiva, redes y Linux. Actualmente me encuentro en proceso de certificación eJPT y desarrollando proyectos propios para seguir creciendo profesionalmente.',
  en:"I'm passionate about cybersecurity, focused on offensive security, networking and Linux. I'm currently preparing the eJPT certification and building my own projects to keep growing professionally."},
 certPy:{es:'Python Ofensivo (Hack4u.io)',en:'Offensive Python (Hack4u.io)'}, certHack:{es:'Introducción al Hacking (Hack4u.io)',en:'Introduction to Hacking (Hack4u.io)'},
 certPyT:{es:'Python Ofensivo',en:'Offensive Python'}, certHackT:{es:'Introducción al Hacking',en:'Introduction to Hacking'},
 ejpt:{es:'eJPT (en preparación)',en:'eJPT (in progress)'},
 cvLink:{es:'Descargar CV (PDF)',en:'Download CV (PDF)'}, cvHref:{es:'assets/cv.pdf',en:'assets/cv-en.pdf'},
 certWeb:{es:'Hacking Web (Hack4u.io)',en:'Web Hacking (Hack4u.io)'}, certWebT:{es:'Hacking Web',en:'Web Hacking'},
 nExperience:{es:'experiencia',en:'experience'}, hExp:{es:'EXPERIENCIA',en:'EXPERIENCE'},
 jobTitle:{es:'Penetration Tester / Auditor de Ciberseguridad',en:'Penetration Tester / Cybersecurity Auditor'},
 jobDates:{es:'2021 – 2025',en:'2021 – 2025'},
 exp1:{es:'Ejecución de pruebas de penetración y evaluaciones de seguridad sobre aplicaciones, servicios e infraestructura.',en:'Performed penetration tests and security assessments on applications, services and infrastructure.'},
 exp2:{es:'Identificación y análisis de vulnerabilidades, evaluando su impacto y posibles vectores de explotación.',en:'Identified and analyzed vulnerabilities, assessing their impact and potential exploitation vectors.'},
 exp3:{es:'Realización de reconocimiento y enumeración de activos, servicios, tecnologías y superficies de ataque.',en:'Carried out reconnaissance and enumeration of assets, services, technologies and attack surfaces.'},
 exp4:{es:'Evaluación de seguridad de aplicaciones web, incluyendo vulnerabilidades como SQL Injection, XSS, Path Traversal y problemas de control de acceso.',en:'Assessed web application security, including vulnerabilities such as SQL Injection, XSS, Path Traversal and access control issues.'},
 exp5:{es:'Utilización de herramientas como Nmap, Burp Suite, Gobuster, Dirbuster, Wfuzz, Metasploit, SQLmap, Hydra, John the Ripper y Hashcat.',en:'Used tools such as Nmap, Burp Suite, Gobuster, Dirbuster, Wfuzz, Metasploit, SQLmap, Hydra, John the Ripper and Hashcat.'},
 exp6:{es:'Análisis de servicios y protocolos como HTTP/HTTPS, SSH, SMB, FTP y Kerberos.',en:'Analyzed services and protocols such as HTTP/HTTPS, SSH, SMB, FTP and Kerberos.'},
 exp7:{es:'Desarrollo de scripts y herramientas en Python para automatizar tareas de reconocimiento, análisis y pruebas de seguridad.',en:'Developed scripts and tools in Python to automate reconnaissance, analysis and security-testing tasks.'},
 exp8:{es:'Documentación de vulnerabilidades, evidencia técnica y recomendaciones de remediación.',en:'Documented vulnerabilities, technical evidence and remediation recommendations.'},
 exp9:{es:'Aplicación de metodologías y buenas prácticas de penetration testing y seguridad ofensiva.',en:'Applied penetration testing methodologies and offensive-security best practices.'},
 rmNetT:{es:'Redes',en:'Networking'}, rmWebT:{es:'Seguridad web',en:'Web Security'},
 rmPrivT:{es:'Escalada de privilegios',en:'Privilege Escalation'}, rmOffT:{es:'Seguridad ofensiva',en:'Offensive Security'},
 rmLinuxS:{es:'Administración, scripting, Bash',en:'Administration, Scripting, Bash'},
 rmOffS:{es:'Red Team, explotación, eJPT',en:'Red Team, Exploitation, eJPT'},
 rmNet:{es:'Modelo OSI, direccionamiento IP y subnetting, ARP, DHCP, puertos y servicios, análisis de tráfico con Wireshark.',en:'OSI model, IP addressing and subnetting, ARP, DHCP, ports and services, traffic analysis with Wireshark.'},
 rmLinux:{es:'Permisos, procesos, servicios, redes en Linux, cron y bash scripting.',en:'Permissions, processes, services, Linux networking, cron and bash scripting.'},
 rmWeb:{es:'Enumeración web, OWASP Top 10, inyecciones, autenticación, subida de archivos y Burp Suite.',en:'Web enumeration, OWASP Top 10, injections, authentication, file upload flaws and Burp Suite.'},
 rmPriv:{es:'SUID, sudo, tareas cron, servicios mal configurados, kernel y escalada en Windows y AD.',en:'SUID, sudo, cron jobs, misconfigured services, kernel exploits and Windows/AD escalation.'},
 rmOff:{es:'Metodología de pentesting, explotación, post-explotación, reportes y preparación del eJPT.',en:'Pentesting methodology, exploitation, post-exploitation, reporting and eJPT preparation.'},
 fine:{es:'Mis herramientas. Mi entorno. Mi campo de juego.',en:'My tools. My environment. My playground.'},
 tl1:{es:'Se une a Hack The Box',en:'Joins Hack The Box'}, tlEC:{es:'Enigma y Cap',en:'Enigma & Cap'},
 tl2:{es:'Completadas en HTB',en:'Rooted on HTB'}, tl3:{es:'Completada en HTB',en:'Rooted on HTB'},
 tlCert:{es:'Certificado Hack4u.io',en:'Hack4u.io certificate'},
 tlNow:{es:'AHORA',en:'NOW'}, tlNext:{es:'PRÓXIMO',en:'NEXT'},
 tl4:{es:'Preparando el eJPT',en:'Preparing the eJPT'}, tl5:{es:'Primeros writeups',en:'First writeups'},
 foot:{es:'APRENDE\u00a0›\u00a0ROMPE\u00a0›\u00a0ENTIENDE\u00a0›\u00a0CONSTRUYE\u00a0›\u00a0PROTEGE',en:'LEARN\u00a0›\u00a0BREAK\u00a0›\u00a0UNDERSTAND\u00a0›\u00a0BUILD\u00a0›\u00a0SECURE'},
 ariaMain:{es:'Principal',en:'Main'}, ariaSide:{es:'Secundario',en:'Secondary'}, ariaTerm:{es:'Abrir terminal',en:'Open terminal'},
 ariaCmd:{es:'Comando',en:'Command'}, ariaPhoto:{es:'Retrato de DarthBear',en:'Portrait of DarthBear'},
 ariaLang:{es:'Cambiar a inglés',en:'Switch to Spanish'}, ariaSearch:{es:'Buscar writeups',en:'Search writeups'},
 termHint:{es:'Escribe <b>help</b> para ver los comandos.',en:'Type <b>help</b> to see the commands.'},
 help:{es:'ls [dir]  cd <dir>  cat <archivo>  tree  pwd  open <archivo>\nhtb  certs  whoami  neofetch  clear  exit\nabout  lab  writeups  projects  experience  roadmap  timeline  contact  (ir a la sección)',
  en:'ls [dir]  cd <dir>  cat <file>  tree  pwd  open <file>\nhtb  certs  whoami  neofetch  clear  exit\nabout  lab  writeups  projects  experience  roadmap  timeline  contact  (jump to section)'},
 opening:{es:s=>'abriendo '+s+'...',en:s=>'opening '+s+'...'},
 lsNo:{es:s=>'ls: no existe: '+s,en:s=>'ls: no such file or directory: '+s}, cdNo:{es:s=>'cd: no existe: '+s,en:s=>'cd: no such directory: '+s},
 catNo:{es:s=>'cat: '+s+': no existe',en:s=>'cat: '+s+': no such file'}, catDir:{es:s=>'cat: '+s+': es un directorio',en:s=>'cat: '+s+': is a directory'},
 openNo:{es:s=>'open: sin enlace para '+s,en:s=>'open: no link for '+s},
 cmdNo:{es:s=>s+': comando no encontrado. Prueba help',en:s=>s+': command not found. Try help'},
 empty:{es:'(vacío)',en:'(empty)'},
 sudoSu:{es:'darthbear no está en el archivo sudoers. Este incidente será reportado.',en:'darthbear is not in the sudoers file. This incident will be reported.'},
 rmrf:{es:'Buen intento. Este portafolio sigue en pie.',en:'Nice try. This portfolio is still standing.'},
 fAbout:{es:'DarthBear · ciberseguridad, redes y Linux.\nEnfoque: seguridad ofensiva. Preparando el eJPT.\nBasado en Costa Rica.',en:'DarthBear · cybersecurity, networks and Linux.\nFocus: offensive security. Preparing the eJPT.\nBased in Costa Rica.'},
 fCerts:{es:'Python Ofensivo (Hack4u.io)\nIntroducción al Hacking (Hack4u.io)\nHacking Web (Hack4u.io)\neJPT: en preparación',en:'Offensive Python (Hack4u.io)\nIntroduction to Hacking (Hack4u.io)\neJPT: in progress'},
 fHtb:{es:'Script Kiddie · Nivel 26 · Apprentice\nMáquinas: 15/552 · Racha: 3 semanas\nCompletadas: Reactor, Cap, Enigma',en:'Script Kiddie · Level 26 · Apprentice\nMachines: 15/552 · Streak: 3 weeks\nRooted: Reactor, Cap, Enigma'},
 fRecon:{es:'recon · framework de reconocimiento automatizado para laboratorios de pentesting.',en:'recon · automated reconnaissance framework for pentesting labs.'},
 fTimeline:{es:'2021 Nov    Se une a Hack The Box\n2021 – 25   Penetration Tester en VirtualProtection\n2026 Sep    Enigma y Cap (HTB)\n2026 Sep 15 Certificado: Python Ofensivo\n2026 Sep    Reactor (HTB)\n2026 Sep 23 Certificado: Introducción al Hacking\n2026 Sep 29 Certificado: Hacking Web\nAhora       Preparando el eJPT\nPróximo     Primeros writeups',
  en:'2021 Nov    Joins Hack The Box\n2021 – 25   Penetration Tester at VirtualProtection\n2026 Sep    Enigma & Cap (HTB)\n2026 Sep 15 Certificate: Offensive Python\n2026 Sep    Reactor (HTB)\n2026 Sep 23 Certificate: Introduction to Hacking\n2026 Sep 29 Certificate: Web Hacking\nNow         Preparing the eJPT\nNext        First writeups'},
 ghUpdated:{es:'actualizado ',en:'updated '}, ghLocale:{es:'es-CR',en:'en-US'},
 wSearch:{es:'Buscar...',en:'Search...'}, noResults:{es:'Sin resultados',en:'No results'}, noResultsBody:{es:'Prueba con otra búsqueda o tag.',en:'Try another search or tag.'},
 notFound:{es:'No encontrado',en:'Not found'}, wMissing:{es:'Falta el writeup.',en:'Missing writeup.'}, wGone:{es:'Ese writeup no existe.',en:"That writeup doesn't exist."},
 e404:{es:'bash: esta página: comando no encontrado',en:'bash: this page: command not found'},
 backHome:{es:'← Volver al inicio',en:'← Back to home'}
};
let lang=(()=>{try{const s=localStorage.getItem('lang');if(s==='es'||s==='en')return s}catch(e){}return /^en/i.test(navigator.language||'')?'en':'es'})();
const t=(k,...a)=>{const d=D[k];if(!d)return k;const v=d[lang]!==undefined?d[lang]:d.es;return typeof v==='function'?v(...a):v};
const apply=()=>{
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
 document.querySelectorAll('[data-i18n-html]').forEach(el=>{el.innerHTML=t(el.dataset.i18nHtml)});
 document.querySelectorAll('[data-i18n-attr]').forEach(el=>el.dataset.i18nAttr.split(';').forEach(p=>{const[a,k]=p.split(':');if(a&&k)el.setAttribute(a.trim(),t(k.trim()))}));
 const lb=document.getElementById('lang');if(lb)lb.textContent=lang==='es'?'EN':'ES';
 document.dispatchEvent(new CustomEvent('darthbear:lang',{detail:lang}));
};
const set=l=>{lang=l==='en'?'en':'es';try{localStorage.setItem('lang',lang)}catch(e){}apply()};
window.DB={t,get:()=>lang,set,apply,D};
apply();
})();
