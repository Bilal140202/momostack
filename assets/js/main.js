/* ============================================================
   MOMOSTACK — MOTION ENGINE
   Preloader · cursor · split-text · reveals · parallax ·
   magnetic · tilt · counters · simulator · FAQ · clock
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const isSubpage = /\/(features|privacy|docs|download|about)\//.test(window.location.pathname);
  const ASSET = isSubpage ? '../' : '';

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initSmoothScroll();
    initCursor();
    initScrollProgress();
    initSpotlight();
    initMagnetic();
    initPhoneLab();
    initSimulator();
    initCounters();
    initCopyButtons();
    initMascotSelector();
    initFaq();
    initFooterClock();
    initActiveNav();

    if (prefersReducedMotion) {
      // Reveal everything immediately, skip choreography
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
      document.querySelectorAll('.split-line').forEach((el) => el.classList.add('revealed'));
      initParallax(true);
    } else {
      runPreloader(() => {
        initSplitText();
        initReveals();
        initParallax(false);
      });
    }
  });

  /* ============================================================
     PRELOADER — counter + curtain lift
     ============================================================ */
  function runPreloader(onDone) {
    const preloader = document.getElementById('preloader');
    if (!preloader) { onDone(); return; }

    // Lock scroll during load
    document.documentElement.classList.add('lenis-stopped');

    const pctEl = document.getElementById('preloaderPct');
    const barEl = document.getElementById('preloaderBar');
    const DURATION = 1250;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);
      if (pctEl) pctEl.textContent = pct + '%';
      if (barEl) barEl.style.width = pct + '%';

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          preloader.classList.add('complete');
          document.documentElement.classList.remove('lenis-stopped');
          setTimeout(() => { preloader.style.display = 'none'; }, 1100);
          onDone();
        }, 180);
      }
    };
    requestAnimationFrame(tick);
  }

  /* ============================================================
     SPLIT TEXT — word-level stagger for hero headline
     ============================================================ */
  function initSplitText() {
    const lines = document.querySelectorAll('[data-split]');
    let globalIndex = 0;

    lines.forEach((line) => {
      const baseDelay = parseFloat(line.getAttribute('data-split-delay') || '0');
      const words = [];
      const nodes = Array.from(line.childNodes);

      // Rebuild: text nodes → word spans; element nodes → whole unit
      const frag = document.createDocumentFragment();
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
            } else {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = part;
              frag.appendChild(span);
              words.push(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.classList.add('word');
          frag.appendChild(node);
          words.push(node);
        }
      });
      line.textContent = '';
      line.appendChild(frag);

      // Per-word shimmer fallback (background-clip breaks on transformed children)
      if (line.classList.contains('text-shimmer')) {
        words.forEach((w) => w.classList.add('text-shimmer'));
      }

      words.forEach((w, i) => {
        w.style.transitionDelay = (baseDelay + i * 0.055).toFixed(3) + 's';
        globalIndex++;
      });

      // Trigger after paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => line.classList.add('revealed'));
      });
    });
  }

  /* ============================================================
     SCROLL REVEALS — IntersectionObserver
     ============================================================ */
  function initReveals() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach((el) => {
      const delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.setProperty('--reveal-delay', delay + 's');
      observer.observe(el);
    });
  }

  /* ============================================================
     LENIS SMOOTH SCROLL + anchor easing
     ============================================================ */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined' || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -96 });
          }
        }
      });
    });

    // Expose for menu lock
    window.__lenis = lenis;
  }

  /* ============================================================
     NAV — condensed on scroll, hide on scroll-down
     ============================================================ */
  function initNav() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);

      if (y > 420 && y > lastY + 6) {
        header.classList.add('hidden');
      } else if (y < lastY - 6 || y <= 420) {
        header.classList.remove('hidden');
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ============================================================
     MOBILE MENU — fullscreen overlay
     ============================================================ */
  function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    const iconOpen = '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    const iconClose = '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      toggle.innerHTML = open ? iconClose : iconOpen;

      // Staggered link entrances
      menu.querySelectorAll('a').forEach((a, i) => {
        a.style.transitionDelay = open ? (0.06 + i * 0.055) + 's' : '0s';
      });

      if (window.__lenis) {
        open ? window.__lenis.stop() : window.__lenis.start();
      } else {
        document.documentElement.style.overflow = open ? 'hidden' : '';
      }
    };

    toggle.addEventListener('click', () => {
      setMenu(!menu.classList.contains('open'));
    });

    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
  }

  /* ============================================================
     CUSTOM CURSOR — lerped dot + ring
     ============================================================ */
  function initCursor() {
    if (isTouch || prefersReducedMotion) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverables = 'a, button, input, .faq-question, .phone-tab-btn, .mood-pill, .sim-sample-pill';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) ring.classList.remove('is-hover');
    });
  }

  /* ============================================================
     SCROLL PROGRESS — top hairline
     ============================================================ */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${p})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ============================================================
     PARALLAX — ambient layers
     ============================================================ */
  function initParallax(disabled) {
    const layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length || disabled) return;

    let current = 0;
    let target = 0;

    window.addEventListener('scroll', () => {
      target = window.scrollY;
    }, { passive: true });

    const loop = () => {
      current += (target - current) * 0.08;
      layers.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.translate = `0 ${(current * speed).toFixed(2)}px`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  function initMagnetic() {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      let raf = null;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
        });
      });

      el.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  }

  /* ============================================================
     PHONE LAB — screen switcher + 3D tilt
     ============================================================ */
  function initPhoneLab() {
    const tabBtns = document.querySelectorAll('.phone-tab-btn');
    const screenImg = document.getElementById('heroPhoneScreen');
    const frame = document.getElementById('phoneFrame');

    const screens = {
      feed:   { img: 'assets/screenshots/01_home_capture.png',    glow: 'rgba(99, 102, 241, 0.4)' },
      ocr:    { img: 'assets/screenshots/03_screenshot_vault.png', glow: 'rgba(244, 63, 94, 0.4)' },
      notes:  { img: 'assets/screenshots/04_notes_page.png',       glow: 'rgba(16, 185, 129, 0.4)' },
      pdf:    { img: 'assets/screenshots/02_link_detail.png',      glow: 'rgba(245, 158, 11, 0.4)' },
      vaults: { img: 'assets/screenshots/06_categories_vault.png', glow: 'rgba(6, 182, 212, 0.4)' }
    };

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const target = screens[btn.getAttribute('data-screen')];
        if (target && screenImg) {
          screenImg.style.opacity = '0';
          screenImg.style.transform = 'scale(0.965)';

          setTimeout(() => {
            screenImg.src = ASSET + target.img;
            screenImg.style.opacity = '1';
            screenImg.style.transform = 'scale(1)';
            if (frame) {
              frame.style.boxShadow =
                `0 40px 90px -20px rgba(0, 0, 0, 0.85), 0 0 70px -8px ${target.glow}`;
            }
          }, 170);
        }
      });
    });

    // 3D perspective tilt (pointer devices only)
    if (frame && !isTouch && !prefersReducedMotion) {
      const wrap = frame.closest('.phone-hub-wrap') || frame.parentElement;

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform =
          `perspective(1200px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) scale(1.015)`;
      }, { passive: true });

      wrap.addEventListener('mouseleave', () => {
        frame.style.transform = '';
      });
    }
  }

  /* ============================================================
     SANITIZER SIMULATOR
     ============================================================ */
  function initSimulator() {
    const runBtn = document.getElementById('simRunBtn');
    const inputEl = document.getElementById('simInput');
    const sampleBtns = document.querySelectorAll('.sim-sample-pill');
    const resultCard = document.getElementById('simResult');
    const progressWrap = document.getElementById('simProgress');
    const progressBar = document.getElementById('simProgressBar');
    if (!runBtn || !inputEl || !resultCard) return;

    const samples = {
      twitter: {
        raw: 'https://twitter.com/sama/status/178942?utm_source=feed&utm_medium=android&fbclid=IwAR29f...',
        label: 'X / Twitter + UTM'
      },
      youtube: {
        raw: 'https://youtube.com/watch?v=k9zTr2P&si=AB73n8s92&feature=share',
        label: 'YouTube + share token'
      },
      reddit: {
        raw: 'https://reddit.com/r/androiddev/comments/18x9/offline_sqlite?utm_campaign=share&utm_content=post',
        label: 'Reddit thread'
      }
    };

    sampleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sampleBtns.forEach((b) => b.classList.remove('accent'));
        btn.classList.add('accent');
        const sample = samples[btn.getAttribute('data-sim')];
        if (sample) inputEl.value = sample.raw;
      });
    });

    const TRACKER_PARAMS = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'si', 'ref_src', 'ref', 'feature', 'campaign'
    ];

    runBtn.addEventListener('click', () => {
      const val = inputEl.value.trim();
      if (!val) {
        showToast('Enter or select a URL first');
        inputEl.focus();
        return;
      }

      runBtn.disabled = true;
      runBtn.textContent = 'Sanitizing…';
      if (progressWrap) progressWrap.style.display = 'block';
      if (progressBar) progressBar.style.width = '20%';
      resultCard.style.opacity = '0';

      setTimeout(() => { if (progressBar) progressBar.style.width = '68%'; }, 260);
      setTimeout(() => { if (progressBar) progressBar.style.width = '100%'; }, 520);

      setTimeout(() => {
        // Real sanitization
        let cleanUrl = val;
        let stripped = 0;
        try {
          const parsed = new URL(val);
          const params = new URLSearchParams(parsed.search);
          const before = Array.from(params.keys());
          TRACKER_PARAMS.forEach((p) => params.delete(p));
          stripped = before.length - Array.from(params.keys()).length;
          parsed.search = params.toString();
          cleanUrl = parsed.toString().replace(/\?$/, '');
        } catch (err) {
          cleanUrl = val.split('?')[0];
        }

        if (progressWrap) progressWrap.style.display = 'none';
        runBtn.disabled = false;
        runBtn.textContent = 'Sanitize & stack';

        resultCard.innerHTML = `
          <div style="background: rgba(9, 12, 21, 0.95); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 18px; padding: 24px; box-shadow: 0 18px 44px rgba(0,0,0,0.5); animation: sim-in 0.5s cubic-bezier(0.16,1,0.3,1);">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;">
              <span class="glass-pill" style="background: rgba(16, 185, 129, 0.13); color: #6EE7B7; border-color: rgba(16, 185, 129, 0.4);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ${stripped} tracker${stripped === 1 ? '' : 's'} stripped · persisted to SQLite
              </span>
              <span style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono);">0.08ms</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 600; color: #FFFFFF; font-size: 1.02rem; margin-bottom: 12px; letter-spacing: -0.01em;">
              Clean link stacked to the local vault
            </div>
            <div style="background: rgba(0,0,0,0.45); border-radius: 11px; padding: 12px 15px; font-family: var(--font-mono); font-size: 0.78rem; color: #A5B4FC; word-break: break-all; margin-bottom: 14px;">
              ${escapeHtml(cleanUrl)}
            </div>
            <div style="display: flex; gap: 16px; align-items: center; font-size: 0.76rem; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 0.04em; flex-wrap: wrap;">
              <span>AUTO-VAULT FILING</span>
              <span>·</span>
              <span>ZERO CLOUD TELEMETRY</span>
            </div>
          </div>
        `;
        resultCard.style.transition = 'opacity 0.35s ease';
        resultCard.style.opacity = '1';
        showToast('Link cleaned & stacked offline');
      }, 780);
    });

    // Inject result animation keyframes once
    if (!document.getElementById('simKeyframes')) {
      const style = document.createElement('style');
      style.id = 'simKeyframes';
      style.textContent = '@keyframes sim-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }';
      document.head.appendChild(style);
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ============================================================
     COUNTERS — eased count-up on view
     ============================================================ */
  function initCounters() {
    const els = document.querySelectorAll('[data-counter]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);

        const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        if (prefersReducedMotion) {
          el.textContent = target + suffix;
          return;
        }

        const DURATION = 1700;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(2, -10 * t);
          el.textContent = Math.round(target * (t === 1 ? 1 : eased)) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    els.forEach((el) => observer.observe(el));
  }

  /* ============================================================
     SPOTLIGHT — tracked radial glow
     ============================================================ */
  function initSpotlight() {
    const cards = document.querySelectorAll('.spotlight-card, .bento-item, .glass-panel, .stat-item');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      }, { passive: true });
    });
  }

  /* ============================================================
     COPY BUTTONS
     ============================================================ */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          showToast('Copied to clipboard');
          const original = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(() => { btn.textContent = original; }, 2000);
        }).catch(() => showToast('Copy failed — select manually'));
      });
    });
  }

  /* ============================================================
     MASCOT MOOD SELECTOR
     ============================================================ */
  function initMascotSelector() {
    const display = document.getElementById('mascotPreviewImg');
    const pills = document.querySelectorAll('[data-mascot-mood]');
    const desc = document.getElementById('mascotMoodDesc');
    if (!display || !pills.length) return;

    const moods = {
      default: {
        src: 'assets/branding/momo_mascot_character.svg',
        desc: 'A porcelain dumpling with plush pink-tinted ears and anime sparkle catchlights. Momo guards your links locally — and never sends a single byte to a remote server.'
      },
      blink: {
        src: 'assets/branding/momo_mascot_blink.svg',
        desc: 'Peaceful resting arcs during idle states, with a gentle floating bob. Even the guardian of your vault needs to blink sometimes.'
      },
      sassy: {
        src: 'assets/branding/momo_mascot_sassy_brow_up.svg',
        desc: 'One inquisitive raised brow: "No Wi-Fi? No problem. Everything you saved is right here on this device."'
      },
      wink: {
        src: 'assets/branding/momo_mascot_wink.svg',
        desc: 'A welcoming wink that celebrates every newly captured link — one more item that will never be lost to a dead cloud service.'
      },
      focused: {
        src: 'assets/branding/momo_mascot_focused.svg',
        desc: 'Determined detective mode, scanning screenshots through the on-device OCR engine at silicon speed.'
      }
    };

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const mood = moods[pill.getAttribute('data-mascot-mood')] || moods.default;
        display.style.opacity = '0';
        setTimeout(() => {
          display.src = ASSET + mood.src;
          display.style.opacity = '1';
        }, 160);
        if (desc) desc.textContent = mood.desc;
      });
    });

    if (display) display.style.transition = 'opacity 0.16s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)';
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      // Initialize open state
      if (item.classList.contains('open')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach((other) => {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = null;
          const q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ============================================================
     FOOTER CLOCK
     ============================================================ */
  function initFooterClock() {
    const clock = document.getElementById('footerClock');
    if (!clock) return;

    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      clock.textContent = `LOCAL — ${hh}:${mm}`;
    };
    update();
    setInterval(update, 15000);
  }

  /* ============================================================
     ACTIVE NAV HIGHLIGHT
     ============================================================ */
  function initActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll('.nav-links a');

    links.forEach((link) => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const section = href.replace(/^\.?\/?/, '').replace('index.html', '').replace(/\//g, '');

      if (!section) {
        const onHome = path.endsWith('/') || path.endsWith('index.html') || /\/momostack\/?$/.test(path);
        if (onHome && !/\/(features|privacy|docs|download|about)\//.test(path)) {
          link.classList.add('active');
        }
      } else if (path.includes('/' + section)) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastEl = null;
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast-notice';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

})();
