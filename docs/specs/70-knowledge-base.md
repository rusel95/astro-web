# Spec #70: База знань астрологічних статей

## Мета
Створити SEO-оптимізований блог з 10-15 статтями про базові астрологічні концепції українською мовою для залучення органічного трафіку.

## Чому це важливо
- **SEO acquisition:** CafeAstrology отримує 70%+ трафіку з Google через статті
- **Blue ocean:** українською майже немає якісного астро-контенту
- **Trust building:** освічений користувач = лояльний користувач
- **Low CAC:** один раз написав → трафік назавжди

## Технічна реалізація

### 1. Структура URL
```
/blog/[slug]
```

Приклади:
- `/blog/venera-v-raku`
- `/blog/5-dim-v-natalnij-karti`
- `/blog/retrohradnyj-merkurij`

### 2. Файлова структура
```
content/blog/
  venera-v-raku.mdx
  mars-v-ovni.mdx
  5-dim-v-natalnij-karti.mdx
  ...

app/blog/
  page.tsx              // Список всіх статей
  [slug]/
    page.tsx            // Рендеринг окремої статті
```

### 3. MDX формат
Кожна стаття `.mdx` з frontmatter:

```mdx
---
title: "Венера в Раку: любов та емоції"
description: "Детальний розбір планети Венера в знаку Рака - як це впливає на стосунки, любов та емоційну сферу життя"
category: "Планети в знаках"
keywords: ["Венера в Раку", "астрологія", "натальна карта", "любов"]
publishedAt: "2025-02-22"
author: "AstroSvitla"
---

# Венера в Раку

Вступний параграф...

## Характеристики

...

## Вплив на стосунки

...

## Поради

...
```

### 4. Категорії статей
1. **Планети в знаках** (5 статей)
   - Венера в Раку
   - Марс в Овні
   - Меркурій у Близнюках
   - Місяць у Скорпіоні
   - Юпітер у Стрільці

2. **Доми в натальній карті** (5 статей)
   - 5 дім: творчість і любов
   - 7 дім: шлюб і партнерство
   - 10 дім: кар'єра і призначення
   - 1 дім: особистість і зовнішність
   - 4 дім: дім і родина

3. **Базові концепції** (5 статей)
   - Що таке натальна карта
   - Ретроградний Меркурій: міф чи реальність
   - Аспекти в астрології: тригон vs квадрат
   - Транзити планет: як вони впливають
   - Ascendant (висхідний знак): перше враження

### 5. SEO оптимізація

**Meta tags (в frontmatter):**
```typescript
export const metadata = {
  title: article.title,
  description: article.description,
  keywords: article.keywords,
  openGraph: {
    title: article.title,
    description: article.description,
    type: 'article',
    publishedTime: article.publishedAt,
  }
}
```

**Structured data (Schema.org):**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Венера в Раку: любов та емоції",
  "author": {
    "@type": "Organization",
    "name": "AstroSvitla"
  },
  "datePublished": "2025-02-22",
  "description": "...",
  "image": "/og/venera-v-raku.png"
}
```

### 6. UI компоненти

**BlogPostList (app/blog/page.tsx):**
```tsx
- Grid layout статей
- Filter по категоріях
- Search bar
- Pagination (якщо > 12 статей)
```

**BlogPost (app/blog/[slug]/page.tsx):**
```tsx
- Breadcrumbs: Головна > Блог > Категорія > Стаття
- TOC (Table of Contents) з якорними посиланнями
- Related articles (3-4 схожі статті)
- CTA: "Отримайте свою натальну карту →"
- Share buttons: Telegram, Facebook, копіювати лінк
```

### 7. Internal linking
Кожна стаття має CTA внизу:
```mdx
---

## Хочете дізнатись більше про свою карту?

[Створити натальну карту →](/dashboard)

Отримайте персональний AI-аналіз вашої астрологічної карти з урахуванням всіх планет, домів та аспектів.
```

### 8. Генерація контенту

**Підхід:**
1. AI генерація чернетки (GPT-4)
2. Ручна редакція кожної статті
3. Українська мова, розмовний але професійний тон
4. 800-1200 слів на статтю
5. Структуровано: заголовки H2/H3, списки, короткі параграфи

**AI prompt template:**
```
Напиши освітню статтю для блогу про астрологію українською мовою.

Тема: Венера в знаку Рака
Аудиторія: новачки в астрології, 25-45 років
Тон: дружній, доступний, але експертний
Обсяг: 800-1000 слів

Структура:
1. Вступ (що означає Венера в Раку)
2. Характеристики особистості
3. Вплив на любов і стосунки
4. Поради для гармонії
5. Висновок

Використовуй конкретні приклади, уникай астро-жаргону без пояснень.
```

### 9. Sitemap
Оновити `sitemap.xml` автоматично:
```typescript
// app/sitemap.ts
export default function sitemap() {
  const articles = getAllArticles();
  return [
    ...articles.map(article => ({
      url: `https://astro-web.com/blog/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  ]
}
```

## Критерії прийняття

✅ 15 статей у форматі MDX
✅ Blog index page з сортуванням по категоріях
✅ Окремі сторінки для кожної статті
✅ SEO: meta tags + structured data
✅ Internal linking на dashboard/калькулятор
✅ Related articles widget
✅ Responsive design (mobile-first)
✅ Share buttons на кожній статті
✅ Автоматичне оновлення sitemap

## Метрики успіху (через 3-6 місяців)
- Топ-10 Google за 5+ keywords
- Organic traffic > 500/місяць
- Article → signup conversion > 2%
- Avg. time on page > 2 хвилини

## Залежності
- MDX support у Next.js (вже є)
- Markdown processor (`@next/mdx`, `gray-matter`)
- Syntax highlighting (опційно, якщо додаємо приклади коду)

## Timeline
- День 1: Blog інфраструктура + перші 5 статей
- День 2: 10 статей + SEO optimization + тестування

## Питання для review
1. Чи варто додати author profiles (якщо плануємо guest posts)?
2. Чи потрібен коментарі (Disqus/Giscus)?
3. Чи робити Newsletter signup форму внизу кожної статті?
4. OG images: generic чи unique на статтю?
