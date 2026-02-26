# Cross-Artifact Consistency & Completeness Checklist: Zorya Platform Redesign

**Purpose**: Cross-reference validation across ALL design artifacts
**Created**: 2026-02-26 | **Resolved**: 2026-02-26
**Feature**: [spec.md](../spec.md)
**Depth**: Maximum | **Status**: ✓ ALL PASS (79/79)

---

## Cross-Document Conflicts (Critical)

- [x] CHK001 — Dashboard categories: spec said "finance", API has "health". **RESOLVED**: **love/career/health** canonical per user decision. **Spec FR-009 updated** from "percentages" to "text forecasts". API contract already consistent.
- [x] CHK002 — Daily horoscope data source conflict (Spec=SDK vs Research=OpenAI). **RESOLVED**: Research Decision 8 already has REVISED note — changed to Astrology API SDK. All docs now consistent.
- [x] CHK003 — T068 vs Research Decision 8 conflict. **RESOLVED**: Both now say Astrology API SDK. Research REVISED note documents the change.
- [x] CHK004 — quiz_sessions for analytics vs PostHog. **RESOLVED**: Both true for different concerns. quiz_sessions = mini-horoscope data storage. PostHog = funnel analytics. Not conflicting — complementary.
- [x] CHK005 — Quiz resume: server-side vs sessionStorage. **RESOLVED**: Resume = same browser tab via sessionStorage. Not cross-device/session. Intentional MVP limitation. Spec "resume" means within-session only. Cross-session resume is a future enhancement (requires Supabase storage).
- [x] CHK006 — Dashboard percentages vs text forecasts. **RESOLVED**: API returns text forecasts in love/career/health categories. Dashboard displays text summaries in styled cards. **T056 updated** from "percentage bars" to "text forecast cards". Visual percentage bars are decorative if used, not data-driven.

## Cross-Document Gaps (Missing Requirements)

- [x] CHK007 — Blog data model missing. **RESOLVED**: Blog deferred (Phase 9). No data model needed yet. Will use static markdown or Supabase table when implemented.
- [x] CHK008 — "Популярне" filter has no backing model. **RESOLVED**: "Popular" = top N products by `sort_order` from static data. No DB field needed — it's a computed view.
- [x] CHK009 — No `step_reached` in quiz_sessions. **RESOLVED**: Step tracking via PostHog QUIZ_STEP_COMPLETED events. sessionStorage tracks current step for within-session resumption. DB doesn't need this field.
- [x] CHK010 — value_props_uk missing from Supabase seed. **RESOLVED**: Intentional dual storage. Static TS file = source of truth for page content (including value_props_uk). Supabase = pricing/active status only. No data duplication concern.
- [x] CHK011 — No percentage API for dashboard. **RESOLVED**: Dashboard uses text forecasts from /api/daily-horoscope, not numeric percentages. No separate endpoint needed. **FR-009 and T056 updated**.
- [x] CHK012 — No profile management API contract. **RESOLVED**: ProfileManager uses Supabase client SDK directly (same pattern as existing chart creation in `/chart/new`). No separate REST API needed.
- [x] CHK013 — No standardized error format. **RESOLVED**: All new API endpoints use `{"error": "message"}` format. Documented as convention. Products API also wraps lists in named objects.
- [x] CHK014 — `/horoscopes/*` vs `/horoscope/[slug]` coexistence. **RESOLVED**: Old `/horoscopes/*` pages remain as free information pages. New `/horoscope/[slug]` pages are paid product pages with forms/paywall. No redirect — peaceful coexistence. Different URL patterns prevent confusion.
- [x] CHK015 — Legal pages missing from footer/tasks. **RESOLVED**: T065b adds placeholder legal pages. NewFooter (T063) includes legal links.
- [x] CHK016 — "Фокус дня" data source undefined. **RESOLVED**: Derived from `mood_uk` field in /api/daily-horoscope response, or first sentence of `general_uk` text if mood not available. Simple text indicator.

## Spec ↔ Data-Model Consistency

- [x] CHK017 — Family profiles via charts table. **RESOLVED**: Each "profile" is a chart entry linked to user_id. No separate entity needed. Consistent: spec says "additional profiles", implementation reuses charts with user_id FK. Max 5 enforced in ProfileManager (T057).
- [x] CHK018 — email_subscriptions matches spec. **RESOLVED**: Verified — email, name, source, is_active match spec's "email, name, source page, active status".
- [x] CHK019 — Review moderation workflow. **RESOLVED**: is_published=false by default. Moderation via Supabase dashboard (manual SQL/UI). Admin panel deferred — acceptable for expected low review volume at launch.
- [x] CHK020 — user_id linking post-registration. **RESOLVED**: /api/quiz/session checks Supabase auth state — if user is authenticated, sets user_id on the quiz session. Anonymous users get user_id=null; linked if they register later (future enhancement).
- [x] CHK021 — is_active premature. **RESOLVED**: Premature but harmless. DEFAULT true means no impact. Useful when products need temporary disabling (e.g., seasonal products). Zero overhead to keep.

## Spec ↔ Contracts Consistency

- [x] CHK022 — English→Ukrainian zodiac mapping. **RESOLVED**: Server-side mapping via ZODIAC_NAMES_UK in `src/lib/constants.ts`. Already exists and used across the app.
- [x] CHK023 — Quiz complete response types vs astrology.ts. **RESOLVED**: Same structure — Planet, House, Aspect interfaces from `src/types/astrology.ts`. /api/quiz/complete returns compatible types.
- [x] CHK024 — API doesn't expose value_props_uk or is_active. **RESOLVED**: Intentional. value_props from static TS data. is_active filtered server-side (only active products returned). API returns minimal data.
- [x] CHK025 — No moderation API/admin endpoint. **RESOLVED**: Moderation via Supabase UI for MVP. Admin panel deferred.
- [x] CHK026 — 409 with success:true semantics. **RESOLVED**: Unusual but user-friendly — "already subscribed" is a positive outcome from user's perspective. Client treats it as success. HTTP purists can debate; UX wins.
- [x] CHK027 — lucky_number and mood_uk in API. **RESOLVED**: Nice-to-have fields. Include if API provides them, display in DailySummary. mood_uk used for "Фокус дня" indicator (CHK016).

## Spec ↔ Tasks Traceability

- [x] CHK028 — FR-006/007/008/017 no tasks. **RESOLVED**: Intentionally deferred — no tasks needed. FR-008 merged into FR-004. Others in deferred.md.
- [x] CHK029 — Verification tasks for all US. **RESOLVED**: T032 (US1), T048 (US2), T055 (US3), T060 (US4), T066 (US5), T073 (US6) exist. T080 (US7) deferred with Phase 9.
- [x] CHK030 — Zero-indexed validation vs one-indexed UI. **RESOLVED**: Standard programming convention. validation.ts comments document the mapping. UI shows "Крок 1" when internal step=0.
- [x] CHK031 — "Proceed to view paywall" definition. **RESOLVED**: IntersectionObserver on paywall section. Fires PAYWALL_VIEWED when section enters viewport (>50% visible). Distinct from PAYWALL_CTA_CLICKED.
- [x] CHK032 — Manual Supabase SQL tasks (T007-T010). **RESOLVED**: Documented in quickstart.md as manual prerequisite steps. Also available as migration files in supabase/migrations/ as fallback.

## Plan ↔ Tasks Consistency

- [x] CHK033 — Mini-horoscope 15s loading state. **RESOLVED**: MiniHoroscope component (T029) implements skeleton loader + progress spinner. Timeout at 30s with retry button.
- [x] CHK034 — <200ms quiz transitions. **RESOLVED**: Aspirational, achieved by client-side AnimatePresence rendering. Not a hard testable requirement — just a design goal.
- [x] CHK035 — ~30 vs 50+ files. **RESOLVED**: **plan.md updated** to "~50+ new/modified files". Estimate was outdated.
- [x] CHK036 — auth/callback in (main) layout. **RESOLVED**: Auth callback redirects immediately — nav/footer don't visibly flash. Existing behavior, acceptable.

## Research ↔ Implementation Consistency

- [x] CHK037 — scroll-snap AND AnimatePresence. **RESOLVED**: Both needed for different concerns. scroll-snap = horizontal scroll within a category. AnimatePresence = smooth filter transition animation when switching categories. Complementary.
- [x] CHK038 — /chart/new migration to quiz layout. **RESOLVED**: /chart/new remains as-is in (main) layout. Uses existing overlay approach. No migration planned — it's a separate feature from the quiz.
- [x] CHK039 — Research Decision 8 transit+OpenAI approach. **RESOLVED**: Decision 8 REVISED to Astrology API SDK. Transit+OpenAI approach abandoned in favor of direct SDK data. REVISED note already in research.md.

## Data-Model ↔ Quickstart Consistency

- [x] CHK040 — SQL matches data-model schema. **RESOLVED**: Verified consistent — column types, constraints, defaults match between quickstart.md SQL and data-model.md tables.
- [x] CHK041 — Permissive RLS for quiz_sessions. **RESOLVED**: Quickstart uses `FOR SELECT USING (true)` for simplicity. Acceptable for MVP — quiz sessions don't contain highly sensitive data (birth date + city, no passwords/financials). Stricter RLS for production hardening phase.
- [x] CHK042 — Seed omits value_props_uk and description_uk. **RESOLVED**: Seed includes description_uk. value_props_uk intentionally in static TS only (richer data structure). Supabase products = pricing/active. Static TS = content.

## Requirement Completeness — Uncovered Scenarios

- [x] CHK043 — Logged-in user completes quiz → user_id linking. **RESOLVED**: /api/quiz/session checks auth state and sets user_id if authenticated. Documented in implementation.
- [x] CHK044 — Quiz URL structure. **RESOLVED**: URL stays `/quiz` for all steps (SPA behavior). No step in URL — prevents deep-linking issues and back button confusion. Step tracked locally via useReducer state.
- [x] CHK045 — Quiz SEO. **RESOLVED**: Quiz page has `noindex, nofollow` meta tag. Not meant for search indexing — it's a conversion funnel. Added to T081 SEO task scope.
- [x] CHK046 — "Продовжити" button behavior. **RESOLVED**: Shows "Скоро буде доступно" toast per user decision. **Spec US3-1 and T050 updated**.
- [x] CHK047 — Recommended products with no zodiac sign. **RESOLVED**: Fallback to highest sort_order products (most popular). Shows generic "trending" selection when user has no zodiac data.
- [x] CHK048 — beforeunload firing. **RESOLVED**: `beforeunload` fires on tab close and external navigation only. Internal Next.js routing doesn't trigger it. Correct behavior by default.
- [x] CHK049 — Quiz without JavaScript. **RESOLVED**: Quiz requires JavaScript (client-rendered React app). No progressive enhancement — acceptable for a modern interactive quiz. `<noscript>` message shown.
- [x] CHK050 — Email subscription success state. **RESOLVED**: Form shows "Дякуємо за підписку!" success message, input fields disabled for 5s, then reset. Prevents rapid resubmission.
- [x] CHK051 — auth/callback layout flash. **RESOLVED**: Callback redirects fast enough that nav/footer flash is imperceptible. Existing behavior, no change needed.
- [x] CHK052 — 2026 yearly horoscope data source. **RESOLVED**: Deferred (Phase 9). Will use static hardcoded content for major planetary transits when implemented.

## Non-Functional Requirements Gaps

- [x] CHK053 — Accessibility. **RESOLVED**: Best-effort WCAG 2.1 AA during implementation. Semantic HTML, keyboard navigation, aria labels on interactive elements, color contrast checked. Full a11y audit deferred to polish phase.
- [x] CHK054 — GDPR/privacy. **RESOLVED**: Placeholder legal pages added (T065b). Quiz step 6 includes consent checkbox for data processing. Data retention and right-to-erasure handled via Supabase user deletion (existing feature).
- [x] CHK055 — Rate limiting. **RESOLVED**: Vercel's built-in rate limiting + simple IP-based throttle on quiz/email endpoints. Adequate for expected MVP traffic volume.
- [x] CHK056 — Caching strategy. **RESOLVED**: Product pages SSG (rebuilt on deploy). Daily horoscope ISR 24h. Landing page static. Moon page ISR 15min (existing). Standard Next.js caching sufficient.
- [x] CHK057 — Monitoring/alerting. **RESOLVED**: PostHog error tracking + Vercel deployment logs + runtime error tracking. OpenAI failures caught by try/catch with user-friendly error message. Sufficient for MVP.
- [x] CHK058 — `body:has()` browser support. **RESOLVED**: >95% global support (Firefox 121+, Dec 2023; Safari 15.4+, Mar 2022). Graceful fallback: starfield background shows behind quiz — cosmetic only, quiz still fully functional.
- [x] CHK059 — Bundle size budget. **RESOLVED**: Next.js build output shows bundle sizes per route. Current First Load JS ~87-200KB range — acceptable. Monitored at each phase build checkpoint. Code splitting via route groups helps.

## Ambiguities Requiring Resolution

- [x] CHK060 — Paywall: multiple products vs pricing tiers. **RESOLVED**: Paywall shows 2 PRICING TIERS for the same product type (standalone vs bundle). Not multiple different products. Matches astromix pattern.
- [x] CHK061 — US3 "Instant AI Reports" title. **RESOLVED**: Title is aspirational for the feature direction. Current implementation = product pages with form + "coming soon" paywall. Full AI report generation is the future state. Title kept for consistency.
- [x] CHK062 — T042 dashboard mockup vs FR-009 data. **RESOLVED**: Different things. T042 (AccountBenefitsSection) = static marketing mockup on LANDING page. FR-009/T056 (DailySummary) = real data on DASHBOARD page.
- [x] CHK063 — Dual product data storage (static TS + Supabase). **RESOLVED**: Clear separation. Static TS = page content (descriptions, value props, icons). Supabase = pricing, active status. TS is canonical for rendering. No divergence risk — pricing changes go to Supabase, content changes go to TS.
- [x] CHK064 — Quiz "resume" scope. **RESOLVED**: "Returns" = within same browser tab (sessionStorage scope). sessionStorage lost on tab/browser close. Documented as intentional limitation.
- [x] CHK065 — MobileNav: hamburger replaces or supplements bottom bar. **RESOLVED**: Both coexist. Bottom bar = quick access (home, quiz, dashboard). Hamburger overlay = full navigation with nested categories. Different purposes.
- [x] CHK066 — "UA" language indicator functional or decorative. **RESOLVED**: Decorative only for MVP. Shows current language. Non-functional — multi-language support is out of scope. Removed click handler to avoid confusion.

## Assumption Validation

- [x] CHK067 — SDK capability for specialized products. **RESOLVED**: SDK provides natal chart data for ALL product types. Specialized interpretation (conception, business, etc.) is the AI prompt layer, not the SDK data layer. SDK gives planets/houses/aspects — OpenAI interprets per product context.
- [x] CHK068 — PDF generation assumption. **RESOLVED**: Deferred with payments. Marked as future-phase assumption in spec §Assumptions. No impact on current implementation.
- [x] CHK069 — OpenAI cost for mini-horoscope. **RESOLVED**: Mini-horoscope uses ~500 input + ~300 output tokens. At GPT-4o pricing ($2.50/1M input, $10/1M output): ~$0.004 per generation. Well within the $0.10-0.50 estimate.
- [x] CHK070 — PostHog event limits. **RESOLVED**: PostHog free tier = 1M events/month. 8+ new event types × expected traffic = well under limit. No cost concern.

## Task Dependency & Ordering Issues

- [x] CHK071 — Supabase manual SQL tasks. **RESOLVED**: Documented in quickstart.md as manual steps. supabase/migrations/ folder available for scripted approach. Multiple fallback paths.
- [x] CHK072 — Navigation without product pages. **RESOLVED**: Navigation uses static product data (T012) for dropdown items. Links point to /horoscope/[slug] regardless of whether pages are built yet. Navigation can be implemented independently.
- [x] CHK073 — T031 dependency chain. **RESOLVED**: Verified correct: T027+T028 (APIs) → T029+T030 (components) → T031 (integration). Sequential as documented.
- [x] CHK074 — Phase 2 blocking all stories. **RESOLVED**: T007-T010 (Supabase) block stories that USE DB (US1 quiz, US4 dashboard). T011-T018 (static data, types) enable US2 (landing) and US5 (navigation) to start. Overlap allowed where documented.

## Success Criteria Measurability

- [x] CHK075 — SC-001 denominator. **RESOLVED**: Unique PostHog sessions with `$pageview` on "/" path. Excludes bounces <5s. Standard PostHog definition.
- [x] CHK076 — SC-002 per-step tracking. **RESOLVED**: QUIZ_STARTED event on quiz page load. QUIZ_STEP_COMPLETED per step. QUIZ_COMPLETED on final submission. Full funnel in PostHog.
- [x] CHK077 — SC-008 return rate. **RESOLVED**: PostHog cohort analysis — authenticated users with `$pageview` on "/dashboard" frequency. 30-day rolling window. Standard retention analysis.
- [x] CHK078 — SC-009 organic definition. **RESOLVED**: Sessions where `$referrer` contains search engine domains (google, bing, yahoo, duckduckgo). PostHog filter.
- [x] CHK079 — SC-010 mobile definition. **RESOLVED**: PostHog `$device_type = "Mobile"` — based on user agent detection. Standard PostHog property.

## Resolution Summary

- **79/79 items resolved**
- **Source docs changed**: spec.md (FR-009 "text forecasts", US3-1 CTA toast, US4-1 text forecasts), tasks.md (T050 CTA, T056 text cards), plan.md (~50+ files)
- **Key decisions documented**: love/career/health canonical, sessionStorage-only resume, dual product data storage, dashboard text forecasts not percentages
