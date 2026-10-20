# Contributing to MomoStack

Thank you for considering a contribution. MomoStack is a deliberately small, opinionated
project — the guidelines below exist so that changes stay fast, private, and visually
coherent. Read them before opening a pull request; most rejections come from skipping
one of these three rules.

## The Three Non-Negotiables

1. **Zero telemetry, forever.** No analytics SDKs, no tracking pixels, no third-party
   beacons, no "anonymous usage stats." A pull request that adds any network call not
   explicitly listed in the privacy audit will be closed without review. This is the
   product's core promise.
2. **Local-first data.** All persistence stays in the on-device SQLite sandbox. No sync
   formats, no cloud exports behind accounts, no proprietary lock-in.
3. **Performance is a feature.** Capture operations must remain sub-100 ms. Avoid adding
   heavy libraries to the site (the entire site currently ships with zero dependencies
   beyond Lenis) or blocking work onto the app's capture path.

## How to Contribute

### 1. Open an Issue First

Before non-trivial work, open a GitHub issue using one of the templates:

- **Bug report** — include device model, Android version, and exact reproduction steps.
- **Feature request** — describe the problem you are solving, not just the solution.
  Features that increase the app's network surface or data footprint will be declined.

This prevents wasted effort on changes that conflict with the project's direction.

### 2. Branch & Commit Conventions

```
feature/  -> feature/vault-search
fix/      -> fix/ocr-rotation-crash
docs/     -> docs/site-faq
site/     -> site/motion-tuning
```

Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/)
style:

```
feat: add vault-level search ranking
fix: strip si share token from YouTube URLs
site: tighten preloader timing to 1.2s
docs: expand OCR workflow guide
chore: update issue templates
```

Keep commits atomic — one logical change per commit, so review and revert stay clean.

### 3. Site Contributions (this repository's frontend)

The site is hand-authored HTML/CSS/JS with no build step. When editing it:

- **Design tokens live in `assets/css/main.css` `:root`.** Never hard-code colors, fonts,
  or easing curves — reference the CSS custom properties.
- **One stylesheet, one script.** All six pages share `main.css` and `main.js`. If you add
  a class, confirm it doesn't collide with an existing one.
- **Match the motion language.** Use the shared easing token
  (`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`). New interactive elements should
  participate in the reveal system (`data-reveal`) where sensible.
- **Accessibility is mandatory.** Every interactive element needs a focus state and an
  aria label where text isn't sufficient. Any motion you add must respect
  `prefers-reduced-motion`.
- **No emoji in UI chrome.** Use inline SVG icons consistent with the existing 1.8 px
  stroke style.
- **Test on mobile widths.** The site is reviewed at 390 px, 768 px, and 1440 px before
  any visual PR merges. Include screenshots in your PR description.

### 4. App Contributions

App source lives outside this repository's landing-site scope; issues tagged `app` are
triaged into the Android codebase. Please describe the affected pillar (capture, OCR,
PDF archival, notes, vaults) in the issue title.

## Review Process

1. A maintainer triages the issue and confirms scope.
2. You implement on a branch and open a PR linking the issue (`Closes #N`).
3. Review checks three things: telemetry safety, design-token compliance, and mobile QA.
4. Squash-and-merge is used; your PR title becomes the commit message.

## Reporting Security Issues

Do **not** open public issues for security vulnerabilities. Follow the disclosure process
in [SECURITY.md](SECURITY.md).

## Licensing

By contributing, you agree that your contributions are licensed under the MIT License
that covers the project.
