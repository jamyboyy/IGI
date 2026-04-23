// ============================================
// IGI — shared interactions
// ============================================
(function(){
  // --- Nav scroll state
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile menu toggle
  const toggle = document.querySelector('.nav__toggle');
  const mobile = document.querySelector('.nav__mobile');
  if (toggle && mobile) {
    const close = () => {
      toggle.classList.remove('is-open');
      mobile.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };
    toggle.addEventListener('click', () => {
      const open = !toggle.classList.contains('is-open');
      toggle.classList.toggle('is-open', open);
      mobile.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
  }

  // --- Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  // --- Counter animation
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const dur = 1800;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = target * easeOut(t);
        el.textContent = v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = (target % 1 === 0 ? target.toString() : target.toFixed(decimals));
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  // --- Parallax
  const parEls = document.querySelectorAll('[data-parallax]');
  if (parEls.length) {
    const onP = () => {
      parEls.forEach(el => {
        const rate = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height/2 - window.innerHeight/2) * rate;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };
    window.addEventListener('scroll', onP, { passive: true });
    onP();
  }

  // --- Testimonial carousel
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.quotes__track');
    const slides = track.children.length;
    const dotsWrap = carousel.querySelector('.quotes__dots');
    let idx = 0;
    let timer;
    const dots = [];
    for (let i = 0; i < slides; i++) {
      const b = document.createElement('button');
      b.className = 'quotes__dot';
      b.setAttribute('aria-label', `Testimonial ${i+1}`);
      b.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(b);
      dots.push(b);
    }
    const go = (i, manual) => {
      idx = (i + slides) % slides;
      track.style.transform = `translateX(-${idx*100}%)`;
      dots.forEach((d,j) => d.classList.toggle('is-active', j === idx));
      if (manual) restart();
    };
    carousel.querySelector('[data-prev]').addEventListener('click', () => go(idx-1, true));
    carousel.querySelector('[data-next]').addEventListener('click', () => go(idx+1, true));
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(idx+1), 6500);
    };
    go(0);
    restart();
  }

  // --- Product tabs
  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const btns = tabs.querySelectorAll('.prod-tab');
    const panels = document.querySelectorAll('[data-tab-panel]');
    btns.forEach(b => {
      b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('is-active'));
        b.classList.add('is-active');
        const key = b.getAttribute('data-tab');
        panels.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === key));
      });
    });
  });
})();
