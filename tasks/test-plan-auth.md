# Test Plan: Authenticated Pages (Requires Login)

> **Base URL:** https://astro-web-five.vercel.app (prod) / http://localhost:3000 (local with prod env)
> **Test account:** Use test account or sign in via Google
> **Last full pass:** 2026-03-01 (local, non-auth view — forms render correctly)
> **Agent instructions:** Log in first, then test each feature. Many pages use `FeaturePageLayout` which auto-submits for logged-in users with charts. Verify real data comes back, not just "form rendered."

## Status Legend
- [ ] Not tested
- [x] Works
- [!] Broken — needs fix (add details below)
- [~] Partial — renders but some functionality broken

---

## 1. Dashboard (`/dashboard`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 1.1 | `/dashboard` loads after login | [x] | Returns 200 |
| 1.2 | Shows user's saved charts | [ ] | Not tested (requires auth) |
| 1.3 | Can click on a chart to view it | [ ] | Not tested |
| 1.4 | "Create new chart" button works | [ ] | Not tested |
| 1.5 | Stats/summary section renders | [ ] | Not tested |
| 1.6 | No console errors | [ ] | Not tested |

## 2. Chart Creation (`/chart/new`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 2.1 | `/chart/new` loads step 1 | [x] | Returns 200 |
| 2.2 | Can enter name, date, time | [ ] | Not tested |
| 2.3 | City search autocomplete works | [ ] | Not tested |
| 2.4 | Can advance through all 4 steps | [ ] | Not tested |
| 2.5 | Chart creates successfully | [ ] | Not tested |
| 2.6 | Redirects to chart result page | [ ] | Not tested |

## 3. Chart Results (`/chart/[id]`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 3.1 | Chart page loads with natal wheel | [ ] | Need a chart ID to test |
| 3.2 | Planets tab shows planet positions | [ ] | |
| 3.3 | Houses tab shows house cusps | [ ] | |
| 3.4 | Aspects tab shows aspect table | [ ] | |
| 3.5 | Report tab loads AI interpretation | [ ] | |
| 3.6 | Share button works | [ ] | |
| 3.7 | ZodiacIcon components render (not unicode) | [ ] | |

## 4. Settings (`/settings`)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 4.1 | `/settings` loads | [x] | Returns 200 |
| 4.2 | Shows user email | [ ] | Not tested (requires auth) |
| 4.3 | Account deletion option present | [ ] | Not tested |

## 5. Feature Pages (FeaturePageLayout-based)

These all use `FeaturePageLayout` with auto-submit for auth users.
**Test pattern (non-auth):** Page loads → shows BirthDataForm with name, date, time, city fields.
**Test pattern (auth):** Page loads → auto-submits with user's chart → returns real analysis data.

**CRITICAL FIX applied 2026-03-01:** `React.useRef` → `useRef` + linter improvements. All FeaturePageLayout pages were crashing with `ReferenceError: React is not defined`.

### 5.1 Transits & Timing

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.1.1 | `/transit` — form renders (non-auth) | [x] | Title "Транзитна карта", form with all fields |
| 5.1.2 | `/progressions` — form renders | [x] | Title visible, form with fields |
| 5.1.3 | `/solar-return` — page loads | [x] | Returns 200 |
| 5.1.4 | `/lunar-return` — page loads | [x] | Returns 200 |
| 5.1.5 | `/directions` — page loads | [x] | Returns 200 |
| 5.1.6 | `/eclipses` — page loads | [x] | Returns 200 |

### 5.2 Traditional Astrology

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.2.1 | `/traditional` — page loads | [x] | Returns 200 |
| 5.2.2 | `/traditional/profections` — page loads | [x] | Returns 200 |
| 5.2.3 | `/fixed-stars` — page loads | [x] | Returns 200 |

### 5.3 Chinese Astrology

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.3.1 | `/chinese` — form renders | [x] | Title "Китайська астрологія", form with all fields |
| 5.3.2 | `/chinese/forecast` — page loads | [x] | Returns 200 |
| 5.3.3 | `/chinese/compatibility` — page loads | [x] | Returns 200 |

### 5.4 Numerology

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.4.1 | `/numerology` — form renders | [x] | Returns 200, form visible |
| 5.4.2 | `/numerology/compatibility` — page loads | [ ] | Route may not exist, check |

### 5.5 Analysis Section

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.5.1 | `/analysis/psychological` — page loads | [x] | Returns 200 |
| 5.5.2 | `/analysis/career` — form renders | [x] | Title "Кар'єрний аналіз", form visible |
| 5.5.3 | `/analysis/health` — page loads | [x] | Returns 200 |
| 5.5.4 | `/analysis/spiritual` — page loads | [x] | Returns 200 |
| 5.5.5 | `/analysis/karmic` — page loads | [x] | Returns 200 |
| 5.5.6 | `/analysis/lunar` — page loads | [x] | Returns 200. API fixed: now uses `datetime_location` |
| 5.5.7 | `/analysis/relocation` — page loads | [x] | Returns 200 |
| 5.5.8 | `/analysis/vocational` — page loads | [x] | Returns 200 |
| 5.5.9 | `/analysis/predictive` — page loads | [~] | Returns 200 but API is slow (20-30s), may timeout |

### 5.6 Insights

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.6.1 | `/insights/wellness` — form renders | [x] | Title "Велнес-аналіз", form visible |
| 5.6.2 | `/insights/financial` — page loads | [x] | Returns 200 |
| 5.6.3 | `/insights/business` — page loads | [x] | Returns 200 |

### 5.7 Astrocartography

| # | Test | Status | Notes |
|---|------|--------|-------|
| 5.7.1 | `/astrocartography` — page loads | [x] | Returns 200 |
| 5.7.2 | `/astrocartography/location` — page loads | [ ] | Route may not exist, check |

## 6. Compatibility (Dual-Input Pages)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 6.1 | `/compatibility` — both forms render | [x] | Title "Сумісність партнерів", 12 inputs, 4 buttons |
| 6.2 | Person 1 auto-fills from user chart | [ ] | Not tested (requires auth) |
| 6.3 | Can fill Person 2 data | [ ] | Not tested |
| 6.4 | City autocomplete works for both | [ ] | Not tested |
| 6.5 | Submit returns synastry data | [ ] | API tested separately — works with correct body format |

## 7. Tarot

| # | Test | Status | Notes |
|---|------|--------|-------|
| 7.1 | `/tarot` — main page loads | [x] | Returns 200 |
| 7.2 | `/tarot/single` — "Витягнути карту" button | [x] | Title "Одна карта", button renders |
| 7.3 | `/tarot/three-card` — page loads | [x] | Returns 200 |
| 7.4 | `/tarot/celtic-cross` — page loads | [x] | Returns 200 |
| 7.5 | `/tarot/houses` — page loads | [x] | Returns 200 |
| 7.6 | `/tarot/synastry` — page loads | [x] | Returns 200 |
| 7.7 | `/tarot/transit` — page loads | [x] | Returns 200 |
| 7.8 | `/tarot/tree-of-life` — page loads | [x] | Returns 200 |
| 7.9 | `/tarot/birth-cards` — page loads | [x] | Returns 200 |
| 7.10 | Card draw API returns data | [ ] | Not tested in browser |

## 8. Horoscope Product Pages (auth data prefill)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 8.1 | `/horoscope/personality` — form loads | [x] | ProductPageTemplate renders |
| 8.2 | Email field is readonly when prefilled | [ ] | Not tested (requires auth) |
| 8.3 | Badge "Дані заповнені автоматично" shows | [ ] | Not tested (requires auth) |
| 8.4 | Submit works, returns interpretation | [ ] | Not tested |
| 8.5 | `/horoscope/love` — page loads | [x] | Returns 200 |
| 8.6 | `/horoscope/career` — page loads | [x] | Returns 200 |

## 9. Data Prefill Verification

| # | Test | Status | Notes |
|---|------|--------|-------|
| 9.1 | Name field has non-empty value | [ ] | Requires auth + chart |
| 9.2 | Email contains `@` | [ ] | Requires auth |
| 9.3 | Date matches YYYY-MM-DD format | [ ] | Requires auth + chart |
| 9.4 | Time matches HH:mm format | [ ] | Requires auth + chart |
| 9.5 | City field is non-empty | [ ] | Requires auth + chart |

---

## Broken Items Log

_Items found and fixed during 2026-03-01 session:_

| Page/Feature | Error Description | Root Cause | Fix Status |
|-------------|-------------------|------------|------------|
| ALL FeaturePageLayout pages | `ReferenceError: React is not defined` — crash on render | `React.useRef` used without importing `React` namespace | Fixed: `useRef` imported from 'react' |
| ALL FeaturePageLayout pages | `useAuthChart` stuck `isLoading=true` forever | No try/catch around `supabase.auth.getUser()` | Fixed: added try/catch/finally |
| `global-error.tsx` | No navigation — users stuck on error page | Missing "На головну" link | Fixed |
| `(main)/error.tsx` | No route-level error boundary | File didn't exist | Created |
| `/api/analysis/lunar` | 500 error | SDK expects `datetime_location`, route passed `subject` | Fixed in `analysis/[type]/route.ts` |
| `/api/analysis/predictive` | 500 "orb must be finite number" | SDK requires `orb` parameter | Fixed: added `orb: 6` |
| `FeaturePageLayout` retry | Retry sent API response instead of original request body | `onRetry` used `result` (response) not input body | Fixed: linter added `lastBodyRef` |

---

## API Endpoint Test Results (2026-03-01)

All POST endpoints tested with valid subject data:

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/api/chart` | [x] | Returns natal chart data |
| `/api/compatibility` | [x] | Requires `{person1, person2}` with camelCase fields |
| `/api/progressions` | [x] | Returns progression data |
| `/api/chinese/bazi` | [x] | Returns BaZi analysis |
| `/api/numerology` | [x] | Returns numerology data |
| `/api/directions` | [x] | Returns primary directions |
| `/api/lunar-return` | [x] | Returns lunar return data |
| `/api/traditional/analysis` | [x] | Returns traditional analysis |
| `/api/traditional/profections` | [x] | Returns profection data |
| `/api/eclipses` | [x] | Returns eclipse data |
| `/api/fixed-stars` | [x] | Returns fixed stars |
| `/api/insights/wellness` | [x] | Returns wellness insights |
| `/api/insights/financial` | [x] | Returns financial insights |
| `/api/insights/business` | [x] | Returns business insights |
| `/api/analysis/career` | [x] | Returns career analysis |
| `/api/analysis/health` | [x] | Returns health analysis |
| `/api/analysis/karmic` | [x] | Returns karmic analysis |
| `/api/analysis/psychological` | [x] | Returns psychological analysis |
| `/api/analysis/spiritual` | [x] | Returns spiritual analysis |
| `/api/analysis/vocational` | [x] | Returns vocational analysis |
| `/api/analysis/lunar` | [x] | Fixed: uses `datetime_location` format |
| `/api/analysis/relocation` | [x] | Returns relocation analysis |
| `/api/analysis/predictive` | [~] | Fixed but slow (20-30s), may timeout |
| `/api/tarot/draw` | [x] | Returns card draw data |
| `/api/tarot/birth-cards` | [x] | Returns birth cards |
| `/api/astrocartography/map` | [x] | Returns astrocartography data |

---

## Agent Notes for Future Sessions

1. **Log in first** before testing auth pages. Use Google OAuth or test account
2. **Wait for auto-submit** — `FeaturePageLayout` auto-submits ~2-3s after page load for auth users with charts
3. **Check for real data** — API response should contain actual astrology data, not just `{ error: "..." }`
4. **Dual-input pages** (compatibility, chinese/compatibility, numerology/compatibility) need BOTH persons' data filled
5. **City autocomplete is critical** — many forms require lat/lon from autocomplete, not just typing a city name
6. **After fixes**: push to main, wait for deploy, re-test the specific items
7. **FeaturePageLayout pages** all follow same pattern — if one breaks, likely all break the same way
8. **Tarot pages** use different layout pattern — button-based, not form-based
9. **Cannot test production directly from Claude Preview** — use local with prod env keys instead
10. **fetch() returns server HTML only** — FeaturePageLayout is client-rendered, must navigate in browser to test forms
11. **`/horoscope/[slug]` is ProductPageTemplate** — NOT FeaturePageLayout. Different component, different testing approach
12. **Predictive analysis** (`/api/analysis/predictive`) is inherently slow (20-30s) — this is an SDK limitation, not our bug
13. **Update this file** after each test pass with results and dates
