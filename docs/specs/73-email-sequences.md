# Spec: #73 Email Sequences — Engagement & Reactivation

## Мета
Автоматизувати lifecycle email комунікацію для підвищення retention (+15-20%) та реактивації неактивних користувачів (10-15%).

## Бізнес-обґрунтування
- **Retention:** Email touchpoints збільшують D7 retention на 15-20%
- **Reactivation:** Win-back campaigns повертають 10-15% неактивних користувачів
- **Education:** Onboarding emails підвищують product adoption
- **Trust:** Regular communication = brand loyalty
- **Monetization:** Email = канал для Premium upsell

## Email Flows

### 1. Welcome Email (Day 0)
**Trigger:** Користувач створив обліковий запис

**Subject:** "✨ Ваш астрологічний чарт готовий, [Ім'я]!"

**Content:**
```
Привіт [Ім'я]! 👋

Вітаємо в AstroSvitla — вашому персональному астрологічному гіді!

Ваш натальний чарт вже чекає на вас:
[CTA: Переглянути мій чарт →]

Що далі?
• Дослідіть 6 сфер життя: кар'єра, стосунки, фінанси, здоров'я
• Поспілкуйтесь з AI астрологом про своє призначення
• Перевірте сумісність з друзями та партнерами

З любов'ю до зірок,
Команда AstroSvitla ✨

P.S. Відповідайте на цей email, якщо маєте питання!
```

**Design:**
- Beautiful header зі зірками
- Візуалізація чарту (preview)
- Clear CTA button
- Social links (Instagram, Telegram)

**Timing:** Відразу після реєстрації (0-5 хв)

---

### 2. Onboarding Sequence

#### Day 1: "Розкрийте свої таланти"
**Subject:** "🌟 Що ваші планети кажуть про ваші сильні сторони?"

**Content:**
```
Привіт [Ім'я],

Вчора ви відкрили свій натальний чарт. Сьогодні давайте дізнаємось про ваші природні таланти!

Ваше Сонце в [Знак] говорить про те, що...
[AI-генерована персоналізація на основі Sun sign]

Хочете дізнатись більше?
[CTA: Дослідити сферу "Таланти" →]

💡 Порада дня: Найкращий спосіб зрозуміти свій чарт — почати з того, що резонує найбільше.
```

**Персоналізація:** Sun sign interpretation snippet

---

#### Day 3: "Ваші стосунки і сумісність"
**Subject:** "💕 З ким у вас найкраща сумісність?"

**Content:**
```
Привіт [Ім'я],

Один з найцікавіших аспектів астрології — розуміння динаміки стосунків.

Ваша Венера в [Знак] розкриває, як ви любите і що цінуєте у партнерах...
[AI персоналізація]

Цікаво дізнатись сумісність з кимось конкретним?
[CTA: Перевірити сумісність →]

Запросіть друга або партнера і отримайте детальний звіт сумісності!
```

**Goal:** Drive compatibility feature usage (viral loop)

---

#### Day 7: "Ваш тиждень з AstroSvitla"
**Subject:** "✨ Підсумки вашого астрологічного тижня"

**Content:**
```
Привіт [Ім'я],

Минув тиждень з моменту вашого знайомства з AstroSvitla! 🎉

Ось що ви дослідили:
✓ [Sphere 1 name] — переглянуто
✓ [Sphere 2 name] — переглянуто
⭕ [Sphere 3 name] — ще не відкрито

Що далі?
• Щоденні персоналізовані гороскопи (Premium) 🌙
• Синастрія з друзями 💑
• База знань з 50+ статей 📚

[CTA: Продовжити дослідження →]

Залишились питання? Просто відповідайте на цей email!
```

**Goal:** Show progress, encourage continued engagement

---

### 3. Weekly Digest (For Active Users)
**Trigger:** Користувач активний (logged in за останні 7 днів)

**Frequency:** Щотижня (П'ятниця, 10:00 AM)

**Subject:** "🌙 Ваш астро-тиждень: [Дата] - [Дата]"

**Content:**
```
Привіт [Ім'я],

Цього тижня зірки приготували для вас:

🔮 Головний транзит:
[Найважливіший транзит тижня персонально]
[AI-інтерпретація: що це означає для вас]

📅 Найкращі дні тижня:
• Понеділок: ⭐⭐⭐ Відмінно для комунікації
• Середа: ⭐⭐ Обережно з фінансовими рішеннями
• П'ятниця: ⭐⭐⭐⭐ Ідеально для стосунків

💡 Порада на тиждень:
[Персоналізована порада на основі транзитів]

[CTA: Детальний прогноз тижня →]

---

📚 Стаття тижня:
"[Title of latest blog post]"
[Snippet]
[Read more →]
```

**Персоналізація:**
- Транзити відносно натального чарту
- Good days calendar preview
- AI-генерований недільний прогноз

---

### 4. Win-Back Campaign (Inactive Users)
**Trigger:** Користувач не логінився 30+ днів

**Email 1 (Day 30): "Ми сумуємо за вами"**
**Subject:** "✨ [Ім'я], зірки чекають на вас!"

**Content:**
```
Привіт [Ім'я],

Минув місяць з вашого останнього візиту. Сумуємо! 🌙

За цей час у вашому житті відбулись важливі астрологічні події:

🔮 Що нового:
• [Транзит 1]: вплинув на вашу сферу [область]
• [Транзит 2]: відкрив нові можливості в [область]

Хочете дізнатись, що зірки готують далі?
[CTA: Повернутись до мого чарту →]

---

🎁 Спеціальна пропозиція:
Отримайте 7 днів Premium безкоштовно — щоденні персоналізовані гороскопи чекають!
[CTA: Активувати Premium →]
```

---

**Email 2 (Day 45): Last Chance**
**Subject:** "🌟 Останній шанс дізнатись ваш прогноз"

**Content:**
```
Привіт [Ім'я],

Це наш останній email (обіцяємо не спамити!).

Ми створили AstroSvitla, щоб допомогти вам краще зрозуміти себе через астрологію.

Якщо ви більше не цікавитесь — ми розуміємо.
Але якщо готові повернутись, ми тут! ✨

[CTA: Повернутись →]

Або якщо хочете, щоб ми перестали писати:
[Unsubscribe link]

З повагою,
Команда AstroSvitla
```

**Tone:** Чесний, не настирливий, емоційний

---

### 5. Premium Upsell Campaign
**Trigger:** Free user, активний 7+ днів, не має Premium

**Subject:** "💎 Готові до щоденних астрологічних інсайтів?"

**Content:**
```
Привіт [Ім'я],

Ви вже дослідили основи свого чарту. Що далі?

AstroSvitla Premium відкриває:
✅ Щоденні персоналізовані гороскопи
✅ Необмежена кількість звітів сумісності
✅ Прогноз на рік вперед (Birthday Forecast)
✅ PDF експорт ваших звітів
✅ Без реклами

Всього ₴99/міс або ₴699/рік (економія 40%)

[CTA: Спробувати 7 днів безкоштовно →]

Не впевнені? Почніть з 7-денного trial — без автопродовження.
```

**Timing:** Day 7 або day 14

---

## Technical Implementation

### Email Service Provider
**Рекомендація:** Resend.com або SendGrid

**Чому Resend:**
- Developer-friendly API
- Built-in React Email templates
- Excellent deliverability
- Affordable pricing ($20/mo для 50k emails)
- Webhooks для tracking

**Alternative:** SendGrid (більше features, складніший setup)

---

### Database Schema

```sql
-- Email logs
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL, -- welcome, onboarding_d1, weekly_digest, etc
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, opened, clicked, bounced
  error_message TEXT
);

CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);

-- Email preferences
CREATE TABLE email_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  onboarding_emails BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  transactional_emails BOOLEAN DEFAULT TRUE, -- can't be disabled
  unsubscribed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Email Templates (React Email)

```tsx
// emails/Welcome.tsx
import { Button, Html, Head, Body, Container, Text } from '@react-email/components'

export default function WelcomeEmail({ userName, chartUrl }: Props) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>
            Привіт {userName}! 👋
          </Text>
          
          <Text style={paragraph}>
            Вітаємо в AstroSvitla — вашому персональному астрологічному гіді!
          </Text>
          
          <Button href={chartUrl} style={button}>
            Переглянути мій чарт →
          </Button>
          
          {/* ... rest of template */}
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#0a0a0a', fontFamily: 'Inter, sans-serif' }
const container = { margin: '0 auto', padding: '40px 20px' }
// ... styles
```

---

### Automation Logic

```typescript
// lib/emails/automation.ts

// 1. Welcome email (immediate)
export async function sendWelcomeEmail(userId: string) {
  const user = await getUser(userId)
  
  if (!user.email || !user.email_preferences?.onboarding_emails) return
  
  const chartUrl = `${BASE_URL}/chart/${user.id}`
  
  await resend.emails.send({
    from: 'AstroSvitla <hello@astrosvitla.com>',
    to: user.email,
    subject: `✨ Ваш астрологічний чарт готовий, ${user.name}!`,
    react: WelcomeEmail({ userName: user.name, chartUrl })
  })
  
  await logEmail(userId, 'welcome')
}

// 2. Onboarding sequence (cron job)
export async function sendOnboardingEmails() {
  // Day 1
  const d1Users = await getUsersCreatedDaysAgo(1)
  for (const user of d1Users) {
    if (!hasReceivedEmail(user.id, 'onboarding_d1')) {
      await sendOnboardingDay1(user)
    }
  }
  
  // Day 3
  const d3Users = await getUsersCreatedDaysAgo(3)
  for (const user of d3Users) {
    if (!hasReceivedEmail(user.id, 'onboarding_d3')) {
      await sendOnboardingDay3(user)
    }
  }
  
  // Day 7
  const d7Users = await getUsersCreatedDaysAgo(7)
  for (const user of d7Users) {
    if (!hasReceivedEmail(user.id, 'onboarding_d7')) {
      await sendOnboardingDay7(user)
    }
  }
}

// 3. Weekly digest (cron: every Friday 10am)
export async function sendWeeklyDigests() {
  const activeUsers = await getActiveUsers(7) // active in last 7 days
  
  for (const user of activeUsers) {
    if (!user.email_preferences?.weekly_digest) continue
    
    // Generate personalized weekly forecast
    const transits = await getWeeklyTransits(user.natal_chart)
    const forecast = await generateWeeklyForecast(transits, user)
    const goodDays = await calculateGoodDays(transits, user)
    const latestArticle = await getLatestBlogPost()
    
    await resend.emails.send({
      from: 'AstroSvitla <weekly@astrosvitla.com>',
      to: user.email,
      subject: `🌙 Ваш астро-тиждень: ${getWeekRange()}`,
      react: WeeklyDigestEmail({ user, forecast, goodDays, latestArticle })
    })
    
    await logEmail(user.id, 'weekly_digest')
  }
}

// 4. Win-back campaign
export async function sendWinBackEmails() {
  // Day 30
  const inactive30 = await getInactiveUsers(30)
  for (const user of inactive30) {
    if (!hasReceivedEmail(user.id, 'winback_d30')) {
      await sendWinBack30(user)
    }
  }
  
  // Day 45
  const inactive45 = await getInactiveUsers(45)
  for (const user of inactive45) {
    if (!hasReceivedEmail(user.id, 'winback_d45')) {
      await sendWinBack45(user)
    }
  }
}
```

---

### Cron Jobs Setup

```typescript
// app/api/cron/emails/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Run all email automations
  await sendOnboardingEmails()
  
  // Only on Fridays
  if (new Date().getDay() === 5) {
    await sendWeeklyDigests()
  }
  
  // Daily win-back check
  await sendWinBackEmails()
  
  return Response.json({ ok: true })
}
```

**Vercel Cron:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/emails",
    "schedule": "0 10 * * *" // Daily at 10am UTC
  }]
}
```

---

### Email Deliverability (SPF/DKIM/DMARC)

**Domain Setup:**

1. **SPF Record:**
```
TXT @ "v=spf1 include:_spf.resend.com ~all"
```

2. **DKIM:** 
Resend auto-generates, add their provided records

3. **DMARC:**
```
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@astrosvitla.com"
```

4. **Custom Domain:**
```
hello@astrosvitla.com
weekly@astrosvitla.com
noreply@astrosvitla.com
```

**Warm-up Strategy:**
- Week 1: 50 emails/day
- Week 2: 200 emails/day
- Week 3: 500 emails/day
- Week 4+: Full volume

---

## Personalization Strategy

### AI-Generated Content
```typescript
async function generatePersonalizedSnippet(user: User, context: string): Promise<string> {
  const prompt = `
Ти — дружній астролог для AstroSvitla.

Користувач: ${user.name}
Натальний чарт: 
- Сонце: ${user.natal_chart.sun.sign}
- Місяць: ${user.natal_chart.moon.sign}
- Венера: ${user.natal_chart.venus.sign}

Контекст email: ${context}

Напиши 2-3 речення персоналізованого контенту для цього користувача.
Стиль: тепло, підтримуюче, конкретно.
Мова: українська.
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150
  })
  
  return response.choices[0].message.content
}
```

---

## Analytics & Tracking

### Key Metrics
```sql
-- Email performance dashboard
SELECT 
  email_type,
  COUNT(*) as sent,
  COUNT(opened_at) as opened,
  COUNT(clicked_at) as clicked,
  ROUND(COUNT(opened_at) * 100.0 / COUNT(*), 2) as open_rate,
  ROUND(COUNT(clicked_at) * 100.0 / COUNT(*), 2) as click_rate
FROM email_logs
WHERE sent_at > NOW() - INTERVAL '30 days'
GROUP BY email_type
ORDER BY sent DESC;
```

**Target Benchmarks:**
- Welcome: 60%+ open rate, 20%+ click rate
- Onboarding: 40%+ open rate, 15%+ click rate
- Weekly Digest: 35%+ open rate, 10%+ click rate
- Win-back: 20%+ open rate, 5%+ click rate

---

## Implementation Plan

### Day 1: Infrastructure + Welcome/Onboarding
- [ ] Setup Resend.com account
- [ ] Configure SPF/DKIM/DMARC records
- [ ] Database tables: email_logs, email_preferences
- [ ] Install @react-email packages
- [ ] Create email templates (React Email):
  - [ ] Welcome email
  - [ ] Onboarding D1, D3, D7
- [ ] API routes: /api/emails/send
- [ ] Trigger welcome email on signup

### Day 2: Weekly Digest + Win-back + Deliverability
- [ ] Weekly digest template + logic
- [ ] Win-back D30, D45 templates
- [ ] Cron job: /api/cron/emails
- [ ] Vercel cron configuration
- [ ] Email preferences page (/settings/emails)
- [ ] Unsubscribe mechanism
- [ ] Testing & QA (send test emails)
- [ ] Domain warm-up start

---

## Success Metrics

**Week 1:**
- [ ] Welcome emails: 90%+ delivery rate
- [ ] Onboarding sequence active
- [ ] 0 spam complaints

**Month 1:**
- [ ] 50%+ open rate on welcome emails
- [ ] 30%+ open rate on onboarding
- [ ] 5%+ win-back conversion (inactive → active)

**Month 3:**
- [ ] Retention +15-20% (vs no-email baseline)
- [ ] 10-15% reactivation rate
- [ ] Weekly digest: 1000+ active subscribers

---

## Risks & Mitigations

**Risk 1: Low deliverability (spam)**
- Mitigation: Proper DNS setup, domain warm-up
- Monitor bounce rate <5%
- Use reputable ESP (Resend)

**Risk 2: Generic content (low engagement)**
- Mitigation: Heavy personalization via AI
- A/B test subject lines
- User feedback loop

**Risk 3: Email fatigue**
- Mitigation: Easy unsubscribe
- Frequency capping
- Preference center (choose which emails)

**Risk 4: Technical failures**
- Mitigation: Retry logic
- Error monitoring (Sentry)
- Fallback email provider

---

## Out of Scope (v2)
- SMS notifications
- Push notifications (web/mobile)
- Advanced segmentation (behavior-based)
- Dynamic content blocks
- A/B testing framework
- Drip campaign builder UI

---

**Готовність до імплементації:** Після approval
**Estimated effort:** 2 дні
**Priority:** HIGH (retention critical)
