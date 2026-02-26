# API Contract: Quiz Funnel

## POST /api/quiz/session

Save completed quiz data and generate mini-horoscope.

**Request**:
```json
{
  "session_id": "quiz_1709000000_abc1234",
  "birth_date": "1995-06-15",
  "birth_time": "14:30",
  "birth_time_unknown": false,
  "birth_city": "Київ",
  "birth_lat": 50.4501,
  "birth_lng": 30.5234,
  "country_code": "UA",
  "name": "Олена",
  "gender": "female",
  "email": "olena@example.com",
  "zodiac_sign": "Gemini"
}
```

**Response (200)**:
```json
{
  "id": "uuid",
  "session_id": "quiz_1709000000_abc1234",
  "zodiac_sign": "Gemini",
  "zodiac_sign_uk": "Близнюки",
  "completed": true
}
```

**Response (400)**:
```json
{
  "error": "Invalid email format"
}
```

## POST /api/quiz/complete

Generate mini-horoscope from completed quiz session.

**Request**:
```json
{
  "session_id": "quiz_1709000000_abc1234"
}
```

**Response (200)**:
```json
{
  "session_id": "quiz_1709000000_abc1234",
  "mini_horoscope": {
    "natal_chart": {
      "ascendant": 142.5,
      "planets": [...],
      "houses": [...],
      "aspects": [...]
    },
    "key_aspects": [
      {
        "planet1": "Mercury",
        "planet2": "Venus",
        "aspect_type": "Conjunction",
        "degrees": "13° 57' 22\"",
        "interpretation_uk": "У вас дар красномовства..."
      },
      {
        "planet1": "Moon",
        "planet2": "Saturn",
        "aspect_type": "Opposition",
        "degrees": "22° 10' 15\"",
        "interpretation_uk": "Цей аспект пробуджує глибокий внутрішній дискомфорт..."
      }
    ],
    "zodiac_sign_uk": "Близнюки",
    "ascendant_sign_uk": "Діва"
  }
}
```

**Response (404)**:
```json
{
  "error": "Quiz session not found"
}
```

**Response (500)**:
```json
{
  "error": "Failed to generate mini-horoscope"
}
```
