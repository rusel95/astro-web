# Research: Zorya Platform Redesign

**Branch**: `001-astromix-redesign` | **Date**: 2026-02-26

## Decision 1: Quiz State Management

**Decision**: `useReducer` with typed `QuizState` + `sessionStorage` persistence

**Rationale**: The existing `/chart/new` page already uses React component state for a 4-step flow with Framer Motion transitions. A `useReducer` replaces 10+ individual `useState` calls with a single typed reducer. `sessionStorage` provides crash/refresh recovery at zero cost. No Supabase needed for pre-auth state — save quiz data to Supabase only at completion (step 6).

**Alternatives considered**:
- URL params: Rejected — leaks answers into browser history, breaks AnimatePresence animations
- Supabase per-step saves: Rejected — adds latency per step, requires anonymous auth or cookie-based sessions. Over-engineered for a 6-step quiz
- React Context: Rejected — unnecessary for a single-page quiz; reducer + sessionStorage covers the same scope

## Decision 2: Quiz Layout Isolation

**Decision**: Route groups — `(main)` for pages with nav, `(quiz)` for clean quiz pages

**Rationale**: Next.js App Router route groups don't affect URLs but allow different layouts. The quiz needs a clean layout (logo + progress bar only, no header/footer/mobile nav, light theme background). This is cleaner than the current `/chart/new` approach which uses a `fixed inset-0 z-[60]` overlay hack.

**Migration plan**:
1. Create `src/app/(main)/layout.tsx` — move nav/footer/mobile nav here
2. Move all existing pages into `src/app/(main)/`
3. Create `src/app/(quiz)/layout.tsx` — minimal layout with light theme
4. Simplify root `layout.tsx` to only html/body/fonts/providers

**Alternatives considered**:
- Fixed overlay (current pattern): Rejected for new quiz — header/footer still render underneath, wastes resources. Acceptable for existing `/chart/new` temporarily
- Separate Next.js app: Rejected — over-engineered, shared components become impossible

## Decision 3: Quiz Light Theme

**Decision**: CSS scope isolation via quiz layout + CSS variables

**Rationale**: The quiz uses a light/soft theme (following Astromix's pattern for higher quiz conversion). The main cosmic dark theme uses `body::before`/`::after` pseudo-elements for starfield/nebula. The quiz layout sets its own background gradient and uses `body:has(.quiz-theme)` to hide the starfield.

**Implementation**:
```css
.quiz-theme { background: linear-gradient(135deg, #faf9ff 0%, #f0ecfc 50%, #e8e4f8 100%); }
body:has(.quiz-theme)::before, body:has(.quiz-theme)::after { display: none; }
```

**Alternatives considered**:
- Tailwind dark mode toggle: Rejected — the site is always dark, `dark:` classes are used for the default state
- Inline styles per component: Rejected — scattered, hard to maintain

## Decision 4: Anonymous Session Tracking

**Decision**: PostHog (existing) + `beforeunload` event + `navigator.sendBeacon`

**Rationale**: PostHog already auto-generates a `distinct_id` per browser. Quiz events (`quiz_step_completed`, `quiz_abandoned`) are tracked as PostHog events with a `quiz_session_id` (generated client-side, stored in `sessionStorage`). After quiz completion and user registration, `identifyUser()` merges the anonymous session with the authenticated user.

**No Supabase quiz_sessions table needed for analytics** — PostHog handles this natively. However, we still store completed quiz data in Supabase for the mini-horoscope generation.

**Alternatives considered**:
- Custom `/api/track-abandonment` endpoint: Rejected — PostHog's `sendBeacon` integration handles this already
- Supabase `quiz_sessions` table for analytics: Rejected — PostHog does this better with built-in funnels. Only store quiz results in Supabase for report generation, not for analytics

## Decision 5: Product Catalog Carousel

**Decision**: CSS `scroll-snap` with `.no-scrollbar` (already exists in globals.css)

**Rationale**: Simpler, more accessible, better mobile performance than Framer Motion drag carousel. The project already has `.no-scrollbar` utility class. Category filtering uses `AnimatePresence` with `mode="popLayout"` for smooth filter transitions.

**Alternatives considered**:
- Framer Motion drag carousel: Rejected for MVP — more complex, drag physics are unnecessary for a product grid. Can upgrade later for premium interactions
- Third-party carousel library: Rejected — adds dependency for something achievable with native CSS

## Decision 6: Product Pages Architecture

**Decision**: Single template component (`ProductPageTemplate`) + static product data file

**Rationale**: All 16 products share the same page structure (hero, value props, form, CTA, SEO text, cross-sell). A template component accepts a `product` prop. Product data (name, category, description, value propositions) is stored in a static TypeScript file — no database query needed for page rendering. Supabase `products` table stores pricing and active status for the paywall.

**Alternatives considered**:
- Individual pages per product: Rejected — massive code duplication for identical layouts
- CMS-driven (Supabase): Rejected for MVP — the product catalog is fixed (16 items), CMS overhead not justified. Static data is simpler and faster

## Decision 7: Navigation Architecture

**Decision**: New `DesktopNav` with `DropdownMenu` components + enhanced `MobileNav`

**Rationale**: The current header is a simple link bar. The new navigation needs dropdown menus organized by product category and free tool groupings. Desktop uses hover-triggered dropdowns. Mobile uses an expandable hamburger menu with nested sections. The existing `MobileNav` (bottom fixed bar) gets updated links.

## Decision 8: Daily Horoscope Data Source

**Decision**: ~~AI-generated via OpenAI~~ **REVISED** — Fetched via Astrology API SDK, cached per sign per day

**Rationale**: ~~There are 12 zodiac signs × 1 daily horoscope = 12 texts per day. Generate once per day per sign using OpenAI, cache the result.~~ The Astrology API SDK provides daily forecast data with love/career/health categories out of the box. This avoids OpenAI cost and latency for a feature that doesn't require AI narrative generation. ISR with `revalidate = 86400` (24 hours) ensures fresh content without repeated API calls.

**Revision note**: Originally planned as OpenAI-generated content. Revised to use Astrology API SDK directly — the SDK's daily forecast endpoint provides structured category data (love/career/health) which is sufficient for the daily horoscope feature without AI generation overhead.

**Alternatives considered**:
- Static pre-written horoscopes: Rejected — not personalized, feels generic
- OpenAI-generated daily text: Originally chosen, then rejected — unnecessary cost and complexity when SDK provides structured daily data directly
