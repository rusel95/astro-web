# Tasks: Zorya Platform Redesign (Astromix-Level Product)

**Input**: Design documents from `/specs/001-astromix-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks omitted. Existing Playwright suites will cover regression.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Route group refactoring, shared types, and library modules that all stories depend on

- [x] T001 Refactor root layout to providers-only: strip nav/footer from `src/app/layout.tsx`, keep only html/body/fonts/PostHogProvider/CookieConsent
- [x] T002 Create main route group layout at `src/app/(main)/layout.tsx` — move nav, footer, MobileNav, AuthNav here from old root layout
- [x] T003 Move all existing pages into `src/app/(main)/` route group (page.tsx, dashboard/, moon/, zodiac/, compatibility/, horoscopes/, chart/, auth/, explore/) — preserve all URLs
- [x] T004 Create quiz route group layout at `src/app/(quiz)/layout.tsx` — minimal layout with logo only, light theme CSS (quiz-theme class), no header/footer/mobile nav
- [x] T005 Add quiz light theme CSS variables and `body:has(.quiz-theme)` overrides to `src/app/globals.css`
- [x] T006 Verify build passes after route group refactor: `npm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Supabase schema, product data, analytics events, and shared modules that MUST be complete before user story work

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create Supabase tables: `products`, `quiz_sessions`, `reviews`, `email_subscriptions` — run SQL from `quickstart.md` in Supabase SQL editor
- [ ] T008 Create Supabase RLS policies for all 4 new tables — run RLS SQL from `quickstart.md`
- [ ] T009 Extend `profiles` table with new columns: `email_subscribed`, `quiz_completed`, `quiz_completed_at` — run ALTER TABLE from `quickstart.md`
- [ ] T010 Seed 16 products into `products` table — run INSERT SQL from `quickstart.md`
- [x] T011 [P] Create product types and static data at `src/lib/products/types.ts` — define Product, ProductCategory interfaces and PRODUCT_CATEGORIES constant
- [x] T012 [P] Create product catalog static data at `src/lib/products/data.ts` — all 16 products with slug, name_uk, category, description_uk, value_props_uk, price_usd, icon, sort_order
- [x] T013 [P] Create quiz types at `src/lib/quiz/types.ts` — QuizState, QuizAction, QuizStep interfaces, TOTAL_STEPS=6 constant
- [x] T014 [P] Create quiz reducer at `src/lib/quiz/reducer.ts` — quizReducer with NEXT/BACK/SET_ANSWER/RESET actions, sessionStorage persistence on each dispatch
- [x] T015 [P] Create quiz validation at `src/lib/quiz/validation.ts` — per-step validators (step 0: birthDate required, step 2: city+lat required, step 3: time or unknown checked, step 4: name+gender, step 5: email+consent)
- [x] T016 [P] Create quiz tracking helpers at `src/lib/quiz/tracking.ts` — getOrCreateQuizSessionId(), trackQuizStart(), trackQuizStep(), trackQuizAbandonment() using existing PostHog `track()` function
- [x] T017 [P] Add new analytics events to `src/lib/analytics/events.ts` — ALL events from astromix-spec
- [x] T018 Verify build passes after foundational work: `npm run build`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Quiz Sales Funnel (Priority: P1) MVP

**Goal**: 6-step quiz funnel that captures birth data + email, generates a free mini-horoscope teaser, and displays a paywall with product options

**Independent Test**: Navigate to /quiz, complete all 6 steps, verify mini-horoscope shows natal chart + 2-3 interpreted aspects, verify paywall section appears below

### Implementation for User Story 1

- [x] T019 [P] [US1] Create QuizProgressBar component at `src/components/quiz/QuizProgressBar.tsx`
- [x] T020 [P] [US1] Create QuizStep1Birthday component at `src/components/quiz/QuizStep1Birthday.tsx`
- [x] T021 [P] [US1] Create QuizStep2Sign component at `src/components/quiz/QuizStep2Sign.tsx`
- [x] T022 [P] [US1] Create QuizStep3Birthplace component at `src/components/quiz/QuizStep3Birthplace.tsx`
- [x] T023 [P] [US1] Create QuizStep4BirthTime component at `src/components/quiz/QuizStep4BirthTime.tsx`
- [x] T024 [P] [US1] Create QuizStep5NameGender component at `src/components/quiz/QuizStep5NameGender.tsx`
- [x] T025 [P] [US1] Create QuizStep6Email component at `src/components/quiz/QuizStep6Email.tsx`
- [x] T026 [US1] Create quiz page at `src/app/(quiz)/quiz/page.tsx`
- [x] T027 [US1] Create POST `/api/quiz/session` route at `src/app/api/quiz/session/route.ts`
- [x] T028 [US1] Create POST `/api/quiz/complete` route at `src/app/api/quiz/complete/route.ts`
- [x] T029 [US1] Create MiniHoroscope component at `src/components/quiz/MiniHoroscope.tsx`
- [x] T030 [US1] Create PaywallSection component at `src/components/product/PaywallSection.tsx`
- [x] T031 [US1] Integrate mini-horoscope + paywall into quiz completion flow in `src/app/(quiz)/quiz/page.tsx`
- [x] T032 [US1] Verify quiz flow end-to-end: build passes, all components wired

**Checkpoint**: Quiz funnel fully functional — users can complete quiz and see mini-horoscope + paywall

---

## Phase 4: User Story 2 — Redesigned Landing Page (Priority: P1)

**Goal**: 11-section landing page that educates visitors and drives them into the quiz funnel from multiple touchpoints

**Independent Test**: Load homepage, verify all 11 sections render, all CTAs link to /quiz, product catalog filters work, email form submits

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create HeroSection component at `src/components/landing/HeroSection.tsx` — headline "Ваші персональні гороскопи та прогнози", subheadline, CTA button linking to /quiz, illustrative visual (book mockup), track hero_cta_clicked
- [ ] T034 [P] [US2] Create PainPointsSection component at `src/components/landing/PainPointsSection.tsx` — chat-message styled cards with Framer Motion stagger animation ("Що мене чекає?", "Коли зустріну кохання?", etc.), hashtag pills, CTA to quiz
- [ ] T035 [P] [US2] Create HowItWorksSection component at `src/components/landing/HowItWorksSection.tsx` — "Як ми знаємо відповіді?" with 3 trust points (NASA data, software, team), moon illustration, CTA
- [ ] T036 [P] [US2] Create ProductCatalog component at `src/components/landing/ProductCatalog.tsx` — category filter pills (Усі/Призначення/Кохання/Діти/Здоров'я/Майбутнє/Гроші), default "Усі", product cards in CSS scroll-snap carousel, AnimatePresence on filter change, track product_card_clicked
- [ ] T037 [P] [US2] Create CategoryFilter component at `src/components/catalog/CategoryFilter.tsx` — horizontal pill buttons, active state with zorya gradient, "Усі" default
- [ ] T038 [P] [US2] Create ProductCard component at `src/components/catalog/ProductCard.tsx` — GlassCard with icon, product name, description, price, "Детальніше" link to /horoscope/[slug]
- [ ] T039 [P] [US2] Create BookOfLifeSection component at `src/components/landing/BookOfLifeSection.tsx` — USP blocks (Індивідуальний, Персоналізований, 30+ сторінок, Зручно), mobile mockup, CTA
- [ ] T040 [P] [US2] Create TestimonialsSection component at `src/components/landing/TestimonialsSection.tsx` — 3 review cards with name, text, 5-star rating, styled as GlassCards
- [ ] T041 [P] [US2] Create StatsSection component at `src/components/landing/StatsSection.tsx` — animated counters with real stats from /api/stats where available (e.g. total charts generated), fallback to meaningful defaults (100,000+ гороскопів, 30+ років, 97% відгуків), CTA
- [ ] T042 [P] [US2] Create AccountBenefitsSection component at `src/components/landing/AccountBenefitsSection.tsx` — 5 benefit checkmarks, dashboard mockup with percentage bars, "Створити акаунт" CTA
- [ ] T043 [P] [US2] Create BlogPreviewSection component at `src/components/landing/BlogPreviewSection.tsx` — since blog is deferred, render a simpler CTA section: "Скоро: Блог Зоря" heading with brief teaser text about upcoming astrology content, email subscription prompt (reuse EmailSubscriptionSection or inline form), track BLOG_CTA_CLICKED. Alternatively, omit this section entirely from landing page composition in T047 if it feels forced
- [ ] T044 [P] [US2] Create EmailSubscriptionSection component at `src/components/landing/EmailSubscriptionSection.tsx` — email + name inputs, submit button, "Астрологічні оновлення на пошту" messaging, benefits list, calls POST /api/email/subscribe on submit
- [ ] T045 [P] [US2] Create SeoTextSection component at `src/components/landing/SeoTextSection.tsx` — "Точна астрологія" heading with 2-3 SEO paragraphs
- [ ] T046 [US2] Create POST `/api/email/subscribe` route at `src/app/api/email/subscribe/route.ts` — validate email, upsert to email_subscriptions table, return success (per contracts/email-api.md)
- [ ] T047 [US2] Rewrite landing page at `src/app/(main)/page.tsx` — compose section components in order (Hero → PainPoints → HowItWorks → ProductCatalog → BookOfLife → Testimonials → Stats → AccountBenefits → BlogPreview (optional, see T043) → EmailSubscription → SeoText), add SEO metadata. BlogPreview can be omitted if the "coming soon" teaser feels forced — 10 sections is fine
- [ ] T048 [US2] Verify landing page: all 11 sections render, CTAs link to /quiz, product catalog filters, email subscription saves to Supabase

**Checkpoint**: Landing page complete — visitors see full marketing funnel page driving to quiz

---

## Phase 5: User Story 3 — Product Pages & Paywall (Priority: P1)

**Goal**: 16 product pages using a shared template, with value propositions, birth data form (pre-filled from quiz), and display-only paywall

**Independent Test**: Navigate to /horoscope/personality, verify page shows product info, form accepts input, "coming soon" on purchase click

### Implementation for User Story 3

- [ ] T049 [P] [US3] Create ProductValueProps component at `src/components/product/ProductValueProps.tsx` — render 3-4 value proposition blocks with icons from product data
- [ ] T050 [P] [US3] Create ProductForm component at `src/components/product/ProductForm.tsx` — birth data form (name, gender, DOB, time, city, email) pre-filled from quiz session via sessionStorage. No submit/CTA button — form only collects data (payment integration deferred)
- [ ] T051 [P] [US3] Create ProductPageTemplate component at `src/components/product/ProductPageTemplate.tsx` — compose breadcrumb, hero (name + subtitle), ProductValueProps, divider, ProductForm, CTA, SEO content, cross-sell cards
- [ ] T052 [US3] Create GET `/api/products` route at `src/app/api/products/route.ts` — query Supabase products table, optional category filter, return sorted product list (per contracts/products-api.md)
- [ ] T053 [US3] Create dynamic product page at `src/app/(main)/horoscope/[slug]/page.tsx` — look up product by slug from static data, render ProductPageTemplate, generate SEO metadata per product, track PRODUCT_PAGE_VIEWED
- [ ] T054 [US3] Add generateStaticParams to product page for all 16 slugs (SSG) at `src/app/(main)/horoscope/[slug]/page.tsx`
- [ ] T055 [US3] Verify product pages: navigate to /horoscope/personality and /horoscope/love, verify template renders correctly, form pre-fills from quiz session if available

**Checkpoint**: All 16 product pages accessible via /horoscope/[slug] — quiz users see pre-filled forms

---

## Phase 6: User Story 4 — User Dashboard (Priority: P2)

**Goal**: Enhanced dashboard with daily horoscope summary, recommended products, and multi-profile management

**Independent Test**: Log in, visit /dashboard, verify daily summary shows, profile management allows adding a family member profile

### Implementation for User Story 4

- [ ] T056 [P] [US4] Create DailySummary component at `src/components/dashboard/DailySummary.tsx` — personalized greeting, today's date, love/career/health percentage bars (fetched from /api/daily-horoscope for user's zodiac sign via Astrology API), "Фокус дня" indicator
- [ ] T057 [P] [US4] Create ProfileManager component at `src/components/dashboard/ProfileManager.tsx` — list current profiles, enforce max 5 additional profiles per account (FR-010), disable "Додати профіль" button when limit reached with message, form (name, DOB, time, city, gender), save to Supabase charts table linked to user
- [ ] T058 [P] [US4] Create RecommendedProducts component at `src/components/dashboard/RecommendedProducts.tsx` — show 3-4 product cards from catalog that user hasn't purchased, prioritize by zodiac relevance
- [ ] T059 [US4] Enhance dashboard page at `src/app/(main)/dashboard/page.tsx` — integrate DailySummary, existing chart list, RecommendedProducts, ProfileManager sections. Keep existing "Мої карти" functionality
- [ ] T060 [US4] Verify dashboard: log in, check daily summary renders with user's zodiac sign, verify add profile form works, verify recommended products display

**Checkpoint**: Dashboard provides daily value and product discovery for returning users

---

## Phase 7: User Story 5 — Navigation & Footer (Priority: P2)

**Goal**: Redesigned header with dropdown menus for product categories and free tools, plus a comprehensive footer

**Independent Test**: Hover "Гороскопи" dropdown on desktop — see products by category. Check mobile hamburger menu works. Footer shows all links.

### Implementation for User Story 5

- [ ] T061 [P] [US5] Create DropdownMenu component at `src/components/navigation/DropdownMenu.tsx` — hover-triggered on desktop, click-triggered on mobile, supports grouped items by category, close on outside click, Framer Motion enter/exit animation
- [ ] T062 [P] [US5] Create DesktopNav component at `src/components/navigation/DesktopNav.tsx` — logo, "2026" link, "Гороскопи" dropdown (products by 6 categories), "Безкоштовно" dropdown (6 free tools), "Блог" link, "UA" language indicator, auth button/user menu
- [ ] T063 [P] [US5] Create NewFooter component at `src/components/navigation/NewFooter.tsx` — 4-column layout (Персональні сервіси, Для партнерів, Про компанію, Контакти), all links, copyright
- [ ] T064 [US5] Update MobileNav at `src/components/MobileNav.tsx` — add hamburger menu that expands with nested sections for "Гороскопи" and "Безкоштовно" categories, keep bottom bar with key shortcuts
- [ ] T065 [US5] Update main layout at `src/app/(main)/layout.tsx` — replace current nav with DesktopNav, replace Footer with NewFooter, track nav_dropdown_opened and nav_item_clicked events
- [ ] T065b [US5] Create placeholder legal pages at `src/app/(main)/legal/terms/page.tsx`, `src/app/(main)/legal/privacy/page.tsx`, `src/app/(main)/legal/cookies/page.tsx` — simple pages with "Сторінка в розробці" text, basic SEO metadata (title, description), consistent styling with GlassCard
- [ ] T066 [US5] Verify navigation: desktop dropdowns open on hover with all products/tools listed, mobile hamburger works, footer renders 4 columns, all links resolve, legal pages accessible

**Checkpoint**: Full navigation system with product discoverability across desktop and mobile

---

## Phase 8: User Story 6 — Free Tools Expansion (Priority: P3)

**Goal**: New Ascendant Calculator and Daily Horoscope pages. Cross-sell CTAs on existing free tools.

**Independent Test**: Visit /ascendant with valid birth data → see ascendant sign. Visit /daily → see daily forecast. Visit existing /chart/[id] → see CTA for full report.

### Implementation for User Story 6

- [ ] T067 [P] [US6] Create Ascendant Calculator page at `src/app/(main)/ascendant/page.tsx` — hero section, birth data form (date + time REQUIRED + city), call existing Astrology API to get ascendant, display result with ZodiacIcon + description in Ukrainian, "Велика трійка" explanation, CTA to /horoscope/personality, SEO metadata
- [ ] T068 [P] [US6] Create GET `/api/daily-horoscope` route at `src/app/api/daily-horoscope/route.ts` — accept sign query param, fetch daily forecast via Astrology API SDK (love/career/health categories), format in Ukrainian, cache per sign per day (ISR or in-memory), return per contracts/products-api.md
- [ ] T069 [US6] Create Daily Horoscope page at `src/app/(main)/daily/page.tsx` — hero, 2-step form (step 1: birth data — date/time/city; step 2: email), "безкоштовно" badge prominently highlighted, after form submit fetch daily forecast from /api/daily-horoscope and display with love/career/health categories, CTA to /horoscope/monthly, SEO metadata
- [ ] T070 [US6] Add cross-sell CTA to existing natal chart result page at `src/app/(main)/chart/[id]/page.tsx` — below chart results, add GlassCard with "Отримати повний Гороскоп Особистості" linking to /horoscope/personality
- [ ] T071 [US6] Add cross-sell CTA to existing compatibility page at `src/app/(main)/compatibility/page.tsx` — after results, add CTA to /horoscope/love-compatibility
- [ ] T072 [US6] Add cross-sell CTA to existing moon page at `src/app/(main)/moon/page.tsx` — subtle banner linking to /horoscope/calendar (Персональний календар)
- [ ] T073 [US6] Verify free tools: /ascendant calculates and shows result, /daily shows forecast, cross-sell CTAs appear on chart/compatibility/moon pages

**Checkpoint**: Two new free tools live, existing tools drive users toward paid products

---

## Phase 9: User Story 7 — Blog, Reviews & Content (Priority: P3) — DEFERRED

**Status**: Moved to deferred.md. Will be implemented after core platform is stable.

**Deferred tasks**: T074, T075, T076, T077, T078, T079, T080

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, SEO, performance, and analytics completeness

- [ ] T081 Add SEO metadata (title, description, og:image) to all new pages: quiz, all 16 product pages, ascendant, daily, blog, reviews, 2026
- [ ] T082 Mobile responsiveness pass — verify all new pages render correctly on 375px (iPhone SE) and 390px (iPhone 14) viewports
- [ ] T083 Verify PostHog analytics: check all new events fire correctly (quiz steps, product clicks, paywall views, email subscriptions, nav interactions) using PostHog debugger
- [ ] T084 Performance check — run Lighthouse on landing page and quiz, verify <3s load on simulated 3G
- [ ] T085 Full build verification: `npm run build` passes cleanly with no TypeScript errors
- [ ] T086 Deploy to production and verify on https://astro-web-five.vercel.app

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 Quiz (Phase 3)**: Depends on Phase 2 — core MVP
- **US2 Landing (Phase 4)**: Depends on Phase 2 — can run in parallel with US1
- **US3 Products (Phase 5)**: Depends on Phase 2 + product data from Phase 2 — can run in parallel with US1/US2
- **US4 Dashboard (Phase 6)**: Depends on Phase 2 — independent of US1-US3
- **US5 Navigation (Phase 7)**: Depends on Phase 2 + product data — benefits from US3 product pages existing
- **US6 Free Tools (Phase 8)**: Depends on Phase 2 + US3 product pages (for cross-sell links)
- **US7 Content (Phase 9)**: Depends on Phase 2 — independent of other stories
- **Polish (Phase 10)**: Depends on all desired stories being complete

### User Story Dependencies

- **US1 (Quiz)**: Independent after Phase 2. No other story dependencies.
- **US2 (Landing)**: Independent after Phase 2. References product data (Phase 2 T012) and links to /quiz (US1).
- **US3 (Products)**: Independent after Phase 2. Pre-fill benefits from US1 quiz sessions.
- **US4 (Dashboard)**: Independent after Phase 2. Shows recommended products from T012.
- **US5 (Navigation)**: Independent after Phase 2. Links to US3 product pages and US6 free tools.
- **US6 (Free Tools)**: Cross-sell CTAs link to US3 product pages — works best after US3.
- **US7 (Content)**: Fully independent. Reviews reference product slugs from T012.

### Parallel Opportunities

**Within Phase 2 (Foundational)**:
```
Parallel: T011 + T012 + T013 + T014 + T015 + T016 + T017 (all different files)
```

**Within Phase 3 (US1 Quiz)**:
```
Parallel: T019 + T020 + T021 + T022 + T023 + T024 + T025 (all step components)
Then: T026 (compose page — needs all steps)
Parallel: T027 + T028 (API routes)
Then: T029 + T030 (display components)
Then: T031 (integration)
```

**Within Phase 4 (US2 Landing)**:
```
Parallel: T033-T045 (all 11 section components + email API)
Then: T047 (compose landing page)
```

**Across user stories (after Phase 2)**:
```
Parallel: US1 (Quiz) + US2 (Landing) + US3 (Products) + US4 (Dashboard) + US7 (Content)
Then: US5 (Navigation) — benefits from US3
Then: US6 (Free Tools) — needs US3 for cross-sell links
```

---

## Implementation Strategy

### MVP First (US1 Quiz Only)

1. Complete Phase 1: Setup (route groups)
2. Complete Phase 2: Foundational (tables, data, types)
3. Complete Phase 3: US1 Quiz Funnel
4. **STOP and VALIDATE**: Test quiz end-to-end
5. Deploy — users can take the quiz and see mini-horoscope

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 Quiz → Deploy (MVP!)
3. US2 Landing → Deploy (users see real marketing page)
4. US3 Products → Deploy (16 product pages live)
5. US5 Navigation → Deploy (full site navigation)
6. US4 Dashboard → Deploy (returning user value)
7. US6 Free Tools → Deploy (SEO traffic)
8. US7 Content → Deploy (blog, reviews, 2026)
9. Polish → Final production deploy

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to specific user story for traceability
- All UI text must be in Ukrainian (FR-021)
- Use `<ZodiacIcon>` component for all zodiac rendering — never unicode symbols
- Use existing components: GlassCard, CosmicBackground, CitySearch, DatePicker, TimePicker
- Product data is static TypeScript (T012) for page rendering; Supabase products table (T010) for paywall pricing
- Quiz state is client-side only (useReducer + sessionStorage) until completion, then saved to Supabase
- Commit after each task or logical group
- Run `npm run build` after each phase to catch TypeScript errors early
