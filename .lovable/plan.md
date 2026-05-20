## M2 Authority Engine — Phased Upgrade Plan

Staying on TanStack Start + Lovable Cloud. Each milestone is shippable on its own. I'll build them in order and pause between for your review.

### Milestone 1 — Identity & Public Authority Profiles (start here)
- DB: `organizations` table (name, slug, category, city, bio_so/bio_en, logo_url, website, phone, whatsapp, email, socials jsonb, verification_status, trust_score, completeness, owner_client_id).
- Public route `/p/$slug` — premium profile page with QR, save-vCard, WhatsApp CTA, trust badges, bilingual bio toggle, schema.org JSON-LD + OG tags.
- Profile editor route (replaces current mock `/profile`) writing to Supabase, keyed by browser client_id (no auth yet).
- Wire Rankings table to read from `organizations` instead of the in-file mock.

### Milestone 2 — Somali/English i18n
- Lightweight i18n provider (no next-intl; we're on TanStack). Locale in URL search param + localStorage, default `so`.
- Translate site shell (header, footer, nav, home, pricing CTAs). Profile bios stored per-language already from M1.

### Milestone 3 — QR + Scan Analytics Engine
- DB: `qr_campaigns`, `scan_events` (referrer, ua, country via CF header, ts).
- `/p/$slug` QR resolves through `/r/$campaignId` server route that logs + 302s.
- Profile dashboard: scans over time, top sources, device split (Tremor-style charts using recharts already in repo).

### Milestone 4 — Business Card OCR → Profile
- Upload card image on `/check` (rename to "Card → Profile") → server fn calls Lovable AI Gateway (`google/gemini-3-flash-preview` vision) → extracts fields → prefills profile editor.

### Milestone 5 — Verification & Trust Score
- Verification request table + admin-style review page. Compute trust_score from: phone verified, email verified, domain verified, completeness, age. Badges on public profile.

### Deferred (not in this pass)
Monorepo split, separate admin app, Microsoft Clarity/GA/Meta Pixel, drag-drop page builder, AI design generator, PWA, Cloudinary, payments, RBAC. We can pick these up after the core engines are real.

### Technical notes
- All new server-side reads/writes use `createServerFn` (no edge functions).
- Profiles are owned by a browser `client_id` until you ask for real auth — keeps RLS open like the existing `studio_projects` pattern.
- New tables get RLS enabled with permissive policies matching current project posture; we'll tighten when auth lands.

Starting Milestone 1 immediately after you approve.