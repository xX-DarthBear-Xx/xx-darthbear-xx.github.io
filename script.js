const $=id=>document.getElementById(id),term=$('term'),out=$('out'),input=$('cmd'),ps=$('ps');
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:k=>{try{sessionStorage.setItem(k,1)}catch(e){}}};
const go=id=>$(id).scrollIntoView({behavior:rm?'auto':'smooth'});
const say=t=>{out.append('\n'+t);out.scrollTop=out.scrollHeight};
const toggle=()=>{term.hidden=!term.hidden;if(!term.hidden)input.focus()};
$('open').onclick=toggle;
$('help').onclick=e=>{e.preventDefault();toggle()};
// sistema de archivos virtual
const REPO='https://github.com/xX-DarthBear-Xx/recon',HTB='https://app.hackthebox.com/users/828180';
const HTBTXT='Script Kiddie · Level 26 · Apprentice\nMachines: 15/552 · Streak: 3 weeks\nRooted: Reactor, Cap, Enigma';
const TL='2021 Nov    Se une a Hack The Box\n2026 Sep    Enigma y Cap (HTB)\n2026 Sep 15 Certificado: Python Ofensivo\n2026 Sep    Reactor (HTB)\n2026 Sep 23 Certificado: Introducción al Hacking\nAhora       Preparando el eJPT\nPróximo     Primeros writeups';
const fs={'about.txt':'DarthBear · cybersecurity, networks and Linux.\nFocus: offensive security. Preparing eJPT.\nBased in Costa Rica.',
 'certs.txt':'Python Ofensivo (Hack4u.io)\nIntroducción al Hacking (Hack4u.io)\neJPT: en preparación',
 'htb.txt':HTBTXT+'\n(open htb.txt)',
 'contact.txt':'GitHub:   github.com/xX-DarthBear-Xx\nLinkedIn: linkedin.com/in/kevin-carballo-herrera-245428389\nEmail:    kevincarballoherrera@gmail.com',
 projects:{'recon.txt':'recon · automated reconnaissance framework for pentesting labs.\n'+REPO+'\n(open recon.txt)'},
 writeups:{},
 'timeline.txt':TL};
const links={'htb.txt':HTB,'projects/recon.txt':REPO};
let cwd=[];
fetch('content/writeups/index.json').then(r=>r.ok?r.json():[]).catch(()=>[]).then(a=>a.forEach(w=>{const f=w.slug+'.md';
 fs.writeups[f]=[w.title,[w.date,w.os,w.difficulty].filter(Boolean).join(' · '),w.summary||'','(open '+f+')'].join('\n');
 links['writeups/'+f]='writeup.html?w='+encodeURIComponent(w.slug)}));
const parts=p=>{const r=/^[~/]/.test(p)?[]:cwd.slice();p.replace(/^~/,'').split('/').forEach(s=>{if(s==='..')r.pop();else if(s&&s!=='.')r.push(s)});return r};
const at=r=>r.reduce((n,k)=>n&&typeof n==='object'&&k in n?n[k]:undefined,fs);
const isDir=n=>n!==null&&typeof n==='object';
const setPs=()=>ps.textContent='darthbear@portfolio:'+(cwd.length?'~/'+cwd.join('/'):'~')+'$';
const list=n=>Object.keys(n).sort().map(k=>isDir(n[k])?k+'/':k).join('  ')||'(vacío)';
const tree=(n,p='')=>Object.keys(n).sort().map((k,i,a)=>{const l=i===a.length-1,sub=isDir(n[k])?tree(n[k],p+(l?'    ':'│   ')):'';return p+(l?'└── ':'├── ')+k+(isDir(n[k])?'/':'')+(sub?'\n'+sub:'')}).join('\n');
const C={
 help:()=>'ls [dir]  cd <dir>  cat <file>  tree  pwd  open <file>\nhtb  certs  whoami  neofetch  clear  exit\nabout  lab  writeups  projects  roadmap  timeline  contact  (ir a la sección)',
 ls:a=>{const n=a[0]?at(parts(a[0])):at(cwd);return isDir(n)?list(n):typeof n==='string'?a[0]:'ls: no existe: '+a[0]},
 cd:a=>{const r=a[0]?parts(a[0]):[];if(!isDir(at(r)))return 'cd: no existe: '+(a[0]||'');cwd=r;setPs();return ''},
 pwd:()=>'/home/darthbear'+(cwd.length?'/'+cwd.join('/'):''),
 cat:a=>{const n=a[0]?at(parts(a[0])):undefined;return typeof n==='string'?n:isDir(n)?'cat: '+a[0]+': es un directorio':'cat: '+(a[0]||'')+': no existe'},
 tree:()=>'~\n'+tree(fs),
 open:a=>{const u=a[0]&&links[parts(a[0]).join('/')];if(!u)return 'open: sin enlace para '+(a[0]||'');if(/^https?:/.test(u))window.open(u,'_blank','noopener');else location.href=u;return 'abriendo '+u},
 whoami:()=>(go('about'),'darthbear'),
 htb:()=>(go('lab'),HTBTXT),
 certs:()=>(go('about'),fs['certs.txt']),
 neofetch:()=>'darthbear@kali\nOS: Kali GNU/Linux Rolling\nWM: bspwm\nShell: zsh\nTerminal: kitty\nTheme: Kali-Dark',
 clear:()=>{out.textContent='';return ''},
 exit:()=>{term.hidden=true;return ''}
};
['about','lab','writeups','projects','roadmap','timeline','contact'].forEach(s=>C[s]=()=>(go(s),'abriendo '+s+'...'));
const E={'sudo su':()=>'darthbear is not in the sudoers file. This incident will be reported.','sudo rm -rf /':()=>'Nice try. Este portafolio sigue en pie.','cat /etc/motd':()=>'Break. Understand. Secure.'};
const run=c=>{if(E[c])return E[c]();const[n,...a]=c.split(/\s+/);return C[n]?C[n](a):c+': comando no encontrado. Prueba help'};
const hist=[];let hi=0;
input.addEventListener('keydown',e=>{
 if(e.key==='Escape')term.hidden=true;
 if(e.key==='ArrowUp'&&hist.length){e.preventDefault();hi=Math.max(0,hi-1);input.value=hist[hi]}
 if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(hist.length,hi+1);input.value=hist[hi]||''}
 if(e.key==='Tab'){e.preventDefault();const v=input.value,sp=v.lastIndexOf(' ');
  if(sp<0){const m=Object.keys(C).filter(k=>v&&k.startsWith(v));if(m.length===1)input.value=m[0]+' ';else if(m.length)say(m.join('  '))}
  else{const tok=v.slice(sp+1),sl=tok.lastIndexOf('/'),dir=tok.slice(0,sl+1),pre=tok.slice(sl+1),n=at(parts(dir||'.'));
   if(isDir(n)){const m=Object.keys(n).filter(k=>k.startsWith(pre));if(m.length===1)input.value=v.slice(0,sp+1)+dir+m[0]+(isDir(n[m[0]])?'/':'');else if(m.length)say(m.join('  '))}}}
 if(e.key!=='Enter')return;
 const c=input.value.trim();input.value='';if(!c)return;
 hist.push(c);hi=hist.length;say(ps.textContent+' '+c);
 const r=run(c);if(r)say(r);
});
// idioma (ES/EN)
const I18N={
 tw:{es:['pentesting','linux','python ofensivo','redes','ctf en hack the box'],en:['pentesting','linux','offensive python','networking','ctf on hack the box']},
 aboutP:{es:'Soy un apasionado por la ciberseguridad, con enfoque en seguridad ofensiva, redes y Linux. Actualmente me encuentro en proceso de certificación eJPT y desarrollando proyectos propios para seguir creciendo profesionalmente.',
  en:'I\'m passionate about cybersecurity, focused on offensive security, networking and Linux. I\'m currently preparing the eJPT certification and building my own projects to keep growing professionally.'},
 ejpt:{es:'eJPT (en preparación)',en:'eJPT (in progress)'},
 cvLink:{es:'Descargar CV (PDF)',en:'Download CV (PDF)'},
 reconDesc:{es:'Framework de reconocimiento automatizado para laboratorios de pentesting.',en:'Automated reconnaissance framework for penetration testing labs.'},
 rmNet:{es:'Modelo OSI, direccionamiento IP y subnetting, ARP, DHCP, puertos y servicios, análisis de tráfico con Wireshark.',en:'OSI model, IP addressing and subnetting, ARP, DHCP, ports and services, traffic analysis with Wireshark.'},
 rmLinux:{es:'Permisos, procesos, servicios, redes en Linux, cron y bash scripting.',en:'Permissions, processes, services, Linux networking, cron and bash scripting.'},
 rmWeb:{es:'Enumeración web, OWASP Top 10, inyecciones, autenticación, subida de archivos y Burp Suite.',en:'Web enumeration, OWASP Top 10, injections, authentication, file upload flaws and Burp Suite.'},
 rmPriv:{es:'SUID, sudo, tareas cron, servicios mal configurados, kernel y escalada en Windows y AD.',en:'SUID, sudo, cron jobs, misconfigured services, kernel exploits and Windows/AD escalation.'},
 rmOff:{es:'Metodología de pentesting, explotación, post-explotación, reportes y preparación del eJPT.',en:'Pentesting methodology, exploitation, post-exploitation, reporting and eJPT preparation.'},
 tl1:{es:'Se une a Hack The Box',en:'Joins Hack The Box'},
 tl2:{es:'Resueltas en HTB',en:'Rooted on HTB'},
 tl3:{es:'Resuelta en HTB',en:'Rooted on HTB'},
 tl4:{es:'Preparando el eJPT',en:'Preparing the eJPT'},
 tl5:{es:'Primeros writeups',en:'First writeups'},
 soon:{es:'Aquí publicaré mis writeups de Hack The Box y laboratorios.',en:'My Hack The Box and lab writeups will go here.'}
};
const setLangStore=l=>{try{localStorage.setItem('lang',l)}catch(e){}};
const applyLang=l=>{
 document.documentElement.lang=l;
 document.querySelectorAll('[data-i18n]').forEach(el=>{const d=I18N[el.dataset.i18n];if(d)el.textContent=d[l]||d.es});
 const lb=$('lang');if(lb)lb.textContent=l==='es'?'EN':'ES';
 document.dispatchEvent(new CustomEvent('darthbear:lang',{detail:l}));
};
let lang=(()=>{try{const s=localStorage.getItem('lang');if(s)return s}catch(e){}return (navigator.language||'').toLowerCase().startsWith('en')?'en':'es'})();
applyLang(lang);
const langBtn=$('lang');
if(langBtn)langBtn.onclick=()=>{lang=lang==='es'?'en':'es';setLangStore(lang);applyLang(lang)};

// resaltar la sección activa del menú al hacer scroll
const navLinks=[...document.querySelectorAll('.top nav a, .side nav a')].filter(a=>a.hash);
if(navLinks.length){
 const setActive=id=>navLinks.forEach(a=>a.classList.toggle('on',a.hash==='#'+id));
 const secObs=new IntersectionObserver(es=>{
  const vis=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(vis)setActive(vis.target.id);
 },{rootMargin:'-40% 0px -50% 0px',threshold:[0,.25,.5,.75,1]});
 navLinks.forEach(a=>{const el=document.getElementById(a.hash.slice(1));if(el)secObs.observe(el)});
}

// stats en vivo del repo recon (GitHub API pública); si falla, se deja el texto estático
const ghs=$('ghstats');
if(ghs)fetch('https://api.github.com/repos/xX-DarthBear-Xx/recon').then(r=>r.ok?r.json():null).then(d=>{
 if(!d)return;
 const upd=new Date(d.pushed_at).toLocaleDateString(document.documentElement.lang==='en'?'en-US':'es-CR',{year:'numeric',month:'short',day:'numeric'});
 ghs.textContent='★ '+d.stargazers_count+' · '+(document.documentElement.lang==='en'?'updated ':'actualizado ')+upd;
}).catch(()=>{});

// boot (una vez por visita)
if(!rm&&!store.get('booted')){
 const b=document.createElement('div');b.className='boot';b.innerHTML='<pre></pre><button>skip ›</button>';document.body.append(b);
 const pre=b.firstChild,L=['[ INITIALIZING SECURITY PROFILE... ]','> NETWORK ............ OK','> LINUX .............. OK','> WEB SECURITY ....... OK','> OFFENSIVE SECURITY . LOADING'];
 let i=0,t;const end=()=>{clearInterval(t);store.set('booted');b.classList.add('off');setTimeout(()=>b.remove(),500)};
 t=setInterval(()=>i<L.length?pre.textContent+=L[i++]+'\n':end(),280);b.onclick=end;
}
// texto que se escribe
const tw=$('tw');
if(tw&&!rm){let w=0,c=0,del=false,gen=0;
 const tick=(myGen)=>{if(myGen!==gen)return;const W=I18N.tw[lang]||I18N.tw.es,s=W[w%W.length];tw.textContent=s.slice(0,c);
  if(!del){if(c<s.length){c++;return setTimeout(()=>tick(myGen),80)}del=true;return setTimeout(()=>tick(myGen),1400)}
  if(c>0){c--;return setTimeout(()=>tick(myGen),40)}del=false;w++;setTimeout(()=>tick(myGen),300)};
 tick(gen);
 document.addEventListener('darthbear:lang',()=>{gen++;w=0;c=0;del=false;tick(gen)});
}
// números y barras al hacer scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);
 if(el.dataset.n){const n=+el.dataset.n;let v=0;const s=setInterval(()=>{el.textContent=++v;if(v>=n)clearInterval(s)},60)}else el.style.width=el.dataset.w}),{threshold:.4});
if(!rm){document.querySelectorAll('.st [data-n]').forEach(el=>{el.textContent=0;io.observe(el)});
 document.querySelectorAll('.sk i').forEach(el=>{el.dataset.w=el.style.width;el.style.width='0';io.observe(el)})}
// brillo del cursor y parallax del hero
if(!rm&&matchMedia('(pointer:fine)').matches){const g=document.createElement('div');g.className='glow';document.body.append(g);const h=document.querySelector('.hero');
 addEventListener('mousemove',e=>{g.style.transform=`translate(${e.clientX-150}px,${e.clientY-150}px)`;h.style.setProperty('--px',(.5-e.clientX/innerWidth)*2)})}
