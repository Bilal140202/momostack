# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Dark/light theme toggle for the landing site (dark remains the default).
- Lighthouse CI workflow with performance budgets.
- Optional on-device vault export to encrypted JSON for user-controlled backups.
- Feature-discovery onboarding tour inside the Android app.

---

## [1.0.0] — 2026-10-20

The production debut of both the MomoStack Android application experience documentation
and the complete Obsidian Editorial landing site.

### Added — Android Application

- Universal share-sheet link capture from Chrome, YouTube, X, Reddit, Instagram, and Substack
  with sub-100 ms background metadata resolution.
- OpenGraph parser extracting titles, high-resolution posters, domain favicons, estimated
  read times, and topic tags.
- Tracker sanitizer stripping `utm_*`, `fbclid`, `gclid`, share tokens, and affiliate hashes
  before persistence.
- On-device OCR vault powered by Google ML Kit neural models with tap-to-copy transcription.
- Long-press offline PDF archival via headless WebKit rendering pipeline.
- 1-tap copy notes scratchpad with full-screen distraction-free focus editor and autosave.
- Thirteen pre-structured topic vaults (AI/ML through Quick Inbox) with auto-tagging.
- Local SQLite persistence in the app kernel sandbox — no cloud, no account, no sync.

### Added — Landing Site

- Multi-page static site: homepage, features deep dive, zero-telemetry privacy audit,
  operational docs, download hub, and creator story.
- **Obsidian Editorial** design system: Space Grotesk display + Instrument Serif italic
  accents + Inter body + JetBrains Mono data labels, on an obsidian canvas with hairline
  structure and a single indigo accent.
- Full motion engine: preloader with counter curtain, word-level kinetic headline, custom
  lerped cursor, scroll-progress hairline, IntersectionObserver reveal system, ambient
  parallax, magnetic buttons, 3D phone tilt, screen switcher with per-screen glow, live
  URL-sanitizer sandbox, eased stat counters, spotlight cards, FAQ accordion, dual kinetic
  marquee, and giant footer wordmark with live local clock.
- Interactive URL sanitizer playground running the genuine stripping logic in-browser.
- Launch film showcase with cinematic frame treatment.
- Momo mascot mood studio (five expressions from the SVG suite).
- Zero-cloud comparison table, FAQ section, and SHA-256 verification block with one-tap copy.
- Full `prefers-reduced-motion` and touch-device degradation paths.
- SEO foundation: canonical URLs, Open Graph, Twitter cards, and JSON-LD `SoftwareApplication`
  structured data.

### Added — Repository Infrastructure

- Automated GitHub Pages deployment via `actions/deploy-pages@v4` on every push to `main`.
- Contribution workflow (`CONTRIBUTING.md`), security policy (`SECURITY.md`),
  release history (this file), AI-agent conventions (`AGENTS.md`), and issue templates.
- `.gitignore` covering OS and editor artifacts.

### Design Decisions

- **No emoji in website UI.** All site iconography is inline SVG with a consistent 1.8 px
  stroke; emoji remain exclusive to in-app product surfaces.
- **Single shared stylesheet.** All six pages draw from one `main.css` so design-token
  changes propagate site-wide in one edit.
- **GitHub Pages over Netlify.** The site is pure static with no build step; Pages'
  push-to-deploy workflow removes any need for an external host. Netlify remains a
  drag-and-drop fallback if needs change.

[Unreleased]: https://github.com/Bilal140202/momostack/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Bilal140202/momostack/releases/tag/v1.0.0
