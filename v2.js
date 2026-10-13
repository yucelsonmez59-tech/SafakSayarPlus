
(function(){
  var root=document.documentElement, themeKey="ys_theme_v2";
  function system(){return matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";}
  function apply(mode){
    root.classList.toggle("dark",(mode==="system"?system():mode)==="dark");
    document.querySelectorAll("[data-theme]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.theme===mode));});
  }
  var t="system";try{t=localStorage.getItem(themeKey)||"system";}catch(e){}
  if(!["light","dark","system"].includes(t))t="system";apply(t);
  document.querySelectorAll("[data-theme]").forEach(function(b){b.addEventListener("click",function(){t=b.dataset.theme;try{localStorage.setItem(themeKey,t);}catch(e){}apply(t);});});
  var m=document.querySelector("[data-menu]"), toggle=document.querySelector("[data-menu-toggle]");
  function close(){if(m&&toggle){m.classList.remove("open");toggle.setAttribute("aria-expanded","false");}}
  if(m&&toggle){toggle.addEventListener("click",function(){var open=m.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});m.querySelectorAll("a").forEach(function(a){a.addEventListener("click",close);});document.addEventListener("keydown",function(e){if(e.key==="Escape")close();});document.addEventListener("click",function(e){if(!m.contains(e.target)&&!toggle.contains(e.target))close();});}
  if(window.matchMedia){var q=matchMedia("(prefers-color-scheme:dark)");if(q.addEventListener)q.addEventListener("change",function(){if(t==="system")apply(t);});}
})();
