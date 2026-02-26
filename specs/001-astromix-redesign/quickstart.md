# Quickstart: Zorya Platform Redesign

**Branch**: `001-astromix-redesign`

## Prerequisites

- Node.js 18+
- npm
- Supabase account (existing project)
- Environment variables set (see CLAUDE.md)

## Setup

```bash
# Switch to feature branch
git checkout 001-astromix-redesign

# Install dependencies
npm install

# Run dev server
npm run dev
```

## New Supabase Tables

Run these in the Supabase SQL editor (or via migration):

```sql
-- Products catalog
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_uk TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('purpose', 'love', 'children', 'health', 'future', 'money')),
  description_uk TEXT,
  value_props_uk JSONB,
  price_usd DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz sessions
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  birth_date DATE,
  birth_time TIME,
  birth_time_unknown BOOLEAN DEFAULT false,
  birth_city TEXT,
  birth_lat DECIMAL,
  birth_lng DECIMAL,
  country_code TEXT,
  name TEXT,
  gender TEXT,
  email TEXT,
  zodiac_sign TEXT,
  mini_horoscope_data JSONB,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text_uk TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email subscriptions
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extend profiles (add columns)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_subscribed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMPTZ;
```

## RLS Policies

```sql
-- Products: public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);

-- Quiz sessions: public insert, read/update by session_id or user_id
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create quiz sessions" ON quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Quiz sessions readable by session_id" ON quiz_sessions FOR SELECT USING (true);

-- Reviews: public read (published only), auth insert
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published reviews are publicly readable" ON reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Email subscriptions: public insert only
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON email_subscriptions FOR INSERT WITH CHECK (true);
```

## Seed Products

```sql
INSERT INTO products (slug, name_uk, category, description_uk, price_usd, sort_order, icon) VALUES
('personality', 'Гороскоп особистості', 'purpose', 'Що ваша доля, призначення, як досягти успіху', 29.99, 1, 'sparkles'),
('talent', 'Звіт талантів', 'purpose', 'Ваші приховані таланти та як їх розкрити', 24.99, 2, 'gem'),
('love', 'Любовний гороскоп', 'love', 'Де і коли ви зустрінете кохання', 24.99, 3, 'heart'),
('marriage', 'Коли я одружуся?', 'love', 'Прогноз щодо шлюбу', 19.99, 4, 'ring'),
('love-compatibility', 'Сумісність кохання', 'love', 'Детальний синастрійний звіт', 24.99, 5, 'heart-handshake'),
('conception', 'Календар зачаття', 'children', 'Найкращі дні для зачаття', 19.99, 6, 'calendar-heart'),
('pregnancy', 'Прогноз вагітності', 'children', 'Астрологічний прогноз вагітності', 19.99, 7, 'baby'),
('children', 'Дитячий гороскоп', 'children', 'Гороскоп для батьків про дитину', 19.99, 8, 'smile'),
('health', 'Звіт здоров''я', 'health', 'Вразливі зони здоров''я за натальною картою', 24.99, 9, 'activity'),
('calendar', 'Персональний календар', 'future', 'Щоденні поради на основі транзитів', 29.99, 10, 'calendar'),
('monthly', 'Прогноз на місяць', 'future', 'Детальний місячний прогноз', 14.99, 11, 'calendar-days'),
('3-years', 'Прогноз на 3 роки', 'future', 'Довгостроковий прогноз', 39.99, 12, 'telescope'),
('finance', 'Фінансовий успіх', 'money', 'Як покращити фінансове становище', 24.99, 13, 'coins'),
('career', 'Кар''єрний гороскоп', 'money', 'Кар''єрне призначення та поради', 24.99, 14, 'briefcase'),
('business', 'Бізнес-гороскоп', 'money', 'Астрологічний бізнес-аналіз', 29.99, 15, 'trending-up'),
('2026', 'Гороскоп на 2026', 'future', 'Річний прогноз', 19.99, 16, 'calendar-range');
```

## Build & Deploy

```bash
# Verify build
npm run build

# Push to deploy (auto-deploys via Vercel)
git push origin 001-astromix-redesign

# Or manual deploy
npx vercel --prod --yes
```

## Key Files to Create First

1. `src/app/(quiz)/layout.tsx` — Quiz layout (light theme, no nav)
2. `src/app/(main)/layout.tsx` — Main layout (move nav/footer here)
3. `src/app/(quiz)/quiz/page.tsx` — Quiz funnel page
4. `src/lib/quiz/reducer.ts` — Quiz state management
5. `src/lib/products/data.ts` — Static product catalog
6. `src/components/landing/HeroSection.tsx` — First landing page section

## Testing

```bash
npm run test              # Existing Playwright tests
npx playwright test --ui  # Interactive UI mode
```
