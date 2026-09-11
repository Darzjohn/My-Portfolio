// Respect the user's motion preference throughout.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Hero entrance sequence -------------------------------------------------
// One orchestrated reveal on load: tag, title, sub-copy, then contact line.
function playHeroEntrance() {
  const heroItems = document.querySelectorAll('.hero-anim');
  heroItems.forEach((el, i) => {
    if (prefersReducedMotion) {
      el.classList.add('is-visible');
      return;
    }
    setTimeout(() => el.classList.add('is-visible'), 120 + i * 140);
  });
}

// --- Scroll reveal for sections, cards, and panels --------------------------
function setupScrollReveal() {
  const targets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el, i) => {
    // Stagger cards that share a parent (e.g. timeline entries, skill panels).
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    observer.observe(el);
  });
}

// --- Subtle cursor-reactive glow --------------------------------------------
// The two ambient glows drift gently toward the pointer. Desktop only,
// and skipped entirely for reduced-motion users.
function setupGlowParallax() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glowA = document.querySelector('.glow-a');
  const glowB = document.querySelector('.glow-b');
  if (!glowA || !glowB) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('pointermove', (e) => {
    const xRatio = e.clientX / window.innerWidth - 0.5;
    const yRatio = e.clientY / window.innerHeight - 0.5;
    targetX = xRatio * 60;
    targetY = yRatio * 60;
  });

  function tick() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;
    glowA.style.transform = `translate(${currentX}px, ${currentY}px)`;
    glowB.style.transform = `translate(${-currentX}px, ${-currentY}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {
  playHeroEntrance();
  setupScrollReveal();
  setupGlowParallax();
  setupProjectPanel();
});

// --- Click-a-language, see-its-projects panel -------------------------------
// Placeholder project entries — replace the title/description text for each
// language with your own projects. Each entry just needs a title and a
// short description.
const projectsByLanguage = {
  Python: [
    { title: 'Add a Python project', description: 'Describe what you built, what it does, and the outcome.' },
  ],
  PHP: [
    { title: 'Add a PHP project', description: 'Describe what you built, what it does, and the outcome.' },
  ],
  'C#': [
    { title: 'Add a C# project', description: 'Describe what you built, what it does, and the outcome.' },
  ],
  Java: [
    { title: 'Add a Java project', description: 'Describe what you built, what it does, and the outcome.' },
  ],
  JavaScript: [
    { title: 'Add a JavaScript project', description: 'Describe what you built, what it does, and the outcome.' },
  ],
  CSS: [
    { title: 'Add a CSS project', description: 'Describe what you built, what it does, and the outcome.' },
  ],
};

function setupProjectPanel() {
  const buttons = document.querySelectorAll('.lang-tag');
  const panel = document.getElementById('project-panel');
  const panelTitle = document.getElementById('project-panel-title');
  const panelBody = document.getElementById('project-panel-body');
  const closeBtn = document.getElementById('project-panel-close');
  if (!buttons.length || !panel) return;

  function renderProjects(lang) {
    const projects = projectsByLanguage[lang] || [];
    panelTitle.textContent = `${lang} projects`;
    panelBody.innerHTML = '';

    if (projects.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'placeholder-note';
      empty.textContent = 'No projects added for this language yet.';
      panelBody.appendChild(empty);
      return;
    }

    projects.forEach((project) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      const h5 = document.createElement('h5');
      h5.textContent = project.title;
      const p = document.createElement('p');
      p.textContent = project.description;
      card.appendChild(h5);
      card.appendChild(p);
      panelBody.appendChild(card);
    });
  }

  function openPanel(lang) {
    renderProjects(lang);
    panel.hidden = false;
    // Scroll the panel into view on small screens so the reveal is visible.
    if (window.innerWidth < 720) {
      panel.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      const alreadyActive = btn.classList.contains('is-active');

      buttons.forEach((b) => b.classList.remove('is-active'));

      if (alreadyActive) {
        panel.hidden = true;
        return;
      }

      btn.classList.add('is-active');
      openPanel(lang);
    });
  });

  closeBtn.addEventListener('click', () => {
    panel.hidden = true;
    buttons.forEach((b) => b.classList.remove('is-active'));
  });
}