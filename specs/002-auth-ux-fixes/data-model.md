# Data Model: Full Astrology API Platform & UX Fixes

**Feature Branch**: `002-auth-ux-fixes`
**Date**: 2026-02-28

## Existing Entities (No Changes)

### Profile
- `id` (UUID, FK → auth.users)
- `email`, `full_name`, `avatar_url`
- `created_at`, `updated_at`

### Chart (charts table)
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users, nullable for anon)
- `name`, `birth_date`, `birth_time`, `city`, `country_code`
- `latitude`, `longitude`, `gender` ('male'|'female'|null)
- `chart_data` (JSONB — full API response)
- `svg_content` (text — API SVG)
- `created_at`

### Quiz Session (quiz_sessions table)
- `id`, `user_id`, `session_data` (JSONB), `completed_at`, `created_at`

### Email Subscription (email_subscriptions table)
- `id`, `email`, `subscription_type`, `created_at`

## New Entities

### Feature Result (feature_results table)

Caches API results for authenticated users to avoid repeated API calls and enable instant page loads on return visits.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → auth.users |
| `chart_id` | UUID | FK → charts (which chart was used) |
| `feature_type` | text | Feature identifier (e.g., 'natal_report', 'transit', 'career_analysis') |
| `feature_params` | JSONB | Additional params beyond chart (e.g., transit date, target location, partner chart ID) |
| `result_data` | JSONB | Full API response cached |
| `expires_at` | timestamptz | When cache should be refreshed (varies by feature type) |
| `created_at` | timestamptz | When result was first fetched |

**Indexes**: `(user_id, feature_type, chart_id)` for quick lookups.
**RLS**: Users can only read/write their own results.
**Cache TTL by feature type**:
- Horoscopes: daily=24h, weekly=7d, monthly=30d, yearly=365d
- Transits: 1h (changes with planetary movement)
- Static analyses (natal report, career, karmic, etc.): 30d
- Tarot draws: no cache (fresh each time)

### Partner Chart (partner_charts table)

Stores second person's birth data for relationship features. Not a full chart — just the input needed to call synastry/compatibility APIs.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → auth.users (owner) |
| `name` | text | Partner's name |
| `birth_date` | date | Partner DOB |
| `birth_time` | time | Partner birth time |
| `city` | text | Birth city |
| `country_code` | text | Country code |
| `latitude` | float | Geocoded latitude |
| `longitude` | float | Geocoded longitude |
| `gender` | text | 'male'|'female'|null |
| `created_at` | timestamptz | When added |

**RLS**: Users can only manage their own partner charts.

## Entity Relationships

```
auth.users
  ├── profiles (1:1)
  ├── charts (1:many) — user's natal charts
  ├── partner_charts (1:many) — saved partner data for synastry
  ├── feature_results (1:many) — cached API results
  ├── quiz_sessions (1:many)
  └── email_subscriptions (1:many)

feature_results
  └── charts (many:1) — which chart was used for this result
```

## Feature Type Registry

Maps `feature_type` values to API methods and cache TTLs:

| feature_type | SDK Methods | Cache TTL |
|-------------|-------------|-----------|
| `natal_report` | `analysis.getNatalReport` | 30d |
| `enhanced_natal` | `enhanced.getEnhancedNatalChart` | 30d |
| `transit` | `charts.getTransitChart` + `svg.getTransitChartSvg` + `analysis.getTransitReport` | 1h |
| `natal_transits` | `charts.getNatalTransits` | 1h |
| `solar_return` | `charts.getSolarReturnChart` + `analysis.getSolarReturnReport` | 365d |
| `lunar_return` | `charts.getLunarReturnChart` + `analysis.getLunarReturnReport` | 30d |
| `progressions` | `charts.getProgressions` + `analysis.getProgressionReport` | 30d |
| `directions` | `charts.getDirections` + `analysis.getDirectionReport` | 30d |
| `synastry` | `charts.getSynastryChart` + `analysis.getSynastryReport` | 30d |
| `composite` | `charts.getCompositeChart` + `analysis.getCompositeReport` | 30d |
| `compatibility` | `analysis.getCompatibilityAnalysis` + `getCompatibilityScore` | 30d |
| `daily_horoscope` | `horoscope.getSignDailyHoroscope` + `getSignDailyHoroscopeText` | 24h |
| `weekly_horoscope` | `horoscope.getSignWeeklyHoroscope` | 7d |
| `monthly_horoscope` | `horoscope.getSignMonthlyHoroscope` | 30d |
| `yearly_horoscope` | `horoscope.getSignYearlyHoroscope` | 365d |
| `personal_horoscope` | `horoscope.getPersonalDailyHoroscope` | 24h |
| `chinese_horoscope` | `horoscope.getChineseHoroscope` | 30d |
| `career_analysis` | `analysis.getCareerAnalysis` | 30d |
| `health_analysis` | `analysis.getHealthAnalysis` | 30d |
| `karmic_analysis` | `analysis.getKarmicAnalysis` | 30d |
| `psychological` | `analysis.getPsychologicalAnalysis` | 30d |
| `spiritual` | `analysis.getSpiritualAnalysis` | 30d |
| `vocational` | `analysis.getVocationalAnalysis` | 30d |
| `predictive` | `analysis.getPredictiveAnalysis` | 7d |
| `relocation` | `analysis.getRelocationAnalysis` | 30d |
| `tarot_daily` | `tarot.getDailyCard` | 24h |
| `tarot_*` | various tarot methods | none |
| `bazi` | `chinese.calculateBaZi` | 30d |
| `numerology` | `numerology.getCoreNumbers` + `getComprehensiveReport` | 30d |
| `traditional` | `traditional.getAnalysis` | 30d |
| `astrocartography` | `astrocartography.getLines` + `generateMap` | 30d |
| `fixed_stars` | `fixedStars.getConjunctions` + `generateReport` | 30d |
| `eclipses` | `eclipses.getUpcoming` + `checkNatalImpact` | 7d |
| `wellness` | `insights.wellness.*` | 24h |
| `financial` | `insights.financial.*` | 24h |
| `business` | `insights.business.*` | 30d |

## State Management

### Server-Side
- Supabase tables for persistent data (charts, partner_charts, feature_results)
- ISR pages for sign-based horoscopes and reference data

### Client-Side
- `sessionStorage`: quiz state only (cleared on logout per FR-021)
- React state: current page form data, loading states, active tabs
- No client-side caching library needed — server handles caching via `feature_results`

### Auth State Flow
```
Page Load → Check auth (getUser())
  ├── Auth + complete chart → auto-fetch feature data → show results
  ├── Auth + incomplete chart → show pre-filled form → submit → show results
  └── Unauth → show full form → submit → show results (no caching)
```
