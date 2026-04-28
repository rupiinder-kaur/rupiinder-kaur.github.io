(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const root = document.documentElement;
  const savedTheme = localStorage.getItem('rk-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const themeBtn = $('#themeToggle');
  const syncThemeIcon = () => {
    if (!themeBtn) return;
    const light = root.getAttribute('data-theme') === 'light';
    themeBtn.innerHTML = light
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  };
  syncThemeIcon();
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('rk-theme', next);
      syncThemeIcon();
    });
  }

  const menuBtn  = $('#menuBtn');
  const navLinks = $('#navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
  }

  const navbar = $('#navbar');
  const toTop  = $('#toTop');
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 8);
    if (toTop)  toTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const typed = $('#typed');
  const phrases = [
    'Researcher \u00b7 IIT Ropar',
    'PhD Scholar',
    'Machine Learning Enthusiast',
    'Data Science Practitioner',
    'Educator & Mentor'
  ];
  if (typed && !prefersReduced) {
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = phrases[pi];
      typed.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(tick, 60); }
      else if (deleting && ci > 0)       { ci--; setTimeout(tick, 30); }
      else {
        deleting = !deleting;
        if (!deleting) pi = (pi + 1) % phrases.length;
        setTimeout(tick, deleting ? 1400 : 300);
      }
    };
    tick();
  } else if (typed) {
    typed.textContent = phrases[0];
  }

  const revealTargets = $$('[data-animate]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const el = e.target;
          const delay = el.dataset.delay || 0;
          setTimeout(() => el.classList.add('in-view'), delay);
          io.unobserve(el);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(t => io.observe(t));
  } else {
    revealTargets.forEach(t => t.classList.add('in-view'));
  }

  const stats = $$('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = +el.dataset.count;
    const dur = 1200; const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + '+';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (stats.length) {
    if ('IntersectionObserver' in window && !prefersReduced) {
      const so = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { animateCount(e.target); so.unobserve(e.target); }
        }
      }, { threshold: 0.5 });
      stats.forEach(s => so.observe(s));
    } else {
      stats.forEach(s => s.textContent = s.dataset.count + '+');
    }
  }

  const filterBtns = $$('.chip-btn');
  const pubItems   = $$('.pub-item');
  if (filterBtns.length && pubItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const f = btn.dataset.filter;
        pubItems.forEach(item => {
          const match = f === 'all' || item.dataset.type === f;
          item.classList.toggle('hidden', !match);
        });
      });
    });
  }

  $$('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - r.left}px`);
      card.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  });

  window.handleContactSubmit = (e) => {
    const note = $('#formNote');
    if (note) {
      note.hidden = false;
      note.className = 'form-note ok';
      note.textContent = "Thanks! Your message is on its way \u2014 you'll hear back soon.";
    }
    return true;
  };
})();
