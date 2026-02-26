# API Contract: Products & Reviews

## GET /api/products

List all active products, optionally filtered by category.

**Query params**:
- `category` (optional): Filter by category — one of: purpose, love, children, health, future, money

**Response (200)**:
```json
{
  "products": [
    {
      "slug": "personality",
      "name_uk": "Гороскоп особистості",
      "category": "purpose",
      "description_uk": "Що ваша доля, призначення, як досягти успіху",
      "price_usd": 29.99,
      "icon": "sparkles",
      "sort_order": 1
    },
    {
      "slug": "love",
      "name_uk": "Любовний гороскоп",
      "category": "love",
      "description_uk": "Де і коли ви зустрінете кохання",
      "price_usd": 24.99,
      "icon": "heart",
      "sort_order": 3
    }
  ]
}
```

## GET /api/reviews?product=personality

List published reviews, optionally filtered by product slug.

**Query params**:
- `product` (optional): Product slug to filter by
- `limit` (optional, default 10): Number of reviews
- `offset` (optional, default 0): Pagination offset

**Response (200)**:
```json
{
  "reviews": [
    {
      "id": "uuid",
      "product_slug": "personality",
      "author_name": "Марія",
      "rating": 5,
      "text_uk": "Дуже точний гороскоп, рекомендую!",
      "created_at": "2026-02-20T10:30:00Z"
    }
  ],
  "total": 42,
  "average_rating": 4.7
}
```

## POST /api/reviews

Submit a new review (authenticated users only).

**Request**:
```json
{
  "product_slug": "personality",
  "author_name": "Олена",
  "rating": 5,
  "text_uk": "Неймовірно точний аналіз моєї натальної карти!"
}
```

**Response (201)**:
```json
{
  "id": "uuid",
  "status": "pending_moderation"
}
```

**Response (401)**:
```json
{
  "error": "Authentication required"
}
```

## GET /api/daily-horoscope

Get daily horoscope for a zodiac sign.

**Query params**:
- `sign` (required): Zodiac sign in English (e.g., "Gemini")
- `date` (optional, default today): Date in "YYYY-MM-DD" format

**Response (200)**:
```json
{
  "sign": "Gemini",
  "sign_uk": "Близнюки",
  "date": "2026-02-26",
  "horoscope": {
    "general_uk": "Сьогодні зірки сприяють...",
    "love_uk": "У сфері кохання...",
    "career_uk": "Кар'єрні перспективи...",
    "health_uk": "Зверніть увагу на..."
  },
  "lucky_number": 7,
  "mood_uk": "Натхнення"
}
```
