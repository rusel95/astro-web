# АстроКарта (astro-web) — Agent Guide

## Project Overview

Ukrainian astrology web app. Natal chart calculator with AI interpretations, moon calendar, compatibility, zodiac pages. Full-stack Next.js 14 (App Router) + Supabase + Vercel.

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

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point to logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs
- **Ukrainian UI**: All user-facing text in Ukrainian. Code/comments in English
- **Consistency**: Icons, styles, patterns must be consistent across the entire app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS (dark cosmic theme) |
| Auth & DB | Supabase (email auth, RLS, profiles/charts tables) |
| Astrology API | `@astro-api/astroapi-typescript` SDK (68+ endpoints) |
| Moon calculations | `astronomy-engine` (local, no API limits) |
| AI Reports | OpenAI (gpt-4o) via `/api/report` |
| Animations | Framer Motion |
| Analytics | PostHog |
| Email | Resend |
| Testing | Playwright (11 test suites) |
| Deploy | Vercel (auto-deploy from main) |

---

## Architecture

```
src/
├── app/                    # Pages & API routes (App Router)
│   ├── api/                # 14 API endpoints
│   │   ├── chart/          # Natal chart calculation
│   │   ├── compatibility/  # Synastry via SDK
│   │   ├── explore/        # New API features demo
│   │   ├── moon/           # Moon phases (astronomy-engine)
│   │   ├── report/         # AI interpretation (OpenAI)
│   │   ├── og/[sign]/      # OG image generation
│   │   └── share-image/    # Social share images
│   ├── chart/new/          # 4-step onboarding flow
│   ├── chart/[id]/         # Chart results (tabs: planets/houses/aspects/report)
│   ├── moon/               # Moon calendar page (ISR, 15min)
│   ├── zodiac/[sign]/      # 12 zodiac sign pages (SSG)
│   └── compatibility/      # Compatibility matcher
│
├── components/
│   ├── chart/              # NatalChartWheel (SVG), PlanetsTable, HousesTable, AspectsTable
│   ├── moon/               # MoonCalendar, MoonPhaseCard, VoidPeriodAlert
│   ├── icons/              # ZodiacIcon (SVG), PlanetIcon (SVG)
│   ├── ui/                 # Design system (GlassCard, CosmicBackground, etc.)
│   └── report/             # AreaCards, ReportView
│
├── lib/
│   ├── astrology-client.ts # SDK singleton + helpers
│   ├── api-mapper.ts       # API ↔ domain type mapping
│   ├── moon/               # ephemeris.ts, void-calculator.ts
│   ├── supabase/           # client.ts, server.ts, service.ts
│   └── constants.ts        # ZODIAC_NAMES_UK, planet names, dignities
│
└── types/
    ├── astrology.ts        # NatalChart, Planet, House, Aspect types
    └── moon.ts             # MoonPhase, VoidPeriod, CurrentMoon
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

# Email
RESEND_API_KEY=
```

---

## Testing

```bash
npm run test              # Public + mobile Playwright tests
npm run test:auth         # Authenticated tests
npx playwright test --ui  # Interactive test UI
```

- 11 test suites: accessibility, visual regression, chart flow, zodiac, horoscopes, etc.
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
- Delete irrelevant issues. Close duplicates with reference to the kept issue

---

## Common Tasks

### Add a new page
1. Create `src/app/<route>/page.tsx`
2. Add metadata export for SEO
3. Use existing UI components (GlassCard, etc.)
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

## Active Technologies
- TypeScript (strict) on Node.js, Next.js 14 (App Router) + Next.js 14, Tailwind CSS, Framer Motion, Supabase (auth + DB), `@astro-api/astroapi-typescript` SDK, `astronomy-engine`, OpenAI (GPT-4o), PostHog, Resend (001-astromix-redesign)
- Supabase (PostgreSQL) with RLS. sessionStorage/localStorage for anonymous quiz state (001-astromix-redesign)

## Recent Changes
- 001-astromix-redesign: Added TypeScript (strict) on Node.js, Next.js 14 (App Router) + Next.js 14, Tailwind CSS, Framer Motion, Supabase (auth + DB), `@astro-api/astroapi-typescript` SDK, `astronomy-engine`, OpenAI (GPT-4o), PostHog, Resend
