# Quickstart: Full Astrology API Platform & UX Fixes

**Feature Branch**: `002-auth-ux-fixes`
**Date**: 2026-02-28

## Prerequisites

- Node.js 18+
- npm
- Supabase project with auth configured
- Astrology API key (all endpoints plan)
- OpenAI API key (for AI reports)

## Environment Setup

```bash
# Clone and switch to feature branch
git clone https://github.com/rusel95/astro-web.git
cd astro-web
git checkout 002-auth-ux-fixes

# Install dependencies
npm install

# Copy env (already configured in Vercel)
cp .env.example .env.local
# Fill in: SUPABASE_URL, SUPABASE_ANON_KEY, ASTROLOGY_API_BASE_URL, ASTROLOGY_API_KEY, OPENAI_API_KEY
```

## Database Migrations

```sql
-- Run in Supabase SQL Editor

-- 1. Feature results cache table
CREATE TABLE feature_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chart_id UUID REFERENCES charts(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL,
  feature_params JSONB DEFAULT '{}',
  result_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_feature_results_lookup
  ON feature_results(user_id, feature_type, chart_id);

ALTER TABLE feature_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own results"
  ON feature_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own results"
  ON feature_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own results"
  ON feature_results FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Partner charts table
CREATE TABLE partner_charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  city TEXT NOT NULL,
  country_code TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE partner_charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own partners"
  ON partner_charts FOR ALL
  USING (auth.uid() = user_id);
```

## Development

```bash
# Start dev server
npm run dev

# Build check (must pass before push)
npm run build

# Run tests
npm run test

# Run specific test suite
npx playwright test tests/chart-flow.spec.ts
```

## Implementation Order

### Phase 1 — P1 Features (Auth + Core)
1. Auth flow fixes (FR-017 to FR-023)
2. Navigation overhaul (FR-024)
3. Enhanced natal chart page (FR-001 to FR-004)
4. Horoscope pages (daily/weekly/monthly/yearly)
5. Transit page
6. Compatibility enhancement

### Phase 2 — P2 Features (API Pages)
7. Solar/Lunar return pages
8. Progressions + Directions
9. Analysis pages (career, health, karmic, etc.)
10. Tarot section (7 pages)
11. Chinese astrology section
12. Traditional astrology section
13. Astrocartography pages
14. Numerology + Fixed Stars + Eclipses
15. Enhanced lunar calendar

### Phase 3 — P3 Features (Insights)
16. Wellness, Financial, Business insights
17. Stats section fix
18. Glossary page

## Key Patterns

### Creating a new feature page

```typescript
// src/app/(main)/analysis/career/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Аналіз кар\'єри — Зоря',
  description: 'Астрологічний аналіз кар\'єрного шляху',
};

export default function CareerAnalysisPage() {
  return <CareerAnalysisClient />;
}

// src/app/(main)/analysis/career/CareerAnalysisClient.tsx
'use client';

import { useAuthChart } from '@/hooks/useAuthChart';
// ... standard pattern for all feature pages
```

### Creating a new API route

```typescript
// src/app/api/analysis/[type]/route.ts
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: Request, { params }: { params: { type: string } }) {
  const { subject, options } = await req.json();
  const client = getAstrologyClient();
  const sdkSubject = toSdkSubject(subject);
  const sdkOptions = toSdkChartOptions();

  // Call appropriate analysis method based on type
  // Return full API response — hide nothing
}
```

## Verification

After each phase:
1. `npm run build` — must pass
2. `npm run test` — all tests pass
3. Verify on production after deploy
4. Check PostHog for analytics events
