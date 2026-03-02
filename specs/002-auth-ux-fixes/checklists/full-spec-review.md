# Full Specification Quality Review: Full Astrology API Platform & UX Fixes

**Purpose**: Deep cross-cutting review of all 16 user stories — completeness, clarity, consistency, measurability, scenario coverage, edge cases, non-functional requirements
**Created**: 2026-02-28
**Feature**: [spec.md](../spec.md)
**Depth**: Deep
**Actor**: Reviewer (pre-implementation gate)

---

## Requirement Completeness

- [x] CHK001 - Are performance requirements defined for feature pages (load time targets, API response budgets, rendering thresholds)? — RESOLVED: FR-037 defines page load targets (static <2s, single-API <3s, multi-API <5s) and timeout thresholds (10s/15s)
- [x] CHK002 - Are caching requirements specified in the spec? — RESOLVED: FR-038 defines cache TTLs per feature type (natal permanent, horoscopes per period, analysis 7d, tarot daily 24h, transit 1h, moon ISR 15min) with invalidation on chart edit
- [x] CHK003 - Are rate limiting mitigation requirements defined? — RESOLVED: FR-039 defines client-side debounce (500ms), max 3 concurrent API calls per user, queue with loading state, rate limit header monitoring
- [x] CHK004 - Are accessibility requirements defined? — RESOLVED: FR-029a-j comprehensively cover font sizes, touch targets, WCAG AA contrast, prefers-reduced-motion, keyboard focus indicators, tab order, and focus trapping
- [x] CHK005 - Are loading state requirements specified? — RESOLVED: FR-029g defines skeleton screens, spinners with "Завантаження..." text, and progress bars. FR-057 adds progressive rendering for multi-batch pages
- [x] CHK006 - Are mobile-specific layout requirements defined? — RESOLVED: FR-029 establishes mobile (375px) as primary design target. FR-028a requires all UI tests at both mobile and desktop viewports
- [x] CHK007 - Are SEO requirements specified? — RESOLVED: FR-040 requires Next.js metadata (title, description, OG) on every page, with per-sign and per-category OG images
- [x] CHK008 - Are analytics requirements defined? — RESOLVED: FR-041 requires PostHog tracking of page views, chart creation funnel, feature engagement rates, and API error rates per namespace
- [x] CHK009 - Are partner chart CRUD requirements defined? — RESOLVED: FR-027b defines partner chart CRUD via `/api/partner-charts`. FR-027 defines reuse across all dual-input features. FR-051 adds individual partner chart deletion
- [x] CHK010 - Are image/asset requirements specified for tarot cards? — RESOLVED: FR-031 specifies API `imageUrl` field as source, text-only fallback (card name, suit, arcana, meaning) when unavailable
- [x] CHK011 - Are map rendering requirements specified for astrocartography? — RESOLVED: FR-032 specifies API's `generateMap()` endpoint as source, rendered as inline SVG/image. No third-party map provider needed
- [x] CHK012 - Is the feature discoverability/onboarding flow defined? — RESOLVED: FR-043 defines dashboard feature cards for first-time users and nav category descriptions on hover/tap
- [x] CHK013 - Are data retention and deletion requirements specified? — RESOLVED: FR-051 defines TTL-based auto-expiry, user account deletion (all data), and individual partner chart deletion
- [x] CHK014 - Are requirements defined for multiple saved charts? — RESOLVED: FR-030 defines most recently created chart as primary, with pinning option from dashboard to override recency
- [x] CHK015 - Are breadcrumb or back-navigation requirements defined? — RESOLVED: FR-044 requires breadcrumbs for pages nested 2+ levels, using Ukrainian labels matching nav names. FR-048 requires browser back preserving form inputs

## Requirement Clarity

- [x] CHK016 - Is "ALL data the API returns" quantified? — RESOLVED: SC-007 now clarifies "all data" = every user-meaningful field; internal/technical fields (request IDs, debug data) excluded. Verification method defined
- [x] CHK017 - Is "organized, readable tabs/sections" defined? — RESOLVED: FR-045 defines FeaturePageLayout pattern: header, birth data input, collapsible AnalysisSection components, SVG visualization for chart pages
- [x] CHK018 - Is "friendly Ukrainian error message" defined? — RESOLVED: FR-046 defines standard error pattern: Ukrainian headline, description, retry button, tailored messages per error type (network, timeout, validation, API error)
- [x] CHK019 - Is "compact inline birth data form" specified? — RESOLVED: FR-054 defines field sets per feature type (basic 4 fields, full +gender, date-range +target date, location +target city). FR-029b ensures 44px touch targets
- [x] CHK020 - Is "professional-grade data" defined? — RESOLVED: Assumptions section now clarifies: arc-minute accuracy, aspect orbs displayed, all 12 house cusps, retrograde status clearly marked, must match reference ephemeris
- [x] CHK021 - Are dashboard "popular categories" criteria specified? — RESOLVED: FR-033 defines curated static list of 6 categories, not algorithm-driven, updated manually per release
- [x] CHK022 - Is "honest values" for stats defined? — RESOLVED: US16 acceptance scenario now specifies live Supabase counts (charts table count, auth.users count) cached with 1-hour TTL
- [x] CHK023 - Are combined method groupings defined? — RESOLVED: Assumptions section now lists explicit groupings (Solar Return: chart+report+transits, Lunar Return: chart+report+transits, Natal: positions+enhanced+dignities) with reference to contracts/pages.md
- [x] CHK024 - Is "complete chart data" exhaustive? — RESOLVED: FR-019 specifies precise field list with conditions (name, DOB, birth time not 'unknown', birth city with lat/lng, gender)
- [x] CHK025 - Is "accuracy notice" for unknown birth time defined? — RESOLVED: FR-050 defines persistent warning banner with exact Ukrainian text, amber accent styling

## Requirement Consistency

- [x] CHK026 - Are auth-gating requirements consistent? — RESOLVED: FR-053 explicitly defines auto-submit behavior for all page types. Unauth users see inline forms; auth users with complete data see results directly. Only `/quiz` redirects
- [x] CHK027 - Is auto-submit behavior consistent across page types? — RESOLVED: FR-053 defines three variants: (a) single-input auto from primary chart, (b) dual-input auto-populate user + partner selector, (c) extra-input auto-populate birth data + additional fields
- [x] CHK028 - Are navigation categories consistent with page structure? — RESOLVED: FR-025a ensures nav only shows implemented pages. FR-061 limits to max 7 top-level categories. Full nav structure defined in contracts/pages.md
- [x] CHK029 - Is language handling consistent? — RESOLVED: FR-026a distinguishes API content (English if no Ukrainian support) vs UI chrome (always Ukrainian)
- [x] CHK030 - Are error handling requirements consistent? — RESOLVED: FR-046 defines standard error pattern for all pages. FR-047 defines multi-API partial failure handling. FR-042 defines Sentry severity levels
- [x] CHK031 - Is caching strategy consistent? — RESOLVED: FR-038 defines explicit TTLs per feature type with clear rationale (real-time vs cacheable)
- [x] CHK032 - Are BirthDataForm fields consistent per feature? — RESOLVED: FR-054 defines four field set variants (basic, full, date-range, location) with each page type's required set defined in pages contract
- [x] CHK033 - Is "no Скоро" consistent with phasing? — RESOLVED: FR-025a clarifies nav only shows implemented pages during phased rollout

## Acceptance Criteria Quality

- [x] CHK034 - Are success criteria measurable? — RESOLVED: SC-002 now defines "distinct feature" = each nav-accessible page. SC-007 now includes verification method (compare rendered page vs API response JSON, 5 samples per namespace)
- [x] CHK035 - Can SC-002 be objectively counted? — RESOLVED: SC-002 now defines "distinct feature" = each nav-accessible page that provides unique user value
- [x] CHK036 - Are US6 scenarios sufficiently differentiated? — RESOLVED: Assumptions section clarifies pattern-based criteria are intentional for similar endpoint structures; unique fields verified by comparing rendered output against API TypeScript response type during implementation
- [x] CHK037 - Are US12 scenarios detailed enough? — RESOLVED: Same pattern-based rationale as CHK036. Each endpoint's unique fields verified against TypeScript response type during implementation testing
- [x] CHK038 - Is "complete data" defined per endpoint? — RESOLVED: Verified during implementation by comparing rendered page against API TypeScript response type. Every field in response type must have a corresponding UI element (excluding internal/technical fields per SC-007)
- [x] CHK039 - Are US15 navigation criteria testable? — RESOLVED: Countable category list defined in contracts/pages.md navigation structure. FR-061 caps at max 7 top-level categories

## Scenario Coverage

- [x] CHK040 - Are multi-API partial failure scenarios addressed? — RESOLVED: FR-047 defines partial failure handling: successful sections render, failed sections show inline error with retry, full-page error only when ALL calls fail
- [x] CHK041 - Are deep-link and URL-sharing requirements defined? — RESOLVED: FR-036 defines sign-based pages as shareable (no auth), personal results as non-shareable (require auth, login prompt for unauthenticated URL access)
- [x] CHK042 - Are browser back/forward navigation requirements defined? — RESOLVED: FR-048 requires client-side navigation with browser back returning to form with preserved inputs
- [x] CHK043 - Are empty array/null field requirements specified? — RESOLVED: FR-002 distinguishes null/empty optional fields (may hide gracefully) from non-null data (must display). FR-056 handles unknown/new fields (ignored gracefully)
- [x] CHK044 - Are API schema change requirements defined? — RESOLVED: FR-056 specifies unknown fields are ignored (no error), TypeScript types updated on SDK upgrade, removed fields result in hidden sections per FR-002
- [x] CHK045 - Are multi-device requirements specified? — RESOLVED: Assumptions clarify cache is server-side (Supabase `feature_results` table), works consistently across devices. No client-side cache for feature results
- [x] CHK046 - Are interrupted submission recovery flows defined? — RESOLVED: FR-048 preserves form state in component state until successful submission. FR-029h (error recovery) shows retry option on network drops
- [x] CHK047 - Are API timeout requirements defined? — RESOLVED: FR-037 defines timeout thresholds (10s standard, 15s analysis). FR-046 defines timeout-specific message: "Запит зайняв занадто довго" with retry
- [x] CHK048 - Are print/export requirements defined? — RESOLVED: Explicitly moved to Out of Scope as "future enhancement" to keep feature focused
- [x] CHK049 - Is the user journey fully mapped? — RESOLVED: FR-053 maps the three page-type journeys (single-input, dual-input, extra-input). FR-043 addresses discoverability. FR-045 defines the page layout pattern

## Edge Case Coverage

- [x] CHK050 - Are birth date range requirements defined? — RESOLVED: FR-034 defines valid range 1900-01-01 through today. Pre-1900 shows accuracy warning. Pre-1800 rejected. Future dates blocked by date picker
- [x] CHK051 - Are ambiguous geocoding requirements defined? — RESOLVED: FR-055 requires disambiguation dropdown (city, region, country) for multiple results. Clear error message for zero results
- [x] CHK052 - Are long API response requirements defined? — RESOLVED: FR-049 requires reports with >5 sections to be initially collapsed with "Показати більше" expand. Individual sections independently collapsible
- [x] CHK053 - Are tarot re-draw requirements defined? — RESOLVED: FR-035 allows unlimited re-draws with confirmation dialog before each. Daily card exception: one per day (24h cache)
- [x] CHK054 - Are extreme latitude astrocartography requirements defined? — RESOLVED: Assumptions clarify extreme latitude calculations delegated to API's internal logic. Standard error handling (FR-047) applies for edge-case errors
- [x] CHK055 - Are Chinese calendar edge case requirements defined? — RESOLVED: Assumptions clarify leap months and solar terms delegated to API's internal logic. Standard error handling applies
- [x] CHK056 - Are namespace unavailability requirements defined? — RESOLVED: FR-047 handles namespace-level failure (full-page error with retry). Nav still shows the section (page exists, shows error state). If endpoint returns 403, nav link hidden (Assumptions section)
- [x] CHK057 - Are non-binary gender requirements defined? — RESOLVED: FR-020a adds 'prefer not to say' mapped to null. FR-060 defines one-time prompt for existing users

## Non-Functional Requirements

- [x] CHK058 - Are page load time requirements specified? — RESOLVED: FR-037 defines targets per page type (static <2s, single-API <3s, multi-API <5s)
- [x] CHK059 - Are API call budget requirements defined? — RESOLVED: FR-057 caps at 6 concurrent calls per page. FR-039 caps at 3 concurrent per user session with queue
- [x] CHK060 - Are bundle size requirements defined? — RESOLVED: FR-058 requires separate Next.js route per page (auto code splitting), shared component common bundle, max 200KB gzipped per page
- [x] CHK061 - Are image optimization requirements defined? — RESOLVED: FR-052 addresses SVG sanitization. FR-031 defines tarot image source (API). FR-032 defines astrocartography as API-generated SVG/image. Next.js Image component with lazy loading for raster images
- [x] CHK062 - Are security requirements defined? — RESOLVED: FR-052 defines input sanitization (strip HTML/script), SVG sanitization (remove script/event handlers), and API key server-side-only rule
- [x] CHK063 - Are privacy/GDPR requirements defined? — RESOLVED: FR-051 defines TTL auto-expiry, user account deletion (all data), individual partner chart deletion. Users can request full data removal from settings
- [x] CHK064 - Are i18n requirements forward-looking? — RESOLVED: Assumptions clarify Ukrainian-only for this feature, but UI strings kept in constants files (not inline) to support future i18n. Explicitly out of scope for now
- [x] CHK065 - Are error monitoring requirements defined? — RESOLVED: FR-042 defines Sentry reporting for all API errors with severity levels (timeout→warning, 4xx/5xx→error, auth→critical) and anonymized user ID

## Dependencies & Assumptions

- [x] CHK066 - Is the API subscription assumption validated? — RESOLVED: Assumptions section now includes mitigation: if endpoint returns 403/402, nav link hidden and Sentry note logged
- [x] CHK067 - Is the rate limit assumption quantified? — RESOLVED: Assumptions section now includes mitigation via FR-039 (response header monitoring, exponential backoff on limit hit)
- [x] CHK068 - Is the Ukrainian support assumption verified? — RESOLVED: Assumptions section now requires per-namespace verification during implementation with language support matrix. Handling per FR-026a
- [x] CHK069 - Is the API SLA documented? — RESOLVED: Assumptions section clarifies no formal SLA dependency; app designed for graceful degradation with error states and cached results
- [x] CHK070 - Is the Nominatim dependency addressed? — RESOLVED: Assumptions section confirms Nominatim as sole provider (sufficient for current scale). FR-055 defines disambiguation and error handling
- [x] CHK071 - Are Supabase limits considered? — RESOLVED: Assumptions section specifies TTL-based auto-cleanup for `feature_results`, scheduled function or on-read cleanup, monitoring via Supabase dashboard
- [x] CHK072 - Is the Explore page removal validated? — RESOLVED: FR-059 defines 301 redirect from `/explore` to `/dashboard` when all features implemented. Existing bookmarks continue working

## Cross-Story Consistency & Architecture

- [x] CHK073 - Is the shared component contract specified at requirements level? — RESOLVED: FR-045 defines FeaturePageLayout UX pattern. FR-054 defines BirthDataForm field variants. Component contracts detailed in contracts/pages.md
- [x] CHK074 - Are cross-story relationships mapped? — RESOLVED: Assumptions section documents that cross-story dependencies are tracked in tasks.md phase ordering (natal chart prerequisite for transits, progressions, traditional)
- [x] CHK075 - Is the priority scheme justified? — RESOLVED: Assumptions section adds justification: P1 serves >80% of users (core engagement), P2 serves engaged users (platform breadth), P3 serves niche segments
- [x] CHK076 - Are migration requirements for existing users defined? — RESOLVED: FR-060 defines one-time gender prompt for existing users with "prefer not to say" option (FR-020a), dismissible, flag stored in charts table
- [x] CHK077 - Is the NatalChartWheel fallback specified? — RESOLVED: FR-004 now allows fallback with visual indicator when API SVG unavailable
- [x] CHK078 - Are `/dashboard` requirements defined? — RESOLVED: FR-023a defines dashboard content (greeting, chart summary, quick links, daily insight, zero-chart CTA)

## PR Review Feedback (CodeRabbit PR #98)

- [x] CHK079 - Is the FR-002 contradiction resolved? — RESOLVED: FR-002 now distinguishes null/empty optional fields (may hide) from non-null data (must display in full)
- [x] CHK080 - Is the tarot cache TTL contradiction resolved? — RESOLVED: data-model.md distinguishes daily card (24h) from interactive draws (no cache). FR-038 confirms this split
- [x] CHK081 - Does the cache index include feature_params? — RESOLVED: Index now includes `feature_params_hash` with MD5 normalization rules
- [x] CHK082 - Is the gender column properly formatted? — RESOLVED: Changed to `text (enum: male, female, null)` in data-model.md
- [x] CHK083 - Are migration rollback requirements specified? — RESOLVED: Migration Safety requirement added to data-model.md (rollback scripts required, staging testing)
- [x] CHK084 - Is the one-time gender prompt specified? — RESOLVED: FR-060 defines behavior: one-time prompt on gender-required pages, dismissible, "prefer not to say" option, flag stored in `charts` table (never prompted again once set or dismissed)

## Phase Deliverability Requirements

- [x] CHK085 - Are phase completion criteria defined? — RESOLVED: Phase Gate Standard in tasks.md with 5-step gate for every phase
- [x] CHK086 - Are build verification requirements per phase specified? — RESOLVED: PG-xxA tasks (build + zero warnings) added to every phase
- [x] CHK087 - Are existing test regression requirements per phase specified? — RESOLVED: PG-xxB tasks (existing Playwright tests pass) added to every phase
- [x] CHK088 - Are new UI test requirements per phase specified? — RESOLVED: PG-xxC tasks with mobile (375px) + desktop (1280px) viewports added to every phase
- [x] CHK089 - Are warning elimination requirements per phase specified? — RESOLVED: "zero warnings" is part of every PG-xxA gate
- [x] CHK090 - Are commit requirements per phase documented? — RESOLVED: PG-xxD/E commit tasks with descriptive messages per phase
- [x] CHK091 - Is the "never merge PR" rule documented? — RESOLVED: Documented in Phase Gate Standard and Notes section

## UX & Usability Requirements (Elderly/Intuitive Focus)

- [x] CHK092 - Are font size minimums specified? — RESOLVED: FR-029a specifies 16px body, 14px labels, 12px minimum
- [x] CHK093 - Are touch target sizes defined? — RESOLVED: FR-029b specifies 44x44px minimum for mobile
- [x] CHK094 - Are color contrast requirements specified? — RESOLVED: FR-029c specifies WCAG AA (4.5:1 normal, 3:1 large text)
- [x] CHK095 - Are visual hierarchy requirements defined? — RESOLVED: FR-029i addresses dense data with contextual help, glossary links, expandable explanations
- [x] CHK096 - Are navigation simplicity requirements defined? — RESOLVED: FR-061 defines progressive disclosure (max 7 categories), mobile hamburger with expandable sections and search/filter for power users
- [x] CHK097 - Are form usability requirements defined? — RESOLVED: FR-029f specifies labels, validation, date pickers, autocomplete, field grouping
- [x] CHK098 - Are loading state requirements defined? — RESOLVED: FR-029g specifies skeleton screens, spinners, progress bars with specific trigger thresholds
- [x] CHK099 - Are error recovery requirements defined? — RESOLVED: FR-029h specifies clear Ukrainian messages, retry button, actionable next steps
- [x] CHK100 - Are result readability requirements defined? — RESOLVED: FR-029i specifies glossary links, expandable explanations, visual hierarchy
- [x] CHK101 - Are onboarding requirements defined? — RESOLVED: FR-043 defines dashboard feature overview cards for first-time users and nav descriptions on hover/tap for feature discovery
- [x] CHK102 - Are animation/motion requirements defined? — RESOLVED: FR-029d specifies prefers-reduced-motion support for Framer Motion and CSS animations

---

## Summary

| Dimension | Items | Status |
| --------- | ----- | ------ |
| Completeness | CHK001-CHK015 | 15/15 resolved — FR-030 to FR-044 cover all gaps |
| Clarity | CHK016-CHK025 | 10/10 resolved — FR-045 to FR-050 + SC clarifications |
| Consistency | CHK026-CHK033 | 8/8 resolved — FR-053, FR-054 + existing FR-025a, FR-026a |
| Acceptance Criteria | CHK034-CHK039 | 6/6 resolved — SC-002/SC-007 updated + pattern-based rationale |
| Scenario Coverage | CHK040-CHK049 | 10/10 resolved — FR-036, FR-047, FR-048 + Out of Scope for print |
| Edge Cases | CHK050-CHK057 | 8/8 resolved — FR-034, FR-035, FR-055 + API delegation |
| Non-Functional | CHK058-CHK065 | 8/8 resolved — FR-037 to FR-042, FR-052, FR-057, FR-058 |
| Dependencies | CHK066-CHK072 | 7/7 resolved — Assumptions section mitigations + FR-059 |
| Cross-Story | CHK073-CHK078 | 6/6 resolved — FR-045, FR-054 + Assumptions clarifications |
| PR Review Feedback | CHK079-CHK084 | 6/6 resolved — FR-002, FR-060 + data-model fixes |
| Phase Deliverability | CHK085-CHK091 | 7/7 resolved — Phase Gate Standard in tasks.md |
| UX & Usability | CHK092-CHK102 | 11/11 resolved — FR-029a-j, FR-043, FR-061 |

**Total items**: 102
**Resolved**: 102/102 (100%)
**Traceability**: All items reference specific FR numbers, spec sections, or documented rationale
