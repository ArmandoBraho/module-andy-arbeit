# AndyArbeit — Session Learnings

Notes and decisions captured from planning and build sessions.

---

## Sessions

### 2026-07-14 — Planning decisions

**Architecture**
- Multi-page site (not single-page scroll)
- Stack: React + TypeScript + CSS/SCSS, built with Vite

**Contact form (v1)**
- Fields (all required, labels in German): Vorname, Nachname, E-Mail, Telefon, Problembeschreibung
- Form present from day one (hero and/or dedicated Kontakt page)

**Branding**
- Logo: stylized "AA" monogram + "AndyArbeit" wordmark (orange with light outline)
- Primary accent: dark/burnt orange (~`#E67E22`–`#D35400`) — used especially for header
- Secondary: black (logo/apparel), white/light backgrounds for content areas
- Reference photo: Andy in branded cap + polo (usable for hero/about)
- Layout/UX inspiration: [rohrreinigungberlinmitte.de](https://rohrreinigungberlinmitte.de/) — header + homepage structure
- Content source: [andyarbeit.info](https://www.andyarbeit.info/) — reuse existing German copy where possible

**Pages (planned)**
- Home, Leistungen (+ optional service subpages), Servicegebiet, Über uns / Warum AndyArbeit, Kontakt, Impressum, Datenschutz

### 2026-07-14 — Phase 0–2 implemented

**Scaffold**
- Vite + React + TypeScript + SCSS + react-router-dom
- `npm run dev` / `npm run build` / `npm run preview`
- Assets in `public/`: `logo.png`, `andy-portrait.png`

**Built**
- Dark-orange sticky header with mobile nav + phone CTA
- Footer with nav + legal links
- Home: hero + contact form, services, warum, servicegebiet, CTA band
- Pages: `/leistungen`, `/servicegebiet`, `/ueber-uns`, `/kontakt`, `/impressum`, `/datenschutz`
- ContactForm: Vorname, Nachname, E-Mail, Telefon, Problembeschreibung (all required, German labels)
- Form submit: client-side validation only; backend TBD

**Next**
- Wire form to email/API (Formspree or similar)
- Full Impressum + Datenschutz content
- FAQ section (optional)
- Cookie consent banner
- Service subpages if needed
