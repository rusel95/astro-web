# Feature Specification: Zorya Platform Redesign (Astromix-Level Product)

**Feature Branch**: `001-astromix-redesign`
**Created**: 2026-02-26
**Status**: Draft
**Input**: Full platform redesign transforming astro-web into a monetizable astrology product inspired by Astromix.net — quiz sales funnel, 16 paid horoscope product pages, user dashboard, comprehensive analytics, blog, reviews, and redesigned landing page. Payment integration deferred.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quiz Sales Funnel (Priority: P1)

A visitor arrives at the landing page and clicks the primary call-to-action. They enter a 6-step quiz: birth date, zodiac sign reveal, birthplace, birth time, name/gender, and email. After completing the quiz, they receive a free mini-horoscope (teaser) showing 2-3 natal chart aspects with brief AI-generated interpretations. Below the teaser, a paywall presents options to purchase the full personality horoscope report.

**Why this priority**: The quiz funnel is the core revenue engine — it captures user data, builds engagement through progressive disclosure, and converts visitors into paying customers. Without this, there is no monetization path.

**Independent Test**: Can be fully tested by walking through all 6 quiz steps with valid and invalid inputs, verifying the mini-horoscope appears with real astrological data, and confirming the display-only paywall appears with product tiers and "coming soon" message.

**Acceptance Scenarios**:

1. **Given** a new visitor on the landing page, **When** they click the main CTA button, **Then** they are taken to the quiz with step 1 (birth date) displayed, a progress bar showing 1/6, and no header/footer (clean quiz layout).
2. **Given** a user on quiz step 1, **When** they enter a valid birth date and click "Next", **Then** step 2 shows their zodiac sign with the correct icon and Ukrainian name.
3. **Given** a user on any quiz step (2-6), **When** they click "Back", **Then** they return to the previous step with their previously entered data preserved.
4. **Given** a user on step 4, **When** they check "I don't know my birth time", **Then** the time input is disabled, a reassuring message appears, and they can proceed to step 5.
5. **Given** a user completing step 6 with a valid email, **When** they click "Open horoscope", **Then** a mini-horoscope is generated showing their natal chart visualization and 2-3 key aspects with brief interpretations.
6. **Given** a user viewing their mini-horoscope, **When** they scroll below the teaser, **Then** a display-only paywall section appears with at least one product tier, a list of benefits they'll unlock with the full report, and a "coming soon" message on interaction.

---

### User Story 2 - Redesigned Landing Page (Priority: P1)

A visitor arrives at the redesigned homepage and sees a compelling hero section with CTA leading to the quiz. Below, they see "pain point" questions styled as chat messages, a "how it works" explainer, a product catalog with category filters and horizontal carousel, testimonials, statistics, account benefits, blog preview, and email subscription form. The page guides visitors toward the quiz funnel from multiple touchpoints.

**Why this priority**: The landing page is the first impression and the top of the funnel. Every section is designed to either educate, build trust, or drive conversion into the quiz. Without a strong landing page, quiz entry rates will be low.

**Independent Test**: Can be tested by loading the homepage, verifying all 11 sections render correctly, all CTAs link to the quiz, the product carousel scrolls and filters work, and the email subscription form captures input.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** the hero section displays with a headline, subheadline, CTA button, and an illustrative visual.
2. **Given** the homepage is loaded, **When** the visitor scrolls to the "pain points" section, **Then** animated chat-style messages appear with relatable questions (in Ukrainian).
3. **Given** the product catalog section, **When** the visitor clicks a category filter tab, **Then** the product cards filter to show only products in that category.
4. **Given** the email subscription section, **When** a visitor enters a valid email and name and submits, **Then** a success confirmation appears and the subscription is saved.

---

### User Story 3 - Paid Horoscope Products & Instant AI Reports (Priority: P1)

A user who completed the quiz or browses the product catalog navigates to a paid product page (e.g., Personality Horoscope). The page shows the product's value proposition, a brief form for birth data (pre-filled if they did the quiz), and a display-only paywall. Payment processing is deferred — the paywall tracks conversion intent for analytics.

**Why this priority**: Product pages are the foundation for future monetization. They present the value proposition and capture conversion intent even before payment is live.

**Independent Test**: Can be tested by navigating to a product page, verifying it shows product info, form accepts and pre-fills birth data from quiz, and "coming soon" message appears on purchase click with analytics event tracked.

**Acceptance Scenarios**:

1. **Given** a product page for "Personality Horoscope", **When** a user views it, **Then** they see the product name, 3-4 value proposition blocks, and a birth data form (name, gender, DOB, time, city, email) with no submit button (payment deferred).
2. **Given** a user who completed the quiz visits a product page, **When** the form loads, **Then** their birth data is pre-filled from the quiz session.
3. **Given** a user on the paywall page, **When** they click a product tier, **Then** they see a "coming soon" message indicating payment integration is planned, and the interaction is tracked for conversion analytics.

---

### User Story 4 - User Dashboard (Priority: P2)

A registered user logs in and sees their personal dashboard showing a daily horoscope summary (love/career/health percentages fetched via Astrology API SDK based on zodiac sign, cached per sign per day), recommended products, and the ability to manage profiles for family members/friends (for compatibility features).

**Why this priority**: The dashboard increases retention and lifetime value. Users return for daily horoscopes and discover new products. However, it is not required for the initial purchase flow.

**Independent Test**: Can be tested by logging in, verifying the daily summary displays with percentage indicators for the user's zodiac sign, profile management allows adding a second profile (max 5 additional), and recommended products display.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they visit the dashboard, **Then** they see a personalized greeting with their name and a daily horoscope summary with percentage indicators for love, career, and health (fetched via Astrology API SDK based on their zodiac sign, cached per sign per day).
2. **Given** a user on the dashboard, **When** they click "Add profile" in the profiles section, **Then** a form appears to enter birth data for a family member or friend (maximum 5 additional profiles per account).
3. **Given** a user on the dashboard, **When** they view "Recommended for you", **Then** product cards are shown for horoscopes relevant to their zodiac sign.

---

### User Story 5 - New Navigation & Footer (Priority: P2)

The site header is redesigned with dropdown menus: "Horoscopes" (paid products by category) and "Free" (free tools). The footer includes organized links to all services, partner info, legal pages, and contact details.

**Why this priority**: Navigation is essential for discoverability across all products, but the quiz funnel works independently of navigation. This supports exploration and SEO but is not the primary conversion path.

**Independent Test**: Can be tested by verifying both dropdowns open on hover/click, all links resolve to valid pages, and the footer renders with all sections on desktop and mobile.

**Acceptance Scenarios**:

1. **Given** the site header, **When** a user hovers over "Horoscopes", **Then** a dropdown appears with products organized by category (Purpose, Love, Children, Health, Future, Money).
2. **Given** the site header, **When** a user hovers over "Free", **Then** a dropdown shows free tools (Natal Chart, Ascendant, Daily Horoscope, Moon Calendar, Zodiac Signs, Compatibility).
3. **Given** the site on mobile, **When** the header is viewed, **Then** the navigation collapses into a hamburger menu with expandable sections.

---

### User Story 6 - Free Tools Expansion (Priority: P3)

New free tools are added: an Ascendant Calculator (/ascendant) and a Daily Horoscope (/daily). Existing free tools (natal chart, moon calendar, zodiac pages, compatibility) get cross-sell CTAs to paid products. These free tools serve as SEO traffic magnets and secondary entry points into the funnel.

**Why this priority**: Free tools drive organic traffic and SEO, but the core funnel and paid products must exist first for the cross-sell CTAs to be meaningful.

**Independent Test**: Can be tested by visiting /ascendant with valid birth data and verifying the ascendant sign is calculated and displayed, and by visiting /daily and seeing a horoscope for the user's sign.

**Acceptance Scenarios**:

1. **Given** the Ascendant Calculator page, **When** a user enters birth date, time (required), and city, **Then** their ascendant sign is displayed with a description and a CTA to the full personality report.
2. **Given** the Daily Horoscope page, **When** a user fills out a 2-step form (step 1: birth data — date, time, city; step 2: email), **Then** a daily forecast is displayed for free (with "безкоштовно" prominently highlighted) showing categories (love, career, health) and a CTA to the personalized monthly forecast product.
3. **Given** the existing natal chart result page, **When** a user views their chart, **Then** a CTA to the full Personality Horoscope product appears below the free results.

---

### User Story 7 - Blog, Reviews & Content Pages (Priority: P3)

A content section includes a blog with categorized articles (Astrology, Zodiac, Horoscopes), a reviews page with user testimonials filterable by product type, and a 2026 yearly horoscope overview page. All content pages include CTAs to relevant paid products.

**Why this priority**: Content drives SEO and builds trust but is not part of the core conversion funnel. Can be added incrementally.

**Independent Test**: Can be tested by creating a blog post, verifying it appears on the blog listing, and confirming the reviews page displays testimonials with star ratings and product filters.

**Acceptance Scenarios**:

1. **Given** the blog page, **When** a visitor browses it, **Then** articles are displayed as cards with date, category tag, and title, filterable by category.
2. **Given** the reviews page, **When** a visitor views it, **Then** reviews display with customer name, 5-star rating, review text, date, and product type, plus an overall statistics summary.
3. **Given** the 2026 yearly horoscope page, **When** a visitor views it, **Then** they see major planetary transits, quick forecasts for all 12 signs, and a CTA to personalized yearly report.

---

### Edge Cases

- What happens when a user abandons the quiz at step 3? The quiz session is saved and can be resumed if the user returns (via anonymous session tracking).
- What happens when birth time is unknown? The system uses noon (12:00) as a default, discloses this assumption, and excludes house-dependent interpretations from the report.
- What happens when OpenAI API is unavailable during report generation? The system shows a friendly error message and suggests the user try again later.
- What happens when the geocoding service (Nominatim) is slow or unavailable? The city search shows a timeout message with the option to enter coordinates manually or try again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a 6-step quiz funnel that collects birth date, birthplace, birth time, name, gender, and email in sequence with forward/backward navigation and a progress indicator.
- **FR-002**: System MUST calculate the user's zodiac sign from their birth date and display it with the correct Ukrainian name and custom SVG icon at quiz step 2.
- **FR-003**: System MUST generate a free mini-horoscope after quiz completion, showing a natal chart visualization and 2-3 key aspects with brief AI interpretations.
- **FR-004**: System MUST display a paywall after the mini-horoscope showing product tiers and pricing. Actual payment processing is deferred — the paywall serves as a conversion measurement point and placeholder for future checkout. A "coming soon" message is shown when a user interacts with purchase options, and the interaction is tracked for analytics.
- **FR-005**: System MUST support at least 16 paid horoscope product types, each with its own product page containing value proposition, birth data form, and display-only paywall.
- **FR-006**: (Deferred) Full AI-powered horoscope reports of 30+ structured sections require payment integration. Only the free mini-horoscope (2-3 aspects) is generated in this phase via FR-003.
- **FR-007**: (Deferred) Email delivery of reports and notifications is out of scope. Email collection and storage only.
- **FR-008**: (Removed — merged into FR-004.)
- **FR-009**: System MUST provide a user dashboard showing daily horoscope summary (love/career/health percentages fetched via Astrology API SDK, cached per sign per day), recommended products, and profile management.
- **FR-010**: System MUST allow users to create additional profiles for family/friends for use in compatibility features, with a maximum of 5 additional profiles per account.
- **FR-011**: System MUST redesign the landing page with 11 content sections: hero, pain points, how it works, product catalog, book of life USPs, testimonials, statistics, account benefits, blog preview, email subscription, and SEO text.
- **FR-012**: System MUST implement dropdown navigation menus for "Horoscopes" (paid products by category) and "Free" (free tools).
- **FR-013**: System MUST provide an Ascendant Calculator tool that requires birth time and returns the rising sign with description.
- **FR-014**: System MUST provide a Daily Horoscope tool with daily forecasts by zodiac sign.
- **FR-015**: System MUST track all key user interactions through analytics events: quiz progression, product views, payment events, engagement metrics, and email subscriptions.
- **FR-016**: System MUST save quiz sessions (including anonymous visitors) so that abandoned quizzes can be resumed on return.
- **FR-017**: (Deferred) Magic link authentication and social login are deferred. Existing Supabase email/password auth continues as-is.
- **FR-018**: System MUST provide a blog with categorized articles and a reviews page with ratings filterable by product type.
- **FR-019**: System MUST provide an email subscription form on the homepage that collects and stores email addresses. Product pages and quiz include email collection as part of their own flows. Actual email sending (newsletters, discounts) is deferred.
- **FR-020**: System MUST add cross-sell CTAs to existing free tools (natal chart, moon calendar, compatibility) promoting relevant paid products.
- **FR-021**: All user-facing text MUST be in Ukrainian.
- **FR-022**: System MUST store product catalog data (name, category, price, description) so the paywall and product pages can display accurate information even before payment integration.

### Key Entities

- **Product**: A purchasable horoscope type (slug, name in Ukrainian, category, description, price, active status, sort order). 16 product types across 6 categories.
- **Order**: (Deferred — no payment integration yet.) Will track purchases once payments are enabled.
- **Quiz Session**: An anonymous or authenticated session capturing quiz progress (step reached, birth data, name, gender, email, zodiac sign, completion status). Used for funnel analytics and resume capability.
- **Review**: A customer testimonial for a product (rating 1-5, text in Ukrainian, publication status). Moderated before display.
- **Email Subscription**: A newsletter signup from non-authenticated visitors (email, name, source page, active status).
- **Profile**: Extended user profile (existing entity, extended with email subscription preference, quiz completion status, and support for multiple profiles per user for family/friends).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 40% of homepage visitors click a CTA that leads to the quiz funnel.
- **SC-002**: At least 60% of users who start the quiz complete all 6 steps.
- **SC-003**: At least 15% of users who view the mini-horoscope proceed to view the paywall.
- **SC-004**: (Deferred — requires payment integration. Will be measurable once payments are enabled.)
- **SC-005**: (Deferred — email sending out of scope for this phase.)
- **SC-006**: The redesigned landing page loads within 3 seconds on a standard mobile connection.
- **SC-007**: At least 5% of email subscription form visitors submit their email.
- **SC-008**: Dashboard users return to the site at least 3 times per week on average (measured over 30 days after first login).
- **SC-009**: Free tools (Ascendant Calculator, Daily Horoscope) each attract at least 500 organic visits per month within 3 months of launch.
- **SC-010**: At least 70% of users who start a quiz on mobile complete it (mobile-friendly experience parity).

## Assumptions

- The existing Astrology API SDK and astronomy-engine provide sufficient data for all 16 product types' reports.
- OpenAI GPT-4o is used ONLY for natal chart AI report interpretations (mini-horoscope teaser, future full reports). All other astrological data — including daily horoscope forecasts — comes from the Astrology API SDK. Daily horoscope uses the SDK's daily forecast endpoint (love/career/health categories), NOT OpenAI generation.
- OpenAI cost is approximately $0.10-0.50 per natal chart report.
- The existing Supabase auth and database infrastructure can be extended with new tables without migration issues.
- The Nominatim geocoding API (already in use) will continue to be available for birthplace lookup.
- The existing PostHog integration can be extended with new custom events without additional cost concerns.
- PDF generation can be handled server-side with acceptable performance.
- The Ukrainian market is the primary target; international expansion is a future consideration.
- Product pricing will be determined by the business team and configured in the products database table.
- Blog is a custom on-site blog at /blog for SEO traffic (not Medium). Initial launch uses 3-6 placeholder articles. Real content will be provided or AI-generated separately from development.
- Testimonials/reviews and SEO text will be provided or generated separately from the development effort.
- The quiz uses a light/soft theme (contrasting with the main dark cosmic theme) following the Astromix pattern for higher conversion.

## Scope Boundaries

### In Scope
- Quiz funnel (6 steps + mini-horoscope + paywall)
- Landing page redesign (11 sections)
- 16 paid product pages (template-based)
- Paywall page (display only, no actual payment processing)
- AI report generation (for mini-horoscope teaser)
- User dashboard with daily summary, recommended products, and profile management
- Navigation redesign (dropdowns)
- Two new free tools (Ascendant, Daily Horoscope)
- Cross-sell CTAs on existing free tools
- Blog and reviews pages
- Email subscription
- Comprehensive analytics events
- Multi-profile support (up to 5 per user)

### Out of Scope
- Mobile native app
- Multi-language support (Ukrainian only for now)
- A/B testing implementation (future optimization phase)
- Email sending/delivery (Resend integration, newsletters, PDF delivery, transactional emails)
- Email marketing automation sequences (Resend campaigns)
- Push notifications
- Retargeting abandoned quiz sessions via email
- Affiliate/partner program
- Admin panel for product/order management
- Payment processing (LiqPay, Stripe, or other — deferred)
- Full paid report generation and PDF delivery (requires payments first)
- Order management and purchase history (requires payments first)
- Refund processing workflow
- SEO content creation (articles, blog posts)
