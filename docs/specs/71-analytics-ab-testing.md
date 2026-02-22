# Spec: #71 PostHog Analytics + A/B Testing

## Мета
Впровадити data-driven product development через детальну аналітику поведінки користувачів, воронок конверсії, A/B тестування та cohort аналіз.

## Бізнес-обґрунтування
- **Data-driven decisions:** Замість здогадок — реальні дані про поведінку користувачів
- **Conversion optimization:** A/B тести → +20-30% conversion rate
- **Retention insights:** Cohort analysis виявляє, що утримує користувачів
- **Product roadmap:** Дані показують, які фічі важливі, а які ігноруються
- **Privacy-first:** PostHog + Umami = GDPR-compliant analytics без Google

## Solution Overview

### PostHog vs Umami Strategy

**PostHog (Primary):**
- Advanced product analytics
- Session recordings
- Feature flags для A/B тестів
- Funnel analysis
- Cohort retention
- Self-hosted або cloud

**Umami (Secondary/Privacy):**
- Privacy-first alternative
- Simple page view tracking
- Cookie-free
- GDPR compliant out of box
- Для користувачів, які блокують PostHog

**Strategy:** PostHog як основний, Umami як fallback + compliance layer

---

## 1. PostHog Integration

### Installation & Setup

```bash
npm install posthog-js
```

```tsx
// lib/analytics/posthog.ts
import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window === 'undefined') return
  
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn('PostHog key not found')
    return
  }
  
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    
    // Privacy settings
    respect_dnt: true,
    opt_out_capturing_by_default: false,
    
    // Performance
    autocapture: false, // Manual tracking only
    capture_pageview: false, // We'll do it manually
    
    // Session recordings (optional, can be privacy concern)
    disable_session_recording: !process.env.NEXT_PUBLIC_ENABLE_SESSION_RECORDING,
    
    // Advanced
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug()
      }
    }
  })
}

export { posthog }
```

```tsx
// app/layout.tsx
import { initPostHog } from '@/lib/analytics/posthog'

export default function RootLayout({ children }: Props) {
  useEffect(() => {
    initPostHog()
  }, [])
  
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### Page View Tracking

```tsx
// hooks/usePageTracking.ts
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { posthog } from '@/lib/analytics/posthog'

export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
      
      posthog.capture('$pageview', {
        $current_url: url
      })
    }
  }, [pathname, searchParams])
}
```

```tsx
// app/layout.tsx
import { usePageTracking } from '@/hooks/usePageTracking'

export default function RootLayout({ children }: Props) {
  usePageTracking()
  // ...
}
```

---

## 2. Event Tracking

### Core Events Schema

```typescript
// lib/analytics/events.ts

export const ANALYTICS_EVENTS = {
  // Landing & Acquisition
  LANDING_VIEWED: 'landing_viewed',
  CTA_CLICKED: 'cta_clicked',
  
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_VIEWED: 'onboarding_step_viewed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',
  
  // Chart
  CHART_CREATED: 'chart_created',
  CHART_VIEWED: 'chart_viewed',
  SPHERE_VIEWED: 'sphere_viewed',
  AI_CHAT_OPENED: 'ai_chat_opened',
  AI_MESSAGE_SENT: 'ai_message_sent',
  
  // Compatibility (Viral Loop)
  INVITE_CREATED: 'invite_created',
  INVITE_SHARED: 'invite_shared',
  INVITE_ACCEPTED: 'invite_accepted',
  SYNASTRY_VIEWED: 'synastry_viewed',
  SYNASTRY_SHARED: 'synastry_shared',
  
  // Monetization
  PRICING_PAGE_VIEWED: 'pricing_page_viewed',
  UPGRADE_CLICKED: 'upgrade_clicked',
  CHECKOUT_STARTED: 'checkout_started',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Retention
  DAILY_HOROSCOPE_VIEWED: 'daily_horoscope_viewed',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
  NOTIFICATION_CLICKED: 'notification_clicked',
  
  // Engagement
  BLOG_ARTICLE_VIEWED: 'blog_article_viewed',
  SEARCH_PERFORMED: 'search_performed',
  SHARE_BUTTON_CLICKED: 'share_button_clicked',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
```

### Event Tracking Helper

```typescript
// lib/analytics/track.ts
import { posthog } from './posthog'
import { trackUmami } from './umami'

interface EventProperties {
  [key: string]: string | number | boolean | null
}

export function track(
  event: AnalyticsEvent,
  properties?: EventProperties
) {
  // PostHog
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, properties)
  }
  
  // Umami (simplified)
  trackUmami(event, properties)
  
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', event, properties)
  }
}

// User identification
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, traits)
  }
}

// Reset on logout
export function resetUser() {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset()
  }
}
```

### Usage Examples

```tsx
// components/pricing/PricingCard.tsx
import { track, ANALYTICS_EVENTS } from '@/lib/analytics'

export function PricingCard({ tier }: Props) {
  const handleUpgradeClick = () => {
    track(ANALYTICS_EVENTS.UPGRADE_CLICKED, {
      tier: tier.name,
      price: tier.price,
      billing_period: tier.billing
    })
    
    router.push('/checkout')
  }
  
  return (
    <Card>
      <Button onClick={handleUpgradeClick}>
        Upgrade to {tier.name}
      </Button>
    </Card>
  )
}
```

```tsx
// app/chart/[id]/page.tsx
import { track, ANALYTICS_EVENTS } from '@/lib/analytics'

export default function ChartPage({ params }: Props) {
  useEffect(() => {
    track(ANALYTICS_EVENTS.CHART_VIEWED, {
      chart_id: params.id,
      user_id: user?.id,
      is_premium: user?.subscription === 'premium'
    })
  }, [])
  
  // ...
}
```

---

## 3. Funnel Analysis

### Key Funnels

#### **Acquisition Funnel**
```typescript
const ACQUISITION_FUNNEL = [
  'landing_viewed',
  'onboarding_started',
  'onboarding_step_completed', // step 1
  'onboarding_step_completed', // step 2
  'onboarding_step_completed', // step 3
  'chart_created'
]
```

#### **Monetization Funnel**
```typescript
const MONETIZATION_FUNNEL = [
  'chart_created',
  'sphere_viewed',
  'pricing_page_viewed',
  'upgrade_clicked',
  'checkout_started',
  'payment_success'
]
```

#### **Viral Funnel**
```typescript
const VIRAL_FUNNEL = [
  'chart_created',
  'invite_created',
  'invite_shared',
  'invite_accepted',
  'synastry_viewed'
]
```

### PostHog Funnel Setup

```typescript
// lib/analytics/funnels.ts
export function createFunnel(name: string, steps: string[]) {
  // This is configured in PostHog UI, but we track it here for reference
  return {
    name,
    steps: steps.map((step, index) => ({
      event: step,
      order: index + 1
    }))
  }
}

export const FUNNELS = {
  acquisition: createFunnel('Acquisition', ACQUISITION_FUNNEL),
  monetization: createFunnel('Monetization', MONETIZATION_FUNNEL),
  viral: createFunnel('Viral Loop', VIRAL_FUNNEL)
}
```

**PostHog UI Configuration:**
1. Go to Insights → New Insight → Funnel
2. Add events in order
3. Set time window (e.g., 7 days)
4. Add filters (e.g., by country, device)
5. Save to dashboard

---

## 4. A/B Testing (Feature Flags)

### Setup Feature Flags

```tsx
// lib/analytics/experiments.ts
import { posthog } from './posthog'

export enum Experiments {
  ONBOARDING_STEPS = 'onboarding-steps',
  PRICING_PAGE_LAYOUT = 'pricing-page-layout',
  CTA_BUTTON_TEXT = 'cta-button-text',
  CHART_VISUALIZATION = 'chart-visualization'
}

export function getExperimentVariant(
  experiment: Experiments
): string | boolean {
  if (typeof window === 'undefined') return false
  
  return posthog.getFeatureFlag(experiment) || false
}

export function isFeatureEnabled(flag: string): boolean {
  if (typeof window === 'undefined') return false
  
  return posthog.isFeatureEnabled(flag) || false
}
```

### Usage in Components

```tsx
// app/onboarding/page.tsx
import { getExperimentVariant, Experiments } from '@/lib/analytics/experiments'

export default function OnboardingPage() {
  const variant = getExperimentVariant(Experiments.ONBOARDING_STEPS)
  
  // Track variant assignment
  useEffect(() => {
    track('experiment_viewed', {
      experiment: Experiments.ONBOARDING_STEPS,
      variant
    })
  }, [variant])
  
  if (variant === '3-step') {
    return <OnboardingFlow3Step />
  }
  
  return <OnboardingFlow5Step />
}
```

### A/B Test Examples

#### Test 1: Onboarding Steps (3 vs 5)
```json
{
  "key": "onboarding-steps",
  "name": "Onboarding: 3-step vs 5-step",
  "variants": [
    { "key": "control", "name": "5-step (control)", "rollout": 50 },
    { "key": "3-step", "name": "3-step variant", "rollout": 50 }
  ],
  "success_metric": "onboarding_completed"
}
```

#### Test 2: CTA Button Text
```tsx
// components/landing/Hero.tsx
export function Hero() {
  const ctaVariant = getExperimentVariant(Experiments.CTA_BUTTON_TEXT)
  
  const buttonText = ctaVariant === 'urgency' 
    ? 'Створити чарт зараз →' 
    : 'Почати безкоштовно'
  
  return (
    <Button onClick={handleCTA}>
      {buttonText}
    </Button>
  )
}
```

#### Test 3: Pricing Page Layout
```tsx
// app/pricing/page.tsx
export default function PricingPage() {
  const layout = getExperimentVariant(Experiments.PRICING_PAGE_LAYOUT)
  
  if (layout === 'table') {
    return <PricingTable />
  }
  
  return <PricingCards /> // control
}
```

---

## 5. Cohort Analysis

### User Properties for Cohorts

```typescript
// lib/analytics/user-properties.ts
export function setUserProperties(user: User) {
  if (typeof window === 'undefined') return
  
  posthog.people.set({
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    subscription_tier: user.subscription_tier,
    has_created_chart: user.has_chart,
    charts_count: user.charts_count,
    last_active: new Date().toISOString(),
    
    // Astro-specific
    sun_sign: user.natal_chart?.sun.sign,
    has_birth_time: !!user.birth_time,
    
    // Engagement
    spheres_viewed: user.spheres_viewed_count,
    ai_messages_sent: user.ai_messages_count,
    invites_sent: user.invites_sent_count,
    
    // Attribution
    utm_source: user.utm_source,
    utm_campaign: user.utm_campaign,
    referrer: user.referrer
  })
}
```

### Cohort Definitions (PostHog UI)

**Cohort 1: Active Users (7d)**
- Filter: `last_active` within last 7 days

**Cohort 2: Premium Subscribers**
- Filter: `subscription_tier` = 'premium'

**Cohort 3: Viral Contributors**
- Filter: `invites_sent` >= 1

**Cohort 4: Power Users**
- Filter: `spheres_viewed` >= 3 AND `ai_messages_sent` >= 5

**Cohort 5: At-Risk Users**
- Filter: `created_at` > 14 days ago AND `last_active` > 7 days ago

### Retention Analysis

```typescript
// Track first-time actions
export function trackFirstTime(action: string) {
  const key = `first_${action}`
  
  if (typeof window === 'undefined') return
  
  const hasTracked = localStorage.getItem(key)
  
  if (!hasTracked) {
    track(`first_${action}`, {
      timestamp: new Date().toISOString()
    })
    
    localStorage.setItem(key, 'true')
    
    // Set user property
    posthog.people.set({
      [`first_${action}_at`]: new Date().toISOString()
    })
  }
}

// Usage
trackFirstTime('chart_created')
trackFirstTime('premium_upgrade')
trackFirstTime('invite_sent')
```

---

## 6. Umami Integration (Privacy-First Fallback)

### Installation

```bash
npm install @umami/node
```

### Setup

```tsx
// lib/analytics/umami.ts
import { track as umamiTrack } from '@umami/node'

export function initUmami() {
  if (typeof window === 'undefined') return
  
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.dataset.websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID!
  script.src = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is/script.js'
  
  document.head.appendChild(script)
}

export function trackUmami(event: string, data?: Record<string, any>) {
  if (typeof window === 'undefined') return
  
  // @ts-ignore - umami is loaded via script tag
  if (window.umami) {
    window.umami.track(event, data)
  }
}
```

```tsx
// app/layout.tsx
import { initUmami } from '@/lib/analytics/umami'

export default function RootLayout({ children }: Props) {
  useEffect(() => {
    initPostHog()
    initUmami()
  }, [])
  
  return <html><body>{children}</body></html>
}
```

### Umami Dashboard

**Self-hosted option:**
```bash
# Deploy Umami to Railway/Vercel
git clone https://github.com/umami-software/umami
cd umami
vercel deploy
```

**Metrics tracked:**
- Page views
- Unique visitors
- Bounce rate
- Referrers
- Devices/browsers
- Geographic data

---

## 7. Analytics Dashboard

### Custom Dashboard Component

```tsx
// app/admin/analytics/page.tsx
import { PostHogProvider, usePostHog } from 'posthog-js/react'

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
      <h1>Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Users (7d)"
          value="1,234"
          change="+12.5%"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change="+0.5%"
        />
        <StatCard
          title="MRR"
          value="₴45,600"
          change="+28%"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelChart funnel="acquisition" />
        <RetentionChart cohort="weekly" />
      </div>
      
      <div>
        <h2>Active Experiments</h2>
        <ExperimentsTable />
      </div>
    </div>
  )
}
```

### Embedded PostHog Dashboards

```tsx
// components/analytics/PostHogEmbed.tsx
export function PostHogDashboard({ dashboardId }: Props) {
  return (
    <iframe
      src={`https://app.posthog.com/embedded/${dashboardId}`}
      className="w-full h-[600px] border rounded-lg"
      allowFullScreen
    />
  )
}
```

---

## 8. Privacy & GDPR Compliance

### Cookie Consent

```tsx
// components/CookieConsent.tsx
import { useState, useEffect } from 'react'
import { posthog } from '@/lib/analytics/posthog'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setShow(true)
    } else if (consent === 'accepted') {
      posthog.opt_in_capturing()
    }
  }, [])
  
  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    posthog.opt_in_capturing()
    setShow(false)
  }
  
  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    posthog.opt_out_capturing()
    setShow(false)
  }
  
  if (!show) return null
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-card border rounded-lg p-6 shadow-lg z-50">
      <h3 className="font-semibold mb-2">Cookies & Analytics</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Ми використовуємо cookies та analytics для покращення вашого досвіду. 
        Всі дані анонімізовані та не передаються третім сторонам.
      </p>
      <div className="flex gap-3">
        <Button onClick={handleAccept} size="sm">
          Прийняти
        </Button>
        <Button onClick={handleDecline} variant="outline" size="sm">
          Відхилити
        </Button>
      </div>
    </div>
  )
}
```

### Data Export/Deletion

```tsx
// app/api/privacy/export/route.ts
export async function POST(request: Request) {
  const { userId } = await request.json()
  
  // Export user data from PostHog
  const data = await posthog.get({
    event: '$pageview',
    properties: {
      distinct_id: userId
    }
  })
  
  return Response.json({ data })
}

// app/api/privacy/delete/route.ts
export async function POST(request: Request) {
  const { userId } = await request.json()
  
  // Delete from PostHog (GDPR request)
  await posthog.delete({
    distinct_id: userId
  })
  
  return Response.json({ success: true })
}
```

---

## Implementation Plan

### Day 1: Foundation (4-6 hours)
- [ ] Install PostHog + Umami
- [ ] Setup initialization in layout
- [ ] Implement track() helper
- [ ] Add page view tracking
- [ ] Define core events schema
- [ ] Add tracking to 10 key events:
  - [ ] onboarding_started
  - [ ] chart_created
  - [ ] sphere_viewed
  - [ ] pricing_page_viewed
  - [ ] upgrade_clicked
  - [ ] payment_success
  - [ ] invite_created
  - [ ] invite_accepted
  - [ ] ai_chat_opened
  - [ ] blog_article_viewed

### Day 2: Advanced Features (4-6 hours)
- [ ] Setup funnels in PostHog UI
- [ ] Implement feature flags for A/B tests
- [ ] Add first A/B test (onboarding steps)
- [ ] Setup user properties
- [ ] Create cohorts in PostHog
- [ ] Cookie consent component
- [ ] Analytics admin dashboard
- [ ] Testing & QA

---

## Success Metrics

**Week 1:**
- [ ] 100% event tracking coverage on key flows
- [ ] 3 funnels configured
- [ ] 1 A/B test running

**Month 1:**
- [ ] Acquisition funnel completion rate baseline
- [ ] Monetization conversion rate baseline
- [ ] First A/B test result (stat sig)
- [ ] Cohort retention data (D1, D7, D30)

**Month 3:**
- [ ] +20% conversion rate (from A/B tests)
- [ ] 5+ experiments run
- [ ] Data-driven roadmap prioritization

---

## Key Reports to Build

1. **Weekly Product Report**
   - Active users (D1, D7, D30)
   - Conversion funnel metrics
   - Top features used
   - A/B test results

2. **Monthly Business Report**
   - MRR growth
   - Churn rate
   - CAC vs LTV
   - Viral K-factor

3. **Experiment Results**
   - Test name & hypothesis
   - Variants & sample size
   - Conversion rates
   - Statistical significance
   - Winner decision

---

## Environment Variables

```env
# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_SESSION_RECORDING=false

# Umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxx
NEXT_PUBLIC_UMAMI_URL=https://analytics.umami.is/script.js
```

---

## Risks & Mitigations

**Risk 1: Performance impact**
- Mitigation: Lazy load PostHog, async scripts
- Bundle size monitoring
- Opt-out for slow connections

**Risk 2: Privacy concerns**
- Mitigation: Cookie consent banner
- Clear privacy policy
- Umami fallback (cookie-free)
- No PII tracking

**Risk 3: Data overload**
- Mitigation: Focus on key metrics
- Weekly review process
- Archive old experiments

**Risk 4: A/B test pollution**
- Mitigation: Max 2-3 concurrent tests
- Proper segment isolation
- Statistical significance calculator

---

## Out of Scope (v2)

- Heatmaps (Hotjar/PostHog Recordings)
- User surveys
- NPS tracking
- Server-side analytics
- Custom data warehouse integration
- ML-powered insights

---

**Готовність до імплементації:** Після approval
**Estimated effort:** 1-2 дні
**Priority:** HIGH (foundational for data-driven growth)
