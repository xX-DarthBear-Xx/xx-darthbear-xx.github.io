const $=id=>document.getElementById(id),term=$('termbox'),out=$('out'),input=$('cmd'),ps=$('ps');
const t=(k,...a)=>DB.t(k,...a);
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:k=>{try{sessionStorage.setItem(k,1)}catch(e){}}};
const go=id=>{const el=$(id);if(el)el.scrollIntoView({behavior:rm?'auto':'smooth'})};
const say=s=>{out.append('\n'+s);out.scrollTop=out.scrollHeight};
const toggle=()=>{term.hidden=!term.hidden;if(!term.hidden)input.focus()};
$('open').onclick=toggle;
$('help').onclick=e=>{e.preventDefault();toggle()};
const langBtn=$('lang');
if(langBtn)langBtn.onclick=()=>DB.set(DB.get()==='es'?'en':'es');

// ---------- sistema de archivos virtual (los archivos son funciones para traducirse al leerlos) ----------
const REPO='https://github.com/xX-DarthBear-Xx/recon',HTB='https://app.hackthebox.com/users/828180';
const fs={
 'about.txt':()=>t('fAbout'),
 'certs.txt':()=>t('fCerts'),
 'htb.txt':()=>t('fHtb')+'\n'+HTB+'\n(open htb.txt)',
 'contact.txt':()=>'GitHub:   github.com/xX-DarthBear-Xx\nLinkedIn: linkedin.com/in/kevin-carballo-herrera-245428389\nEmail:    kevincarballoherrera@gmail.com',
 'timeline.txt':()=>t('fTimeline'),
 projects:{'recon.txt':()=>t('fRecon')+'\n'+REPO+'\n(open recon.txt)'},
 writeups:{}
};
const links={'htb.txt':HTB,'projects/recon.txt':REPO};
let cwd=[];
fetch('content/writeups/index.json').then(r=>r.ok?r.json():[]).catch(()=>[]).then(a=>a.forEach(w=>{const f=w.slug+'.md';
 fs.writeups[f]=()=>[w.title,[w.date,w.os,w.difficulty].filter(Boolean).join(' · '),w.summary||'','(open '+f+')'].join('\n');
 links['writeups/'+f]=w.url||('writeup.html?w='+encodeURIComponent(w.slug))}));
const isFile=n=>typeof n==='function';
const isDir=n=>n!==null&&typeof n==='object';
const parts=p=>{const r=/^[~/]/.test(p)?[]:cwd.slice();p.replace(/^~/,'').split('/').forEach(s=>{if(s==='..')r.pop();else if(s&&s!=='.')r.push(s)});return r};
const at=r=>r.reduce((n,k)=>isDir(n)&&k in n?n[k]:undefined,fs);
const setPs=()=>ps.textContent='darthbear@portfolio:'+(cwd.length?'~/'+cwd.join('/'):'~')+'$';
const list=n=>Object.keys(n).sort().map(k=>isDir(n[k])?k+'/':k).join('  ')||t('empty');
const tree=(n,p='')=>Object.keys(n).sort().map((k,i,a)=>{const l=i===a.length-1,sub=isDir(n[k])?tree(n[k],p+(l?'    ':'│   ')):'';return p+(l?'└── ':'├── ')+k+(isDir(n[k])?'/':'')+(sub?'\n'+sub:'')}).join('\n');
const C={
 help:()=>t('help'),
 ls:a=>{const n=a[0]?at(parts(a[0])):at(cwd);return isDir(n)?list(n):isFile(n)?a[0]:t('lsNo',a[0])},
 cd:a=>{const r=a[0]?parts(a[0]):[];if(!isDir(at(r)))return t('cdNo',a[0]||'');cwd=r;setPs();return ''},
 pwd:()=>'/home/darthbear'+(cwd.length?'/'+cwd.join('/'):''),
 cat:a=>{const n=a[0]?at(parts(a[0])):undefined;return isFile(n)?n():isDir(n)?t('catDir',a[0]):t('catNo',a[0]||'')},
 tree:()=>'~\n'+tree(fs),
 open:a=>{const u=a[0]&&links[parts(a[0]).join('/')];if(!u)return t('openNo',a[0]||'');if(/^https?:/.test(u))window.open(u,'_blank','noopener');else location.href=u;return t('opening',u)},
 whoami:()=>(go('about'),'darthbear'),
 htb:()=>(go('lab'),t('fHtb')),
 certs:()=>(go('about'),t('fCerts')),
 neofetch:()=>'darthbear@kali\nOS: Kali GNU/Linux Rolling\nWM: bspwm\nShell: zsh\nTerminal: kitty\nTheme: Kali-Dark',
 clear:()=>{out.textContent='';return ''},
 exit:()=>{term.hidden=true;return ''}
};
['about','lab','writeups','projects','experience','roadmap','timeline','contact'].forEach(s=>C[s]=()=>(go(s),t('opening',s)));
const E={'sudo su':()=>t('sudoSu'),'sudo rm -rf /':()=>t('rmrf'),'cat /etc/motd':()=>t('motto')};
const run=c=>{if(E[c])return E[c]();const[n,...a]=c.split(/\s+/);return C[n]?C[n](a):t('cmdNo',c)};
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

// ---------- resaltar la sección activa del menú ----------
const navLinks=[...document.querySelectorAll('.top nav a, .side nav a')].filter(a=>a.hash);
const sections=[...new Set(navLinks.map(a=>a.hash.slice(1)))].map($).filter(Boolean);
let lockUntil=0;
const setActive=id=>navLinks.forEach(a=>a.classList.toggle('on',a.hash==='#'+id));
navLinks.forEach(a=>a.addEventListener('click',()=>{setActive(a.hash.slice(1));lockUntil=Date.now()+900}));
const updateActive=()=>{
 if(Date.now()<lockUntil)return;
 const line=innerHeight*.4;
 const hit=sections.filter(s=>{const r=s.getBoundingClientRect();return r.top<=line&&r.bottom>line});
 if(!hit.length)return;
 const cur=document.querySelector('.top nav a.on');
 if(cur&&hit.some(s=>'#'+s.id===cur.hash))return; // varias tarjetas en la misma fila: no cambiar si la actual sigue visible
 setActive(hit[0].id);
};
let tick=0;
addEventListener('scroll',()=>{if(tick)return;tick=requestAnimationFrame(()=>{tick=0;updateActive()})},{passive:true});
updateActive();

// ---------- stats en vivo del repo recon (GitHub API pública) ----------
const ghs=$('ghstats');let ghData=null;
const renderGh=()=>{if(!ghs||!ghData)return;
 const upd=new Date(ghData.pushed_at).toLocaleDateString(t('ghLocale'),{year:'numeric',month:'short',day:'numeric'});
 ghs.textContent='★ '+ghData.stargazers_count+' · '+t('ghUpdated')+upd};
if(ghs){fetch('https://api.github.com/repos/xX-DarthBear-Xx/recon').then(r=>r.ok?r.json():null).then(d=>{if(d){ghData=d;renderGh()}}).catch(()=>{});
 document.addEventListener('darthbear:lang',renderGh)}

// ---------- boot (una vez por visita) ----------
if(!rm&&!store.get('booted')){
 const b=document.createElement('div');b.className='boot';b.innerHTML='<pre></pre><button>skip ›</button>';document.body.append(b);
 const pre=b.firstChild,L=['[ INITIALIZING SECURITY PROFILE... ]','> NETWORK ............ OK','> LINUX .............. OK','> WEB SECURITY ....... OK','> OFFENSIVE SECURITY . LOADING'];
 let i=0,timer;const end=()=>{clearInterval(timer);store.set('booted');b.classList.add('off');setTimeout(()=>b.remove(),500)};
 timer=setInterval(()=>i<L.length?pre.textContent+=L[i++]+'\n':end(),280);b.onclick=end;
}

// ---------- texto que se escribe ----------
const tw=$('tw');
if(tw&&!rm){let w=0,c=0,del=false,gen=0;
 const step=g=>{if(g!==gen)return;const W=t('tw'),s=W[w%W.length];tw.textContent=s.slice(0,c);
  if(!del){if(c<s.length){c++;return setTimeout(()=>step(g),80)}del=true;return setTimeout(()=>step(g),1400)}
  if(c>0){c--;return setTimeout(()=>step(g),40)}del=false;w++;setTimeout(()=>step(g),300)};
 step(gen);
 document.addEventListener('darthbear:lang',()=>{gen++;w=0;c=0;del=false;step(gen)});
}

// ---------- números y barras al hacer scroll ----------
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);
 if(el.dataset.n){const n=+el.dataset.n;let v=0;const s=setInterval(()=>{el.textContent=++v;if(v>=n)clearInterval(s)},60)}else el.style.width=el.dataset.w}),{threshold:.4});
if(!rm){document.querySelectorAll('.st [data-n]').forEach(el=>{el.textContent=0;io.observe(el)});
 document.querySelectorAll('.sk i').forEach(el=>{el.dataset.w=el.style.width;el.style.width='0';io.observe(el)})}

// ---------- brillo del cursor y parallax del hero ----------
if(!rm&&matchMedia('(pointer:fine)').matches){const g=document.createElement('div');g.className='glow';document.body.append(g);const h=document.querySelector('.hero');
 addEventListener('mousemove',e=>{g.style.transform=`translate(${e.clientX-150}px,${e.clientY-150}px)`;h.style.setProperty('--px',(.5-e.clientX/innerWidth)*2)})}
