# Analytics Setup Guide

## PostHog Setup

### 1. Create PostHog Account
1. Go to [posthog.com](https://posthog.com)
2. Sign up (free tier available)
3. Create a new project

### 2. Get API Keys
1. Go to Project Settings → API Keys
2. Copy your Project API Key
3. Note the API Host (usually `https://app.posthog.com`)

### 3. Configure Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_SESSION_RECORDING=false
```

### 4. Setup Funnels in PostHog

#### Acquisition Funnel
1. Go to Insights → New Insight → Funnel
2. Add steps:
   - `landing_viewed`
   - `onboarding_started`
   - `onboarding_step_completed` (step 1)
   - `onboarding_step_completed` (step 2)
   - `onboarding_step_completed` (step 3)
   - `chart_created`
3. Set time window: 7 days
4. Save to dashboard

#### Monetization Funnel
1. Add steps:
   - `chart_created`
   - `sphere_viewed`
   - `pricing_page_viewed`
   - `upgrade_clicked`
   - `checkout_started`
   - `payment_success`
2. Set time window: 30 days
3. Save to dashboard

#### Viral Funnel
1. Add steps:
   - `chart_created`
   - `invite_created`
   - `invite_shared`
   - `invite_accepted`
   - `synastry_viewed`
2. Set time window: 14 days
3. Save to dashboard

### 5. Create Cohorts

#### Active Users (7d)
- Filter: `last_active` within last 7 days

#### Premium Subscribers
- Filter: `subscription_tier` = 'premium'

#### Viral Contributors
- Filter: `invites_sent` >= 1

#### Power Users
- Filter: `spheres_viewed` >= 3 AND `ai_messages_sent` >= 5

#### At-Risk Users
- Filter: `created_at` > 14 days ago AND `last_active` > 7 days ago

### 6. Setup A/B Tests (Feature Flags)

#### Test 1: Onboarding Steps
1. Go to Feature Flags → New Feature Flag
2. Key: `onboarding-steps`
3. Rollout: 50% control, 50% variant
4. Variants:
   - `control`: 5-step
   - `3-step`: 3-step variant
5. Save

#### Test 2: CTA Button Text
1. Key: `cta-button-text`
2. Variants:
   - `control`: "Почати безкоштовно"
   - `urgency`: "Створити чарт зараз →"
3. Rollout: 50/50
4. Save

---

## Tracked Events

### Core Events (Day 1)
- ✅ `landing_viewed` - Home page viewed
- ✅ `cta_clicked` - CTA button clicked
- ✅ `onboarding_started` - Chart creation started
- ✅ `onboarding_step_completed` - Onboarding step completed
- ✅ `chart_created` - Chart successfully created

### To Add (Day 2)
- [ ] `sphere_viewed` - Sphere page viewed
- [ ] `ai_chat_opened` - AI chat opened
- [ ] `ai_message_sent` - AI message sent
- [ ] `invite_created` - Compatibility invite created
- [ ] `invite_shared` - Invite link shared
- [ ] `synastry_viewed` - Synastry chart viewed
- [ ] `pricing_page_viewed` - Pricing page viewed
- [ ] `upgrade_clicked` - Upgrade button clicked
- [ ] `payment_success` - Payment successful

---

## Testing

### 1. Local Testing
```bash
npm run dev
```

Open browser console and check for:
```
📊 Analytics: landing_viewed {}
📊 Analytics: cta_clicked { location: 'hero' }
📊 Analytics: onboarding_started {}
```

### 2. PostHog Dashboard
1. Go to PostHog → Activity
2. Check recent events appearing in real-time
3. Verify event properties are correct

### 3. Cookie Consent
1. Clear browser localStorage
2. Reload page
3. Verify cookie consent banner appears
4. Test Accept/Decline buttons

---

## Privacy & GDPR

### Cookie Consent
- ✅ Cookie consent banner implemented
- ✅ `opt_in_capturing()` on accept
- ✅ `opt_out_capturing()` on decline
- ✅ Stored in localStorage

### Data Deletion (Future)
Endpoints to implement:
- `/api/privacy/export` - Export user data
- `/api/privacy/delete` - Delete user data (GDPR)

---

## Monitoring

### Weekly Metrics to Track
1. **Acquisition**
   - Landing page views
   - Onboarding starts
   - Chart creation rate
   
2. **Engagement**
   - Spheres viewed per user
   - AI messages sent
   - Return rate (D1, D7)

3. **Monetization**
   - Pricing page views
   - Upgrade clicks
   - Conversion rate

4. **Viral**
   - Invites sent
   - Invites accepted
   - K-factor

### Dashboard Reports
Create in PostHog:
1. **Weekly Product Report**
   - Active users graph
   - Conversion funnels
   - Top features

2. **A/B Test Results**
   - Variant performance
   - Statistical significance
   - Winning variant

---

## Troubleshooting

### Events not appearing in PostHog
1. Check browser console for errors
2. Verify API key in `.env.local`
3. Check PostHog debugger: `posthog.debug()`
4. Ensure cookie consent accepted

### Cookie banner not showing
1. Clear localStorage
2. Check component is imported in layout
3. Verify delay (1 second) is completing

### Performance issues
1. Ensure `autocapture: false` in config
2. Disable session recording if not needed
3. Use lazy loading for PostHog SDK

---

## Next Steps

### Day 2 Tasks
1. Add tracking to sphere pages
2. Add tracking to AI chat
3. Setup first A/B test
4. Create analytics dashboard component
5. Configure Umami (optional)

### Month 1 Goals
- [ ] All key events tracked
- [ ] 3 funnels configured
- [ ] 1 A/B test running
- [ ] Baseline metrics established

---

**Last updated:** 2026-02-21
**Status:** ✅ Day 1 Complete - Core events tracking live!
