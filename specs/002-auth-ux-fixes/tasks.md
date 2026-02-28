# Tasks: Full Astrology API Platform & UX Fixes

**Input**: Design documents from `/specs/002-auth-ux-fixes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks omitted. Existing Playwright tests should continue passing.

**Organization**: Tasks grouped by user story. P1 stories first (auth/UX fixes, then core features), then P2 (API pages), then P3 (insights/polish).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US14)
- Include exact file paths in descriptions

---

## Phase Gate Standard (applies to EVERY phase)

Every phase MUST pass the following gate before it is considered complete. Gate tasks use `PG-XX` IDs.

| Gate Step | Description |
| --------- | ----------- |
| **Build** | `npm run build` — zero TypeScript errors, zero warnings. Phase is not shippable if build fails |
| **Existing Tests** | `npm run test` — all existing Playwright tests pass. No regressions |
| **New UI Tests** | Write Playwright tests for all new pages/flows added in this phase. Tests MUST cover both **mobile (375px)** and **desktop (1280px)** viewports. Mobile is primary — test mobile first |
| **Visual Check** | Spot-check new pages on mobile (375px) and desktop (1280px). Verify no layout breaks, text overflow, or touch target issues |
| **Zero "Скоро" Check** | Verify ZERO instances of "Скоро", "coming soon", "незабаром" in codebase. Features either fully work or do not exist — no placeholders, no dead links, no "coming soon" blocks anywhere |
| **Commit** | Atomic commit with clear message: `phase-N: [description]`. Never merge — merging is user's responsibility |

**Mobile-First Principle**: Most users are on mobile phones. All UI tests MUST include mobile viewport (375px) alongside desktop (1280px). Mobile layout issues are blocking — desktop-only fixes are not.

**Zero "Скоро" Policy**: At no point during implementation may any "Скоро", "coming soon", or placeholder text exist in the codebase. If a feature isn't implemented yet, its nav link, page, and any references to it MUST NOT exist. Features are added atomically — fully working or not present at all (FR-025, FR-025a).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database migrations, shared types, reusable components, utilities, and hooks that all stories depend on.

### Database & Types

- [ ] T001 Create Supabase migration for `feature_results` table in `supabase/migrations/` — schema per data-model.md (id, user_id, chart_id, feature_type, feature_params, result_data, expires_at, created_at + RLS policies + composite index on user_id/feature_type/chart_id/feature_params_hash). Include rollback script
- [ ] T002 Create Supabase migration for `partner_charts` table in `supabase/migrations/` — schema per data-model.md (id, user_id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender + RLS policy). Include rollback script
- [ ] T003 [P] Create feature types file `src/types/features.ts` — FeatureType union type (all values from data-model.md Feature Type Registry), FeatureResult interface, PartnerChart interface, cache TTL map per FR-038, BirthDataFormVariant type ('basic' | 'full' | 'date-range' | 'location') per FR-054

### Utility Libraries

- [ ] T004 [P] Create API call wrapper `src/lib/api-client.ts` — centralizes: form submission debounce (500ms per FR-039), max 3 concurrent API calls per user session (queued with loading state per FR-039), max 6 concurrent calls per page load with sequential batching and progressive rendering (FR-057), API timeout handling (10s default, 15s for analysis endpoints per FR-037), Sentry error capture with severity levels (timeout→warning, 4xx/5xx→error, auth→critical per FR-042), rate limit header monitoring (pause prefetch at >80% per FR-039)
- [ ] T005 [P] Create SVG sanitizer `src/lib/svg-sanitizer.ts` — removes `<script>` elements and event handler attributes (onclick, onerror, onload, etc.) from API-provided SVG strings before inline rendering (FR-052)
- [ ] T006 [P] Create input sanitizer `src/lib/input-sanitizer.ts` — strips HTML/script tags from all birth data form inputs before submission (FR-052). Used by BirthDataForm
- [ ] T007 [P] Create feature cache helper `src/lib/feature-cache.ts` — getCachedResult(), saveCachedResult(), clearExpiredResults(), invalidateForChart() using Supabase `feature_results` table. TTLs per FR-038 and data-model.md Feature Type Registry. Cache invalidation on chart edit

### Shared Components

- [ ] T008 [P] Create `BirthDataForm` component in `src/components/feature/BirthDataForm.tsx` — compact inline form with 4 field set variants per FR-054: (a) Basic — name, DOB, time, city; (b) Full — basic + gender; (c) Date-range — basic + target date; (d) Location — basic + target city. Birth time supports "Невідомо" option → defaults to 12:00. Date picker enforces 1900-01-01 through today (FR-034), warns for pre-1900 ("Для дат до 1900 року точність може бути знижена"), rejects pre-1800. Geocoding disambiguation: multiple results show "city, region, country" dropdown, zero results show "Не вдалось знайти місто" (FR-055). Uses input-sanitizer.ts. Clear labels above fields, real-time Ukrainian validation messages (FR-029f). Pre-fills from initialData prop. Min 44px touch targets (FR-029b)
- [ ] T009 [P] Create `ChartSelector` component in `src/components/feature/ChartSelector.tsx` — dropdown fetching user's charts, shows chart name + birth date. Most recently created chart is pre-selected (or pinned primary per FR-030)
- [ ] T010 [P] Create `PartnerSelector` component in `src/components/feature/PartnerSelector.tsx` — dropdown fetching from `/api/partner-charts`, shows partner name + birth date. "Додати партнера" button opens inline BirthDataForm. Saved partners reusable across all dual-input pages (FR-027)
- [ ] T011 [P] Create `SvgChartViewer` component in `src/components/feature/SvgChartViewer.tsx` — renders API SVG string (sanitized via svg-sanitizer.ts per FR-052) with dark background, responsive sizing, loading skeleton state (FR-029g)
- [ ] T012 [P] Create `AnalysisSection` component in `src/components/feature/AnalysisSection.tsx` — recursively renders structured API JSON data with Ukrainian labels for common keys, handles nested objects/arrays. Sections with >5 content blocks initially collapsed with "Показати більше" button (FR-049). Individual sections independently collapsible. Glossary links for technical terms (FR-029i)
- [ ] T013 [P] Create `FeaturePageLayout` component in `src/components/feature/FeaturePageLayout.tsx` — standard layout: page header (feature name + one-line Ukrainian description per FR-045), BirthDataForm section (variant determined by page), result area with AnalysisSection, loading/error states. Auto-submit behavior per FR-053: single-input pages auto-submit from primary chart, dual-input pages show partner form only, pages with extra inputs show only extra fields. Uses api-client.ts for API calls. Integrates feature-cache.ts (check cache before API call, save after fetch). Browser back preserves form state (FR-048). On mount: emits PostHog `feature_page_view` event. When auth user has chart missing gender: shows one-time prompt per FR-060 (dismissible, "prefer not to say" option, flag stored in charts table). Shows BirthTimeWarning when time is unknown
- [ ] T014 [P] Create `ErrorState` component in `src/components/feature/ErrorState.tsx` — standardized error display per FR-046: Ukrainian headline, description of what happened, retry button, next-step suggestion. Error type variants: network ("Перевірте з'єднання"), timeout ("Запит зайняв занадто довго"), validation (field-specific), API error ("Сервіс тимчасово недоступний")
- [ ] T015 [P] Create `PartialErrorBanner` component in `src/components/feature/PartialErrorBanner.tsx` — inline error for partial API failures per FR-047: renders successful sections normally, shows inline error with retry button in failed sections. Full-page ErrorState only when ALL API calls fail
- [ ] T016 [P] Create `Breadcrumb` component in `src/components/feature/Breadcrumb.tsx` — breadcrumb navigation for pages nested 2+ levels deep per FR-044 (e.g., "Таро > Кельтський Хрест"). Labels match navigation menu names in Ukrainian
- [ ] T017 [P] Create `BirthTimeWarning` component in `src/components/feature/BirthTimeWarning.tsx` — persistent amber banner per FR-050: "Час народження невідомий — позиції Місяця та будинків можуть бути неточними." Shown when birth time is "unknown" (12:00 default used)

### Hooks & Analytics

- [ ] T018 [P] Create `useAuthChart` hook in `src/hooks/useAuthChart.ts` — checks auth status, loads user's charts from Supabase, determines primary chart: most recently created OR user-pinned (FR-030). Returns { user, chart, charts, isComplete, isLoading, pinChart() }. isComplete = name + DOB + time (not 'unknown') + city (with lat/lng) + gender all present (FR-019)
- [ ] T019 [P] Add new PostHog events in `src/lib/analytics/events.ts` — feature_page_view, feature_result_loaded, feature_error, feature_form_submit, chart_created, partner_added, partner_deleted, tarot_draw, tarot_redraw for each feature category (FR-041)

**Checkpoint**: Shared infrastructure ready. All user story phases can begin.

### Phase 1 Gate

- [ ] PG-01a Run `npm run build` — zero errors, zero warnings
- [ ] PG-01b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-01c Write Playwright tests for shared components (BirthDataForm render with all 4 variants, ChartSelector dropdown, SvgChartViewer loading state, ErrorState variants, date validation limits) — mobile (375px) + desktop (1280px)
- [ ] PG-01d Commit: `phase-1: shared infrastructure (types, cache, api-client, sanitizers, components, hooks)`

---

## Phase 2: Auth Flow Fixes (US14, Priority: P1)

**Goal**: Fix all auth UX issues: quiz redirect, form auto-submit, gender pre-fill, sessionStorage cleanup, moon page guard.

**Independent Test**: Auth user can navigate to any feature page without unwanted redirect. Unauth user sees no personal data on moon page. Logout clears sessionStorage.

- [ ] T020 [US14] Fix quiz redirect — in `src/app/(quiz)/quiz/QuizClient.tsx`, redirect auth users to `/chart/new` using `useEffect` + Supabase `getUser()` check (FR-018). ONLY quiz redirects — all other pages accessible to all users
- [ ] T021 [US14] Fix login page redirect — in `src/app/(main)/auth/login/page.tsx`, redirect auth users to `/dashboard` (FR-023)
- [ ] T022 [US14] Fix MoonTransitCard — in `src/components/moon/MoonTransitCard.tsx`, hide "У вашому чарті" section when user is not authenticated (FR-022)
- [ ] T023 [US14] Add sessionStorage cleanup on logout — in auth state change handler, clear all sessionStorage on `SIGNED_OUT` event (FR-021)
- [ ] T024 [US14] Fix gender save and add "prefer not to say" — in `src/app/api/chart/route.ts`, verify gender saves from request body to charts table. Add 'prefer not to say' option mapped to null for API calls (FR-020, FR-020a). For API endpoints requiring binary gender, 'prefer not to say' omits the gender field
- [ ] T025 [US14] Fix product form auto-submit — update `src/components/product/ProductForm.tsx` to skip form entirely when auth user has complete chart data (per FR-019 completeness definition: name + DOB + time + city + gender). Auto-call API with chart data and show results directly
- [ ] T026 [US14] Remove all "Скоро" text — grep codebase for "Скоро", "coming soon", "незабаром", remove or replace with actual functionality or remove the block entirely. Features that aren't implemented yet: remove the UI element completely — no placeholder text, no disabled buttons, no "coming soon" blocks (FR-025). T136 will verify zero remain after all phases

**Checkpoint**: Auth flow fixed. Users can navigate freely, forms auto-submit, privacy protected.

### Phase 2 Gate

- [ ] PG-02a Run `npm run build` — zero errors, zero warnings
- [ ] PG-02b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-02c Write Playwright tests: auth user quiz redirect, login redirect to /dashboard, moon page unauth state, sessionStorage cleared on logout, form auto-submit with complete chart data, gender "prefer not to say" option — mobile (375px) + desktop (1280px)
- [ ] PG-02d Commit: `phase-2: auth flow fixes (redirect, auto-submit, gender, privacy)`

---

## Phase 3: Auth-Aware Homepage & Dashboard (US13, Priority: P1)

**Goal**: Auth users see personalized dashboard. Unauth users see marketing landing. Dashboard shows curated feature recommendations and first-time overview.

**Independent Test**: Login → homepage redirects to /dashboard with greeting, daily horoscope, saved charts. Logout → homepage shows marketing CTAs.

- [ ] T027 [US13] Update homepage `src/app/(main)/page.tsx` — detect auth state. If auth: redirect to `/dashboard` (FR-017). If unauth: keep existing marketing landing
- [ ] T028 [US13] Enhance dashboard `src/app/(main)/dashboard/` — personalized view per FR-023a: "Привіт, {name}" greeting, primary chart summary, quick links to most-used features, daily horoscope card (from `/api/horoscope/daily/{sign}` based on user's Sun sign), list of saved charts. Feature recommendations section: curated static list of 6 feature categories per FR-033 (Horoscopes, Compatibility, Tarot, Transits, Chinese, Numerology — defined in code, not algorithm-driven). First-time auth users see brief feature overview (3-4 key feature cards with short Ukrainian descriptions per FR-043). For zero-charts users: welcome message + CTA to `/chart/new`
- [ ] T029 [US13] Remove auth-user-facing "Створити акаунт" CTAs — audit all components for signup CTAs visible to auth users, conditionally hide them (SC-006)

**Checkpoint**: Homepage is auth-aware. Auth users see personalized dashboard content.

### Phase 3 Gate

- [ ] PG-03a Run `npm run build` — zero errors, zero warnings
- [ ] PG-03b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-03c Write Playwright tests: auth user redirected to /dashboard, dashboard shows greeting + charts + horoscope + curated feature list, first-time user sees feature overview, zero-charts user sees CTA, unauth sees marketing landing, zero "Створити акаунт" for auth users — mobile (375px) + desktop (1280px)
- [ ] PG-03d Commit: `phase-3: auth-aware homepage & dashboard (redirect, personalized, feature overview)`

---

## Phase 4: Navigation Overhaul (US15, Priority: P1)

**Goal**: Navigation menus give access to ALL feature categories via dropdowns. Progressive disclosure with max 7 top-level categories. Only implemented pages appear in nav — no dead links.

**Independent Test**: Desktop: hover each nav dropdown → see all feature links. Mobile: tap hamburger → see all categories with expandable sections + search. Every link goes to a working page.

- [ ] T030 [US15] Redesign desktop navigation in `src/components/nav/DesktopNav.tsx` — implement dropdown menus per contracts/pages.md navigation structure: max 7 top-level categories (FR-061). Categories: Гороскопи, Карти, Таро, Аналіз, Традиційна, Ще, [User Menu]. Dropdown sub-items include one-line Ukrainian descriptions on hover (FR-043). Clear Ukrainian labels — no astrological jargon (FR-029e). Tooltips for advanced features. Only show links to pages that exist and work — zero dead links, zero placeholders (FR-025a)
- [ ] T031 [US15] Redesign mobile navigation in `src/components/nav/MobileNav.tsx` — hamburger menu (FR-061) with expandable category sections, search/filter input for power users to find features quickly. All interactive elements 44px minimum touch targets (FR-029b). Only show links to implemented pages (FR-025a). No "Скоро" or disabled items — if it's in the nav, it works
- [ ] T032 [US15] Fix broken product page navigation — remove auth-only redirect logic from `src/app/(main)/horoscopes/*/page.tsx`, `src/app/(main)/ascendant/page.tsx` so pages load for all users. Actual page removal/redirects handled later in T049 (horoscopes) and T130 (others)

**Checkpoint**: Users can navigate to every implemented feature from the menu.

### Phase 4 Gate

- [ ] PG-04a Run `npm run build` — zero errors, zero warnings
- [ ] PG-04b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-04c Write Playwright tests: desktop dropdown menus open/close with feature descriptions, all nav links resolve to existing pages (zero 404s, zero placeholders), mobile hamburger menu expands with all categories, mobile search/filter finds features, touch targets ≥ 44px — mobile (375px) + desktop (1280px)
- [ ] PG-04d Commit: `phase-4: navigation overhaul (dropdowns, hamburger, search, progressive disclosure)`

---

## Phase 5: Complete Natal Chart Experience (US1, Priority: P1)

**Goal**: Natal chart page shows ALL API data: planets, houses, aspects, dignities, enhanced aspects, natal report, API SVG.

**Independent Test**: Create chart → see API SVG, all planet positions, houses, aspects with orbs, essential dignities, full natal report with interpretations.

- [ ] T033 [US1] Enhance `/api/chart` route in `src/app/api/chart/route.ts` — add calls to `client.analysis.getNatalReport()`, `client.data.getEnhancedPositions()`, `client.data.getEnhancedAspects()`, `client.enhanced.getEnhancedNatalChart()` alongside existing getNatalChart + getSvg. Wrap all calls with api-client.ts (Sentry capture per FR-042). Return all data. Cache natal_report and enhanced_natal as "permanent" per FR-038
- [ ] T034 [US1] Enhance chart results page `src/app/(main)/chart/[id]/page.tsx` — add new tabs/sections: "Звіт" (natal report), "Гідності" (dignities), "Розширені аспекти" (enhanced aspects). Display ALL fields from API responses using AnalysisSection (collapsible per FR-049). Show BirthTimeWarning when applicable (FR-050)
- [ ] T035 [US1] Replace local NatalChartWheel with API SVG — in chart results page, use `SvgChartViewer` component to display `svg_content` from API as primary visualization (FR-004). Keep local renderer as fallback only when API SVG unavailable (network error, timeout). Fallback MUST be visually indicated to user
- [ ] T036 [US1] Display complete planet data — in PlanetsTable, show degree/minute, retrograde status, house placement, speed, dignity status for each planet (using enhanced positions data). All API fields rendered
- [ ] T037 [US1] Display complete aspect data — in AspectsTable, show applying/separating status, orb, reception data from enhanced aspects. All API fields rendered

**Checkpoint**: Natal chart shows complete, professional-grade data from API.

### Phase 5 Gate

- [ ] PG-05a Run `npm run build` — zero errors, zero warnings
- [ ] PG-05b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-05c Write Playwright tests: chart creation flow end-to-end, API SVG renders (with fallback test), planets/houses/aspects/dignities/report tabs display data, enhanced aspects show orb + applying/separating, BirthTimeWarning when time unknown — mobile (375px) + desktop (1280px)
- [ ] PG-05d Commit: `phase-5: complete natal chart (API SVG, report, dignities, enhanced aspects)`

---

## Phase 6: All Horoscope Forecasts (US2, Priority: P1)

**Goal**: Daily, weekly, monthly, yearly, personal, and Chinese horoscope pages — each showing ALL API data.

**Independent Test**: Visit each horoscope page → select sign → see complete forecast data with all categories, ratings, lucky numbers.

- [ ] T038 [P] [US2] Create API route `src/app/api/horoscope/daily/[sign]/route.ts` — calls `getSignDailyHoroscope()` + `getSignDailyHoroscopeText()`, returns combined data. Wrap with api-client.ts (Sentry per FR-042). Cache 24h (FR-038)
- [ ] T039 [P] [US2] Create API route `src/app/api/horoscope/weekly/[sign]/route.ts` — calls `getSignWeeklyHoroscope()`. Cache 7d
- [ ] T040 [P] [US2] Create API route `src/app/api/horoscope/monthly/[sign]/route.ts` — calls `getSignMonthlyHoroscope()`. Cache 30d
- [ ] T041 [P] [US2] Create API route `src/app/api/horoscope/yearly/[sign]/route.ts` — calls `getSignYearlyHoroscope()`. Cache 365d
- [ ] T042 [P] [US2] Create API route `src/app/api/horoscope/personal/route.ts` — POST, calls `getPersonalDailyHoroscope()` with subject. Cache 24h
- [ ] T043 [P] [US2] Create API route `src/app/api/horoscope/chinese/route.ts` — POST, calls `getChineseHoroscope()` with subject. Cache 30d
- [ ] T044 [US2] Create daily horoscope page `src/app/(main)/horoscope/daily/page.tsx` + client component — sign selector (12 ZodiacIcon components), displays all horoscope categories (general, love, career, health), ratings, lucky numbers, mood. Personal horoscope section for auth users. Loading skeleton per FR-029g
- [ ] T045 [P] [US2] Create weekly horoscope page `src/app/(main)/horoscope/weekly/page.tsx` + client component — sign selector, full weekly forecast with all API fields
- [ ] T046 [P] [US2] Create monthly horoscope page `src/app/(main)/horoscope/monthly/page.tsx` + client component — sign selector, full monthly forecast
- [ ] T047 [P] [US2] Create yearly horoscope page `src/app/(main)/horoscope/yearly/page.tsx` + client component — sign selector, full yearly overview
- [ ] T048 [US2] Create Chinese horoscope page `src/app/(main)/horoscope/chinese/page.tsx` + client component — uses FeaturePageLayout with BirthDataForm (basic variant), displays Chinese horoscope data
- [ ] T049 [US2] Remove/redirect old horoscope pages — delete `src/app/(main)/horoscope/[slug]/page.tsx` (if catches new sub-routes), delete `src/app/(main)/daily/page.tsx`. Add redirects in next.config.js: `/daily` → `/horoscope/daily`, `/horoscopes/*` → `/horoscope/*`

**Checkpoint**: All 6 horoscope types working with complete API data.

### Phase 6 Gate

- [ ] PG-06a Run `npm run build` — zero errors, zero warnings
- [ ] PG-06b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-06c Write Playwright tests: daily/weekly/monthly/yearly horoscope pages load with sign selector, Chinese horoscope form submit, personal horoscope for auth users, old horoscope URLs redirect correctly — mobile (375px) + desktop (1280px)
- [ ] PG-06d Commit: `phase-6: horoscope forecasts (daily, weekly, monthly, yearly, chinese, personal)`

---

## Phase 7: Relationship & Compatibility Suite (US3, Priority: P1)

**Goal**: Full synastry, composite, compatibility scores, relationship insights — all API-powered. Partner charts CRUD for data reuse.

**Independent Test**: Enter two birth data sets → see synastry chart SVG, composite chart, compatibility scores by category, love languages, red flags. Save partner → reuse across features.

- [ ] T050 [US3] Create partner-charts CRUD API `src/app/api/partner-charts/route.ts` — GET (list user's partners), POST (create), PUT (update), DELETE (delete). RLS-protected. Validates input via input-sanitizer.ts (FR-027b, FR-052)
- [ ] T051 [US3] Enhance `/api/compatibility` route in `src/app/api/compatibility/route.ts` — replace local synastry with `getSynastryChart()` + `getSynastryChartSvg()` + `getSynastryReport()` + `getCompatibilityAnalysis()` + `getCompatibilityScore()` + `enhanced.getEnhancedSynastryChart()`. Wrap with api-client.ts (FR-042). Cache 30d
- [ ] T052 [US3] Enhance compatibility page `src/app/(main)/compatibility/page.tsx` — redesign with PartnerSelector (FR-027), API SVG bi-wheel via SvgChartViewer, full synastry report via AnalysisSection, compatibility scores by life area, all API fields displayed. Breadcrumb nav if nested (FR-044)
- [ ] T053 [P] [US3] Create API route `src/app/api/composite/route.ts` — calls `getCompositeChart()` + `getCompositeChartSvg()` + `getCompositeReport()`. Cache 30d
- [ ] T054 [P] [US3] Create composite page `src/app/(main)/composite/page.tsx` + client component — PartnerSelector for second input, composite chart SVG, full composite report
- [ ] T055 [P] [US3] Create API route `src/app/api/relationship-insights/route.ts` — calls `insights.relationship.getCompatibility()`, `getLoveLanguages()`, `getRedFlags()`, `getTiming()`. Uses PartialErrorBanner for partial failures (FR-047)
- [ ] T056 [P] [US3] Create relationship insights page `src/app/(main)/relationship/page.tsx` + client component — PartnerSelector, love languages, red flags, timing sections with all API data. Collapsible sections (FR-049)

**Checkpoint**: Full relationship suite working — synastry, composite, compatibility, insights. Partner data reusable.

### Phase 7 Gate

- [ ] PG-07a Run `npm run build` — zero errors, zero warnings
- [ ] PG-07b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-07c Write Playwright tests: partner-charts CRUD (create, list, delete), compatibility page with PartnerSelector, synastry SVG renders, composite chart page, relationship insights (love languages, red flags), partner data reuse across features — mobile (375px) + desktop (1280px)
- [ ] PG-07d Commit: `phase-7: relationship suite (partner CRUD, synastry, composite, compatibility, insights)`

---

## Phase 8: Transit & Predictive Tools (US4, Priority: P1)

**Goal**: Transit chart, transit report, upcoming transits timeline, solar/lunar returns, predictive analysis.

**Independent Test**: Select a saved chart → see transit bi-wheel SVG, current transits list, upcoming exact dates, transit interpretation.

- [ ] T057 [US4] Create API route `src/app/api/transit/route.ts` — calls `getTransitChart()` + `getTransitChartSvg()` + `getTransitReport()` + `getNatalTransitReport()` + `getNatalTransits()` + `enhanced.getEnhancedTransitChart()`. Cache 1h (FR-038). Wrap with api-client.ts. Uses PartialErrorBanner pattern for partial failures
- [ ] T058 [US4] Create transit page `src/app/(main)/transit/page.tsx` + client component — date picker for transit date (BirthDataForm date-range variant per FR-054), ChartSelector for natal chart, bi-wheel SVG via SvgChartViewer, transit aspects list, upcoming transits timeline, transit report via AnalysisSection. Breadcrumb nav (FR-044)
- [ ] T059 [P] [US4] Create API route `src/app/api/solar-return/route.ts` — calls `getSolarReturnChart()` + `getSolarReturnChartSvg()` + `getSolarReturnReport()` + `getSolarReturnTransits()`. Cache 365d
- [ ] T060 [P] [US4] Create solar return page `src/app/(main)/solar-return/page.tsx` + client component — year selector, chart SVG, yearly themes report
- [ ] T061 [P] [US4] Create API route `src/app/api/lunar-return/route.ts` — calls `getLunarReturnChart()` + `getLunarReturnChartSvg()` + `getLunarReturnReport()` + `getLunarReturnTransits()`. Cache 30d
- [ ] T062 [P] [US4] Create lunar return page `src/app/(main)/lunar-return/page.tsx` + client component — date picker, chart SVG, monthly cycle report
- [ ] T063 [US4] Create predictive analysis page `src/app/(main)/analysis/predictive/page.tsx` + client component — upcoming trends and timing. Uses dynamic `/api/analysis/predictive` route (handled by T068's `[type]` route). Cache 7d

**Checkpoint**: All P1 features complete. Core product fully functional.

### Phase 8 Gate

- [ ] PG-08a Run `npm run build` — zero errors, zero warnings
- [ ] PG-08b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-08c Write Playwright tests: transit page with date picker and chart selector, bi-wheel SVG renders, solar/lunar return pages with year/date selectors, predictive analysis page — mobile (375px) + desktop (1280px)
- [ ] PG-08d Commit: `phase-8: transit & predictive (transit chart, solar/lunar return, predictive)`
- [ ] PG-08e **P1 MILESTONE**: Full regression test of all P1 features together. Verify auth flow + nav + natal chart + horoscopes + compatibility + transit all work end-to-end on mobile and desktop

---

## Phase 9: Progressions & Directions (US5, Priority: P2)

**Goal**: Secondary progressions and solar arc directions pages with chart data + reports.

**Independent Test**: Enter birth data + target date → see progressed positions, progression report.

- [ ] T064 [P] [US5] Create API route `src/app/api/progressions/route.ts` — calls `getProgressions()` + `getProgressionReport()`. Cache 30d. Wrap with api-client.ts
- [ ] T065 [P] [US5] Create API route `src/app/api/directions/route.ts` — calls `getDirections()` + `getDirectionReport()`. Cache 30d
- [ ] T066 [US5] Create progressions page `src/app/(main)/progressions/page.tsx` + client component — BirthDataForm (date-range variant per FR-054) for target date, progressed chart data via AnalysisSection (collapsible per FR-049), progression report. Breadcrumb nav
- [ ] T067 [US5] Create directions page `src/app/(main)/directions/page.tsx` + client component — BirthDataForm (date-range variant), directed positions, direction report. Breadcrumb nav

**Checkpoint**: Advanced chart types available.

### Phase 9 Gate

- [ ] PG-09a Run `npm run build` — zero errors, zero warnings
- [ ] PG-09b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-09c Write Playwright tests: progressions page with date picker, directions page, reports display with collapsible sections — mobile (375px) + desktop (1280px)
- [ ] PG-09d Commit: `phase-9: progressions & directions`

---

## Phase 10: Specialized Analysis Reports (US6, Priority: P2)

**Goal**: 8 unique analysis pages — career, health, karmic, psychological, spiritual, vocational, lunar, relocation.

**Independent Test**: Visit career analysis → enter birth data → see complete career report with all API sections.

- [ ] T068 [US6] Create dynamic API route `src/app/api/analysis/[type]/route.ts` — maps type param to appropriate `client.analysis.get*Analysis()` method (career, health, karmic, psychological, spiritual, vocational, lunar, predictive). Validate type enum. Wrap with api-client.ts (Sentry per FR-042). Cache 30d for static analyses, 7d for predictive (per FR-038). Return full API response
- [ ] T069 [US6] Create shared analysis client component `src/components/feature/AnalysisPageClient.tsx` — reusable client component for all analysis pages: FeaturePageLayout + BirthDataForm (full variant per FR-054) + AnalysisSection (collapsible per FR-049). Takes analysisType prop. Shows ErrorState on failure, PartialErrorBanner on partial failure
- [ ] T070 [P] [US6] Create career analysis page `src/app/(main)/analysis/career/page.tsx` — Ukrainian metadata + AnalysisPageClient with type="career"
- [ ] T071 [P] [US6] Create health analysis page `src/app/(main)/analysis/health/page.tsx`
- [ ] T072 [P] [US6] Create karmic analysis page `src/app/(main)/analysis/karmic/page.tsx`
- [ ] T073 [P] [US6] Create psychological analysis page `src/app/(main)/analysis/psychological/page.tsx`
- [ ] T074 [P] [US6] Create spiritual analysis page `src/app/(main)/analysis/spiritual/page.tsx`
- [ ] T075 [P] [US6] Create vocational analysis page `src/app/(main)/analysis/vocational/page.tsx`
- [ ] T076 [P] [US6] Create lunar analysis page `src/app/(main)/analysis/lunar/page.tsx`
- [ ] T077 [US6] Create relocation analysis page `src/app/(main)/analysis/relocation/page.tsx` + client component — BirthDataForm (location variant per FR-054) with additional target city picker, calls `getRelocationAnalysis()` via separate API logic in `[type]` route or dedicated route

**Checkpoint**: All 8 specialized analyses working.

### Phase 10 Gate

- [ ] PG-10a Run `npm run build` — zero errors, zero warnings
- [ ] PG-10b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-10c Write Playwright tests: each analysis page loads, form submit works, results display with collapsible sections (FR-049), relocation page has location picker, ErrorState shown on API failure — mobile (375px) + desktop (1280px)
- [ ] PG-10d Commit: `phase-10: specialized analyses (career, health, karmic, psychological, spiritual, vocational, lunar, relocation)`

---

## Phase 11: Tarot Section (US7, Priority: P2)

**Goal**: 10 tarot pages — daily card, single card, three-card, Celtic Cross, houses spread, Tree of Life, birth cards, synastry tarot, transit tarot. Re-draw confirmation dialogs. Card images from API.

**Independent Test**: Visit daily tarot → see today's card with image + interpretation. Visit Celtic Cross → draw 10 cards → see full spread interpretation.

- [ ] T078 [P] [US7] Create API route `src/app/api/tarot/daily/route.ts` — calls `getDailyCard()`, returns card data. Cache 24h (one draw per day per FR-035)
- [ ] T079 [P] [US7] Create API route `src/app/api/tarot/draw/route.ts` — POST with count + spread_type, calls `drawCards()` + appropriate `generate*Report()` method (single, threeCard, celticCross, houses, treeOfLife, synastry, transit). No cache for interactive draws (FR-038). Wrap with api-client.ts
- [ ] T080 [P] [US7] Create API route `src/app/api/tarot/birth-cards/route.ts` — POST with subject, calls `calculateBirthCards()`. Cache 30d
- [ ] T081 [US7] Create tarot hub page `src/app/(main)/tarot/page.tsx` + client component — daily card display with card image from API `imageUrl` field (FR-031, text-only fallback if no image: card name, suit, arcana, meaning), links to all spread types, card browser using `getAllCards()`, tarot introduction text in Ukrainian. Breadcrumb on sub-pages (FR-044)
- [ ] T082 [P] [US7] Create single card page `src/app/(main)/tarot/single/page.tsx` + client component — draw button, card display with API image (FR-031), single card report. Re-draw shows confirmation dialog: "Бажаєте витягнути нові карти?" (FR-035). Unlimited re-draws
- [ ] T083 [P] [US7] Create three-card page `src/app/(main)/tarot/three-card/page.tsx` + client component — draw button, 3 cards in row (past/present/future), three-card report. Re-draw confirmation (FR-035)
- [ ] T084 [P] [US7] Create Celtic Cross page `src/app/(main)/tarot/celtic-cross/page.tsx` + client component — draw button, 10-card layout, Celtic Cross report. Re-draw confirmation (FR-035). Breadcrumb: "Таро > Кельтський Хрест"
- [ ] T085 [P] [US7] Create houses spread page `src/app/(main)/tarot/houses/page.tsx` + client component — 12-card layout, houses report. Re-draw confirmation (FR-035)
- [ ] T086 [P] [US7] Create Tree of Life page `src/app/(main)/tarot/tree-of-life/page.tsx` + client component — draw + Tree of Life layout, report. Re-draw confirmation (FR-035)
- [ ] T087 [US7] Create birth cards page `src/app/(main)/tarot/birth-cards/page.tsx` + client component — BirthDataForm (basic variant), personality + soul card display with images (FR-031)
- [ ] T088 [P] [US7] Create synastry tarot page `src/app/(main)/tarot/synastry/page.tsx` + client component — PartnerSelector for second input, calls `/api/tarot/draw` with `generateSynastryReport()`, shows paired card reading
- [ ] T089 [P] [US7] Create transit tarot page `src/app/(main)/tarot/transit/page.tsx` + client component — BirthDataForm (date-range variant) + date picker, calls `/api/tarot/draw` with `generateTransitReport()`, shows transit-themed card reading

**Checkpoint**: Complete tarot section with 10 spread types.

### Phase 11 Gate

- [ ] PG-11a Run `npm run build` — zero errors, zero warnings
- [ ] PG-11b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-11c Write Playwright tests: tarot hub with daily card, single/three-card/Celtic Cross draw interactions with re-draw confirmation dialog (FR-035), birth cards form, tarot card display with images (FR-031), synastry + transit tarot pages — mobile (375px) + desktop (1280px)
- [ ] PG-11d Commit: `phase-11: tarot section (10 spread types, re-draw confirmation, card images)`

---

## Phase 12: Chinese Astrology Section (US8, Priority: P2)

**Goal**: BaZi, luck pillars, Ming Gua, compatibility, yearly forecast, element analysis.

**Independent Test**: Enter birth data → see BaZi four pillars, luck pillars timeline, Ming Gua number.

- [ ] T090 [P] [US8] Create API route `src/app/api/chinese/bazi/route.ts` — POST, calls `calculateBaZi()` + `calculateLuckPillars()` + `calculateMingGua()` + `getZodiacAnimal()`. Cache 30d. Wrap with api-client.ts
- [ ] T091 [P] [US8] Create API route `src/app/api/chinese/compatibility/route.ts` — POST, calls `calculateCompatibility()`. Cache 30d
- [ ] T092 [P] [US8] Create API route `src/app/api/chinese/forecast/route.ts` — POST, calls `getYearlyForecast()` + `analyzeYearElements()` + `getSolarTerms()`. Cache 30d
- [ ] T093 [US8] Create Chinese astrology hub `src/app/(main)/chinese/page.tsx` + client component — BirthDataForm (full variant), BaZi four pillars display, luck pillars timeline, Ming Gua with directions, zodiac animal. AnalysisSection with collapsible blocks (FR-049). Breadcrumb nav
- [ ] T094 [P] [US8] Create Chinese compatibility page `src/app/(main)/chinese/compatibility/page.tsx` + client component — PartnerSelector for second input, compatibility result
- [ ] T095 [P] [US8] Create Chinese forecast page `src/app/(main)/chinese/forecast/page.tsx` + client component — year selector, yearly forecast, element analysis

**Checkpoint**: Chinese astrology section complete.

### Phase 12 Gate

- [ ] PG-12a Run `npm run build` — zero errors, zero warnings
- [ ] PG-12b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-12c Write Playwright tests: BaZi four pillars display, luck pillars timeline, Ming Gua directions, Chinese compatibility with PartnerSelector, yearly forecast — mobile (375px) + desktop (1280px)
- [ ] PG-12d Commit: `phase-12: chinese astrology (BaZi, luck pillars, Ming Gua, compatibility, forecast)`

---

## Phase 13: Traditional Astrology Section (US9, Priority: P2)

**Goal**: Traditional analysis, dignities, Arabic lots, profections, firdaria, zodiacal releasing.

**Independent Test**: View traditional analysis for a chart → see dignities table, Arabic lots, profection timeline.

- [ ] T096 [P] [US9] Create API route `src/app/api/traditional/analysis/route.ts` — POST, calls `getAnalysis()` + `getDignitiesAnalysis()` + `getLotsAnalysis()` + `getSectAnalysis()` + `getBoundsAnalysis()`. Cache 30d. Wrap with api-client.ts
- [ ] T097 [P] [US9] Create API route `src/app/api/traditional/profections/route.ts` — POST, calls `getProfectionsAnalysis()` + `getAnnualProfection()` + `getProfectionTimeline()`. Cache 30d
- [ ] T098 [P] [US9] Create API route `src/app/api/traditional/firdaria/route.ts` — POST, calls `getFirdaria()`. Cache 30d
- [ ] T099 [P] [US9] Create API route `src/app/api/traditional/zodiacal-releasing/route.ts` — POST, calls `getZodiacalReleasing()`. Cache 30d
- [ ] T100 [US9] Create traditional hub page `src/app/(main)/traditional/page.tsx` + client component — comprehensive traditional analysis: dignities table, Arabic lots, sect analysis, bounds. AnalysisSection with collapsible blocks (FR-049). Breadcrumb nav on sub-pages (FR-044)
- [ ] T101 [P] [US9] Create profections page `src/app/(main)/traditional/profections/page.tsx` + client component — age input, annual profection, profection timeline. Breadcrumb: "Традиційна > Профекції"
- [ ] T102 [P] [US9] Create firdaria page `src/app/(main)/traditional/firdaria/page.tsx` + client component — firdaria periods display. Breadcrumb: "Традиційна > Фірдарія"
- [ ] T103 [P] [US9] Create zodiacal releasing page `src/app/(main)/traditional/zodiacal-releasing/page.tsx` + client component — lot selector, zodiacal releasing periods. Breadcrumb: "Традиційна > Зодіакальний рилізинг"

**Checkpoint**: Traditional astrology section complete.

### Phase 13 Gate

- [ ] PG-13a Run `npm run build` — zero errors, zero warnings
- [ ] PG-13b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-13c Write Playwright tests: traditional analysis hub, dignities table, profections timeline with age input, firdaria periods, zodiacal releasing with lot selector, breadcrumb navigation — mobile (375px) + desktop (1280px)
- [ ] PG-13d Commit: `phase-13: traditional astrology (dignities, lots, profections, firdaria, ZR)`

---

## Phase 14: Astrocartography (US10, Priority: P2)

**Goal**: Planetary lines map, location analysis, power zones, location comparison.

**Independent Test**: Enter birth data → see planetary lines on map. Click location → see analysis.

- [ ] T104 [P] [US10] Create API route `src/app/api/astrocartography/map/route.ts` — POST, calls `getLines()` + `generateMap()` + `getCrossings()` + `getParanLines()`. Map rendered as inline SVG/image from API `generateMap()` (FR-032). Cache 30d. Wrap with api-client.ts
- [ ] T105 [P] [US10] Create API route `src/app/api/astrocartography/location/route.ts` — POST, calls `analyzeLocation()` + `getLocationReport()` + `getRelocationChart()` + `getLocalSpace()`. Cache 30d
- [ ] T106 [P] [US10] Create API route `src/app/api/astrocartography/power-zones/route.ts` — POST, calls `findPowerZones()`. Cache 30d
- [ ] T107 [P] [US10] Create API route `src/app/api/astrocartography/compare/route.ts` — POST, calls `compareLocations()`. Cache 30d
- [ ] T108 [US10] Create astrocartography map page `src/app/(main)/astrocartography/page.tsx` + client component — BirthDataForm (basic variant), map visualization via SvgChartViewer (API-generated map per FR-032), planetary lines list, power zones section. AnalysisSection for detailed data
- [ ] T109 [US10] Create location analysis page `src/app/(main)/astrocartography/location/page.tsx` + client component — BirthDataForm (location variant per FR-054) with target city search, location analysis display, comparison tool for two locations. Breadcrumb: "Астрокартографія > Аналіз локації"

**Checkpoint**: Astrocartography section complete.

### Phase 14 Gate

- [ ] PG-14a Run `npm run build` — zero errors, zero warnings
- [ ] PG-14b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-14c Write Playwright tests: astrocartography map renders via API (FR-032), location analysis with city search, power zones display, location comparison — mobile (375px) + desktop (1280px)
- [ ] PG-14d Commit: `phase-14: astrocartography (map, location analysis, power zones, comparison)`

---

## Phase 15: Numerology, Fixed Stars, Eclipses, Lunar (US11, Priority: P2)

**Goal**: Dedicated pages for numerology, fixed stars, eclipses, and enhanced lunar calendar.

**Independent Test**: Visit numerology → enter birth data → see core numbers + comprehensive report. Visit eclipses → see upcoming eclipses + natal impact.

- [ ] T110 [P] [US11] Create API route `src/app/api/numerology/route.ts` — POST, calls `getCoreNumbers()` + `getComprehensiveReport()`. Cache 30d. Wrap with api-client.ts
- [ ] T111 [P] [US11] Create API route `src/app/api/numerology/compatibility/route.ts` — POST, calls `analyzeCompatibility()`. Cache 30d
- [ ] T112 [P] [US11] Create API route `src/app/api/fixed-stars/route.ts` — POST for `getConjunctions()` + `generateReport()`, GET for `getAllStars()` + `getPositions()` (star catalog). Cache 30d
- [ ] T113 [P] [US11] Create API route `src/app/api/eclipses/route.ts` — GET for `getUpcoming()` + `getHistory()` + `getSarosCycle()`, POST for `checkNatalImpact()`. Cache 7d
- [ ] T114 [P] [US11] Create API route `src/app/api/lunar/calendar/route.ts` — GET, calls `getMansions()` + `getEvents()` + `getCalendar()` + `getVoidOfCourse()` + `getGardeningCalendar()` + `getIngresses()`. Cache ISR 15min
- [ ] T115 [US11] Create numerology page `src/app/(main)/numerology/page.tsx` + client component — BirthDataForm (basic variant), core numbers display, comprehensive report via AnalysisSection (collapsible per FR-049)
- [ ] T116 [P] [US11] Create numerology compatibility page `src/app/(main)/numerology/compatibility/page.tsx` + client component — PartnerSelector for second input, compatibility result
- [ ] T117 [US11] Create fixed stars page `src/app/(main)/fixed-stars/page.tsx` + client component — BirthDataForm (basic variant), natal star conjunctions table, interpretation report. Contextual help for technical terms (FR-029i)
- [ ] T118 [US11] Create eclipses page `src/app/(main)/eclipses/page.tsx` + client component — upcoming eclipses list (no birth data needed), natal impact section (with BirthDataForm). Shows eclipse dates, types, saros cycles
- [ ] T119 [US11] Enhance moon page `src/app/(main)/moon/page.tsx` — integrate lunar API data (mansions, events, calendar, void-of-course, gardening calendar, ingresses per FR-015) alongside existing astronomy-engine calculations. New sections via AnalysisSection

**Checkpoint**: All P2 features complete.

### Phase 15 Gate

- [ ] PG-15a Run `npm run build` — zero errors, zero warnings
- [ ] PG-15b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-15c Write Playwright tests: numerology page with core numbers, numerology compatibility with PartnerSelector, fixed stars conjunctions with contextual help, eclipses list + natal impact, enhanced moon page with lunar API data — mobile (375px) + desktop (1280px)
- [ ] PG-15d Commit: `phase-15: numerology, fixed stars, eclipses, lunar enhancements`
- [ ] PG-15e **P2 MILESTONE**: Full regression test of all P2 features. Verify all new pages load and display data correctly on mobile and desktop

---

## Phase 16: Wellness, Financial & Business Insights (US12, Priority: P3)

**Goal**: Specialized insight pages for wellness, financial, and business analysis.

**Independent Test**: Visit wellness page → enter birth data → see body mapping, biorhythms, energy patterns.

- [ ] T120 [P] [US12] Create API route `src/app/api/insights/wellness/route.ts` — POST, calls `insights.wellness.getBodyMapping()`, `getBiorhythms()`, `getEnergyPatterns()`, `getWellnessTiming()`, `getWellnessScore()`, `getMoonWellness()`. Cache 24h (FR-038). Wrap with api-client.ts. Uses PartialErrorBanner pattern for partial failures (FR-047)
- [ ] T121 [P] [US12] Create API route `src/app/api/insights/financial/route.ts` — POST, calls `insights.financial.getMarketTiming()`, `analyzePersonalTrading()`, `getGannAnalysis()`, `getBradleySiderograph()`. Cache 24h
- [ ] T122 [P] [US12] Create API route `src/app/api/insights/business/route.ts` — POST, calls `insights.business.getLeadershipStyle()`, `getTeamDynamics()`, `getBusinessTiming()`, `getHiringCompatibility()`. Cache 30d
- [ ] T123 [US12] Create wellness page `src/app/(main)/insights/wellness/page.tsx` + client component — BirthDataForm (full variant), body mapping visualization, biorhythms chart, energy patterns, wellness score, moon wellness. AnalysisSection (collapsible per FR-049). Breadcrumb nav
- [ ] T124 [P] [US12] Create financial page `src/app/(main)/insights/financial/page.tsx` + client component — BirthDataForm (basic variant), market timing, personal trading analysis, Gann analysis
- [ ] T125 [P] [US12] Create business page `src/app/(main)/insights/business/page.tsx` + client component — BirthDataForm (full variant), leadership style, team dynamics, business timing

**Checkpoint**: All insight pages complete.

### Phase 16 Gate

- [ ] PG-16a Run `npm run build` — zero errors, zero warnings
- [ ] PG-16b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-16c Write Playwright tests: wellness page (body mapping, biorhythms), financial page (market timing), business page (leadership style), partial failure handling — mobile (375px) + desktop (1280px)
- [ ] PG-16d Commit: `phase-16: wellness, financial & business insights`

---

## Phase 17: Stats Section Fix & Glossary (US16, Priority: P3)

**Goal**: Honest stats on landing page. Astrology glossary/reference page.

**Independent Test**: Visit landing page → stats show real database counts. Visit glossary → search for terms, browse reference data.

- [ ] T126 [US16] Create API route `src/app/api/stats/route.ts` and fix StatsSection — GET route fetches real counts from Supabase (total charts from `charts` table, total users from auth.users count). Cache 1h server-side. Update StatsSection component to fetch from `/api/stats` and display actual numbers instead of hardcoded values (SC-007)
- [ ] T127 [P] Create API route `src/app/api/glossary/route.ts` — GET, calls `glossary.getTerms()`, `getCategories()`, `searchTerms()`, and reference data: `data.getZodiacSigns()`, `data.getPlanets()`, `data.getAspects()`, `data.getHouses()`, `data.getElements()`, `data.getModalities()`, `data.getPoints()`. Supports `?search=` and `?category=` query params
- [ ] T128 [P] Create glossary page `src/app/(main)/glossary/page.tsx` + client component — search input, category filter, term cards with definitions, reference data sections (zodiac signs, planets, aspects, houses, elements, modalities). Contextual help links from other pages point here (FR-029i)

**Checkpoint**: All P3 features complete.

### Phase 17 Gate

- [ ] PG-17a Run `npm run build` — zero errors, zero warnings
- [ ] PG-17b Run `npm run test` — all existing Playwright tests pass
- [ ] PG-17c Write Playwright tests: stats section shows real database numbers, glossary search and category filter, glossary term display, reference data sections — mobile (375px) + desktop (1280px)
- [ ] PG-17d Commit: `phase-17: stats fix & glossary`

---

## Phase 18: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, accessibility audit, account deletion, CI pipeline, remove old pages, verify completeness.

### Cleanup

- [ ] T129 Remove explore page `src/app/(main)/explore/` — add 301 redirect to `/dashboard` in next.config.js (FR-059). All demo functionality now has dedicated pages
- [ ] T130 Remove remaining old product pages — delete `src/app/(main)/ascendant/page.tsx`, delete `src/app/(main)/horoscopes/*/page.tsx` (6 old product pages). Add redirects in next.config.js for bookmarked URLs. Note: `/daily` and `/horoscope/[slug]` already handled by T049

### Account & Privacy

- [ ] T131 Create account deletion settings page `src/app/(main)/settings/page.tsx` + `src/components/settings/DeleteAccountSection.tsx` — account deletion flow per FR-051: confirmation dialog, deletes ALL user data (charts, partner_charts, feature_results, profile) from Supabase, then signs out. Partner charts individually deletable from dashboard (add delete button to partner list)

### Accessibility Audit

- [ ] T132 Accessibility audit and fixes — verify across all new pages per FR-029a-d and FR-029i-j: (a) body text ≥ 16px, labels ≥ 14px, nothing < 12px (FR-029a); (b) all interactive elements ≥ 44x44px touch targets (FR-029b); (c) text contrast meets WCAG AA 4.5:1 (FR-029c); (d) `prefers-reduced-motion` disables/simplifies all Framer Motion and CSS animations (FR-029d); (e) dense data sections have expandable explanations and visual hierarchy (FR-029i); (f) all keyboard-navigable elements have visible focus indicators, tab order follows visual layout, modal dialogs trap focus (FR-029j). Fix any violations found

### Verification & CI

- [ ] T133 [P] Verify all PostHog analytics events fire correctly on each feature page (FR-041) — check feature_page_view, feature_result_loaded, feature_error events on a sample of pages from each namespace
- [ ] T134 Create GitHub Actions CI workflow `.github/workflows/ci.yml` — runs on every PR per FR-028: `npm ci`, `npm run build`, `npx playwright install --with-deps`, `npm run test`. Tests run at both mobile (375px) and desktop (1280px) viewports (FR-028a). Fails PR if build or tests fail. Cache node_modules and Playwright browsers for speed
- [ ] T135 Verify zero duplicate data entry — audit all feature pages per FR-027: auth users with complete chart data MUST never see a birth data form on single-input pages. Partner data entered once MUST be reusable via PartnerSelector across all dual-input pages (compatibility, composite, relationship, Chinese compatibility, numerology compatibility, synastry tarot)
- [ ] T136 Verify zero "Скоро" instances remain — grep entire codebase for "Скоро", "coming soon", "незабаром", "скоро буде", confirm zero matches. If anything is found: remove the element entirely (not replace with placeholder — the feature either works or the element doesn't exist)
- [ ] T137 Update navigation menus to include all newly implemented pages — add links for every new feature page to DesktopNav and MobileNav dropdowns per FR-024/FR-025a. Verify every implemented feature is reachable from nav. Verify zero dead links or placeholder items

### Final Validation

- [ ] T138 Run `npm run build` — verify zero TypeScript errors, all pages build
- [ ] T139 Run `npm run test` — verify all existing + new Playwright tests pass

### Phase 18 Gate

- [ ] PG-18a Run `npm run build` — zero errors, zero warnings
- [ ] PG-18b Run `npm run test` — ALL Playwright tests pass (existing + all new phase tests)
- [ ] PG-18c Write Playwright tests: old page redirects work (explore→dashboard, ascendant, old horoscopes), account deletion flow, CI workflow passes, accessibility spot-checks (text sizes, touch targets, focus indicators) — mobile (375px) + desktop (1280px)
- [ ] PG-18d **FINAL MILESTONE**: Full end-to-end regression across all features. Verify on production after deploy
- [ ] PG-18e Commit: `phase-18: polish, accessibility, CI, cleanup, final validation`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Auth Fixes, US14)**: Depends on T018 (useAuthChart hook) from Phase 1
- **Phase 3 (Homepage, US13)**: Depends on Phase 2 (auth flow must work first)
- **Phase 4 (Nav, US15)**: Can start after Phase 1 (nav links point to new routes)
- **Phases 5-8 (P1 features)**: Depend on Phase 1 (shared components). Can run in parallel with each other
- **Phases 9-15 (P2 features)**: Depend on Phase 1. Can run in parallel with each other and with Phases 5-8
- **Phases 16-17 (P3 features)**: Depend on Phase 1. Can run in parallel
- **Phase 18 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US14 (Auth Fixes)**: Phase 1 only — can start first
- **US13 (Homepage)**: Depends on US14 (auth must work correctly)
- **US15 (Nav)**: Depends on Phase 1 — can run in parallel with US14
- **US1 (Natal Chart)**: Phase 1 only — independent
- **US2 (Horoscopes)**: Phase 1 only — independent
- **US3 (Compatibility)**: Phase 1 only — independent
- **US4 (Transit)**: Phase 1 only — independent
- **US5-US11 (P2)**: Phase 1 only — all independent of each other
- **US12, US16 (P3)**: Phase 1 only — independent

### Within Each User Story

1. API route(s) first
2. Page component(s) second
3. Integration/polish third

### Parallel Opportunities

**Phase 1 (all [P] tasks)**: T003-T019 can all run in parallel (different files).

**P1 Feature Pages (after Phase 1)**: US1, US2, US3, US4 can all be built in parallel — they share no files.

**P2 Feature Pages**: All P2 stories (US5-US11) can run in parallel.

**Within stories**: API routes marked [P] within a story can be built in parallel.

---

## Parallel Example: Phase 6 (Horoscopes, US2)

```text
# Parallel batch 1 — all API routes (different files):
T038: Create /api/horoscope/daily/[sign]/route.ts
T039: Create /api/horoscope/weekly/[sign]/route.ts
T040: Create /api/horoscope/monthly/[sign]/route.ts
T041: Create /api/horoscope/yearly/[sign]/route.ts
T042: Create /api/horoscope/personal/route.ts
T043: Create /api/horoscope/chinese/route.ts

# Parallel batch 2 — pages (after routes exist):
T045: Create weekly horoscope page
T046: Create monthly horoscope page
T047: Create yearly horoscope page

# Sequential (depends on batch 1):
T044: Create daily horoscope page (needs T038 + T042)
T048: Create Chinese horoscope page (needs T043)
T049: Remove/redirect old pages (after all new pages exist)
```

---

## Implementation Strategy

### MVP First (P1 Only — Phases 1-8)

1. Complete Phase 1: Setup (shared infra — api-client, sanitizers, components, hooks)
2. Complete Phase 2: Auth flow fixes (US14)
3. Complete Phase 3: Auth-aware homepage & dashboard (US13)
4. Complete Phase 4: Navigation overhaul (US15)
5. Complete Phases 5-8: Core features (natal, horoscopes, compatibility, transit)
6. **STOP and VALIDATE**: All P1 stories independently testable. Deploy
7. Verify on production: auth flow, navigation, all P1 feature pages

### Incremental Delivery (P2)

1. Add P2 stories one at a time or in parallel
2. Each story deployable independently
3. Verify each on production after deploy

### Final Polish (P3 + Cleanup)

1. Add P3 stories (insights, stats fix, glossary)
2. Remove old pages, accessibility audit, account deletion
3. CI pipeline, final build + test validation

---

## FR Coverage Map

Every functional requirement maps to specific tasks:

| FR | Tasks | Notes |
| -- | ----- | ----- |
| FR-001 | All page tasks | Every namespace covered |
| FR-002 | T012, all page tasks | AnalysisSection renders all non-null fields |
| FR-003 | All API route tasks | Direct SDK calls |
| FR-004 | T035 | API SVG primary, local fallback |
| FR-005-016 | Phases 5-17 | One or more pages per namespace |
| FR-017 | T027 | Auth redirect to /dashboard |
| FR-018 | T020 | Quiz redirect only |
| FR-019 | T013, T025 | Auto-submit via FeaturePageLayout |
| FR-020/020a | T024 | Gender save + prefer not to say |
| FR-021 | T023 | SessionStorage cleanup |
| FR-022 | T022 | Moon page guard |
| FR-023/023a | T021, T028 | Login redirect + dashboard content |
| FR-024 | T030, T031, T137 | Nav access all features |
| FR-025/025a | T026, T030, T031, T136 | Zero "Скоро", progressive nav |
| FR-026/026a | All tasks | Ukrainian UI, English API fallback |
| FR-027/027a/027b | T010, T050, T135 | PartnerSelector, CRUD API, verification |
| FR-028/028a | T134 | CI workflow with mobile viewports |
| FR-029a-d | T132 | Accessibility audit |
| FR-029e | T030, T031 | Clear nav labels |
| FR-029f | T008 | Form validation |
| FR-029g | T011, T013, T014 | Loading states |
| FR-029h | T014 | Error states |
| FR-029i | T012, T117, T128, T132 | Contextual help, glossary links |
| FR-029j | T132 | Focus indicators, tab order |
| FR-030 | T018 | Primary chart pinning |
| FR-031 | T081-T089 | Card images from API |
| FR-032 | T104, T108 | API-generated map |
| FR-033 | T028 | Curated static list |
| FR-034 | T008 | Date range validation |
| FR-035 | T082-T086 | Re-draw confirmation dialog |
| FR-037 | T004 | Performance targets in api-client |
| FR-038 | T007, all API routes | Cache TTLs per data-model.md |
| FR-039 | T004 | Rate limiting in api-client |
| FR-041 | T019, T133 | PostHog events |
| FR-042 | T004, all API routes | Sentry error capture |
| FR-043 | T028, T030 | Feature overview, nav descriptions |
| FR-044 | T016, nested pages | Breadcrumb component |
| FR-045 | T013 | FeaturePageLayout pattern |
| FR-046 | T014 | ErrorState component |
| FR-047 | T015 | PartialErrorBanner component |
| FR-048 | T013 | Back button form state |
| FR-049 | T012 | Collapsible sections |
| FR-050 | T017, T013 | BirthTimeWarning component |
| FR-051 | T131 | Account deletion |
| FR-052 | T005, T006, T011, T050 | SVG + input sanitization |
| FR-053 | T013 | Auto-submit variants |
| FR-054 | T008 | BirthDataForm field set variants |
| FR-055 | T008 | Geocoding disambiguation |
| FR-056 | — | Architectural (TypeScript handles) |
| FR-057 | T004 | Max 6 concurrent per page |
| FR-058 | All page tasks | Separate routes = auto code splitting |
| FR-059 | T129 | Remove /explore with redirect |
| FR-060 | T013 | Gender prompt for existing users |
| FR-061 | T030, T031 | Max 7 categories, hamburger, search |

---

## Summary

| Metric | Count |
| ------ | ----- |
| Total feature tasks | 139 (T001-T139) |
| Phase gate tasks | 73 (PG-01a through PG-18e) |
| Phase 1 (Setup) | 19 tasks + 4 gate |
| P1 User Stories (US1-US4, US13-US15) | 46 tasks + 29 gate |
| P2 User Stories (US5-US11) | 50 tasks + 29 gate |
| P3 User Stories (US12, US16) | 9 tasks + 8 gate |
| Polish (Phase 18) | 11 tasks + 5 gate |
| Parallelizable tasks | 78 (56%) |
| New API routes | ~28 |
| New pages | 46 (44 feature + glossary + settings) |
| Enhanced existing pages | 6 |
| FRs with task coverage | 59/59 active FRs (100%) |
| FRs deferred | 2 (FR-036, FR-040) |

## Notes

- [P] tasks = different files, no dependencies — can run concurrently
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- **Phase gates are mandatory** — no phase is complete without passing all PG-xx tasks
- **Zero "Скоро" policy** — enforced at every phase gate. Features either fully work or don't exist. No placeholders, no disabled items, no "coming soon" anywhere
- **Mobile-first testing** — all UI tests run at 375px (primary) and 1280px viewports
- **No duplicate data entry** — auth users never re-enter data that's already saved (T135)
- **CI on every PR** — GitHub Actions runs build + tests automatically (T134)
- **FR Coverage Map** — every active FR has explicit task coverage (see table above)
- **Sentry on every API route** — via api-client.ts wrapper (T004), severity per FR-042
- **Sanitization everywhere** — SVG (T005), input (T006), used by components T011/T008/T050
- Commit after each phase gate passes. Never merge — merging is user's responsibility
- Stop at any checkpoint to validate story independently
- Suggested MVP scope: Phases 1-8 (all P1 stories)
