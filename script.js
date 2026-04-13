/* =============================================
   Paige Simm — Portfolio JS
   Effects: custom cursor, magnetic buttons,
   card tilt, text scramble, page transitions,
   scroll progress, smooth scroll
   ============================================= */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

/* ── Page transition overlay ── */
const overlay = document.createElement('div');
overlay.id = 'page-overlay';
overlay.style.cssText = `
  position:fixed;inset:0;background:var(--black);
  z-index:9000;pointer-events:none;
  opacity:0;transition:opacity 0.4s ease;
`;
document.body.appendChild(overlay);

window.addEventListener('load', () => {
  overlay.style.opacity = '0';
  document.body.style.overflow = '';
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('http') && href.endsWith('.html')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
      setTimeout(() => window.location.href = href, 420);
    });
  }
});

/* ── Custom cursor ── */
const cursorDot = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.id = 'cdot';
cursorRing.id = 'cring';
cursorDot.style.cssText = `position:fixed;width:8px;height:8px;background:var(--black);border-radius:50%;pointer-events:none;z-index:8999;transform:translate(-50%,-50%);transition:background 0.2s,transform 0.15s;top:0;left:0;`;
cursorRing.style.cssText = `position:fixed;width:38px;height:38px;border:1.5px solid var(--black);border-radius:50%;pointer-events:none;z-index:8998;transform:translate(-50%,-50%);top:0;left:0;transition:width 0.3s,height 0.3s,border-color 0.3s,opacity 0.3s;opacity:0;`;
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursorDot.style.left = mx+'px'; cursorDot.style.top = my+'px'; cursorRing.style.opacity = '1'; });

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
})();

const hoverEls = document.querySelectorAll('a, button, .pcard, .skill-tag, .exp-item');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorDot.style.background = 'var(--accent)';
    cursorRing.style.width = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.borderColor = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorDot.style.background = 'var(--black)';
    cursorRing.style.width = '38px';
    cursorRing.style.height = '38px';
    cursorRing.style.borderColor = 'var(--black)';
  });
});
document.body.style.cursor = 'none';

/* ── Nav scroll ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

/* ── Scroll progress bar ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `position:fixed;top:0;left:0;height:2px;background:var(--accent);z-index:8997;transition:width 0.1s linear;width:0%;`;
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
});

/* ── Text scramble on hero name ── */
function scramble(el, finalText, duration = 1000) {
  let start = null;
  const chars = CHARS;
  function frame(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const revealCount = Math.floor(progress * finalText.length);
    let output = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ' || finalText[i] === '.') { output += finalText[i]; continue; }
      if (i < revealCount) { output += finalText[i]; }
      else { output += chars[Math.floor(Math.random() * chars.length)]; }
    }
    el.textContent = output;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = finalText;
  }
  requestAnimationFrame(frame);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const line1 = document.querySelector('.hero-name-line:nth-child(1)');
    const line2 = document.querySelector('.hero-name-line:nth-child(2)');
    if (line1) scramble(line1, 'Paige', 800);
    if (line2) setTimeout(() => scramble(line2, 'Simm.', 900), 200);
  }, 300);
});

/* ── Card tilt on hover ── */
document.querySelectorAll('.pcard--wide').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) scale(1.01)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    card.style.transition = 'transform 0.5s ease';
  });
});

/* ── Magnetic buttons on contact links ── */
document.querySelectorAll('.contact-link').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.15s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.4s ease';
  });
});

/* ── Skill tags stagger in ── */
const skillTags = document.querySelectorAll('.skill-tag');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillTags.forEach((tag, i) => {
        setTimeout(() => {
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        }, i * 40);
      });
      skillObs.disconnect();
    }
  });
}, { threshold: 0.2 });
skillTags.forEach(tag => {
  tag.style.opacity = '0';
  tag.style.transform = 'translateY(10px)';
  tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});
if (skillTags.length) skillObs.observe(skillTags[0]);

/* ── Section fade-ins ── */
const fadeEls = document.querySelectorAll('#about .about-left, #about .about-body, #work .work-header, .pcard, #experience .exp-heading-col, .exp-item, #contact .contact-left, #contact .contact-right');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 60);
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  fadeObs.observe(el);
});
setTimeout(() => fadeEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }), 2000);

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
