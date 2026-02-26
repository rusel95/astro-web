# API Contract: Email Subscription

## POST /api/email/subscribe

Subscribe to newsletter from homepage, quiz, or product pages.

**Request**:
```json
{
  "email": "user@example.com",
  "name": "Олена",
  "source": "homepage"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Дякуємо за підписку!"
}
```

**Response (409)** (already subscribed):
```json
{
  "success": true,
  "message": "Ви вже підписані на наші оновлення"
}
```

**Response (400)**:
```json
{
  "error": "Invalid email format"
}
```
