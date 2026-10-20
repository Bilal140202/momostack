# AGENTS.md — Conventions for AI Coding Agents

This file orients AI coding agents (and their humans) working in this repository. Read it
fully before generating or modifying code. Following these conventions is the difference
between a PR that merges and one that gets closed.

## Project Snapshot

- **What:** MomoStack — an offline-first Android app (links, OCR, notes, PDF archival) plus
  its marketing/documentation site.
- **This repo contains:** the multi-page static landing site only. The Android source lives
  elsewhere; issues tagged `app` are triaged out.
- **Stack:** hand-authored HTML + CSS + vanilla JS. **No framework, no build step, no
  package manager.** Do not introduce one.

## Hard Rules

1. **Zero telemetry.** Never add any analytics, tracking, remote fonts beyond Google Fonts
   CDN, or third-party scripts. The only external dependency allowed is Lenis (smooth
   scroll) via unpkg. If a feature seems to need tracking, redesign the feature.
2. **No build step.** Files are served exactly as committed. Any change must work by
   opening `index.html` behind a plain static file server.
3. **One stylesheet, one script.** `assets/css/main.css` and `assets/js/main.js` are shared
   by all six pages. Never duplicate logic into per-page files; extend the shared ones and
   keep every existing public class working (subpages depend on them).
4. **No emoji in website UI.** Site iconography is inline SVG, 1.8px stroke, consistent
   rounding. Emoji are reserved for in-app product surfaces only.
5. **Respect reduced motion.** Every new animation must be inert under
   `prefers-reduced-motion` and skipped on touch-only devices where it is hover-driven.

## Design System Contract (Obsidian Editorial)

Tokens live in `assets/css/main.css` under `:root`. Always reference them; never hard-code
values in new rules.

| Token | Value | Use |
|-------|-------|-----|
| `--font-display` | Space Grotesk | Headlines, buttons, stats |
| `--font-serif` | Instrument Serif italic | One accent word per headline |
| `--font-sans` | Inter | Body copy |
| `--font-mono` | JetBrains Mono | Eyebrows, indices, checksums, captions |
| `--bg-deep` | `#05060A` | Canvas |
| `--primary` / `--primary-light` | `#6366F1` / `#A5B4FC` | Accent, links, glow |
| `--coral` | `#FF6B8B` | Secondary accent (serif italic words) |
| `--emerald` | `#10B981` | Verification / privacy signals |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Every transition |

Structural patterns to preserve:

- Section eyebrows: `<div class="eyebrow"><b>NN</b> — Label</div>` with mono uppercase.
- Headline pairing: oversized `.display-lg/.display-xl` Space Grotesk + one
  `<em class="serif-accent">` italic accent word.
- Reveal participation: add `data-reveal` (+ optional `data-reveal-delay`) to new blocks.
- Hairline dividers (`--border-glass`) instead of heavy borders; depth via shadow + glow.

## JavaScript Conventions

- Single IIFE in `main.js`, `'use strict'`, functions registered from one
  `DOMContentLoaded` handler with `init*` names.
- Every `init*` must null-check its root elements (the script runs on all six pages, not
  all of which contain every widget).
- No global namespace pollution beyond the deliberately exposed `window.__lenis`.
- Path-sensitive assets (screenshots, mascots) must use the `ASSET` prefix helper so both
  root and subpage contexts resolve.

## Content & Copy Rules

- Tone: precise, confident, engineering-first. No hype adjectives without a number or
  mechanism behind them.
- Claims must match the privacy audit: "zero telemetry," "on-device OCR," "local SQLite"
  are architectural facts — keep them consistent across all pages and docs.
- Spelling: American English. Numerals for stats, words for casual counts.

## Verification Checklist Before Any PR

- [ ] Site loads from a clean `python3 -m http.server` with zero console errors.
- [ ] All six pages render correctly at 390px, 768px, and 1440px.
- [ ] `prefers-reduced-motion` disables new motion.
- [ ] No new network requests beyond the two allowed CDNs (unpkg, Google Fonts).
- [ ] Interactive widgets (phone lab, simulator, FAQ, mascot, copy buttons) still work.
- [ ] `CHANGELOG.md` updated under `[Unreleased]` for user-visible changes.
