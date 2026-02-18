# АстроКарта — Natal Chart Web App

Astrology natal chart calculator with AI-powered interpretations. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.

## Features

- 🪐 **Natal chart calculation** — planets, houses, aspects, angles
- 🤖 **AI interpretations** — 5 life areas (personality, career, relationships, health, finances)
- ✨ **Step-by-step onboarding** — full-screen animated birth data input (mobile-first)
- 🌍 **City autocomplete** — Nominatim/OpenStreetMap geocoding
- 🎨 **Dark mystical theme** — cosmic backgrounds, animated floating orbs, zodiac ring
- 🇺🇦 **Ukrainian language** — full UI in Ukrainian
- 📱 **Mobile-first** — responsive design, touch-optimized
- 🔐 **Supabase auth scaffold** — ready for email/password auth
- 🚀 **Framer Motion animations** — smooth transitions, spring physics

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

App runs at http://localhost:3000 with **demo/mock data** when API keys aren't configured.

## Environment Variables

| Variable | Description |
|---|---|
| `ASTROLOGY_API_BASE_URL` | Astrology API base URL |
| `ASTROLOGY_API_KEY` | API key for chart calculations |
| `OPENAI_API_KEY` | OpenAI key for AI reports |
| `OPENAI_MODEL` | Model name (default: gpt-4o) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## Pages & Flow

1. **`/`** — Landing page with animated zodiac ring, features, how-it-works
2. **`/chart/new`** — Step-by-step onboarding (4 full-screen steps):
   - Step 1: Name input
   - Step 2: Birth date + zodiac sign badge
   - Step 3: Birth time
   - Step 4: City search with autocomplete
3. **`/chart/[id]`** — Chart results with tabs:
   - Overview (quick stats + area selection)
   - Planets table
   - Houses table
   - Aspects list
   - AI Report (5 areas, cached per session)
4. **`/auth/login`** — Auth scaffold (requires Supabase config)

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/chart/          # Astrology API proxy
│   ├── api/report/         # OpenAI proxy
│   ├── api/geocode/        # Nominatim proxy
│   ├── chart/new/          # Onboarding flow
│   └── chart/[id]/         # Chart results
├── components/
│   ├── chart/              # PlanetsTable, HousesTable, AspectsTable
│   ├── report/             # AreaCards, ReportView
│   └── ui/                 # CosmicBackground, GlassCard, ProgressDots
├── lib/                    # API mapper, constants, mock data, store
└── types/                  # TypeScript types (mirrors iOS models)
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set environment variables in Vercel dashboard.

## iOS App Parity

Models and API contracts match the iOS app (`AstroSvitla`):
- `AstrologyAPIModels.swift` → `types/astrology.ts`
- `AstrologyAPIDTOMapper.swift` → `lib/api-mapper.ts`
- `AIPromptBuilder.swift` → `api/report/route.ts`
- `ReportArea.swift` → `lib/constants.ts`
- `OnboardingViewModel.swift` → `chart/new/page.tsx`
