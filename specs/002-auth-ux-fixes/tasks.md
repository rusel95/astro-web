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

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database migrations, shared types, reusable components, and hook that all stories depend on.

- [ ] T001 Create Supabase migration for `feature_results` table in `supabase/migrations/` — schema per data-model.md (id, user_id, chart_id, feature_type, feature_params, result_data, expires_at, created_at + RLS policies + index)
- [ ] T002 Create Supabase migration for `partner_charts` table in `supabase/migrations/` — schema per data-model.md (id, user_id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender + RLS policy)
- [ ] T003 [P] Create feature types file `src/types/features.ts` — FeatureType union type, FeatureResult interface, PartnerChart interface, cache TTL map
- [ ] T004 [P] Create feature cache helper `src/lib/feature-cache.ts` — getCachedResult(), saveCachedResult(), clearExpiredResults() using Supabase `feature_results` table
- [ ] T005 [P] Create `useAuthChart` hook in `src/hooks/useAuthChart.ts` — checks auth status, loads user's latest chart from Supabase, returns { user, chart, isComplete, isLoading }
- [ ] T006 [P] Create `BirthDataForm` component in `src/components/feature/BirthDataForm.tsx` — compact inline form (name, gender, DOB, time, city), pre-fills from initialData, includes ChartSelector for auth users. Birth time field supports "Невідомо" option → defaults to 12:00, shows accuracy notice
- [ ] T007 [P] Create `ChartSelector` component in `src/components/feature/ChartSelector.tsx` — dropdown fetching from `/api/charts/my`, shows chart name + birth date
- [ ] T008 [P] Create `SvgChartViewer` component in `src/components/feature/SvgChartViewer.tsx` — renders API SVG string with dark background, responsive sizing, loading state
- [ ] T009 [P] Create `AnalysisSection` component in `src/components/feature/AnalysisSection.tsx` — recursively renders structured API JSON data with Ukrainian labels for common keys, handles nested objects/arrays
- [ ] T010 [P] Create `FeaturePageLayout` component in `src/components/feature/FeaturePageLayout.tsx` — standard layout: title, description, BirthDataForm (or auto-submit), result area, loading/error states. Auto-emits `feature_page_view` PostHog event on mount. When useAuthChart detects missing gender on existing chart, shows one-time prompt to complete profile. Integrates feature-cache.ts: checks cached result before API call, saves result after fetch
- [ ] T011 [P] Add new PostHog events in `src/lib/analytics/events.ts` — feature_page_view, feature_result_loaded, feature_error, feature_form_submit for each feature category

**Checkpoint**: Shared infrastructure ready. All user story phases can begin.

---

## Phase 2: Foundational — Auth Flow Fixes (US14, Priority: P1)

**Goal**: Fix all auth UX issues: quiz redirect, form auto-submit, gender pre-fill, sessionStorage cleanup, moon page guard.

**Independent Test**: Auth user can navigate to any feature page without unwanted redirect. Unauth user sees no personal data on moon page. Logout clears sessionStorage.

- [ ] T012 [US14] Fix quiz redirect — in `src/app/(quiz)/quiz/QuizClient.tsx`, redirect auth users to `/chart/new` using `useEffect` + Supabase `getUser()` check
- [ ] T013 [US14] Fix login page redirect — in `src/app/(main)/auth/login/page.tsx`, redirect auth users to `/dashboard`
- [ ] T014 [US14] Fix MoonTransitCard — in `src/components/moon/MoonTransitCard.tsx`, hide "У вашому чарті" section when user is not authenticated (check auth state, don't show hardcoded house=1)
- [ ] T015 [US14] Add sessionStorage cleanup on logout — in the auth state change handler (likely `src/components/` auth provider or layout), clear all sessionStorage on `SIGNED_OUT` event
- [ ] T016 [US14] Fix gender save — verify `src/app/api/chart/route.ts` saves gender from request body to charts table; if not, add gender to the INSERT/UPDATE query
- [ ] T017 [US14] Fix product form auto-submit — update `src/components/product/ProductForm.tsx` to skip form entirely when auth user has complete chart data (name, DOB, time, city, gender all present). Auto-call API with chart data and show results directly
- [ ] T018 [US14] Remove all "Скоро" text — grep codebase for "Скоро", "coming soon", "незабаром", remove/replace with actual functionality or remove the block entirely. T125 will verify zero remain after all phases

**Checkpoint**: Auth flow fixed. Users can navigate freely, forms auto-submit, privacy protected.

---

## Phase 3: Auth-Aware Homepage (US13, Priority: P1)

**Goal**: Auth users see personalized dashboard instead of marketing landing.

**Independent Test**: Login → homepage shows greeting, daily horoscope, saved charts. Logout → homepage shows marketing CTAs.

- [ ] T019 [US13] Refactor homepage `src/app/(main)/page.tsx` — detect auth state server-side or client-side. If auth: render personalized content (greeting with name, daily horoscope snippet, chart list). If unauth: keep existing marketing landing
- [ ] T020 [US13] Create `DashboardHome` component in `src/components/home/DashboardHome.tsx` — personalized view: "Привіт, {name}", daily horoscope card (from `/api/horoscope/daily/{sign}` based on user's Sun sign), list of saved charts, feature grid showing top 6 most popular categories the user hasn't tried yet (transit, tarot, compatibility, numerology, Chinese, traditional)
- [ ] T021 [US13] Remove auth-user-facing "Створити акаунт" CTAs — audit all components for signup CTAs that show to auth users, conditionally hide them

**Checkpoint**: Homepage is auth-aware. Auth users see personalized content.

---

## Phase 4: Navigation Overhaul (US15, Priority: P1)

**Goal**: Navigation menus give access to ALL feature categories via dropdowns.

**Independent Test**: Desktop: hover each nav dropdown → see all feature links. Mobile: tap hamburger → see all categories with expandable sections. Every link goes to a working page.

- [ ] T022 [US15] Redesign desktop navigation in `src/components/nav/` — implement dropdown menus: Гороскопи, Карти, Таро, Аналіз, Ще (per contracts/pages.md navigation structure)
- [ ] T023 [US15] Redesign mobile navigation in `src/components/nav/` — bottom tab bar (Головна, Карти, Гороскопи, Таро, Ще) + full-screen expandable menu for "Ще"
- [ ] T024 [US15] Fix broken product page navigation — remove auth-only redirect logic from `src/app/(main)/horoscopes/*/page.tsx`, `src/app/(main)/ascendant/page.tsx` so pages load for all users. Actual page removal/redirects handled later in T041 (horoscopes) and T120 (others)

**Checkpoint**: Users can navigate to every feature from the menu.

---

## Phase 5: Complete Natal Chart Experience (US1, Priority: P1)

**Goal**: Natal chart page shows ALL API data: planets, houses, aspects, dignities, enhanced aspects, natal report, API SVG.

**Independent Test**: Create chart → see API SVG, all planet positions, houses, aspects with orbs, essential dignities, full natal report with interpretations.

- [ ] T025 [US1] Enhance `/api/chart` route in `src/app/api/chart/route.ts` — add calls to `client.analysis.getNatalReport()`, `client.data.getEnhancedPositions()`, `client.data.getEnhancedAspects()`, `client.enhanced.getEnhancedNatalChart()` alongside existing getNatalChart + getSvg. Return all data
- [ ] T026 [US1] Enhance chart results page `src/app/(main)/chart/[id]/page.tsx` — add new tabs/sections: "Звіт" (natal report), "Гідності" (dignities), "Розширені аспекти" (enhanced aspects). Display ALL fields from API responses
- [ ] T027 [US1] Replace local NatalChartWheel with API SVG — in chart results page, use `SvgChartViewer` component to display the `svg_content` from API instead of the local SVG renderer. Keep local renderer as fallback only
- [ ] T028 [US1] Display complete planet data — in PlanetsTable, show degree/minute, retrograde status, house placement, speed, dignity status for each planet (using enhanced positions data)
- [ ] T029 [US1] Display complete aspect data — in AspectsTable, show applying/separating status, orb, reception data from enhanced aspects

**Checkpoint**: Natal chart shows complete, professional-grade data from API.

---

## Phase 6: All Horoscope Forecasts (US2, Priority: P1)

**Goal**: Daily, weekly, monthly, yearly, personal, and Chinese horoscope pages — each showing ALL API data.

**Independent Test**: Visit each horoscope page → select sign → see complete forecast data with all categories, ratings, lucky numbers.

- [ ] T030 [P] [US2] Create API route `src/app/api/horoscope/daily/[sign]/route.ts` — calls `getSignDailyHoroscope()` + `getSignDailyHoroscopeText()`, returns combined data
- [ ] T031 [P] [US2] Create API route `src/app/api/horoscope/weekly/[sign]/route.ts` — calls `getSignWeeklyHoroscope()`
- [ ] T032 [P] [US2] Create API route `src/app/api/horoscope/monthly/[sign]/route.ts` — calls `getSignMonthlyHoroscope()`
- [ ] T033 [P] [US2] Create API route `src/app/api/horoscope/yearly/[sign]/route.ts` — calls `getSignYearlyHoroscope()`
- [ ] T034 [P] [US2] Create API route `src/app/api/horoscope/personal/route.ts` — POST, calls `getPersonalDailyHoroscope()` with subject
- [ ] T035 [P] [US2] Create API route `src/app/api/horoscope/chinese/route.ts` — POST, calls `getChineseHoroscope()` with subject
- [ ] T036 [US2] Create daily horoscope page `src/app/(main)/horoscope/daily/page.tsx` + client component — sign selector (12 zodiac icons), displays all horoscope categories, ratings, personal horoscope section for auth users
- [ ] T037 [P] [US2] Create weekly horoscope page `src/app/(main)/horoscope/weekly/page.tsx` + client component — sign selector, full weekly forecast
- [ ] T038 [P] [US2] Create monthly horoscope page `src/app/(main)/horoscope/monthly/page.tsx` + client component — sign selector, full monthly forecast
- [ ] T039 [P] [US2] Create yearly horoscope page `src/app/(main)/horoscope/yearly/page.tsx` + client component — sign selector, full yearly overview
- [ ] T040 [US2] Create Chinese horoscope page `src/app/(main)/horoscope/chinese/page.tsx` + client component — uses FeaturePageLayout with BirthDataForm, displays Chinese horoscope data
- [ ] T041 [US2] Remove/redirect old horoscope pages — delete `src/app/(main)/horoscope/[slug]/page.tsx` (catches new sub-routes), delete `src/app/(main)/daily/page.tsx`, redirect `/daily` → `/horoscope/daily` and `/horoscopes/*` → `/horoscope/*` via next.config.js

**Checkpoint**: All 6 horoscope types working with complete API data.

---

## Phase 7: Relationship & Compatibility Suite (US3, Priority: P1)

**Goal**: Full synastry, composite, compatibility scores, relationship insights — all API-powered.

**Independent Test**: Enter two birth data sets → see synastry chart SVG, composite chart, compatibility scores by category, love languages, red flags.

- [ ] T042 [US3] Enhance `/api/compatibility` route in `src/app/api/compatibility/route.ts` — replace local synastry with `getSynastryChart()` + `getSynastryChartSvg()` + `getSynastryReport()` + `getCompatibilityAnalysis()` + `getCompatibilityScore()` + `enhanced.getEnhancedSynastryChart()`
- [ ] T043 [US3] Enhance compatibility page `src/app/(main)/compatibility/page.tsx` — redesign to show API SVG bi-wheel, full synastry report, compatibility scores by life area, all API fields
- [ ] T044 [P] [US3] Create API route `src/app/api/composite/route.ts` — calls `getCompositeChart()` + `getCompositeChartSvg()` + `getCompositeReport()`
- [ ] T045 [P] [US3] Create composite page `src/app/(main)/composite/page.tsx` + client component — dual BirthDataForm, composite chart SVG, full composite report
- [ ] T046 [P] [US3] Create API route `src/app/api/relationship-insights/route.ts` — calls `insights.relationship.getCompatibility()`, `getLoveLanguages()`, `getRedFlags()`, `getTiming()`
- [ ] T047 [P] [US3] Create relationship insights page `src/app/(main)/relationship/page.tsx` + client component — love languages, red flags, timing sections with all API data

**Checkpoint**: Full relationship suite working — synastry, composite, compatibility, insights.

---

## Phase 8: Transit & Predictive Tools (US4, Priority: P1)

**Goal**: Transit chart, transit report, upcoming transits timeline, solar/lunar returns, predictive analysis.

**Independent Test**: Select a saved chart → see transit bi-wheel SVG, current transits list, upcoming exact dates, transit interpretation.

- [ ] T048 [US4] Create API route `src/app/api/transit/route.ts` — calls `getTransitChart()` + `getTransitChartSvg()` + `getTransitReport()` + `getNatalTransitReport()` + `getNatalTransits()` + `enhanced.getEnhancedTransitChart()`
- [ ] T049 [US4] Create transit page `src/app/(main)/transit/page.tsx` + client component — date picker for transit date, ChartSelector for natal chart, bi-wheel SVG, transit aspects list, upcoming transits timeline, transit report sections
- [ ] T050 [P] [US4] Create API route `src/app/api/solar-return/route.ts` — calls `getSolarReturnChart()` + `getSolarReturnChartSvg()` + `getSolarReturnReport()` + `getSolarReturnTransits()`
- [ ] T051 [P] [US4] Create solar return page `src/app/(main)/solar-return/page.tsx` + client component — year selector, chart SVG, yearly themes report
- [ ] T052 [P] [US4] Create API route `src/app/api/lunar-return/route.ts` — calls `getLunarReturnChart()` + `getLunarReturnChartSvg()` + `getLunarReturnReport()` + `getLunarReturnTransits()`
- [ ] T053 [P] [US4] Create lunar return page `src/app/(main)/lunar-return/page.tsx` + client component — date picker, chart SVG, monthly cycle report
- [ ] T054 [P] [US4] Create predictive analysis page `src/app/(main)/analysis/predictive/page.tsx` + client component — upcoming trends and timing. Uses dynamic `/api/analysis/predictive` route (handled by T060's `[type]` route)

**Checkpoint**: All P1 features complete. Core product fully functional.

---

## Phase 9: Progressions & Directions (US5, Priority: P2)

**Goal**: Secondary progressions and solar arc directions pages with chart data + reports.

**Independent Test**: Enter birth data + target date → see progressed positions, progression report.

- [ ] T056 [P] [US5] Create API route `src/app/api/progressions/route.ts` — calls `getProgressions()` + `getProgressionReport()`
- [ ] T057 [P] [US5] Create API route `src/app/api/directions/route.ts` — calls `getDirections()` + `getDirectionReport()`
- [ ] T058 [US5] Create progressions page `src/app/(main)/progressions/page.tsx` + client component — date picker, progressed chart data, progression report
- [ ] T059 [US5] Create directions page `src/app/(main)/directions/page.tsx` + client component — date picker, directed positions, direction report

**Checkpoint**: Advanced chart types available.

---

## Phase 10: Specialized Analysis Reports (US6, Priority: P2)

**Goal**: 8 unique analysis pages — career, health, karmic, psychological, spiritual, vocational, lunar, relocation.

**Independent Test**: Visit career analysis → enter birth data → see complete career report with all API sections.

- [ ] T060 [US6] Create dynamic API route `src/app/api/analysis/[type]/route.ts` — maps type param to appropriate `client.analysis.get*Analysis()` method (career, health, karmic, psychological, spiritual, vocational, lunar). Validate type, return full API response
- [ ] T061 [US6] Create shared analysis client component `src/components/feature/AnalysisPageClient.tsx` — reusable client component for all analysis pages: FeaturePageLayout + BirthDataForm + AnalysisSection. Takes analysisType prop
- [ ] T062 [P] [US6] Create career analysis page `src/app/(main)/analysis/career/page.tsx` — metadata + AnalysisPageClient with type="career"
- [ ] T063 [P] [US6] Create health analysis page `src/app/(main)/analysis/health/page.tsx`
- [ ] T064 [P] [US6] Create karmic analysis page `src/app/(main)/analysis/karmic/page.tsx`
- [ ] T065 [P] [US6] Create psychological analysis page `src/app/(main)/analysis/psychological/page.tsx`
- [ ] T066 [P] [US6] Create spiritual analysis page `src/app/(main)/analysis/spiritual/page.tsx`
- [ ] T067 [P] [US6] Create vocational analysis page `src/app/(main)/analysis/vocational/page.tsx`
- [ ] T068 [P] [US6] Create lunar analysis page `src/app/(main)/analysis/lunar/page.tsx`
- [ ] T069 [US6] Create relocation analysis page `src/app/(main)/analysis/relocation/page.tsx` + client component — requires additional location input (city picker for target location), calls `getRelocationAnalysis()`

**Checkpoint**: All 8 specialized analyses working.

---

## Phase 11: Tarot Section (US7, Priority: P2)

**Goal**: 9 tarot pages — daily card, single card, three-card, Celtic Cross, houses spread, Tree of Life, birth cards, synastry tarot, transit tarot.

**Independent Test**: Visit daily tarot → see today's card with image + interpretation. Visit Celtic Cross → draw 10 cards → see full spread interpretation.

- [ ] T070 [P] [US7] Create API route `src/app/api/tarot/daily/route.ts` — calls `getDailyCard()`, returns card data
- [ ] T071 [P] [US7] Create API route `src/app/api/tarot/draw/route.ts` — POST with count + spread_type, calls `drawCards()` + appropriate `generate*Report()` method
- [ ] T072 [P] [US7] Create API route `src/app/api/tarot/birth-cards/route.ts` — POST with subject, calls `calculateBirthCards()`
- [ ] T073 [US7] Create tarot hub page `src/app/(main)/tarot/page.tsx` + client component — daily card display, links to all spread types, card browser using `getAllCards()`, tarot introduction text
- [ ] T074 [P] [US7] Create single card page `src/app/(main)/tarot/single/page.tsx` + client component — draw button, card display, single card report
- [ ] T075 [P] [US7] Create three-card page `src/app/(main)/tarot/three-card/page.tsx` + client component — draw button, 3 cards in row (past/present/future), three-card report
- [ ] T076 [P] [US7] Create Celtic Cross page `src/app/(main)/tarot/celtic-cross/page.tsx` + client component — draw button, 10-card layout, Celtic Cross report
- [ ] T077 [P] [US7] Create houses spread page `src/app/(main)/tarot/houses/page.tsx` + client component — 12-card layout, houses report
- [ ] T078 [P] [US7] Create Tree of Life page `src/app/(main)/tarot/tree-of-life/page.tsx` + client component — draw + Tree of Life layout, report
- [ ] T079 [US7] Create birth cards page `src/app/(main)/tarot/birth-cards/page.tsx` + client component — BirthDataForm, personality + soul card display
- [ ] T079a [P] [US7] Create synastry tarot page `src/app/(main)/tarot/synastry/page.tsx` + client component — dual BirthDataForm, calls `/api/tarot/draw` with `generateSynastryReport()`, shows paired card reading
- [ ] T079b [P] [US7] Create transit tarot page `src/app/(main)/tarot/transit/page.tsx` + client component — BirthDataForm + date picker, calls `/api/tarot/draw` with `generateTransitReport()`, shows transit-themed card reading

**Checkpoint**: Complete tarot section with 9 spread types (including synastry and transit tarot).

---

## Phase 12: Chinese Astrology Section (US8, Priority: P2)

**Goal**: BaZi, luck pillars, Ming Gua, compatibility, yearly forecast, element analysis.

**Independent Test**: Enter birth data → see BaZi four pillars, luck pillars timeline, Ming Gua number.

- [ ] T080 [P] [US8] Create API route `src/app/api/chinese/bazi/route.ts` — POST, calls `calculateBaZi()` + `calculateLuckPillars()` + `calculateMingGua()` + `getZodiacAnimal()`
- [ ] T081 [P] [US8] Create API route `src/app/api/chinese/compatibility/route.ts` — POST, calls `calculateCompatibility()`
- [ ] T082 [P] [US8] Create API route `src/app/api/chinese/forecast/route.ts` — POST, calls `getYearlyForecast()` + `analyzeYearElements()` + `getSolarTerms()`
- [ ] T083 [US8] Create Chinese astrology hub `src/app/(main)/chinese/page.tsx` + client component — BirthDataForm, BaZi four pillars display, luck pillars timeline, Ming Gua with directions, zodiac animal
- [ ] T084 [P] [US8] Create Chinese compatibility page `src/app/(main)/chinese/compatibility/page.tsx` + client component — dual BirthDataForm, compatibility result
- [ ] T085 [P] [US8] Create Chinese forecast page `src/app/(main)/chinese/forecast/page.tsx` + client component — year selector, yearly forecast, element analysis

**Checkpoint**: Chinese astrology section complete.

---

## Phase 13: Traditional Astrology Section (US9, Priority: P2)

**Goal**: Traditional analysis, dignities, Arabic lots, profections, firdaria, zodiacal releasing, sect, bounds.

**Independent Test**: View traditional analysis for a chart → see dignities table, Arabic lots, profection timeline.

- [ ] T086 [P] [US9] Create API route `src/app/api/traditional/analysis/route.ts` — POST, calls `getAnalysis()` + `getDignitiesAnalysis()` + `getLotsAnalysis()` + `getSectAnalysis()` + `getBoundsAnalysis()`
- [ ] T087 [P] [US9] Create API route `src/app/api/traditional/profections/route.ts` — POST, calls `getProfectionsAnalysis()` + `getAnnualProfection()` + `getProfectionTimeline()`
- [ ] T088 [P] [US9] Create API route `src/app/api/traditional/firdaria/route.ts` — POST, calls `getFirdaria()`
- [ ] T089 [P] [US9] Create API route `src/app/api/traditional/zodiacal-releasing/route.ts` — POST, calls `getZodiacalReleasing()`
- [ ] T090 [US9] Create traditional hub page `src/app/(main)/traditional/page.tsx` + client component — comprehensive traditional analysis: dignities table, Arabic lots, sect analysis, bounds
- [ ] T091 [P] [US9] Create profections page `src/app/(main)/traditional/profections/page.tsx` + client component — age input, annual profection, profection timeline
- [ ] T092 [P] [US9] Create firdaria page `src/app/(main)/traditional/firdaria/page.tsx` + client component — firdaria periods display
- [ ] T093 [P] [US9] Create zodiacal releasing page `src/app/(main)/traditional/zodiacal-releasing/page.tsx` + client component — lot selector, zodiacal releasing periods

**Checkpoint**: Traditional astrology section complete.

---

## Phase 14: Astrocartography (US10, Priority: P2)

**Goal**: Planetary lines map, location analysis, power zones, location comparison.

**Independent Test**: Enter birth data → see planetary lines on map. Click location → see analysis.

- [ ] T094 [P] [US10] Create API route `src/app/api/astrocartography/map/route.ts` — POST, calls `getLines()` + `generateMap()` + `getCrossings()` + `getParanLines()`
- [ ] T095 [P] [US10] Create API route `src/app/api/astrocartography/location/route.ts` — POST, calls `analyzeLocation()` + `getLocationReport()` + `getRelocationChart()` + `getLocalSpace()`
- [ ] T096 [P] [US10] Create API route `src/app/api/astrocartography/power-zones/route.ts` — POST, calls `findPowerZones()`
- [ ] T097 [P] [US10] Create API route `src/app/api/astrocartography/compare/route.ts` — POST, calls `compareLocations()`
- [ ] T098 [US10] Create astrocartography map page `src/app/(main)/astrocartography/page.tsx` + client component — birth data form, map visualization (API SVG or image), planetary lines list, power zones section
- [ ] T099 [US10] Create location analysis page `src/app/(main)/astrocartography/location/page.tsx` + client component — city search input, location analysis display, comparison tool

**Checkpoint**: Astrocartography section complete.

---

## Phase 15: Numerology, Fixed Stars, Eclipses, Lunar (US11, Priority: P2)

**Goal**: Dedicated pages for numerology, fixed stars, eclipses, and enhanced lunar calendar.

**Independent Test**: Visit numerology → enter birth data → see core numbers + comprehensive report. Visit eclipses → see upcoming eclipses + natal impact.

- [ ] T100 [P] [US11] Create API route `src/app/api/numerology/route.ts` — POST, calls `getCoreNumbers()` + `getComprehensiveReport()`
- [ ] T101 [P] [US11] Create API route `src/app/api/numerology/compatibility/route.ts` — POST, calls `analyzeCompatibility()`
- [ ] T102 [P] [US11] Create API route `src/app/api/fixed-stars/route.ts` — POST for `getConjunctions()` + `generateReport()`, GET for `getAllStars()` + `getPositions()` (star catalog)
- [ ] T103 [P] [US11] Create API route `src/app/api/eclipses/route.ts` — GET for `getUpcoming()` + `getHistory()` + `getSarosCycle()`, POST for `checkNatalImpact()`
- [ ] T104 [P] [US11] Create API route `src/app/api/lunar/calendar/route.ts` — GET, calls `getMansions()` + `getEvents()` + `getCalendar()` + `getVoidOfCourse()` + `getGardeningCalendar()` + `getIngresses()`
- [ ] T105 [US11] Create numerology page `src/app/(main)/numerology/page.tsx` + client component — BirthDataForm, core numbers display, comprehensive report sections
- [ ] T106 [P] [US11] Create numerology compatibility page `src/app/(main)/numerology/compatibility/page.tsx` + client component — dual BirthDataForm, compatibility result
- [ ] T107 [US11] Create fixed stars page `src/app/(main)/fixed-stars/page.tsx` + client component — BirthDataForm, natal star conjunctions table, interpretation report
- [ ] T108 [US11] Create eclipses page `src/app/(main)/eclipses/page.tsx` + client component — upcoming eclipses list (no birth data needed), natal impact section (with BirthDataForm)
- [ ] T109 [US11] Enhance moon page `src/app/(main)/moon/page.tsx` — integrate lunar API data (mansions, events, calendar, void-of-course, gardening calendar, ingresses) alongside existing astronomy-engine calculations

**Checkpoint**: All P2 features complete.

---

## Phase 16: Wellness, Financial & Business Insights (US12, Priority: P3)

**Goal**: Specialized insight pages for wellness, financial, and business analysis.

**Independent Test**: Visit wellness page → enter birth data → see body mapping, biorhythms, energy patterns.

- [ ] T110 [P] [US12] Create API route `src/app/api/insights/wellness/route.ts` — POST, calls `insights.wellness.getBodyMapping()`, `getBiorhythms()`, `getEnergyPatterns()`, `getWellnessTiming()`, `getWellnessScore()`, `getMoonWellness()`
- [ ] T111 [P] [US12] Create API route `src/app/api/insights/financial/route.ts` — POST, calls `insights.financial.getMarketTiming()`, `analyzePersonalTrading()`, `getGannAnalysis()`, `getBradleySiderograph()`
- [ ] T112 [P] [US12] Create API route `src/app/api/insights/business/route.ts` — POST, calls `insights.business.getLeadershipStyle()`, `getTeamDynamics()`, `getBusinessTiming()`, `getHiringCompatibility()`
- [ ] T113 [US12] Create wellness page `src/app/(main)/insights/wellness/page.tsx` + client component — body mapping visualization, biorhythms chart, energy patterns, wellness score, moon wellness
- [ ] T114 [P] [US12] Create financial page `src/app/(main)/insights/financial/page.tsx` + client component — market timing, personal trading analysis, Gann analysis
- [ ] T115 [P] [US12] Create business page `src/app/(main)/insights/business/page.tsx` + client component — leadership style, team dynamics, business timing

**Checkpoint**: All insight pages complete.

---

## Phase 17: Stats Section Fix & Glossary (US16, Priority: P3)

**Goal**: Honest stats on landing page. Astrology glossary/reference page.

**Independent Test**: Visit landing page → stats show real database counts. Visit glossary → search for terms, browse zodiac signs/planets/aspects reference.

- [ ] T116 [US16] Fix StatsSection in `src/components/` — fetch real counts from Supabase (total charts, total users) via `/api/stats` route, display actual numbers
- [ ] T117 [P] Create API route `src/app/api/glossary/route.ts` — GET, calls `glossary.getTerms()`, `getCategories()`, `searchTerms()`, and reference data: `data.getZodiacSigns()`, `data.getPlanets()`, `data.getAspects()`, `data.getHouses()`, `data.getElements()`, `data.getModalities()`, `data.getPoints()`. Supports `?search=` and `?category=` query params
- [ ] T118 [P] Create glossary page `src/app/(main)/glossary/page.tsx` + client component — search input, category filter, term cards with definitions, reference data sections (zodiac signs, planets, aspects, houses, elements, modalities)

**Checkpoint**: All P3 features complete.

---

## Phase 18: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, remove old pages, verify completeness.

- [ ] T119 Remove explore page `src/app/(main)/explore/` — all demo functionality now has dedicated pages
- [ ] T120 Remove remaining old product pages — delete `src/app/(main)/ascendant/page.tsx`, delete `src/app/(main)/horoscopes/*/page.tsx` (6 old product pages). Add redirects in next.config.js for any bookmarked URLs. Note: `/daily` and `/horoscope/[slug]` already handled by T041
- [ ] T121 [P] Add Ukrainian SEO metadata to ALL new pages — title, description per page in `export const metadata`
- [ ] T122 [P] Verify all PostHog analytics events fire correctly on each feature page
- [ ] T123 Run `npm run build` — verify zero TypeScript errors, all pages build. Spot-check 3 key new pages (tarot hub, transit, compatibility) at 375px viewport for mobile-first compliance
- [ ] T124 Run `npm run test` — verify all existing Playwright tests still pass
- [ ] T125 Verify zero "Скоро" instances remain — grep codebase for "Скоро", "coming soon", "незабаром", confirm zero matches (verification only, removal done in T018)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Auth Fixes, US14)**: Depends on T005 (useAuthChart hook) from Phase 1
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

**Phase 1 (all [P] tasks)**: T003-T011 can all run in parallel (different files).

**P1 Feature Pages (after Phase 1)**: US1, US2, US3, US4 can all be built in parallel — they share no files.

**P2 Feature Pages**: All P2 stories (US5-US11) can run in parallel.

**Within stories**: API routes marked [P] within a story can be built in parallel.

---

## Parallel Example: Phase 6 (Horoscopes, US2)

```text
# Parallel batch 1 — all API routes (different files):
T030: Create /api/horoscope/daily/[sign]/route.ts
T031: Create /api/horoscope/weekly/[sign]/route.ts
T032: Create /api/horoscope/monthly/[sign]/route.ts
T033: Create /api/horoscope/yearly/[sign]/route.ts
T034: Create /api/horoscope/personal/route.ts
T035: Create /api/horoscope/chinese/route.ts

# Parallel batch 2 — pages (after routes exist):
T037: Create weekly horoscope page
T038: Create monthly horoscope page
T039: Create yearly horoscope page

# Sequential (depends on batch 1):
T036: Create daily horoscope page (needs T030 + T034)
T040: Create Chinese horoscope page (needs T035)
T041: Remove/redirect old pages (after all new pages exist)
```

---

## Implementation Strategy

### MVP First (P1 Only — Phases 1-8)

1. Complete Phase 1: Setup (shared infra)
2. Complete Phase 2: Auth flow fixes (US14)
3. Complete Phase 3: Auth-aware homepage (US13)
4. Complete Phase 4: Navigation overhaul (US15)
5. Complete Phases 5-8: Core features (natal, horoscopes, compatibility, transit)
6. **STOP and VALIDATE**: All P1 stories independently testable. Deploy
7. Verify on production: auth flow, navigation, all P1 feature pages

### Incremental Delivery (P2)

8. Add P2 stories one at a time or in parallel
9. Each story deployable independently
10. Verify each on production after deploy

### Final Polish (P3 + Cleanup)

11. Add P3 stories (insights, stats fix, glossary)
12. Remove old pages, verify zero "Скоро"
13. Final build + test validation

---

## Summary

| Metric | Count |
| ------ | ----- |
| Total tasks | 126 (T001-T125 + T079a, T079b; T054 merged) |
| Phase 1 (Setup) | 11 tasks |
| P1 User Stories (US1, US2, US3, US4, US13, US14, US15) | 54 tasks |
| P2 User Stories (US5-US11) | 42 tasks |
| P3 User Stories (US12, US16) | 9 tasks |
| Polish | 7 tasks |
| Parallelizable tasks | 70 tasks (56%) |
| New API routes | ~25 |
| New pages | 44 (42 + 2 tarot) |
| Enhanced pages | 6 |

## Notes

- [P] tasks = different files, no dependencies — can run concurrently
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Suggested MVP scope: Phases 1-8 (all P1 stories)
