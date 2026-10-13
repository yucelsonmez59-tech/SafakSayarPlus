
(function(){
  'use strict';
  var gallery=document.querySelector('[data-mp-gallery]');
  if(!gallery)return;
  var track=gallery.querySelector('.mp-gallery-track');
  var shots=Array.from(gallery.querySelectorAll('[data-mp-shot]'));
  var dialog=document.getElementById('mp-gallery-dialog');
  if(!track||!dialog||shots.length===0)return;
  var preview=dialog.querySelector('[data-mp-preview]');
  var caption=dialog.querySelector('[data-mp-caption]');
  var counter=dialog.querySelector('[data-mp-counter]');
  var active=0;
  function wrap(i){return(i+shots.length)%shots.length}
  function render(i){
    active=wrap(i);
    var shot=shots[active];
    var source=shot.querySelector('img');
    preview.src=source.getAttribute('src');
    preview.alt=source.alt;
    caption.textContent=shot.dataset.title||source.alt;
    counter.textContent=(active+1)+' / '+shots.length;
  }
  shots.forEach(function(shot,i){shot.addEventListener('click',function(){
    render(i);
    if(typeof dialog.showModal==='function')dialog.showModal();
  })});
  gallery.querySelectorAll('[data-mp-scroll]').forEach(function(button){
    button.addEventListener('click',function(){
      var direction=Number(button.dataset.mpScroll)||1;
      var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({left:direction*Math.max(200,track.clientWidth*0.75),behavior:reduce?'instant':'smooth'});
    });
  });
  dialog.querySelector('[data-mp-prev]').addEventListener('click',function(){render(active-1)});
  dialog.querySelector('[data-mp-next]').addEventListener('click',function(){render(active+1)});
  dialog.querySelector('[data-mp-close]').addEventListener('click',function(){dialog.close()});
  dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close()});
  dialog.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();render(active-1)}
    else if(e.key==='ArrowRight'){e.preventDefault();render(active+1)}
  });
  var startX=0,startY=0;
  preview.addEventListener('touchstart',function(e){
    if(e.touches.length!==1)return;
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;
  },{passive:true});
  preview.addEventListener('touchend',function(e){
    if(e.changedTouches.length!==1)return;
    var dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)render(active+(dx<0?1:-1));
  },{passive:true});
})();
