# CLAUDE.md

Guidance for working in this repository.

## What this is

**Vision 2K26** — the website for an intra-college technical symposium hosted by **IEEE AP-S** (Antennas and Propagation Society) at **Kongu Engineering College**, event date **5 October 2026**. It handles marketing, squad registration, and on-day gate check-in for 5 events: **Paper Presentation, Project Presentation, AI Sprint, ElectroBid, Line Following Robot**.

## Tech stack

- **Pure static HTML + inline JS.** There is **no build step, no `package.json`, no npm/bundler.** Edit the `.html`/`.js` files directly.
- **Tailwind CSS via CDN** (`cdn.tailwindcss.com`). The Tailwind theme config is **inlined in a `<script id="tailwind-config">` block in every page** — there is no shared config file, so a theme change must be repeated per page.
- **Firebase Firestore** (client SDK v10.13.0, imported as ESM from `https://www.gstatic.com/firebasejs/...`). Firebase project: `vision-9a49b`. Config lives in [firebase-config.js](firebase-config.js) (public client keys — normal for Firebase web).
- **Hosted on Vercel** ([vercel.json](vercel.json)). Firebase Hosting was dropped (see recent commits); Firestore is still used.
- **CDN libraries:** html2canvas + qrcodejs (pass export in register), SheetJS/`xlsx` + html5-qrcode (export + QR scanner in organiser/admin).
- Fonts: Orbitron, Space Grotesk, JetBrains Mono, Material Symbols (Google Fonts).

## Pages

- [index.html](index.html) — landing / marketing page.
- [register.html](register.html) — public registration portal. Writes to Firestore.
- [admin.html](admin.html) — **Organiser login** page (SHA-256 PIN gate). Redirects to `organiser.html` on success.
- [organiser.html](organiser.html) — **Organiser terminal & gate scanner**: live registration table, QR check-in, Excel export, and purge/clear tools.
- [brochure.html](brochure.html) — brochure / poster page.
- [sounds.js](sounds.js) — `SFX` audio engine (looping background music + UI sound effects), exposed as `window.SFX`.
- [firestore.rules](firestore.rules) — Firestore security rules.

## Firestore data model

- `events/{eventId}/registrations/{docId}` — one registration doc **per selected event**. Event IDs: `paper-presentation`, `project-presentation`, `ai-sprint`, `electrobid`, `line-following-robot`.
- `metadata/capacity` — registered-seat counter.
- `metadata/settings` — live registration open/close flag (register.html watches it via `onSnapshot`; the organiser terminal toggles it).
- `locks_teams/{teamKey}` — team-name uniqueness locks (create-only, cannot be overwritten).
- `locks_transactions/{txnKey}` — UPI transaction-ID uniqueness locks (create-only).
- `registrations/{id}` — legacy fallback collection.

**Registration flow** (register.html): a squad of 1–3 members submits inside a single `runTransaction` that checks the team lock, the txn-ID lock, and capacity; then creates a registration doc in *each* selected event collection, writes both locks, and increments the capacity counter. On success it renders an admit pass with a QR code (exported via html2canvas).

## Conventions & gotchas

- **CSP is defined in two places and must be kept in sync:** the `Content-Security-Policy` header in [vercel.json](vercel.json) *and* a matching `<meta http-equiv="Content-Security-Policy">` tag in each HTML page. Adding a new external script, CDN, or API endpoint requires updating **both**, or it will be blocked in production.
- **Organiser auth is client-side only.** admin.html hashes the entered PIN with SHA-256 and compares to a hard-coded `EXPECTED_HASH`, storing a token in `sessionStorage` (6-hour expiry). There is no server-side auth. Firestore rules do **not** require authentication — they rely on schema validation and create-only uniqueness locks, and they `allow delete: if true`. Treat organiser/admin routes as security-through-obscurity (they're also `Disallow`ed in [robots.txt](robots.txt)).
- **No tests and no build.** Verify changes by serving the folder statically (e.g. `npx serve` or `vercel dev`) and loading the page in a browser — camera (scanner), audio autoplay, and Firestore all need a real browser context.
- Keep committing style: Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in git history.
