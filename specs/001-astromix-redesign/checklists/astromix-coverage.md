# Astromix Source Coverage Checklist: Zorya Platform Redesign

**Purpose**: Cross-reference the original astromix-spec.md against all derived design artifacts
**Created**: 2026-02-26 | **Resolved**: 2026-02-26
**Source**: [astromix-spec.md](../../tasks/astromix-spec.md) | **Feature**: [spec.md](../spec.md)
**Depth**: Maximum | **Focus**: Full coverage audit | **Status**: ✓ ALL PASS (56/56)

---

## Navigation & Footer Coverage

- [x] CHK001 — "2026" nav link. **RESOLVED**: Included in T062 (DesktopNav) as top-level link. Spec §US5 covers nav including dropdowns.
- [x] CHK002 — "Планети у знаках" footer link. **RESOLVED**: Excluded from MVP. Can be future free tool. Footer omits dead links.
- [x] CHK003 — Legal pages (Terms, Privacy, Cookies). **RESOLVED**: Added via T065b — placeholder pages at `/legal/terms`, `/legal/privacy`, `/legal/cookies`.
- [x] CHK004 — "Для астрологів" / "Партнерство" links. **RESOLVED**: Included as placeholder "#" links in NewFooter (T063). Pages out of scope.
- [x] CHK005 — Footer link text vs product name. **RESOLVED**: Footer uses product `name_uk` from static data — consistent with seed.

## Quiz Funnel Coverage

- [x] CHK006 — 7 vs 6 progress dots. **RESOLVED**: 6 dots for 6 steps. Result/mini-horoscope is separate section, not a step.
- [x] CHK007 — Year range. **RESOLVED**: Date picker accepts 1920–current year in QuizStep1Birthday.
- [x] CHK008 — Fun facts per sign. **RESOLVED**: Static Ukrainian fun facts hardcoded in QuizStep2Sign component.
- [x] CHK009 — Granular birth time events. **RESOLVED**: Simplified set. `QUIZ_STEP_COMPLETED` includes `birth_time_unknown` metadata.
- [x] CHK010 — Email delivery promise. **RESOLVED**: Quiz step 6 says "Отримайте результати" — no email delivery promise.
- [x] CHK011 — Value proposition block. **RESOLVED**: PaywallSection (T030) includes benefit list above tier selection.
- [x] CHK012 — Pre-quiz messaging. **RESOLVED**: Landing page HeroSection + PainPointsSection serve this purpose.

## Paywall Coverage

- [x] CHK013 — Two tiers. **RESOLVED**: PaywallSection shows 2 tiers: standalone + bundle with savings.
- [x] CHK014 — Trust badges. **RESOLVED**: Omitted in deferred phase. Only "Скоро буде доступно" shown.
- [x] CHK015 — "Instant delivery" claim. **RESOLVED**: No such claims. Mini-horoscope is free teaser only.

## Landing Page Section Coverage

- [x] CHK016 — 4 pain point questions. **RESOLVED**: All 4 used verbatim in PainPointsSection.
- [x] CHK017 — 6 hashtags. **RESOLVED**: All 6 hashtag pills implemented.
- [x] CHK018 — Product card extras (images, NEW badge, social proof). **RESOLVED**: MVP uses simplified card. Extras deferred to polish phase.
- [x] CHK019 — Testimonial avatars/product type. **RESOLVED**: Testimonials include name, text, rating, product type, date. Avatars = colored initials.
- [x] CHK020 — Dashboard mockup. **RESOLVED**: Static illustrative mockup in AccountBenefitsSection. Not live data.
- [x] CHK021 — -25% discount. **RESOLVED**: Discount messaging removed. EmailSubscriptionSection promotes free newsletter value.

## Free Tools Coverage

- [x] CHK022 — Daily Horoscope 2-step form. **RESOLVED**: T069 defines 2-step form. Spec US6-2 confirms. Consistent.
- [x] CHK023 — Email capture on chart page. **RESOLVED**: Excluded. Cross-sell CTA (T070) links to product page with email form.
- [x] CHK024 — `free_birth_chart_generated` event. **RESOLVED**: Simplified set. Chart creation tracked via existing analytics.
- [x] CHK025 — `ascendant_calculated` event. **RESOLVED**: Simplified set. Tracked via page views + form submission.

## Product Pages Coverage

- [x] CHK026 — Email field in ProductForm. **RESOLVED**: T050 includes email. Spec US3-1 also lists it. No gap.
- [x] CHK027 — "Продовжити" button. **RESOLVED**: Shows "Скоро буде доступно" toast + tracks PAYWALL_CTA_CLICKED. **Source docs updated**: T050, spec US3-1.
- [x] CHK028 — Cross-sell logic. **RESOLVED**: 2-3 products from same/related category, excluding current. Category-based selection.

## Dashboard Coverage

- [x] CHK029 — Order History. **RESOLVED**: Not shown. Orders fully deferred. Dashboard = daily summary + products + profiles.
- [x] CHK030 — Categories conflict. **RESOLVED**: **love/career/health** canonical. **Source docs updated**: spec FR-009, US4-1. API contract already consistent.
- [x] CHK031 — Auth methods. **RESOLVED**: Email/password sufficient for MVP. Magic link/Google deferred (FR-017).

## Analytics Events Coverage

- [x] CHK032 — `quiz_step_back`. **RESOLVED**: Simplified set. Step numbers in QUIZ_STEP_COMPLETED allow funnel analysis.
- [x] CHK033 — `quiz_time_unknown_selected`. **RESOLVED**: Tracked as `birth_time_unknown` metadata on step 4 event.
- [x] CHK034 — `product_form_started/completed`. **RESOLVED**: Simplified set. PRODUCT_PAGE_VIEWED + PAYWALL_CTA_CLICKED sufficient.
- [x] CHK035 — `plan_selected/payment_initiated`. **RESOLVED**: PAYWALL_CTA_CLICKED sufficient for deferred phase.
- [x] CHK036 — `mini_horoscope_viewed`. **RESOLVED**: Added to implementation. Fires on quiz completion alongside QUIZ_COMPLETED.
- [x] CHK037 — Auth events. **RESOLVED**: PostHog auto-captures $identify. Supabase auth hooks cover registration.
- [x] CHK038 — Nav events. **RESOLVED**: Tracked inline in DesktopNav/MobileNav per T065, not centralized.
- [x] CHK039 — Engagement events. **RESOLVED**: Deferred with Phase 9 (blog/reviews). Added when features implemented.

## User Properties Coverage

- [x] CHK040 — PostHog user properties. **RESOLVED**: `zodiac_sign`, `quiz_completed` set on quiz completion. `email_subscribed` on subscription. Purchase-related properties deferred with payments.

## Database Schema Differences

- [x] CHK041 — Orders table. **RESOLVED**: Truly deferred. Created with payment integration.
- [x] CHK042 — `last_step` in quiz_sessions. **RESOLVED**: Delegated to PostHog via QUIZ_STEP_COMPLETED events.
- [x] CHK043 — product_slug vs product_id. **RESOLVED**: Slug chosen intentionally — simpler, human-readable, immutable.

## API Endpoints Coverage

- [x] CHK044 — Stub order endpoints. **RESOLVED**: Not needed. "Coming soon" is client-side toast only.
- [x] CHK045 — /api/report vs /api/quiz/complete. **RESOLVED**: Different scope — chart AI reports vs quiz mini-horoscope. Intentionally separate.
- [x] CHK046 — Reviews routing. **RESOLVED**: Query param approach consistent with products-api.md contract.

## Competitive Advantages & Risks

- [x] CHK047 — AI instant generation claim. **RESOLVED**: Marketing focuses on "free mini-horoscope instantly". Full report speed is future advantage.
- [x] CHK048 — LiqPay ФОП/ТОВ requirement. **RESOLVED**: Documented in deferred.md as payment-phase dependency.
- [x] CHK049 — Magic Link competitive claim. **RESOLVED**: Aspirational/roadmap. Current phase focuses on product value.

## Content & Copy Gaps

- [x] CHK050 — Trust point full text. **RESOLVED**: Full Ukrainian text in HowItWorksSection component.
- [x] CHK051 — Book of Life USP text. **RESOLVED**: Full Ukrainian text with emojis in BookOfLifeSection.
- [x] CHK052 — Stats accuracy. **RESOLVED**: Aspirational/illustrative for new product. Updated with real data over time.
- [x] CHK053 — Account benefit texts. **RESOLVED**: Full Ukrainian text in AccountBenefitsSection.

## Deferred Items Audit

- [x] CHK054 — Mini-horoscope prompt. **RESOLVED**: Defined in /api/quiz/complete. ~500 tokens in, ~300 out.
- [x] CHK055 — Deferred work documented. **RESOLVED**: deferred.md has full list.
- [x] CHK056 — Out-of-scope completeness. **RESOLVED**: Spec §Out of Scope covers all astromix-spec Phase 3-6 items.

## Resolution Summary

- **56/56 items resolved**
- **Source docs changed**: spec.md (FR-009, US3-1, US4-1), tasks.md (T050, T056), plan.md (scale estimate)
- **New tasks from issues**: None — T065b (legal pages) already existed
- **Deferred items**: Analytics granularity, order endpoints, payment trust badges, social proof counters
