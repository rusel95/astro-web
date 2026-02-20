# Spec #78: Monetization — Freemium Tiers

**Issue:** [#78](https://github.com/rusel95/astro-web/issues/78)  
**Status:** Draft  
**Priority:** Critical (Revenue)  
**Estimated:** 3-4 дні implementation + 1 день testing  

---

## 🎯 Мета

Впровадити 2-tier freemium модель для монетизації AstroSvitla з Stripe та LiqPay платежами.

**Бізнес-цілі:**
- Free→Premium conversion > 3%
- MRR > ₴10,000 за перший місяць
- Churn < 5%/місяць
- Annual subscription uptake > 30%

---

## 📊 Pricing Model

### FREE Tier (Default)
- ✅ 1 безкоштовний натальний чарт (з basic AI аналізом)
- ✅ Збереження 1 чарту
- ✅ 1 сфера AI аналізу на вибір (з 6 доступних)
- ✅ Доступ до blog/статей
- ❌ Compatibility reports
- ❌ Birthday forecast
- ❌ Щоденні гороскопи
- ❌ PDF export

### PREMIUM Tier
**Ціна:** ₴99/міс або ₴699/рік (save 40%)

- ✅ **Всі 6 сфер AI аналізу** (personality, love, career, health, money, purpose)
- ✅ **Щоденні персоналізовані гороскопи**
- ✅ **Compatibility reports** (необмежено партнерів)
- ✅ **Birthday annual forecast**
- ✅ **Необмежені натальні чарти** (для друзів/сім'ї)
- ✅ **PDF export** звітів
- ✅ **Пріоритетна підтримка**
- ✅ **Без реклами** (коли додамо)
- ✅ **Early access** до нових фіч

---

## 🏗 Технічна архітектура

### 1. Database Schema (Supabase)

**Нова таблиця: `subscriptions`**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Subscription status
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium')),
  
  -- Stripe data
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  
  -- LiqPay data (для українців)
  liqpay_order_id TEXT,
  
  -- Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  -- Metadata
  plan_interval TEXT CHECK (plan_interval IN ('month', 'year')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Index for fast lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

**Modify `profiles` table:**
```sql
ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium'));
ALTER TABLE profiles ADD COLUMN charts_count INT DEFAULT 0;
```

**Нова таблиця: `usage_limits`**
```sql
CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Counters (reset monthly for free tier)
  charts_created_this_month INT DEFAULT 0,
  ai_reports_generated_this_month INT DEFAULT 0,
  compatibility_reports_this_month INT DEFAULT 0,
  
  -- Last reset
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);
```

---

### 2. Stripe Integration

**Dependencies:**
```bash
npm install stripe @stripe/stripe-js
```

**Environment variables (.env.local):**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Stripe Products to create:**
1. **Premium Monthly** - ₴99/міс (price_id: `price_premium_monthly_uah`)
2. **Premium Yearly** - ₴699/рік (price_id: `price_premium_yearly_uah`)

---

### 3. API Routes

#### `/api/stripe/create-checkout-session` (POST)
**Purpose:** Створити Stripe Checkout сесію для підписки

**Request:**
```json
{
  "priceId": "price_premium_monthly_uah",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Flow:**
1. Get/create Stripe customer (stripe_customer_id from subscriptions table)
2. Create Checkout Session with 7-day trial
3. Set success_url and cancel_url
4. Return session URL

---

#### `/api/stripe/webhook` (POST)
**Purpose:** Handle Stripe webhooks (subscription events)

**Events to handle:**
- `checkout.session.completed` → створити subscription в DB
- `customer.subscription.created` → update subscription status = 'active'
- `customer.subscription.updated` → sync status changes
- `customer.subscription.deleted` → downgrade to free
- `invoice.payment_failed` → status = 'past_due', send email

**Security:**
- Verify webhook signature with `stripe.webhooks.constructEvent()`

---

#### `/api/stripe/portal` (POST)
**Purpose:** Redirect to Stripe Customer Portal (manage subscription)

**Request:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

---

#### `/api/subscription/status` (GET)
**Purpose:** Get current user's subscription status

**Response:**
```json
{
  "tier": "premium",
  "status": "active",
  "currentPeriodEnd": "2026-03-20T12:00:00Z",
  "cancelAtPeriodEnd": false,
  "planInterval": "month"
}
```

---

### 4. Middleware / Auth Guards

**File:** `src/lib/subscription.ts`

```typescript
export async function checkSubscription(userId: string): Promise<{
  tier: 'free' | 'premium';
  isActive: boolean;
}> {
  // Query subscriptions table
  // Return tier and active status
}

export async function requirePremium(userId: string): Promise<boolean> {
  const sub = await checkSubscription(userId);
  return sub.tier === 'premium' && sub.isActive;
}

export async function canGenerateAIReport(userId: string, area: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const sub = await checkSubscription(userId);
  
  if (sub.tier === 'premium') return { allowed: true };
  
  // Check usage_limits for free tier (1 report allowed)
  const usage = await getUsageLimits(userId);
  
  if (usage.ai_reports_generated_this_month >= 1) {
    return { 
      allowed: false, 
      reason: 'Free tier: 1 звіт на місяць. Upgrade до Premium для необмежених звітів.' 
    };
  }
  
  return { allowed: true };
}
```

**Apply to API routes:**
```typescript
// src/app/api/report/route.ts
const canGenerate = await canGenerateAIReport(userId, area);
if (!canGenerate.allowed) {
  return NextResponse.json({ 
    error: canGenerate.reason,
    upgradeRequired: true 
  }, { status: 403 });
}
```

---

### 5. UI Components

#### `PricingPage` - `/pricing`
**Location:** `src/app/pricing/page.tsx`

**Sections:**
1. **Hero:** "Розкрийте свій астрологічний потенціал"
2. **Pricing Cards:**
   - FREE tier (left)
   - PREMIUM tier (right, highlighted with gradient border)
3. **Feature comparison table**
4. **FAQ accordion**
5. **CTA:** "Почати з безкоштовного" | "Спробувати Premium (7 днів trial)"

**Design:**
- Dark cosmic theme (consistency з решти сайту)
- Glassmorphism cards
- Animated gradient borders on Premium card
- Yearly toggle switch: "💰 Заощадь 40% з річною підпискою"

---

#### `UpgradeModal` Component
**Location:** `src/components/subscription/UpgradeModal.tsx`

**Trigger points:**
- Clicked 2nd+ AI report area (free tier limit)
- Clicked "Compatibility" feature (premium only)
- Clicked "Birthday Forecast" (premium only)
- Clicked "Щоденні гороскопи" (premium only)

**Content:**
```
🌟 Ця функція доступна у Premium

Premium відкриває:
✨ Всі 6 сфер AI аналізу
💑 Compatibility з партнерами
🎂 Річний прогноз на день народження
🌙 Щоденні гороскопи
📄 PDF export

[Спробувати 7 днів безкоштовно] [Подивитись плани]
```

---

#### `SubscriptionBadge` Component
**Location:** `src/components/subscription/SubscriptionBadge.tsx`

**Display in:**
- Dashboard header (top-right)
- Profile page

**FREE badge:**
```
🆓 Free Plan
[Upgrade to Premium →]
```

**PREMIUM badge:**
```
⭐ Premium
Valid until: Mar 20, 2026
[Manage subscription]
```

---

### 6. Paywall Implementation Points

**File changes:**

1. **`src/app/api/report/route.ts`**
   - Check `canGenerateAIReport()` before generation
   - Return 403 + `upgradeRequired: true` if blocked

2. **`src/app/chart/[id]/page.tsx`**
   - Lock AI report areas (show lock icon 🔒)
   - Show "Premium" badge on locked features
   - onClick → open UpgradeModal

3. **`src/app/compatibility/page.tsx`** (new route)
   - Full paywall: `requirePremium()` or redirect to /pricing

4. **`src/app/horoscopes/page.tsx`** (new route)
   - Daily horoscopes → premium only

---

### 7. Launch Strategy

#### Early Bird Promo (First 100 users)
**Badge на pricing page:**
```
🎁 Early Bird: Lifetime 50% discount!
₴99/міс → ₴49/міс (перші 100 користувачів)
```

**Implementation:**
- Create special Stripe price: `price_early_bird_monthly_uah` (₴49)
- Track usage count in Supabase `promo_codes` table
- Display countdown: "87/100 слотів залишилось"

#### 7-Day Free Trial
- All new Premium subscriptions include trial
- No payment until day 8
- Email notification on day 5: "2 дні до закінчення trial"

#### Annual Discount
- 40% savings displayed prominently
- Highlight: "Еквівалент ₴58/міс при річній підписці"

---

## 📋 Implementation Checklist

### Phase 1: Database & Backend (Day 1)
- [ ] Create Supabase tables: `subscriptions`, `usage_limits`
- [ ] Modify `profiles` table
- [ ] Create Stripe products (Premium Monthly, Yearly)
- [ ] Set up Stripe webhook endpoint
- [ ] Implement `/api/stripe/create-checkout-session`
- [ ] Implement `/api/stripe/webhook`
- [ ] Implement `/api/stripe/portal`
- [ ] Implement `/api/subscription/status`
- [ ] Create `src/lib/subscription.ts` helpers

### Phase 2: Paywall Logic (Day 2)
- [ ] Add subscription checks to `/api/report`
- [ ] Add subscription checks to `/api/compatibility` (new)
- [ ] Implement usage limits tracking
- [ ] Add middleware to protected routes

### Phase 3: UI Components (Day 2-3)
- [ ] Build `/pricing` page
- [ ] Create `UpgradeModal` component
- [ ] Create `SubscriptionBadge` component
- [ ] Add lock icons to premium features
- [ ] Add "Upgrade" CTAs throughout app

### Phase 4: Stripe Testing (Day 3)
- [ ] Test checkout flow (monthly/yearly)
- [ ] Test webhook events (subscription created/updated/deleted)
- [ ] Test trial period
- [ ] Test payment failure handling
- [ ] Test Customer Portal

### Phase 5: Early Bird Campaign (Day 4)
- [ ] Create early bird promo price in Stripe
- [ ] Add promo tracking to database
- [ ] Design early bird badge
- [ ] Set up countdown on pricing page

### Phase 6: Launch (Day 4)
- [ ] Switch to production Stripe keys
- [ ] Deploy to Vercel
- [ ] Announce in Telegram
- [ ] Monitor first conversions

---

## 🧪 Testing Scenarios

### Stripe Test Cards
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Auth required:** `4000 0025 0000 3155`

### Test flows:
1. ✅ Free user creates 1 chart + 1 AI report → success
2. ✅ Free user tries 2nd AI report → blocked, show UpgradeModal
3. ✅ User upgrades to Premium → all features unlocked
4. ✅ Premium user cancels → access until period end
5. ✅ Subscription expires → downgrade to free
6. ✅ Payment fails → status = past_due, email sent
7. ✅ User manages subscription via Customer Portal

---

## 📊 Success Metrics (Track in PostHog)

**Events to log:**
- `pricing_page_viewed`
- `upgrade_modal_shown` (with `trigger_feature`)
- `checkout_started` (with `plan_interval`)
- `subscription_created` (with `plan`, `trial`)
- `subscription_canceled`
- `feature_blocked` (with `feature_name`)

**Metrics to monitor:**
- **Conversion rate:** `subscription_created / upgrade_modal_shown`
- **Trial→Paid:** `subscription_renewed / subscription_created[trial=true]`
- **Annual uptake:** `yearly_subs / total_subs`
- **MRR:** Monthly Recurring Revenue
- **Churn:** `canceled_this_month / active_start_of_month`

---

## 🚨 Edge Cases & Error Handling

1. **Webhook replay attacks:**
   - Store processed webhook IDs in DB
   - Ignore duplicate events

2. **Subscription in Stripe but not in DB:**
   - Sync endpoint: `/api/stripe/sync-subscriptions`
   - Runs on cron daily

3. **User deletes account:**
   - Cancel Stripe subscription via `ON DELETE CASCADE`
   - Refund pro-rata (optional)

4. **Payment method expires:**
   - Stripe sends email automatically
   - We send additional notification 3 days before

5. **User upgrades during active subscription:**
   - Use `proration_behavior: 'create_prorations'`
   - Stripe handles credit automatically

---

## 🌍 Future: LiqPay Integration (Ukraine)

**Why:** Stripe не популярний в Україні, LiqPay працює з Приват24

**Implementation (Phase 2):**
1. Add LiqPay SDK
2. Create `/api/liqpay/checkout` endpoint
3. Store `liqpay_order_id` in subscriptions
4. Manual webhook handling (LiqPay callbacks)
5. Pricing in UAH only (no currency conversion)

**For now:** Start with Stripe only (simpler, international reach)

---

## ✅ Ready for Implementation?

**Review checklist:**
- [ ] Database schema approved
- [ ] API routes design approved
- [ ] Pricing model confirmed (₴99/₴699)
- [ ] Early bird promo approved (₴49)
- [ ] UI/UX mockups reviewed
- [ ] Testing plan approved

**After approval:** Add label `spec-approved` to issue #78

---

**Questions? Discuss in issue comments.**
