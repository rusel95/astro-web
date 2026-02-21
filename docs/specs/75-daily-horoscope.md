# Spec: #75 Щоденний персоналізований гороскоп

## Мета
Перетворити AstroSvitla з одноразового інструменту в щоденну звичку через персоналізовані гороскопи на основі транзитів.

## Бізнес-обґрунтування
- **Retention:** D7 retention 5% → 40%+ (Co-Star benchmark)
- **Engagement:** Щоденна точка контакту з користувачем
- **Monetization:** Freemium модель (3 дні free → Premium)
- **LTV:** 10x+ зростання при переході на recurring engagement

## Архітектура

### 1. Backend: Розрахунок транзитів (1.5 дня)

**Технології:**
- Swiss Ephemeris API або астрологічна бібліотека (astronomy-engine, astro)
- Cron job о 00:00 UTC щодня

**Алгоритм:**
1. Отримати поточні позиції планет на сьогодні
2. Для кожного активного користувача:
   - Завантажити його натальний чарт
   - Порівняти транзити з натальними позиціями
   - Визначити 3 найважливіші аспекти дня (орбіс ±1°)
3. Зберегти в БД для швидкого доступу

**Структура даних:**
```typescript
interface DailyHoroscope {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  transits: {
    planet: string
    aspect: string // trine, square, opposition, conjunction
    natal_planet: string
    orb: number
    impact_score: number
  }[]
  ai_interpretation: string
  generated_at: timestamp
}
```

**Supabase table:**
```sql
CREATE TABLE daily_horoscopes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  transits JSONB NOT NULL,
  ai_interpretation TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_horoscopes_user_date ON daily_horoscopes(user_id, date DESC);
```

### 2. AI Генерація контенту (1 день)

**OpenAI Prompt Template:**
```
Ти — професійний астролог. Створи персональний гороскоп на сьогодні ({{date}}) для користувача з таким натальним чартом:

Натальні позиції:
{{natal_chart_summary}}

Поточні транзити дня:
{{transit_list}}

Створи гороскоп у форматі:
1. Заголовок (емоджі + коротка фраза, до 50 символів)
2. Огляд дня (2-3 речення, емоційний тон)
3. Конкретні поради (2-3 пункти, практичні дії)
4. Застереження (якщо є складні аспекти)

Стиль: дружній, підтримуючий, конкретний. Уникай загальних фраз.
Мова: українська.
```

**Приклад виходу:**
```
✨ День нових можливостей

Венера у тригоні до вашого натального Юпітера робить сьогодні ідеальним для соціальних зв'язків. Ви природним чином притягуєте людей і можливості. Меркурій у квадратурі до Марса радить обирати слова обережно — легко випалити щось зайве.

💡 Поради дня:
- Ідеальний час для побачення або зустрічі з друзями
- Почніть проект, про який мріяли
- Уникайте гострих дискусій на роботі до вечора

⚠️ Увага: після 18:00 можлива втома — плануйте важливі справи на першу половину дня.
```

### 3. Delivery System (1 день)

**Канали доставки:**

**A. Telegram (пріоритет 1):**
```typescript
// Cron: щодня о 09:00 за місцевим часом
async function sendDailyHoroscopes() {
  const users = await getUsersWithTelegram()
  
  for (const user of users) {
    const localTime = getUserLocalTime(user.timezone)
    if (localTime.hour === 9 && localTime.minute < 15) {
      const horoscope = await getOrGenerateHoroscope(user.id, today)
      
      if (user.subscription === 'free' && user.free_days_used >= 3) {
        await sendTeaserMessage(user, horoscope)
      } else {
        await sendFullHoroscope(user, horoscope)
      }
    }
  }
}
```

**B. Email (fallback):**
- Для користувачів без Telegram
- Beautiful HTML template
- Frequency: щодня або on-demand

**C. In-App (завжди доступно):**
- Розділ "Мій день" на dashboard
- Історія попередніх гороскопів (останні 30 днів)

### 4. Freemium Модель (0.5 дня)

**Free tier:**
- Перші 3 дні: повні гороскопи
- Потім: тізер (перші 2 речення) + "Upgrade для повного прогнозу"

**Premium tier (₴99/міс):**
- Необмежені щоденні гороскопи
- Історія за весь період
- Пріоритетна доставка (о 9:00 sharp)
- Детальні пояснення аспектів

**Тізер приклад:**
```
✨ День нових можливостей

Венера у тригоні до вашого натального Юпітера робить сьогодні ідеальним для соціальних зв'язків...

🔒 [Отримати повний прогноз — Premium]
```

### 5. UI Components (0.5 дня)

**Dashboard: новий розділ "Мій день"**
```tsx
<DailyHoroscope>
  <HoroscopeHeader date={today} emoji="✨" />
  <HoroscopeContent>
    {isPremium ? fullText : teaserText}
  </HoroscopeContent>
  
  {!isPremium && (
    <UpgradeCTA 
      text="Отримати повний прогноз" 
      price="₴99/міс"
    />
  )}
  
  <HoroscopeHistory 
    items={last30Days}
    locked={!isPremium}
  />
</DailyHoroscope>
```

**Navigation:**
- Додати іконку "Сьогодні" в головне меню
- Badge з датою оновлення

## Технічний Stack

**Backend:**
- Next.js API routes для генерації
- Vercel Cron Jobs (або Railway scheduled tasks)
- Supabase для зберігання

**Астрологічні розрахунки:**
- Варіант 1: Swiss Ephemeris API (swe-rs або pyswisseph wrapper)
- Варіант 2: astronomy-engine npm package
- Варіант 3: існуючий astro calculator + розширення

**AI:**
- OpenAI GPT-4 для інтерпретацій
- Fallback: GPT-3.5 для економії
- Cache: одна генерація на день на користувача

**Messaging:**
- Telegram Bot API (вже є?)
- Nodemailer або SendGrid для email

## Implementation Plan

### День 1: Core Backend
- [ ] Таблиця daily_horoscopes в Supabase
- [ ] Функція розрахунку транзитів
- [ ] Алгоритм визначення топ-3 аспектів дня
- [ ] Unit tests для астро-логіки

### День 2: AI + Generation
- [ ] OpenAI integration
- [ ] Prompt engineering та тестування
- [ ] Batch generation для всіх active users
- [ ] Caching strategy

### День 3: Delivery + UI
- [ ] Telegram bot messages
- [ ] Email templates
- [ ] Dashboard UI компонент
- [ ] Freemium logic (3 дні free)
- [ ] Upgrade CTA

### День 4 (опційно): Polish + Analytics
- [ ] Analytics events (view, upgrade_click, share)
- [ ] A/B testing delivery time
- [ ] Error handling та retry logic
- [ ] Documentation

## Success Metrics

**Week 1:**
- [ ] 80%+ users отримують horoscope вчасно
- [ ] 50%+ open rate (Telegram)
- [ ] 0 critical bugs

**Month 1:**
- [ ] D7 retention >30% (baseline: 5%)
- [ ] D30 retention >15%
- [ ] Free→Premium conversion >3%

**Month 3:**
- [ ] D7 retention >40%
- [ ] 100+ Premium subscribers
- [ ] MRR >₴10k

## Risks & Mitigations

**Risk 1: Астрологічні розрахунки неточні**
- Mitigation: Валідація проти Astro.com або CafeAstrology
- Manual QA: порівняти 10 випадкових днів

**Risk 2: AI генерує generic контент**
- Mitigation: Few-shot examples у prompt
- Human review перших 50 гороскопів
- User feedback loop

**Risk 3: Timezone issues**
- Mitigation: Зберігати timezone користувача при реєстрації
- Fallback: UTC+2 (Київ) як default

**Risk 4: Delivery failures**
- Mitigation: Retry queue
- Fallback на email якщо Telegram fails
- Завжди доступно in-app

## Open Questions

1. **Астрологічна бібліотека:** Яку використовувати? (потрібно дослідження)
2. **Timezone detection:** Просити при onboarding чи визначати автоматично?
3. **AI cost:** Скільки коштуватиме генерація для 1000 користувачів/день?
4. **Content moderation:** Чи потрібна ручна перевірка AI-контенту?

## Dependencies

- Issue #78 (Monetization/Freemium) — бажано, але не блокує
- Telegram bot setup (якщо ще немає)
- User timezone field в БД

## Out of Scope (v2)

- Weekly/monthly horoscopes
- Персоналізація за spheres (кар'єра, любов окремо)
- Voice horoscopes (TTS)
- Social sharing beautiful cards
- Customizable delivery time

---

**Готовність до імплементації:** Після approval цього spec
**Estimated effort:** 3-4 дні
**Priority:** HIGH (retention critical)
