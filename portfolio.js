(() => {
  const header=document.querySelector('[data-p-header]');
  const menu=document.querySelector('[data-p-menu]');
  const menuBtn=document.querySelector('[data-p-menu-btn]');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>12);
  syncHeader();
  window.addEventListener('scroll',syncHeader,{passive:true});

  const closeMenu=({restoreFocus=false}={})=>{
    if(!menu||!menuBtn)return;
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    const sr=menuBtn.querySelector('.p-sr'); if(sr) sr.textContent='Menüyü aç';
    if(restoreFocus) menuBtn.focus();
  };

  if(menu&&menuBtn){
    menuBtn.addEventListener('click',()=>{
      const open=!menu.classList.contains('open');
      menu.classList.toggle('open',open);
      menuBtn.setAttribute('aria-expanded',String(open));
      const sr=menuBtn.querySelector('.p-sr'); if(sr) sr.textContent=open?'Menüyü kapat':'Menüyü aç';
    });
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open')) closeMenu({restoreFocus:true});});
    document.addEventListener('pointerdown',event=>{
      if(!menu.classList.contains('open'))return;
      if(menu.contains(event.target)||menuBtn.contains(event.target))return;
      closeMenu();
    });
  }

  const reveals=document.querySelectorAll('.p-reveal');
  if(reduced||!('IntersectionObserver' in window)) reveals.forEach(el=>el.classList.add('visible'));
  else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }),{threshold:.12,rootMargin:'0px 0px -28px'});
    reveals.forEach(el=>observer.observe(el));
  }

  const navLinks=[...document.querySelectorAll('.p-menu a[href^="#"]')];
  const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if(sections.length&&'IntersectionObserver' in window){
    const spy=new IntersectionObserver(entries=>{
      const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!active)return;
      navLinks.forEach(link=>{
        const isActive=link.getAttribute('href')==='#'+active.target.id;
        link.classList.toggle('active',isActive);
        if(isActive) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-30% 0px -58% 0px',threshold:[.01,.25]});
    sections.forEach(section=>spy.observe(section));
  }
})();