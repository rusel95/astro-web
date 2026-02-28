# API Route Contracts

**Feature Branch**: `002-auth-ux-fixes`
**Date**: 2026-02-28

All API routes are `POST` (require body with subject/options). All return `{ data, error? }`.

## Chart & Analysis Routes

### POST /api/chart (existing — enhanced)
**Purpose**: Natal chart + SVG + natal report
**Body**:
```json
{
  "subject": { "name": "...", "birth_data": { ... } },
  "options": { "house_system": "P", "zodiac_type": "Tropic", "active_points": [...] }
}
```
**Response**: `{ chart_data, svg_content, natal_report?, enhanced_positions?, enhanced_aspects? }`
**SDK calls**: `charts.getNatalChart`, `svg.getNatalChartSvg`, `analysis.getNatalReport`, `data.getEnhancedPositions`, `data.getEnhancedAspects`

### POST /api/transit
**Purpose**: Transit chart + report for a given date
**Body**: `{ subject, transit_date: "YYYY-MM-DD", options }`
**Response**: `{ transit_chart, svg_content, transit_report, natal_transit_report, natal_transits[] }`
**SDK calls**: `charts.getTransitChart`, `svg.getTransitChartSvg`, `analysis.getTransitReport`, `analysis.getNatalTransitReport`, `charts.getNatalTransits`

### POST /api/solar-return
**Purpose**: Solar return chart + report for a given year
**Body**: `{ subject, year: 2026, options }`
**Response**: `{ solar_return_chart, svg_content, solar_return_report, solar_return_transits }`

### POST /api/lunar-return
**Purpose**: Lunar return chart + report for a given date
**Body**: `{ subject, date: "YYYY-MM-DD", options }`
**Response**: `{ lunar_return_chart, svg_content, lunar_return_report, lunar_return_transits }`

### POST /api/progressions
**Purpose**: Secondary progressions + report
**Body**: `{ subject, target_date: "YYYY-MM-DD", options }`
**Response**: `{ progressions_data, progression_report }`

### POST /api/directions
**Purpose**: Solar arc directions + report
**Body**: `{ subject, target_date: "YYYY-MM-DD", options }`
**Response**: `{ directions_data, direction_report }`

## Relationship Routes

### POST /api/compatibility (existing — enhanced)
**Purpose**: Full synastry + compatibility suite
**Body**: `{ subject1, subject2, options }`
**Response**: `{ synastry_chart, synastry_svg, synastry_report, compatibility_analysis, compatibility_score }`

### POST /api/composite
**Purpose**: Composite chart + report
**Body**: `{ subject1, subject2, options }`
**Response**: `{ composite_chart, composite_svg, composite_report }`

### POST /api/relationship-insights
**Purpose**: Love languages, red flags, timing
**Body**: `{ subject1, subject2, options }`
**Response**: `{ love_languages, red_flags, timing, relationship_analysis, relationship_score }`

## Horoscope Routes

### GET /api/horoscope/daily/[sign] (existing — enhanced)
**Purpose**: Sign daily horoscope + text
**Response**: `{ horoscope, horoscope_text }`

### GET /api/horoscope/weekly/[sign]
**Response**: `{ horoscope }`

### GET /api/horoscope/monthly/[sign]
**Response**: `{ horoscope }`

### GET /api/horoscope/yearly/[sign]
**Response**: `{ horoscope }`

### POST /api/horoscope/personal
**Body**: `{ subject, options }`
**Response**: `{ personal_horoscope }`

### POST /api/horoscope/chinese
**Body**: `{ subject }`
**Response**: `{ chinese_horoscope }`

## Analysis Routes

### POST /api/analysis/[type]
**Purpose**: Generic analysis endpoint for career, health, karmic, psychological, spiritual, vocational, lunar, predictive
**Params**: `type` = career|health|karmic|psychological|spiritual|vocational|lunar|predictive
**Body**: `{ subject, options }`
**Response**: `{ analysis_data }`

### POST /api/analysis/relocation
**Body**: `{ subject, location: { city, country_code, latitude, longitude }, options }`
**Response**: `{ relocation_analysis }`

## Tarot Routes

### GET /api/tarot/daily
**Response**: `{ daily_card }`

### POST /api/tarot/draw
**Body**: `{ count: 1|3|10|12|22, spread_type: 'single'|'three_card'|'celtic_cross'|'houses'|'tree_of_life' }`
**Response**: `{ cards[], report }`

### POST /api/tarot/birth-cards
**Body**: `{ subject }`
**Response**: `{ birth_cards }`

## Chinese Astrology Routes

### POST /api/chinese/bazi
**Body**: `{ subject }`
**Response**: `{ bazi, luck_pillars, ming_gua, zodiac_animal }`

### POST /api/chinese/compatibility
**Body**: `{ subject1, subject2 }`
**Response**: `{ compatibility }`

### POST /api/chinese/forecast
**Body**: `{ subject, year }`
**Response**: `{ yearly_forecast, year_elements }`

## Traditional Astrology Routes

### POST /api/traditional/analysis
**Body**: `{ subject, options }`
**Response**: `{ analysis, dignities, lots, sect, bounds }`

### POST /api/traditional/profections
**Body**: `{ subject, age, options }`
**Response**: `{ profections, annual_profection, timeline }`

### POST /api/traditional/firdaria
**Body**: `{ subject, options }`
**Response**: `{ firdaria }`

### POST /api/traditional/zodiacal-releasing
**Body**: `{ subject, lot, options }`
**Response**: `{ zodiacal_releasing }`

## Astrocartography Routes

### POST /api/astrocartography/map
**Body**: `{ subject, options }`
**Response**: `{ lines, map_data, crossings, paran_lines }`

### POST /api/astrocartography/location
**Body**: `{ subject, location, options }`
**Response**: `{ location_analysis, location_report, relocation_chart, local_space }`

### POST /api/astrocartography/power-zones
**Body**: `{ subject, options }`
**Response**: `{ power_zones }`

### POST /api/astrocartography/compare
**Body**: `{ subject, location1, location2, options }`
**Response**: `{ comparison }`

## Other Routes

### POST /api/numerology
**Body**: `{ subject }`
**Response**: `{ core_numbers, comprehensive_report }`

### POST /api/numerology/compatibility
**Body**: `{ subject1, subject2 }`
**Response**: `{ compatibility }`

### POST /api/fixed-stars
**Body**: `{ subject, options }`
**Response**: `{ conjunctions, report }`

### GET /api/eclipses
**Query**: `?start_date=...&end_date=...`
**Response**: `{ upcoming, history? }`

### POST /api/eclipses/natal-impact
**Body**: `{ subject, options }`
**Response**: `{ natal_impact }`

### GET /api/lunar/calendar
**Query**: `?month=2&year=2026`
**Response**: `{ calendar, mansions, events, void_of_course, gardening }`

### POST /api/insights/[category]
**Params**: `category` = wellness|financial|business
**Body**: `{ subject, options }`
**Response**: `{ insights_data }` (structure varies by category)

### GET /api/glossary
**Query**: `?search=...&category=...`
**Response**: `{ terms[], categories[] }`
