# Spec: Daily Push Notifications (#62)

## 🎯 Мета
Додати систему щоденних push-уведомлень з персоналізованими астро-інсайтами на основі поточних транзитів для збільшення retention та engagement.

## 📊 Бізнес-обґрунтування
- **Приклад Co-Star**: мільйонна аудиторія завдяки daily notifications
- **Retention**: користувачі повертаються щодня → D7/D30 retention +40-60%
- **Conversion**: більше touchpoints → вища конверсія у premium
- **Viral effect**: цікаві нотифікації → shares → organic growth

## 🏗️ Технічна архітектура

### 1. Push Service Provider
**Опції:**
- **OneSignal** (рекомендовано)
  - ✅ Free tier: 10K subscribers
  - ✅ Web push + mobile PWA support
  - ✅ Segmentation and scheduling
  - ✅ Analytics built-in
  
- **Firebase Cloud Messaging**
  - ✅ Free
  - ❌ Потрібен більший setup
  - ✅ Нативна інтеграція з Google

**Вибір: OneSignal** (простіша інтеграція, кращий UX)

### 2. Workflow Daily Notifications

```
00:00 UTC → Cron Job запускається
  ↓
Отримати список active users (opted-in to notifications)
  ↓
Для кожного user:
  1. Розрахувати current transits (від astrology-api)
  2. Порівняти з natal chart
  3. Вибрати 1-2 найцікавіших транзити
  4. AI prompt → генерувати short message (50-100 chars)
  5. Зберегти у notification_queue
  ↓
08:00-10:00 local time → Send notifications (batches по timezone)
```

### 3. Database Schema

```sql
-- Таблиця для збереження preferences
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  enabled BOOLEAN DEFAULT false,
  onesignal_player_id TEXT,
  preferred_time TIME DEFAULT '09:00', -- Local time
  timezone TEXT DEFAULT 'Europe/Kyiv',
  frequency TEXT DEFAULT 'daily', -- daily, weekly
  categories JSONB DEFAULT '["transits", "moon_phase", "mercury_rx"]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця для історії відправлених нотифікацій
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  message TEXT,
  transit_data JSONB, -- Зберігаємо які транзити використали
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false
);

-- Index для швидкого отримання users для певного timezone
CREATE INDEX idx_notif_prefs_timezone ON notification_preferences(timezone, preferred_time) 
WHERE enabled = true;
```

### 4. Cron Job Implementation

**Vercel Cron (vercel.json):**
```json
{
  "crons": [{
    "path": "/api/cron/daily-notifications",
    "schedule": "0 * * * *" // Кожну годину (для різних timezones)
  }]
}
```

**Route: `/app/api/cron/daily-notifications/route.ts`**
```typescript
// Псевдокод
export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const currentHour = new Date().getUTCHours();
  
  // Отримати users, для яких зараз 8-10 ранку по їх timezone
  const users = await getEligibleUsers(currentHour);
  
  for (const user of users) {
    try {
      // 1. Отримати natal chart
      const chart = await getUserChart(user.id);
      
      // 2. Розрахувати поточні транзити
      const transits = await client.transits.getCurrent({
        date: new Date().toISOString().split('T')[0],
        natal_planets: chart.planets
      });
      
      // 3. Вибрати найцікавіший транзит
      const topTransit = selectTopTransit(transits, chart);
      
      // 4. Генерувати AI message
      const message = await generateNotificationMessage(topTransit, chart);
      
      // 5. Відправити через OneSignal
      await sendNotification(user.onesignal_player_id, message);
      
      // 6. Зберегти в історію
      await saveNotificationHistory(user.id, message, topTransit);
      
    } catch (error) {
      console.error(`Failed for user ${user.id}:`, error);
      // Continue з наступним user
    }
  }
  
  return Response.json({ success: true, processed: users.length });
}
```

### 5. Transit Selection Logic

**Пріоритети транзитів (від найважливіших):**
1. **Exact aspects (±1°)** до особистих планет (Sun, Moon, Venus, Mars)
2. **Outer planet transits** (Jupiter, Saturn, Uranus, Neptune, Pluto) до angles (ASC, MC)
3. **Mercury Retrograde** periods
4. **Moon phase** (New Moon, Full Moon у natal houses)
5. **Daily Moon transits** до natal planets

**Приклад селектора:**
```typescript
function selectTopTransit(transits: Transit[], chart: NatalChart): Transit {
  // Сортувати транзити за importance score
  const scored = transits.map(t => ({
    transit: t,
    score: calculateImportanceScore(t, chart)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0].transit;
}

function calculateImportanceScore(transit: Transit, chart: NatalChart): number {
  let score = 0;
  
  // Outer planets = більш важливі
  if (['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(transit.planet)) {
    score += 50;
  }
  
  // Aspects до Sun/Moon = дуже важливі
  if (['sun', 'moon'].includes(transit.aspecting_natal_planet)) {
    score += 30;
  }
  
  // Exact aspect (orb < 1°)
  if (transit.orb < 1) {
    score += 20;
  }
  
  // Hard aspects більш "помітні"
  if (['conjunction', 'square', 'opposition'].includes(transit.aspect)) {
    score += 10;
  }
  
  return score;
}
```

### 6. AI Message Generation

**Prompt template:**
```typescript
const prompt = `
Ти - дружній астролог. Створи коротке push-уведомлення (максимум 100 символів) 
про астрологічний транзит для користувача.

Натальна карта:
- Сонце: ${chart.sun.sign} у ${chart.sun.house} домі
- Місяць: ${chart.moon.sign}

Поточний транзит:
- ${transit.planet} ${transit.aspect} натальний ${transit.aspecting_planet}
- Орб: ${transit.orb}°

Стиль: casual, мотивуючий, без жаху. Конкретна порада.

Приклади:
"✨ Венера тригон до твоєї Місяці - ідеальний день для побачення!"
"⚡ Марс квадрат Меркурій - уникай гострих дискусій сьогодні"
"🌙 Місяць у твоєму 10 домі - кар'єрний прорив можливий!"

Створи повідомлення:
`;

const message = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 50
});
```

### 7. OneSignal Integration

**Setup:**
1. Створити акаунт на onesignal.com
2. Додати Web Push configuration
3. Встановити SDK

**Client-side (`components/NotificationPrompt.tsx`):**
```typescript
'use client';

import { useEffect } from 'react';

export function NotificationPrompt() {
  useEffect(() => {
    // Ініціалізувати OneSignal
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(function() {
      window.OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true
      });
      
      // Отримати player ID після subscription
      window.OneSignal.getUserId(function(userId) {
        if (userId) {
          // Зберегти у Supabase
          savePlayerIdToDatabase(userId);
        }
      });
    });
  }, []);
  
  return (
    <button onClick={() => window.OneSignal.showNativePrompt()}>
      🔔 Увімкнути щоденні гороскопи
    </button>
  );
}
```

**Server-side send (`lib/onesignal.ts`):**
```typescript
export async function sendNotification(
  playerId: string, 
  message: { title: string; body: string; url?: string }
) {
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: message.title },
      contents: { en: message.body },
      url: message.url || 'https://astro-web.vercel.app/chart'
    })
  });
  
  return response.json();
}
```

### 8. User Settings UI

**Сторінка `/app/settings/notifications/page.tsx`:**
```tsx
'use client';

export default function NotificationsSettings() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');
  const [categories, setCategories] = useState({
    transits: true,
    moonPhase: true,
    mercuryRx: true
  });
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1>Налаштування сповіщень</h1>
      
      {/* Enable/Disable toggle */}
      <div className="flex items-center justify-between">
        <span>Щоденні гороскопи</span>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>
      
      {/* Time picker */}
      {enabled && (
        <>
          <div>
            <label>Час отримання:</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            />
          </div>
          
          {/* Categories */}
          <div>
            <h3>Типи сповіщень:</h3>
            <Checkbox checked={categories.transits}>
              Транзити планет
            </Checkbox>
            <Checkbox checked={categories.moonPhase}>
              Фази Місяця
            </Checkbox>
            <Checkbox checked={categories.mercuryRx}>
              Ретроградний Меркурій
            </Checkbox>
          </div>
        </>
      )}
      
      <button onClick={savePreferences}>Зберегти</button>
    </div>
  );
}
```

## 📱 User Flow

1. **Onboarding:**
   - Після створення першого чарту → показати prompt "Хочеш щоденні астро-інсайти?"
   - Клік → browser permission prompt
   - Subscribed → зберігаємо player_id у Supabase

2. **Daily notifications:**
   - Користувач отримує push о 9 ранку (або вибраний час)
   - Клік на notification → відкривається сторінка з детальним описом транзиту
   - Tracking: open rate, click rate

3. **Settings:**
   - Управління: увімкнути/вимкнути, змінити час, вибрати типи
   - Можливість пауза на N днів

## 🎨 Notification Templates

### Категорії повідомлень:

**1. Transits:**
- "✨ Венера тригон Юпітер: день удачі та любові!"
- "⚡ Марс опозиція Сатурн: терпіння, не поспішай"

**2. Moon Phase:**
- "🌑 Новий Місяць у твоєму 10 домі: час нових кар'єрних цілей"
- "🌕 Повний Місяць активує стосунки: час відвертих розмов"

**3. Mercury Retrograde:**
- "📱 Mercury Rx почався: бекапи, дабл-чеки, без великих рішень"
- "🎉 Mercury Rx закінчився: можна знову підписувати контракти!"

**4. Special events:**
- "🌟 Твій Saturn Return цього місяця: великі життєві зміни"
- "💫 Твій соларний повернення сьогодні: happy birthday астрологічно!"

## 📈 Метрики успіху

**Короткостроково (30 днів):**
- [ ] Subscription rate: 30%+ користувачів opt-in
- [ ] Open rate: 40%+ відкривають нотифікації
- [ ] Click rate: 15%+ переходять на сайт

**Довгостроково (90 днів):**
- [ ] D7 retention: +25% (з 30% → 55%)
- [ ] D30 retention: +15% (з 15% → 30%)
- [ ] Premium conversion: +10% (більше touchpoints → більше awareness)

**Негативні метрики (моніторити!):**
- Unsubscribe rate < 5% (якщо вище → зменшити frequency або покращити релевантність)
- Notification spam complaints

## 🚨 Edge Cases & Error Handling

1. **User без натального чарту:**
   - Не показувати notification prompt поки немає чарту
   
2. **API astrology-api недоступний:**
   - Fallback на generic повідомлення (Moon phase, загальний гороскоп)
   - Retry logic з exponential backoff
   
3. **OneSignal rate limits:**
   - Batch sending по 1000 users за раз
   - Throttling

4. **Timezone issues:**
   - Використовувати `Intl.DateTimeFormat().resolvedOptions().timeZone`
   - Fallback на browser timezone API

5. **Перенасичення (notification fatigue):**
   - Limit: max 1 notification per day
   - Якщо user не відкривав 7 днів підряд → пауза на тиждень + re-engagement email

## 🔒 Privacy & Compliance

- **GDPR:** Opt-in required, легкий opt-out
- **Data retention:** Notification history - 90 днів, потім видаляти
- **Unsubscribe:** Одним кліком у settings
- **Sensitive data:** НІКОЛИ не включати повне ім'я/email у notification body

## 📦 Deliverables

### Phase 1 (День 1): Infrastructure
- [ ] OneSignal акаунт setup + API keys
- [ ] Database migrations (notification_preferences, notification_history)
- [ ] Client-side OneSignal SDK integration
- [ ] Notification prompt component

### Phase 2 (День 2): Cron Job
- [ ] `/api/cron/daily-notifications` route
- [ ] Transit selection logic
- [ ] AI message generation
- [ ] Sending через OneSignal API
- [ ] Testing з 5-10 test users

### Phase 3 (День 3): UI & Optimization
- [ ] Settings page для notification preferences
- [ ] Analytics dashboard (open/click rates)
- [ ] A/B тестування різних message templates
- [ ] Документація

## 🧪 Testing Plan

1. **Manual testing:**
   - Subscribe → trigger cron manually → перевірити notification
   - Різні timezones
   - Різні типи транзитів

2. **Load testing:**
   - Симулювати 1000+ users у cron job
   - Перевірити rate limits

3. **A/B testing:**
   - Template A vs B (casual vs formal tone)
   - Time: 8AM vs 9AM vs 10AM

## 🚀 Rollout Plan

**Week 1:** Beta з 100 users
- Invite existing users to opt-in
- Gather feedback

**Week 2:** Gradual rollout
- 10% → 25% → 50% → 100%
- Моніторити metrics

**Week 3:** Full launch
- Announce у Telegram channel
- Email blast до всієї бази

## 📚 References

- [OneSignal Web Push Guide](https://documentation.onesignal.com/docs/web-push-quickstart)
- [Co-Star notification strategy](https://techcrunch.com/2020/01/21/co-star-astrology-app/) (article)
- [Best practices for push notifications](https://www.braze.com/resources/articles/push-notification-best-practices)

---

**Готовий до review!** 🌟
