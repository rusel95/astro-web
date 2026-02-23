# Spec: Місячний Календар (#79)

## Огляд
Місячний календар з void-of-course періодами, фазами Місяця, та персоналізованими щоденними рекомендаціями.

## Бізнес-цілі
- **Benchmark:** Susan Miller Moonlight App = $4.99/міс тільки за void periods
- **Strategy:** Ми даємо це безкоштовно як killer retention feature
- **Daily retention:** Користувачі перевіряють щодня перед важливими рішеннями
- **Практична цінність:** "Коли НЕ підписувати договори"
- **Free tier retention tool:** Утримуємо користувачів на безкоштовному рівні

## Що таке Void of Course Moon?

**Технічне визначення:**
- Період між останнім major аспектом Місяця (0°, 60°, 90°, 120°, 180°) та входом у наступний знак
- Може тривати від кількох хвилин до ~2.5 днів (рідко)
- Зазвичай 10-30 хвилин

**Астрологічне значення:**
- "Порожній хід" — дії можуть бути марними
- Рішення прийняті в цей період можуть не спрацювати як очікувалось
- НЕ час для: підписання договорів, початку проектів, великих покупок, собеседований
- OK для: рутинних справ, відпочинку, творчості, завершення старих справ

## Фази Місяця

### 4 основні фази:
1. **New Moon (Новомісяччя)** — 0°
   - Початки, нові проекти
   - Посів зерна
   
2. **First Quarter (Перша чверть)** — 90°
   - Дія, подолання викликів
   - Ріст, розвиток
   
3. **Full Moon (Повний місяць)** — 180°
   - Кульмінація, реалізація
   - Емоції на піку
   - Завершення циклів
   
4. **Last Quarter (Остання чверть)** — 270°
   - Рефлексія, відпускання
   - Підготовка до нового циклу

### 8 фаз (опційно для v2):
- New Moon
- Waxing Crescent
- First Quarter
- Waxing Gibbous
- Full Moon
- Waning Gibbous
- Last Quarter
- Waning Crescent

## Функціональні вимоги

### 1. Void of Course Розрахунок

**Алгоритм:**
```
Для кожного дня:
1. Отримати позицію Місяця (ephemeris)
2. Знайти всі майбутні аспекти до планет (0°, 60°, 90°, 120°, 180°)
3. Визначити ОСТАННІЙ major аспект перед зміною знаку
4. Період між останнім аспектом та ingress = VoC
```

**Дані:**
- Swiss Ephemeris для точних розрахунків
- Розрахунок на 30 днів вперед (оптимізація)
- Cache в базі (regenerate щотижня)

**Вихідні дані:**
```json
{
  "date": "2026-02-24",
  "voidPeriods": [
    {
      "start": "2026-02-24T14:23:00Z",
      "end": "2026-02-24T18:45:00Z",
      "moonSign": "Aries",
      "nextSign": "Taurus",
      "lastAspect": "Square Mars"
    }
  ]
}
```

### 2. Фази Місяця

**Розрахунок:**
- Кут між Сонцем та Місяцем
- 0° = New Moon
- 90° = First Quarter
- 180° = Full Moon
- 270° = Last Quarter

**Візуалізація:**
- SVG/Canvas іконка поточної фази
- Відсоток освітленості (0-100%)
- Назва фази українською

### 3. Місячні Транзити (персоналізовані)

**Що показувати:**
- "Місяць у [Знак]" — загальна енергія
- "Місяць у вашому [X домі]" — персональний вплив
- Короткий опис (2-3 речення)

**Приклад:**
```
Місяць у Раку
Час для родини, домашнього затишку, емоційних зв'язків.

Місяць у вашому 4 домі
Фокус на дім та сімейні справи. Відмінний час для ремонту чи зміни інтер'єру.
```

### 4. Щоденні Рекомендації

**На основі:**
- Void of Course періодів
- Фази Місяця
- Місячних транзитів до натального чарту

**Приклад:**
```
✅ Добре для:
- Рутинних справ
- Творчості
- Відпочинку

❌ Уникати:
- Підписання договорів (VoC до 18:45)
- Важливих рішень
- Великих покупок
```

## UI/UX Design

### Dashboard Widget
```
┌─────────────────────────────────┐
│ 🌙 Місяць Сьогодні              │
├─────────────────────────────────┤
│ [🌗] Waning Gibbous (68%)       │
│                                 │
│ ⚠️ Void of Course               │
│ 14:23 - 18:45 (4г 22хв)         │
│                                 │
│ Місяць у Овні → ваш 3 дім       │
│ Час для комунікації та навчання │
│                                 │
│ [Детальніше →]                  │
└─────────────────────────────────┘
```

### Календар View

**Monthly Calendar:**
- Кожен день: іконка фази Місяця
- Червоні періоди VoC
- Hover: детальна інформація
- Click: розгорнутий день

**Day Detail:**
```
Понеділок, 24 Лютого 2026

🌗 Waning Gibbous (68%)

⚠️ Void of Course
14:23 - 18:45 UTC

Місяць: Овен → Телець (18:45)
У вашому чарті: 3 дім → 4 дім

Рекомендації:
✅ Добре: рутинні справи, відпочинок
❌ Уникати: важливих рішень до 18:45

Детальніше: [розгорнути]
```

### Push-уведомлення (опційно для v1)

**Типи:**
1. Ранкове: "Доброго ранку! Місяць у [Знак], void period о [час]"
2. Попередження VoC: "За 30 хв VoC період. Завершіть важливі справи"
3. New/Full Moon: "Сьогодні [Повний місяць] у [Знак]!"

## Технічна реалізація

### Stack
- **Frontend:** Next.js + React
- **Ephemeris:** Swiss Ephemeris (npm package `sweph` або API)
- **Storage:** Supabase
- **Caching:** Розрахунок на 30 днів вперед, regenerate щотижня

### Database Schema

```sql
-- Місячні дані (pre-calculated)
CREATE TABLE moon_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  moon_sign TEXT NOT NULL,
  moon_phase TEXT NOT NULL, -- 'new', 'waxing_crescent', 'first_quarter', etc
  moon_phase_angle DECIMAL(5,2) NOT NULL, -- 0-360
  illumination_percent DECIMAL(5,2) NOT NULL, -- 0-100
  void_of_course JSONB, -- {start, end, lastAspect, nextSign}
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_moon_calendar_date ON moon_calendar(date);

-- Персональні місячні транзити (cached per user)
CREATE TABLE moon_transits_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  moon_house INTEGER NOT NULL, -- 1-12
  interpretation TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_moon_transits_user_date ON moon_transits_cache(user_id, date);
```

### API Endpoints

**GET /api/moon/calendar**
```
Query params:
  ?from=2026-02-23&to=2026-03-23
  
Response:
{
  "days": [
    {
      "date": "2026-02-24",
      "moonSign": "Aries",
      "phase": "waning_gibbous",
      "phaseAngle": 245.3,
      "illumination": 68.2,
      "voidOfCourse": {
        "start": "2026-02-24T14:23:00Z",
        "end": "2026-02-24T18:45:00Z",
        "lastAspect": "Square Mars",
        "nextSign": "Taurus"
      }
    }
  ]
}
```

**GET /api/moon/today**
```
Query params:
  ?userId=<uuid> (для персоналізації)
  
Response:
{
  "date": "2026-02-24",
  "moonSign": "Aries",
  "phase": "waning_gibbous",
  "phaseAngle": 245.3,
  "illumination": 68.2,
  "voidOfCourse": {...},
  "personalTransit": {
    "house": 3,
    "interpretation": "Місяць у вашому 3 домі...",
    "recommendations": {
      "good": ["Комунікація", "Навчання", "Короткі поїздки"],
      "avoid": ["Важливі рішення до 18:45"]
    }
  }
}
```

### Розрахунок VoC (Pseudocode)

```javascript
function calculateVoidOfCourse(date) {
  const moon = getMoonPosition(date)
  const planets = getAllPlanetPositions(date)
  const moonIngress = getNextMoonSignChange(date)
  
  // Знайти всі аспекти від поточного моменту до ingress
  const aspects = []
  for (const planet of planets) {
    const aspect = calculateAspect(moon, planet)
    if (isMajorAspect(aspect) && aspect.exactTime < moonIngress) {
      aspects.push(aspect)
    }
  }
  
  // Останній аспект = початок VoC
  const lastAspect = aspects.sort((a, b) => b.exactTime - a.exactTime)[0]
  
  if (!lastAspect) return null
  
  return {
    start: lastAspect.exactTime,
    end: moonIngress,
    lastAspect: lastAspect.name,
    nextSign: moonIngress.sign
  }
}
```

### Кешування та Оптимізація

**Стратегія:**
1. Pre-calculate 30 днів вперед кожного тижня (cron)
2. Store в `moon_calendar` table
3. Frontend читає з cache
4. User-specific transit розрахунок on-demand (або lazy cache)

**Cron Job:**
```javascript
// Щотижня о 00:00 неділі
async function regenerateMoonCalendar() {
  const startDate = new Date()
  const endDate = addDays(startDate, 30)
  
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const moonData = calculateMoonData(date)
    await supabase.from('moon_calendar').upsert({
      date: date.toISOString().split('T')[0],
      ...moonData
    })
  }
}
```

## MVP (v1) Timeline: 2-3 дні

### День 1: Backend + Розрахунки
- ✅ Swiss Ephemeris інтеграція
- ✅ VoC розрахунок алгоритм
- ✅ Moon phase розрахунок
- ✅ Database schema + seed data (30 днів)
- ✅ API endpoints

### День 2: UI/UX
- ✅ Dashboard widget
- ✅ Calendar view (monthly)
- ✅ Day detail page
- ✅ Moon phase SVG icons
- ✅ VoC warning indicators

### День 3: Персоналізація + Polish
- ✅ User-specific house transit розрахунок
- ✅ Recommendations engine
- ✅ AI-generated daily interpretations (опційно)
- ✅ Testing + bug fixes
- ✅ Mobile responsive

## v2 Features (Future)

**Push Notifications:**
- Morning: "Доброго ранку! VoC о 14:23"
- VoC Warning: "За 30 хв VoC період"
- Full Moon alerts

**8 фаз замість 4:**
- Waxing Crescent, Waning Gibbous, etc

**Historical tracking:**
- "Подивіться що було під час минулого Full Moon"

**Email digest:**
- Тижневий огляд місячних подій

**Advanced recommendations:**
- AI аналіз ваших транзитів + місячних циклів

## Метрики успіху

**Launch (перший місяць):**
- Daily active users > 50% from total users
- Page views per user > 3/день
- Time on page > 2 хв

**Retention:**
- D7 retention > 40%
- D30 retention > 20%
- Weekly return rate > 60%

**Engagement:**
- "Додав в закладки" > 30%
- Shares "VoC saved me!" testimonials > 10
- User feedback: "Корисна фіча" > 80%

## Конкурентний аналіз

| Продукт | VoC | Phases | Персоналізація | Ціна |
|---------|-----|--------|----------------|------|
| Susan Miller Moonlight | ✅ | ✅ | ❌ | $4.99/міс |
| Co-Star | ❌ | ✅ (basic) | ✅ | Free |
| Astro.com | ✅ (extended) | ✅ | ✅ | Free + Premium |
| **AstroSvitla** | ✅ | ✅ | ✅ | **Free** |

**Наша перевага:** Все безкоштовно + персоналізація

## Refs & Resources

**Ephemeris:**
- Swiss Ephemeris: https://www.astro.com/swisseph/
- NPM: `sweph` або `ephemeris`

**VoC розрахунки:**
- CafeAstrology VoC calculator
- Susan Miller Moonlight App

**Moon phases:**
- NASA Moon Phase data
- Astro.com Moon calendar

**UI inspiration:**
- Susan Miller Moonlight App (clean, functional)
- Co-Star (minimal, beautiful)

## Legal & Disclaimers

**Disclaimer:**
> "Астрологічні поради надаються для розваги та саморозвитку. Не замінюють професійну юридичну, медичну чи фінансову консультацію."

---
**Created:** 2026-02-23
**Status:** Pending Approval
**Estimate:** 2-3 days
**Priority:** P0 (Must Have)
**Impact:** Daily retention tool, practical value
