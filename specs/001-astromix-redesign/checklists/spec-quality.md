# Specification Quality Checklist: Zorya Platform Redesign

**Purpose**: Validate completeness, clarity, consistency, and coverage across all 7 user stories
**Created**: 2026-02-26 | **Resolved**: 2026-02-26
**Feature**: [spec.md](../spec.md)
**Depth**: Standard | **Status**: ✓ ALL PASS (62/62)

---

## Requirement Completeness

- [x] CHK001 — Mini-horoscope loading state. **RESOLVED**: MiniHoroscope component (T029) shows skeleton loader + animated spinner during generation (<15s). Timeout at 30s with retry button.
- [x] CHK002 — API unavailable during generation. **RESOLVED**: Spec §Edge Cases defines behavior: "friendly error message, suggest try again later". Implementation shows "Щось пішло не так. Спробуйте ще раз." with retry button.
- [x] CHK003 — Mini-horoscope content structure. **RESOLVED**: Selected aspects = 2-3 with tightest orbs among personal planets (Sun, Moon, Mercury, Venus, Mars). Interpretation = 2-3 sentences per aspect (~50-100 words each) in Ukrainian via OpenAI.
- [x] CHK004 — "Coming soon" message spec. **RESOLVED**: Toast text = "Скоро буде доступно! Ми працюємо над оплатою." Auto-dismisses after 3s. No animation. Tracks PAYWALL_CTA_CLICKED event. Per user decision.
- [x] CHK005 — Product page SEO content. **RESOLVED**: 200-400 words per product page. Template: product name + "онлайн" keyword + description + benefits summary. Auto-generated from product data in SeoTextSection of template.
- [x] CHK006 — Cross-sell selection logic. **RESOLVED**: 2-3 products from same or related category, excluding current product. Category mapping: purpose↔money, love↔children, health↔future. Simple static logic.
- [x] CHK007 — "Фокус дня" data source. **RESOLVED**: mood_uk field from /api/daily-horoscope response. Fallback: first sentence of general_uk text. Displayed as styled text badge.
- [x] CHK008 — Blog content requirements. **RESOLVED**: Blog deferred (Phase 9). Not needed for current implementation.
- [x] CHK009 — 2026 yearly horoscope data source. **RESOLVED**: Deferred (Phase 9). Static hardcoded content when implemented.
- [x] CHK010 — Daily horoscope freshness. **RESOLVED**: ISR with `revalidate = 86400` (24 hours). One API call per sign per day. Stale content acceptable for up to 48h in edge cases.

## Requirement Clarity

- [x] CHK011 — "Brief interpretations" quantified. **RESOLVED**: 2-3 sentences per aspect, ~50-100 words. Total mini-horoscope text: 150-300 words.
- [x] CHK012 — "2-3 key aspects" selection criteria. **RESOLVED**: Tightest orbs (most exact aspects) among personal planet pairs. Prioritizes Sun/Moon aspects. Deterministic algorithm.
- [x] CHK013 — "Product tiers" definition. **RESOLVED**: 2 pricing tiers per product: (1) standalone product at base price, (2) bundle (product + 3-year forecast) with ~20% savings. Matches astromix pattern.
- [x] CHK014 — Product form fields. **RESOLVED**: name (required), gender (required), DOB (required), time (optional, default 12:00), city (required), email (required). 6 fields total.
- [x] CHK015 — Dashboard "percentages" methodology. **RESOLVED**: **Not percentages** — text forecasts in love/career/health categories. **FR-009 and T056 updated** from "percentages" to "text forecasts". API returns text, dashboard displays text cards.
- [x] CHK016 — "Zodiac relevance" for recommended products. **RESOLVED**: Products in related categories. Love sign → love/children products. Earth signs → money/career products. Simple zodiac-element-to-category mapping.
- [x] CHK017 — "Reassuring message" for unknown birth time. **RESOLVED**: "Не хвилюйтесь! Ми використаємо 12:00 як час народження. Результати будуть точними для більшості аспектів." Implemented in QuizStep4BirthTime.
- [x] CHK018 — "Compelling hero section" specifics. **RESOLVED**: Headline + subheadline + animated ZodiacIcon constellation + gradient CTA button + subtle particle/star animation. Implemented in HeroSection.
- [x] CHK019 — "3 trust points" content. **RESOLVED**: (1) "Точні астрономічні дані NASA", (2) "Професійне астрологічне ПЗ", (3) "Команда астрологів та психологів". Full Ukrainian text in HowItWorksSection.
- [x] CHK020 — Category filter interaction. **RESOLVED**: Single-select, default "Усі" (All). No URL sync. Click toggles active category. Framer Motion AnimatePresence for filter transitions.

## Requirement Consistency

- [x] CHK021 — Category names. **RESOLVED**: Consistent. Spec uses display names (Purpose/Love/...), data-model uses slugs (purpose/love/...). Mapping defined in static product data (T012). Display names are Ukrainian.
- [x] CHK022 — Quiz step count. **RESOLVED**: 6 steps consistently across all references: spec FR-001, tasks T019-T025, validation.ts. Verified.
- [x] CHK023 — Email collection consistency. **RESOLVED**: Three independent collection points: quiz step 6 → quiz_sessions table, landing page → email_subscriptions table, product pages → form data (currently display-only). Each saves to appropriate store.
- [x] CHK024 — Max 5 profiles. **RESOLVED**: "Max 5 additional profiles" consistently in spec FR-010 and tasks T057 description.
- [x] CHK025 — CTA destinations. **RESOLVED**: New CTAs link to /quiz. Existing /chart/new preserved for direct natal chart access. Both coexist — different entry points for different user intents.
- [x] CHK026 — Product count (16). **RESOLVED**: Consistent across spec FR-005 (16 products), seed SQL (16 INSERT rows), static TS data (16 entries), product slugs list. Verified.
- [x] CHK027 — Zodiac sign identifiers. **RESOLVED**: Stored as English ("Gemini") in DB/API. Displayed via ZODIAC_NAMES_UK mapping ("Близнюки") in UI. Consistent pattern used throughout codebase.

## Acceptance Criteria Quality

- [x] CHK028 — SC-001 measurability. **RESOLVED**: CTA clicks tracked via HOMEPAGE_CTA_CLICKED PostHog event. Denominator = unique sessions with $pageview on "/". Measurable.
- [x] CHK029 — SC-002 measurability. **RESOLVED**: QUIZ_STARTED on page load + QUIZ_STEP_COMPLETED per step + QUIZ_COMPLETED at end. Full PostHog funnel visualization. Measurable.
- [x] CHK030 — SC-006 testability. **RESOLVED**: Lighthouse Performance audit with "Slow 4G" throttling preset. Target score >70. Also testable via WebPageTest.
- [x] CHK031 — SC-008 measurability. **RESOLVED**: PostHog retention analysis — cohort of users with first $pageview on "/dashboard", measure return frequency over 30 days. Standard PostHog feature.
- [x] CHK032 — SC-010 independence from SC-002. **RESOLVED**: SC-010 = QUIZ_COMPLETED where `$device_type="Mobile"` / QUIZ_STARTED where `$device_type="Mobile"`. SC-002 = all devices. Independent filters.
- [x] CHK033 — US3 validation scope. **RESOLVED**: Template-based approach: validating template validates all 16 pages. Test 2-3 representative products (personality, love, 2026) covering different categories.

## Scenario Coverage

- [x] CHK034 — Back button after quiz completion. **RESOLVED**: After completing quiz, back buttons are hidden. User sees mini-horoscope result section. Browser back returns to landing page.
- [x] CHK035 — Returning user re-visits /quiz. **RESOLVED**: sessionStorage cleared on quiz completion. Returning user starts fresh quiz (new session_id). Previous results not auto-shown.
- [x] CHK036 — Duplicate emails across quiz and subscription. **RESOLVED**: Two independent tables. Quiz saves email in quiz_sessions (no unique constraint — multiple sessions allowed). email_subscriptions has UNIQUE constraint — handles gracefully via 409 "already subscribed" response.
- [x] CHK037 — Product page without quiz data. **RESOLVED**: Empty form displayed — user fills fields manually. Pre-fill is a convenience enhancement, not a requirement. Form works independently.
- [x] CHK038 — Dashboard with no saved charts. **RESOLVED**: Existing empty state shows "Створити першу карту" CTA linking to /chart/new. Preserved in enhanced dashboard.
- [x] CHK039 — Nav dropdown with all product pages. **RESOLVED**: All 16 product pages built via template (T053-T054). Nav dropdown lists all products from static data. No dead links.
- [x] CHK040 — Review moderation. **RESOLVED**: is_published=false by default. Admin moderates via Supabase dashboard (manual). No admin UI for MVP — low volume expected.

## Edge Case Coverage

- [x] CHK041 — Cusp birth dates. **RESOLVED**: Astrology API SDK uses precise astronomical boundaries (not date-based approximations). Sun's exact ecliptic longitude determines sign. Correct for all cusp dates.
- [x] CHK042 — Slow connection quiz. **RESOLVED**: Quiz steps 1-5 are client-side only (no network calls). Final submission (step 6) has loading indicator + 30s timeout + retry. Partial submission impossible — atomic operation.
- [x] CHK043 — sessionStorage unavailable. **RESOLVED**: Quiz works without persistence — data held in React state only. Refresh loses progress (acceptable). try/catch wraps all sessionStorage calls.
- [x] CHK044 — Products with incomplete seed data. **RESOLVED**: All 16 products fully defined in seed SQL and static TS data. No incomplete entries. Verified.
- [x] CHK045 — Quiz email in email_subscriptions. **RESOLVED**: Quiz step 6 optionally creates email_subscriptions entry (if consent checkbox checked). If email exists → 409 handled silently. No error shown to user.
- [x] CHK046 — Concurrent quiz sessions. **RESOLVED**: sessionStorage is per-tab. Multiple tabs = independent sessions with separate session_ids. No conflict.

## Non-Functional Requirements

- [x] CHK047 — Quiz transition performance. **RESOLVED**: <200ms is aspirational, achieved by client-side AnimatePresence rendering. No server round-trip during steps. No formal test — design goal.
- [x] CHK048 — Accessibility. **RESOLVED**: Best-effort WCAG 2.1 AA. Semantic HTML (`<main>`, `<nav>`, `<form>`, `<label>`), keyboard navigation (tab order, Enter/Space), aria labels on icons and interactive elements. Full audit deferred to polish phase.
- [x] CHK049 — SEO for new pages. **RESOLVED**: T081 defines SEO metadata task. All new pages get: title, meta description, og:image, canonical URL. Product pages get structured data (Product schema). Quiz page gets noindex.
- [x] CHK050 — Data privacy/GDPR. **RESOLVED**: Placeholder legal pages added (T065b). Quiz step 6 consent checkbox for data processing. User data deletable via Supabase (existing auth user deletion cascades).
- [x] CHK051 — Rate limiting. **RESOLVED**: Vercel built-in rate limiting for all endpoints. Additional throttle: quiz complete limited to 5 req/min per IP. email subscribe limited to 3 req/min per IP. Sufficient for MVP.
- [x] CHK052 — Image optimization. **RESOLVED**: Most sections use icons/SVG (no heavy images). Where images exist: Next.js Image component with lazy loading, WebP format, responsive sizes. Landing page hero uses SVG animation, not raster images.

## Dependencies & Assumptions

- [x] CHK053 — OpenAI cost validation. **RESOLVED**: Mini-horoscope ~500 input + ~300 output tokens. GPT-4o: ~$0.004/generation. Well within $0.10-0.50 estimate (that was for full reports, not mini).
- [x] CHK054 — Supabase plan limits. **RESOLVED**: Free tier: 500MB DB, 50K MAU, 5GB bandwidth. Expected: <1MB new data/month, <1K MAU at launch. No concerns.
- [x] CHK055 — Astrology API rate limits. **RESOLVED**: Quiz completion = 1 API call per user. Daily horoscope = 12 calls/day (one per sign, cached). Well within limits.
- [x] CHK056 — `body:has()` browser support. **RESOLVED**: >95% global coverage. Fallback: cosmic starfield background visible behind quiz (cosmetic only). Quiz fully functional regardless.
- [x] CHK057 — Nominatim rate limits. **RESOLVED**: 1 req/second limit. CitySearch component already debounces 300ms. Adequate for quiz city selection.

## Ambiguities & Conflicts

- [x] CHK058 — Mini-horoscope NatalChartWheel reuse. **RESOLVED**: Same `NatalChartWheel` component, rendered smaller with simplified labels. Props control size and detail level.
- [x] CHK059 — Light quiz theme vs dark paywall. **RESOLVED**: Intentional contrast. Quiz = light/soft theme for approachability. Paywall section = cosmic dark styling for premium feel and urgency. Design follows astromix pattern.
- [x] CHK060 — Product form creates chart or not. **RESOLVED**: Product form does NOT create Supabase chart entry. Data displayed for pre-fill convenience only. CTA shows "coming soon" toast. Chart creation happens only via /chart/new or quiz completion.
- [x] CHK061 — /horoscopes/* vs /horoscope/[slug] relationship. **RESOLVED**: Coexistence. /horoscopes/* = existing free information pages (keep). /horoscope/[slug] = new paid product pages (add). Different URL patterns, different purposes, no redirect.
- [x] CHK062 — Quiz email auto-opts into newsletter. **RESOLVED**: Quiz step 6 has a separate consent checkbox: "Отримувати персоналізовані рекомендації". If checked → creates email_subscriptions entry with source="quiz". If unchecked → email saved in quiz_sessions only.

## Resolution Summary

- **62/62 items resolved**
- **Source docs changed**: spec.md (FR-009 text forecasts, US3-1 CTA toast, US4-1 categories), tasks.md (T050, T056), plan.md (file count)
- **Key clarifications**: aspect selection by tightest orb, dashboard shows text not percentages, product form doesn't create chart entries, quiz/newsletter separate consent
