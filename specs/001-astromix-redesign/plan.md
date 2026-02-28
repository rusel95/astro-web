# Implementation Plan: Zorya Platform Redesign (Astromix-Level Product)

**Branch**: `001-astromix-redesign` | **Date**: 2026-02-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-astromix-redesign/spec.md`

## Summary

Transform astro-web from a free natal chart tool into a full astrology product platform inspired by Astromix.net. Core deliverables: 6-step quiz sales funnel with mini-horoscope teaser, redesigned 11-section landing page, 16 product pages (template-based), user dashboard, new navigation with dropdown menus, two new free tools (Ascendant Calculator, Daily Horoscope), blog & reviews pages, email subscription, and comprehensive PostHog analytics. Payment integration is deferred — the paywall is display-only for conversion tracking.

**Technical approach**: Extend the existing Next.js 14 App Router architecture. Use route groups to separate quiz layout (light theme, no nav) from main layout (dark cosmic theme). Quiz state via `useReducer` + `sessionStorage`. New Supabase tables for products, quiz sessions, reviews, email subscriptions. Existing PostHog and analytics patterns extended with new events.

## Technical Context

**Language/Version**: TypeScript (strict) on Node.js, Next.js 14 (App Router)
**Primary Dependencies**: Next.js 14, Tailwind CSS, Framer Motion, Supabase (auth + DB), `@astro-api/astroapi-typescript` SDK, `astronomy-engine`, OpenAI (GPT-4o), PostHog. (Resend deferred — no email sending in this phase)
**Storage**: Supabase (PostgreSQL) with RLS. sessionStorage/localStorage for anonymous quiz state
**Testing**: Playwright (11 existing test suites, visual regression, accessibility)
**Target Platform**: Web (responsive, mobile-first). Vercel deployment
**Project Type**: Full-stack web application
**Performance Goals**: Landing page loads <3s on 3G. Quiz transitions <200ms. Mini-horoscope generation <15s
**Constraints**: Ukrainian-only UI. No payment processing yet. Existing Astrology API rate limits (cache aggressively). OpenAI costs ~$0.10-0.50/report
**Scale/Scope**: ~80 existing source files, ~50+ new/modified files. 15+ new pages/routes. 4 new Supabase tables

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Validated against Constitution v1.0.0 (`.specify/memory/constitution.md`, ratified 2026-02-26):

- **I. Ukrainian-First**: All user-facing text in Ukrainian. Code/comments in English. PASS
- **II. Simplicity & Minimal Impact**: Each change minimal. Product pages template-based, not individually coded. Reuse existing components. PASS
- **III. Design System Consistency**: Cosmic dark theme for main site. Light theme for quiz (scoped via CSS). Brand colors preserved. `<ZodiacIcon>` for all zodiac rendering. PASS
- **IV. Date Handling Safety**: Server dates as "YYYY-MM-DD" strings. Client parses with `new Date(y, m-1, d)`. PASS
- **V. Deploy Often, Verify Always**: Each phase ships independently to production. `npm run build` before every push. PASS
- **VI. Analytics-Driven Development**: All features emit PostHog events. Quiz tracks per-step completion/abandonment. PASS
- **VII. Existing Infrastructure First**: Astrology API SDK for calculations. OpenAI for AI interpretations. Supabase for auth/DB. Nominatim for geocoding. PASS

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-astromix-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output — technical decisions
├── data-model.md        # Phase 1 output — Supabase schema
├── quickstart.md        # Phase 1 output — dev setup guide
├── contracts/           # Phase 1 output — API contracts
│   ├── quiz-api.md
│   ├── products-api.md
│   └── email-api.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (main)/                    # Route group — pages WITH header/footer
│   │   ├── layout.tsx             # Nav, footer, mobile nav
│   │   ├── page.tsx               # Redesigned landing (11 sections)
│   │   ├── dashboard/             # User dashboard (existing, enhanced)
│   │   ├── moon/                  # Moon calendar (existing)
│   │   ├── zodiac/[sign]/         # Zodiac pages (existing)
│   │   ├── compatibility/         # Compatibility (existing, + cross-sell)
│   │   ├── horoscopes/            # Existing horoscope pages (enhanced)
│   │   ├── horoscope/[slug]/      # NEW: 16 product pages (template)
│   │   ├── ascendant/             # NEW: Ascendant calculator
│   │   ├── daily/                 # NEW: Daily horoscope
│   │   ├── blog/                  # NEW: Blog listing + articles
│   │   ├── reviews/               # NEW: Reviews page
│   │   └── 2026/                  # NEW: Yearly horoscope overview
│   │
│   ├── (quiz)/                    # Route group — pages WITHOUT header/footer
│   │   ├── layout.tsx             # Minimal layout (logo + progress only)
│   │   └── quiz/
│   │       └── page.tsx           # 6-step quiz funnel
│   │
│   ├── api/
│   │   ├── quiz/
│   │   │   ├── session/route.ts   # NEW: Create/update quiz session
│   │   │   └── complete/route.ts  # NEW: Complete quiz → mini-horoscope
│   │   ├── products/route.ts      # NEW: List products
│   │   ├── email/
│   │   │   └── subscribe/route.ts # NEW: Email subscription
│   │   ├── reviews/
│   │   │   └── route.ts           # NEW: Get/post reviews
│   │   ├── daily-horoscope/route.ts # NEW: Daily horoscope
│   │   └── ... (existing endpoints preserved)
│   │
│   └── layout.tsx                 # Root layout (fonts, providers only)
│
├── components/
│   ├── landing/                   # NEW: Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── PainPointsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── ProductCatalog.tsx
│   │   ├── BookOfLifeSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── AccountBenefitsSection.tsx
│   │   ├── BlogPreviewSection.tsx
│   │   ├── EmailSubscriptionSection.tsx
│   │   └── SeoTextSection.tsx
│   │
│   ├── quiz/                      # NEW: Quiz funnel components
│   │   ├── QuizStep1Birthday.tsx
│   │   ├── QuizStep2Sign.tsx
│   │   ├── QuizStep3Birthplace.tsx
│   │   ├── QuizStep4BirthTime.tsx
│   │   ├── QuizStep5NameGender.tsx
│   │   ├── QuizStep6Email.tsx
│   │   ├── QuizProgressBar.tsx
│   │   └── MiniHoroscope.tsx
│   │
│   ├── product/                   # NEW: Product page components
│   │   ├── ProductPageTemplate.tsx
│   │   ├── ProductValueProps.tsx
│   │   ├── ProductForm.tsx
│   │   └── PaywallSection.tsx
│   │
│   ├── catalog/                   # NEW: Product catalog
│   │   ├── CategoryFilter.tsx
│   │   └── ProductCard.tsx
│   │
│   ├── dashboard/                 # NEW: Dashboard enhancements
│   │   ├── DailySummary.tsx
│   │   ├── ProfileManager.tsx
│   │   └── RecommendedProducts.tsx
│   │
│   ├── blog/                      # NEW: Blog components
│   │   ├── BlogCard.tsx
│   │   └── BlogCategoryFilter.tsx
│   │
│   ├── navigation/                # NEW: Enhanced navigation
│   │   ├── DesktopNav.tsx
│   │   ├── DropdownMenu.tsx
│   │   └── NewFooter.tsx
│   │
│   └── ... (existing components preserved)
│
├── lib/
│   ├── quiz/                      # NEW: Quiz logic
│   │   ├── types.ts               # QuizState, QuizAction
│   │   ├── reducer.ts             # quizReducer
│   │   ├── validation.ts          # Per-step validators
│   │   └── tracking.ts            # Quiz analytics helpers
│   │
│   ├── products/                  # NEW: Product catalog
│   │   ├── types.ts               # Product, ProductCategory
│   │   └── data.ts                # Static product definitions (16 products)
│   │
│   └── ... (existing lib preserved)
│
├── types/
│   └── ... (existing types preserved — new types in lib/products/types.ts and lib/quiz/types.ts)
│
tests/
└── ... (existing Playwright tests + new quiz/landing tests)
```

**Structure Decision**: Extend the existing Next.js monolith structure. Introduce route groups `(main)` and `(quiz)` to separate layouts. New feature modules organized by domain (quiz, product, landing, catalog, dashboard, blog, navigation) following existing patterns. No new projects or packages needed — everything stays within `src/`.
