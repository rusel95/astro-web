<!--
  Sync Impact Report
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: All new (template had placeholders only)
  Added sections:
    - 7 Core Principles (I–VII)
    - Design System & Conventions
    - Development Workflow & Quality Gates
    - Governance
  Removed sections: None (template placeholders replaced)
  Templates requiring updates:
    - .specify/templates/plan-template.md — no changes needed
      (generic "Constitution Check" references constitution dynamically)
    - .specify/templates/spec-template.md — no changes needed
      (spec structure is principle-agnostic)
    - .specify/templates/tasks-template.md — no changes needed
      (task structure is principle-agnostic)
  Follow-up TODOs: None
-->

# Zorya (astro-web) Constitution

## Core Principles

### I. Ukrainian-First (NON-NEGOTIABLE)

All user-facing text MUST be in Ukrainian. No exceptions.
Code, comments, variable names, and commit messages MUST be in English.
This applies to every page, component, error message, placeholder,
and SEO metadata across the entire application.

### II. Simplicity & Minimal Impact

Every change MUST be as simple as possible and touch only what is necessary.
No temporary fixes — find and address root causes.
Do not add features, abstractions, or refactors beyond what was requested.
Three similar lines of code are better than a premature abstraction.
If a change feels hacky, pause and find the elegant solution.

### III. Design System Consistency

The Zorya cosmic dark theme (cosmic-900 through cosmic-500, zorya-gold,
zorya-violet, zorya-blue) MUST be used consistently across all pages.
Exception: quiz funnel pages use a scoped light theme for conversion.

Zodiac signs MUST always be rendered via the `<ZodiacIcon>` component
or `ZODIAC_SVG_PATHS` in SVG contexts. Unicode zodiac symbols
are strictly prohibited.

Reuse existing UI components (GlassCard, CosmicBackground, ProgressDots,
CitySearch, DatePicker, TimePicker) before creating new ones.
Fonts: Inter (sans) for body, Cormorant Garamond (display) for headings.

### IV. Date Handling Safety

Server-generated dates MUST use `"YYYY-MM-DD"` string format.
Client-side parsing MUST use `new Date(year, month-1, day)` (local time),
never `new Date("YYYY-MM-DD")` which creates UTC dates.
Client-side formatting MUST use `getFullYear()/getMonth()/getDate()`,
never `toISOString()`.

### V. Deploy Often, Verify Always

Every push to `main` triggers Vercel production deploy.
Each meaningful change MUST be deployed independently — do not batch.
`npm run build` MUST pass cleanly before every push.
After deploy, verify on production (https://astro-web-five.vercel.app).
Moon page uses ISR (revalidate=900). Static pages rebuild on deploy.

### VI. Analytics-Driven Development

Every user-facing feature MUST emit PostHog analytics events.
Quiz funnels MUST track per-step completion and abandonment.
Product interactions MUST track views, clicks, and paywall engagement.
Use the existing `track()` function from `src/lib/analytics/index.ts`
and define event constants in `src/lib/analytics/events.ts`.

### VII. Existing Infrastructure First

Use the Astrology API SDK (`@astro-api/astroapi-typescript`) for all
astrological calculations — do not re-implement.
Use `astronomy-engine` for moon data — free, no API limits.
Use Supabase for auth and database — extend with new tables, not services.
Use OpenAI (GPT-4o) for AI interpretations via `/api/report` patterns.
Use Nominatim for geocoding — free, no API key needed.
Cache aggressively to respect Astrology API rate limits.

## Design System & Conventions

- **Color palette**: cosmic-900 (#0a0a1a) to cosmic-500 (#16213e);
  accents zorya-gold (#d4af37), zorya-violet (#9966E6),
  zorya-blue (#4D80E6)
- **Glass effects**: `GlassCard` component with backdrop-blur
- **Button gradient**:
  `linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)`
- **Glow shadows**: zorya-purple based (see tailwind.config.ts)
- **Mobile-first**: Build for 375px, scale up. Bottom nav on mobile,
  top nav on desktop
- **Animations**: Framer Motion for transitions and scroll effects
- **SEO**: Every page MUST export metadata (title, description)
  in Ukrainian

## Development Workflow & Quality Gates

1. **Plan before building**: Enter plan mode for any task with 3+ steps
   or architectural decisions. Write specs upfront.
2. **Verify before done**: Never mark a task complete without proving
   it works. Run `npm run build`. Check the deployed result.
3. **Capture lessons**: After any correction, update `tasks/lessons.md`
   with the pattern to prevent recurrence.
4. **Issue pipeline**: GitHub Issues flow through `needs-spec` → `ready`
   → closed. Never start work on `needs-spec` issues.
5. **Spec-driven**: Every feature MUST have a spec/plan reviewed by
   the user before implementation begins.
6. **Autonomous bug fixing**: When given a bug report, fix it.
   Point to logs and errors, then resolve. Zero hand-holding required.

## Governance

This constitution supersedes conflicting guidance in other documents.
Amendments require:
1. Documentation of what changed and why
2. Version bump following semantic versioning (MAJOR for principle
   removals/redefinitions, MINOR for additions, PATCH for clarifications)
3. Consistency check across dependent templates and specs

All implementation plans MUST include a Constitution Check section
verifying compliance with these principles before work begins.

Complexity beyond these principles MUST be explicitly justified in the
plan's Complexity Tracking table with rationale for why a simpler
alternative was rejected.

Runtime development guidance lives in `CLAUDE.md` at repo root.

**Version**: 1.0.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26
