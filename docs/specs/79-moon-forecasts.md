# 🌙 #79: Місячні прогнози (Void of Course + Phases)

**PRIORITY: P0 — Must Have**  
**Status:** 🔨 In Progress  
**Assigned:** П'ятниця  
**Started:** 2026-02-22

---

## 🎯 Мета

Додати місячний календар з:
- Void of Course періодами
- Фазами Місяця (New, Full, Quarter)
- Персональними місячними транзитами
- Daily retention через практичну цінність

---

## 💡 Killer Feature Positioning

**Susan Miller Moonlight App = $4.99/міс ТІЛЬКИ за void periods**  
**Ми даємо це безкоштовно + більше**

### Практична цінність:
- «Коли НЕ підписувати договори» → void periods
- «Коли починати нові справи» → new moon
- «Коли завершувати проєкти» → full moon
- «Через який ДІМ проходить Місяць ЗАРАЗ» → персоналізація

---

## 📊 Scope

### Phase 1: Базовий календар (2 дні)
1. Moon Phases API integration
2. Void of Course розрахунок
3. Календарний UI
4. Персоналізація по домах

### Phase 2: Рекомендації (1 день)
5. AI-generated daily recommendations
6. Push notifications (optional)

---

## 🔧 Technical Design

### API Endpoints

**Існуючий API:** `https://api.astrology-api.io/api/v3`

#### 1. Moon Phases
```bash
POST /moon/phases
{
  "start_date": "2026-02-22",
  "end_date": "2026-03-22",
  "timezone": "Europe/Kiev"
}

Response:
{
  "phases": [
    {
      "date": "2026-02-24T12:30:00Z",
      "phase": "new_moon",
      "illumination": 0.02,
      "zodiac_sign": "Pisces",
      "degree": 5.23
    },
    {
      "date": "2026-03-03T18:45:00Z",
      "phase": "first_quarter",
      "illumination": 0.50,
      "zodiac_sign": "Gemini",
      "degree": 12.45
    },
    ...
  ]
}
```

#### 2. Void of Course Periods
```bash
POST /moon/void-of-course
{
  "start_date": "2026-02-22",
  "end_date": "2026-03-22",
  "timezone": "Europe/Kiev"
}

Response:
{
  "void_periods": [
    {
      "start": "2026-02-22T14:30:00Z",
      "end": "2026-02-22T18:15:00Z",
      "last_aspect": {
        "planet": "Mars",
        "type": "square",
        "time": "2026-02-22T14:30:00Z"
      },
      "sign_ingress": {
        "to_sign": "Taurus",
        "time": "2026-02-22T18:15:00Z"
      }
    },
    ...
  ]
}
```

#### 3. Current Moon Position
```bash
POST /moon/current
{
  "date": "2026-02-22T12:00:00Z",
  "latitude": 49.8397,
  "longitude": 24.0297,
  "birth_data": { ... }  // для персоналізації по домах
}

Response:
{
  "longitude": 45.23,
  "sign": "Aries",
  "house": 3,  // у ВАШОМУ натальному чарті
  "phase": "waxing_crescent",
  "illumination": 0.15,
  "is_void": false,
  "next_void": {
    "start": "2026-02-22T14:30:00Z",
    "end": "2026-02-22T18:15:00Z"
  }
}
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   └── moon/
│   │       ├── phases/route.ts          // GET /api/moon/phases
│   │       ├── void-of-course/route.ts  // GET /api/moon/void-of-course
│   │       └── current/route.ts         // GET /api/moon/current
│   └── moon/
│       └── page.tsx                     // /moon — Місячний календар
├── components/
│   └── moon/
│       ├── MoonCalendar.tsx            // Головний календар
│       ├── MoonPhaseCard.tsx           // Картка фази
│       ├── VoidPeriodAlert.tsx         // Попередження про void
│       ├── MoonTransitCard.tsx         // Поточна позиція Місяця
│       └── DailyRecommendations.tsx    // AI рекомендації
├── lib/
│   └── moon/
│       ├── api-client.ts               // Fetch moon data
│       ├── calculations.ts             // Void/phase logic
│       └── recommendations.ts          // AI prompts
└── types/
    └── moon.ts                          // TypeScript types
```

---

## 🎨 UI Components

### 1. Moon Calendar View (`/moon`)

```tsx
// src/app/moon/page.tsx
import { MoonCalendar } from '@/components/moon/MoonCalendar';
import { VoidPeriodAlert } from '@/components/moon/VoidPeriodAlert';
import { MoonTransitCard } from '@/components/moon/MoonTransitCard';

export default async function MoonPage() {
  const currentMoon = await fetch('/api/moon/current').then(r => r.json());
  const phases = await fetch('/api/moon/phases').then(r => r.json());
  const voidPeriods = await fetch('/api/moon/void-of-course').then(r => r.json());

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">🌙 Місячний Календар</h1>
      
      {/* Поточний стан */}
      <MoonTransitCard moon={currentMoon} />
      
      {/* Void warning якщо активний */}
      {currentMoon.is_void && (
        <VoidPeriodAlert period={currentMoon.next_void} />
      )}
      
      {/* Календар */}
      <MoonCalendar 
        phases={phases} 
        voidPeriods={voidPeriods}
        userChart={userChart}
      />
    </div>
  );
}
```

### 2. Moon Calendar Component

```tsx
// src/components/moon/MoonCalendar.tsx
'use client';

import { Calendar } from '@/components/ui/calendar';
import { MoonPhase, VoidPeriod } from '@/types/moon';

export function MoonCalendar({ 
  phases, 
  voidPeriods,
  userChart 
}: {
  phases: MoonPhase[];
  voidPeriods: VoidPeriod[];
  userChart?: NatalChart;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Календар з маркерами */}
      <div className="lg:col-span-2">
        <Calendar
          mode="multiple"
          selected={phases.map(p => new Date(p.date))}
          modifiers={{
            newMoon: phases.filter(p => p.phase === 'new_moon').map(p => new Date(p.date)),
            fullMoon: phases.filter(p => p.phase === 'full_moon').map(p => new Date(p.date)),
            voidPeriod: voidPeriods.map(v => new Date(v.start)),
          }}
          modifiersStyles={{
            newMoon: { backgroundColor: '#1a1a2e', color: 'white' },
            fullMoon: { backgroundColor: '#fbbf24', color: 'black' },
            voidPeriod: { border: '2px dashed #ef4444' },
          }}
        />
      </div>
      
      {/* Легенда */}
      <div className="space-y-4">
        <h3 className="font-semibold">Легенда</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded-full" />
            <span>Новий Місяць — початок циклу</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full" />
            <span>Повний Місяць — кульмінація</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-red-500 border-dashed rounded-full" />
            <span className="text-red-500">Void of Course — не починати важливе</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Void Period Alert

```tsx
// src/components/moon/VoidPeriodAlert.tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function VoidPeriodAlert({ period }: { period: VoidPeriod }) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Місяць зараз Void of Course</strong> до {formatTime(period.end)}
        <br />
        Не рекомендується: підписувати договори, починати нові справи, приймати важливі рішення.
      </AlertDescription>
    </Alert>
  );
}
```

### 4. Moon Transit Card

```tsx
// src/components/moon/MoonTransitCard.tsx
export function MoonTransitCard({ moon }: { moon: CurrentMoon }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🌙 Місяць зараз</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Знак</p>
            <p className="text-2xl font-bold">{moon.sign}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Фаза</p>
            <p className="text-lg">{formatPhase(moon.phase)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">У вашому чарті</p>
            <p className="text-lg">{moon.house} дім</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Освітлення</p>
            <p className="text-lg">{(moon.illumination * 100).toFixed(0)}%</p>
          </div>
        </div>
        
        {/* Персоналізована рекомендація */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            {getHouseRecommendation(moon.house, moon.sign)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getHouseRecommendation(house: number, sign: ZodiacSign): string {
  const recommendations: Record<number, string> = {
    1: `Місяць у вашому 1 домі (${sign}) — час фокусуватись на собі, своєму іміджі та тілі.`,
    2: `Місяць у вашому 2 домі (${sign}) — увага на фінанси, цінності та матеріальну безпеку.`,
    3: `Місяць у вашому 3 домі (${sign}) — активна комунікація, навчання, короткі поїздки.`,
    4: `Місяць у вашому 4 домі (${sign}) — час для дому, родини, емоційної бази.`,
    5: `Місяць у вашому 5 домі (${sign}) — творчість, романтика, розваги та хобі.`,
    6: `Місяць у вашому 6 домі (${sign}) — здоров'я, рутина, робота та служіння.`,
    7: `Місяць у вашому 7 домі (${sign}) — фокус на стосунках, партнерствах та співпраці.`,
    8: `Місяць у вашому 8 домі (${sign}) — глибокі трансформації, інтимність, спільні ресурси.`,
    9: `Місяць у вашому 9 домі (${sign}) — подорожі, філософія, вища освіта та експансія.`,
    10: `Місяць у вашому 10 домі (${sign}) — кар'єра, публічний імідж та досягнення.`,
    11: `Місяць у вашому 11 домі (${sign}) — дружба, спільноти, мрії про майбутнє.`,
    12: `Місяць у вашому 12 домі (${sign}) — уединення, духовність, підсвідомість.`,
  };
  return recommendations[house] || '';
}
```

---

## 🔢 TypeScript Types

```typescript
// src/types/moon.ts

export type MoonPhaseType = 
  | 'new_moon' 
  | 'waxing_crescent' 
  | 'first_quarter' 
  | 'waxing_gibbous'
  | 'full_moon' 
  | 'waning_gibbous' 
  | 'last_quarter' 
  | 'waning_crescent';

export interface MoonPhase {
  date: string;
  phase: MoonPhaseType;
  illumination: number;
  zodiac_sign: ZodiacSign;
  degree: number;
}

export interface VoidPeriod {
  start: string;
  end: string;
  last_aspect: {
    planet: PlanetName;
    type: AspectType;
    time: string;
  };
  sign_ingress: {
    to_sign: ZodiacSign;
    time: string;
  };
}

export interface CurrentMoon {
  longitude: number;
  sign: ZodiacSign;
  house: number;
  phase: MoonPhaseType;
  illumination: number;
  is_void: boolean;
  next_void?: VoidPeriod;
}

export interface MoonCalendarData {
  phases: MoonPhase[];
  void_periods: VoidPeriod[];
  current: CurrentMoon;
}
```

---

## 🎯 Implementation Checklist

### Phase 1: Backend API (Day 1)
- [ ] Create `/api/moon/phases` route
  - [ ] Fetch from Astrology API
  - [ ] Cache for 1 day (phases don't change often)
  - [ ] Return Moon phases for 30-day window
- [ ] Create `/api/moon/void-of-course` route
  - [ ] Calculate void periods
  - [ ] Return for 30-day window
- [ ] Create `/api/moon/current` route
  - [ ] Current Moon position
  - [ ] House position (requires user chart)
  - [ ] Is void check
- [ ] Add error handling + fallbacks

### Phase 2: UI Components (Day 2)
- [ ] `MoonCalendar.tsx` — calendar view with markers
- [ ] `MoonPhaseCard.tsx` — individual phase display
- [ ] `VoidPeriodAlert.tsx` — warning component
- [ ] `MoonTransitCard.tsx` — current position card
- [ ] `/moon` page — assemble all components
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support

### Phase 3: Personalization (Day 2 evening)
- [ ] House recommendations logic
- [ ] AI-generated daily advice (optional)
- [ ] Save user preference (show/hide void warnings)

### Phase 4: Testing
- [ ] Test void period detection
- [ ] Test phase calculations
- [ ] Test UI on mobile
- [ ] Test with/without user chart

---

## 🚀 Deployment

1. **Environment Variables:**
   ```bash
   ASTROLOGY_API_KEY=<real_key>
   ASTROLOGY_API_BASE_URL=https://api.astrology-api.io/api/v3
   ```

2. **Deploy to Vercel:**
   ```bash
   cd /data/workspace/astro-web
   npx vercel --prod --yes --token "$VERCEL_TOKEN"
   ```

3. **Verify:**
   - https://astro-web.vercel.app/moon
   - Check phases render
   - Check void periods show
   - Check current Moon position

---

## 📊 Success Metrics

- [ ] Daily active users on `/moon` page > 20%
- [ ] Time on page > 2 minutes
- [ ] Return rate (D7) > 30%
- [ ] «Void periods saved my contract!» testimonials

---

## 🔄 Future Enhancements

### v1.1: Push Notifications
- Void period starting in 1 hour
- New/Full Moon reminders
- Telegram bot integration

### v1.2: AI Recommendations
- Daily Moon-based advice
- «Today is good for...» suggestions
- Personalized rituals for New/Full Moon

### v1.3: Moon Rituals
- New Moon intentions
- Full Moon release ceremonies
- Community sharing

---

## 📚 References

- Susan Miller Moonlight App
- Astrology API docs: https://api.astrology-api.io/docs
- Void of Course astronomy: https://cafeastrology.com/void-of-course-moon.html

---

**Status:** 🔨 In Progress  
**Next Step:** Implement `/api/moon/phases` endpoint
