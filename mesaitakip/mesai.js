(() => {
  const header=document.querySelector('[data-m-header]');
  const menu=document.querySelector('[data-m-menu]');
  const menuBtn=document.querySelector('[data-m-menu-btn]');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>12);
  syncHeader(); window.addEventListener('scroll',syncHeader,{passive:true});

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
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open'))closeMenu({restoreFocus:true});});
    document.addEventListener('pointerdown',event=>{if(menu.classList.contains('open')&&!menu.contains(event.target)&&!menuBtn.contains(event.target))closeMenu();});
  }

  const reveals=document.querySelectorAll('.m-reveal');
  if(reduced||!('IntersectionObserver' in window)) reveals.forEach(el=>el.classList.add('visible'));
  else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -30px'});
    reveals.forEach(el=>observer.observe(el));
  }

  const navLinks=[...document.querySelectorAll('.m-menu a[href^="#"]')];
  const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if(sections.length&&'IntersectionObserver' in window){
    const spy=new IntersectionObserver(entries=>{
      const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!active)return;
      navLinks.forEach(link=>{
        const isActive=link.getAttribute('href')==='#'+active.target.id;
        link.classList.toggle('active',isActive);
        if(isActive) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-32% 0px -58% 0px',threshold:[.01,.2]});
    sections.forEach(s=>spy.observe(s));
  }

  const screens={
    calendar:{src:'/assets/mesai-calendar.webp',alt:'Mesai Pro Mesailerim ekranı',kicker:'01 / GÜNLÜK TAKİP',title:'Ayı tek bakışta oku.',text:'Gün seçimi, maaş dönemi özeti ve günlük kayıt aksiyonları aynı akışta. Mesai, izin/rapor ve gün etkisi takvim bağlamından kopmadan yönetiliyor.'},
    reports:{src:'/assets/mesai-reports.webp',alt:'Mesai Pro Raporlar ekranı',kicker:'02 / RAPORLAMA',title:'Dönemi sayıya dönüştür.',text:'Aylık, yıllık ve özel aralık raporları; tahmini toplam, mesai süresi, ek kazanç, kesinti ve gerçek ödeme karşılaştırmasını tek yerde topluyor.'},
    settings:{src:'/assets/mesai-settings.webp',alt:'Mesai Pro Ayarlar ekranı',kicker:'03 / KURAL SETİ',title:'Hesabı kendi çalışma düzenine uyarla.',text:'Ücret ve maaş, çalışma düzeni, mesai katsayıları, izin/rapor, yedekleme ve uygulama tercihleri ayrı ama tutarlı ayar gruplarıyla yönetiliyor.'}
  };
  const tabs=[...document.querySelectorAll('[data-screen]')];
  const image=document.querySelector('[data-screen-image]');
  const panel=document.querySelector('#m-screen-panel');
  const kicker=document.querySelector('[data-screen-kicker]');
  const title=document.querySelector('[data-screen-title]');
  const text=document.querySelector('[data-screen-text]');

  const activate=(btn,{focus=false}={})=>{
    const screen=screens[btn?.dataset.screen]; if(!screen||!image)return;
    tabs.forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    panel?.setAttribute('aria-labelledby',btn.id);
    image.classList.add('is-switching');
    window.setTimeout(()=>{image.src=screen.src;image.alt=screen.alt;kicker.textContent=screen.kicker;title.textContent=screen.title;text.textContent=screen.text;image.classList.remove('is-switching');},reduced?0:120);
    if(focus) btn.focus();
  };
  tabs.forEach((btn,index)=>{
    btn.addEventListener('click',()=>activate(btn));
    btn.addEventListener('keydown',event=>{
      let next=null;
      if(event.key==='ArrowRight') next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft') next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home') next=0;
      if(event.key==='End') next=tabs.length-1;
      if(next===null)return;
      event.preventDefault(); activate(tabs[next],{focus:true});
    });
  });

  document.querySelectorAll('.m-faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if(!detail.open)return;
    document.querySelectorAll('.m-faq-list details[open]').forEach(other=>{if(other!==detail)other.open=false;});
  }));

  const stage=document.querySelector('[data-device-stage]');
  if(stage&&!reduced&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;const main=stage.querySelector('.m-phone-main');if(main)main.style.transform=`translateY(7px) rotate(${-1+x*1.8}deg) rotateX(${-y*2.5}deg) rotateY(${x*3.2}deg)`;});
    stage.addEventListener('pointerleave',()=>{const main=stage.querySelector('.m-phone-main');if(main)main.style.transform='translateY(7px) rotate(-1deg)';});
  }
})();