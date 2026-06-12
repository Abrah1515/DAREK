const CONFIG = {
  pin: '1804',
  timeline: [
    ['IMG-20250526-WA0030.jpg', 'Dolní Morava'],
    ['IMG-20250604-WA0005.jpg', 'Skútry', 'Některé nápady prostě stojí za to.'],
    ['IMG-20250617-WA0083.jpg', 'Výhledy', 'První naše dovolená.'],
    ['IMG-20250719-WA0011.jpg', 'Hory', 'Můj pracovní odpočinek.'],
    ['IMG-20250725-WA0000.jpg', 'Adrenalin', 'Letos zas.'],
    ['IMG-20250828-WA0004.jpg', 'Bobová dráha', 'Maximum speed unlocked.'],
    ['IMG-20250905-WA0045.jpg', 'Santorini', 'Worth it.'],
    ['IMG-20250905-WA0115.jpg', 'Santorini II'],
    ['IMG-20250905-WA0102.jpg', 'Santorini III'],
    ['motion_photo_4238856608784070633.jpg', 'Kanárské ostrovz', 'Druhá naše velká dovolená.'],
    ['motion_photo_5815171184131054900.jpg', 'Sport', 'Jednou jsme i sportovali XD.'],
    ['IMG-20251205-WA0002.jpg', 'Vánoce', 'Brněnské trhy.'],
    ['IMG-20260129-WA0008(1).jpg', 'Zima taky prošla testem.'],
    ['IMG-20260214-WA0000(1).jpg', 'Maturák', 'Občas musíme z toho sportovního.'],
    ['IMG-20260530-WA0025.jpg', 'Naše poslední vzpomínky', 'Lavičku jsi našla.'],
    ['IMG-20260530-WA0012.jpg', 'Výlet splněn', 'A tady příběh zatím nekončí.']
  ]
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let current = 'loading';
function show(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $('#' + id).classList.add('active');
  current = id;
  if(id==='stats') animateStats();
}

document.addEventListener('click', e=>{
  const n = e.target.closest('[data-next]');
  if(n) show(n.dataset.next);
});

let p=0; const timer=setInterval(()=>{p+=Math.ceil(Math.random()*9); if(p>=100){p=100; clearInterval(timer); setTimeout(()=>show('unlock'),700)}; $('#bar').style.width=p+'%'; $('#percent').textContent=p+'%';},150);

const keypad=$('.keypad'), dots=$$('.dots i'); let entered='';
['1','2','3','4','5','6','7','8','9','•','0','⌫'].forEach(k=>{
  const b=document.createElement('button'); b.textContent=k; b.onclick=()=>press(k); keypad.appendChild(b);
});
function press(k){
  if(k==='•') return;
  if(k==='⌫') entered=entered.slice(0,-1); else entered=(entered+k).slice(0,4);
  dots.forEach((d,i)=>d.classList.toggle('on',i<entered.length));
  if(entered.length===4){ setTimeout(()=>{ if(entered===CONFIG.pin) show('intro'); else {entered=''; dots.forEach(d=>d.classList.remove('on')); $('.glass.narrow').animate([{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:250});}},180); }
}

const list=$('#timelineList');
CONFIG.timeline.forEach((it,i)=>{
  const row=document.createElement('article'); row.className='chapter';
  row.innerHTML=`<div class="chapter-text"><span>${String(i+1).padStart(2,'0')}</span><h3>${it[1]}</h3><p>${it[2]}</p></div><img src="assets/photos/${it[0]}" alt=""></img>`;
  list.appendChild(row);
});
const grid=$('#galleryGrid');
CONFIG.timeline.forEach((it,i)=>{const img=document.createElement('img'); img.src='assets/photos/'+it[0]; img.alt=''; img.style.setProperty('--d', (i%7)*.06+'s'); grid.appendChild(img);});

function animateStats(){
  $$('[data-count]').forEach(el=>{let target=+el.dataset.count,n=0; const t=setInterval(()=>{n++; el.textContent=n; if(n>=target) clearInterval(t)},55);});
}

const canvas=$('#stars'), ctx=canvas.getContext('2d'); let stars=[];
function resize(){canvas.width=innerWidth; canvas.height=innerHeight; stars=Array.from({length:100},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.6,a:Math.random()}));}
addEventListener('resize',resize); resize();
(function draw(){ctx.clearRect(0,0,canvas.width,canvas.height); stars.forEach(s=>{s.a+=.02; ctx.globalAlpha=.2+Math.abs(Math.sin(s.a))*.8; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();}); requestAnimationFrame(draw);})();

let raf, stream;
async function startMic(){
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const ac=new AudioContext(), src=ac.createMediaStreamSource(stream), an=ac.createAnalyser(); an.fftSize=512; src.connect(an);
    const data=new Uint8Array(an.frequencyBinCount); let hot=0;
    function tick(){an.getByteFrequencyData(data); const avg=data.reduce((a,b)=>a+b,0)/data.length; $('#volumeBar').style.width=Math.min(100,avg*2.5)+'%'; if(avg>34) hot++; else hot=Math.max(0,hot-1); if(hot>4){blow();return} raf=requestAnimationFrame(tick)} tick();
    $('#micBtn').textContent='Poslouchám... foukni';
  }catch(e){alert('Mikrofon se nepodařilo spustit. Zkus ruční tlačítko.');}
}
function blow(){ cancelAnimationFrame(raf); stream?.getTracks().forEach(t=>t.stop()); document.body.classList.add('blown'); setTimeout(()=>show('gift'),1600); }
$('#micBtn').onclick=startMic; $('#manualBlow').onclick=blow;
