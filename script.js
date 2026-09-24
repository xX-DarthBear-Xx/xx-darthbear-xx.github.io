const $=id=>document.getElementById(id),term=$('term'),out=$('out'),input=$('cmd');
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:k=>{try{sessionStorage.setItem(k,1)}catch(e){}}};
const go=id=>$(id).scrollIntoView({behavior:rm?'auto':'smooth'});
const say=t=>{out.append('\n'+t);out.scrollTop=out.scrollHeight};
const toggle=()=>{term.hidden=!term.hidden;if(!term.hidden)input.focus()};
$('open').onclick=toggle;
$('help').onclick=e=>{e.preventDefault();toggle()};
const cmds={
 help:()=>'about  lab  writeups  projects  skills  blog  contact\nhtb  certs  whoami  ls  neofetch  clear  exit',
 whoami:()=>(go('about'),'darthbear'),
 ls:()=>'about/  lab/  writeups/  projects/  skills/  contact',
 htb:()=>(go('lab'),'Script Kiddie · Level 26 · Apprentice\nMachines: 15/552 · Streak: 3 weeks\nRooted: Reactor, Cap, Enigma'),
 certs:()=>(go('about'),'Python Ofensivo (Hack4u.io)\nIntroducción al Hacking (Hack4u.io)\neJPT: en preparación'),
 neofetch:()=>'darthbear@kali\nOS: Kali GNU/Linux Rolling\nWM: bspwm\nShell: zsh\nTerminal: kitty\nTheme: Kali-Dark',
 'sudo su':()=>'darthbear is not in the sudoers file. This incident will be reported.',
 'sudo rm -rf /':()=>'Nice try. Este portafolio sigue en pie.',
 clear:()=>{out.textContent='';return ''},
 exit:()=>{term.hidden=true;return ''}
};
['about','lab','writeups','projects','skills','blog','contact'].forEach(s=>cmds[s]=()=>(go(s),'abriendo '+s+'...'));
const hist=[];let hi=0;
input.addEventListener('keydown',e=>{
 if(e.key==='Escape')term.hidden=true;
 if(e.key==='ArrowUp'&&hist.length){e.preventDefault();hi=Math.max(0,hi-1);input.value=hist[hi]}
 if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(hist.length,hi+1);input.value=hist[hi]||''}
 if(e.key==='Tab'){e.preventDefault();const m=Object.keys(cmds).filter(k=>k.startsWith(input.value.trim())&&input.value.trim());if(m.length===1)input.value=m[0];else if(m.length)say(m.join('  '))}
 if(e.key!=='Enter')return;
 const c=input.value.trim();input.value='';if(!c)return;
 hist.push(c);hi=hist.length;say('$ '+c);
 const r=(cmds[c]||(()=>c+': comando no encontrado. Prueba help'))();if(r)say(r);
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
