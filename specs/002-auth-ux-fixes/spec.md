# Feature Specification: Full Astrology API Platform & UX Fixes

**Feature Branch**: `002-auth-ux-fixes`
**Created**: 2026-02-28
**Status**: Draft
**Input**: Auth flow audit, competitive audit, and full Astrology API SDK mapping. Core principle: expose EVERY Astrology API endpoint as a unique, functional page showing ALL returned data. Fix auth/UX gaps. No blog, no payments — everything free and unblocked.

## Core Principle

The `@astro-api/astroapi-typescript` SDK provides **160+ methods across 16 namespaces**. Currently only **6 are used**. This feature implements every API endpoint as a working page where users see ALL data the API returns. Each page is unique based on what that specific API delivers. No "Скоро" blocks anywhere.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Natal Chart Experience (Priority: P1)

A user creates a natal chart and sees a full, professional result page using ALL data from the Astrology API: accurate planet positions, houses, aspects, dignities, AND a comprehensive natal report from the Analysis API. The chart SVG is fetched from the API (not rendered locally with bugs). Every data point the API returns is displayed in organized, readable tabs/sections.

**Why this priority**: The natal chart is the core product. Currently the chart page exists but shows incomplete data, has visual issues (low opacity aspects, overlapping planets), and doesn't use the Analysis API for interpretations. Making this complete and accurate is the foundation for everything else.

**Independent Test**: Create a chart → verify planet positions match a reference ephemeris, houses are correct for the birth location, aspects show clearly, and a full natal report with interpretations is displayed.

**Acceptance Scenarios**:

1. **Given** a user submits birth data, **When** the chart is generated, **Then** the API returns AND the page displays: all planet positions with sign/degree/minute, retrograde status, house placements, all aspects with orbs, house cusps for all 12 houses, and the ascendant/MC.
2. **Given** a generated chart, **When** the user views it, **Then** they see the API-provided SVG chart image (not local rendering), plus organized data tabs: Planets, Houses, Aspects, Dignities, Report.
3. **Given** the chart result page, **When** the "Report" tab is viewed, **Then** a full natal report from `client.analysis.getNatalReport()` is displayed with ALL returned sections and interpretations in Ukrainian.
4. **Given** the chart result page, **When** the "Dignities" section loads, **Then** essential dignities from `client.data.getEnhancedPositions()` show each planet's dignity status (domicile, exaltation, detriment, fall, peregrine).
5. **Given** the chart result page, **When** the "Aspects" section loads, **Then** enhanced aspects from `client.data.getEnhancedAspects()` show traditional analysis including receptions and sect.

---

### User Story 2 - All Horoscope Forecasts (Priority: P1)

Users can access daily, weekly, monthly, and yearly horoscope forecasts — both generic (by sign) and personalized (by birth data). Each forecast type has its own page showing ALL data the API returns. Chinese horoscopes are also available.

**Why this priority**: Horoscopes drive daily engagement and return visits. The API provides 10 horoscope methods but currently only 1 is used (sign daily).

**Independent Test**: Visit daily/weekly/monthly/yearly horoscope pages → verify each shows complete forecast data from the API, not generic placeholder text.

**Acceptance Scenarios**:

1. **Given** the daily horoscope page, **When** a user selects their sign, **Then** `getSignDailyHoroscope()` AND `getSignDailyHoroscopeText()` data is shown — all categories (general, love, career, health), ratings, lucky numbers, mood.
2. **Given** an auth user with a chart on the daily page, **When** they request a personal forecast, **Then** `getPersonalDailyHoroscope()` returns personalized data showing ALL fields the API provides.
3. **Given** the weekly horoscope page, **When** a user selects their sign, **Then** `getSignWeeklyHoroscope()` + text variant shows the complete weekly forecast.
4. **Given** the monthly horoscope page, **When** a user selects their sign, **Then** `getSignMonthlyHoroscope()` shows the complete monthly forecast with all returned fields.
5. **Given** the yearly horoscope page, **When** a user selects their sign, **Then** `getSignYearlyHoroscope()` shows the full annual overview.
6. **Given** the Chinese horoscope page, **When** a user enters birth data, **Then** `getChineseHoroscope()` shows the complete Chinese astrology reading.

---

### User Story 3 - Relationship & Compatibility Suite (Priority: P1)

A full relationship analysis suite: synastry chart, composite chart, compatibility analysis with scores, relationship analysis, love languages, red flags, and relationship timing. Each produces a unique page showing ALL API data. The current compatibility page is upgraded from local calculation to full API-powered analysis.

**Why this priority**: Relationship features are the #1 driver for astrology apps. Currently compatibility uses local aspect calculation instead of the rich API data.

**Independent Test**: Enter two people's birth data → see synastry chart SVG, composite chart SVG, compatibility scores by category, full relationship report, love languages, red flags.

**Acceptance Scenarios**:

1. **Given** two birth data sets, **When** synastry is requested, **Then** page shows `getSynastryChart()` data + `getSynastryChartSvg()` visual + `getSynastryReport()` full interpretation — ALL returned fields.
2. **Given** two birth data sets, **When** composite is requested, **Then** `getCompositeChart()` + `getCompositeChartSvg()` + `getCompositeReport()` are displayed.
3. **Given** two birth data sets, **When** compatibility analysis runs, **Then** `getCompatibilityAnalysis()` + `getCompatibilityScore()` show detailed scores across ALL life areas the API returns.
4. **Given** two birth data sets, **When** relationship insights load, **Then** `insights.relationship.getCompatibility()`, `getLoveLanguages()`, `getRedFlags()`, `getTiming()` each show complete data in dedicated sections.

---

### User Story 4 - Transit & Predictive Tools (Priority: P1)

Users see current planetary transits to their natal chart, upcoming transit events with dates, and predictive analysis. Transit chart SVG from the API shows the bi-wheel. Solar and lunar return charts provide yearly/monthly themes.

**Why this priority**: Transit and predictive features show users what's happening NOW and NEXT — this drives daily engagement.

**Independent Test**: View transit chart for a saved natal chart → see bi-wheel SVG, current transit aspects, upcoming exact dates, transit report interpretation.

**Acceptance Scenarios**:

1. **Given** a natal chart, **When** transit page loads, **Then** `getTransitChart()` + `getTransitChartSvg()` show bi-wheel with ALL transit-to-natal aspects and their data.
2. **Given** a natal chart, **When** transit report loads, **Then** `getTransitReport()` + `getNatalTransitReport()` show complete transit interpretations.
3. **Given** a natal chart, **When** upcoming transits load, **Then** `getNatalTransits()` shows a timeline of exact transit dates with interpretations.
4. **Given** birth data + a year, **When** solar return is requested, **Then** `getSolarReturnChart()` + `getSolarReturnReport()` + `getSolarReturnTransits()` show the full yearly theme.
5. **Given** birth data + a date, **When** lunar return is requested, **Then** `getLunarReturnChart()` + `getLunarReturnReport()` + `getLunarReturnTransits()` show the monthly cycle.
6. **Given** birth data, **When** predictive analysis loads, **Then** `getPredictiveAnalysis()` shows upcoming trends and timing.

---

### User Story 5 - Advanced Chart Types: Progressions & Directions (Priority: P2)

Users access secondary progressions and solar arc directions — advanced techniques showing life evolution. Each has a chart + report.

**Why this priority**: Advanced techniques for engaged users. Less mainstream but valuable for retention.

**Independent Test**: Request progressions for a natal chart → see progressed chart with ALL data + interpretation report.

**Acceptance Scenarios**:

1. **Given** birth data + a target date, **When** progressions are requested, **Then** `getProgressions()` + `getProgressionReport()` show complete progressed chart data and interpretations.
2. **Given** birth data + a target date, **When** directions are requested, **Then** `getDirections()` + `getDirectionReport()` show solar arc directed positions and interpretations.

---

### User Story 6 - Specialized Analysis Reports (Priority: P2)

Each analysis API endpoint gets its own page: career, health, karmic, psychological, spiritual, vocational, lunar, and relocation analysis. Users enter birth data and get a complete, unique report for each area.

**Why this priority**: These replace the generic "product pages" with real API-powered analysis. Each is a distinct, valuable tool — not a placeholder.

**Independent Test**: Visit career analysis page → enter birth data → see complete career report from `getCareerAnalysis()` with ALL returned sections.

**Acceptance Scenarios**:

1. **Given** birth data on the career page, **When** submitted, **Then** `getCareerAnalysis()` returns and displays ALL career-related data.
2. **Given** birth data on the health page, **When** submitted, **Then** `getHealthAnalysis()` returns complete health analysis.
3. **Given** birth data on the karmic page, **When** submitted, **Then** `getKarmicAnalysis()` returns past life and soul purpose data.
4. **Given** birth data on the psychological page, **When** submitted, **Then** `getPsychologicalAnalysis()` returns psychological profile.
5. **Given** birth data on the spiritual page, **When** submitted, **Then** `getSpiritualAnalysis()` returns spiritual path data.
6. **Given** birth data on the vocational page, **When** submitted, **Then** `getVocationalAnalysis()` returns career aptitude data.
7. **Given** birth data on the lunar analysis page, **When** submitted, **Then** `getLunarAnalysis()` returns moon-focused analysis.
8. **Given** birth data + target city, **When** relocation analysis is requested, **Then** `getRelocationAnalysis()` shows how the chart changes at different locations.

---

### User Story 7 - Tarot Section (Priority: P2)

A complete tarot section: daily card, single card reading, three-card spread, Celtic Cross, birth cards, houses spread, Tree of Life. Each spread type gets its own page showing ALL card data, images, and interpretations.

**Why this priority**: Tarot is a major engagement feature. The API provides 18+ tarot methods — all unique content.

**Independent Test**: Visit tarot daily card → see today's card with full interpretation. Visit Celtic Cross → see 10-card spread with complete meanings.

**Acceptance Scenarios**:

1. **Given** the daily tarot page, **When** it loads, **Then** `getDailyCard()` shows today's card with ALL returned fields (name, suit, arcana, upright/reversed meaning, image).
2. **Given** the single card page, **When** user draws, **Then** `drawCards()` + `generateSingleReport()` show card + interpretation.
3. **Given** the three-card page, **When** user draws, **Then** `generateThreeCardReport()` shows past/present/future with complete data.
4. **Given** the Celtic Cross page, **When** user draws, **Then** `generateCelticCrossReport()` shows all 10 positions with interpretations.
5. **Given** birth data, **When** birth cards are requested, **Then** `calculateBirthCards()` shows personality and soul cards.
6. **Given** the houses spread page, **When** user draws, **Then** `generateHousesReport()` shows 12-house tarot reading.

---

### User Story 8 - Chinese Astrology Section (Priority: P2)

Complete Chinese astrology: BaZi (Four Pillars), Luck Pillars, Ming Gua, compatibility, yearly forecast, zodiac animal analysis, element analysis, solar terms.

**Why this priority**: Chinese astrology is a separate system with unique appeal. 8 API methods available.

**Independent Test**: Enter birth data → see BaZi chart with four pillars, luck pillars timeline, Ming Gua number with directions, element balance.

**Acceptance Scenarios**:

1. **Given** birth data, **When** BaZi page loads, **Then** `calculateBaZi()` shows ALL four pillars with heavenly stems and earthly branches.
2. **Given** birth data, **When** luck pillars load, **Then** `calculateLuckPillars()` shows 10-year life periods with ALL data.
3. **Given** birth data, **When** Ming Gua loads, **Then** `calculateMingGua()` shows number and favorable/unfavorable directions.
4. **Given** two birth data sets, **When** Chinese compatibility runs, **Then** `calculateCompatibility()` shows complete analysis.
5. **Given** birth data + year, **When** yearly forecast loads, **Then** `getYearlyForecast()` + `analyzeYearElements()` show annual predictions.

---

### User Story 9 - Traditional Astrology Section (Priority: P2)

Classical/Hellenistic techniques: essential dignities analysis, Arabic lots (Part of Fortune, etc.), profections (annual house progression), and comprehensive traditional analysis.

**Why this priority**: Traditional astrology appeals to serious practitioners. 10 API methods.

**Independent Test**: View traditional analysis for a chart → see dignities table, Arabic lots with positions, profection timeline.

**Acceptance Scenarios**:

1. **Given** a natal chart, **When** traditional analysis loads, **Then** `getAnalysis()` shows complete traditional data (sect, dignities, lots).
2. **Given** a natal chart, **When** dignities page loads, **Then** `getDignitiesAnalysis()` shows every planet's essential dignities.
3. **Given** a natal chart, **When** lots page loads, **Then** `getLotsAnalysis()` shows ALL Arabic/Hellenistic lots with positions.
4. **Given** a natal chart + age, **When** profections load, **Then** `getProfectionsAnalysis()` + `getAnnualProfection()` + `getProfectionTimeline()` show complete profection data.

---

### User Story 10 - Astrocartography (Priority: P2)

Location-based astrology: planetary lines on a world map, location analysis, power zones, relocation charts, location comparison.

**Why this priority**: Unique feature that no free competitor offers. 10 API methods.

**Independent Test**: View astrocartography map → see planetary lines. Click a city → see location analysis.

**Acceptance Scenarios**:

1. **Given** birth data, **When** astrocartography loads, **Then** `getLines()` + `generateMap()` show planetary lines on a world map.
2. **Given** birth data + a location, **When** analysis loads, **Then** `analyzeLocation()` shows ALL planetary influences at that location.
3. **Given** birth data, **When** power zones load, **Then** `findPowerZones()` shows ranked best locations.
4. **Given** birth data + two locations, **When** comparison loads, **Then** `compareLocations()` shows differences.

---

### User Story 11 - Numerology, Fixed Stars, Eclipses, Lunar (Priority: P2)

Remaining API sections each get dedicated pages:

- **Numerology**: Core numbers + comprehensive report + compatibility
- **Fixed Stars**: Positions, natal conjunctions, interpretation report
- **Eclipses**: Upcoming eclipses, natal impact analysis, historical eclipses, Saros cycles
- **Lunar**: Enhanced calendar with mansions, events, void-of-course periods

**Why this priority**: These are distinct, self-contained tools that each appeal to different user segments. Numerology broadens beyond astrology. Fixed stars and eclipses add depth for advanced users. Lunar data enriches the already-popular moon page.

**Independent Test**: Visit numerology page → enter birth data → see core numbers + full report. Visit eclipses → see upcoming list + natal impact. Visit moon page → see enhanced calendar with mansions and events from API.

**Acceptance Scenarios**:

1. **Given** birth data on numerology page, **When** submitted, **Then** `getCoreNumbers()` + `getComprehensiveReport()` show ALL numerology data.
2. **Given** two birth data sets on numerology compatibility, **When** submitted, **Then** `analyzeCompatibility()` shows result.
3. **Given** birth data on fixed stars page, **When** submitted, **Then** `getConjunctions()` + `generateReport()` show stars conjunct natal planets.
4. **Given** birth data on eclipses page, **When** submitted, **Then** `getUpcoming()` + `checkNatalImpact()` show upcoming eclipses and their effect on the chart.
5. **Given** the lunar page, **When** loaded, **Then** `getMansions()`, `getEvents()`, `getCalendar()` enrich the existing moon calendar with ALL API data.

---

### User Story 12 - Wellness, Financial & Business Insights (Priority: P3)

Specialized insight APIs each get their own section:

- **Wellness**: Body mapping, biorhythms, energy patterns, wellness timing/score, moon wellness
- **Financial**: Market timing, personal trading, Gann analysis, Bradley siderograph
- **Business**: Leadership style, team dynamics, business timing, hiring compatibility

**Acceptance Scenarios**:

1. **Given** birth data on wellness page, **When** loaded, **Then** `getBodyMapping()`, `getBiorhythms()`, `getEnergyPatterns()`, `getWellnessScore()` each show complete data.
2. **Given** birth data on financial page, **When** loaded, **Then** `getMarketTiming()`, `analyzePersonalTrading()` show complete analysis.
3. **Given** birth data on business page, **When** loaded, **Then** `getLeadershipStyle()`, `getBusinessTiming()` show complete analysis.

---

### User Story 13 - Auth-Aware Homepage (Priority: P1)

Logged-in users see a personalized home (greeting, daily horoscope, saved charts, recommended features) instead of the marketing landing page with "Створити акаунт" CTAs.

**Acceptance Scenarios**:

1. **Given** unauth visitor, **When** homepage loads, **Then** marketing landing with quiz CTAs.
2. **Given** auth user with charts, **When** homepage loads, **Then** personalized greeting, daily horoscope, charts list, feature recommendations — no "Створити акаунт".
3. **Given** auth user with zero charts, **When** homepage loads, **Then** welcome + CTA to `/chart/new`.

---

### User Story 14 - Auth Flow Fixes (Priority: P1)

Fix all auth UX issues from the audit:

- Quiz redirects auth users to `/chart/new` (ONLY quiz — all other pages stay accessible)
- Product forms skip entirely when auth user has complete chart data (including gender)
- Gender pre-fill bug fixed
- Login page redirects auth users to dashboard
- Moon page hides "У вашому чарті" for unauth
- SessionStorage cleared on logout (privacy)

**CRITICAL**: Auth users MUST be able to navigate directly to ANY feature page. Only `/quiz` redirects. No aggressive middleware that blocks feature access.

**Acceptance Scenarios**:

1. **Given** auth user, **When** navigating to `/quiz`, **Then** redirected to `/chart/new`.
2. **Given** auth user, **When** navigating to ANY other page (horoscopes, tarot, transit, etc.), **Then** page loads normally — NO redirect.
3. **Given** auth user with complete chart (including gender), **When** visiting a page requiring birth data, **Then** form is skipped — data auto-submitted from their chart, result shown directly.
4. **Given** auth user with incomplete chart (gender missing), **When** visiting a page, **Then** form shown with available fields pre-filled, missing fields highlighted.
5. **Given** auth user, **When** logging out, **Then** all sessionStorage cleared, no data remnants.
6. **Given** unauth user on moon page, **When** MoonTransitCard renders, **Then** "У вашому чарті" hidden.

---

### User Story 15 - Navigation Overhaul (Priority: P1)

Navigation menus are reorganized to give access to ALL feature categories. Dropdown menus group features by type (Charts, Horoscopes, Relationships, Tarot, Chinese, Traditional, Insights). Every implemented API feature is reachable from navigation.

**Acceptance Scenarios**:

1. **Given** the desktop nav, **When** user opens dropdowns, **Then** every feature category is listed with links to actual working pages.
2. **Given** the mobile nav hamburger, **When** expanded, **Then** all feature categories accessible with expandable sections.
3. **Given** any nav link, **When** clicked by auth or unauth user, **Then** the target page loads (no redirect to dashboard).

---

### User Story 16 - Stats Section Fix (Priority: P3)

Landing page stats show real data or honest values. No misleading "100,000+".

**Acceptance Scenarios**:

1. **Given** unauth visitor, **When** StatsSection renders, **Then** shows actual Supabase database counts (total charts created, total registered users).

---

### Edge Cases

- What happens when an API endpoint returns an error? Show a friendly Ukrainian error message with retry button. Never show raw API errors.
- What happens when an API endpoint returns partial data (some fields null)? Render available fields, hide empty sections gracefully.
- What happens when a feature requires birth time but user has "unknown" time? Show a notice that results may be less accurate, use 12:00 default.
- What happens when the user has no chart yet and visits a feature page? Show a compact birth data form inline on that page.
- What happens when API rate limits are hit? Queue requests, show loading state, never show "Скоро".
- What happens when gender is missing from an existing chart? Prompt user to add it once, save to chart record.

## Requirements *(mandatory)*

### Functional Requirements

**API Coverage:**

- **FR-001**: Every endpoint in the Astrology API SDK MUST have a corresponding page or section that displays ALL data the endpoint returns.
- **FR-002**: Non-null data from the API MUST be displayed in full — no truncation of meaningful values. When the API returns null or empty values for optional fields, those sections MAY be hidden gracefully rather than showing empty space. Required fields MUST always be rendered, with an appropriate empty-state indicator if null.
- **FR-003**: Each page MUST use the appropriate API endpoint(s) directly — not local calculations or AI-generated approximations when API data is available.
- **FR-004**: The API-provided SVG charts (natal, synastry, composite, transit) MUST be the primary visualization. The local NatalChartWheel SVG renderer MAY be retained as a fallback when the API SVG is unavailable (network error, API timeout). Fallback MUST be visually indicated to the user.

**Pages by API namespace:**

- **FR-005**: Charts namespace — pages for: natal, synastry, composite, transit, solar return, lunar return, progressions, directions, natal transits.
- **FR-006**: Horoscope namespace — pages for: personal daily, sign daily, sign weekly, sign monthly, sign yearly, Chinese horoscope.
- **FR-007**: Analysis namespace — pages for: natal report, synastry report, composite report, compatibility analysis/score, relationship analysis/score, transit report, natal transit report, progression report, direction report, lunar return report, solar return report, career, health, karmic, psychological, spiritual, predictive, vocational, lunar, relocation analysis.
- **FR-008**: Tarot namespace — pages for: daily card, single card, three-card spread, Celtic Cross, birth cards, houses spread, Tree of Life, synastry tarot, transit tarot.
- **FR-009**: Chinese namespace — pages for: BaZi, luck pillars, Ming Gua, compatibility, yearly forecast, element analysis, zodiac animal.
- **FR-010**: Traditional namespace — pages for: comprehensive analysis, dignities, Arabic lots, profections.
- **FR-011**: Astrocartography namespace — pages for: planetary lines map, location analysis, power zones, location comparison, relocation chart.
- **FR-012**: Numerology namespace — pages for: core numbers, comprehensive report, compatibility.
- **FR-013**: Fixed Stars namespace — pages for: natal conjunctions, interpretation report.
- **FR-014**: Eclipses namespace — pages for: upcoming eclipses, natal impact.
- **FR-015**: Lunar namespace — enhance existing moon page with: mansions, events, full calendar.
- **FR-016**: Insights namespace — pages for: wellness (body mapping, biorhythms, energy), financial (market timing, trading), business (leadership, timing), relationship (love languages, red flags).

**Auth & UX:**

- **FR-017**: Homepage MUST render personalized content for auth users, marketing landing for unauth.
- **FR-018**: `/quiz` MUST redirect auth users to `/chart/new`. All other pages accessible to all users.
- **FR-019**: Pages requiring birth data MUST auto-submit from saved chart when auth user has complete data (name, date of birth, birth time (not 'unknown'), birth city (with resolved latitude/longitude), and gender all present in the charts table). Form skipped entirely.
- **FR-020**: Gender MUST be correctly saved and pre-filled from the charts table.
- **FR-020a**: Gender field MUST support: 'male', 'female', and 'prefer not to say' (mapped to null for API calls). For API endpoints that require a binary gender parameter, 'prefer not to say' defaults to omitting the gender field or using the API's default behavior.
- **FR-021**: SessionStorage MUST be cleared on logout.
- **FR-022**: Moon page MUST hide "У вашому чарті" for unauth users.
- **FR-023**: Login page MUST redirect auth users to `/dashboard`.
- **FR-023a**: The `/dashboard` page MUST display: user greeting with name, primary chart summary, quick links to most-used features, and a daily insight snippet. For users with zero charts, show a welcome message and CTA to create first chart at `/chart/new`.
- **FR-024**: Navigation MUST provide access to every feature category. No feature inaccessible from nav.
- **FR-025**: Zero instances of "Скоро" or "coming soon" text anywhere on the site.
- **FR-025a**: Navigation menus MUST only include links to pages that are implemented and functional. During phased rollout, nav items for unimplemented features MUST NOT appear — they are added as each phase ships. This ensures zero "Скоро" or dead links at any point.
- **FR-026**: All user-facing text MUST be in Ukrainian.
- **FR-026a**: When the Astrology API does not support Ukrainian (`language: 'uk'`) for a specific endpoint, the English API response is displayed as-is. UI chrome (labels, buttons, navigation, section headers) MUST always be Ukrainian regardless of API language support.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every Astrology API namespace (16) has at least one working page displaying real API data.
- **SC-002**: Users can access 50+ distinct features/tools from navigation menus.
- **SC-003**: Zero "Скоро" messages anywhere on the site.
- **SC-004**: Auth users can reach any feature page directly (zero unwanted redirects except `/quiz`).
- **SC-005**: Auth users with complete chart data interact with feature pages in 1 click (no form).
- **SC-006**: Zero instances of "Створити акаунт" CTA shown to authenticated users.
- **SC-007**: All API response data is visible to users — no hidden or truncated fields.
- **SC-008**: After logout, zero personal data remnants in sessionStorage.

## Assumptions

- The Astrology API subscription/plan covers all 160+ endpoints (no endpoints are paywalled on the API side).
- API rate limits are sufficient for the expected traffic. Aggressive caching (ISR, in-memory) is used where appropriate.
- The API returns Ukrainian language content when `language: 'uk'` is specified. For endpoints without Ukrainian support, English data is displayed as-is (no AI translation needed).
- Existing Supabase auth infrastructure is sufficient.
- Feature pages can share common components (birth data form, chart selector, result display).
- Not every API method needs a completely separate route — related methods can be combined on one page (e.g., solar return chart + report + transits on one page).
- The Explore page (`/explore`) can be removed/replaced once dedicated pages exist for each feature.

## Scope Boundaries

### In Scope

- Implement pages for ALL 16 Astrology API namespaces
- Display ALL data each API endpoint returns
- Use API-provided SVG charts instead of local rendering
- Auth-aware homepage
- Quiz redirect for auth users (ONLY quiz)
- Auto-submit from saved chart data (skip form when complete)
- Gender save/pre-fill bug fix
- SessionStorage privacy fix on logout
- Moon page auth-aware fix
- Navigation overhaul for all features
- Stats section honest data
- Remove all "Скоро" messages

### Out of Scope

- Payment integration
- Blog and content pages
- Subscription model
- AI chat widget
- Geo-targeting prices
- Push notifications
- Email sending/newsletters
- Admin panel
- Mobile native app
- Pet insights (lowest priority, can be deferred)
