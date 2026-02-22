# Analytics Testing Checklist

## Pre-Testing Setup

- [ ] PostHog account created
- [ ] API key added to `.env.local`
- [ ] Dev server restarted
- [ ] Browser console open (F12 → Console)

---

## Event Tracking Tests

### 1. Landing Page
- [ ] Navigate to `/`
- [ ] Check console: `📊 Analytics: landing_viewed {}`
- [ ] Check PostHog Activity tab: event appears

### 2. CTA Click
- [ ] Click "Розрахувати карту безкоштовно" button
- [ ] Check console: `📊 Analytics: cta_clicked { location: 'hero' }`
- [ ] Check PostHog: `cta_clicked` event with `location` property

### 3. Onboarding Start
- [ ] Navigate to `/chart/new`
- [ ] Check console: `📊 Analytics: onboarding_started {}`
- [ ] Check PostHog: event appears

### 4. Onboarding Steps
- [ ] Complete step 1 (date)
- [ ] Check console: `onboarding_step_completed { step: 0, from: 0, to: 1 }`
- [ ] Complete step 2 (location)
- [ ] Check console: `onboarding_step_completed { step: 1, from: 1, to: 2 }`
- [ ] Complete all 5 steps
- [ ] Verify all step events in PostHog

### 5. Chart Creation
- [ ] Submit final step
- [ ] Check console: `chart_created` with metadata
- [ ] Verify properties:
  - [ ] `chart_id` present
  - [ ] `has_birth_time` boolean
  - [ ] `gender` value
  - [ ] `zodiac` date
- [ ] Check PostHog: event with all properties

---

## Cookie Consent Tests

### 1. First Visit
- [ ] Open new incognito window
- [ ] Clear localStorage
- [ ] Navigate to `/`
- [ ] Wait 1 second
- [ ] Cookie banner appears

### 2. Accept Flow
- [ ] Click "Прийняти"
- [ ] Banner disappears
- [ ] Check localStorage: `cookie_consent` = `'accepted'`
- [ ] Reload page
- [ ] Banner doesn't appear
- [ ] Events tracked normally

### 3. Decline Flow
- [ ] Clear localStorage
- [ ] Reload page
- [ ] Click "Відхилити"
- [ ] Banner disappears
- [ ] Check localStorage: `cookie_consent` = `'declined'`
- [ ] Reload page
- [ ] Banner doesn't appear
- [ ] Check PostHog: events NOT tracked (opt-out active)

### 4. Persistence
- [ ] Accept consent
- [ ] Close browser
- [ ] Reopen site
- [ ] Banner doesn't appear
- [ ] Events still tracked

---

## PostHog Dashboard Tests

### 1. Real-Time Activity
- [ ] Go to PostHog → Activity
- [ ] Trigger events on site
- [ ] See events appear in real-time (< 5s delay)

### 2. Event Properties
- [ ] Click on `chart_created` event
- [ ] Verify all properties visible:
  - [ ] `chart_id`
  - [ ] `has_birth_time`
  - [ ] `gender`
  - [ ] `zodiac`

### 3. User Identification
- [ ] Check events have `distinct_id` (anonymous or user ID)
- [ ] Events grouped by session

---

## Performance Tests

### 1. Page Load Speed
- [ ] Open Network tab
- [ ] Reload `/`
- [ ] PostHog script loads async (doesn't block render)
- [ ] Page interactive in < 2s

### 2. Bundle Size
```bash
npm run build
```
- [ ] Check bundle size
- [ ] PostHog chunk separate from main bundle
- [ ] Total increase < 50KB gzipped

### 3. Memory Usage
- [ ] Open Performance Monitor (Chrome)
- [ ] Navigate through site
- [ ] No memory leaks
- [ ] JavaScript heap stable

---

## Error Handling Tests

### 1. Missing API Key
- [ ] Remove `NEXT_PUBLIC_POSTHOG_KEY` from env
- [ ] Restart dev server
- [ ] Check console: warning logged
- [ ] Site still works (graceful degradation)
- [ ] No errors thrown

### 2. Network Offline
- [ ] Enable offline mode (DevTools → Network → Offline)
- [ ] Trigger events
- [ ] No errors in console
- [ ] Events queued (PostHog SDK handles this)
- [ ] Go online
- [ ] Events sent

### 3. Ad Blockers
- [ ] Install uBlock Origin
- [ ] Enable strict mode
- [ ] Reload site
- [ ] PostHog may be blocked
- [ ] Site still works
- [ ] No console errors

---

## Cross-Browser Tests

### Chrome
- [ ] All events tracked
- [ ] Cookie banner works
- [ ] Console logs clean

### Firefox
- [ ] All events tracked
- [ ] Cookie banner works
- [ ] Console logs clean

### Safari
- [ ] All events tracked
- [ ] Cookie banner works
- [ ] ITP (Intelligent Tracking Prevention) doesn't break tracking

### Mobile Safari
- [ ] Cookie banner responsive
- [ ] Events tracked on mobile
- [ ] No layout issues

---

## GDPR Compliance Tests

### 1. Privacy Policy
- [ ] Link to privacy policy exists
- [ ] Policy mentions analytics
- [ ] Policy mentions PostHog
- [ ] Opt-out instructions clear

### 2. Data Deletion
- [ ] User can request data deletion
- [ ] Clear instructions provided
- [ ] Contact method available

### 3. Cookie Notice
- [ ] Notice appears before tracking starts
- [ ] Clear accept/decline options
- [ ] Preference persists across sessions

---

## Production Readiness

### 1. Environment Variables
- [ ] `.env.local` not committed
- [ ] `.env.example` updated
- [ ] Production PostHog key different from dev
- [ ] Vercel env vars configured

### 2. Debug Mode
- [ ] `posthog.debug()` only in development
- [ ] No debug logs in production build

### 3. Session Recording
- [ ] Disabled by default (`NEXT_PUBLIC_ENABLE_SESSION_RECORDING=false`)
- [ ] Only enable if explicitly needed
- [ ] Privacy policy updated if enabled

---

## Sign-Off

**Tested by:** _________________  
**Date:** _________________  
**All tests passed:** ☐ Yes ☐ No  
**Notes:**

---

**Issues found:**
- [ ] Issue 1: _________________
- [ ] Issue 2: _________________

**Ready for production:** ☐ Yes ☐ No
