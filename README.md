# Зоря — Ukrainian Astrology Web App

Full-featured astrology platform in Ukrainian. Natal charts, AI interpretations, horoscopes, tarot, numerology, moon calendar, compatibility, Chinese astrology, and more.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase, OpenAI.

**Production:** https://astro-web-five.vercel.app

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

App runs at http://localhost:3000.

## Environment Variables

| Variable | Description |
|---|---|
| `ASTROLOGY_API_BASE_URL` | Astrology API base URL |
| `ASTROLOGY_API_KEY` | API key for chart calculations |
| `OPENAI_API_KEY` | OpenAI key for AI reports |
| `OPENAI_MODEL` | Model name (default: gpt-4o) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics key |
| `RESEND_API_KEY` | Resend email key |

## Key Features

- Natal chart calculation with SVG wheel visualization
- AI-powered interpretations (5 life areas via OpenAI)
- Daily/weekly/monthly/yearly horoscopes
- 9 tarot spread types
- Numerology calculations
- Chinese astrology with compatibility
- Moon calendar with void-of-course periods
- Synastry & composite chart compatibility
- Solar/lunar returns, transits, progressions, directions
- Astrocartography
- Eclipse tracker
- Fixed stars analysis
- Quiz-based onboarding flow

## Deploy

Auto-deploys to Vercel on push to `main`.

```bash
npx vercel --prod --yes  # manual deploy
```
