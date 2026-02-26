# Spec: Daily Push Notifications

**Issue:** #62  
**Priority:** High (retention critical)  
**Estimate:** 3 дні  
**Status:** Needs Review

---

## Мета

Додати систему щоденних push-уведомлень з персоналізованими астро-інсайтами на основі поточних транзитів. Модель Co-Star: daily engagement → retention → монетизація.

---

## Проблема, яку вирішуємо

1. **Низька retention:** Користувачі створюють карту один раз і більше не повертаються
2. **Немає daily habit:** Astro-продукт має бути щоденною звичкою, як гороскоп
3. **Пропущені транзити:** Важливі астро-події проходять непоміченими
4. **Zero viral mechanic:** Немає причини ділитися контентом щодня

---

## Бізнес-метрики успіху

- **D7 retention:** 5% → 35%+
- **D30 retention:** 2% → 20%+
- **Daily active users:** +300%
- **Push open rate:** >40%
- **Push-to-premium conversion:** >3%

---

## Технічна архітектура

### 1. Push Provider

**Варіант A: OneSignal (рекомендовано)**
- ✅ Free tier: 10,000 MAU
- ✅ Web Push (desktop + mobile browsers)
- ✅ SDK для Next.js
- ✅ Segmentation, scheduling
- ❌ Немає SMS/Email (але нам і не треба)

**Варіант B: Firebase Cloud Messaging (FCM)**
- ✅ Повністю безкоштовно
- ✅ Google infrastructure
- ❌ Складніша інтеграція з Next.js
- ❌ Потребує Firebase проєкт

**Рішення:** OneSignal (швидше запустити, easier setup)

### 2. Система Cron Jobs

**Архітектура:**
```
/api/cron/daily-notifications (Vercel Cron)
  ↓
Для кожного active user:
  1. Отримати natal chart з Supabase
  2. Розрахувати daily transits (astrology-api)
  3. AI prompt → персоналізований інсайт
  4. OneSignal API → send push
```

**Vercel Cron config:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/daily-notifications",
    "schedule": "0 9 * * *"  // 09:00 UTC щодня
  }]
}
```

**Timezone handling:**
- За замовчуванням: 09:00 UTC (12:00 Київський час)
- v2: зберігати user timezone → відправляти о 09:00 local time

### 3. Daily Transit Calculation

**API endpoint:** `/api/transits/daily`

**Логіка:**
1. Поточна дата + час (користувацький timezone)
2. Позиції планет зараз (astrology-api або astronomy-engine fallback)
3. Порівняти з natal chart: які транзити активні
4. Пріоритизація:
   - Tight orbs (<2°) = найважливіші
   - Повільні планети (Сатурн, Уран, Нептун, Плутон) > швидкі
   - Hard aspects (□, ☍) > soft (△, ⚹)

**Output:**
```typescript
{
  date: "2026-02-26",
  userId: "abc123",
  topTransits: [
    {
      transitingPlanet: "Saturn",
      aspect: "square",
      natalPlanet: "Venus",
      orb: 1.2,
      message: "Сатурн квадрат до вашої Венери: складний день для стосунків"
    }
  ]
}
```

### 4. AI Персоналізація

**Prompt template:**
```
Ти — астролог. Користувач має такий натальний чарт: {natal_data}
Сьогодні {date}, активні транзити: {transits}

Напиши ОДНЕ коротке повідомлення (40-60 символів) для push-уведомлення:
- Персоналізоване (згадай його natal планети)
- Практичний поради
- Теплий, не драматичний тон
- Емодзі (1-2 шт)

Приклад: "🌙 Місяць у вашому 7 домі — ідеальний день для розмови з близькими"
```

**Варіативність:** 3-5 варіантів тону:
- Motivational (ранок)
- Cautionary (складні аспекти)
- Romantic (Венера/Місяць)
- Career (MC, 10 дім)
- Neutral (fallback)

---

## UI/UX Flow

### 1. Onboarding Opt-in

**Де:** Після створення першої карти

**UI:**
```
┌────────────────────────────────┐
│  🔔 Щоденні астро-інсайти      │
│                                │
│  Отримуй персоналізовані       │
│  підказки щодня о 9:00         │
│                                │
│  [Увімкнути уведомлення]       │
│  [Пізніше]                     │
└────────────────────────────────┘
```

**Conversion target:** >60% opt-in rate

### 2. Settings Page

**Налаштування:**
- ✅ Увімкнути/вимкнути daily notifications
- ✅ Час відправки (09:00 local time)
- ⚠️ v2: Вибір типів (транзити, місячні фази, затемнення)
- ⚠️ v2: Частота (щодня / 3 рази на тиждень)

### 3. Notification Handling

**Click на notification:**
- Веде на `/dashboard` або `/transits/today`
- Показує детальний опис транзиту
- CTA: "Детальний аналіз" → premium upsell

---

## Файли та зміни

### Нові файли

1. **`/api/cron/daily-notifications/route.ts`**
   - Vercel cron handler
   - Fetch active users
   - Generate + send notifications

2. **`/api/transits/daily/route.ts`**
   - Calculate current transits
   - Compare with natal chart
   - Return top 3 transits

3. **`/lib/onesignal.ts`**
   - OneSignal SDK wrapper
   - Send notification helper
   - Subscription management

4. **`/lib/prompts/daily-notification.ts`**
   - AI prompt templates
   - Tone variants

5. **`/components/NotificationOptIn.tsx`**
   - Onboarding modal
   - Browser permission request

### Оновлення існуючих файлів

1. **`/app/layout.tsx`**
   - OneSignal SDK initialization

2. **`/app/settings/page.tsx`**
   - Notification preferences UI

3. **`/supabase/migrations/`**
   - `user_preferences` table extension:
     ```sql
     ALTER TABLE user_preferences ADD COLUMN 
       notifications_enabled BOOLEAN DEFAULT false,
       notification_time TIME DEFAULT '09:00:00',
       onesignal_player_id TEXT;
     ```

---

## Монетизація

### Freemium Model

**Free tier:**
- 7 днів щоденних уведомлень
- Загальні транзити (не персоналізовані)
- 1 повідомлення на день

**Premium ($2.99/міс або ₴99/міс):**
- Необмежені персоналізовані уведомлення
- 3 повідомлення на день (ранок, день, вечір)
- Детальні інтерпретації транзитів
- Історія минулих транзитів
- Eclipse alerts

### Upsell Flow

**Notification text (after 7 days free):**
```
🌟 Продовж щоденні інсайти
Сатурн входить у ваш 10 дім — важливий період для кар'єри!
[Детальніше →] (premium paywall)
```

---

## Етапи імплементації

### Day 1: OneSignal Integration
- [ ] Створити OneSignal акаунт
- [ ] Додати SDK до `layout.tsx`
- [ ] Opt-in modal component
- [ ] Зберігати `onesignal_player_id` в Supabase

### Day 2: Transit Calculation + AI
- [ ] `/api/transits/daily` endpoint
- [ ] Логіка пріоритизації транзитів
- [ ] AI prompt для notification text
- [ ] Fallback messages (якщо API fail)

### Day 3: Cron Job + Testing
- [ ] `/api/cron/daily-notifications` route
- [ ] Vercel Cron configuration
- [ ] Manual test: send to 1 user
- [ ] Batch processing (100 users/minute)
- [ ] Error handling + logging

---

## Ризики та мітігація

### Ризик 1: Push Permission Denial
**Проблема:** Користувачі не дають browser permission  
**Мітігація:**
- Показати value proposition ПЕРЕД запитом permission
- Fallback: email notifications (v2)

### Ризик 2: Vercel Cron Limits
**Проблема:** 10s timeout на Hobby plan  
**Мітігація:**
- Batch по 50 users за раз
- Queue system (v2): Bull + Redis

### Ризик 3: AI Cost Explosion
**Проблема:** 1000 users × $0.01/notification = $10/day  
**Мітігація:**
- Cache повідомлень для users з ідентичними транзитами
- Template messages замість повного AI (80% випадків)

### Ризик 4: Spam Complaints
**Проблема:** Користувачі скаржаться на spam  
**Мітігація:**
- Легка кнопка unsubscribe в settings
- Поступове frequency onboarding (1/день → 3/день)

---

## Success Metrics (30 днів після запуску)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Opt-in rate | >60% | Umami event tracking |
| Push open rate | >40% | OneSignal analytics |
| D7 retention | >35% | Cohort analysis |
| Notification→Premium | >3% | Conversion funnel |
| Complaint rate | <1% | OneSignal feedback |

---

## Альтернативи (не робити зараз)

❌ **SMS notifications:** Дорого, low ROI  
❌ **In-app notifications:** Не працюють коли апп закритий  
❌ **Email digest:** Нижчий open rate ніж push  

✅ **v1: Web Push only** (desktop + mobile browsers)  
⚠️ **v2: Native mobile apps** (якщо буде iOS/Android app)

---

## Questions for Review

1. **OneSignal vs FCM:** Підтвердити вибір OneSignal?
2. **Timezone:** v1 фіксований час (09:00 UTC) чи одразу local time?
3. **AI cost:** Acceptable $0.01/user/day або template messages?
4. **Fallback:** Email notifications як backup чи не треба?
5. **Freemium limit:** 7 днів free достатньо для conversion?

---

**Status:** ⏸️ Ready for review  
**Next step:** Get approval → start implementation
