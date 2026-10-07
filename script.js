(() => {
  const header=document.querySelector('[data-header]');
  const menu=document.querySelector('[data-menu]');
  const menuBtn=document.querySelector('[data-menu-btn]');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>16);
  const installDock=document.querySelector('[data-mobile-install]');
  const footer=document.querySelector('.site-footer');
  const progressBar=document.querySelector('[data-scroll-progress]');
  let ticking=false;
  const syncScroll=()=>{
    ticking=false;
    syncHeader();
    if(installDock){
      const nearFooter=footer?footer.getBoundingClientRect().top<window.innerHeight+60:false;
      installDock.classList.toggle('visible',window.scrollY>500&&!nearFooter);
    }
    if(progressBar){
      const doc=document.documentElement;
      const max=Math.max(1,doc.scrollHeight-window.innerHeight);
      progressBar.style.width=(Math.min(1,Math.max(0,window.scrollY/max))*100).toFixed(2)+'%';
    }
  };
  const queueScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(syncScroll);};
  syncScroll(); window.addEventListener('scroll',queueScroll,{passive:true}); window.addEventListener('resize',queueScroll);

  const closeMenu=({restoreFocus=false}={})=>{
    if(!menu||!menuBtn)return;
    menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false');
    const sr=menuBtn.querySelector('.sr-only'); if(sr) sr.textContent='Menüyü aç';
    if(restoreFocus) menuBtn.focus();
  };
  if(menu&&menuBtn){
    menuBtn.addEventListener('click',()=>{
      const open=!menu.classList.contains('open'); menu.classList.toggle('open',open); menuBtn.setAttribute('aria-expanded',String(open));
      const sr=menuBtn.querySelector('.sr-only'); if(sr) sr.textContent=open?'Menüyü kapat':'Menüyü aç';
    });
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open'))closeMenu({restoreFocus:true});});
    document.addEventListener('pointerdown',event=>{if(menu.classList.contains('open')&&!menu.contains(event.target)&&!menuBtn.contains(event.target))closeMenu();});
  }

  const reveals=document.querySelectorAll('.reveal');
  if(reducedMotion||!('IntersectionObserver' in window)) reveals.forEach(el=>el.classList.add('visible'));
  else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -40px'});
    reveals.forEach(el=>observer.observe(el));
  }

  const navLinks=[...document.querySelectorAll('.site-menu a[href^="#"]')];
  const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if(sections.length&&'IntersectionObserver' in window){
    const sectionObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      navLinks.forEach(link=>{
        const active=link.getAttribute('href')==='#'+visible.target.id;
        link.classList.toggle('active',active);
        if(active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-30% 0px -55% 0px',threshold:[.01,.2,.5]});
    sections.forEach(section=>sectionObserver.observe(section));
  }

  const phone=document.querySelector('.phone');
  const phoneWrap=document.querySelector('.hero-device-wrap');
  if(phone&&phoneWrap&&!reducedMotion&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    phoneWrap.addEventListener('pointermove',event=>{const rect=phoneWrap.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;phone.style.transform=`rotate(${2.4+x*2.1}deg) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(${y*3}px)`;});
    phoneWrap.addEventListener('pointerleave',()=>{phone.style.transform='rotate(2.4deg)';});
  }

  document.querySelectorAll('.faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if(!detail.open)return;
    document.querySelectorAll('.faq-list details[open]').forEach(other=>{if(other!==detail)other.open=false;});
  }));

  if(!reducedMotion&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.feature-card,.showcase-card,.flow-card,.principle-card').forEach(card=>card.addEventListener('pointermove',event=>{const rect=card.getBoundingClientRect();card.style.setProperty('--mx',(event.clientX-rect.left)+'px');card.style.setProperty('--my',(event.clientY-rect.top)+'px');}));
  }
})();