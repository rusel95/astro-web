# Research: Full Astrology API Platform & UX Fixes

**Feature Branch**: `002-auth-ux-fixes`
**Date**: 2026-02-28

## 1. Astrology API SDK Coverage

### Decision: Use `@astro-api/astroapi-typescript` v1.0.1 for ALL astrological data

**Rationale**: SDK provides 160+ methods across 16 namespaces. Currently only 6 methods are used. The SDK is already installed and initialized as a singleton with retry logic.

**Current usage (6 methods)**:
1. `client.charts.getNatalChart()` — natal chart calculation
2. `client.svg.getNatalChartSvg()` — natal chart SVG rendering
3. `client.horoscope.getPersonalDailyHoroscope()` — explore page only
4. `client.horoscope.getSignDailyHoroscope()` — daily horoscope page
5. `client.analysis.getSynastryReport()` — explore page only
6. `client.numerology.getCoreNumbers()` — explore page only

### SDK Namespaces & Verified Methods

#### 1. `client.data` (Reference Data)
- `getZodiacSigns()`, `getPlanets()`, `getAspects()`, `getHouses()`
- `getElements()`, `getModalities()`, `getPoints()`
- `getEnhancedPositions(subject, options)` — essential dignities per planet
- `getEnhancedAspects(subject, options)` — traditional aspect analysis with receptions

#### 2. `client.charts` (Chart Calculations)
- `getNatalChart(subject, options)` — **already used**
- `getSynastryChart(subject1, subject2, options)`
- `getCompositeChart(subject1, subject2, options)`
- `getTransitChart(subject, transitDate, options)` — **used in explore**
- `getSolarReturnChart(subject, year, options)`
- `getLunarReturnChart(subject, date, options)`
- `getProgressions(subject, targetDate, options)`
- `getDirections(subject, targetDate, options)`
- `getNatalTransits(subject, startDate, endDate, options)`

#### 3. `client.horoscope` (Forecasts)
- `getPersonalDailyHoroscope(subject, options)` — **used in explore**
- `getSignDailyHoroscope(sign)` — **already used**
- `getSignDailyHoroscopeText(sign)` — extended text version
- `getSignWeeklyHoroscope(sign)`
- `getSignMonthlyHoroscope(sign)`
- `getSignYearlyHoroscope(sign)`
- `getChineseHoroscope(subject)`

#### 4. `client.analysis` (Reports & Interpretations)
- `getNatalReport(subject, options)`
- `getSynastryReport(subject1, subject2, options)` — **used in explore**
- `getCompositeReport(subject1, subject2, options)`
- `getCompatibilityAnalysis(subject1, subject2, options)`
- `getCompatibilityScore(subject1, subject2, options)`
- `getRelationshipAnalysis(subject1, subject2, options)`
- `getRelationshipScore(subject1, subject2, options)`
- `getTransitReport(subject, transitDate, options)`
- `getNatalTransitReport(subject, transitDate, options)`
- `getProgressionReport(subject, targetDate, options)`
- `getDirectionReport(subject, targetDate, options)`
- `getSolarReturnReport(subject, year, options)`
- `getLunarReturnReport(subject, date, options)`
- `getSolarReturnTransits(subject, year, options)`
- `getLunarReturnTransits(subject, date, options)`
- `getPredictiveAnalysis(subject, options)`
- `getCareerAnalysis(subject, options)`
- `getHealthAnalysis(subject, options)`
- `getKarmicAnalysis(subject, options)`
- `getPsychologicalAnalysis(subject, options)`
- `getSpiritualAnalysis(subject, options)`
- `getVocationalAnalysis(subject, options)`
- `getLunarAnalysis(subject, options)`
- `getRelocationAnalysis(subject, location, options)`

#### 5. `client.glossary` (Term Definitions)
- `getTerms()`, `getTerm(id)`, `searchTerms(query)`, `getCategories()`

#### 6. `client.astrocartography` (Location-Based)
- `getLines(subject, options)`
- `generateMap(subject, options)`
- `analyzeLocation(subject, location, options)`
- `findPowerZones(subject, options)`
- `getRelocationChart(subject, location, options)`
- `compareLocations(subject, location1, location2, options)`
- `getLocationReport(subject, location, options)`
- `getCrossings(subject, options)`
- `getLocalSpace(subject, location, options)`
- `getParanLines(subject, options)`

#### 7. `client.chinese` (Chinese Astrology)
- `calculateBaZi(subject)`
- `calculateLuckPillars(subject)`
- `calculateMingGua(subject)`
- `calculateCompatibility(subject1, subject2)`
- `getYearlyForecast(subject, year)`
- `analyzeYearElements(year)`
- `getZodiacAnimal(subject)`
- `getSolarTerms(year)`

#### 8. `client.eclipses` (Eclipse Data)
- `getUpcoming(options)`, `checkNatalImpact(subject, options)`
- `getHistory(options)`, `getSarosCycle(options)`

#### 9. `client.lunar` (Enhanced Moon Data)
- `getMansions(date)`, `getEvents(startDate, endDate)`
- `getCalendar(month, year)`, `getVoidOfCourse(startDate, endDate)`
- `getGardeningCalendar(month, year)`, `getIngresses(startDate, endDate)`

#### 10. `client.numerology`
- `getCoreNumbers(subject)` — **used in explore**
- `getComprehensiveReport(subject)`
- `analyzeCompatibility(subject1, subject2)`

#### 11. `client.tarot`
- `getDailyCard()`, `drawCards(count)`
- `getCardById(id)`, `getCardByName(name)`, `getAllCards()`
- `generateSingleReport(card)`, `generateThreeCardReport(cards)`
- `generateCelticCrossReport(cards)`, `generateHousesReport(cards)`
- `generateTreeOfLifeReport(cards)`, `generateSynastryReport(cards1, cards2)`
- `generateTransitReport(card, transitInfo)`
- `calculateBirthCards(subject)`
- `getSpreadPositions(spreadType)`

#### 12. `client.traditional` (Classical Techniques)
- `getAnalysis(subject, options)`
- `getDignitiesAnalysis(subject, options)`
- `getLotsAnalysis(subject, options)` — Arabic/Hellenistic lots
- `getProfectionsAnalysis(subject, options)`
- `getAnnualProfection(subject, age, options)`
- `getProfectionTimeline(subject, startAge, endAge, options)`
- `getFirdaria(subject, options)`
- `getZodiacalReleasing(subject, lot, options)`
- `getSectAnalysis(subject, options)`
- `getBoundsAnalysis(subject, options)`

#### 13. `client.fixedStars`
- `getPositions(date)`, `getConjunctions(subject, options)`
- `generateReport(subject, options)`, `getStarById(id)`, `getAllStars()`

#### 14. `client.svg` (SVG Chart Images)
- `getNatalChartSvg(subject, options, svgOptions)` — **already used**
- `getSynastryChartSvg(subject1, subject2, options, svgOptions)`
- `getCompositeChartSvg(subject1, subject2, options, svgOptions)`
- `getTransitChartSvg(subject, transitDate, options, svgOptions)` — **used in explore**
- `getSolarReturnChartSvg(subject, year, options, svgOptions)`
- `getLunarReturnChartSvg(subject, date, options, svgOptions)`
- SVG options: `{ theme: 'dark'|'light', language: 'uk'|'en' }`
- Response type must be `{ responseType: 'text' }` for raw SVG string

#### 15. `client.insights` (5 Sub-Clients)
- **wellness**: `getBodyMapping()`, `getBiorhythms()`, `getEnergyPatterns()`, `getWellnessTiming()`, `getWellnessScore()`, `getMoonWellness()`
- **financial**: `getMarketTiming()`, `analyzePersonalTrading()`, `getGannAnalysis()`, `getBradleySiderograph()`
- **business**: `getLeadershipStyle()`, `getTeamDynamics()`, `getBusinessTiming()`, `getHiringCompatibility()`
- **relationship**: `getCompatibility()`, `getLoveLanguages()`, `getRedFlags()`, `getTiming()`
- **pet**: `getPetPersonality()`, `getPetCompatibility()`, `getPetTiming()`

#### 16. `client.enhanced` (Enhanced Chart Data)
- `getEnhancedNatalChart(subject, options)` — natal chart + interpretations
- `getEnhancedSynastryChart(subject1, subject2, options)`
- `getEnhancedTransitChart(subject, transitDate, options)`

### Subject Format (Verified)

```typescript
interface Subject {
  name: string;
  birth_data: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    city: string;
    country_code: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  };
}
```

Existing `toSdkSubject()` in `astrology-client.ts` handles conversion from `ChartInput`.

### Options Format (Verified)

```typescript
interface ChartOptions {
  house_system: 'P' | 'K' | 'E' | 'W' | 'R' | 'C'; // Placidus default
  zodiac_type: 'Tropic' | 'Sidereal';
  active_points: string[]; // 13 points currently configured
  precision: number; // 2 decimal places
}
```

---

## 2. Existing Pages Audit

### Working Correctly
- **Chart results** (`/chart/[id]`) — tabs for planets, houses, aspects, report. Uses API data correctly
- **Chart creation** (`/chart/new`) — 4-step onboarding flow
- **Dashboard** (`/dashboard`) — shows saved charts
- **Zodiac pages** (`/zodiac/[sign]`) — 12 SSG pages with zodiac info
- **Moon page** (`/moon`) — ISR page with astronomy-engine calculations
- **Quiz** (`/quiz`) — 10-step funnel with session tracking

### Broken/Incomplete
- **Explore** (`/explore`) — raw JSON demo. Replace with dedicated pages
- **Product pages** (`/horoscopes/*`, `/ascendant`, `/daily`) — all show ProductForm → redirect to dashboard for auth users. Navigation is broken
- **Compatibility** (`/compatibility`) — uses local synastry calculation instead of API
- **MoonTransitCard** — shows "У вашому чарті: 1 дім" to unauth users (house hardcoded to 1)
- **Homepage** — shows marketing CTAs to auth users

### Navigation Issues
- Auth users clicking any product/feature link get redirected to dashboard
- No way to reach most API features from nav menus
- Product pages exist but don't deliver actual API results

---

## 3. Key Technical Decisions

### Decision 1: Page Architecture

**Decision**: Group related API methods into logical pages rather than one page per method.

**Rationale**: 160+ methods × 1 page each = unmaintainable. Related methods (chart + SVG + report) naturally combine. Users think in features ("my natal chart"), not API methods.

**Page groupings**:
- Natal Chart page: `getNatalChart` + `getNatalChartSvg` + `getNatalReport` + `getEnhancedPositions` + `getEnhancedAspects`
- Transit page: `getTransitChart` + `getTransitChartSvg` + `getTransitReport` + `getNatalTransitReport` + `getNatalTransits`
- Solar Return page: `getSolarReturnChart` + `getSolarReturnChartSvg` + `getSolarReturnReport` + `getSolarReturnTransits`
- Lunar Return page: `getLunarReturnChart` + `getLunarReturnChartSvg` + `getLunarReturnReport` + `getLunarReturnTransits`
- Synastry page: `getSynastryChart` + `getSynastryChartSvg` + `getSynastryReport` + `getCompatibilityAnalysis` + `getCompatibilityScore`
- Composite page: `getCompositeChart` + `getCompositeChartSvg` + `getCompositeReport`
- etc.

**Alternatives rejected**: One page per method (too fragmented), single mega-page (too complex).

### Decision 2: API Route Pattern

**Decision**: Create API route per page (not per SDK method). Each API route may call multiple SDK methods and aggregate results.

**Rationale**: Reduces client-server round trips. Server-side aggregation is faster. Keeps client components simple.

**Pattern**: `POST /api/{feature}` → calls N SDK methods → returns aggregated JSON.

### Decision 3: Reusable Components

**Decision**: Create shared components for common patterns:
- `BirthDataForm` — compact form for pages needing birth data input
- `ChartSelector` — dropdown to pick from saved charts (auth users)
- `ApiResultDisplay` — generic structured data renderer
- `SvgChartViewer` — displays API-provided SVG charts with dark theme

**Rationale**: 40+ feature pages share common patterns. Constitution III mandates component reuse.

### Decision 4: Auth-Aware Data Flow

**Decision**: When auth user visits a feature page:
1. Check if user has a complete chart (name, DOB, time, city, gender)
2. If yes → auto-fetch feature data using chart data → show results immediately
3. If no → show compact inline form with available fields pre-filled

**Rationale**: FR-019 requires form skip for complete data. Reduces friction to 1 click.

### Decision 5: Ukrainian Language Support

**Decision**: Request `language: 'uk'` in SVG options and analysis calls. If API returns English, display as-is (no client-side translation).

**Rationale**: Spec assumption states "English data displayed as-is." AI translation would be unreliable and slow.

---

## 4. Rate Limiting & Caching Strategy

### Decision: Aggressive ISR + in-memory caching

**Rationale**: Constitution VII says "Cache aggressively to respect API rate limits."

**Strategy**:
- Sign-based horoscopes (daily/weekly/monthly/yearly): ISR with `revalidate` matching period
- Personal results: Cache in Supabase `feature_results` table for repeat views
- Reference data (glossary, fixed stars list, tarot cards): ISR, rebuild daily
- Real-time data (transits, current moon): Short ISR (15 min) or client-side SWR

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| API plan may not cover all 160+ endpoints | Verify during implementation; graceful fallback with "Ця функція потребує оновлення плану API" |
| API rate limits exceeded | ISR caching, Supabase result caching, staggered requests |
| Some endpoints don't support Ukrainian | Display English data as-is per spec assumption |
| Large scope (40+ pages) | Phase implementation by priority (P1 first, then P2, then P3) |
| SVG charts may not match dark theme | Pass `theme: 'dark'` in SVG options; CSS fallback with `filter: invert()` if needed |
