# Implementation Plan: Full Astrology API Platform & UX Fixes

**Branch**: `002-auth-ux-fixes` | **Date**: 2026-02-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-auth-ux-fixes/spec.md`

## Summary

Expose every Astrology API SDK endpoint (`@astro-api/astroapi-typescript`, 160+ methods across 16 namespaces) as working pages in the Next.js app. Currently only 6 methods are used. Each page shows ALL data the API returns. Fix auth/UX gaps: auth-aware homepage, quiz redirect, auto-submit from saved charts, gender pre-fill, sessionStorage cleanup, moon page auth guard, navigation overhaul. No payments, no blog, no AI chat — everything free and unblocked.

## Technical Context

**Language/Version**: TypeScript (strict) on Node.js 18+
**Primary Dependencies**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, `@astro-api/astroapi-typescript` v1.0.1, `astronomy-engine`, Supabase JS v2
**Storage**: Supabase (PostgreSQL) with RLS. New tables: `feature_results` (cache), `partner_charts`
**Testing**: Playwright (11 existing test suites, screenshot comparison)
**Target Platform**: Vercel (serverless, Edge runtime for ISR)
**Project Type**: Web application (Next.js full-stack)
**Error Monitoring**: Sentry (`@sentry/nextjs` v10.40.0 already installed, sentry.client/server/edge.config.ts configured, DSN in Vercel). All API calls wrapped with Sentry error capture
**Performance Goals**: Static pages < 2s, single-API pages < 3s, multi-API pages < 5s (FR-037). ISR for sign-based content. API result caching in Supabase
**Constraints**: API rate limits (cache aggressively, max 3 concurrent per user per FR-039). Ukrainian UI. Dark cosmic theme. Mobile-first (375px primary)
**Scale/Scope**: 42 new pages + 6 enhanced existing pages. ~25 new API routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| --------- | ------ | ----- |
| I. Ukrainian-First | PASS | All new pages use Ukrainian text. `language: 'uk'` in SVG/API calls. English fallback for unsupported endpoints |
| II. Simplicity & Minimal Impact | PASS | Pages share common patterns via reusable components. API routes aggregate SDK calls. No premature abstractions |
| III. Design System Consistency | PASS | All pages use GlassCard, CosmicBackground, ZodiacIcon, cosmic palette. No new design primitives |
| IV. Date Handling Safety | PASS | Server dates as "YYYY-MM-DD" strings. Client parsing via `new Date(y, m-1, d)` |
| V. Deploy Often, Verify Always | PASS | Phase-by-phase implementation (P1→P2→P3). Each phase deployable independently |
| VI. Analytics & Error Monitoring | PASS | PostHog: each feature page emits events (view, interact, error). Sentry: all API calls wrapped with error capture, severity levels defined (timeout→warning, 4xx/5xx→error, auth→critical) |
| VII. Existing Infrastructure First | PASS | Uses existing SDK, Supabase, OpenAI, Sentry patterns. No new services. Extends existing `astrology-client.ts` |

**Post-Phase 1 Re-check**: All principles still satisfied. `feature_results` table extends Supabase (not new infra). Shared components reuse existing UI primitives.

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-ux-fixes/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: API audit, decisions, risks
├── data-model.md        # Phase 1: Entities, relationships, cache strategy
├── quickstart.md        # Phase 1: Developer setup guide
├── contracts/
│   ├── api-routes.md    # Phase 1: All API route contracts
│   └── pages.md         # Phase 1: Page structure, nav, shared components
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (main)/
│   │   ├── page.tsx                     # Enhanced: auth-aware homepage
│   │   ├── chart/[id]/page.tsx          # Enhanced: natal report + dignities + enhanced aspects
│   │   ├── transit/page.tsx             # NEW: transit chart + report
│   │   ├── solar-return/page.tsx        # NEW: solar return
│   │   ├── lunar-return/page.tsx        # NEW: lunar return
│   │   ├── progressions/page.tsx        # NEW: secondary progressions
│   │   ├── directions/page.tsx          # NEW: solar arc directions
│   │   ├── horoscope/
│   │   │   ├── daily/page.tsx           # NEW: sign daily (replaces /daily)
│   │   │   ├── weekly/page.tsx          # NEW
│   │   │   ├── monthly/page.tsx         # NEW
│   │   │   ├── yearly/page.tsx          # NEW
│   │   │   └── chinese/page.tsx         # NEW
│   │   ├── compatibility/page.tsx       # Enhanced: full API synastry
│   │   ├── composite/page.tsx           # NEW
│   │   ├── relationship/page.tsx        # NEW: love languages, red flags
│   │   ├── analysis/                    # NEW: 8 analysis pages
│   │   ├── tarot/                       # NEW: 7 tarot pages
│   │   ├── chinese/                     # NEW: 3 Chinese astrology pages
│   │   ├── traditional/                 # NEW: 4 traditional pages
│   │   ├── astrocartography/            # NEW: 2 pages
│   │   ├── numerology/                  # NEW: 2 pages
│   │   ├── fixed-stars/page.tsx         # NEW
│   │   ├── eclipses/page.tsx            # NEW
│   │   ├── insights/                    # NEW: 3 insight pages
│   │   ├── glossary/page.tsx            # NEW
│   │   └── moon/page.tsx               # Enhanced: lunar API data
│   │
│   └── api/
│       ├── chart/route.ts               # Enhanced: add natal report + dignities
│       ├── transit/route.ts             # NEW
│       ├── solar-return/route.ts        # NEW
│       ├── lunar-return/route.ts        # NEW
│       ├── progressions/route.ts        # NEW
│       ├── directions/route.ts          # NEW
│       ├── horoscope/                   # NEW: daily/weekly/monthly/yearly/chinese/personal
│       ├── compatibility/route.ts       # Enhanced: full synastry suite
│       ├── composite/route.ts           # NEW
│       ├── relationship-insights/route.ts # NEW
│       ├── analysis/[type]/route.ts     # NEW: dynamic route for 8 analysis types
│       ├── tarot/                       # NEW: daily, draw, birth-cards
│       ├── chinese/                     # NEW: bazi, compatibility, forecast
│       ├── traditional/                 # NEW: analysis, profections, firdaria, ZR
│       ├── astrocartography/            # NEW: map, location, power-zones, compare
│       ├── numerology/route.ts          # NEW
│       ├── fixed-stars/route.ts         # NEW
│       ├── eclipses/route.ts            # NEW
│       ├── lunar/calendar/route.ts      # NEW: enhanced lunar data
│       ├── insights/[category]/route.ts # NEW: wellness, financial, business
│       ├── partner-charts/route.ts      # NEW: CRUD for partner charts (FR-027b)
│       ├── stats/route.ts               # NEW: real DB counts for landing stats
│       └── glossary/route.ts            # NEW
│
├── components/
│   ├── feature/                         # NEW: shared feature page components
│   │   ├── BirthDataForm.tsx            # Compact inline birth data form (4 field set variants per FR-054)
│   │   ├── ChartSelector.tsx            # Saved chart dropdown
│   │   ├── PartnerSelector.tsx          # Partner chart selector for dual-input pages
│   │   ├── SvgChartViewer.tsx           # API SVG renderer (with sanitization per FR-052)
│   │   ├── AnalysisSection.tsx          # Structured data display (collapsible per FR-049)
│   │   ├── FeaturePageLayout.tsx        # Standard layout for feature pages
│   │   ├── ErrorState.tsx               # Standardized error component (FR-046)
│   │   ├── PartialErrorBanner.tsx       # Inline error for partial API failures (FR-047)
│   │   ├── Breadcrumb.tsx               # Breadcrumb navigation for nested pages (FR-044)
│   │   └── BirthTimeWarning.tsx         # Unknown birth time banner (FR-050)
│   ├── nav/                             # Enhanced: dropdown navigation
│   │   ├── DesktopNav.tsx               # Dropdown menus (max 7 categories per FR-061)
│   │   └── MobileNav.tsx                # Hamburger + expandable sections
│   ├── settings/                        # NEW: account settings
│   │   └── DeleteAccountSection.tsx     # Account deletion flow (FR-051)
│   └── ...existing components
│
├── hooks/
│   └── useAuthChart.ts                  # NEW: auth check + auto-submit logic (primary chart per FR-030)
│
├── lib/
│   ├── astrology-client.ts              # Existing: SDK singleton (no changes needed)
│   ├── feature-cache.ts                 # NEW: Supabase feature_results helpers
│   ├── api-client.ts                    # NEW: API call wrapper (debounce, queue, Sentry, timeout per FR-039/FR-037)
│   ├── svg-sanitizer.ts                 # NEW: sanitize API SVGs before rendering (FR-052)
│   ├── input-sanitizer.ts               # NEW: strip HTML/script from form inputs (FR-052)
│   └── analytics/events.ts             # Enhanced: new feature events
│
└── types/
    └── features.ts                      # NEW: feature-specific types
```

**Structure Decision**: Extends existing Next.js App Router structure. New pages under `(main)/` route group. New API routes under `api/`. Shared components in `components/feature/`. No new top-level directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------- |
| 42 new pages | Each API namespace needs dedicated UI to show ALL returned data | Combining everything into fewer pages would hide data and break FR-002 |
| ~25 new API routes | Server-side SDK calls (API key security) + multi-method aggregation | Client-side SDK calls would expose API key |
| `feature_results` table | Caching prevents API rate limit issues at scale | Without cache, each page view = API call = rate limit risk |
| Dynamic route `analysis/[type]` | 8 analysis types share identical request pattern | 8 separate route files with identical logic is worse |
| `api-client.ts` wrapper | Centralizes debounce, queue, timeout, Sentry capture (FR-037/039/042) | Without it, every API route duplicates error handling and rate limiting |
| `svg-sanitizer.ts` | Security requirement (FR-052) — API SVGs could contain scripts | Inline sanitization in each component would be error-prone |
| ErrorState + PartialErrorBanner | Standardized error patterns (FR-046/047) across 42+ pages | Per-page error handling would be inconsistent |
| Breadcrumb component | Deep page hierarchy needs wayfinding (FR-044) | Without breadcrumbs, users get lost in `/traditional/profections` etc. |
