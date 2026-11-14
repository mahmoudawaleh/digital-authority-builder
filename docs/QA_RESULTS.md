# Initial QA evidence — 14 November 2026

## Executed checks

| Test | Scenario | Actual result | Status |
|---|---|---|---|
| QA-01 | Open all nine existing content routes in Chromium, 1280 × 1800 | HTTP 200, meaningful H1 and app-specific title, no captured page errors, no document overflow on each | PASS |
| QA-02 | Profile layout at widths 320, 390, 768 and 1600 | No document horizontal overflow; mobile screenshot visually inspected | PASS |
| QA-03 | Existing score-evidence unit file | 4 tests passed, 0 failed: 11 scoring fields, full profile score 90, tied ranks, absent freshness | PASS |
| QA-04 | Current preview compilation log | Latest observed entry at 00:58:05 UTC: build OK | PASS |
| QA-05 | Live database counts and RLS inventory | 28 organizations, 24 stored verification labels, 0 browser-owned; RLS enabled on both application tables | OBSERVED |
| QA-06 | Effective table privileges | Information-schema query returned no rows for grants under inspection role | NOT VERIFIED |

Routes tested: `/`, `/rankings`, `/profile`, `/dashboard`, `/studio`, `/projects`, `/check`, `/pricing`, `/p/telesom`.

Execution used Playwright against localhost, without sign-in or business-record mutations. Screenshot evidence: `/tmp/browser/master-audit/rankings-desktop.png` and `profile-mobile.png`; observations: `results.json` in that directory. These sandbox artifacts are temporary, not a durable evidence archive. The observed results are recorded here for continuity.

## Not executed

Real AI generation/stream cancellation, profile create/update and dashboard readback with owned rows, project save/reopen/delete, contact downloads, filter combinations, authorization attacks, hosted auth configuration, dependency scan, WCAG audit, performance measurement, backup restore and published-site checks remain NOT TESTED. No page-load check should be interpreted as an end-to-end workflow pass.

## Release decision

**DO NOT RELEASE** as production-ready: P1 ownership, unsupported provenance and unverified critical workflows remain. No maturity percentage is assigned before the wider verification phase; a number now would imply unsupported completeness.