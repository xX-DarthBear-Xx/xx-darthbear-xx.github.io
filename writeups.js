(()=>{
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const safe=u=>/^\s*(javascript|data|vbscript):/i.test(u)?'#':u;
const inl=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>')
 .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,(_,a,u)=>`<img src="${safe(u)}" alt="${a}" loading="lazy">`)
 .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(_,t,u)=>`<a href="${safe(u)}" target="_blank" rel="noopener">${t}</a>`)
 .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\*([^*]+)\*/g,'<i>$1</i>');
const md=t=>{const L=t.replace(/\r/g,'').split('\n');let o='',i=0,m;
 const li=/^\s*([-*]|\d+\.)\s+/;
 while(i<L.length){const l=L[i];
  if(/^```/.test(l)){const lang=l.slice(3).trim(),b=[];i++;while(i<L.length&&!/^```/.test(L[i]))b.push(L[i++]);i++;o+=`<pre><code class="lang-${esc(lang)}">${esc(b.join('\n'))}</code></pre>`;continue}
  if(m=l.match(/^(#{1,4})\s+(.*)/)){o+=`<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`;i++;continue}
  if(/^(-{3,}|\*{3,})$/.test(l.trim())){o+='<hr>';i++;continue}
  if(/^>/.test(l)){const b=[];while(i<L.length&&/^>/.test(L[i]))b.push(L[i++].replace(/^>\s?/,''));o+=`<blockquote>${inl(b.join(' '))}</blockquote>`;continue}
  if(li.test(l)){const ol=/^\s*\d+\./.test(l),b=[];while(i<L.length&&li.test(L[i]))b.push(`<li>${inl(L[i++].replace(li,''))}</li>`);o+=`<${ol?'ol':'ul'}>${b.join('')}</${ol?'ol':'ul'}>`;continue}
  if(!l.trim()){i++;continue}
  const b=[L[i++]];while(i<L.length&&L[i].trim()&&!/^(```|#{1,4}\s|>|\s*([-*]|\d+\.)\s)/.test(L[i]))b.push(L[i++]);o+=`<p>${inl(b.join(' '))}</p>`}
 return o};
const fm=t=>{const m=t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/);if(!m)return[{},t];const o={};m[1].split('\n').forEach(l=>{const k=l.indexOf(':');if(k>0)o[l.slice(0,k).trim()]=l.slice(k+1).trim()});return[o,m[2]]};
const idx=()=>fetch('content/writeups/index.json').then(r=>r.ok?r.json():[]).catch(()=>[]);
const meta=w=>[w.date,w.os,w.difficulty,w.minutes?w.minutes+' min':''].filter(Boolean).map(esc).join(' · ');
const tags=w=>(w.tags||[]).map(t=>'#'+esc(t)).join(' ');
const link=w=>'writeup.html?w='+encodeURIComponent(w.slug);

// Home: últimos 5
const wl=$('#wlist');
if(wl)idx().then(a=>{if(!a.length)return;wl.innerHTML=a.slice(0,5).map(w=>`<a class="row" href="${link(w)}"><span class="ic"><svg class="i"><use href="#doc"/></svg></span><span><b>${esc(w.title)}</b><time>${meta(w)}</time><em>${tags(w)}</em></span></a>`).join('')+'<a class="more" href="writeups.html">View all writeups <svg class="i s"><use href="#ar"/></svg></a>'});

// Listado con búsqueda y filtro por tag
const all=$('#wall');
if(all)idx().then(a=>{let tag='',q='';const chips=$('#wt');
 const T=[...new Set(a.flatMap(w=>w.tags||[]))].sort();
 const draw=()=>{const f=a.filter(w=>(!tag||(w.tags||[]).includes(tag))&&(w.title+' '+(w.summary||'')+' '+(w.tags||[]).join(' ')).toLowerCase().includes(q));
  chips.innerHTML=T.map(t=>`<button class="${t===tag?'on':''}" data-t="${esc(t)}">#${esc(t)}</button>`).join('');
  all.innerHTML=f.length?f.map(w=>`<article class="item"><h3><a href="${link(w)}">${esc(w.title)}</a></h3><time>${meta(w)}</time><p>${esc(w.summary||'')}</p><p class="tag">${tags(w)}</p></article>`).join(''):`<p class="soon"><b>${a.length?'Sin resultados':'Coming soon'}</b>${a.length?'Prueba con otra búsqueda o tag.':'Aquí publicaré mis writeups.'}</p>`};
 chips.onclick=e=>{const t=e.target.dataset&&e.target.dataset.t;if(t!==undefined){tag=tag===t?'':t;draw()}};
 $('#wq').oninput=e=>{q=e.target.value.toLowerCase();draw()};draw()});

// Visor de un writeup
const view=$('#md');
if(view){const slug=new URLSearchParams(location.search).get('w')||'';
 if(!/^[\w-]+$/.test(slug))view.innerHTML='<p class="soon"><b>No encontrado</b>Falta el writeup.</p>';
 else fetch('content/writeups/'+slug+'.md').then(r=>{if(!r.ok)throw 0;return r.text()}).then(t=>{const[m,body]=fm(t);
  document.title=(m.title||slug)+' · DarthBear';
  $('#wh').innerHTML=`<h1>${esc(m.title||slug)}</h1><p class="wmeta">${[m.date,m.os,m.difficulty].filter(Boolean).map(esc).join(' · ')}</p><p class="tag">${(m.tags||'').split(',').filter(s=>s.trim()).map(s=>'#'+esc(s.trim())).join(' ')}</p>`;
  view.innerHTML=md(body)}).catch(()=>view.innerHTML='<p class="soon"><b>No encontrado</b>Ese writeup no existe.</p>')}
})();
