  const menuBtn = document.getElementById('menuBtn');
  const navlinks = document.getElementById('navlinks');
  menuBtn.addEventListener('click', () => {
    const open = navlinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navlinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  }));

  // Theme toggle (persisted)
  const themeBtn = document.getElementById('themeBtn');
  const root = document.documentElement;
  const applyTheme = (mode) => {
    const theme = mode === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  try {
    applyTheme(localStorage.getItem('khudair-theme') || 'light');
  } catch(e) { applyTheme('light'); }
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('khudair-theme', next); } catch(e) {}
  });

  // Reveal-on-scroll (one orchestrated fade per section, not per card)
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Contact form: client-side validation, ready for an email service
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '');
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!form.checkValidity() || !validEmail) {
      formNote.textContent = 'Please fill every field with a valid email.';
      formNote.className = 'form-note error';
      return;
    }
    // No email backend is connected yet — wire this up to a service such as
    // Formspree, EmailJS, or your own endpoint, then send `data` there.
    formNote.textContent = 'Thanks! This form needs an email service connected to actually deliver messages — for now, please email me directly.';
    formNote.className = 'form-note success';
    form.reset();
  });
