const $ = id => document.getElementById(id), term = $('term'), out = $('out'), input = $('cmd');
const go = id => $(id).scrollIntoView({behavior:'smooth'});
const say = t => { out.append('\n' + t); out.scrollTop = out.scrollHeight; };
const toggle = () => { term.hidden = !term.hidden; if (!term.hidden) input.focus(); };
$('open').onclick = toggle;
$('help').onclick = e => { e.preventDefault(); toggle(); };
const cmds = {
  help: () => 'about  lab  writeups  projects  skills  blog  contact\nwhoami  ls  neofetch  clear  exit',
  whoami: () => (go('about'), 'darthbear'),
  ls: () => 'about/  lab/  writeups/  projects/  skills/  contact',
  neofetch: () => 'darthbear@kali\nOS: Kali GNU/Linux Rolling\nWM: bspwm\nShell: zsh\nTerminal: kitty\nTheme: Kali-Dark',
  'sudo rm -rf /': () => 'Nice try. Este portafolio sigue en pie.',
  clear: () => { out.textContent = ''; return ''; },
  exit: () => { term.hidden = true; return ''; }
};
['about','lab','writeups','projects','skills','blog','contact'].forEach(s => cmds[s] = () => (go(s), 'abriendo ' + s + '...'));
input.addEventListener('keydown', e => {
  if (e.key === 'Escape') term.hidden = true;
  if (e.key !== 'Enter') return;
  const c = input.value.trim(); input.value = '';
  if (!c) return;
  say('$ ' + c);
  const r = (cmds[c] || (() => c + ': comando no encontrado. Prueba help'))();
  if (r) say(r);
});
