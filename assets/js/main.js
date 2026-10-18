// MomoStack Master Web Interactions & Lenis Engine

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  initSmoothScroll();

  // 2. Mobile Menu Toggle
  initMobileMenu();

  // 3. Spotlight Card Follower
  initSpotlight();

  // 4. One-Tap Copy with Toast Feedback
  initCopyButtons();

  // 5. Active Nav Link Detection
  highlightActiveNav();

  // 6. Interactive Mascot Mood Selector
  initMascotSelector();
});

function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -80 });
          }
        }
      });
    });
  }
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
        }
      });
    });
  }
}

function initSpotlight() {
  const cards = document.querySelectorAll('.spotlight-card, .bento-item, .glass-panel');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (targetText) {
        navigator.clipboard.writeText(targetText).then(() => {
          showToast('Copied to clipboard!');
          const orig = btn.innerText;
          btn.innerText = 'Copied!';
          setTimeout(() => {
            btn.innerText = orig;
          }, 2000);
        });
      }
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach((link) => {
    const href = link.getAttribute('href').toLowerCase();
    if (
      (href === './' || href === '/' || href === 'index.html') &&
      (currentPath.endsWith('/') || currentPath.endsWith('index.html')) &&
      !currentPath.includes('/features') &&
      !currentPath.includes('/privacy') &&
      !currentPath.includes('/docs') &&
      !currentPath.includes('/download') &&
      !currentPath.includes('/about')
    ) {
      link.classList.add('active');
    } else if (href.includes('features') && currentPath.includes('/features')) {
      link.classList.add('active');
    } else if (href.includes('privacy') && currentPath.includes('/privacy')) {
      link.classList.add('active');
    } else if (href.includes('docs') && currentPath.includes('/docs')) {
      link.classList.add('active');
    } else if (href.includes('download') && currentPath.includes('/download')) {
      link.classList.add('active');
    } else if (href.includes('about') && currentPath.includes('/about')) {
      link.classList.add('active');
    }
  });
}

function initMascotSelector() {
  const mascotDisplay = document.getElementById('mascotPreviewImg');
  const moodPills = document.querySelectorAll('[data-mascot-mood]');
  const moodDesc = document.getElementById('mascotMoodDesc');

  if (mascotDisplay && moodPills.length > 0) {
    const moods = {
      default: {
        src: 'assets/branding/momo_mascot_character.svg',
        desc: 'Porcelain dumpling body with plush pink-tinted ears, anime sparkle catchlights, and sweet warm smile.'
      },
      blink: {
        src: 'assets/branding/momo_mascot_blink.svg',
        desc: 'Peaceful curved arcs resting during idle states with gentle floating ambient bob.'
      },
      sassy: {
        src: 'assets/branding/momo_mascot_sassy_brow_up.svg',
        desc: 'Inquisitive raised eyebrow: "No Wi-Fi? No problem! Saved safely to offline vault."'
      },
      wink: {
        src: 'assets/branding/momo_mascot_wink.svg',
        desc: 'Flirty welcoming wink celebrating newly captured links and persisted bookmarks.'
      },
      focused: {
        src: 'assets/branding/momo_mascot_focused.svg',
        desc: 'Determined focus mode scanning images through on-device OCR transcription.'
      }
    };

    moodPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        moodPills.forEach((p) => p.classList.remove('active', 'accent'));
        pill.classList.add('active', 'accent');
        const moodKey = pill.getAttribute('data-mascot-mood');
        const moodData = moods[moodKey] || moods.default;

        // Path resolution for subpages
        const isSubpage = window.location.pathname.includes('/features') ||
          window.location.pathname.includes('/privacy') ||
          window.location.pathname.includes('/docs') ||
          window.location.pathname.includes('/download') ||
          window.location.pathname.includes('/about');
        
        const pathPrefix = isSubpage ? '../' : '';
        mascotDisplay.src = pathPrefix + moodData.src;
        if (moodDesc) {
          moodDesc.innerText = moodData.desc;
        }
      });
    });
  }
}
