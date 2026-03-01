# Page Contracts

**Feature Branch**: `002-auth-ux-fixes`
**Date**: 2026-02-28

## Route Structure

```
src/app/
├── (main)/
│   ├── page.tsx                          # Homepage (auth-aware)
│   ├── dashboard/page.tsx                # User dashboard (existing)
│   │
│   ├── chart/
│   │   ├── new/page.tsx                  # Chart creation (existing)
│   │   └── [id]/page.tsx                 # Chart results (existing, enhanced)
│   │
│   ├── transit/page.tsx                  # Transit chart + report
│   ├── solar-return/page.tsx             # Solar return chart + report
│   ├── lunar-return/page.tsx             # Lunar return chart + report
│   ├── progressions/page.tsx             # Secondary progressions
│   ├── directions/page.tsx               # Solar arc directions
│   │
│   ├── horoscope/
│   │   ├── daily/page.tsx                # Daily horoscope (sign-based + personal)
│   │   ├── weekly/page.tsx               # Weekly horoscope
│   │   ├── monthly/page.tsx              # Monthly horoscope
│   │   ├── yearly/page.tsx               # Yearly horoscope
│   │   └── chinese/page.tsx              # Chinese horoscope
│   │
│   ├── compatibility/page.tsx            # Synastry + compatibility (existing, enhanced)
│   ├── composite/page.tsx                # Composite chart + report
│   ├── relationship/page.tsx             # Love languages, red flags, timing
│   │
│   ├── analysis/
│   │   ├── career/page.tsx               # Career analysis
│   │   ├── health/page.tsx               # Health analysis
│   │   ├── karmic/page.tsx               # Karmic analysis
│   │   ├── psychological/page.tsx        # Psychological profile
│   │   ├── spiritual/page.tsx            # Spiritual path
│   │   ├── vocational/page.tsx           # Vocational aptitude
│   │   ├── predictive/page.tsx           # Predictive analysis
│   │   └── relocation/page.tsx           # Relocation analysis
│   │
│   ├── tarot/
│   │   ├── page.tsx                      # Tarot hub (daily card + spread links)
│   │   ├── single/page.tsx               # Single card reading
│   │   ├── three-card/page.tsx           # Past/present/future
│   │   ├── celtic-cross/page.tsx         # Celtic Cross spread
│   │   ├── houses/page.tsx               # 12-house spread
│   │   ├── tree-of-life/page.tsx         # Tree of Life spread
│   │   ├── birth-cards/page.tsx          # Birth cards calculation
│   │   ├── synastry/page.tsx             # Synastry tarot reading
│   │   └── transit/page.tsx              # Transit tarot reading
│   │
│   ├── chinese/
│   │   ├── page.tsx                      # Chinese astrology hub (BaZi + pillars)
│   │   ├── compatibility/page.tsx        # Chinese compatibility
│   │   └── forecast/page.tsx             # Yearly forecast + elements
│   │
│   ├── traditional/
│   │   ├── page.tsx                      # Traditional analysis hub
│   │   ├── profections/page.tsx          # Annual profections
│   │   ├── firdaria/page.tsx             # Firdaria periods
│   │   └── zodiacal-releasing/page.tsx   # Zodiacal releasing
│   │
│   ├── astrocartography/
│   │   ├── page.tsx                      # Map + planetary lines
│   │   └── location/page.tsx             # Location analysis + comparison
│   │
│   ├── numerology/
│   │   ├── page.tsx                      # Core numbers + report
│   │   └── compatibility/page.tsx        # Numerology compatibility
│   │
│   ├── fixed-stars/page.tsx              # Fixed star conjunctions + report
│   ├── eclipses/page.tsx                 # Upcoming eclipses + natal impact
│   │
│   ├── insights/
│   │   ├── wellness/page.tsx             # Wellness insights
│   │   ├── financial/page.tsx            # Financial insights
│   │   └── business/page.tsx             # Business insights
│   │
│   ├── moon/page.tsx                     # Moon calendar (existing, enhanced with lunar API)
│   ├── glossary/page.tsx                 # Astrology glossary/dictionary
│   ├── settings/page.tsx                 # Account settings & deletion (FR-051)
│   │
│   ├── zodiac/[sign]/page.tsx            # Zodiac pages (existing)
│   ├── privacy/page.tsx                  # Privacy policy (existing)
│   ├── terms/page.tsx                    # Terms (existing)
│   └── auth/login/page.tsx               # Login (existing)
│
└── (quiz)/
    └── quiz/page.tsx                     # Quiz funnel (existing)
```

## Page Count Summary

| Category | New Pages | Enhanced Existing |
|----------|-----------|-------------------|
| Charts (transit, solar/lunar return, progressions, directions) | 4 | 1 (chart/[id]) |
| Horoscopes (daily, weekly, monthly, yearly, chinese) | 4 | 1 (daily) |
| Relationships (composite, relationship insights) | 2 | 1 (compatibility) |
| Analysis (8 types) | 8 | 0 |
| Tarot (hub + 9 spreads incl. synastry + transit) | 10 | 0 |
| Chinese (hub + compatibility + forecast) | 3 | 0 |
| Traditional (hub + profections + firdaria + ZR) | 4 | 0 |
| Astrocartography (map + location) | 2 | 0 |
| Numerology (hub + compatibility) | 2 | 0 |
| Fixed Stars, Eclipses | 2 | 0 |
| Insights (wellness, financial, business) | 3 | 0 |
| Glossary | 1 | 0 |
| Settings (account deletion) | 1 | 0 |
| Auth/UX fixes | 0 | 3 (homepage, moon, dashboard) |
| **Total** | **46** | **6** |

## Navigation Structure

### Desktop: Top Nav with Dropdowns

```
Logo | Гороскопи ▼ | Карти ▼ | Таро ▼ | Аналіз ▼ | Ще ▼ | [User Menu]

Гороскопи:             Карти:                Таро:
├── Щоденний            ├── Натальна карта     ├── Карта дня
├── Тижневий            ├── Транзити           ├── Одна карта
├── Місячний            ├── Сонячне повернення ├── 3 карти
├── Річний              ├── Місячне повернення ├── Кельтський хрест
├── Особистий           ├── Прогресії          ├── Будинки
├── Китайський          ├── Дирекції           └── Карти народження
└── Місячний календар   ├── Сумісність
                        ├── Композит           Ще:
Аналіз:                 └── Астрокартографія   ├── Нумерологія
├── Кар'єра                                    ├── Нерухомі зірки
├── Здоров'я            Традиційна:            ├── Затемнення
├── Кармічний           ├── Аналіз             ├── Китайська астрологія
├── Психологічний       ├── Профекції          ├── Велнес
├── Духовний            ├── Фірдарія           ├── Фінанси
├── Вокаційний          └── Зодіакальний       ├── Бізнес
├── Предиктивний            рилізинг           └── Глосарій
└── Релокація
```

### Mobile: Bottom Tab Bar + Hamburger

```
Bottom tabs: Головна | Карти | Гороскопи | Таро | Ще
"Ще" opens full-screen menu with all categories
```

## Shared Component Contracts

### BirthDataForm (compact, inline)
- Props: `onSubmit(chartInput)`, `initialData?`, `compact?`
- Shows: name, gender, date, time, city
- If `initialData` provided: pre-fills all fields
- Supports "Використати збережену карту" dropdown for auth users

### ChartSelector
- Props: `onSelect(chart)`, `label?`
- Fetches user's charts from `/api/charts/my`
- Dropdown with chart names + birth dates

### SvgChartViewer
- Props: `svgContent: string`, `title?`
- Renders API SVG with dark background
- Responsive sizing

### AnalysisSection
- Props: `title`, `data: Record<string, unknown>`, `loading?`
- Recursively renders structured API response data
- Handles nested objects, arrays, strings, numbers
- Ukrainian labels for common keys
