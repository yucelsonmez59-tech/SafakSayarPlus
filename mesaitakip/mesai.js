(() => {
  const header=document.querySelector('[data-m-header]');
  const menu=document.querySelector('[data-m-menu]');
  const menuBtn=document.querySelector('[data-m-menu-btn]');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>12);
  syncHeader(); window.addEventListener('scroll',syncHeader,{passive:true});

  if(menu&&menuBtn){
    menuBtn.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}));
  }

  const reveals=document.querySelectorAll('.m-reveal');
  if(reduced||!('IntersectionObserver' in window)) reveals.forEach(el=>el.classList.add('visible'));
  else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -30px'});
    reveals.forEach(el=>observer.observe(el));
  }

  const screens={
    calendar:{src:'/assets/mesai-calendar.webp',alt:'Mesai Pro Mesailerim ekranı',kicker:'01 / GÜNLÜK TAKİP',title:'Ayı tek bakışta oku.',text:'Gün seçimi, maaş dönemi özeti ve günlük kayıt aksiyonları aynı akışta. Mesai, izin/rapor ve gün etkisi takvim bağlamından kopmadan yönetiliyor.'},
    reports:{src:'/assets/mesai-reports.webp',alt:'Mesai Pro Raporlar ekranı',kicker:'02 / RAPORLAMA',title:'Dönemi sayıya dönüştür.',text:'Aylık, yıllık ve özel aralık raporları; tahmini toplam, mesai süresi, ek kazanç, kesinti ve gerçek ödeme karşılaştırmasını tek yerde topluyor.'},
    settings:{src:'/assets/mesai-settings.webp',alt:'Mesai Pro Ayarlar ekranı',kicker:'03 / KURAL SETİ',title:'Hesabı kendi çalışma düzenine uyarla.',text:'Ücret ve maaş, çalışma düzeni, mesai katsayıları, izin/rapor, yedekleme ve uygulama tercihleri ayrı ama tutarlı ayar gruplarıyla yönetiliyor.'}
  };
  const image=document.querySelector('[data-screen-image]');
  const kicker=document.querySelector('[data-screen-kicker]');
  const title=document.querySelector('[data-screen-title]');
  const text=document.querySelector('[data-screen-text]');
  document.querySelectorAll('[data-screen]').forEach(btn=>btn.addEventListener('click',()=>{
    const key=btn.dataset.screen,screen=screens[key]; if(!screen||!image)return;
    document.querySelectorAll('[data-screen]').forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-selected',String(active));});
    image.classList.add('is-switching');
    setTimeout(()=>{image.src=screen.src;image.alt=screen.alt;kicker.textContent=screen.kicker;title.textContent=screen.title;text.textContent=screen.text;image.classList.remove('is-switching');},reduced?0:120);
  }));

  const stage=document.querySelector('[data-device-stage]');
  if(stage&&!reduced&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;stage.style.setProperty('--mx',x.toFixed(3));stage.style.setProperty('--my',y.toFixed(3));const main=stage.querySelector('.m-phone-main');if(main)main.style.transform=`translateY(7px) rotate(${-1+x*1.8}deg) rotateX(${-y*2.5}deg) rotateY(${x*3.2}deg)`;});
    stage.addEventListener('pointerleave',()=>{const main=stage.querySelector('.m-phone-main');if(main)main.style.transform='translateY(7px) rotate(-1deg)';});
  }
})();