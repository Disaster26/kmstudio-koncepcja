(function(){
var d=document,b=d.body;
// nagłówek po przewinięciu
var top=d.getElementById('top');
function sc(){top.classList.toggle('zw',scrollY>40)}
addEventListener('scroll',sc,{passive:true});sc();
// menu mobilne
var bu=d.getElementById('burger');
bu.addEventListener('click',function(){var o=b.classList.toggle('otw');bu.setAttribute('aria-expanded',o);bu.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
d.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){b.classList.remove('otw');bu.setAttribute('aria-expanded','false')})});
// aktywna pozycja menu
var linki=[].slice.call(d.querySelectorAll('.menu a[href^="#"]'));
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){linki.forEach(function(a){a.classList.toggle('akt',a.getAttribute('href')==='#'+x.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
 linki.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
}
var STR='<svg viewBox="0 0 22 10" fill="none" stroke="currentColor"><path d="M0 5h21M17 1l4 4-4 4"/></svg>';
var STL='<svg viewBox="0 0 22 10" fill="none" stroke="currentColor"><path d="M22 5H1M5 1 1 5l4 4"/></svg>';
// karty z karuzelą
var wszystkie=[];
d.querySelectorAll('.karta').forEach(function(k){
 var zd=k.dataset.zd.split(','),t=k.dataset.tytul,kar=k.querySelector('.kar');
 var tor=d.createElement('div');tor.className='tor';
 var k2=k.closest('.k2');
 zd.forEach(function(n,i){
  var idx=wszystkie.length;wszystkie.push({n:n,t:t});
  var bt=d.createElement('button');bt.type='button';bt.className='sl';bt.setAttribute('aria-label','Powiększ: '+t+' ('+(i+1)+'/'+zd.length+')');
  var szer=k2?'(max-width:600px) 46vw, (max-width:1100px) 46vw, 30vw':'(max-width:600px) 46vw, (max-width:1100px) 46vw, 24vw';
  bt.innerHTML='<img src="img/'+n+'-800.webp" srcset="img/'+n+'-360.webp 360w, img/'+n+'-480.webp 480w, img/'+n+'-800.webp 800w" sizes="'+szer+'" width="800" height="1000" alt="'+t+'" loading="lazy" decoding="async" draggable="false">';
  bt.addEventListener('click',function(e){if(tor.dataset.moved==='1'){e.preventDefault();return}otworz(idx)});
  tor.appendChild(bt);
 });
 kar.appendChild(tor);
 var widok=k2?2:1;
 if(window.matchMedia('(max-width:600px)').matches)widok=1;
 if(zd.length>widok){
  var p=d.createElement('button'),nx=d.createElement('button'),lc=d.createElement('span');
  p.className='nav p';p.type='button';p.innerHTML=STL;p.setAttribute('aria-label','Poprzednie zdjęcie');
  nx.className='nav n';nx.type='button';nx.innerHTML=STR;nx.setAttribute('aria-label','Następne zdjęcie');
  lc.className='licz';
  kar.appendChild(p);kar.appendChild(nx);kar.appendChild(lc);
  function krok(){return tor.firstChild.getBoundingClientRect().width}
  function upd(){var w=krok()||1,i=Math.round(tor.scrollLeft/w),max=tor.children.length-Math.round(tor.clientWidth/w);p.disabled=i<=0;nx.disabled=i>=max;lc.textContent=(i+1)+' / '+tor.children.length}
  p.addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'})});
  nx.addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'})});
  tor.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
  addEventListener('resize',upd);upd();
 }
 // przeciąganie myszą
 var sx=0,sl=0,on=false;
 tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;on=true;sx=e.clientX;sl=tor.scrollLeft;tor.dataset.moved='0'});
 addEventListener('pointermove',function(e){if(!on)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){tor.dataset.moved='1';tor.classList.add('drag')}tor.scrollLeft=sl-dx});
 addEventListener('pointerup',function(){if(!on)return;on=false;if(tor.classList.contains('drag')){tor.classList.remove('drag');var w=tor.firstChild.getBoundingClientRect().width;tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(function(){tor.dataset.moved='0'},50)});
});
// lightbox
var lb=d.getElementById('lb'),I=d.getElementById('lbI'),T=d.getElementById('lbT'),C=d.getElementById('lbC'),cur=0,last=null;
function pokaz(i){cur=(i+wszystkie.length)%wszystkie.length;var z=wszystkie[cur];I.style.opacity=0;I.onload=function(){I.style.opacity=1};I.srcset='img/'+z.n+'-800.webp 800w, img/'+z.n+'-1200.webp 1200w';I.sizes='(max-width:800px) 100vw, 70vh';I.src='img/'+z.n+'-1200.webp';I.alt=z.t;T.textContent=z.t;C.textContent=(cur+1)+' / '+wszystkie.length;
 var nn=wszystkie[(cur+1)%wszystkie.length];(new Image()).src='img/'+nn.n+'-1200.webp'}
function otworz(i){last=d.activeElement;lb.classList.add('on');b.style.overflow='hidden';pokaz(i);d.getElementById('lbX').focus()}
function zamknij(){lb.classList.remove('on');b.style.overflow='';if(last)last.focus()}
d.getElementById('lbX').onclick=zamknij;
d.getElementById('lbP').onclick=function(){pokaz(cur-1)};
d.getElementById('lbN').onclick=function(){pokaz(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb||e.target.id==='lbS')zamknij()});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight')pokaz(cur+1);if(e.key==='ArrowLeft')pokaz(cur-1)});
var tx=null,ty=0;var S=d.getElementById('lbS');
S.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
S.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))pokaz(cur+(dx<0?1:-1));tx=null});
var px=null;S.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.target===I){px=e.clientX}});
S.addEventListener('pointerup',function(e){if(px===null)return;var dx=e.clientX-px;if(Math.abs(dx)>45)pokaz(cur+(dx<0?1:-1));px=null});
// formularz pokazowy
d.getElementById('form').addEventListener('submit',function(e){e.preventDefault();var f=e.target,ok=f.imie.value.trim()&&f.kontakt.value.trim()&&f.querySelector('[type=checkbox]').checked;d.getElementById('info').textContent=ok?'Dziękujemy. To formularz pokazowy - w wersji docelowej wiadomość trafi na biuro@karolinamazur.com.':'Proszę uzupełnić imię, kontakt i zaznaczyć zgodę.'});
// mapa ładowana przy przewinięciu
var m=d.getElementById('mapa');
function mapa(){if(m.dataset.ok)return;m.dataset.ok=1;var f=d.createElement('iframe');f.src=m.dataset.src;f.title='Mapa: KM STUDIO, Samotnik 11, Glinnik';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(e){if(e[0].isIntersecting){mapa();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else mapa();
})();
