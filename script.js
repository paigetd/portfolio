// ── Nav: add .scrolled class on scroll ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll reveals ──
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// ── Fallback: show all reveals after 2s in case observer doesn't fire ──
setTimeout(() => {
  reveals.forEach(el => el.classList.add('visible'));
}, 2000);
