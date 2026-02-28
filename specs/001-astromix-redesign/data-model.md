# Data Model: Zorya Platform Redesign

**Branch**: `001-astromix-redesign` | **Date**: 2026-02-26

## Existing Entities (preserved)

### charts (existing — no changes)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK → auth.users) | Nullable for anonymous |
| name | TEXT | Person's name |
| birth_date | TEXT | "YYYY-MM-DD" |
| birth_time | TEXT | "HH:mm" |
| city | TEXT | Birth city |
| country_code | TEXT | ISO country code |
| latitude | DECIMAL | |
| longitude | DECIMAL | |
| gender | TEXT | "male" / "female" |
| chart_data | JSONB | NatalChart object |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### profiles (existing — extended)
| Field | Type | Notes |
|-------|------|-------|
| ... | ... | Existing fields preserved |
| email_subscribed | BOOLEAN | NEW — newsletter opt-in |
| quiz_completed | BOOLEAN | NEW — has completed quiz |
| quiz_completed_at | TIMESTAMPTZ | NEW — when quiz was completed |

## New Entities

### products
Catalog of purchasable horoscope types. 16 products across 6 categories.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID (PK) | DEFAULT gen_random_uuid() | |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier, e.g. "personality" |
| name_uk | TEXT | NOT NULL | Ukrainian product name |
| category | TEXT | NOT NULL | One of: purpose, love, children, health, future, money |
| description_uk | TEXT | | Short description in Ukrainian |
| value_props_uk | JSONB | | Array of value proposition strings |
| price_usd | DECIMAL(10,2) | | Display price (no payment processing yet) |
| is_active | BOOLEAN | DEFAULT true | Whether product is visible |
| sort_order | INTEGER | | Display ordering within category |
| icon | TEXT | | Emoji or icon identifier for display |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**State transitions**: None — products are static catalog entries managed by admin.

**Seed data**: 16 products pre-defined (personality, talent, love, marriage, love-compatibility, conception, pregnancy, children, health, calendar, monthly, 3-years, finance, career, business, 2026).

### quiz_sessions
Stores completed quiz data for mini-horoscope generation. Not used for analytics (PostHog handles that).

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID (PK) | DEFAULT gen_random_uuid() | |
| session_id | TEXT | NOT NULL | Client-generated session ID |
| user_id | UUID (FK → auth.users) | NULLABLE | Set if user registers after quiz |
| birth_date | DATE | | Step 1 |
| birth_time | TIME | NULLABLE | Step 4 (null if unknown) |
| birth_time_unknown | BOOLEAN | DEFAULT false | Step 4 checkbox |
| birth_city | TEXT | | Step 3 |
| birth_lat | DECIMAL | | Step 3 |
| birth_lng | DECIMAL | | Step 3 |
| country_code | TEXT | | Step 3 |
| name | TEXT | | Step 5 |
| gender | TEXT | | Step 5 — "male" / "female" |
| email | TEXT | | Step 6 |
| zodiac_sign | TEXT | | Calculated at step 2 |
| mini_horoscope_data | JSONB | NULLABLE | Generated mini-horoscope result |
| completed | BOOLEAN | DEFAULT false | Whether all 6 steps completed |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

**State transitions**:
- Created (completed=false) → quiz in progress
- Completed (completed=true) → mini-horoscope generated, data available
- Linked (user_id set) → user registered after quiz

**RLS**: Public insert (anonymous users can create sessions). Select/update by session_id match or user_id match.

### reviews
Customer testimonials for products. Moderated before display.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID (PK) | DEFAULT gen_random_uuid() | |
| user_id | UUID (FK → auth.users) | NULLABLE | Authenticated reviewer |
| product_slug | TEXT | NOT NULL | References product slug |
| author_name | TEXT | NOT NULL | Display name |
| rating | INTEGER | CHECK (1-5) | Star rating |
| text_uk | TEXT | | Review text in Ukrainian |
| is_published | BOOLEAN | DEFAULT false | Admin moderation gate |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**State transitions**: Draft (is_published=false) → Published (is_published=true)

**RLS**: Public read for published reviews. Authenticated insert. No public update/delete.

### email_subscriptions
Newsletter signups from unauthenticated visitors.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID (PK) | DEFAULT gen_random_uuid() | |
| email | TEXT | UNIQUE, NOT NULL | Subscriber email |
| name | TEXT | NULLABLE | Optional name |
| source | TEXT | | Where subscribed: "homepage", "quiz", "product_page" |
| is_active | BOOLEAN | DEFAULT true | Can unsubscribe |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**RLS**: Public insert. No public read/update/delete (admin only).

## Entity Relationships

```
auth.users (Supabase auth)
  │
  ├── 1:N → charts (existing)
  ├── 1:1 → profiles (existing, extended)
  ├── 1:N → quiz_sessions (via user_id, optional)
  └── 1:N → reviews (via user_id, optional)

products (standalone catalog)
  └── referenced by reviews.product_slug

email_subscriptions (standalone, no FK)
quiz_sessions.session_id (client-generated, not FK)
```

## Validation Rules

- **products.slug**: Lowercase alphanumeric + hyphens, 2-50 chars
- **products.category**: ENUM-like CHECK constraint for valid categories
- **quiz_sessions.email**: Valid email format (validated client-side + server-side)
- **quiz_sessions.gender**: Must be "male" or "female"
- **quiz_sessions.zodiac_sign**: Must be one of 12 valid sign names
- **reviews.rating**: Integer 1-5 inclusive
- **reviews.text_uk**: Max 2000 characters
- **email_subscriptions.email**: Valid email format, unique constraint prevents duplicates
