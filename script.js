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
const fs={'about.txt':'DarthBear · cybersecurity, networks and Linux.\nFocus: offensive security. Preparing eJPT.\nBased in Costa Rica.',
 'certs.txt':'Python Ofensivo (Hack4u.io)\nIntroducción al Hacking (Hack4u.io)\neJPT: en preparación',
 'htb.txt':HTBTXT+'\n(open htb.txt)',
 'contact.txt':'GitHub:   github.com/xX-DarthBear-Xx\nLinkedIn: linkedin.com/in/kevin-carballo-herrera-245428389\nEmail:    kevincarballoherrera@gmail.com',
 projects:{'recon.txt':'recon · automated reconnaissance framework for pentesting labs.\n'+REPO+'\n(open recon.txt)'},
 writeups:{}};
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
 help:()=>'ls [dir]  cd <dir>  cat <file>  tree  pwd  open <file>\nhtb  certs  whoami  neofetch  clear  exit\nabout  lab  writeups  projects  skills  blog  contact  (ir a la sección)',
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
['about','lab','writeups','projects','skills','blog','contact'].forEach(s=>C[s]=()=>(go(s),'abriendo '+s+'...'));
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
// boot (una vez por visita)
if(!rm&&!store.get('booted')){
 const b=document.createElement('div');b.className='boot';b.innerHTML='<pre></pre><button>skip ›</button>';document.body.append(b);
 const pre=b.firstChild,L=['[ INITIALIZING SECURITY PROFILE... ]','> NETWORK ............ OK','> LINUX .............. OK','> WEB SECURITY ....... OK','> OFFENSIVE SECURITY . LOADING'];
 let i=0,t;const end=()=>{clearInterval(t);store.set('booted');b.classList.add('off');setTimeout(()=>b.remove(),500)};
 t=setInterval(()=>i<L.length?pre.textContent+=L[i++]+'\n':end(),280);b.onclick=end;
}
// texto que se escribe
const tw=$('tw');
if(tw&&!rm){const W=['pentesting','linux','python ofensivo','redes','ctf en hack the box'];let w=0,c=0,del=false;
 const tick=()=>{const s=W[w];tw.textContent=s.slice(0,c);
  if(!del){if(c<s.length){c++;return setTimeout(tick,80)}del=true;return setTimeout(tick,1400)}
  if(c>0){c--;return setTimeout(tick,40)}del=false;w=(w+1)%W.length;setTimeout(tick,300)};tick()}
// números y barras al hacer scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);
 if(el.dataset.n){const n=+el.dataset.n;let v=0;const s=setInterval(()=>{el.textContent=++v;if(v>=n)clearInterval(s)},60)}else el.style.width=el.dataset.w}),{threshold:.4});
if(!rm){document.querySelectorAll('.st [data-n]').forEach(el=>{el.textContent=0;io.observe(el)});
 document.querySelectorAll('.sk i').forEach(el=>{el.dataset.w=el.style.width;el.style.width='0';io.observe(el)})}
// brillo del cursor y parallax del hero
if(!rm&&matchMedia('(pointer:fine)').matches){const g=document.createElement('div');g.className='glow';document.body.append(g);const h=document.querySelector('.hero');
 addEventListener('mousemove',e=>{g.style.transform=`translate(${e.clientX-150}px,${e.clientY-150}px)`;h.style.setProperty('--px',(.5-e.clientX/innerWidth)*2)})}
