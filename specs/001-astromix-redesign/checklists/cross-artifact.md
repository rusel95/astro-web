# Cross-Artifact Consistency & Completeness Checklist: Zorya Platform Redesign

**Purpose**: Maximal-depth cross-reference validation across ALL design artifacts (spec.md, plan.md, tasks.md, data-model.md, contracts/, research.md, quickstart.md) — testing requirements quality, not implementation
**Created**: 2026-02-26
**Feature**: [spec.md](../spec.md)
**Depth**: Maximum | **Audience**: Author + Reviewer | **Focus**: Cross-document consistency, gap detection, conflict resolution

---

## Cross-Document Conflicts (Critical)

- [ ] CHK001 — CONFLICT: Spec §FR-009 and §US4 say dashboard shows "love/career/finance percentages", but contracts/products-api.md §GET /api/daily-horoscope returns `love_uk/career_uk/health_uk` (health, not finance). Which is correct? [Conflict, Spec §FR-009 vs contracts/products-api.md]
- [ ] CHK002 — CONFLICT: Spec §Assumptions says "All other astrological calculations (daily horoscope forecasts) use the Astrology API SDK", but research.md §Decision 8 says daily horoscope is "AI-generated via OpenAI, cached per sign per day". Which data source is authoritative? [Conflict, Spec §Assumptions vs research.md §Decision 8]
- [ ] CHK003 — CONFLICT: Tasks T068 says daily-horoscope route should "fetch daily forecast via Astrology API SDK", contradicting research.md §Decision 8 which chose OpenAI. Tasks and research disagree on implementation. [Conflict, tasks.md §T068 vs research.md §Decision 8]
- [ ] CHK004 — CONFLICT: Spec §Key Entities says Quiz Session is "Used for funnel analytics and resume capability", but research.md §Decision 4 explicitly says "No Supabase quiz_sessions table needed for analytics — PostHog handles that". Is quiz_sessions for analytics or not? [Conflict, Spec §Key Entities vs research.md §Decision 4]
- [ ] CHK005 — CONFLICT: Spec §FR-016 says "System MUST save quiz sessions... so that abandoned quizzes can be resumed", implying persistent server-side storage. But research.md §Decision 1 says quiz state is `sessionStorage` only until completion. Resume only works within same browser session — not across devices/sessions as spec implies. Is this intentional? [Conflict, Spec §FR-016 vs research.md §Decision 1]
- [ ] CHK006 — CONFLICT: Tasks T056 (DailySummary) says it fetches from "/api/daily-horoscope for user's zodiac sign via Astrology API", but the daily-horoscope contract returns `general_uk/love_uk/career_uk/health_uk` text fields, not "percentage bars" as spec §FR-009 requires. Are percentages and text forecasts the same endpoint or different data? [Conflict, tasks.md §T056 vs contracts/products-api.md]

## Cross-Document Gaps (Missing Requirements)

- [ ] CHK007 — GAP: Blog article data model is entirely missing from data-model.md. Tasks T076 says "placeholder articles (3-6 static entries)" but no entity, schema, or storage mechanism is defined for blog posts. Where do articles live? [Gap, data-model.md]
- [ ] CHK008 — GAP: The "Популярне" (Popular) filter category in tasks T036 has no backing data model or definition. Product categories in data-model.md are [purpose, love, children, health, future, money] — "popular" is not one of them. How is "popular" determined? [Gap, tasks.md §T036 vs data-model.md §products]
- [ ] CHK009 — GAP: data-model.md §quiz_sessions has no `step_reached` column, but spec §Key Entities says quiz session captures "step reached". If resumption (FR-016) depends on knowing which step the user was on, where is this tracked? [Gap, data-model.md §quiz_sessions vs Spec §Key Entities]
- [ ] CHK010 — GAP: Quickstart.md seed data for products does not include `value_props_uk` values (the INSERT statement omits this column). Static TypeScript data in T012 includes value props, but Supabase products table rows will have NULL value_props_uk. Is this intentional dual storage? [Gap, quickstart.md §Seed Products vs tasks.md §T012]
- [ ] CHK011 — GAP: No API contract exists for the dashboard's daily horoscope percentages. The /api/daily-horoscope contract returns text forecasts, not numeric percentages. Is a separate endpoint needed, or should the contract be updated? [Gap, contracts/products-api.md]
- [ ] CHK012 — GAP: No API contract exists for profile management CRUD operations (tasks T057). The ProfileManager saves to "Supabase charts table" but no contract specifies the request/response format. [Gap, contracts/]
- [ ] CHK013 — GAP: No error response format standardization across all 6 new API endpoints. quiz-api.md uses `{"error": "message"}`, email-api.md uses `{"error": "message"}`, products-api.md uses bare arrays. Is there a shared error envelope? [Gap, contracts/]
- [ ] CHK014 — GAP: No migration strategy documented for existing `/horoscopes/*` pages (personality, love, career, health, compatibility, forecast) that overlap with new `/horoscope/[slug]` product pages. Will old pages coexist, redirect, or be deprecated? [Gap, Spec vs plan.md §Project Structure]
- [ ] CHK015 — GAP: Footer requirements in spec §US5 mention "partner info, legal pages, and contact details" but tasks T063 (NewFooter) specifies "Для партнерів, Про компанію, Контакти" columns. No legal pages (Privacy Policy, Terms of Service) are mentioned in tasks or exist in the codebase. [Gap, Spec §US5 vs tasks.md §T063]
- [ ] CHK016 — GAP: No data model or requirements exist for the "Фокус дня" (Focus of the Day) indicator mentioned in tasks T056. What data source drives it? [Gap, tasks.md §T056]

## Spec ↔ Data-Model Consistency

- [ ] CHK017 — Is the spec's definition of "additional profiles for family/friends (FR-010)" consistent with the implementation approach of reusing the `charts` table (per tasks T057)? The data-model.md does not define a separate profiles entity for family members. [Consistency, Spec §FR-010 vs data-model.md]
- [ ] CHK018 — Spec says email subscription captures "email, name, source page, active status" — does data-model.md §email_subscriptions match exactly? (It does: email, name, source, is_active) [Consistency, Spec §Key Entities vs data-model.md §email_subscriptions]
- [ ] CHK019 — Spec §Key Entities says Review has "publication status. Moderated before display." — data-model.md has `is_published BOOLEAN DEFAULT false` with RLS "published reviews are publicly readable". But no moderation interface or workflow is defined anywhere. [Completeness, Spec §Key Entities vs data-model.md §reviews]
- [ ] CHK020 — Data-model.md §quiz_sessions has `user_id UUID REFERENCES auth.users(id)` as NULLABLE, with state transition "Linked (user_id set) → user registered after quiz". But no task or contract defines how/when user_id gets set post-registration. [Gap, data-model.md §quiz_sessions]
- [ ] CHK021 — Data-model.md §products has `is_active BOOLEAN DEFAULT true` but no task, contract, or spec requirement references deactivating products. Is `is_active` premature? [Completeness, data-model.md §products]

## Spec ↔ Contracts Consistency

- [ ] CHK022 — Contracts/quiz-api.md §POST /api/quiz/session response returns `zodiac_sign_uk` but the request sends `zodiac_sign` in English ("Gemini"). Is the English-to-Ukrainian mapping documented? Where does it happen (server-side, from constants.ts)? [Clarity, contracts/quiz-api.md]
- [ ] CHK023 — Contracts/quiz-api.md §POST /api/quiz/complete response includes `natal_chart.planets`, `natal_chart.houses`, `natal_chart.aspects` — are these the same types defined in `src/types/astrology.ts` (Planet, House, Aspect)? No type reference is made. [Consistency, contracts/quiz-api.md vs types/astrology.ts]
- [ ] CHK024 — Contracts/products-api.md §GET /api/products response does not include `value_props_uk` or `is_active` fields that exist in data-model.md. Should the API expose these? [Consistency, contracts/products-api.md vs data-model.md §products]
- [ ] CHK025 — Contracts/products-api.md §POST /api/reviews response returns `{"status": "pending_moderation"}` but spec says reviews are "moderated before display" — no moderation API contract or admin endpoint exists. [Gap, contracts/products-api.md vs Spec §Key Entities]
- [ ] CHK026 — Contracts/email-api.md §POST /api/email/subscribe has a 409 response for "already subscribed" that returns `success: true` — is returning success for a conflict HTTP status semantically correct? [Clarity, contracts/email-api.md]
- [ ] CHK027 — Contracts/products-api.md §GET /api/daily-horoscope includes `lucky_number` and `mood_uk` fields not mentioned in spec §FR-014 or any user story. Are these required or aspirational? [Consistency, contracts/products-api.md vs Spec §FR-014]

## Spec ↔ Tasks Traceability

- [ ] CHK028 — Are all 22 functional requirements (FR-001 through FR-022) traceable to at least one task in tasks.md? Specifically: FR-006 (deferred), FR-007 (deferred), FR-008 (removed), FR-017 (deferred) have no tasks — is this intentional? [Traceability, Spec §FRs vs tasks.md]
- [ ] CHK029 — Are all 7 acceptance scenario sets (US1-US7) covered by corresponding verification tasks (T032, T048, T055, T060, T066, T073, T080)? [Traceability, Spec §Acceptance Scenarios vs tasks.md]
- [ ] CHK030 — Tasks T015 (validation) references steps 0-5 (zero-indexed) while spec and UI use steps 1-6 (one-indexed). Is this indexing difference documented to prevent off-by-one errors? [Consistency, tasks.md §T015 vs Spec §US1]
- [ ] CHK031 — Spec §SC-003 says "15% of users who view the mini-horoscope proceed to view the paywall" but the paywall is rendered directly below the mini-horoscope in the same page (T031). Is "proceed to view" a scroll event, a visibility event, or a click? Analytics tracking requirements are ambiguous. [Ambiguity, Spec §SC-003 vs tasks.md §T031]
- [ ] CHK032 — Tasks T007-T010 (Supabase table creation) are manual SQL operations that cannot be automated by the implementation agent. Are these pre-requisites documented as manual steps requiring human action? [Completeness, tasks.md §Phase 2]

## Plan ↔ Tasks Consistency

- [ ] CHK033 — Plan.md §Performance Goals says "Mini-horoscope generation <15s" but no task defines a loading state, progress indicator, or timeout handling for this 15-second operation. [Gap, plan.md §Performance Goals vs tasks.md §T031]
- [ ] CHK034 — Plan.md §Performance Goals says "Quiz transitions <200ms" but this metric is not in spec.md and no task validates it. Is this a hard requirement or aspirational? [Ambiguity, plan.md vs Spec]
- [ ] CHK035 — Plan.md §Scale/Scope says "~30 new/modified files" but tasks.md defines creation of 50+ new files. Is the estimate outdated? [Consistency, plan.md §Scale/Scope]
- [ ] CHK036 — Plan.md §Project Structure shows `auth/callback` route under `(main)` but this is an API-like route that may not need nav/footer layout. Was this placement intentional? [Consistency, plan.md §Project Structure]

## Research ↔ Implementation Consistency

- [ ] CHK037 — Research.md §Decision 5 chose CSS `scroll-snap` for product carousel, but tasks T036 also mentions "AnimatePresence on filter change". Are both scroll-snap AND AnimatePresence needed, or does one replace the other? [Consistency, research.md §Decision 5 vs tasks.md §T036]
- [ ] CHK038 — Research.md §Decision 2 says quiz layout uses route groups, and the existing `/chart/new` approach uses "fixed inset-0 z-[60] overlay hack". Is there a plan to migrate `/chart/new` to the `(quiz)` route group eventually, or does it remain as-is? [Ambiguity, research.md §Decision 2]
- [ ] CHK039 — Research.md §Decision 8 says daily horoscope uses "transit data as input to OpenAI prompt" — this approach is not reflected in any contract or task. Is the combined transit+OpenAI approach still planned? [Consistency, research.md §Decision 8 vs contracts/products-api.md]

## Data-Model ↔ Quickstart Consistency

- [ ] CHK040 — Does quickstart.md §SQL exactly match data-model.md §schema for all 4 tables? Specifically: are column types, constraints, defaults, and CHECK constraints identical? [Consistency, quickstart.md vs data-model.md]
- [ ] CHK041 — Quickstart.md §RLS says quiz_sessions have "public read" (`FOR SELECT USING (true)`) — but data-model.md §RLS says "Select/update by session_id match or user_id match". The quickstart is more permissive. Which is correct? [Conflict, quickstart.md §RLS vs data-model.md §RLS]
- [ ] CHK042 — Quickstart.md §Seed Products inserts 16 rows but omits `value_props_uk` and `description_uk` fields. Data-model.md defines both as nullable. But products-api.md contract returns `description_uk` — will it be null for all products? [Consistency, quickstart.md vs contracts/products-api.md]

## Requirement Completeness — Uncovered Scenarios

- [ ] CHK043 — Are requirements defined for what happens when a logged-in user completes the quiz? Does their quiz session get linked to their account (user_id set)? No task or acceptance scenario covers this flow. [Coverage, Gap]
- [ ] CHK044 — Are requirements defined for the quiz page's URL structure during multi-step navigation? Is it `/quiz` for all steps or `/quiz?step=3`? URL changes affect browser back button behavior and deep linking. [Coverage, Gap]
- [ ] CHK045 — Are requirements defined for SEO on the quiz page? Should search engines index `/quiz`? Should there be noindex/nofollow? [Coverage, Gap]
- [ ] CHK046 — Are requirements specified for the product page form's "Продовжити" button behavior? It can't process payment (deferred) — what happens on click? Shows paywall? "Coming soon"? [Ambiguity, Spec §US3-3 vs tasks.md §T050]
- [ ] CHK047 — Are requirements defined for how "recommended products" (T058) are determined when a user has no zodiac sign on file (e.g., registered via email auth without completing quiz or creating a chart)? [Edge Case, Gap]
- [ ] CHK048 — Are requirements defined for the `beforeunload` abandonment tracking (tasks T026) behavior — does it fire if the user simply navigates to a different page within the site? [Edge Case, tasks.md §T026]
- [ ] CHK049 — Are requirements defined for quiz behavior when JavaScript is disabled? The quiz is entirely client-rendered (useReducer + AnimatePresence) — progressive enhancement or graceful degradation? [Coverage, Gap]
- [ ] CHK050 — Are requirements defined for the email subscription form's success state? Does the form reset? Show a persistent success message? Disable re-submission? [Coverage, Spec §US2-4]
- [ ] CHK051 — Are requirements for handling the `auth/callback` route defined when it sits inside the `(main)` layout group? Auth callbacks typically redirect — does the nav/footer flash during redirect? [Edge Case, plan.md §Project Structure]
- [ ] CHK052 — Are requirements defined for the 2026 yearly horoscope page's data source? Tasks T079 says "major planetary transits section" — is this static hardcoded content or dynamically calculated from astronomy-engine? [Completeness, tasks.md §T079]

## Non-Functional Requirements Gaps

- [ ] CHK053 — No accessibility (a11y) requirements are specified anywhere across all artifacts — no WCAG level, no keyboard navigation requirements for quiz, no screen reader requirements for zodiac icons, no color contrast requirements for light quiz theme. [Gap, all artifacts]
- [ ] CHK054 — No GDPR/privacy requirements are specified for collecting birth date + birthplace + name + gender + email in the quiz. Is consent text for data collection defined? Data retention policies? Right to erasure? [Gap, all artifacts]
- [ ] CHK055 — No rate limiting or abuse prevention requirements are defined for public API endpoints (/api/quiz/session, /api/quiz/complete, /api/email/subscribe). What prevents spam submissions? [Gap, all artifacts]
- [ ] CHK056 — No caching strategy requirements beyond "ISR" and "cache per sign per day" are specified. Are CDN caching headers, stale-while-revalidate, or cache invalidation strategies defined for the 16 product pages (SSG)? [Gap, all artifacts]
- [ ] CHK057 — No monitoring/alerting requirements are defined for the new API endpoints. How will failures in mini-horoscope generation (OpenAI dependency) be detected? [Gap, all artifacts]
- [ ] CHK058 — No browser support requirements are documented. The quiz uses `body:has()` CSS selector (research.md §Decision 3) which is not supported in Firefox <121 and older Safari versions. Is a fallback defined? [Gap, research.md §Decision 3]
- [ ] CHK059 — No bundle size budget is defined. Plan.md says "~30 new/modified files" becoming 50+ components. Is there a concern about JavaScript bundle impact on SC-006 (3s mobile load)? [Gap, plan.md vs Spec §SC-006]

## Ambiguities Requiring Resolution

- [ ] CHK060 — Spec mentions "product tiers" (plural) on the paywall but only one product is shown per product page. Does the paywall show multiple products (upsell) or multiple pricing tiers for the same product? [Ambiguity, Spec §FR-004]
- [ ] CHK061 — Spec §US3 title says "Instant AI Reports" but §FR-006 says "Full AI-powered horoscope reports... require payment integration" and only mini-horoscope is generated. Is the US3 title misleading? [Ambiguity, Spec §US3 title vs §FR-006]
- [ ] CHK062 — Tasks T042 (AccountBenefitsSection) mentions "dashboard mockup with percentage bars" — are these the same as the daily horoscope love/career/finance percentages from FR-009, or a different mockup? [Ambiguity, tasks.md §T042 vs Spec §FR-009]
- [ ] CHK063 — Research.md §Decision 6 says product data is "stored in a static TypeScript file" AND Supabase `products` table. Two sources of truth for the same data. Which is canonical? What happens when they diverge? [Ambiguity, research.md §Decision 6]
- [ ] CHK064 — Spec §Edge Cases says abandoned quiz "can be resumed if the user returns" — but research.md says this is via sessionStorage which is tab-scoped and cleared when the browser closes. Does "returns" mean within the same browser tab session, or a future visit? [Ambiguity, Spec §Edge Cases vs research.md §Decision 1]
- [ ] CHK065 — Tasks T064 says MobileNav gets "hamburger menu" but spec §US5-3 says "navigation collapses into a hamburger menu with expandable sections". The current MobileNav is a fixed bottom bar. Is it replaced entirely, or does the hamburger supplement the bottom bar? [Ambiguity, tasks.md §T064 vs Spec §US5-3]
- [ ] CHK066 — Tasks T062 (DesktopNav) includes a "UA" language indicator but spec says "Multi-language support" is out of scope. Is the language indicator functional or decorative? [Ambiguity, tasks.md §T062 vs Spec §Out of Scope]

## Assumption Validation

- [ ] CHK067 — Spec §Assumptions says "Astrology API SDK provides sufficient data for all 16 product types' reports" — but most product types (conception, pregnancy, finance, business) are highly specialized. Has the SDK's capability for these been verified? [Assumption, Spec §Assumptions]
- [ ] CHK068 — Spec §Assumptions says "PDF generation can be handled server-side" but PDF generation is explicitly out of scope (deferred with payments). Should this assumption be removed or marked as future-only? [Assumption, Spec §Assumptions vs §Out of Scope]
- [ ] CHK069 — Plan.md says "OpenAI costs ~$0.10-0.50/report" — for the mini-horoscope (2-3 aspects, brief), is the cost estimate validated? The prompt needs natal chart data + aspect interpretation in Ukrainian. [Assumption, plan.md §Constraints]
- [ ] CHK070 — Spec §Assumptions says "existing PostHog integration can be extended with new custom events without additional cost concerns" — tasks T017 adds 8+ new events. Has PostHog plan limits been checked? [Assumption, Spec §Assumptions]

## Task Dependency & Ordering Issues

- [ ] CHK071 — Tasks T007-T010 (Supabase setup) are listed as blocking prerequisites but are manual SQL operations. No fallback or migration approach is documented if Supabase SQL editor is unavailable or if tables need schema changes later. [Completeness, tasks.md §Phase 2]
- [ ] CHK072 — Tasks dependency map says US5 (Navigation) "benefits from US3 product pages existing" — but the nav dropdown needs to list products by category regardless. Can navigation be implemented with static product data (T012) alone, without product pages? [Consistency, tasks.md §Dependencies]
- [ ] CHK073 — Tasks T031 (quiz completion integration) depends on both T027 and T028 (API routes), but also needs the mini-horoscope component T029 and paywall T030. The dependency chain is T027+T028 → T029+T030 → T031. Is this correctly sequenced? [Consistency, tasks.md §Phase 3]
- [ ] CHK074 — Are the Phase 2 Supabase tasks (T007-T010) truly blocking for ALL user story work? US2 (Landing) and US5 (Navigation) don't need database tables — they use static TypeScript data (T011-T012). Could these phases overlap? [Consistency, tasks.md §Phase Dependencies]

## Success Criteria Measurability

- [ ] CHK075 — SC-001 (40% CTA click rate) — is the "homepage visitors" denominator defined? Does it include bounced visits? All page loads? Unique sessions? [Measurability, Spec §SC-001]
- [ ] CHK076 — SC-002 (60% quiz completion) — are analytics events defined to measure per-step drop-off? Tasks T017 adds QUIZ_STEP_COMPLETED but is QUIZ_STARTED also tracked at the funnel entry point? [Measurability, Spec §SC-002 vs tasks.md §T017]
- [ ] CHK077 — SC-008 (3x/week dashboard return) — is this measurable with PostHog alone or does it require Supabase session tracking? "30 days after first login" requires cohort analysis. [Measurability, Spec §SC-008]
- [ ] CHK078 — SC-009 (500 organic visits/month) — is "organic" defined? PostHog tracks all visits. Is UTM parameter filtering or referrer-based filtering required? [Measurability, Spec §SC-009]
- [ ] CHK079 — SC-010 (70% mobile quiz completion) — how is "mobile" defined? Screen width? User agent? Responsive breakpoint? [Measurability, Spec §SC-010]

## Notes

- This checklist validates requirements quality across ALL design artifacts — not implementation correctness
- Items marked [Conflict] indicate direct contradictions between documents requiring author resolution
- Items marked [Gap] indicate missing requirements that could cause implementation ambiguity
- Items marked [Ambiguity] indicate requirements interpretable in multiple ways
- Items marked [Consistency] indicate potential misalignment between documents
- Items marked [Assumption] indicate unvalidated premises
- Priority resolution order: Conflicts first → Gaps → Ambiguities → Consistency → Assumptions
- 79 items total across 12 categories
