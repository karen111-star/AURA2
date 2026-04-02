/* ===========================
   AURA SPA — Main JS
   Mejorado con funcionalidades completas
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header scroll effect ───────────────────────────
  const header = document.querySelector('header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // Agregar clase scrolled
    header.classList.toggle('scrolled', scrollTop > 40);
    
    // Opcional: Hide header on scroll down, show on scroll up
    if (scrollTop > lastScrollTop + 100) {
      // Scrolling DOWN
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling UP
      header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  }, { passive: true });


  // ─── Mobile nav toggle ──────────────────────────────
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('header')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }


  // ─── Scroll reveal animations ────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });

  // Observar todos los elementos con clase reveal
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  // ─── FAQ accordion ────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all items
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });


  // ─── Form submit (demo) ─────────────────────────────
  const form = document.querySelector('.reserva-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const original = btn.textContent;
      
      // Simulate sending
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      
      setTimeout(() => {
        btn.textContent = '✓ Reserva confirma';
        btn.style.background = '#6B7C52';
        btn.style.color = '#FDFCF9';
        
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
          form.reset();
        }, 2000);
      }, 800);
    });
  }


  // ─── Animated counter for statistics ─────────────────
  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const targetNum = parseInt(match[1], 10);
    const duration = 1600;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetNum);
      
      // Preservar el resto del texto (%, +, etc)
      const prefix = text.substring(0, text.indexOf(match[1]));
      const suffix = text.substring(text.indexOf(match[1]) + match[1].length);
      
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  // Observar estadísticas cuando sea visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statsContainer = entry.target;
        statsContainer.querySelectorAll('.stat strong').forEach(el => {
          animateCounter(el);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hero-stats').forEach(el => statsObserver.observe(el));


  // ─── Smooth scroll para links internos ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target === '#') return;
      
      const element = document.querySelector(target);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── Performance: Load images lazily ──────────────────
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
  }

});