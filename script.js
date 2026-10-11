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

  // Contact form: sends through Formspree (free). Paste your form URL below.
  const FORM_ENDPOINT = 'https://formspree.io/f/xkjozvln';
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const setNote = (msg, type) => { formNote.textContent = msg; formNote.className = 'form-note ' + type; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '');
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!form.checkValidity() || !validEmail) {
      setNote('Please fill every field with a valid email.', 'error');
      return;
    }
    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      setNote('The form is not connected yet. Please email me directly at abdelrahmanq57@gmail.com.', 'error');
      return;
    }
    setNote('Sending...', '');
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
      if (res.ok) { setNote('Thanks! Your message was sent.', 'success'); form.reset(); }
      else { setNote('Something went wrong. Please email me directly.', 'error'); }
    } catch (err) {
      setNote('Network error. Please email me directly.', 'error');
    }
  });
