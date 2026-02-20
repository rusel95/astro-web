# Spec #77: Birthday Forecast — Complete Implementation

**Issue:** [#77](https://github.com/rusel95/astro-web/issues/77)  
**Status:** ✅ Spec Approved  
**Priority:** High (Retention + Viral)  
**Estimated:** 2 дні  
**Model:** gpt-4o-mini (cost optimized)  

---

## 💰 Прайсинг (GPT-4o-mini)

**OpenAI API costs:**
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens

**Per forecast:**
- ~720 input tokens (system + user prompt + chart)
- ~1,060 output tokens (JSON forecast)
- **Cost: ~$0.00075 (< 1 cent)**

**Monthly estimates (with caching):**
- 1,000 users/month: **$0.75**
- 10,000 users/month: **$7.50**
- With 80% cache hit: **$1.50/month** (10k users)

**Email (Resend):**
- Free tier: 3,000 emails/month
- Paid ($20/mo): 50,000 emails/month

**Total monthly cost (< 3,000 users): ~$1-8/month**

---

## 🎯 Мета

Завершити імплементацію Birthday Forecast з автоматичними email triggers та PDF export для максимальної retention та viral reach.

**Бізнес-цілі:**
- Email open rate > 60% (ДН = high intent)
- Share rate > 25% (люди діляться в ДН)
- Annual return rate > 50% (повертаються щороку)
- Lifetime retention touchpoint

---

## ✅ Що вже реалізовано

### 1. UI Components ✅
- **Page:** `/birthday-forecast/[id]` (exists)
- **Birthday banners** на `/chart/[id]` (isBirthdayToday, isBirthdaySoon)
- Красивий дизайн з themes/icons
- **Файл:** `src/app/birthday-forecast/[id]/page.tsx`

### 2. API Generation ✅
- **API route:** `/api/birthday-forecast` (POST)
- AI генерація прогнозу на наступний рік
- Solar Return концепція (базований на natal chart)
- **Файл:** `src/app/api/birthday-forecast/route.ts`

---

## ❌ Що потрібно додати

### 1. Database Schema (Supabase)

**Нова таблиця: `birthday_forecasts`**
```sql
CREATE TABLE birthday_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chart_id TEXT NOT NULL,
  
  -- Birthday info
  birth_date DATE NOT NULL,
  forecast_year INT NOT NULL, -- Рік для якого згенеровано (2026, 2027, etc.)
  age_turning INT NOT NULL, -- Вік який виповнюється
  
  -- Generated forecast (cached)
  forecast_data JSONB NOT NULL, -- BirthdayForecastResponse object
  
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ, -- Коли користувач переглянув
  shared BOOLEAN DEFAULT FALSE, -- Чи поділився користувач
  
  -- Email tracking
  email_sent_at TIMESTAMPTZ, -- Коли відправили email нагадування
  email_opened BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, chart_id, forecast_year)
);

-- Indexes для швидкого пошуку
CREATE INDEX idx_birthday_forecasts_user ON birthday_forecasts(user_id);
CREATE INDEX idx_birthday_forecasts_birth_date ON birthday_forecasts(birth_date);
CREATE INDEX idx_birthday_forecasts_year ON birthday_forecasts(forecast_year);
CREATE INDEX idx_birthday_forecasts_email_sent ON birthday_forecasts(email_sent_at) WHERE email_sent_at IS NOT NULL;
```

**Modify `profiles` table (якщо ще немає):**
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE;
```

---

### 2. Forecast Caching Logic

**File:** `src/lib/birthday-forecast.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import type { BirthdayForecastResponse } from '@/app/api/birthday-forecast/route';

export async function getCachedForecast(
  userId: string,
  chartId: string,
  forecastYear: number
): Promise<BirthdayForecastResponse | null> {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('birthday_forecasts')
    .select('forecast_data')
    .eq('user_id', userId)
    .eq('chart_id', chartId)
    .eq('forecast_year', forecastYear)
    .single();
  
  return data?.forecast_data || null;
}

export async function saveForecast(
  userId: string,
  chartId: string,
  birthDate: string,
  forecastYear: number,
  ageTurning: number,
  forecastData: BirthdayForecastResponse
): Promise<void> {
  const supabase = createClient();
  
  await supabase
    .from('birthday_forecasts')
    .upsert({
      user_id: userId,
      chart_id: chartId,
      birth_date: birthDate,
      forecast_year: forecastYear,
      age_turning: ageTurning,
      forecast_data: forecastData,
      generated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,chart_id,forecast_year'
    });
}

export async function markForecastViewed(
  userId: string,
  chartId: string,
  forecastYear: number
): Promise<void> {
  const supabase = createClient();
  
  await supabase
    .from('birthday_forecasts')
    .update({ viewed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('chart_id', chartId)
    .eq('forecast_year', forecastYear);
}
```

**Integrate into API:**
```typescript
// src/app/api/birthday-forecast/route.ts

// Before AI generation, check cache
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const forecastYear = isBirthdayPassed(birthDate) ? nextYear : currentYear;

const cached = await getCachedForecast(userId, chartId, forecastYear);
if (cached) {
  await markForecastViewed(userId, chartId, forecastYear);
  return NextResponse.json(cached);
}

// Generate with AI...
const forecast = await generateForecast(...);

// Save to cache
await saveForecast(userId, chartId, birthDate, forecastYear, age, forecast);

return NextResponse.json(forecast);
```

---

### 3. Email Notification System

**Dependencies:**
```bash
npm install @react-email/components resend
```

**Environment variables:**
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=astro@astrosvitla.com
CRON_SECRET=<random-string>
```

#### Email Template Component

**File:** `src/emails/BirthdayReminderEmail.tsx`

```tsx
import {
  Body, Button, Container, Head, Heading, Html,
  Preview, Section, Text, Img
} from '@react-email/components';

interface BirthdayReminderEmailProps {
  userName: string;
  ageTurning: number;
  birthDate: string; // "21 березня"
  forecastUrl: string;
}

export default function BirthdayReminderEmail({
  userName,
  ageTurning,
  birthDate,
  forecastUrl
}: BirthdayReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>🎂 Ваш персональний гороскоп на наступний рік готовий!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎂 З наближенням Дня Народження, {userName}!</Heading>
          
          <Text style={text}>
            Через тиждень, <strong>{birthDate}</strong>, ви відзначите свій 
            <strong> {ageTurning}-й день народження</strong>! 🎉
          </Text>
          
          <Text style={text}>
            Ми підготували для вас <strong>персональний астрологічний прогноз 
            на наступний рік життя</strong> на основі вашої натальної карти.
          </Text>
          
          <Section style={highlightBox}>
            <Text style={highlightText}>
              ✨ Дізнайтесь що чекає вас у новому році:<br/>
              💼 Кар'єра та фінанси<br/>
              ❤️ Любов та відносини<br/>
              🧠 Особистісний ріст<br/>
              💰 Матеріальне благополуччя
            </Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Button style={button} href={forecastUrl}>
              Переглянути прогноз на рік 🔮
            </Button>
          </Section>
          
          <Text style={footer}>
            🌙 AstroSvitlana — Ваш особистий астролог
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#0a0414',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#1a0e35',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '12px',
};

const h1 = {
  color: '#a78bfa',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const highlightBox = {
  backgroundColor: '#2d1b4e',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #a78bfa',
  margin: '24px 0',
};

const highlightText = {
  color: '#e2e8f0',
  fontSize: '15px',
  lineHeight: '22px',
  margin: 0,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#a78bfa',
  borderRadius: '8px',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '32px',
};
```

#### Email API Route

**File:** `src/app/api/emails/birthday-reminder/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import BirthdayReminderEmail from '@/emails/BirthdayReminderEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, userName, ageTurning, birthDate, forecastUrl } = await req.json();
    
    // Verify API secret (prevent unauthorized sends)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'AstroSvitlana <astro@astrosvitla.com>',
      to: email,
      subject: `🎂 Скоро ваш день народження! Прогноз на ${ageTurning} рік готовий`,
      react: BirthdayReminderEmail({ userName, ageTurning, birthDate, forecastUrl }),
    });
    
    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error('Birthday email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

---

### 4. Cron Job для Email Triggers

**Option A: Vercel Cron (Recommended)**

**File:** `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/birthday-emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**File:** `src/app/api/cron/birthday-emails/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const supabase = createClient();
  
  // Get users with birthdays in 7 days
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const targetMonth = sevenDaysFromNow.getMonth() + 1;
  const targetDay = sevenDaysFromNow.getDate();
  
  // Query users by birth month/day
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, birth_date')
    .not('birth_date', 'is', null)
    .eq('email_notifications_enabled', true)
    .ilike('birth_date', `%-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`);
  
  if (error || !users) {
    return NextResponse.json({ error: 'DB query failed' }, { status: 500 });
  }
  
  const results = [];
  
  for (const user of users) {
    // Check if email already sent this year
    const currentYear = new Date().getFullYear();
    const { data: existing } = await supabase
      .from('birthday_forecasts')
      .select('id')
      .eq('user_id', user.id)
      .eq('forecast_year', currentYear)
      .not('email_sent_at', 'is', null)
      .single();
    
    if (existing) {
      results.push({ userId: user.id, status: 'already_sent' });
      continue;
    }
    
    // Get user's main chart (assuming stored in localStorage, need chart_id)
    // For now, skip if no chart_id available
    // TODO: Store user's primary chart_id in profiles table
    
    const age = calculateAge(user.birth_date);
    const forecastUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/birthday-forecast/[chart_id]`;
    
    // Send email
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/emails/birthday-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({
        email: user.email,
        userName: user.full_name || 'друже',
        ageTurning: age + 1,
        birthDate: formatBirthDate(user.birth_date),
        forecastUrl,
      }),
    });
    
    if (emailResponse.ok) {
      // Mark email as sent in DB
      await supabase
        .from('birthday_forecasts')
        .update({ email_sent_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('forecast_year', currentYear);
      
      results.push({ userId: user.id, status: 'sent' });
    } else {
      results.push({ userId: user.id, status: 'failed' });
    }
  }
  
  return NextResponse.json({ 
    success: true, 
    processed: results.length,
    results 
  });
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatBirthDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
}
```

---

### 5. PDF Export Feature

**Dependencies:**
```bash
npm install @react-pdf/renderer
```

**File:** `src/components/pdf/BirthdayForecastPDF.tsx`

```tsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { BirthdayForecastResponse } from '@/app/api/birthday-forecast/route';

interface BirthdayForecastPDFProps {
  userName: string;
  age: number;
  forecast: BirthdayForecastResponse;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a78bfa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  text: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  themeBox: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  themeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 4,
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
  },
});

export default function BirthdayForecastPDF({ userName, age, forecast }: BirthdayForecastPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>🎂 Прогноз на {age} рік життя</Text>
          <Text style={styles.subtitle}>{userName}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Вітання</Text>
          <Text style={styles.text}>{forecast.greeting}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Огляд року</Text>
          <Text style={styles.text}>{forecast.year_overview}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ключові теми</Text>
          {forecast.themes.map((theme, idx) => (
            <View key={idx} style={styles.themeBox}>
              <Text style={styles.themeTitle}>{theme.icon} {theme.title}</Text>
              <Text style={styles.text}>{theme.description}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Поради</Text>
          {forecast.advice.map((tip, idx) => (
            <Text key={idx} style={styles.text}>• {tip}</Text>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text>🌙 AstroSvitlana — Ваш персональний астролог</Text>
          <Text>astrosvitla.com</Text>
        </View>
      </Page>
    </Document>
  );
}
```

**API Route for PDF generation:**

**File:** `src/app/api/birthday-forecast/pdf/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import BirthdayForecastPDF from '@/components/pdf/BirthdayForecastPDF';

export async function POST(req: NextRequest) {
  try {
    const { userName, age, forecast } = await req.json();
    
    const pdfBuffer = await renderToBuffer(
      <BirthdayForecastPDF userName={userName} age={age} forecast={forecast} />
    );
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="birthday-forecast-${age}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
```

**UI Button on forecast page:**

```tsx
// Add to src/app/birthday-forecast/[id]/page.tsx

const handleDownloadPDF = async () => {
  try {
    const response = await fetch('/api/birthday-forecast/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: storedChart?.input.name || 'Друг',
        age: nextAge,
        forecast: forecast,
      }),
    });
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `birthday-forecast-${nextAge}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF download error:', error);
  }
};

// Add button in UI
<button onClick={handleDownloadPDF} className="btn-secondary">
  <Download size={18} />
  Завантажити PDF
</button>
```

---

## 📋 Implementation Checklist

### Day 1: Database + Caching
- [ ] Create Supabase table: `birthday_forecasts`
- [ ] Create helper functions in `src/lib/birthday-forecast.ts`
- [ ] Integrate caching into `/api/birthday-forecast` route
- [ ] Add `viewed_at` tracking on page load
- [ ] Test cache hit/miss scenarios

### Day 2: Email System
- [ ] Install dependencies: `resend`, `@react-email/components`
- [ ] Create email template: `BirthdayReminderEmail.tsx`
- [ ] Create email send API: `/api/emails/birthday-reminder`
- [ ] Create cron job: `/api/cron/birthday-emails`
- [ ] Configure `vercel.json` with cron schedule
- [ ] Set environment variables (RESEND_API_KEY, CRON_SECRET)
- [ ] Test email sending manually
- [ ] Deploy and verify cron execution

### Day 2 (cont): PDF Export
- [ ] Install `@react-pdf/renderer`
- [ ] Create PDF template: `BirthdayForecastPDF.tsx`
- [ ] Create PDF API route: `/api/birthday-forecast/pdf`
- [ ] Add download button to forecast page
- [ ] Test PDF generation and download
- [ ] Style improvements

---

## 🧪 Testing Scenarios

### Caching
1. ✅ First visit: generate forecast, save to DB
2. ✅ Second visit same year: load from cache (instant)
3. ✅ Next year: generate new forecast for new year
4. ✅ Mark as viewed on page load

### Email System
1. ✅ Cron runs daily at 9 AM UTC
2. ✅ Finds users with birthdays in 7 days
3. ✅ Sends email with forecast link
4. ✅ Doesn't send duplicate emails (check `email_sent_at`)
5. ✅ User can opt-out (`email_notifications_enabled = false`)

### PDF Export
1. ✅ Download button generates PDF
2. ✅ PDF includes all forecast sections
3. ✅ Proper formatting and styling
4. ✅ File name includes age

---

## 📊 Success Metrics

**Track in PostHog:**
- `birthday_forecast_viewed` (daily)
- `birthday_forecast_shared` (viral)
- `birthday_forecast_pdf_downloaded`
- `birthday_email_sent` (cron)
- `birthday_email_opened` (via tracking pixel, optional)

**KPIs:**
- Email open rate > 60%
- Forecast view rate (of emailed users) > 80%
- Share rate > 25%
- Annual return rate > 50%

---

## 🚨 Edge Cases

1. **User has no email in profile:**
   - Skip in cron, log warning

2. **Birthday today (not 7 days before):**
   - Show banner immediately on dashboard
   - Email already sent 7 days ago

3. **User creates chart after their birthday:**
   - Generate forecast for next year immediately

4. **Leap year birthdays (Feb 29):**
   - Handle gracefully: Feb 28 or Mar 1 on non-leap years

5. **Multiple charts for same user:**
   - Send email only once (primary chart)
   - TODO: Add `primary_chart_id` to profiles

---

## ✅ Ready for Implementation?

**Review checklist:**
- [ ] Database schema approved
- [ ] Email template design approved
- [ ] Cron schedule confirmed (9 AM daily)
- [ ] PDF layout approved
- [ ] Resend account set up
- [ ] Environment variables documented

**After approval:** Add label `spec-approved` to issue #77

---

**Questions? Discuss in issue comments.**
