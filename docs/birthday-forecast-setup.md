# Birthday Forecast Email Setup Guide

**Part 2/3:** Email Automation with Resend

---

## 📋 Prerequisites

1. **Resend Account** (free tier: 3,000 emails/month)
   - Sign up: https://resend.com/signup
   - Get API key from Dashboard

2. **Supabase Migration** (Part 1 must be completed)
   - Run `supabase/migrations/20260220_birthday_forecasts.sql`

3. **Domain Verification** (optional but recommended)
   - Add your domain to Resend
   - Verify DNS records

---

## ⚙️ Setup Steps

### 1. Get Resend API Key

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name: "AstroWeb Birthday Emails"
4. Copy the key (starts with `re_...`)

### 2. Configure Environment Variables

**Local development (`.env.local`):**
```bash
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=Зоря <astro@astrosvitla.com>
CRON_SECRET=your_random_secret_string
```

**Production (Vercel Dashboard):**
1. Go to Project Settings → Environment Variables
2. Add:
   - `RESEND_API_KEY` = `re_...`
   - `RESEND_FROM_EMAIL` = `Зоря <astro@astrosvitla.com>`
   - `CRON_SECRET` = (generate random 32-char string)

**Generate CRON_SECRET:**
```bash
openssl rand -base64 32
```

---

### 3. Verify Sending Domain (Optional)

**If using custom domain:**
1. Go to Resend → Domains
2. Add domain: `astrosvitla.com`
3. Add these DNS records:

```
Type: TXT
Name: @
Value: resend-verification=xxx (from Resend)

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

**If using Resend subdomain (easier for testing):**
- Use `onboarding@resend.dev` (no verification needed)
- Change `RESEND_FROM_EMAIL` to `onboarding@resend.dev`

---

### 4. Deploy Cron to Vercel

**Vercel cron is already configured in `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/birthday-emails",
      "schedule": "0 8 * * *"
    }
  ]
}
```

**Schedule:** Every day at 08:00 AM UTC (10:00 AM Kyiv)

**Deploy:**
```bash
git push origin main
```

Vercel will automatically:
- Detect `vercel.json`
- Set up cron job
- Run `/api/cron/birthday-emails` daily

---

## 🧪 Testing

### Test 1: Send Single Email (Manual)

```bash
curl -X POST https://astro-web-five.vercel.app/api/birthday-forecast/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{
    "user_id": "uuid-here",
    "forecast_id": "uuid-here",
    "days_until_birthday": 7
  }'
```

**Expected response:**
```json
{
  "success": true,
  "email_id": "xxx",
  "sent_to": "user@example.com",
  "forecast_url": "https://astro-web-five.vercel.app/birthday-forecast/chart-id"
}
```

---

### Test 2: Trigger Cron Job (Manual)

```bash
curl https://astro-web-five.vercel.app/api/cron/birthday-emails \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected response:**
```json
{
  "message": "Birthday emails processed",
  "total_users": 0,
  "sent": 0,
  "skipped": 0,
  "errors": 0,
  "results": []
}
```

---

### Test 3: Create Test User with Birthday in 7 Days

**SQL (run in Supabase SQL Editor):**
```sql
-- 1. Insert test user profile with birthday in 7 days
INSERT INTO profiles (id, birth_date, primary_chart_id)
VALUES (
  'uuid-of-test-user',
  CURRENT_DATE + INTERVAL '7 days', -- Birthday in 7 days
  'test-chart-id'
);

-- 2. Create test chart for user
INSERT INTO charts (id, user_id, chart_data, birth_date)
VALUES (
  'test-chart-id',
  'uuid-of-test-user',
  '{"planets": [...]}', -- Valid chart data
  CURRENT_DATE + INTERVAL '7 days'
);
```

**Then trigger cron:**
```bash
curl https://astro-web-five.vercel.app/api/cron/birthday-emails \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected:** Email sent to test user!

---

## 📧 Email Template Preview

**Subject:** `🎂 Ruslan, через 7 днів твій день народження!`

**Preview:**

```
✨ Зоря
Твій персональний астрологічний гід

🎂 Привіт, Ruslan!

Через 7 днів тобі виповниться 31 рік!

Ми підготували для тебе персональний астрологічний 
прогноз на наступний рік — дізнайся, що приготували 
для тебе зірки! 🌟

[Переглянути мій прогноз →]

Що тебе чекає в прогнозі:
• 📊 Загальний огляд року
• 💼 Кар'єра та амбіції
• ❤️ Любов і стосунки
• 💰 Фінанси та матеріальне
• 📅 Місяць за місяцем
• 🔮 Поради на рік
```

---

## 🔍 Monitoring

### Check Cron Logs (Vercel Dashboard)

1. Go to Vercel → Project → Logs
2. Filter by `/api/cron/birthday-emails`
3. See execution history

### Check Email Delivery (Resend Dashboard)

1. Go to https://resend.com/emails
2. See sent emails
3. Check opens/clicks (if tracking enabled)

### Database Tracking

**Check which emails were sent:**
```sql
SELECT 
  user_id,
  age_turning,
  email_sent_at,
  email_opened
FROM birthday_forecasts
WHERE email_sent_at IS NOT NULL
ORDER BY email_sent_at DESC;
```

---

## 🐛 Troubleshooting

### "Unauthorized" error
- Check `CRON_SECRET` matches in request header
- Verify `.env.local` has correct secret

### "Failed to send email"
- Check `RESEND_API_KEY` is valid
- Verify domain is verified (or use `onboarding@resend.dev`)
- Check Resend dashboard for errors

### "No birthdays today"
- Normal if no users have birthday in 7 days
- Create test user (see Test 3 above)

### Email not arriving
- Check spam folder
- Verify email address in Supabase `auth.users`
- Check Resend logs for delivery status

---

## 📊 Success Metrics

**Track in database:**
- Emails sent: `COUNT(*) WHERE email_sent_at IS NOT NULL`
- Open rate: `COUNT(*) WHERE email_opened = true / total_sent`
- Forecast views: `COUNT(*) WHERE viewed_at IS NOT NULL`

**Expected KPIs:**
- Email open rate: > 60% (birthdays = high intent)
- Forecast view rate: > 80% (from email)
- Share rate: > 25% (viral potential)

---

## 🚀 Next Steps (Part 3/3)

- [ ] PDF Export (optional)
- [ ] Social sharing buttons
- [ ] Unsubscribe handling
- [ ] A/B test email send time (7 days vs 3 days)
- [ ] Birthday day email (not just 7 days before)

---

**Files created:**
- `src/lib/email/templates/birthday-forecast.tsx`
- `src/app/api/birthday-forecast/send-email/route.ts`
- `src/app/api/cron/birthday-emails/route.ts`
- `vercel.json` (cron schedule)

**Spec:** `docs/specs/77-birthday-forecast-complete.md`
