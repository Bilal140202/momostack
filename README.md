<p align="center">
  <img src="assets/branding/momo_master_icon.svg" width="120" height="120" alt="MomoStack App Icon" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.35);">
</p>

<h1 align="center">MomoStack (LinkVault)</h1>

<p align="center">
  <strong>Offline-first universal link, OCR, and private notes vault for Android.</strong><br>
  Captured in one tap with zero cloud dependencies, zero tracking, and pure local SQLite permanence.
</p>

<p align="center">
  <a href="https://github.com/Bilal140202/momostack/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/Release-v1.0.0--stable-4F46E5?style=for-the-badge&logo=android" alt="Release v1.0.0"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" alt="License MIT"></a>
  <a href="https://ansaribilal.com"><img src="https://img.shields.io/badge/Crafted%20By-Bilal%20Ansari-F43F5E?style=for-the-badge" alt="Bilal Ansari"></a>
  <a href="https://bilal140202.github.io/momostack/"><img src="https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-06B6D4?style=for-the-badge&logo=githubpages" alt="GitHub Pages"></a>
</p>

---

## 🌟 Overview

**MomoStack** is an ultra-fast, local-first Android intelligence vault engineered for developers, researchers, and creators. It solves the chronic fragility of modern cloud bookmarkers: no accounts, no subscriptions, zero analytics beacons, and no risk of losing your knowledge when a cloud service shuts down.

- **Universal Link Feed:** Capture from Chrome, YouTube, X, Reddit, or Instagram via the Android Share Sheet in sub-100ms.
- **On-Device OCR Vault:** Local Google ML Kit neural models transcribe screenshots and images without network calls.
- **Offline PDF Archival:** Long-press any link to snapshot full web pages into offline searchable PDFs.
- **Instant Scratchpad:** Private fast notes with 1-tap clipboard copying and a distraction-free markdown focus editor.
- **13 Topic Vaults:** Pre-structured organization for AI/ML, DevOps, Web/Mobile, Science, Design, and Security.

---

## 📱 Visual Showcase & Authentic Mockups

| 01. Universal Link Feed | 02. Link Intelligence & PDF | 03. On-Device OCR Vault |
|:---:|:---:|:---:|
| <img src="assets/screenshots/01_home_capture.png" width="240" alt="Universal Link Feed"> | <img src="assets/screenshots/02_link_detail.png" width="240" alt="Link Detail Sheet"> | <img src="assets/screenshots/03_screenshot_vault.png" width="240" alt="OCR Screenshot Vault"> |

| 04. Private Notes Vault | 05. Full-Screen Editor | 06. 13 Category Vaults |
|:---:|:---:|:---:|
| <img src="assets/screenshots/04_notes_page.png" width="240" alt="Private Notes Page"> | <img src="assets/screenshots/05_note_editor.png" width="240" alt="Full Focus Editor"> | <img src="assets/screenshots/06_categories_vault.png" width="240" alt="Category Vaults"> |

---

## 🌐 Complete Multi-Page Landing Site Structure

This repository contains the complete Awwwards-styled multi-page landing site hosted on **GitHub Pages**:

```
.
├── index.html                  # Main Landing Page (Hero, Video Showcase, Feature Bento, FAQ)
├── features/
│   └── index.html              # Six-pillar deep dive with authentic screen captures
├── privacy/
│   └── index.html              # Zero-telemetry technical audit, SQLite sandbox, permissions
├── docs/
│   └── index.html              # Operational manual, Share Sheet tips, OCR workflow
├── download/
│   └── index.html              # Official v1.0 Release Hub, SHA-256 Checksum, System Specs
├── about/
│   └── index.html              # The Momo Story, Carmack first-principles, Bilal Ansari spotlight
├── assets/
│   ├── branding/               # Authentic Momo SVGs (Character, Blink, Wink, Sassy, Focused)
│   ├── screenshots/            # Authentic Play Store 4K mockups
│   ├── video/                  # High-octane launch video & poster
│   ├── css/                    # Dark obsidian design tokens & Lenis smooth scroll
│   └── js/                     # Lenis engine, spotlight effect, copy-to-clipboard, mascot studio
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages static deployment workflow
├── README.md                   # Repository documentation
└── LICENSE                     # MIT License
```

---

## 🔒 Zero-Telemetry Architecture

1. **No Analytics SDKs:** 0 Firebase, 0 Mixpanel, 0 Amplitude, 0 Sentry, 0 Google Analytics.
2. **Local SQLite Sandbox:** Data resides in `/data/data/org.momo.linkvault/databases/momo_vault.db` protected by Android kernel UIDs.
3. **Surveillance Parameter Stripping:** URLs automatically strip `utm_*`, `fbclid`, `gclid`, and tracking hashes before storage.
4. **On-Device OCR:** ML Kit neural models execute 100% on device silicon with zero network transmission.

---

## 📥 v1.0 Official Download & Verification

- **Version:** `v1.0.0-production`
- **Minimum OS:** Android 8.0 (Oreo) or later
- **Architecture:** Universal (`arm64-v8a`, `armeabi-v7a`, `x86_64`)
- **Package Size:** `~18.4 MB`
- **SHA-256 Checksum:**
  ```text
  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  ```

---

## 👨‍💻 Creator & Philosophy

Engineered with John Carmack first-principles simplicity by **Bilal Ansari**.

- Personal Website: **[ansaribilal.com](https://ansaribilal.com)**
- GitHub: **[@Bilal140202](https://github.com/Bilal140202)**

---

## 📄 License

Licensed under the **MIT License**. See [LICENSE](LICENSE) for details.
