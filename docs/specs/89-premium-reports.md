# Spec: Premium Astrology Reports (#89)

## Огляд
Система преміум астрологічних звітів за одноразову оплату ($20-50 / ₴799-₴1199) як у Astro.com.

## Бізнес-цілі
- **Revenue model:** One-time sales доповнюють підписку
- **Target:** Casual користувачі + professional astrology enthusiasts
- **Benchmark:** Astro.com заробляє мільйони на premium reports ($29-60)
- **Conversion goal:** 2%+ з free users
- **AOV:** $35 середній чек

## Типи звітів

### 1. Life Path Analysis — $29 / ₴799
**Контент:**
- 15-20 сторінок PDF
- Всі 12 домів детально
- Всі major аспекти з інтерпретацією
- Секції: кар'єра, любов, здоров'я, фінанси, життєве призначення
- Professional writing (не AI dump)

**Генерація:**
- AI (GPT-4) базовий draft
- Structured prompts з прикладами
- Post-processing: форматування, структура

### 2. Solar Return Report — $24 / ₴899
**Контент:**
- Персональний прогноз на наступний рік життя
- Розрахунок Solar Return chart
- Місяць-за-місяцем breakdown
- Ключові дати та події

**Use case:** День народження подарунок собі

### 3. Relationship Compatibility — $34 / ₴999
**Контент:**
- Synastry + Composite Chart аналіз
- Що працює, де виклики
- Поради для гармонії
- Детальна сумісність по сферах

**Use case:** Пари, бізнес-партнери

### 4. Career & Life Purpose — $39 / ₴1199
**Контент:**
- Midheaven, 10th house, Saturn детально
- Vocational analysis
- Timing для кар'єрних рухів (транзити)
- Фінансовий потенціал

**Use case:** Кар'єрні питання, зміна професії

## Технічна реалізація

### PDF Generation (День 1-2)
**Бібліотека:** React-PDF або PDFKit
- Beautiful design: астрологічні символи, діаграми, брендинг
- Templates для кожного типу звіту
- Responsive layout (A4 формат)

**Компоненти:**
- Cover page з персональними даними
- Table of contents
- Chart visualization (SVG → PDF)
- Structured sections з typography
- Footer з брендингом AstroSvitla

### AI Content Generation (День 2-3)
**Model:** GPT-4 (якість важлива)
**Prompts:**
```
Ти професійний астролог. Створи детальний аналіз Life Path для людини з таким натальним чартом:
[chart data]

Структура:
1. Вступ (2-3 абзаци)
2. Детальний аналіз кожного з 12 домів
3. Major аспекти та їх інтерпретація
4. Секції: кар'єра, любов, здоров'я, фінанси
5. Висновок та рекомендації

Тон: професійний, підтримуючий, конкретний. Уникай загальних фраз.
```

**Quality control:**
- Post-processing: структура, форматування
- Human review checklist (опційно для першої версії)
- Minimum 15 сторінок для Life Path

### Payment Flow (День 4)
**Міжнародні платежі:** Stripe Checkout
**Україна:** LiqPay

**Flow:**
1. Вибір типу звіту → Landing page з описом
2. "Order Now" → Input натальних даних (якщо ще немає)
3. Stripe/LiqPay checkout
4. Після оплати: генерація PDF (може зайняти 30-60 сек)
5. Email delivery: PDF у лист
6. Confirmation page з download link + збереження в account

**Tech:**
- Stripe: `stripe.checkout.sessions.create`
- LiqPay API інтеграція
- Webhook для confirmation
- Supabase: `purchased_reports` table

### Landing Pages (День 5)
**URL structure:**
- `/reports` — загальна сторінка всіх звітів
- `/reports/life-path` — детальна для кожного типу
- `/reports/solar-return`
- `/reports/compatibility`
- `/reports/career`

**Кожна landing містить:**
- Заголовок + emotional hook
- Що отримаєте (bullets)
- Sample pages (перші 2 сторінки безкоштовно як preview)
- Testimonials (social proof) — мок для запуску
- Pricing (з PPP adjustment)
- "Order Now" CTA button
- FAQ секція

**Design:**
- Hero section з sample chart
- Trust indicators: "15,000+ reports delivered"
- Guarantee: "100% задоволення"

## Ціноутворення (PPP adjusted)

| Report Type | 🇺🇸 USA | 🇺🇦 Ukraine | 🇪🇺 EU |
|------------|---------|-------------|---------|
| Life Path | $29 | ₴799 | €27 |
| Solar Return | $24 | ₴899 | €22 |
| Compatibility | $34 | ₴999 | €32 |
| Career | $39 | ₴1199 | €37 |

**Bundle discount:** 20% при купівлі 2+ звітів
**Add-on:** Live consultation +$50 / +₴1499

**PPP detection:** IP-based (maxmind) або manual select

## Database Schema

```sql
-- Supabase table
CREATE TABLE purchased_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  report_type TEXT NOT NULL, -- 'life-path', 'solar-return', etc
  natal_data JSONB NOT NULL,
  payment_status TEXT NOT NULL, -- 'pending', 'paid', 'failed'
  payment_id TEXT, -- stripe/liqpay transaction id
  amount_paid INTEGER, -- в копійках/центах
  currency TEXT, -- 'usd', 'uah', 'eur'
  pdf_url TEXT, -- S3/Supabase storage URL
  generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchased_reports_user ON purchased_reports(user_id);
CREATE INDEX idx_purchased_reports_payment ON purchased_reports(payment_status);
```

## Upsells & Marketing

### Bundle offers:
- "Complete Life Analysis" (Life Path + Career) — $59 (save $9)
- "Relationship Package" (Compatibility + Solar Return) — $49 (save $9)

### Gift option:
- "Buy for a friend" — email delivery до іншої особи
- Gift card з custom message

### Email triggers:
- День народження → Solar Return пропозиція
- Новий user → Life Path як перший звіт
- Compatibility view → upsell до paid report

## Metrics & Success Criteria

**Launch targets (перший місяць):**
- 100+ reports sold
- Conversion rate: >2% з free users
- AOV: $35
- Revenue: $3k+

**Quality metrics:**
- Customer satisfaction: >4.5/5
- Refund rate: <3%
- Share rate: >15% (social proof)

**Long-term (3 місяці):**
- MRR supplement: +$5k/місяць
- One-time buyers → підписка: 30% conversion
- Gift purchases: 10% від total sales

## Конкурентний аналіз

| Компанія | Ціна | Що пропонують | Наша перевага |
|----------|------|---------------|---------------|
| Astro.com | $29-60 | Professional reports | Ми дешевше + AI-персоналізація |
| CafeAstrology | Free | Basic інтерпретації | Ми premium quality |
| Co-Star | Subscription only | Підписка $9.99/міс | Ми one-time (lower barrier) |
| Pattern | Subscription only | $11.99/міс | Різні user personas |

## Ризики та Mitigation

**Ризик 1:** AI-generated content виглядає generic
**Mitigation:** GPT-4 + detailed prompts + post-processing + review

**Ризик 2:** Low conversion
**Mitigation:** Free sample pages + testimonials + social proof

**Ризик 3:** Рефанди через незадоволення
**Mitigation:** Clear expectations + preview + support

**Ризик 4:** Складність генерації PDF
**Mitigation:** Test library заздалегідь + fallback до простішого форматування

## Timeline (5 днів)

**День 1-2:** PDF Generation Engine
- React-PDF setup + templates
- Design системи
- Chart rendering у PDF
- 4 типи templates

**День 2-3:** AI Content Prompts
- GPT-4 prompts для кожного типу
- Testing та refinement
- Post-processing logic
- Quality checklist

**День 4:** Payment Integration
- Stripe setup + test mode
- LiqPay integration
- Webhook handling
- Email delivery (SendGrid/Resend)
- Storage для PDFs (Supabase Storage)

**День 5:** Landing Pages
- 4 landing pages (one per report type)
- Main /reports overview
- Samples generation
- CTA buttons + forms
- SEO meta tags

## Post-Launch Plan

**Week 1:**
- Monitor conversion funnel
- Fix bugs/issues
- Collect first testimonials

**Week 2-4:**
- A/B test pricing
- Improve AI prompts based on feedback
- Add more samples
- Launch email campaigns

**Month 2:**
- Bundle offers
- Gift option
- Referral program

## Approval Checklist

- [ ] PDF templates дизайн узгоджено
- [ ] Pricing strategy підтверджено
- [ ] Payment flow протестовано
- [ ] AI prompts review (sample outputs)
- [ ] Landing pages copywriting review
- [ ] Legal: terms & refund policy
- [ ] Privacy: payment data handling

---
**Created:** 2026-02-23
**Status:** Pending Approval
**Estimate:** 5 days
**Priority:** High (Monetization Critical)
