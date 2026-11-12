/* ============================================================
   DIMAS RAMADAN PUTRA — PORTFOLIO SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // ---- DOM refs ----
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const reveals   = document.querySelectorAll('.reveal');
  const statNums  = document.querySelectorAll('.stat-number[data-count]');

  // ---- Mobile overlay ----
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // ============================================================
  // NAVBAR — scroll styling
  // ============================================================
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ============================================================
  // NAVBAR — active link tracking
  // ============================================================
  function highlightNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach((sec) => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================
  function openMenu() {
    navToggle.classList.add('open');
    navMenu.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // ============================================================
  // REVEAL ON SCROLL (Intersection Observer)
  // ============================================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // STAT COUNTER ANIMATION
  // ============================================================
  let statsCounted = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statNums.forEach((el) => {
      const target   = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1500;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // ============================================================
  // SMOOTH SCROLL for all anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // INTERACTIVE CARD TILT (subtle, on desktop only)
  // ============================================================
  if (window.matchMedia('(hover: hover)').matches) {
    const tiltCards = document.querySelectorAll('.project-card, .cert-card');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const cx   = rect.width / 2;
        const cy   = rect.height / 2;

        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ============================================================
  // TYPING CURSOR BLINK on hero badge (optional flourish)
  // ============================================================
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = `
      display: inline-block;
      margin-left: 2px;
      animation: blink 1s step-end infinite;
      color: var(--accent-light);
      font-weight: 300;
    `;
    // Add blink keyframes
    const style = document.createElement('style');
    style.textContent = `@keyframes blink { 50% { opacity: 0; } }`;
    document.head.appendChild(style);
  }
});
