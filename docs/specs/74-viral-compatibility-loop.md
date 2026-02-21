# Spec: #74 Viral Loop — Compatibility Check

## Мета
Створити вірусну механіку запрошень через compatibility checks для органічного зростання користувацької бази (K-factor > 1).

## Бізнес-обґрунтування
- **Viral Growth:** Co-Star досяг 5M+ користувачів через compatibility feature
- **K-factor > 1:** Кожен користувач запрошує 2-3+ друзів
- **2x Conversion:** Обидва учасники стають користувачами
- **Emotional Hook:** Стосунки — найсильніша мотивація engagement
- **Zero CAC:** Органічне зростання без рекламного бюджету

## User Flow

### Сценарій 1: Існуючий користувач запрошує
1. Користувач на dashboard натискає "Перевір сумісність з другом"
2. Система генерує unique invite link: `astro-web.com/invite/ABC123`
3. Користувач ділиться посиланням (Telegram/WhatsApp/Instagram)
4. Друг переходить за посиланням → бачить "Олена запрошує вас дізнатись вашу сумісність!"
5. Друг вводить свої дані народження → реєструється
6. Система розраховує synastry chart
7. **Обидва** отримують compatibility звіт з score та insights
8. Beautiful share card: "Ми з Оленою 87% сумісні! 💕"

### Сценарій 2: Новий користувач запрошує назад
1. Новий користувач після реєстрації бачить "Хочете перевірити сумісність з кимось іще?"
2. Цикл повторюється → exponential growth

## Архітектура

### 1. Database Schema (Supabase)

```sql
-- Invites table
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(12) UNIQUE NOT NULL, -- ABC123
  inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invitee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_invites_code ON invites(code);
CREATE INDEX idx_invites_inviter ON invites(inviter_id);

-- Compatibility reports table
CREATE TABLE compatibility_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES invites(id) ON DELETE SET NULL,
  compatibility_score INT CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  synastry_data JSONB NOT NULL, -- aspects, composite positions
  ai_interpretation TEXT,
  share_image_url TEXT, -- generated OG image URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_compatibility_user1 ON compatibility_reports(user1_id);
CREATE INDEX idx_compatibility_user2 ON compatibility_reports(user2_id);
```

### 2. Invite Code Generation

```typescript
// /lib/invites.ts
import { nanoid } from 'nanoid'

export async function createInvite(inviterId: string): Promise<string> {
  const code = nanoid(8).toUpperCase() // ABC12345
  
  await supabase.from('invites').insert({
    code,
    inviter_id: inviterId,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  })
  
  return code
}

export function getInviteUrl(code: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${code}`
}
```

### 3. Synastry Calculation

**Алгоритм:**
1. Отримати натальні чарти обох користувачів
2. Розрахувати aspects між планетами:
   - Conjunction (0°, orb ±8°)
   - Trine (120°, orb ±8°)
   - Square (90°, orb ±7°)
   - Opposition (180°, orb ±8°)
   - Sextile (60°, orb ±6°)
3. Оцінити кожен аспект:
   - Harmonious: Trine, Sextile (+points)
   - Challenging: Square, Opposition (-points)
   - Neutral: Conjunction (context-dependent)

**Особливо важливі аспекти:**
- Venus-Mars (романтика)
- Moon-Moon (емоційна сумісність)
- Sun-Moon (personality fit)
- Mercury-Mercury (комунікація)
- Ascendant-Sun/Moon (перше враження)

**Compatibility Score Formula:**
```typescript
function calculateCompatibilityScore(aspects: Aspect[]): number {
  let score = 50 // baseline
  
  aspects.forEach(aspect => {
    const weight = PLANET_WEIGHTS[aspect.planet1][aspect.planet2] || 1
    
    if (aspect.type === 'trine' || aspect.type === 'sextile') {
      score += weight * 5
    } else if (aspect.type === 'square' || aspect.type === 'opposition') {
      score -= weight * 3
    } else if (aspect.type === 'conjunction') {
      // Context-dependent: Venus-Mars conjunction = positive
      if (isPositiveConjunction(aspect)) score += weight * 4
      else score -= weight * 2
    }
  })
  
  return Math.max(0, Math.min(100, score))
}

const PLANET_WEIGHTS = {
  Venus: { Mars: 3, Moon: 2.5, Sun: 2 },
  Moon: { Moon: 3, Sun: 2.5, Mercury: 2 },
  Sun: { Moon: 2.5, Ascendant: 2 },
  // ...
}
```

### 4. AI Interpretation

**Prompt Template:**
```
Ти — професійний астролог. Створи звіт сумісності для двох людей:

Користувач 1: {{name1}}
{{chart1_summary}}

Користувач 2: {{name2}}
{{chart2_summary}}

Synastry аспекти:
{{aspects_list}}

Compatibility Score: {{score}}%

Створи звіт у форматі:

1. **Загальний висновок** (2-3 речення): Чи сумісні ці люди?

2. **Сильні сторони** (3-4 пункти):
   - Що працює добре у відносинах
   - На чому базується зв'язок

3. **Виклики** (2-3 пункти):
   - Де можуть бути труднощі
   - Що потребує уваги

4. **Поради** (2-3 практичні рекомендації)

Стиль: чесний, підтримуючий, конкретний. Уникай кліше.
Мова: українська.
```

**Приклад output:**
```
💕 Compatibility: 87%

Ви з Оленою маєте високу сумісність! Венера у тригоні до Марса створює природну романтичну хімію, а ваші Місяці в гармонійному секстилі забезпечують емоційне порозуміння.

✨ Сильні сторони:
- Природна романтична притягальність (Венера-Марс тригон)
- Легка комунікація без конфліктів (Меркурій-Меркурій секстиль)
- Підтримка амбіцій один одного (Сонце-Юпітер тригон)

⚠️ Виклики:
- Іноді різні темпи — один хоче діяти швидше (Марс квадрат Сатурн)
- Потрібно давати простір для індивідуальності (Місяць опозиція Уран)

💡 Поради:
- Обговорюйте плани відкрито — ваш Меркурій це любить
- Давайте час на самостійність — це зміцнює стосунки
```

### 5. UI Components

#### A. Dashboard: Invite Button
```tsx
// components/dashboard/CompatibilityInvite.tsx
export function CompatibilityInvite() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  
  async function handleCreateInvite() {
    const code = await createInvite(user.id)
    const url = getInviteUrl(code)
    setInviteUrl(url)
  }
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-2">
        💕 Перевір сумісність з другом
      </h3>
      <p className="text-muted-foreground mb-4">
        Запроси друга або партнера і дізнайтесь вашу астрологічну сумісність
      </p>
      
      {!inviteUrl ? (
        <Button onClick={handleCreateInvite}>
          Створити запрошення
        </Button>
      ) : (
        <div className="space-y-3">
          <Input value={inviteUrl} readOnly />
          <div className="flex gap-2">
            <Button onClick={() => copyToClipboard(inviteUrl)}>
              Копіювати
            </Button>
            <Button onClick={() => shareToTelegram(inviteUrl)}>
              Telegram
            </Button>
            <Button onClick={() => shareToWhatsApp(inviteUrl)}>
              WhatsApp
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
```

#### B. Invite Landing Page
```tsx
// app/invite/[code]/page.tsx
export default async function InvitePage({ params }: { params: { code: string } }) {
  const invite = await getInviteByCode(params.code)
  
  if (!invite || invite.status === 'expired') {
    return <InviteExpired />
  }
  
  const inviter = await getUserById(invite.inviter_id)
  
  return (
    <div className="container max-w-2xl py-12">
      <Card className="p-8 text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          {inviter.name[0]}
        </Avatar>
        
        <h1 className="text-3xl font-bold mb-2">
          {inviter.name} запрошує вас!
        </h1>
        
        <p className="text-xl text-muted-foreground mb-6">
          Дізнайтесь вашу астрологічну сумісність 💫
        </p>
        
        <BirthDataForm 
          onSubmit={(data) => handleInviteAccept(invite.code, data)}
        />
      </Card>
    </div>
  )
}
```

#### C. Compatibility Report Page
```tsx
// app/compatibility/[id]/page.tsx
export default async function CompatibilityReportPage({ params }: { params: { id: string } }) {
  const report = await getCompatibilityReport(params.id)
  
  return (
    <div className="container max-w-4xl py-12">
      <CompatibilityHeader 
        user1={report.user1}
        user2={report.user2}
        score={report.compatibility_score}
      />
      
      <CompatibilityGauge score={report.compatibility_score} />
      
      <AIInterpretation text={report.ai_interpretation} />
      
      <SynastryAspectsTable aspects={report.synastry_data.aspects} />
      
      <ShareCard 
        imageUrl={report.share_image_url}
        text={`Ми з ${report.user2.name} ${report.compatibility_score}% сумісні!`}
      />
    </div>
  )
}
```

### 6. Share Card Generation

**OG Image (Open Graph):**
```tsx
// app/api/og/compatibility/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const user1 = searchParams.get('user1')
  const user2 = searchParams.get('user2')
  const score = searchParams.get('score')
  
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter',
      }}>
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          {score}% 💕
        </div>
        <div style={{ fontSize: 36 }}>
          {user1} & {user2}
        </div>
        <div style={{ fontSize: 24, opacity: 0.8, marginTop: 20 }}>
          Астрологічна сумісність
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

### 7. Analytics Events

```typescript
// Track key events
analytics.track('invite_created', {
  inviter_id: user.id,
  invite_code: code,
})

analytics.track('invite_accepted', {
  inviter_id: invite.inviter_id,
  invitee_id: newUser.id,
  invite_code: code,
})

analytics.track('compatibility_viewed', {
  report_id: report.id,
  score: report.compatibility_score,
})

analytics.track('compatibility_shared', {
  report_id: report.id,
  platform: 'telegram', // or 'whatsapp', 'instagram'
})
```

**K-factor Calculation:**
```sql
-- Weekly K-factor
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(DISTINCT invitee_id) * 1.0 / COUNT(DISTINCT inviter_id) as k_factor
FROM invites
WHERE status = 'accepted'
GROUP BY week
ORDER BY week DESC;
```

## Implementation Plan

### День 1: Backend + Core Logic
- [ ] Supabase tables: invites, compatibility_reports
- [ ] Invite code generation + validation
- [ ] Synastry calculation algorithm
- [ ] Compatibility score formula
- [ ] API routes: POST /api/invites, POST /api/compatibility

### День 2: UI + Polish
- [ ] Dashboard invite button + share modal
- [ ] /invite/[code] landing page
- [ ] /compatibility/[id] report page
- [ ] OG image generation
- [ ] Share buttons (Telegram, WhatsApp, copy)
- [ ] Analytics integration

### День 3 (optional): Advanced
- [ ] Email notifications (invite sent, compatibility ready)
- [ ] Invite history page
- [ ] Composite chart visualization
- [ ] Premium upsell CTAs

## Success Metrics

**Week 1:**
- [ ] 50+ invites створено
- [ ] 30%+ invite acceptance rate
- [ ] 0 critical bugs

**Month 1:**
- [ ] K-factor > 1.0 (exponential growth)
- [ ] 200+ compatibility reports
- [ ] 20%+ share rate

**Month 3:**
- [ ] K-factor > 1.5
- [ ] Invites = #1 acquisition channel
- [ ] 50%+ користувачів створили хоча б 1 invite

## Risks & Mitigations

**Risk 1: Low invite acceptance**
- Mitigation: A/B test landing page copy
- Personalized message from inviter
- Show preview of what they'll get

**Risk 2: Inaccurate synastry**
- Mitigation: Validate проти CafeAstrology
- Expert astrologer review
- User feedback loop

**Risk 3: Privacy concerns**
- Mitigation: Clear consent flow
- Option to make report private
- Delete data on request

**Risk 4: Spam/abuse**
- Mitigation: Rate limit (5 invites/day)
- Expire invites after 30 days
- Report/block mechanism

## Open Questions

1. **Synastry library:** Використовувати існуючу або написати свою?
2. **Privacy:** Чи показувати повний чарт друга чи тільки compatibility?
3. **Monetization:** Free для всіх чи freemium (детальний звіт = Premium)?
4. **Composite chart:** Додати в v1 чи v2?

## Dependencies

- Натальний чарт розрахунок (вже є)
- User authentication (вже є)
- Share functionality (OG images)

## Out of Scope (v2)

- Composite chart (окрема карта відносин)
- Group compatibility (3+ людей)
- Compatibility timeline (як змінюється з часом)
- AI chat про стосунки
- Dating matching algorithm

---

**Готовність до імплементації:** Після approval
**Estimated effort:** 2-3 дні
**Priority:** CRITICAL (viral growth mechanism)
