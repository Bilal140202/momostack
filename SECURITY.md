# Security Policy

MomoStack's security model is architectural: the safest data is data that never leaves
your device. This document describes the threat model, the guarantees, and how to
responsibly report a vulnerability.

## Supported Versions

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.0.0   | Yes       | Current production release |
| < 1.0.0 | No        | Pre-release builds were never distributed |

## Security Model

### What MomoStack Guarantees

1. **No network surface at runtime.** The app performs no telemetry, no analytics, and no
   crash reporting. The only optional network touchpoint is OpenGraph metadata resolution
   for a freshly captured URL; OCR, notes, search, and PDF reading work with radios off.
2. **Kernel-enforced data isolation.** The vault database lives at
   `/data/data/org.momo.linkvault/databases/momo_vault.db`, inside Android's per-app
   sandbox. Other applications cannot read it without root access.
3. **Minimal permission footprint.** MomoStack deliberately requests no storage
   permission. There is no shared-storage surface to leak from, and no media-scanning
   component that could over-collect.
4. **Tracker stripping at ingestion.** Surveillance parameters (`utm_*`, `fbclid`,
   `gclid`, share tokens, affiliate hashes) are removed before anything is persisted, so
   the stored record is the clean canonical URL.
5. **Reproducible distribution.** Every release APK is published with a SHA-256 checksum
   so anyone can verify integrity before install.

### What MomoStack Does Not Claim

- **Malware-resistant archives.** Opening a malicious archived PDF is subject to your
  platform PDF reader's sandbox. Treat archived content like any downloaded file.
- **Compromise-proof rooted devices.** If the device is rooted, the app sandbox no longer
  protects the vault. This is an Android platform property, not an app property.
- **Forensic-grade encryption of the database at rest.** The vault relies on Android's
  sandbox plus the device's full-disk/file-based encryption (enabled on Android 8+ when
  the user configures device encryption). Per-database encryption is on the roadmap as an
  opt-in layer.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security reports.**

1. Email **bilal140202@gmail.com** with the subject prefix `[momostack-security]`.
2. Include: affected version, device/OS version, reproduction steps or PoC, and expected
   vs. actual behavior.
3. You will receive an acknowledgement within **72 hours**, and a triage decision
   (accepted / not-a-vuln / needs-more-info) within **7 days**.

### Disclosure Timeline

- **Day 0** — report received and acknowledged.
- **Day 1–7** — triage and severity assignment (CVSS-based).
- **Day 7–30** — fix developed and internally verified.
- **Day 30–90** — coordinated release plus public credit (opt-in) in the release notes.

We practice coordinated disclosure. Please give us a reasonable window to ship a fix
before any public disclosure, and we will extend the same courtesy by crediting your work.

## Verification Instructions for Users

Before installing any MomoStack APK, verify its checksum against the value published on
the [Download Hub](https://bilal140202.github.io/momostack/download/) and in the release
notes:

```bash
sha256sum momostack-v1.0.apk
```

A mismatch means the file is not the official build — do not install it, and please
report where you obtained it.
