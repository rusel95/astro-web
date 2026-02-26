# Astromix Source Coverage Checklist: Zorya Platform Redesign

**Purpose**: Cross-reference the original astromix-spec.md (source of truth for the redesign) against all derived design artifacts (spec.md, plan.md, tasks.md, data-model.md, contracts/, research.md) to identify missed requirements, divergences, and gaps
**Created**: 2026-02-26
**Source**: [astromix-spec.md](../../tasks/astromix-spec.md)
**Feature**: [spec.md](../spec.md)
**Depth**: Maximum | **Focus**: Full coverage audit

---

## Navigation & Footer Coverage

- [ ] CHK001 — Astromix-spec §1.1 nav lists a "2026" link as a top-level nav item. Tasks T062 includes it but spec.md §US5 acceptance scenarios don't mention it. Is this required at nav level or only as a page? [Coverage, astromix-spec §1.1 vs Spec §US5]
- [ ] CHK002 — Astromix-spec §1.2 footer includes "Планети у знаках" (Planets in Signs) as a service link. No page definition, route, or task exists for this page anywhere in spec/plan/tasks. Is this page in scope or intentionally excluded? [Gap, astromix-spec §1.2]
- [ ] CHK003 — Astromix-spec §1.2 footer lists legal pages: "Угода" (Terms), "Конфіденційність" (Privacy Policy), "Cookies". No legal page requirements, routes, or tasks exist in our design artifacts. Are legal pages in scope? [Gap, astromix-spec §1.2 vs all artifacts]
- [ ] CHK004 — Astromix-spec §1.2 footer lists "Для астрологів" (For Astrologers) and "Партнерство" (Partnership) under "Для партнерів" column. No requirements for these pages exist. Are they placeholder links or real pages? [Gap, astromix-spec §1.2]
- [ ] CHK005 — Astromix-spec §1.2 footer links "Кар'єра та покликання" as a service. This maps to `/horoscope/career` product page. Is the footer link text specified to match the product name exactly ("Кар'єрний гороскоп" in seed data vs "Кар'єра та покликання" in footer)? [Consistency, astromix-spec §1.2 vs quickstart.md §Seed]

## Quiz Funnel Coverage

- [ ] CHK006 — Astromix-spec §Додаток А shows Astromix uses 7 progress dots (6 steps + final result). Our spec/tasks define 6 dots (T019). Should the progress bar include a 7th dot for the result/mini-horoscope state? [Coverage, astromix-spec §Додаток А vs tasks.md §T019]
- [ ] CHK007 — Astromix-spec §2.2 Step 1 specifies year range "1936-2026" for the year dropdown. Our tasks T020 don't specify a year range. Is the date range for birth year defined? [Completeness, astromix-spec §2.2 vs tasks.md §T020]
- [ ] CHK008 — Astromix-spec §2.2 Step 2 recommends "Додати коротку цікаву факт про знак (engagement hook)". Tasks T021 includes "brief fun fact". But is the source/content of fun facts per zodiac sign defined anywhere? [Completeness, astromix-spec §2.2 vs tasks.md §T021]
- [ ] CHK009 — Astromix-spec §2.2 Step 4 lists TWO PostHog events: `quiz_step_4_birthtime` AND `quiz_step_4_time_unknown_checked`. Our tasks T017 only defines `QUIZ_STEP_COMPLETED` as a generic event. Is the granular "time unknown" event tracked separately? [Coverage, astromix-spec §2.2 vs tasks.md §T017]
- [ ] CHK010 — Astromix-spec §2.2 Step 6 has specific label text: "Бажаєте отримувати персональні рекомендації від нашого астролога?" and "Залиште email і ми надішлемо вам персональний звіт". But spec says email sending is deferred (FR-007). Does the quiz promise email delivery that won't actually happen? [Conflict, astromix-spec §2.2 vs Spec §FR-007]
- [ ] CHK011 — Astromix-spec §2.3 shows a VALUE PROPOSITION section between the mini-horoscope and the paywall: "From the complete Personality Horoscope, you will learn: [6 benefit items]". Our spec/tasks don't define this intermediate content block — the paywall section (T030) appears directly. Is this engagement block missing? [Gap, astromix-spec §2.3 vs tasks.md §T030-T031]
- [ ] CHK012 — Astromix-spec §2.3 mentions "You can read this book completely for free" and "Fill out the form and receive a small part of your future Personality Horoscope" as pre-quiz messaging. Is this below-quiz-form content defined in our requirements? [Gap, astromix-spec §2.3]

## Paywall Coverage

- [ ] CHK013 — Astromix-spec §2.4 paywall shows TWO plan tiers: (1) "Гороскоп особистості" standalone and (2) "Гороскоп + Прогноз на 3 роки" bundle with savings percentage. Our spec says "product tiers" (plural) but tasks T030 doesn't define the specific tier structure. Are the exact paywall tiers specified? [Completeness, astromix-spec §2.4 vs Spec §FR-004]
- [ ] CHK014 — Astromix-spec §2.4 paywall includes "🔒 Безпечна оплата · Visa · MC · PayPal" trust badges and "📧 Доставка на email протягом 24 годин". Since payment is deferred, should these trust elements appear (misleading) or be omitted? [Consistency, astromix-spec §2.4 vs Spec §Scope Boundaries]
- [ ] CHK015 — Astromix-spec §2.4 mentions "Ми генеруємо AI-звіт МИТТЄВО через OpenAI" as a key competitive advantage. But FR-006 defers full report generation. The paywall should not claim "instant delivery" if the product can't be delivered yet. Is the messaging aligned with deferred scope? [Conflict, astromix-spec §2.4 vs Spec §FR-006]

## Landing Page Section Coverage

- [ ] CHK016 — Astromix-spec §3.1 Секція 2 lists exactly 4 pain point questions: "Що мене чекає?", "Коли зустріну кохання?", "Хто я насправді?", "Чи будуть у мене діти?". Tasks T034 lists only 2 examples with "etc.". Are all 4 original questions required, or is the content flexible? [Completeness, astromix-spec §3.1 vs tasks.md §T034]
- [ ] CHK017 — Astromix-spec §3.1 Секція 2 lists hashtags: #ЗДОРОВ'Я #ГРОШІ #МАЙБУТНЄ #ПРИЗНАЧЕННЯ #КОХАННЯ #ДІТИ. Tasks T034 mentions "hashtag pills" but doesn't list specific hashtags. Are these the required hashtags? [Completeness, astromix-spec §3.1 vs tasks.md §T034]
- [ ] CHK018 — Astromix-spec §3.1 Секція 4 product cards include: image, name, "NEW!" badge, social proof counters ("XX.X K ❤️ та XX.X K 🛒"), short description (3 points), "Детальніше" button. Our tasks T038 (ProductCard) only mentions "icon, product name, description, price, Детальніше link". Missing: images, NEW badge, social proof counters. Are these required? [Coverage, astromix-spec §3.1 vs tasks.md §T038]
- [ ] CHK019 — Astromix-spec §3.1 Секція 6 says "Ми допомогли 33000+ клієнтам з 12 країн" — tasks T040 says "3 review cards with name, text, 5-star rating". The original spec suggests adding "фото/аватари + дату + тип продукту" as improvements. Are avatars and product type included in our testimonials? [Coverage, astromix-spec §3.1 vs tasks.md §T040]
- [ ] CHK020 — Astromix-spec §3.1 Секція 8 shows specific dashboard mockup percentages: "Love 76%, Career 100%, Money 77%". Tasks T042 mentions "dashboard mockup with percentage bars". Is this a static mockup image or live data demonstration? [Clarity, astromix-spec §3.1 vs tasks.md §T042]
- [ ] CHK021 — Astromix-spec §3.1 Секція 10 promises "-25% знижку на перший гороскоп!" but payment is deferred. Promising a discount on something that can't be purchased is potentially misleading. Is the discount messaging appropriate for the deferred-payment phase? [Conflict, astromix-spec §3.1 vs Spec §Scope Boundaries]

## Free Tools Coverage

- [ ] CHK022 — Astromix-spec §3.2.3 defines Daily Horoscope page with a 2-STEP FORM (Step 1: Name, Gender, Date, Time, City; Step 2: Email) BEFORE showing the result. Our spec/tasks T069 define it as a simple zodiac sign selector with no form. Major divergence — is the form-based approach (data capture before showing result) intentionally dropped? [Coverage, astromix-spec §3.2.3 vs tasks.md §T069]
- [ ] CHK023 — Astromix-spec §3.2.1 says natal chart page should add "email-capture після генерації". No task or spec requirement exists for adding email capture to the existing `/chart/[id]` page. Is this intentionally excluded? [Coverage, astromix-spec §3.2.1 vs tasks.md §T070]
- [ ] CHK024 — Astromix-spec §3.2.1 mentions event `free_birth_chart_generated`. This event is not in our tasks T017 analytics events list. Should it be tracked? [Coverage, astromix-spec §3.2.1 vs tasks.md §T017]
- [ ] CHK025 — Astromix-spec §3.2.2 (Ascendant Calculator) mentions PostHog event `ascendant_calculated`. Not in our tasks T017 analytics events. [Coverage, astromix-spec §3.2.2 vs tasks.md §T017]

## Product Pages Coverage

- [ ] CHK026 — Astromix-spec §3.3 product page form includes 6 fields: "Name, Gender, DOB, Time, City, Email". Tasks T050 (ProductForm) lists 5 fields: "name, gender, DOB, time, city" — Email is MISSING. Is email collection on product pages intentionally dropped? [Coverage, astromix-spec §3.3 vs tasks.md §T050]
- [ ] CHK027 — Astromix-spec §3.3 says product form "Продовжити" button leads to "квіз/checkout". Our spec/tasks don't define what the "Продовжити" button does since payment is deferred. Is it "coming soon" toast? Redirect to quiz? [Gap, astromix-spec §3.3 vs tasks.md §T050]
- [ ] CHK028 — Astromix-spec §3.3 product pages include "Cross-sell інших продуктів" (item 8 in template). Tasks T051 mentions "cross-sell cards" but no task defines which products to cross-sell on which product page. Is the cross-sell logic defined? [Gap, astromix-spec §3.3 vs tasks.md §T051]

## Dashboard Coverage

- [ ] CHK029 — Astromix-spec §3.4 dashboard includes "Історія замовлень" (Order History) with status and "Завантажити PDF" button. Our spec marks orders as deferred (§Scope Boundaries). But should an empty "Історія замовлень" section be shown as a placeholder? [Coverage, astromix-spec §3.4 vs Spec §Scope Boundaries]
- [ ] CHK030 — Astromix-spec §3.4 dashboard shows "Love/Career/Money" percentages (Money = Фінанси/Гроші). Our spec §FR-009 says "love/career/finance". Contract says "love/career/health". Astromix-spec says "love/career/money". Three different labels across three documents. Which is canonical? [Conflict, astromix-spec §3.4 vs Spec §FR-009 vs contracts/products-api.md]
- [ ] CHK031 — Astromix-spec §3.4 includes Google Sign-in and "magic link (без пароля)" for auth. Spec §FR-017 defers both. Is existing email/password auth sufficient for the dashboard experience? [Consistency, astromix-spec §3.4 vs Spec §FR-017]

## Analytics Events Coverage

- [ ] CHK032 — Astromix-spec §4.2 lists `quiz_step_back` event (tracking when users go backwards). Not in our tasks T017. Is backward navigation tracking required for funnel analysis? [Coverage, astromix-spec §4.2 vs tasks.md §T017]
- [ ] CHK033 — Astromix-spec §4.2 lists `quiz_time_unknown_selected` as a separate event. Our T017 doesn't include it. Birth time knowledge significantly affects chart accuracy — is this worth tracking separately? [Coverage, astromix-spec §4.2 vs tasks.md §T017]
- [ ] CHK034 — Astromix-spec §4.2 lists `product_form_started` and `product_form_completed` events. Our T017 doesn't include form-level tracking for product pages. Are product page form interactions tracked? [Coverage, astromix-spec §4.2 vs tasks.md §T017]
- [ ] CHK035 — Astromix-spec §4.2 lists `plan_selected` (paywall tier selection), `payment_initiated`. Our T017 only has `PAYWALL_CTA_CLICKED`. Is tier-level selection tracking needed even with deferred payments? [Coverage, astromix-spec §4.2 vs tasks.md §T017]
- [ ] CHK036 — Astromix-spec §4.2 lists `mini_horoscope_viewed` as a distinct event. Our T017 doesn't include it. This event is critical for funnel measurement (SC-003: "15% proceed to view paywall" requires knowing who viewed the mini-horoscope). [Gap, astromix-spec §4.2 vs tasks.md §T017 vs Spec §SC-003]
- [ ] CHK037 — Astromix-spec §4.2 lists auth events: `login_attempted`, `login_completed`, `registration_completed`, `profile_created`. None are in our T017. Are auth funnel events in scope? [Coverage, astromix-spec §4.2 vs tasks.md §T017]
- [ ] CHK038 — Astromix-spec §4.2 lists `nav_dropdown_opened` and `nav_item_clicked`. Tasks T065 references these events but T017 doesn't add them to the events list. Are they defined elsewhere? [Consistency, astromix-spec §4.2 vs tasks.md §T017 vs T065]
- [ ] CHK039 — Astromix-spec §4.2 lists `review_submitted`, `review_page_viewed`, `yearly_horoscope_viewed`, `blog_cta_clicked` events. None are in our tasks T017. Are all engagement events accounted for? [Coverage, astromix-spec §4.2 vs tasks.md §T017]

## User Properties Coverage

- [ ] CHK040 — Astromix-spec §4.3 defines PostHog user properties: `zodiac_sign`, `birth_date`, `has_birth_time`, `registration_date`, `total_purchases`, `total_spent`, `last_purchase_date`, `email_subscribed`, `quiz_completed`, `profile_count`. No task or requirement defines setting these user properties. Is `setUserProperties()` called anywhere in the quiz/registration flow? [Gap, astromix-spec §4.3 vs tasks.md]

## Database Schema Differences

- [ ] CHK041 — Astromix-spec §5.2 defines an `orders` table (fully specified with status, payment_status, payment_method, amount, report_data, report_pdf_url). Our data-model.md defers orders entirely. Should the table be created now (empty, for future use) or truly deferred? [Coverage, astromix-spec §5.2 vs data-model.md]
- [ ] CHK042 — Astromix-spec §5.2 quiz_sessions has `last_step INTEGER DEFAULT 0` for tracking drop-off step. Our data-model.md omits this field. Without `last_step`, server-side abandoned quiz analysis is impossible. Is this intentionally delegated to PostHog? [Consistency, astromix-spec §5.2 vs data-model.md §quiz_sessions]
- [ ] CHK043 — Astromix-spec §5.2 reviews references `product_id UUID REFERENCES products(id)`. Our data-model.md uses `product_slug TEXT NOT NULL` instead. Different referencing approach — are there data integrity trade-offs? [Consistency, astromix-spec §5.2 vs data-model.md §reviews]

## API Endpoints Coverage

- [ ] CHK044 — Astromix-spec §5.3 lists `POST /api/order/create` and `POST /api/order/payment` endpoints. These are deferred in our scope. But are stub endpoints needed for the "coming soon" paywall interaction? [Coverage, astromix-spec §5.3 vs Spec §Scope Boundaries]
- [ ] CHK045 — Astromix-spec §5.3 lists `POST /api/report/generate`, `GET /api/report/[id]`, `POST /api/report/pdf`. Our spec defers full reports (FR-006). But the mini-horoscope uses `POST /api/quiz/complete` instead. Is the existing `/api/report` endpoint reused or do we have parallel endpoints? [Consistency, astromix-spec §5.3 vs contracts/quiz-api.md]
- [ ] CHK046 — Astromix-spec §5.3 lists `GET /api/reviews/[product]` as a separate endpoint. Our contracts/products-api.md uses `GET /api/reviews?product=personality` (query param, not path param). Is the routing approach intentionally different? [Consistency, astromix-spec §5.3 vs contracts/products-api.md]

## Competitive Advantages & Risks

- [ ] CHK047 — Astromix-spec §7 identifies "AI-генерація миттєво" as the key competitive advantage over Astromix's 24-48h manual delivery. But with full reports deferred (FR-006), the only "instant" output is the free mini-horoscope (2-3 aspects). Is the competitive advantage communicated accurately in spec/marketing copy? [Consistency, astromix-spec §7 vs Spec §FR-006]
- [ ] CHK048 — Astromix-spec §8 identifies risk "Платежі — LiqPay вимагає ФОП/ТОВ для підключення". This is a business prerequisite not mentioned in our spec assumptions. Should it be documented as a dependency for the payment phase? [Gap, astromix-spec §8 vs Spec §Assumptions]
- [ ] CHK049 — Astromix-spec §7 lists "Auth: Supabase Magic Link (простіше)" as an advantage over Astromix. But our spec defers magic link (FR-017). The competitive comparison table is misleading about current capabilities. [Conflict, astromix-spec §7 vs Spec §FR-017]

## Content & Copy Gaps

- [ ] CHK050 — Astromix-spec §3.1 Секція 3 lists three specific trust points with descriptions: (1) "Використовуємо точні астрономічні дані NASA", (2) "Спеціалізоване технічне ПЗ", (3) "Команда професійних астрологів та психологів". Tasks T035 says "3 trust points (NASA data, software, team)" — abbreviated. Are the full Ukrainian descriptions for each trust point specified? [Completeness, astromix-spec §3.1 vs tasks.md §T035]
- [ ] CHK051 — Astromix-spec §3.1 Секція 5 (Book of Life) lists 4 USP items with emojis and specific text. Tasks T039 lists them abbreviated. Is the exact Ukrainian copy defined? [Completeness, astromix-spec §3.1 vs tasks.md §T039]
- [ ] CHK052 — Astromix-spec §3.1 Секція 7 stats specify exact numbers: "100,000+ персоналізованих гороскопів", "30+ років досвіду", "97% позитивних відгуків". Tasks T041 references these same numbers. Are these numbers accurate for Зоря (a new product), or should they be different? [Accuracy, astromix-spec §3.1 — stats may be aspirational, not real]
- [ ] CHK053 — Astromix-spec §3.1 Секція 8 lists 5 specific account benefits. Tasks T042 says "5 benefit checkmarks". Are the exact Ukrainian benefit texts defined matching the astromix-spec? [Completeness, astromix-spec §3.1 vs tasks.md §T042]

## Deferred Items Audit

- [ ] CHK054 — Astromix-spec §5.5 describes "Різні промпти для кожного типу продукту" and "30+ 'сторінок' контенту". Spec defers this (FR-006). But has the prompt structure for the mini-horoscope (which IS in scope) been specified? [Completeness, astromix-spec §5.5 vs Spec §FR-003]
- [ ] CHK055 — Astromix-spec §6 Phase 3 includes "Інтеграція платіжної системи (LiqPay/Stripe)" and "PDF-генерація". Both are deferred. Is the deferred work clearly documented so it can be picked up seamlessly later? [Completeness, astromix-spec §6 vs Spec §Scope Boundaries]
- [ ] CHK056 — Astromix-spec §6 Phase 6 includes "A/B тести через PostHog", "Email-маркетинг автоматизація (Resend)", "Push notifications", "Retargeting abandoned quiz sessions". All are listed as out of scope in our spec. Is the spec's out-of-scope list complete relative to astromix-spec's full roadmap? [Traceability, astromix-spec §6 vs Spec §Out of Scope]

## Notes

- This checklist validates coverage of the ORIGINAL astromix-spec.md against all derived design artifacts
- Items marked [Gap] indicate astromix-spec requirements not present in any derived artifact
- Items marked [Coverage] indicate features that may have been intentionally simplified or dropped — resolution required
- Items marked [Conflict] indicate contradictions between original vision and implementation plan
- Items marked [Consistency] indicate potential misalignment in how requirements were translated
- 56 items total across 12 categories
- Priority: Conflicts and Gaps should be resolved before implementation continues past Phase 2
