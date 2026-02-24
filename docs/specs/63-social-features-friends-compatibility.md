# Spec #63: Social Features: Friends & Compatibility

## Мета
Додати соціальний компонент для збільшення engagement та organic growth через друзів та аналіз сумісності.

## Бізнес-цінність
- **Viral growth:** Co-Star виріс до топ-10 завдяки social features
- **K-factor > 1:** Кожен користувач запрошує друзів
- **Engagement:** 3-5x збільшення (користувачі повертаються щоб перевірити друзів)
- **Retention:** Соціальний граф утримує користувачів
- **Organic acquisition:** Користувачі = acquisition channel

## User Stories

### US1: Запросити друга
> Як користувач, я хочу запросити друга, щоб порівняти наші натальні карти

**Acceptance Criteria:**
- Кнопка "Додати друга" на dashboard
- Генерується унікальний invite code
- Share: Telegram/Instagram/копіювання лінку
- Друг переходить по лінку → реєстрація → automatic friend connection

### US2: Управління друзями
> Як користувач, я хочу бачити список друзів та контролювати приватність

**Acceptance Criteria:**
- Список всіх друзів з аватарами
- Статус: pending / accepted
- Видалити друга
- Налаштування приватності карти (публічна/друзі/тільки я)

### US3: Переглянути карту друга
> Як користувач, я хочу бачити натальну карту друга та нашу сумісність

**Acceptance Criteria:**
- Сторінка `/friends/[id]`
- Mini-wheel натальної карти друга
- Основні планети/знаки
- Compatibility score (відсоток)
- AI-аналіз сумісності (якщо дозволено приватністю)

## Технічний дизайн

### Database Schema

```sql
-- Таблиця друзів
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
  invited_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  
  -- Унікальна пара (без дублікатів)
  CONSTRAINT unique_friendship UNIQUE(user_id, friend_id),
  -- Не можна додати себе
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id)
);

-- Індекси для швидкого пошуку
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Таблиця invite codes
CREATE TABLE friend_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- короткий код: ABC123
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX(code),
  INDEX(user_id)
);

-- Розширення users таблиці
ALTER TABLE users ADD COLUMN privacy_setting TEXT DEFAULT 'friends'; 
-- 'public' | 'friends' | 'private'
ALTER TABLE users ADD COLUMN username TEXT UNIQUE;
```

### API Routes

#### `/api/friends/invite` - POST
Створення invite code

**Request:**
```json
{}
```

**Response:**
```json
{
  "code": "ABC123",
  "url": "https://astro-web.com/invite/ABC123",
  "expires_at": "2026-03-24T18:51:00Z"
}
```

#### `/api/friends/accept` - POST
Прийняти запрошення

**Request:**
```json
{
  "code": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "friendship_id": "uuid",
  "friend": {
    "id": "uuid",
    "name": "Олена",
    "avatar": "url"
  }
}
```

#### `/api/friends` - GET
Список друзів

**Response:**
```json
{
  "friends": [
    {
      "id": "uuid",
      "name": "Олена",
      "sun_sign": "Gemini",
      "avatar": "url",
      "status": "accepted",
      "compatibility_score": 87,
      "added_at": "2026-02-01T10:00:00Z"
    }
  ],
  "pending": [
    {
      "id": "uuid",
      "name": "Андрій",
      "status": "pending"
    }
  ]
}
```

#### `/api/friends/[id]` - DELETE
Видалити друга

#### `/api/friends/[id]/chart` - GET
Отримати дані карти друга (якщо дозволено privacy)

**Response:**
```json
{
  "allowed": true,
  "chart": {
    "planets": [...],
    "houses": [...],
    "sun_sign": "Gemini",
    "moon_sign": "Pisces"
  },
  "compatibility": {
    "score": 87,
    "summary": "AI-generated text",
    "highlights": ["Venus trine Mars", "Moon conjunct Moon"]
  }
}
```

### Synastry Compatibility Algorithm

```typescript
interface CompatibilityResult {
  score: number // 0-100
  summary: string
  highlights: string[]
  challenges: string[]
  aspects: SynastryAspect[]
}

async function calculateCompatibility(
  chart1: NatalChart,
  chart2: NatalChart
): Promise<CompatibilityResult> {
  // 1. Знайти аспекти між планетами двох карт
  const aspects = findSynastryAspects(chart1, chart2)
  
  // 2. Оцінити кожен аспект
  let score = 0
  const highlights = []
  const challenges = []
  
  for (const aspect of aspects) {
    const weight = getAspectWeight(aspect)
    score += weight
    
    if (weight > 0) {
      highlights.push(formatAspect(aspect))
    } else {
      challenges.push(formatAspect(aspect))
    }
  }
  
  // 3. Нормалізувати до 0-100
  const normalizedScore = normalizeScore(score)
  
  // 4. AI-генерація summary
  const summary = await generateCompatibilitySummary({
    chart1,
    chart2,
    aspects,
    score: normalizedScore
  })
  
  return {
    score: normalizedScore,
    summary,
    highlights,
    challenges,
    aspects
  }
}

// Ваги аспектів
function getAspectWeight(aspect: SynastryAspect): number {
  const weights = {
    // Гармонійні
    'Venus-Mars trine': 15,
    'Sun-Moon conjunction': 12,
    'Venus-Venus conjunction': 10,
    'Moon-Moon trine': 10,
    'Jupiter aspects': 8,
    
    // Виклики
    'Mars-Mars square': -8,
    'Saturn-Sun opposition': -10,
    'Moon-Saturn square': -7
  }
  
  return weights[aspect.type] || 0
}
```

### UI Components

#### Компонент: `FriendsList`
```tsx
// src/components/friends/FriendsList.tsx

interface Friend {
  id: string
  name: string
  sunSign: string
  avatar?: string
  compatibilityScore: number
  status: 'accepted' | 'pending'
}

export function FriendsList({ friends }: { friends: Friend[] }) {
  return (
    <div className="space-y-4">
      {friends.map(friend => (
        <Link 
          key={friend.id} 
          href={`/friends/${friend.id}`}
          className="flex items-center gap-4 p-4 rounded-lg hover:bg-cosmic-700"
        >
          <Avatar src={friend.avatar} fallback={friend.name[0]} />
          
          <div className="flex-1">
            <h3 className="font-semibold">{friend.name}</h3>
            <p className="text-sm text-gray-400">
              {friend.sunSign} ☀️
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {friend.compatibilityScore}%
            </div>
            <p className="text-xs text-gray-400">сумісність</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
```

#### Компонент: `InviteFriendButton`
```tsx
// src/components/friends/InviteFriendButton.tsx

export function InviteFriendButton() {
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  
  const generateInvite = async () => {
    const res = await fetch('/api/friends/invite', { method: 'POST' })
    const data = await res.json()
    setInviteCode(data.code)
  }
  
  const shareInvite = async () => {
    const url = `https://astro-web.com/invite/${inviteCode}`
    const text = `Перевіримо нашу астрологічну сумісність! 🌟`
    
    if (navigator.share) {
      await navigator.share({ title: text, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Посилання скопійовано!')
    }
  }
  
  return (
    <div>
      <Button onClick={generateInvite}>
        Запросити друга
      </Button>
      
      {inviteCode && (
        <div className="mt-4 space-y-2">
          <div className="p-4 bg-cosmic-800 rounded-lg">
            <p className="text-sm mb-2">Ваш код запрошення:</p>
            <code className="text-xl font-mono">{inviteCode}</code>
          </div>
          
          <Button variant="outline" onClick={shareInvite}>
            Поділитися
          </Button>
        </div>
      )}
    </div>
  )
}
```

#### Компонент: `CompatibilityCard`
```tsx
// src/components/friends/CompatibilityCard.tsx

interface Props {
  score: number
  summary: string
  highlights: string[]
  challenges: string[]
}

export function CompatibilityCard({ 
  score, 
  summary, 
  highlights, 
  challenges 
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="text-center">
          <div className="text-6xl font-bold text-primary mb-2">
            {score}%
          </div>
          <p className="text-gray-400">Сумісність</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <p className="text-base leading-relaxed">{summary}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Сильні сторони
          </h3>
          <ul className="space-y-1 text-sm">
            {highlights.map((h, i) => (
              <li key={i} className="text-gray-300">{h}</li>
            ))}
          </ul>
        </div>
        
        {challenges.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-yellow-400">!</span>
              Виклики
            </h3>
            <ul className="space-y-1 text-sm">
              {challenges.map((c, i) => (
                <li key={i} className="text-gray-300">{c}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Pages

#### `/invite/[code]` - Landing page для запрошених
```tsx
// src/app/invite/[code]/page.tsx

export default async function InvitePage({ 
  params 
}: { 
  params: { code: string } 
}) {
  const invite = await getInviteByCode(params.code)
  
  if (!invite || invite.expired) {
    return <InviteExpired />
  }
  
  const inviter = await getUserById(invite.user_id)
  
  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            {inviter.name} запрошує вас! 🌟
          </h1>
          <p className="text-center text-gray-400">
            Створіть свою натальну карту та перевірте сумісність
          </p>
        </CardHeader>
        
        <CardContent>
          <OnboardingForm 
            inviteCode={params.code}
            onComplete={() => router.push(`/friends/${inviter.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

#### `/friends` - Список друзів
```tsx
// src/app/friends/page.tsx

export default async function FriendsPage() {
  const user = await getCurrentUser()
  const friends = await getFriends(user.id)
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мої друзі</h1>
        <InviteFriendButton />
      </div>
      
      {friends.length === 0 ? (
        <EmptyState
          icon="👥"
          title="У вас поки немає друзів"
          description="Запросіть друзів щоб порівняти ваші натальні карти"
        />
      ) : (
        <FriendsList friends={friends} />
      )}
    </div>
  )
}
```

#### `/friends/[id]` - Сторінка друга
```tsx
// src/app/friends/[id]/page.tsx

export default async function FriendProfilePage({
  params
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser()
  const friend = await getFriend(params.id)
  const compatibility = await calculateCompatibility(
    user.chart,
    friend.chart
  )
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Карта друга */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {friend.name}
          </h2>
          <NatalChartWheel 
            chart={friend.chart}
            size="sm"
          />
          <PlanetsTable planets={friend.chart.planets} />
        </div>
        
        {/* Сумісність */}
        <div>
          <CompatibilityCard {...compatibility} />
        </div>
      </div>
    </div>
  )
}
```

#### `/settings/privacy` - Налаштування приватності
```tsx
// src/app/settings/privacy/page.tsx

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState('friends')
  
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-2xl font-bold mb-8">Приватність</h1>
      
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Хто може бачити мою карту?</h2>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <RadioGroup value={privacy} onValueChange={setPrivacy}>
            <div className="flex items-start gap-3">
              <RadioGroupItem value="public" id="public" />
              <div>
                <Label htmlFor="public" className="font-medium">
                  Публічна
                </Label>
                <p className="text-sm text-gray-400">
                  Будь-хто може бачити вашу карту
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <RadioGroupItem value="friends" id="friends" />
              <div>
                <Label htmlFor="friends" className="font-medium">
                  Тільки друзі (рекомендовано)
                </Label>
                <p className="text-sm text-gray-400">
                  Лише ваші друзі бачать повну карту
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <RadioGroupItem value="private" id="private" />
              <div>
                <Label htmlFor="private" className="font-medium">
                  Приватна
                </Label>
                <p className="text-sm text-gray-400">
                  Ніхто не може бачити вашу карту
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <Button onClick={() => savePrivacy(privacy)}>
            Зберегти
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Viral Mechanics

### Share Card Generation
Коли користувач переглядає compatibility результат, генерувати красиву Open Graph картинку для share:

```tsx
// src/app/api/og/compatibility/route.tsx

import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const score = searchParams.get('score')
  const name1 = searchParams.get('name1')
  const name2 = searchParams.get('name2')
  
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{ fontSize: 80, color: '#fff' }}>
          {score}% 💕
        </h1>
        <p style={{ fontSize: 40, color: '#ddd' }}>
          {name1} + {name2}
        </p>
        <p style={{ fontSize: 24, color: '#888' }}>
          Астрологічна сумісність
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

## Analytics Events

```typescript
// Track для розуміння viral loops

analytics.track('friend_invited', {
  user_id: string
  invite_code: string
})

analytics.track('invite_accepted', {
  inviter_id: string
  invitee_id: string
  invite_code: string
})

analytics.track('compatibility_viewed', {
  user_id: string
  friend_id: string
  score: number
})

analytics.track('compatibility_shared', {
  user_id: string
  friend_id: string
  platform: 'telegram' | 'instagram' | 'copy'
})
```

## Success Metrics

- **K-factor:** >1.0 (кожен користувач приводить >1 друга)
- **Invite→signup conversion:** >40%
- **Friend add rate:** >50% користувачів додають хоча б 1 друга
- **Compatibility views:** >3 на користувача
- **Share rate:** >25% користувачів діляться результатами
- **Retention lift:** +50% D7 retention для користувачів з друзями

## Security & Privacy

### Row Level Security (RLS)
```sql
-- Дозволити читання тільки своїх friendships
CREATE POLICY "Users can read own friendships"
ON friendships FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Дозволити створення friendships
CREATE POLICY "Users can create friendships"
ON friendships FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Дозволити видалення тільки своїх friendships
CREATE POLICY "Users can delete own friendships"
ON friendships FOR DELETE
USING (auth.uid() = user_id);
```

### Privacy Checks
```typescript
async function canViewChart(
  viewerId: string, 
  chartOwnerId: string
): Promise<boolean> {
  const owner = await getUser(chartOwnerId)
  
  // Власник завжди бачить
  if (viewerId === chartOwnerId) return true
  
  // Публічна
  if (owner.privacy_setting === 'public') return true
  
  // Приватна
  if (owner.privacy_setting === 'private') return false
  
  // Друзі
  if (owner.privacy_setting === 'friends') {
    return await areFriends(viewerId, chartOwnerId)
  }
  
  return false
}
```

## Implementation Timeline

**День 1: Database + API (Backend)**
- [ ] Створити Supabase migrations (friendships, friend_invites)
- [ ] Додати RLS policies
- [ ] API routes: /api/friends/*, /api/friends/invite
- [ ] Privacy middleware
- [ ] Unit tests для API

**День 2: Compatibility Algorithm + UI Components**
- [ ] Synastry aspects розрахунок
- [ ] Compatibility scoring algorithm
- [ ] AI-генерація compatibility summaries
- [ ] React components: FriendsList, CompatibilityCard, InviteFriendButton
- [ ] Testing compatibility calculations

**День 3: Pages + Viral Mechanics**
- [ ] /friends page
- [ ] /friends/[id] page
- [ ] /invite/[code] landing
- [ ] /settings/privacy
- [ ] OG image generation для shares
- [ ] Analytics events integration
- [ ] E2E testing: invite flow, friend add, compatibility view

## Dependencies

- Supabase: database + RLS
- OpenAI: AI-генерація compatibility summaries
- Swiss Ephemeris: synastry aspects
- Next.js Image: OG image generation
- Analytics: PostHog / Umami

## Risks & Mitigations

**Ризик:** Spam invites  
**Mitigation:** Rate limiting (5 invites/день), expire invites через 7 днів

**Ризик:** Privacy leaks  
**Mitigation:** Строгі RLS policies, privacy checks на кожному endpoint

**Ризик:** Low K-factor  
**Mitigation:** Gamification (badges за кількість друзів), incentives (unlock features)

## Future Enhancements

- Username search (не тільки invite codes)
- Friend groups (Сім'я, Робота, тощо)
- Group compatibility (наскільки сумісна вся група)
- Leaderboards (топ-сумісні пари)
- Friend recommendations (AI suggests compatible people)

---

**Готовий до імплементації:** ✅  
**Потребує review:** @ruslan  
**Estimated effort:** 3 дні (1 розробник)
