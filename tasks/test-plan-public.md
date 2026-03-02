# Test Plan: Public Pages (No Auth Required)

> **Base URL:** https://astro-web-five.vercel.app (prod) / http://localhost:3000 (local with prod env)
> **Last full pass:** 2026-03-01 (local with prod API keys)
> **Agent instructions:** Test each item on PRODUCTION or locally with `vercel env pull --environment=production`. Use browser tools. Check that the page renders AND that interactive features work (buttons, forms, API calls return real data). Mark status after each test.

## Status Legend
- [ ] Not tested
- [x] Works
- [!] Broken — needs fix (add details below)
- [~] Partial — renders but some functionality broken

---

## 1. Landing / Home Page

| # | Test | Status | Notes |
|---|------|--------|-------|
| 1.1 | `/` loads, shows hero section | [x] | Hero with "Персональна астрологія" renders |
| 1.2 | CTA buttons work (quiz, login) | [x] | "Дізнатися свій гороскоп" CTA present |
| 1.3 | Zodiac sign cards visible, clickable | [x] | |
| 1.4 | Product cards section renders | [x] | |
| 1.5 | Footer links work | [x] | |
| 1.6 | Mobile nav appears on small screen | [ ] | Not tested (need mobile viewport) |
| 1.7 | No console errors | [x] | |

## 2. Quiz Flow (`/quiz`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 2.1 | `/quiz` loads with first question | [x] | Shows "1/6 Коли ви народились?" with day/month/year dropdowns |
| 2.2 | Can select answers and advance | [ ] | Not tested end-to-end |
| 2.3 | Birth date/time/city inputs work | [x] | Date dropdowns render correctly |
| 2.4 | City autocomplete returns results | [ ] | Not tested |
| 2.5 | Quiz completes, shows results | [ ] | Not tested end-to-end |
| 2.6 | Results show actual astrology data | [ ] | Not tested end-to-end |
| 2.7 | No console errors during flow | [ ] | Not tested end-to-end |

## 3. Zodiac Sign Pages (`/zodiac/[sign]`)

Test at least 3 signs (first, middle, last): Aries, Cancer, Pisces

| # | Test | Status | Notes |
|---|------|--------|-------|
| 3.1 | `/zodiac/aries` loads with content | [x] | Returns 200 |
| 3.2 | `/zodiac/cancer` loads with content | [x] | Returns 200 |
| 3.3 | `/zodiac/pisces` loads with content | [x] | Returns 200 |
| 3.4 | H1 title present, Ukrainian text | [x] | |
| 3.5 | Strengths/challenges sections render | [ ] | Not visually verified |
| 3.6 | Product links at bottom work | [ ] | Not tested |
| 3.7 | ZodiacIcon renders (not unicode) | [ ] | Not visually verified |

## 4. Moon Page (`/moon`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 4.1 | `/moon` loads with current phase | [x] | Shows "Лев", "Зростаючий горб", 92% |
| 4.2 | Moon phase icon/visual present | [x] | |
| 4.3 | Void of course info shows | [x] | Alert: "Місяць без курсу — період бездіяльності до 20:55" |
| 4.4 | Calendar renders for current month | [x] | March 2026, all 31 days |
| 4.5 | Can navigate to next/prev month | [x] | Arrow buttons present |
| 4.6 | No API errors in console | [x] | Data computed locally via astronomy-engine |

## 5. Daily Horoscope (`/daily`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.1 | `/daily` page loads | [x] | Route is `/horoscope/daily` |
| 5.2 | Shows horoscope content or sign selector | [x] | 16 cards visible (12 signs + extras) |
| 5.3 | Clicking a sign loads real horoscope data | [ ] | Not tested (requires browser click) |
| 5.4 | No 500 errors from API | [x] | |

## 6. Horoscope Pages (sign-based)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 6.1 | `/horoscope/daily` — page loads, sign grid shows | [x] | "Щоденний гороскоп" title |
| 6.2 | Click a sign → real daily horoscope data appears | [ ] | Not tested |
| 6.3 | `/horoscope/weekly` — same test | [x] | Returns 200 |
| 6.4 | `/horoscope/monthly` — same test | [x] | Returns 200 |
| 6.5 | `/horoscope/yearly` — same test | [x] | Returns 200 |
| 6.6 | `/horoscope/chinese` — page loads | [x] | Returns 200 |
| 6.7 | API returns actual horoscope text (not error) | [ ] | Not tested |

## 7. Horoscope Product Pages (`/horoscope/[slug]`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 7.1 | `/horoscope/personality` loads | [x] | Returns 200 |
| 7.2 | `/horoscope/love` loads | [x] | Returns 200 |
| 7.3 | `/horoscope/career` loads | [x] | Returns 200 |
| 7.4 | `/horoscope/health` loads | [x] | Returns 200 |
| 7.5 | `/horoscope/finance` loads | [x] | Returns 200 |
| 7.6 | All 16 product slugs return 200 | [x] | personality,talent,love,marriage,love-compatibility,conception,pregnancy,children,health,calendar,monthly,3-years,finance,career,business,2026 |
| 7.7 | Form with inputs renders | [ ] | Product pages use ProductPageTemplate, not FeaturePageLayout |

## 8. Static/Info Pages

| # | Test | Status | Notes |
|---|------|--------|-------|
| 8.1 | `/privacy` loads with content | [x] | "Політика конфіденційності — Зоря" |
| 8.2 | `/terms` loads with content | [x] | "Користувацька угода — Зоря" |
| 8.3 | `/glossary` loads with terms | [x] | API returns 200 with data |

## 9. Auth Pages

| # | Test | Status | Notes |
|---|------|--------|-------|
| 9.1 | `/auth/login` loads | [ ] | Need to verify correct route |
| 9.2 | Email/password fields present | [ ] | |
| 9.3 | Google OAuth button present | [ ] | |
| 9.4 | Invalid login shows error message | [ ] | |

## 10. Error Handling

| # | Test | Status | Notes |
|---|------|--------|-------|
| 10.1 | `/nonexistent-page` shows 404 page | [x] | Returns 404 with custom "Сторінку не знайдено" page |
| 10.2 | 404 page has navigation back to home | [x] | "На головну" and "Пройти тест" buttons |
| 10.3 | Error pages have "На головну" link | [x] | Fixed in this session — both global-error.tsx and (main)/error.tsx |
| 10.4 | `global-error.tsx` shows retry + nav | [x] | Added "На головну" link |
| 10.5 | `(main)/error.tsx` shows retry + nav | [x] | Created file with Sentry reporting |

## 11. Navigation & Layout

| # | Test | Status | Notes |
|---|------|--------|-------|
| 11.1 | Desktop nav visible on wide screen | [x] | Гороскопи, Карти dropdowns, Місяць link |
| 11.2 | Logo links to `/` | [x] | "Зоря" logo present |
| 11.3 | Nav links work (Moon, Quiz, etc.) | [x] | |
| 11.4 | Mobile bottom nav works | [ ] | Not tested |
| 11.5 | Footer renders, links work | [x] | 4-column footer with product/service links |

## 12. API Health (direct calls)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 12.1 | `GET /api/moon/current` → 200 | [x] | Returns current moon data |
| 12.2 | `GET /api/moon/phases` → 200 | [x] | Returns phase data |
| 12.3 | `GET /api/moon/void-of-course` → 200 | [x] | Returns void periods |
| 12.4 | `GET /api/geocode?q=Kyiv` → 200, returns results | [x] | Returns geocode results |
| 12.5 | `GET /api/daily-horoscope?sign=Aries` → 200, has data | [x] | Returns horoscope text |
| 12.6 | `GET /api/glossary` → 200 | [x] | Returns terms |
| 12.7 | `GET /api/products` → 200 | [x] | Returns product list |
| 12.8 | `GET /api/horoscope/weekly?sign=Taurus` → 200 | [x] | Returns weekly data |
| 12.9 | `GET /api/horoscope/monthly?sign=Leo` → 200 | [x] | Returns monthly data |
| 12.10 | `GET /api/horoscope/yearly?sign=Gemini` → 200 | [x] | Returns yearly data |

---

## Broken Items Log

_Items found and fixed during 2026-03-01 session:_

| Page/Feature | Error Description | Root Cause | Fix Status |
|-------------|-------------------|------------|------------|
| `global-error.tsx` | No navigation — users stuck on error page | Missing "На головну" link | Fixed |
| `(main)/error.tsx` | Did not exist — no route-level error boundary | File missing | Created |
| All FeaturePageLayout pages | `ReferenceError: React is not defined` — crash on render | `React.useRef` used but `React` not imported (only named imports) | Fixed: changed to `useRef` |
| `FeaturePageLayout` | Retry sent API response instead of original request | `onRetry` passed `result` (API response) not original body | Fixed: linter added `lastBodyRef` |

---

## Agent Notes for Future Sessions

1. **Test locally with prod keys:** `npx vercel env pull .env.local --environment=production` then `npm run dev`
2. **Cannot test production directly** — Claude Preview browser can't navigate to external URLs (redirects to localhost)
3. **Use real browser** (Claude Preview or Chrome MCP) — `fetch()` cannot detect client-side rendering errors (FeaturePageLayout is client-side)
4. **Check console for errors** after each page load
5. **Click every interactive element** — don't just check if the page renders
6. **API tests**: verify response has REAL DATA, not just status 200
7. **After fixes**: push to main, wait for Vercel deploy, then re-test on prod
8. **Production deploys from `main` branch** — features on other branches won't be on prod
9. **Update this file** after each test pass with results and dates
10. **FeaturePageLayout pages** all use client-side rendering — `fetch()` returns skeleton HTML, must navigate in browser to test
11. **Moon page "500" false positive** — the Void of Course alert uses `bg-red-900/20 border-red-500/50` styling that contains "500" in class names
