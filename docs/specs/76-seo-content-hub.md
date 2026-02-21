# Spec #76: SEO Content Hub — Organic Traffic Machine

**Issue:** [#76](https://github.com/rusel95/astro-web/issues/76)  
**Status:** Draft  
**Priority:** Critical (Acquisition)  
**Estimated:** 5 днів  

---

## 🎯 Мета

Створити базу знань з 50+ SEO-оптимізованих статей українською про астрологію для органічного трафіку з Google.

**Бізнес-цілі:**
- Топ-10 Google за 3-6 місяців для 10+ keywords
- Organic traffic > 1,000/місяць за 6 місяців
- Article → signup conversion > 3%
- CAC = $0 (органічний трафік)
- Blue ocean: якісний UA контент про астрологію

**競争 analysis:**
- CafeAstrology: 70%+ traffic з Google (англ.)
- Українською: майже немає якісного контенту
- Keywords як "Венера в Раку", "5 дім астрологія" — low competition

---

## 📐 Структура проєкту

### URL Structure

```
/blog                           # Landing page всіх статей
/blog/planety                   # Категорія: Планети
/blog/znaky-zodiaku             # Категорія: Знаки
/blog/domy                      # Категорія: Доми
/blog/aspekty                   # Категорія: Аспекти
/blog/transyty                  # Категорія: Транзити

/blog/venera-v-raku             # Стаття
/blog/5-dim-v-natalnij-karti    # Стаття
/blog/tryhon-sonce-misyats      # Стаття
```

### Категорії та кількість статей

1. **Планети в знаках** (120 статей потенційно, початок: 24)
   - 10 планет × 12 знаків = 120 комбінацій
   - Priority: Венера, Марс, Місяць, Меркурій (по 12 кожна = 48)
   - Start: Топ-6 планет по 4 знаки = 24 статті

2. **Доми в натальній карті** (12 статей)
   - Дім 1: "Перший дім — особистість та зовнішність"
   - Дім 2: "Другий дім — фінанси та цінності"
   - ...Дім 12: "Дванадцятий дім — підсвідомість"

3. **Знаки Зодіаку** (12 статей — можливо вже є?)
   - Перевірити чи `/zodiac/[sign]` можна re-use як blog content
   - Якщо ні: створити детальніші статті для блогу

4. **Аспекти** (10 статей)
   - Тригон (trines)
   - Квадрат (squares)
   - Опозиція (oppositions)
   - Секстиль (sextiles)
   - З'єднання (conjunctions)
   - + окремі статті: "Марс квадрат Сатурн", "Венера тригон Юпітер"

5. **Транзити** (4 статті)
   - "Що таке транзити в астрології"
   - "Ретроградний Меркурій: як пережити"
   - "Затемнення та їхній вплив"
   - "Повний та новий місяць"

**Total Phase 1:** 50+ статей

---

## 🏗 Технічна реалізація

### Stack

- **Framework:** Next.js 14 (App Router)
- **Content:** MDX (markdown + React components)
- **Styling:** Tailwind CSS (існуючі стилі)
- **SEO:** next-seo або вбудовані Next.js metadata
- **Search:** Algolia або вбудований client-side search (пізніше)

### File Structure

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx                    # Blog landing (список статей)
│   │   ├── [slug]/
│   │   │   └── page.tsx                # Динамічна стаття
│   │   ├── planety/
│   │   │   └── page.tsx                # Категорія
│   │   ├── znaky-zodiaku/
│   │   │   └── page.tsx
│   │   ├── domy/
│   │   │   └── page.tsx
│   │   ├── aspekty/
│   │   │   └── page.tsx
│   │   └── transyty/
│   │       └── page.tsx
│   └── ...
├── content/
│   └── blog/
│       ├── venera-v-raku.mdx
│       ├── mars-v-levi.mdx
│       ├── 5-dim-v-natalnij-karti.mdx
│       ├── tryhon-sonce-misyats.mdx
│       └── ...
└── lib/
    └── blog.ts                          # Helpers для читання MDX
```

---

## 📝 Content Template (MDX)

**Приклад: `content/blog/venera-v-raku.mdx`**

```mdx
---
title: "Венера в Раку: любов через дбайливість"
description: "Як Венера в знаку Рака впливає на почуття, відносини та естетичні смаки. Докладний астрологічний аналіз."
category: "planety"
keywords: 
  - "Венера в Раку"
  - "астрологія Венера"
  - "натальна карта Венера"
  - "любов астрологія"
author: "AstroSvitlana"
publishedAt: "2026-02-21"
image: "/blog/venera-v-raku-og.jpg"
---

# Венера в Раку: любов через дбайливість

**Венера** в натальній карті відповідає за те, як ми **любимо, чого прагнемо в стосунках** і що приносить нам задоволення. Коли ця планета перебуває в **знаку Рака**, любов стає насиченою емоціями, прив'язаністю та глибоким бажанням піклуватися про близьких.

## Ключові якості Венери в Раку

- 💙 **Емоційна глибина** — почуття щирі, інтимні
- 🏡 **Домашній затишок** — цінують комфорт і сімейне тепло
- 🤗 **Дбайливість** — люблять піклуватися і отримувати турботу
- 🌊 **Інтуїція** — відчувають потреби партнера без слів

## Любов і відносини

Люди з Венерою в Раку шукають **емоційної безпеки** у стосунках. Їм важливо відчувати, що партнер — це "свій" у найглибшому сенсі...

[Content continues with 800-1500 слів]

## Як працювати з цим положенням?

1. **Не бійтеся вразливості** — ваша емоційність є силою
2. **Встановлюйте межі** — дбайливість не означає жертовність
3. **Цінуйте минуле** — але не живіть тільки ним

---

**Хочете дізнатися де Венера у вашій натальній карті?**  
[Розрахувати безкоштовно →](/chart/new)

## Схожі статті

- [Місяць в Раку: емоційний світ](/blog/misyats-v-raku)
- [7 дім в натальній карті: партнерство](/blog/7-dim-v-natalnij-karti)
- [Венера в аспектах з Місяцем](/blog/venera-aspekty-misyats)
```

---

## 🎨 UI Components

### 1. Blog Landing Page (`/blog`)

**Layout:**
- Hero section: "База знань з астрології"
- Search bar (client-side filter)
- Категорії grid (6 карток)
- Featured articles (топ-3)
- Latest articles (список)
- Newsletter signup CTA

**Component:** `src/app/blog/page.tsx`

```tsx
import { getAllArticles } from '@/lib/blog';
import ArticleCard from '@/components/blog/ArticleCard';
import CategoryCard from '@/components/blog/CategoryCard';

export default function BlogPage() {
  const articles = getAllArticles();
  const featured = articles.slice(0, 3);
  const latest = articles.slice(0, 12);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1>🌙 База знань з астрології</h1>
      <p>Глибокі знання про планети, знаки, доми та аспекти</p>
      
      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
        <CategoryCard title="Планети" icon="🪐" href="/blog/planety" />
        <CategoryCard title="Знаки" icon="♈" href="/blog/znaky-zodiaku" />
        <CategoryCard title="Доми" icon="🏠" href="/blog/domy" />
        <CategoryCard title="Аспекти" icon="✨" href="/blog/aspekty" />
        <CategoryCard title="Транзити" icon="🌍" href="/blog/transyty" />
      </div>
      
      {/* Featured */}
      <section>
        <h2>Популярні статті</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(article => (
            <ArticleCard key={article.slug} article={article} featured />
          ))}
        </div>
      </section>
      
      {/* Latest */}
      <section className="mt-12">
        <h2>Останні статті</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <div className="mt-12 text-center glass-card p-8">
        <h3>Розрахуйте свою натальну карту</h3>
        <p>Дізнайтеся де планети у вашому гороскопі</p>
        <a href="/chart/new" className="btn-primary">Почати безкоштовно</a>
      </div>
    </div>
  );
}
```

---

### 2. Article Page (`/blog/[slug]`)

**Layout:**
- Breadcrumbs
- Article header (title, description, metadata)
- MDX content (with custom components)
- Author info
- CTA: "Розрахувати свою карту"
- Related articles (3-4)
- Comments (optional, Phase 2)

**Component:** `src/app/blog/[slug]/page.tsx`

```tsx
import { getArticleBySlug, getAllArticles } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  
  return {
    title: `${article.title} | AstroSvitlana`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['AstroSvitlana'],
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();
  
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <a href="/blog">Блог</a> / <a href={`/blog/${article.category}`}>{article.category}</a> / {article.title}
      </nav>
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-xl text-text-muted">{article.description}</p>
        <div className="flex gap-4 text-sm text-text-muted mt-4">
          <span>📅 {new Date(article.publishedAt).toLocaleDateString('uk-UA')}</span>
          <span>👤 {article.author}</span>
        </div>
      </header>
      
      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={article.content} />
      </div>
      
      {/* CTA */}
      <div className="mt-12 glass-card p-6 text-center">
        <h3>Хочете дізнатися свою натальну карту?</h3>
        <a href="/chart/new" className="btn-primary mt-4">Розрахувати безкоштовно</a>
      </div>
      
      {/* Related articles */}
      {article.relatedSlugs && (
        <section className="mt-12">
          <h3>Схожі статті</h3>
          {/* Render related articles */}
        </section>
      )}
    </article>
  );
}
```

---

### 3. Category Page (`/blog/planety`)

**Layout:**
- Category hero
- Filter/sort controls
- Article grid (all in category)
- Pagination (if > 12)

---

## 🔧 Blog Helpers (`src/lib/blog.ts`)

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  author: string;
  publishedAt: string;
  image: string;
  content: string;
  relatedSlugs?: string[];
}

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(BLOG_DIR);
  
  const articles = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '');
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      return {
        slug,
        ...data,
        content,
      } as Article;
    });
  
  // Sort by publishedAt (newest first)
  return articles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug,
      ...data,
      content,
    } as Article;
  } catch {
    return null;
  }
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(a => a.category === category);
}
```

---

## 📊 SEO Optimization Strategy

### On-Page SEO

1. **Title tags** (50-60 chars)
   - Format: `"[Keyword phrase] — [Secondary keyword] | AstroSvitlana"`
   - Example: `"Венера в Раку: любов через дбайливість | AstroSvitlana"`

2. **Meta descriptions** (150-160 chars)
   - Contain primary keyword
   - Include CTA ("Дізнайтеся більше")
   - Natural Ukrainian language

3. **H1-H6 structure**
   - One H1 per page (title)
   - H2 for main sections
   - H3 for subsections
   - Include keywords naturally

4. **Internal linking**
   - Link to related articles (3-5 per article)
   - Link to chart calculator (CTA в кожній статті)
   - Link to category pages

5. **Image optimization**
   - Alt text з keywords
   - WebP format
   - Lazy loading
   - OG images для social sharing (1200x630)

6. **URL slugs**
   - Short, readable, keyword-rich
   - Ukrainian transliteration: `/venera-v-raku` (not `/venera-v-raku-lyubov`)

### Technical SEO

1. **Sitemap**
   - Generate `/sitemap.xml` з Next.js
   - Include all blog articles
   - Update frequency: weekly

2. **Robots.txt**
   - Allow: `/blog`
   - Allow: `/blog/*`

3. **Schema.org markup**
   - Article schema for каждої статті
   - BreadcrumbList
   - Organization

**Example schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Венера в Раку: любов через дбайливість",
  "description": "Як Венера в знаку Рака впливає на почуття...",
  "author": {
    "@type": "Organization",
    "name": "AstroSvitlana"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AstroSvitlana",
    "logo": {
      "@type": "ImageObject",
      "url": "https://astrosvitla.com/logo.png"
    }
  },
  "datePublished": "2026-02-21",
  "image": "https://astrosvitla.com/blog/venera-v-raku-og.jpg"
}
```

4. **Canonical URLs**
   - Self-referencing canonical на кожній сторінці

5. **Mobile-first**
   - Responsive design (вже є)
   - Fast loading (< 3s LCP)

---

## 📋 Implementation Checklist

### Phase 1: Infrastructure (Day 1)

- [ ] Create `/blog` directory structure
- [ ] Create `content/blog/` folder
- [ ] Install dependencies: `gray-matter`, `next-mdx-remote`
- [ ] Create `src/lib/blog.ts` helpers
- [ ] Create `BlogPage` component (`/blog`)
- [ ] Create `ArticlePage` component (`/blog/[slug]`)
- [ ] Create `CategoryPage` components
- [ ] Test with 2-3 sample articles

### Phase 2: Content Generation (Day 2-3)

**AI-assisted content creation:**

- [ ] Generate 24 "Планета в знаку" articles
  - Венера × 12 знаків
  - Марс × 12 знаків
- [ ] Generate 12 "Дім у натальній карті" articles
- [ ] Generate 10 "Аспекти" articles
- [ ] Generate 4 "Транзити" articles

**AI Prompt template:**

```
Напиши SEO-оптимізовану статтю українською мовою на тему:
"[Title]"

Структура:
1. Вступ (1-2 абзаци)
2. Ключові якості (bullet points)
3. [Main topic] (3-4 абзаци)
4. Як працювати з цим положенням (поради)
5. Висновок

Довжина: 1000-1500 слів
Тон: професійний, але доступний
Включи keywords: [list]
Додай внутрішні посилання на: /chart/new

Формат: MDX з frontmatter.
```

**Manual review:**
- [ ] Review кожної статті на якість
- [ ] Edit AI outputs (grammar, flow, accuracy)
- [ ] Add unique insights (not generic)
- [ ] Ensure Ukrainian sounds natural

### Phase 3: SEO Optimization (Day 4)

- [ ] Add Schema.org markup to ArticlePage
- [ ] Generate OG images для кожної статті (або generic per category)
- [ ] Create `/sitemap.xml` route
- [ ] Update `/robots.txt`
- [ ] Add breadcrumbs to UI
- [ ] Implement internal linking (related articles)
- [ ] Add "Share" buttons (Twitter, Facebook, copy link)

### Phase 4: UI Polish (Day 5)

- [ ] Design CategoryCard component
- [ ] Design ArticleCard component
- [ ] Add search functionality (client-side filter)
- [ ] Newsletter signup form (optional, email collection)
- [ ] Add reading time estimate ("5 хв читання")
- [ ] Responsive design check
- [ ] Accessibility (a11y) check

### Phase 5: Launch

- [ ] Deploy to Vercel
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Share на socials (Twitter, Telegram)
- [ ] Monitor Google Analytics

---

## 🧪 Testing Scenarios

### Content Quality

1. ✅ Each article 1000-1500 слів
2. ✅ Keywords in title, H2, first paragraph
3. ✅ Natural Ukrainian (not translated)
4. ✅ Internal links present
5. ✅ CTA до chart calculator

### SEO

1. ✅ Unique title tags (no duplicates)
2. ✅ Meta descriptions < 160 chars
3. ✅ Images have alt text
4. ✅ Schema.org validates (Google Rich Results Test)
5. ✅ Mobile-friendly (Google Mobile-Friendly Test)
6. ✅ Page speed < 3s (PageSpeed Insights)

### Functionality

1. ✅ `/blog` loads without errors
2. ✅ `/blog/[slug]` renders MDX correctly
3. ✅ Category pages filter correctly
4. ✅ Search works (if implemented)
5. ✅ Related articles display
6. ✅ Breadcrumbs accurate

---

## 📈 Success Metrics (Track in Google Analytics)

**Traffic:**
- Pageviews на /blog/*
- Organic search traffic
- Top landing pages

**Engagement:**
- Avg. time on page > 2 min
- Bounce rate < 60%
- Pages per session > 1.5

**Conversion:**
- `/blog/* → /chart/new` click-through > 5%
- Signup rate від blog traffic > 3%

**SEO:**
- Keywords ranking in top 10 (Google Search Console)
- Impressions growth month-over-month
- Click-through rate from SERP > 3%

---

## 🚀 Future Enhancements (Post-Launch)

1. **More content:**
   - Complete all 120 "Планета в знаку" combinations
   - Add "Знак на куспіді дому" (144 combos)
   - Add celebrity chart analyses

2. **Interactive features:**
   - Comments (Disqus or custom)
   - Rating system (helpful/not helpful)
   - "Save for later" bookmarks

3. **Advanced SEO:**
   - Backlinks outreach
   - Guest posting
   - Content updates (refresh old articles)

4. **Newsletter:**
   - Weekly digest of new articles
   - Collect emails via signup form

5. **Translations:**
   - English version (/en/blog)
   - Russian version (/ru/blog) — optional

---

## ✅ Ready for Implementation?

**Review checklist:**
- [ ] Content strategy approved (50 articles, categories)
- [ ] UI mockups reviewed
- [ ] SEO strategy confirmed
- [ ] AI generation workflow approved
- [ ] Timeline realistic (5 days)

**After approval:** Add label `spec-approved` to issue #76

---

**Questions? Discuss in issue comments.**
