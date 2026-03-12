# Зоря (astro-web) — Agent Guide

## Project Overview

Ukrainian astrology web app (web-only, no mobile app). Natal charts, AI interpretations, horoscopes, tarot, numerology, moon calendar, compatibility, Chinese astrology, and more. Full-stack Next.js 14 (App Router) + Supabase + Vercel.

**Brand:** Зоря (previously АстроКарта)
**Production:** https://astro-web-five.vercel.app
**Repo:** https://github.com/rusel95/astro-web

---

## Deployment — DEPLOY OFTEN

- **Auto-deploy:** Every push to `main` triggers Vercel production deploy
- **Deploy after every meaningful change** — don't batch. The user expects to see changes live quickly
- **Manual deploy:** `npx vercel --prod --yes` if auto-deploy is stuck/canceled
- **Check deploy status:** `vercel ls --limit 5` or `vercel inspect <url>`
- **Build check before push:** `npm run build` — must pass cleanly
- **Revalidation:** Moon page uses ISR (`revalidate = 900`, 15 min). Static pages rebuild on deploy

### Deploy Workflow
```
1. Make changes
2. npm run build          ← verify locally
3. git add <files>
4. git commit -m "..."
5. git push               ← triggers Vercel auto-deploy
6. Verify on production
```

### VM Limitations
- `npm run build` may OOM in Cowork VM — use `npx tsc --noEmit` as type-check fallback
- VM cannot push to GitHub (no network access) — hand off `git push` to the user
- `.git/index.lock` may block commits — user runs `rm -f .git/index.lock` on Mac if needed

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Review lessons at session start

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Ask yourself: "Would a staff engineer approve this?"
- Run `npx tsc --noEmit`, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- Skip this for simple, obvious fixes — don't over-engineer

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point to logs, errors, failing tests — then resolve them
- Zero context switching required from the user

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs
- **Ukrainian UI**: All user-facing text in Ukrainian. Code/comments in English
- **Consistency**: Icons, styles, patterns must be consistent across the entire app
- **Web-Only**: No iOS/mobile app considerations. This is purely a web product

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS (dark cosmic theme) |
| Auth & DB | Supabase (email auth, RLS, profiles/charts/feature_results/partner_charts) |
| Astrology API | `@astro-api/astroapi-typescript` SDK |
| Moon calculations | `astronomy-engine` (local, no API limits) |
| AI Reports | OpenAI (gpt-4o) via `/api/report` |
| Animations | Framer Motion |
| Analytics | PostHog |
| Error tracking | Sentry |
| Email | Resend |
| Testing | Playwright |
| Deploy | Vercel (auto-deploy from main) |

---

## Architecture

```
src/
├── app/
│   ├── (main)/                 # Main layout group
│   │   ├── analysis/           # 8 analysis types (career, health, karmic, etc.)
│   │   ├── astrocartography/   # Location-based astrology
│   │   ├── auth/login/         # Auth page
│   │   ├── chart/              # new/ (quiz flow) + [id]/ (results)
│   │   ├── chinese/            # Chinese zodiac + compatibility + forecast
│   │   ├── compatibility/      # Synastry matcher
│   │   ├── composite/          # Composite charts
│   │   ├── dashboard/          # User dashboard
│   │   ├── directions/         # Primary directions
│   │   ├── eclipses/           # Eclipse tracker
│   │   ├── fixed-stars/        # Fixed stars
│   │   ├── glossary/           # Astrology glossary
│   │   ├── horoscope/          # daily/weekly/monthly/yearly + chinese
│   │   ├── insights/           # business/financial/wellness
│   │   ├── lunar-return/       # Lunar return charts
│   │   ├── moon/               # Moon calendar (ISR, 15min)
│   │   ├── numerology/         # Numerology + compatibility
│   │   ├── progressions/       # Secondary progressions
│   │   ├── relationship/       # Relationship analysis
│   │   ├── solar-return/       # Solar return charts
│   │   ├── tarot/              # 9 spread types
│   │   ├── traditional/        # Profections etc.
│   │   ├── transit/            # Transit tracker
│   │   └── zodiac/[sign]/      # 12 zodiac sign pages (SSG)
│   │
│   ├── (quiz)/quiz/            # Onboarding quiz flow
│   │
│   └── api/                    # 34+ API endpoints
│       ├── chart/              # Natal chart calculation
│       ├── compatibility/      # Synastry via SDK
│       ├── horoscope/          # Horoscope generation
│       ├── moon/               # Moon phases (astronomy-engine)
│       ├── report/             # AI interpretation (OpenAI)
│       ├── tarot/              # Tarot readings
│       ├── numerology/         # Numerology calculations
│       ├── chinese/            # Chinese astrology
│       ├── analysis/           # Deep analysis features
│       ├── transit/            # Transit calculations
│       ├── solar-return/       # Solar return
│       ├── lunar-return/       # Lunar return
│       ├── composite/          # Composite charts
│       ├── directions/         # Primary directions
│       ├── progressions/       # Secondary progressions
│       ├── eclipses/           # Eclipse data
│       ├── fixed-stars/        # Fixed stars
│       ├── astrocartography/   # Location astrology
│       ├── insights/           # Business/financial/wellness
│       ├── og/[sign]/          # OG image generation (edge)
│       ├── share-image/        # Social share images (edge)
│       ├── geocode/            # Nominatim proxy
│       ├── quiz/               # Quiz logic
│       └── account/            # User account management
│
├── components/                 # 72+ components
│   ├── feature/                # Feature page components (18)
│   ├── landing/                # Landing page sections (10)
│   ├── quiz/                   # Quiz flow components (8)
│   ├── ui/                     # Design system (GlassCard, CosmicBackground, etc.)
│   ├── chart/                  # NatalChartWheel (SVG), PlanetsTable, etc.
│   ├── dashboard/              # Dashboard widgets
│   ├── moon/                   # MoonCalendar, MoonPhaseCard, VoidPeriodAlert
│   ├── icons/                  # ZodiacIcon (SVG), PlanetIcon (SVG)
│   ├── navigation/             # Header, footer, nav
│   ├── product/                # Product cards, catalog
│   ├── horoscope/              # Horoscope display
│   └── report/                 # AreaCards, ReportView
│
├── lib/
│   ├── astrology-client.ts     # SDK singleton + helpers
│   ├── api-mapper.ts           # API ↔ domain type mapping
│   ├── ai-report.ts            # AI report prompt builder
│   ├── moon/                   # ephemeris.ts, void-calculator.ts
│   ├── quiz/                   # reducer.ts, tracking.ts (zorya_quiz_state)
│   ├── supabase/               # client.ts, server.ts, service.ts
│   └── constants.ts            # ZODIAC_NAMES_UK, planet names, dignities
│
└── types/
    ├── astrology.ts            # NatalChart, Planet, House, Aspect types
    └── moon.ts                 # MoonPhase, VoidPeriod, CurrentMoon
```

---

## Key Conventions

### Icons
- **NEVER use unicode zodiac symbols** (♈♉♊...) — always use `<ZodiacIcon>` component
- For SVG contexts (NatalChartWheel, OG images): use `ZODIAC_SVG_PATHS` from `ZodiacIcon.tsx`
- For React/HTML contexts: `<ZodiacIcon sign="Aries" size={14} className="text-zorya-violet" />`

### Date Handling
- Server generates dates as `"YYYY-MM-DD"` strings (UTC-based on Vercel)
- Client must parse with `new Date(y, m-1, d)` (local), NOT `new Date("YYYY-MM-DD")` (UTC)
- Format client dates with `getFullYear()/getMonth()/getDate()`, NOT `toISOString()`

### Styling
- Dark theme by default (cosmic palette: `cosmic-900` to `cosmic-500`)
- Accent colors: `zorya-gold`, `zorya-violet`, `zorya-blue`
- Fonts: Inter (sans), Cormorant Garamond (display)
- Glass effects: `GlassCard` component with backdrop-blur

### API Patterns
- SDK client in `src/lib/astrology-client.ts` — singleton, retry 2x
- Moon data computed locally via `astronomy-engine` (free, no API limits)
- AI reports via OpenAI proxy at `/api/report`
- Geocoding via Nominatim (free, no key needed)
- Edge runtime for OG/share-image routes only

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Astrology API
ASTROLOGY_API_BASE_URL=
ASTROLOGY_API_KEY=

# OpenAI (for AI reports)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Sentry
SENTRY_ORG=
SENTRY_PROJECT=

# Email
RESEND_API_KEY=
```

---

## Testing

```bash
npx tsc --noEmit          # Type check (use this in VM, build may OOM)
npm run test              # Public + mobile Playwright tests
npm run test:auth         # Authenticated tests
npx playwright test --ui  # Interactive test UI
```

- Screenshot comparison: 20% threshold, 100px max diff
- Base URL: production Vercel app

---

## GitHub Issues — Task Pipeline

Track all tasks in GitHub Issues: https://github.com/rusel95/astro-web/issues

### Issue Lifecycle (labels)
1. **`needs-spec`** — Issue exists but has no implementation spec yet. Agent adds spec as comment
2. **`ready`** — User reviewed the spec, approved it. **Agent can start working on these**
3. *(closed)* — Done and deployed

### Workflow
- At session start: check for issues labeled `ready` → implement them
- User tells "роби що в Ready" → find all `ready` issues and work through them
- Every issue must have a spec/plan comment inside for user validation BEFORE work begins
- Never start work on `needs-spec` issues — wait for user to move them to `ready`
- After completing an issue: close it with a comment describing what was done

---

## Common Tasks

### Add a new page
1. Create `src/app/(main)/<route>/page.tsx`
2. Add metadata export for SEO
3. Use existing UI components (GlassCard, FeaturePageLayout, etc.)
4. All text in Ukrainian

### Add a new API endpoint
1. Create `src/app/api/<name>/route.ts`
2. Use SDK client from `astrology-client.ts` for astrology data
3. Map response through `api-mapper.ts` if needed
4. Return typed JSON response

### Modify zodiac icons
1. Edit SVG paths in `src/components/icons/ZodiacIcon.tsx`
2. Component handles both React rendering and raw path export
3. For OG/share images: use `ZODIAC_SVG_PATHS` directly in Satori JSX
