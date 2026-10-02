(() => {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuBtn = document.querySelector('[data-menu-btn]');

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 16);
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menu && menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  reveals.forEach((el) => observer.observe(el));

  const navLinks = [...document.querySelectorAll('.site-menu a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + visible.target.id);
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.01, 0.2, 0.5] });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const installDock = document.querySelector('[data-mobile-install]');
  const footer = document.querySelector('.site-footer');
  const syncInstallDock = () => {
    if (!installDock) return;
    const show = window.scrollY > 500;
    const nearFooter = footer
      ? footer.getBoundingClientRect().top < window.innerHeight + 60
      : false;
    installDock.classList.toggle('visible', show && !nearFooter);
  };

  syncInstallDock();
  window.addEventListener('scroll', syncInstallDock, { passive: true });

  const phone = document.querySelector('.phone');
  const phoneWrap = document.querySelector('.hero-device-wrap');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (phone && phoneWrap && !reducedMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    phoneWrap.addEventListener('pointermove', (event) => {
      const rect = phoneWrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      phone.style.transform = `rotate(${2.4 + x * 2.1}deg) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(${y * 3}px)`;
    });
    phoneWrap.addEventListener('pointerleave', () => {
      phone.style.transform = 'rotate(2.4deg)';
    });
  }

  document.querySelectorAll('.faq-list details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });
})();