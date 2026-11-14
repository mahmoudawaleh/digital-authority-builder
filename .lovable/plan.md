## M2 — Controlled production-readiness plan

### Initial audit completed
All nine content pages opened successfully; four score tests passed. The existing directory, profiles and Studio are retained. The audit found serious ownership gaps, unsupported seeded verification/contact claims and unimplemented capabilities advertised on the homepage/pricing page. Current decision: **do not release as production-ready**.

### Phase 1 — Requirements and product architecture
- Complete the requirements register, sitemap, journeys and roles/permissions specifications from the existing M2 product, without repositioning it.
- Before authentication code, ask whether user-facing account profile data is required.
- Define a safe legacy-record claim process, verification evidence rules and real commercial terms. Keep unresolved decisions explicit.

### Phase 2 — Design specifications
- Preserve the existing visual identity; specify honest availability, mobile navigation, accessible controls, loading/error/recovery states and public/private surfaces.
- Document the design system and UI specifications before wider presentation changes. Do not redesign working pages unnecessarily.

### Phase 3 — Ownership, database and backend
- Add account sign-in/recovery and enforce account ownership for organization writes and saved projects in both handlers and database policies.
- Restrict public responses to safe profile columns; do not expose browser ownership identifiers.
- Add authenticated, bounded AI requests with durable usage safeguards and safe failure responses.
- Preserve all records; do not automatically transfer legacy records based only on browser IDs. Verify cross-owner denial before connecting the new flows.

### Phase 4 — Frontend integration and truthfulness
- Connect existing profile, dashboard and Studio pages to the secured account flows; preserve dated projects and streaming output.
- Remove unsupported measurement/verification promises. Distinguish seed/demo records from supported business claims without silently altering historical scores.
- Replace the fixed score-check simulation with a supported record lookup or explicitly unavailable measurement action; no fabricated SEO/revenue findings.
- Only implement paid offers after the commercial decision; do not pretend trial/sales buttons complete those actions.

### Phase 5 — Independent QA and remediation
- Verify a real controlled profile save → public read → dashboard flow and AI generation → dated save → reopen → update flow.
- Test unauthorized and cross-owner requests, validation, stream interruption, service failures, filtering, downloads and recovery.
- Check every page at phone, tablet and desktop widths, keyboard navigation, accessibility and measured performance.
- Record PASS/FAIL/BLOCKED/NOT TESTED evidence, fix defects by severity and rerun affected tests.

### Phase 6 — Operations and handover
- Complete the required repository documentation with actual findings, including API/schema/governance, QA/defects, deployment, backup/recovery and maintenance instructions.
- Verify hosted settings, backup/restore and rollback; document the shared preview/production backend limitation and safe staging approach.
- Produce the 12-domain internal maturity scorecard only from evidence and a release decision. No production publishing with unresolved P0/P1 risks.

### Subsequent product milestones
Retain Somali/English localization, QR/visitor analytics, card OCR and verification review in the backlog. Implement them after safe ownership and their relevant policy decisions, rather than implying they already exist.

### Technical approach
Keep TanStack Start, React, Tailwind and Lovable Cloud. Use authenticated server functions for ordinary account operations, least-privilege database clients/RLS, and verified server routes for streaming/external contracts. Migrations include grants, policies and tests. Preserve the browser-safe shared score-evidence module and unchanged historical scores unless a separately documented migration is approved.

No destructive operations, positioning changes, billing activation or automatic legacy ownership transfers are included.