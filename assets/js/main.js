(function () {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      body.classList.toggle('menu-open');
      const isOpen = body.classList.contains('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => body.classList.remove('menu-open'));
    const href = link.getAttribute('href');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;
      item.classList.toggle('open');
    });
  });

  const modal = document.querySelector('.modal');
  const modalImg = modal ? modal.querySelector('img') : null;
  const modalClose = modal ? modal.querySelector('.modal-close') : null;

  document.querySelectorAll('.gallery-item').forEach((button) => {
    button.addEventListener('click', () => {
      const img = button.querySelector('img');
      if (!modal || !modalImg || !img) return;
      modalImg.src = img.src;
      modalImg.alt = img.alt || 'Bella Grooming galerija';
      modal.classList.add('open');
      body.style.overflow = 'hidden';
    });
  });
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    body.style.overflow = '';
  };
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = form.querySelector('.form-message');
      if (message) {
        message.classList.add('show');
        message.textContent = 'Hvala! Ovo je demo forma. Na pravoj stranici upit možemo povezati s e-mailom, WhatsAppom ili CRM sustavom.';
      }
      form.reset();
    });
  }
})();
