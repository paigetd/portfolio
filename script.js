

// ── Page transitions ──
const overlay = document.createElement('div');
overlay.style.cssText = 'position:fixed;inset:0;background:#0e0d0b;z-index:9000;pointer-events:none;opacity:0;transition:opacity 0.4s ease;';
document.body.appendChild(overlay);

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  if (!href.endsWith('.html')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 420);
  });
});

// ── Nav frost on scroll ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Scroll progress bar ──
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#c8a96e;z-index:9001;width:0;pointer-events:none;transition:width 0.1s linear;';
document.body.appendChild(bar);
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
}, { passive: true });

// ── Text scramble on hero name ──
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function scramble(el, finalText, duration) {
  let startTime = null;
  function frame(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const revealUpTo = Math.floor(progress * finalText.length);
    let result = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === '.' || finalText[i] === ' ') {
        result += finalText[i];
      } else if (i < revealUpTo) {
        result += finalText[i];
      } else {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    el.textContent = result;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = finalText;
  }
  requestAnimationFrame(frame);
}

// Run scramble after CSS animations have had time to complete
setTimeout(() => {
  const l1 = document.querySelector('.hero-name-line:first-child');
  const l2 = document.querySelector('.hero-name-line:last-child');
  if (l1) scramble(l1, 'Paige', 700);
  if (l2) setTimeout(() => scramble(l2, 'Simm.', 800), 250);
}, 900);

// ── Card tilt (3D rotation on mouse move) ──
document.querySelectorAll('.wcard--full, .wcard--half').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -4;
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.015)`;
    card.style.transition = 'transform 0.1s ease';
    card.style.zIndex = '2';
    card.style.position = 'relative';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    card.style.transition = 'transform 0.5s ease';
    card.style.zIndex = '';
  });
});

// ── Magnetic contact links (drift toward cursor) ──
document.querySelectorAll('.contact-link').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.18;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.transition = 'transform 0.12s ease';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.5s ease';
  });
});

// ── Skill tag stagger ──
const tags = [...document.querySelectorAll('.skill-tag')];
if (tags.length) {
  tags.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(8px)';
    t.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  const tagObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      tags.forEach((t, i) => {
        setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'none'; }, i * 40);
      });
      tagObs.disconnect();
    }
  }, { threshold: 0.2 });
  tagObs.observe(document.querySelector('#about') || tags[0]);
}

// ── Section fade-ins ──
// Note: using .wcard not .pcard (old class name)
const fadeSelectors = [
  '#about .about-left',
  '#about .about-body',
  '#work .work-header',
  '.wcard',
  '#experience .exp-heading-col',
  '.exp-item',
  '#contact .contact-left',
  '#contact .contact-right'
];

const fadeEls = document.querySelectorAll(fadeSelectors.join(','));
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});

const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

fadeEls.forEach(el => fadeObs.observe(el));

// Fallback: show everything after 2.5s no matter what
setTimeout(() => {
  fadeEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}, 2500);

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
