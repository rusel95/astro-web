# Full Coverage Checklist: Full Astrology API Platform & UX Fixes

**Purpose**: Validate requirements quality across all domains — auth/UX, API contracts, data model, pages, navigation, and components
**Created**: 2026-02-28
**Feature**: [spec artifacts](../research.md), [data-model](../data-model.md), [pages](../contracts/pages.md), [api-routes](../contracts/api-routes.md)
**Depth**: Standard | **Audience**: Author (self-review)

## Requirement Completeness

- [ ] CHK001 — Are auth-aware behavior requirements defined for ALL 46 new pages (auth + complete chart / auth + incomplete chart / unauth)? [Completeness, Data Model §Auth State Flow]
- [ ] CHK002 — Are error response requirements specified for API failures (SDK unavailable, rate limited, invalid subject data, unknown feature_type)? [Completeness, Gap]
- [ ] CHK003 — Are loading state requirements defined for pages that aggregate multiple SDK calls (e.g., transit page calls 5 SDK methods)? [Completeness, Gap]
- [ ] CHK004 — Are empty/zero-state requirements defined for pages when API returns no data (e.g., no upcoming eclipses, no fixed star conjunctions)? [Completeness, Gap]
- [ ] CHK005 — Are account deletion requirements (FR-051) specified beyond just the page route — what data is deleted, confirmation flow, cascade behavior? [Completeness, Pages §settings]
- [ ] CHK006 — Are requirements for the `BirthDataForm` validation rules specified (required fields, format constraints, geocoding failure handling)? [Completeness, Pages §Shared Components]

## Requirement Clarity

- [ ] CHK007 — Is "auto-fetch feature data" quantified — which SDK methods are called, in what order, and what constitutes "complete chart" data? [Clarity, Data Model §Auth State Flow]
- [ ] CHK008 — Is the `AnalysisSection` "recursively renders structured API response data" behavior specified with rules for nested depth limits, array truncation, or unknown key handling? [Clarity, Pages §AnalysisSection]
- [ ] CHK009 — Is "compact inline form with available fields pre-filled" defined with specific layout/UX for incomplete chart scenarios? [Clarity, Research §Decision 4]
- [ ] CHK010 — Are cache TTL values justified or are they arbitrary? Is the distinction between "permanent" and "30d" for natal-related analyses clearly reasoned? [Clarity, Data Model §Cache TTL]

## Requirement Consistency

- [ ] CHK011 — Are the analysis types listed in the API route (`POST /api/analysis/[type]`) consistent with the page routes in pages.md? The route lists 8 types but `relocation` has a separate route — is this intentional? [Consistency, API Routes §Analysis vs Pages §Analysis]
- [ ] CHK012 — Does the feature_results `chart_id NOT NULL` constraint conflict with sign-based horoscopes (GET routes) and tarot draws that don't use a chart? [Consistency, Data Model §feature_results vs API Routes §Horoscope/Tarot]
- [ ] CHK013 — Are the navigation dropdown categories in pages.md consistent with actual page routes? "Традиційна" section appears under "Карти" dropdown but has its own route group. [Consistency, Pages §Navigation vs §Route Structure]
- [ ] CHK014 — Are response shape conventions consistent — some routes return `{ data }`, others return named fields (`{ synastry_chart, synastry_svg, ... }`)? Is there a standard contract? [Consistency, API Routes]

## Acceptance Criteria Quality

- [ ] CHK015 — Are measurable success criteria defined for "navigation overhaul" — what specifically constitutes fixed navigation vs current broken state? [Measurability, Research §Navigation Issues]
- [ ] CHK016 — Can "auth users clicking any product/feature link get redirected to dashboard" be objectively verified as fixed? What is the expected behavior per page type? [Measurability, Research §Broken/Incomplete]
- [ ] CHK017 — Are performance requirements defined for pages aggregating 3-5 SDK calls (acceptable response time, concurrent vs sequential calls)? [Measurability, Gap]

## Scenario Coverage

- [ ] CHK018 — Are requirements defined for when a cached `feature_results` entry has expired but the API is unreachable — serve stale data or show error? [Coverage, Edge Case, Data Model §feature_results]
- [ ] CHK019 — Are requirements specified for the tarot synastry spread (`/tarot/synastry`) — does it require a partner chart, and how does it interact with `partner_charts` table? [Coverage, Gap, Pages §Tarot]
- [ ] CHK020 — Are mobile navigation requirements specified beyond "bottom tab bar + hamburger"? How do 7+ top-level categories map to 5 bottom tabs? [Coverage, Pages §Mobile Navigation]
- [ ] CHK021 — Are requirements defined for concurrent API calls within a single page — parallel vs sequential, partial failure handling, timeout behavior? [Coverage, Gap]

## Edge Case Coverage

- [ ] CHK022 — Is the `feature_params_hash` collision handling defined — what happens when two different `feature_params` produce the same MD5 hash? [Edge Case, Data Model §Indexes]
- [ ] CHK023 — Are requirements defined for partner_charts with missing `birth_time` — is it truly `NOT NULL` or should it support unknown birth time scenarios? [Edge Case, Data Model §partner_charts]
- [ ] CHK024 — Is behavior defined when a user deletes a chart that has associated `feature_results` — does CASCADE deletion affect UX (lost cached results)? [Edge Case, Data Model §Relationships]

## Non-Functional Requirements

- [ ] CHK025 — Are API rate limit thresholds documented — how many SDK calls per minute/hour are allowed, and how does the caching strategy map to these limits? [Non-Functional, Research §Rate Limiting]
- [ ] CHK026 — Are SEO metadata requirements specified for all 46 new pages — unique titles, descriptions, OG images in Ukrainian? [Non-Functional, Gap]
- [ ] CHK027 — Are accessibility requirements defined for interactive components (BirthDataForm, ChartSelector, SvgChartViewer) — keyboard navigation, screen reader support, ARIA labels? [Non-Functional, Gap]

## Dependencies & Assumptions

- [ ] CHK028 — Is the assumption "API plan covers all 160+ endpoints" validated, or is there a risk that some SDK methods return 403/plan-not-available? [Assumption, Research §Risks]
- [ ] CHK029 — Are the Supabase migration rollback scripts mentioned in data-model.md actually included or specified in the contracts? [Dependency, Data Model §Migration Safety]
- [ ] CHK030 — Is the phased implementation order (P1→P2→P3) reflected in requirements priority — are P1 requirements more detailed than P3? [Dependency, Quickstart §Implementation Order]

## Notes

- Check items off as completed: `[x]`
- Add comments or findings inline beneath each item
- Items are numbered CHK001–CHK030 for cross-reference
- Focus on fixing requirement gaps before implementation begins
