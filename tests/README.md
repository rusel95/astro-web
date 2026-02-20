# E2E Testing Guide

Playwright-based end-to-end tests for AstroSvitlana.

## Setup

### 1. Install dependencies

```bash
npm install
npx playwright install --with-deps
```

### 2. Configure test environment

Copy `.env.test.example` to `.env.test`:

```bash
cp tests/.env.test.example tests/.env.test
```

Fill in real credentials (for authenticated tests):

```env
NEXT_PUBLIC_SUPABASE_URL=https://jrjshwhgpbmttmxbsqtn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running Tests

### All tests (public + mobile)
```bash
npm test
```

### Authenticated tests only
```bash
npm run test:auth
```

### Interactive UI mode
```bash
npm run test:ui
```

### View last test report
```bash
npm run test:report
```

## Test Structure

### Current Coverage (~70%)

**Authentication & User Flow:**
- ✅ **auth.spec.ts** — Login page UI, OAuth redirects, protected routes
- ✅ **dashboard.auth.spec.ts** — Authenticated dashboard access

**Public Pages:**
- ✅ **public-pages.spec.ts** — Homepage, compatibility, login (all public routes)
- ✅ **zodiac.spec.ts** — All 12 zodiac sign pages (SEO, content, navigation)
- ✅ **horoscopes.spec.ts** — All 6 horoscope types (personality, love, career, health, forecast, compatibility)

**Chart Features:**
- ✅ **chart-new.spec.ts** — Multi-step form flow, date picker, mobile layout
- ✅ **chart-view.spec.ts** — Chart display, wheel rendering, planets, aspects, sharing

**Quality Assurance:**
- ✅ **visual-regression.spec.ts** — Screenshot comparison for UI consistency
- ✅ **accessibility.spec.ts** — WCAG 2.1 AA compliance, keyboard navigation, screen reader support

### Missing Coverage (TODO)

- [ ] Birthday Forecast generation (API + UI) — issue #77
- [ ] PDF export functionality
- [ ] Email notifications (mock Resend API)
- [ ] Chart history (view/delete saved charts)
- [ ] Settings page (profile edit, notifications toggle)
- [ ] Payment/subscription flows (when implemented)

## GitHub Actions

### Daily Tests
Runs at **06:00 UTC (08:00 Kyiv)** every day:
- Full E2E suite
- Creates GitHub issue on failure
- Uploads screenshots/reports as artifacts

**Manual trigger:** Go to Actions → Daily E2E Tests → Run workflow

### PR Tests
Runs on every PR to `main`:
- Lint
- Build
- E2E tests

## Debugging Failed Tests

### Locally
```bash
npm run test:ui
```

### CI Artifacts
1. Go to failed workflow run
2. Download `playwright-report` or `test-screenshots`
3. Open `index.html` from report

## Writing New Tests

### Example: Test new feature
```typescript
import { test, expect } from '@playwright/test';

test.describe('Birthday Forecast', () => {
  test('generates forecast for authenticated user', async ({ page }) => {
    // 1. Login
    await page.goto('/auth/login');
    // ... login steps
    
    // 2. Navigate to birthday forecast
    await page.goto('/birthday-forecast/chart-id-123');
    
    // 3. Check forecast content
    await expect(page.locator('h1')).toContainText('Прогноз на рік');
  });
});
```

### Best Practices
- Use `data-testid` for stable selectors
- Wait for animations with `page.waitForTimeout(600)` when needed
- Mobile tests: `test.use({ viewport: { width: 390, height: 844 } })`
- Authenticated tests: use `auth.setup.ts` for session persistence

## Secrets (GitHub Actions)

Set these in **Settings → Secrets → Actions**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

## Resources

- [Playwright Docs](https://playwright.dev)
- [Next.js Testing](https://nextjs.org/docs/testing/playwright)
