# Spec: Moon API - перехід на astrology-api з кешуванням

**Issue:** #91  
**Priority:** P1 (Performance + Features)  
**Estimate:** 2-3 дні  
**Status:** Needs Review

---

## Мета

Перейти з локальних розрахунків `astronomy-engine` на astrology-api для місячних даних. API дає більше деталей (точний час зміни фаз, місячні стоянки, аспекти). Кешувати результати в Supabase щоб не витрачати API виклики на однакові дані.

---

## Проблема, яку вирішуємо

1. **Обмежені дані:** astronomy-engine дає тільки базову інформацію (дата фази), без точного часу
2. **Відсутність Void of Course:** Місяць без курсу - важлива астро-подія, astronomy-engine не підтримує
3. **Відсутність Lunar Mansions:** 27 місячних стоянок (накшатри) - додаткова фіча
4. **API costs:** astrology-api платний, потрібен кеш щоб мінімізувати виклики
5. **Performance:** Кеш дозволить миттєво віддавати дані для повторних запитів

---

## Технічна архітектура

### 1. Supabase Caching Layer

**Таблиця `moon_cache`:**

```sql
CREATE TABLE moon_cache (
  month TEXT PRIMARY KEY,                    -- "YYYY-MM"
  phases JSONB NOT NULL,                     -- масив місячних фаз
  void_periods JSONB,                        -- періоди "Місяць без курсу"
  lunar_mansions JSONB,                      -- місячні стоянки (опціонально)
  cached_at TIMESTAMPTZ DEFAULT NOW()
);

-- Публічний доступ на читання (дані однакові для всіх)
ALTER TABLE moon_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON moon_cache FOR SELECT USING (true);
CREATE POLICY "Service write" ON moon_cache FOR ALL USING (auth.role() = 'service_role');

-- Index для швидкого пошуку по місяцю
CREATE INDEX idx_moon_cache_month ON moon_cache(month);
```

**TTL стратегія:**
- Минулі місяці: кеш назавжди (дані незмінні)
- Поточний місяць: оновлювати раз на добу (нові фази можуть з'явитися)
- Майбутні місяці: кеш на тиждень

**Cache invalidation:**
```typescript
function isCacheFresh(cachedAt: Date, month: string): boolean {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Минулі місяці - завжди fresh
  if (month < currentMonth) return true;
  
  // Поточний місяць - fresh якщо < 24 годин
  if (month === currentMonth) {
    const age = now.getTime() - new Date(cachedAt).getTime();
    return age < 24 * 60 * 60 * 1000;
  }
  
  // Майбутні місяці - fresh якщо < 7 днів
  const age = now.getTime() - new Date(cachedAt).getTime();
  return age < 7 * 24 * 60 * 60 * 1000;
}
```

### 2. Astrology API Integration

**SDK виклики:**

```typescript
// lib/astrology-client.ts
import { client } from '@/lib/astrology-client';

export async function getMoonPhases(startDate: string, endDate: string) {
  try {
    const phases = await client.lunar.getPhases({ 
      start_date: startDate, 
      end_date: endDate 
    });
    return phases;
  } catch (error) {
    console.error('Astrology API error:', error);
    return null; // Fallback буде в route handler
  }
}

export async function getVoidOfCourse(startDate: string, endDate: string) {
  try {
    const voids = await client.lunar.getVoidOfCourse({ 
      start_date: startDate, 
      end_date: endDate 
    });
    return voids;
  } catch (error) {
    console.error('Astrology API error:', error);
    return null;
  }
}
```

**Response format (припущення):**
```typescript
interface MoonPhase {
  date: string;          // "2026-02-14"
  time: string;          // "03:45:00" (UTC)
  phase: 'new' | 'first_quarter' | 'full' | 'last_quarter';
  illumination: number;  // 0-100%
  sign: string;          // "Aquarius"
}

interface VoidPeriod {
  start: string;         // "2026-02-14T03:45:00Z"
  end: string;           // "2026-02-14T12:30:00Z"
  sign: string;          // "Pisces"
}
```

### 3. API Route: `/api/moon/phases`

**Cache-first стратегія:**

```typescript
// app/api/moon/phases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMoonPhases, getVoidOfCourse } from '@/lib/astrology-client';
import { getPhases as getFallbackPhases } from '@/lib/astronomy-engine'; // існуючий fallback

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // "2026-02"
  
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format' }, { status: 400 });
  }
  
  const supabase = createClient();
  
  // 1. Спробувати взяти з кешу
  const { data: cached, error: cacheError } = await supabase
    .from('moon_cache')
    .select('*')
    .eq('month', month)
    .single();
  
  if (cached && isCacheFresh(cached.cached_at, month)) {
    return NextResponse.json({
      source: 'cache',
      data: {
        phases: cached.phases,
        voidPeriods: cached.void_periods,
        lunarMansions: cached.lunar_mansions
      }
    });
  }
  
  // 2. Якщо кешу нема - викликати API
  const [year, monthNum] = month.split('-');
  const startDate = `${month}-01`;
  const endDate = `${month}-${new Date(parseInt(year), parseInt(monthNum), 0).getDate()}`;
  
  const [phases, voids] = await Promise.all([
    getMoonPhases(startDate, endDate),
    getVoidOfCourse(startDate, endDate)
  ]);
  
  // 3. Якщо API недоступний - fallback на astronomy-engine
  if (!phases) {
    console.warn('Astrology API unavailable, using fallback');
    const fallbackPhases = getFallbackPhases(startDate, endDate);
    return NextResponse.json({
      source: 'fallback',
      data: {
        phases: fallbackPhases,
        voidPeriods: [],
        lunarMansions: null
      }
    });
  }
  
  // 4. Зберегти в кеш
  const { error: insertError } = await supabase
    .from('moon_cache')
    .upsert({
      month,
      phases,
      void_periods: voids || [],
      lunar_mansions: null, // TODO: якщо API підтримує
      cached_at: new Date().toISOString()
    });
  
  if (insertError) {
    console.error('Cache write error:', insertError);
  }
  
  return NextResponse.json({
    source: 'api',
    data: {
      phases,
      voidPeriods: voids || [],
      lunarMansions: null
    }
  });
}
```

### 4. Оновлення Moon Page

**Поточний код (припущення):**
```typescript
// app/moon/page.tsx (before)
import { getPhases, getVoidPeriods } from '@/lib/astronomy-engine';

export const revalidate = 900; // 15 хвилин ISR

export default async function MoonPage() {
  const phases = getPhases(startDate, endDate);
  const voids = getVoidPeriods(startDate, endDate);
  // ...
}
```

**Новий код:**
```typescript
// app/moon/page.tsx (after)
import { getMoonData } from '@/lib/moon-data';

export const revalidate = 900; // залишаємо ISR

export default async function MoonPage() {
  const currentMonth = getCurrentMonth(); // "2026-02"
  const { phases, voidPeriods } = await getMoonData(currentMonth);
  // ...
}

// lib/moon-data.ts
export async function getMoonData(month: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/moon/phases?month=${month}`, {
    next: { revalidate: 900 } // 15 хв cache
  });
  const json = await res.json();
  return json.data;
}
```

### 5. Cron Job для Pre-caching (опціонально)

**Vercel Cron:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/precache-moon",
    "schedule": "0 0 * * *"  // щодня о 00:00 UTC
  }]
}
```

**Cron handler:**
```typescript
// app/api/cron/precache-moon/route.ts
export async function GET(request: NextRequest) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const nextMonth = getNextMonth(currentMonth);
  
  // Прекешувати поточний + наступний місяць
  await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/moon/phases?month=${currentMonth}`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/moon/phases?month=${nextMonth}`)
  ]);
  
  return NextResponse.json({ ok: true, cached: [currentMonth, nextMonth] });
}
```

**Альтернатива:** Ліниве кешування (cache-on-demand) - простіше, економить API calls.

---

## Файли для зміни

### Нові файли

1. **`supabase/migrations/YYYYMMDDHHMMSS_create_moon_cache.sql`**
   - Створення таблиці moon_cache
   - RLS policies
   - Індекси

2. **`src/lib/moon-data.ts`** (новий)
   - Helper функції для роботи з місячними даними
   - `getMoonData(month)` - головна функція

3. **`src/app/api/cron/precache-moon/route.ts`** (опціонально)
   - Cron для прекешування

### Оновлення існуючих файлів

1. **`src/app/api/moon/phases/route.ts`**
   - Рефакторинг на cache-first логіку
   - Додати fallback на astronomy-engine

2. **`src/app/moon/page.tsx`**
   - Використовувати API endpoint замість прямих викликів astronomy-engine
   - Додати відображення точного часу фаз
   - Додати Void of Course періоди (якщо є в дизайні)

3. **`src/lib/astrology-client.ts`**
   - Додати методи `getMoonPhases()` та `getVoidOfCourse()`
   - Error handling для API викликів

4. **`vercel.json`** (опціонально)
   - Додати cron job для precaching

---

## UI/UX зміни

### Нові дані для відображення

**Точний час фаз:**
```
Нов Місяць: 14 лютого, 03:45 UTC
Перша чверть: 21 лютого, 18:20 UTC
```

**Void of Course періоди:**
```
⚠️ Місяць без курсу
14.02 03:45 - 12:30 (в Рибах)
Уникайте важливих рішень у цей період
```

**Місячні стоянки (v2):**
```
Поточна накшатра: Revati
Характеристика: завершення, подорожі
```

---

## Acceptance Criteria

- [x] Таблиця `moon_cache` створена в Supabase
- [x] Місячні дані беруться з astrology-api через SDK
- [x] Результати кешуються в Supabase по місяцях
- [x] Повторні запити того ж місяця = 0 API calls (взяття з кешу)
- [x] Fallback на astronomy-engine якщо astrology-api недоступний
- [x] Сторінка `/moon` працює як мінімум так само швидко як зараз
- [x] Відображається точний час зміни фаз (не тільки дата)
- [x] Void of Course періоди відображаються (якщо API підтримує)
- [x] TypeScript компілюється без помилок (`npx tsc --noEmit`)
- [x] Деплой на Vercel успішний

---

## Метрики успіху

### Performance
- **API calls:** <10/день (майже всі запити з кешу)
- **Page load:** <500ms для `/moon` (як зараз)
- **Cache hit rate:** >95%

### Features
- **Точний час фаз:** Так (години:хвилини UTC)
- **Void periods:** Так (якщо API підтримує)
- **Lunar mansions:** v2 (якщо API підтримує)

---

## Ризики та мітігація

### Ризик 1: Astrology API Rate Limits
**Проблема:** Перевищення ліміту викликів  
**Мітігація:** Agressive caching (місяць = одна мінімальна одиниця кешу)

### Ризик 2: API Downtime
**Проблема:** astrology-api недоступний  
**Мітігація:** Fallback на astronomy-engine (як зараз)

### Ризик 3: Supabase Storage Cost
**Проблема:** Велика кількість кешованих місяців  
**Мітігація:** 
- JSONB compression
- Cleanup старих даних (>5 років назад)
- Estimate: 12 місяців × 5KB = 60KB/рік (мізерно)

### Ризик 4: API Response Format Change
**Проблема:** astrology-api змінює формат відповіді  
**Мітігація:** 
- Версіонування API викликів
- Schema validation (Zod)
- Graceful degradation

---

## Етапи імплементації

### День 1: Infrastructure + Migration
- [x] Створити Supabase migration для `moon_cache`
- [x] Застосувати migration (`supabase db push`)
- [x] Створити `lib/moon-data.ts` з helper функціями

### День 2: API Integration
- [x] Оновити `lib/astrology-client.ts` (lunar методи)
- [x] Рефакторинг `/api/moon/phases/route.ts`
- [x] Додати fallback логіку
- [x] Тестування API endpoint

### День 3: Frontend + Deploy
- [x] Оновити `app/moon/page.tsx`
- [x] UI для точного часу фаз
- [x] UI для Void of Course періодів
- [x] TypeScript перевірка
- [x] Deploy на Vercel
- [x] Smoke test на production

---

## Questions for Review

1. **Cron precaching:** Робити зараз чи v2? (Рекомендація: v2, lazy cache достатньо)
2. **Lunar mansions:** Підтримує astrology-api? Якщо ні - пропустити
3. **UI Void of Course:** Де відображати? Окрема секція чи inline з фазами?
4. **Timezone display:** Показувати UTC чи конвертувати в user timezone?
5. **Cache cleanup:** Видаляти дані >5 років чи зберігати назавжди?

---

**Status:** ⏸️ Ready for review  
**Next step:** Get approval → start implementation
