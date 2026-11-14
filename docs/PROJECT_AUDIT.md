# M2 initial project audit

Audit date: 14 November 2026 UTC. Scope: initial discovery under the uploaded Universal Master Execution Prompt. Classification: existing incomplete product with working public pages and major ownership/security gaps. This is not a production certification.

## Stack and inventory

- TanStack Start 1.168.60, TanStack Router 1.170.41, React 19, TypeScript, Vite 7, Tailwind 4.
- Lovable Cloud database and AI Gateway; edge deployment configuration is present.
- Shared header/footer, 46 UI component files, score card, reusable evidence dialog, browser identifier helper.
- Two application tables: `organizations`, `studio_projects`; three migration files.
- Public content routes: `/`, `/rankings`, `/p/$slug`, `/profile`, `/dashboard`, `/studio`, `/projects`, `/check`, `/pricing`.
- Server routes: `POST /api/studio/generate`, `GET /api/health`; internal server functions for organizations, dashboard and Studio projects.
- No account sign-in UI or protected route subtree was found. Generated auth helpers exist but do not establish authentication coverage.

## Working features and verification boundaries

Public directory filtering, shareable profiles, QR/contact download code, profile editing, dashboard queries, AI streaming code and dated saved projects exist. Score evidence exposes the stored values, current completeness formula, retrieval dates and gaps. Page-load checks passed; mutation workflows and actual AI generation were NOT tested in this audit.

Live read-only database queries returned 28 organizations, 24 stored `verified`/`official` labels and zero browser-owned organizations. These are seeded records, not independently verified businesses. Initial seed SQL contains invented-looking sequential phone numbers, supplied email addresses, arbitrary scores and verification labels. Counting database rows does not make their claims factual.

## Security and data-integrity risks

| ID | Severity | Finding | Evidence | Next action |
|---|---|---|---|---|
| SEC-01 | P1 | Organization updates lack authenticated ownership enforcement | `upsertOrganization` uses a privileged client and updates by caller-supplied `id`, with no ownership condition | Authenticate writes, enforce owner permissions in database and handler, test cross-owner denial |
| SEC-02 | P1 | Studio ownership depends on caller-supplied browser identifiers | Project handlers filter by `client_id` but do not validate a signed-in identity | Migrate to account ownership without automatically claiming legacy rows |
| SEC-03 | P1 | Ordinary public reads return all organization columns through a privileged client | `listOrganizations` and slug lookup use `select('*')`, including `owner_client_id` | Restrict public projections and use least-privilege public reads |
| SEC-04 | P1 | AI generation has no explicit handler authentication, bounded request schema or quota | `api/studio.generate.ts` accepts a cast JSON body and calls paid AI | Verify hosted exposure, add identity checks, size validation and durable quotas |
| DATA-01 | P1 | Seeded verification, scores and contact information lack supporting provenance | Organization seed migration; public badges and contacts | Preserve records; clearly separate demonstration records from verified operational records |
| PROD-01 | P1 | Homepage and pricing describe unimplemented capabilities | Homepage promises measured SEO/revenue/backlinks; pricing trial and sales actions link to profile editor | Replace unsupported promises with actual availability; confirm commercial terms before billing |
| PROD-02 | P2 | Score checker produces a fixed example of 73 | `check.tsx`; example disclaimer is present | Replace with supported measurements or a truthful lookup; do not manufacture audit results |
| OPS-01 | P1 release gate | Ownership and AI save/reopen flows lack current end-to-end verification | This audit only exercises page loads and score unit tests | Test real controlled records after ownership remediation |

Existing database RLS is enabled on both tables. Live policy inspection found a public SELECT policy on organizations and no Studio policies. Migration history revokes direct Studio access and organization writes, but privileged server endpoints can bypass those protections. Earlier security fixes therefore do not establish secure server ownership. The information-schema grants query returned no rows under the inspection role; effective grants remain unverified and must be checked with privilege predicates.

## UI, accessibility and metadata

Current green/gold, Cormorant Garamond/Outfit token system should be preserved during remediation. Hardcoded color utilities, oversized radii, negative heading letter spacing, raw tool buttons and missing reduced-motion handling are present. Mobile profile layout passed width checks at 320, 390, 768 and 1600 pixels; this does not establish site-wide accessibility or responsiveness.

Every existing content route was inspected for leaf metadata. All contain app-specific title, description, OG title/description/type and Twitter card in their normal content state. Public profile metadata uses an absolute HTTPS logo when supplied. Several descriptions still make unsupported verification claims. There are no About, Privacy or Contact routes.

## Missing product and operational capabilities

- Real sign-in, account recovery, account-based ownership, verification review and audit trails.
- QR scan/visitor collection, full Somali/English shell translations and card OCR.
- Implemented subscription entitlements, payment verification and sales/contact workflow.
- Full requirements, route/workflow specifications, operational documentation, automated integration/security/a11y testing.
- Measured performance budgets, hosted monitoring configuration, verified backups, restore drills and rollback procedures.

The preview and published app share a backend. No isolated staging database was established by this audit. No destructive operations, schema changes or business-record writes were executed.

## Recommendation and blockers

**DO NOT RELEASE as a production-ready product.** Address P1 ownership, provenance and AI-abuse gaps first; then verify the complete profile and Studio journeys. Preserve the current stack, records and working UI. No positioning change is assumed.

Before authentication implementation, ask whether user-facing profile data is needed. Legacy-record ownership, genuine seed contact details, verification evidence/authority, commercial terms and privacy/retention policy require decisions. Hosted auth settings, current dependency vulnerability status and backup/restore configuration are unverified.