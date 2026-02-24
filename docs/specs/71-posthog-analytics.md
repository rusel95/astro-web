# Spec: PostHog Analytics + A/B Testing (#71)

## Огляд
Впровадження PostHog для product analytics, A/B тестування та retention cohorts з privacy-first Umami як альтернатива.

## Бізнес-цілі
- **Data-driven optimization:** Розуміти user journey та bottlenecks
- **Conversion rate +20-30%:** Через A/B testing та funnel optimization
- **Retention insights:** Weekly/monthly cohorts для поліпшення утримання
- **Privacy compliance:** GDPR-friendly analytics з Umami fallback

## PostHog vs Umami Strategy

### PostHog (Primary)
**Pros:**
- Product analytics: events, funnels, cohorts, session recordings
- Built-in A/B testing framework
- Feature flags для gradual rollouts
- User identification та traits
- Self-hosted або cloud

**Cons:**
- More invasive (session recordings)
- GDPR requires explicit consent
- Heavier script (~50KB)

**Use case:** Authenticated users, detailed product analytics

### Umami (Fallback)
**Pros:**
- Privacy-first (no cookies, no PII)
- GDPR-compliant by default
- Lightweight (~2KB script)
- Simple pageview tracking
- Self-hosted easy deploy

**Cons:**
- No funnels, cohorts, A/B testing
- Basic events only
- Limited user identification

**Use case:** Anonymous visitors, EU users who decline PostHog

## Events Tracking

### Critical Events (PostHog)

**Acquisition:**
```javascript
posthog.capture('landing_visited', {
  source: 'organic|social|referral',
  utm_source: string,
  utm_medium: string,
  utm_campaign: string,
})
```

**Activation:**
```javascript
posthog.capture('chart_created', {
  chart_id: string,
  birth_date: string (YYYY-MM-DD, no PII),
  location: string (city/country only),
  time_to_create: number (seconds),
  source: 'new|returning',
})

posthog.capture('chart_viewed', {
  chart_id: string,
  sections_viewed: string[], // ['personality', 'career', etc]
  time_on_page: number,
})
```

**Engagement:**
```javascript
posthog.capture('synastry_viewed', {
  chart1_id: string,
  chart2_id: string,
  compatibility_score: number,
})

posthog.capture('moon_calendar_viewed', {
  date_range: string,
  void_periods_visible: boolean,
})

posthog.capture('zodiac_article_read', {
  sign: string,
  time_on_page: number,
  scroll_depth: number, // 0-100%
})
```

**Monetization:**
```javascript
posthog.capture('premium_viewed', {
  source: 'paywall|pricing_page|upgrade_cta',
})

posthog.capture('premium_converted', {
  plan: 'monthly|yearly',
  price: number,
  currency: string,
  payment_method: 'stripe|liqpay',
})

posthog.capture('subscription_cancelled', {
  reason: string,
  tenure_days: number,
})
```

**Retention:**
```javascript
posthog.capture('daily_return', {
  days_since_signup: number,
  returning_user: boolean,
})
```

### Pageviews (Umami - всі користувачі)
```javascript
// Автоматично: pageview tracking
// Custom events (opt-in):
umami.track('chart_created')
umami.track('premium_converted')
```

## Funnels

### Main Conversion Funnel
```
Landing Page
  ↓ (60-70% expected)
Chart Creation Started
  ↓ (70-80%)
Chart Created
  ↓ (30-40%)
Chart Viewed (full)
  ↓ (2-5%)
Premium Converted
```

**Tracking:**
```javascript
// PostHog automatic funnel from events:
// 1. landing_visited
// 2. chart_created
// 3. chart_viewed
// 4. premium_converted
```

### Activation Funnel
```
Signup
  ↓
First Chart Created (within 24h)
  ↓
Second Visit (within 7 days)
  ↓
Feature Discovery (synastry/moon/etc)
```

**Success Metrics:**
- Signup → First Chart: >70%
- First Chart → Second Visit: >40%
- Second Visit → Feature Discovery: >30%

## A/B Testing

### Test #1: Landing Page Headline
**Variants:**
- A (Control): "Дізнайся свій астрологічний шлях"
- B: "Твій персональний натальний чарт за 2 хвилини"
- C: "Астрологія, яка тебе розуміє"

**Metric:** Chart creation rate
**Sample size:** 1000+ per variant
**Duration:** 2 weeks

**Implementation:**
```typescript
import { usePostHog } from 'posthog-js/react'

export function LandingHero() {
  const posthog = usePostHog()
  const variant = posthog.getFeatureFlag('landing_headline')
  
  const headlines = {
    control: "Дізнайся свій астрологічний шлях",
    variant_b: "Твій персональний натальний чарт за 2 хвилини",
    variant_c: "Астрологія, яка тебе розуміє",
  }
  
  return <h1>{headlines[variant] || headlines.control}</h1>
}
```

### Test #2: Pricing Page Layout
**Variants:**
- A (Control): Monthly/Yearly toggle prominent
- B: Yearly plan highlighted (save 40%)
- C: Feature comparison table first

**Metric:** Premium conversion rate
**Sample size:** 500+ per variant

### Test #3: CTA Button Text
**Variants:**
- A: "Створити чарт"
- B: "Почати зараз"
- C: "Дізнатись більше"

**Metric:** Click-through rate → chart creation

## Cohort Analysis

### Retention Cohorts (Weekly)
```
Week 0: 100% (signup week)
Week 1: Target >40%
Week 2: Target >25%
Week 4: Target >15%
Week 8: Target >10%
```

**Segments:**
- Organic vs Paid acquisition
- Created chart vs Not created
- Premium vs Free
- Feature usage (synastry, moon, etc)

### Power Users Cohort
**Definition:**
- Visits >3 times/week
- Created >2 charts
- Viewed synastry or moon calendar

**Action:** Target for premium upsell

### At-Risk Cohort
**Definition:**
- Signed up >30 days ago
- Last visit >14 days ago
- Never converted to premium

**Action:** Win-back email campaign

## Technical Implementation

### PostHog Setup

**Installation:**
```bash
npm install posthog-js
```

**Configuration:**
```typescript
// lib/posthog.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false, // Manual events only for control
  })
}

export default posthog
```

**Provider:**
```tsx
// app/providers.tsx
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { useUser } from '@/hooks/useUser'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        signup_date: user.created_at,
      })
    }
  }, [user])
  
  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

### Umami Setup

**Installation:**
```bash
# Self-hosted або Umami Cloud
# Add script tag to layout
```

**Configuration:**
```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src="https://analytics.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Custom Events:**
```typescript
// lib/umami.ts
export function trackUmami(eventName: string, eventData?: object) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData)
  }
}
```

### Consent Management

**Cookie Consent Banner:**
```tsx
// components/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'
import posthog from 'posthog-js'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  
  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent')
    if (!consent) {
      setShowBanner(true)
    } else if (consent === 'accepted') {
      // PostHog already initialized
    } else {
      posthog.opt_out_capturing() // GDPR opt-out
    }
  }, [])
  
  const accept = () => {
    localStorage.setItem('analytics_consent', 'accepted')
    setShowBanner(false)
    posthog.opt_in_capturing()
  }
  
  const decline = () => {
    localStorage.setItem('analytics_consent', 'declined')
    setShowBanner(false)
    posthog.opt_out_capturing()
  }
  
  if (!showBanner) return null
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          Ми використовуємо cookies для аналітики та покращення досвіду. 
          <a href="/privacy" className="underline ml-1">Політика приватності</a>
        </p>
        <div className="flex gap-2">
          <button onClick={decline} className="btn-secondary">
            Відхилити
          </button>
          <button onClick={accept} className="btn-primary">
            Прийняти
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Privacy Strategy

**PostHog (with consent):**
- Full events tracking
- Session recordings (opt-in)
- Feature flags and A/B tests
- User identification

**Umami (default for declined):**
- Anonymous pageviews
- Basic events (no PII)
- No cookies
- GDPR-compliant by default

**Both:**
- No personal chart data in events (only IDs)
- No exact birth times/locations
- Anonymize IPs
- Data retention: 90 days for free users, 1 year for premium

## Environment Variables

```env
# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Umami (self-hosted or cloud)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_UMAMI_HOST=https://analytics.yourdomain.com
```

## Dashboard Setup

### PostHog Insights

**1. Conversion Funnel**
- Landing → Chart Created → Premium

**2. Retention Curves**
- Weekly cohorts
- By acquisition source

**3. User Paths**
- Most common paths to conversion
- Drop-off points

**4. Feature Usage**
- Synastry vs Moon vs Zodiac
- Correlation with premium conversion

### Umami Dashboard

**1. Pageviews**
- Top pages
- Referrers
- Countries/cities

**2. Events**
- Chart creations
- Premium conversions

## Timeline (1-2 дні)

### День 1: PostHog Integration
- ✅ Install PostHog
- ✅ Provider setup з user identification
- ✅ Core events: chart_created, chart_viewed, premium_converted
- ✅ Cookie consent banner
- ✅ Testing в dev

### День 2: Umami + A/B Tests
- ✅ Umami script integration
- ✅ Fallback logic для declined consent
- ✅ First A/B test: landing headline
- ✅ Funnel setup в PostHog dashboard
- ✅ Documentation для team

## Success Metrics

**Launch (перший тиждень):**
- Events tracking works: >95% capture rate
- Cookie consent: ~60-70% acceptance
- First A/B test running

**Month 1:**
- Identified 3+ bottlenecks в funnel
- 1-2 A/B tests з results
- Cohort retention data для 4 weeks

**Month 3:**
- Conversion rate improved by >15%
- 5+ successful A/B tests
- Data-driven roadmap decisions

## Privacy & Compliance

### GDPR Requirements
- ✅ Explicit consent for PostHog
- ✅ Opt-out mechanism
- ✅ Data deletion on request
- ✅ Privacy policy updated
- ✅ Cookie policy

### Data Minimization
- No personal chart details in events
- Only chart IDs (anonymized)
- No exact locations (city-level only)
- No birth times stored in analytics

### Retention Policy
- Free users: 90 days
- Premium users: 1 year
- Aggregated data: indefinite

## Cost Analysis

### PostHog Cloud
- Free tier: 1M events/month
- Scale tier: $0.00031/event after 1M
- Estimated: $0-50/month initially

### Umami
- Self-hosted: $0 (infrastructure only)
- Cloud: $9/month (hobby tier)
- Recommended: Self-hosted на Vercel/Railway

**Total:** $0-50/month

## Alternative: Plausible Analytics

If PostHog too complex:
- Privacy-first like Umami
- Better UX than Umami
- Funnels + goals (no A/B testing)
- $9/month (10k pageviews)

**Recommendation:** Start with PostHog + Umami combo

---
**Created:** 2026-02-24
**Status:** Pending Approval
**Estimate:** 1-2 days
**Priority:** Medium (Data Foundation)
**Impact:** Conversion rate +20-30%, data-driven decisions
