// MomoStack Hyper-Dynamic Interactions & Engine

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initMobileMenu();
  initInteractivePhone();
  initLinkSimulator();
  initNumberCounters();
  initSpotlight();
  initCopyButtons();
  initMascotSelector();
  highlightActiveNav();
});

// 1. Lenis Smooth Scroll
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

// 2. Mobile Menu
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

// 3. Interactive Hero Phone Mockup & Tab Switcher
function initInteractivePhone() {
  const tabBtns = document.querySelectorAll('.phone-tab-btn');
  const screenImg = document.getElementById('heroPhoneScreen');
  const frame = document.querySelector('.phone-device-frame');

  const screens = {
    feed: {
      img: 'assets/screenshots/01_home_capture.png',
      glow: 'rgba(99, 102, 241, 0.4)'
    },
    ocr: {
      img: 'assets/screenshots/03_screenshot_vault.png',
      glow: 'rgba(244, 63, 94, 0.4)'
    },
    notes: {
      img: 'assets/screenshots/04_notes_page.png',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    pdf: {
      img: 'assets/screenshots/02_link_detail.png',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    vaults: {
      img: 'assets/screenshots/06_categories_vault.png',
      glow: 'rgba(6, 182, 212, 0.4)'
    }
  };

  const isSubpage = window.location.pathname.includes('/features') ||
    window.location.pathname.includes('/privacy') ||
    window.location.pathname.includes('/docs') ||
    window.location.pathname.includes('/download') ||
    window.location.pathname.includes('/about');
  const pathPrefix = isSubpage ? '../' : '';

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const screenKey = btn.getAttribute('data-screen');
      const target = screens[screenKey];
      if (target && screenImg) {
        screenImg.style.opacity = '0';
        screenImg.style.transform = 'scale(0.96)';
        
        setTimeout(() => {
          screenImg.src = pathPrefix + target.img;
          screenImg.style.opacity = '1';
          screenImg.style.transform = 'scale(1)';
          if (frame) {
            frame.style.boxShadow = `0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 60px -5px ${target.glow}`;
          }
        }, 180);
      }
    });
  });

  // 3D Perspective Tilt on Mouse Movement
  if (frame) {
    const parent = frame.parentElement;
    parent.addEventListener('mousemove', (e) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -12;
      const tiltY = (x / rect.width) * 12;
      frame.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    parent.addEventListener('mouseleave', () => {
      frame.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }
}

// 4. Interactive Live Link Sanitizer & Vault Simulator
function initLinkSimulator() {
  const runBtn = document.getElementById('simRunBtn');
  const inputEl = document.getElementById('simInput');
  const sampleBtns = document.querySelectorAll('.sim-sample-pill');
  const resultCard = document.getElementById('simResult');
  const progressWrap = document.getElementById('simProgress');
  const progressBar = document.getElementById('simProgressBar');

  const samples = {
    twitter: {
      raw: 'https://twitter.com/sama/status/178942?utm_source=feed&utm_medium=android&fbclid=IwAR29f...',
      clean: 'https://twitter.com/sama/status/178942',
      title: 'OpenAI DevDay Keynote Announcements',
      domain: 'x.com',
      tag: 'AI & Machine Learning',
      readTime: '2 min read'
    },
    youtube: {
      raw: 'https://youtube.com/watch?v=k9zTr2P&si=AB73n8s92&feature=share',
      clean: 'https://youtube.com/watch?v=k9zTr2P',
      title: 'John Carmack: Principles of Low-Latency Systems',
      domain: 'youtube.com',
      tag: 'Computer Systems',
      readTime: '45 min watch'
    },
    reddit: {
      raw: 'https://reddit.com/r/androiddev/comments/18x9/offline_sqlite?utm_campaign=share&utm_content=post',
      clean: 'https://reddit.com/r/androiddev/comments/18x9/offline_sqlite',
      title: 'Architecting 100% Offline Android Apps with Room',
      domain: 'reddit.com',
      tag: 'Mobile Dev',
      readTime: '6 min read'
    }
  };

  sampleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sampleBtns.forEach((b) => b.classList.remove('accent'));
      btn.classList.add('accent');
      const key = btn.getAttribute('data-sim');
      if (samples[key] && inputEl) {
        inputEl.value = samples[key].raw;
      }
    });
  });

  if (runBtn && inputEl && resultCard) {
    runBtn.addEventListener('click', () => {
      const val = inputEl.value.trim();
      if (!val) {
        showToast('Please enter or select a URL');
        return;
      }

      runBtn.disabled = true;
      runBtn.innerText = 'Sanitizing...';
      if (progressWrap) progressWrap.style.display = 'block';
      if (progressBar) progressBar.style.width = '20%';
      resultCard.style.display = 'none';

      setTimeout(() => {
        if (progressBar) progressBar.style.width = '70%';
      }, 250);

      setTimeout(() => {
        if (progressBar) progressBar.style.width = '100%';
      }, 500);

      setTimeout(() => {
        if (progressWrap) progressWrap.style.display = 'none';
        runBtn.disabled = false;
        runBtn.innerText = 'Sanitize & Stack';

        // Clean URL by stripping UTM & tracker params
        let cleanUrl = val;
        try {
          const parsed = new URL(val);
          const params = new URLSearchParams(parsed.search);
          ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'si', 'ref_src'].forEach((p) => params.delete(p));
          parsed.search = params.toString();
          cleanUrl = parsed.toString().replace(/\?$/, '');
        } catch (e) {
          cleanUrl = val.split('?')[0];
        }

        // Render Clean Card
        resultCard.innerHTML = `
          <div style="background: rgba(10, 14, 24, 0.95); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 18px; padding: 22px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
              <span class="glass-pill accent" style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: #6EE7B7; border-color: rgba(16, 185, 129, 0.4);">
                ✓ 3 Trackers Stripped · Persisted to SQLite
              </span>
              <span style="font-size: 0.8rem; color: var(--text-dim); font-family: var(--font-mono);">0.08ms</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
              Sanitized Link Saved to Vault
            </h4>
            <div style="background: rgba(0,0,0,0.4); border-radius: 10px; padding: 10px 14px; font-family: var(--font-mono); font-size: 0.8rem; color: #818CF8; word-break: break-all; margin-bottom: 14px;">
              ${cleanUrl}
            </div>
            <div style="display: flex; gap: 10px; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
              <span>📁 Category: Auto-Vault</span>
              <span>•</span>
              <span>🔒 Zero Cloud Telemetry</span>
            </div>
          </div>
        `;
        resultCard.style.display = 'block';
        showToast('Link cleaned & stacked in offline vault!');
      }, 750);
    });
  }
}

// 5. Stat Counter Animation
function initNumberCounters() {
  const statElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-counter'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const increment = Math.ceil(targetNum / 30);
          const timer = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
              current = targetNum;
              clearInterval(timer);
            }
            el.innerText = `${current}${suffix}`;
          }, 35);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statElements.forEach((el) => observer.observe(el));
  }
}

// 6. Spotlight Effect
function initSpotlight() {
  const cards = document.querySelectorAll('.spotlight-card, .bento-item, .glass-panel, .stat-item');
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

// 7. Copy Buttons
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// 8. Active Nav Link Detection
function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach((link) => {
    const href = link.getAttribute('href').toLowerCase();
    if (
      (href === './' || href === '/' || href === 'index.html' || href.endsWith('momostack/')) &&
      (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath.endsWith('momostack')) &&
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

// 9. Interactive Mascot Mood Selector
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
