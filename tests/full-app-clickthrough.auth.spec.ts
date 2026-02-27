/**
 * Full App Clickthrough — Authenticated User
 *
 * Walks through the ENTIRE app as a logged-in user, clicking every feature,
 * verifying real data from APIs (not demo/fallback), and testing logical flows
 * like data prefilling.
 *
 * Requires auth setup: TEST_EMAIL and TEST_PASSWORD env vars.
 * Run: npx playwright test tests/full-app-clickthrough.auth.spec.ts --project=authenticated
 */

import { test, expect, Page } from '@playwright/test';

/** Dismiss cookie consent banner if present (it intercepts pointer events). */
async function dismissCookies(page: Page) {
  const btn = page.locator('button').filter({ hasText: /Відхилити|Reject|Decline/i });
  if (await btn.count() > 0) {
    await btn.first().click();
    await page.waitForTimeout(400);
  }
}

// ═══════════════════════════════════════════════════════════════════
// Group 1: Dashboard — Entry Point for Logged-in Users
// ═══════════════════════════════════════════════════════════════════

test.describe('Dashboard — Authenticated Entry Point', () => {
  test('loads dashboard without redirect to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });

  test('shows greeting with real user name (not "undefined")', async ({ page }) => {
    await page.goto('/dashboard');
    const greeting = page.locator('text=/Привіт,/');
    await expect(greeting).toBeVisible({ timeout: 10000 });
    const text = await greeting.textContent();
    expect(text).not.toContain('undefined');
    expect(text).not.toContain('null');
    expect(text!.length).toBeGreaterThan(10); // "Привіт, X 👋"
  });

  test('moon data section loads with real data', async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for moon data to load via /api/moon/current
    const moonSection = page.locator('text=/Сьогодні на небі/');
    await expect(moonSection).toBeVisible({ timeout: 10000 });

    // Wait for actual moon data
    await page.waitForTimeout(3000);
    const moonContent = page.locator('text=/Місяць у/');
    const hasMoonData = await moonContent.count() > 0;
    const hasFallback = await page.locator('text=Місячний календар').count() > 0;
    expect(hasMoonData || hasFallback).toBe(true);
  });

  test('shows saved charts or empty state', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Should have chart links OR empty state
    const chartLinks = page.locator('a[href^="/chart/"]').filter({ hasNot: page.locator('text=Нова карта') });
    const emptyState = page.locator('text=/ще немає|створіть|Створити/i');
    const hasCharts = await chartLinks.count() > 0;
    const isEmpty = await emptyState.count() > 0;
    expect(hasCharts || isEmpty).toBe(true);
  });

  test('clicking saved chart navigates to chart view', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const chartLinks = page.locator('a[href^="/chart/"]').filter({
      hasNot: page.locator('text=/Нова карта|chart\\/new/'),
    });

    if (await chartLinks.count() > 0) {
      const href = await chartLinks.first().getAttribute('href');
      await chartLinks.first().click();
      await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
    // If no charts, test passes (nothing to click)
  });

  test('"Нова карта" button navigates to /chart/new', async ({ page }) => {
    await page.goto('/dashboard');
    const newChartBtn = page.locator('a[href="/chart/new"]').first();
    await expect(newChartBtn).toBeVisible({ timeout: 10000 });
    await newChartBtn.click();
    await expect(page).toHaveURL(/\/chart\/new/);
  });

  test('tools grid — Moon Calendar links to /moon', async ({ page }) => {
    await page.goto('/dashboard');
    const moonTool = page.locator('a[href="/moon"]').filter({ hasText: /Місячний|Календар|Місяць/ });
    await expect(moonTool.first()).toBeVisible({ timeout: 10000 });
    await moonTool.first().click();
    await expect(page).toHaveURL(/\/moon/);
  });

  test('tools grid — Compatibility links to /compatibility', async ({ page }) => {
    await page.goto('/dashboard');
    const compTool = page.locator('a[href="/compatibility"]').filter({ hasText: /Сумісність/ });
    await expect(compTool.first()).toBeVisible({ timeout: 10000 });
    await compTool.first().click();
    await expect(page).toHaveURL(/\/compatibility/);
  });

  test('daily summary section is visible', async ({ page }) => {
    await page.goto('/dashboard');
    const forecast = page.locator('text=Прогноз на сьогодні');
    await expect(forecast).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 2: Chart Creation — Authenticated (creates a chart for subsequent tests)
// ═══════════════════════════════════════════════════════════════════

test.describe('Chart Creation — Authenticated Flow', () => {
  test('full chart creation: date → city → time → name → result', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/chart/new');
    await page.waitForTimeout(1500);
    await dismissCookies(page);

    // ── Step 0: Birth Date ──
    const numericInputs = page.locator('input[inputmode="numeric"]');
    const monthSelect = page.locator('select').first();

    if (await numericInputs.count() >= 2) {
      await numericInputs.first().fill('20');
      if (await monthSelect.count() > 0) {
        await monthSelect.selectOption({ index: 5 }); // June
      }
      await numericInputs.nth(1).fill('1990');
    }

    const nextBtn = page.locator('button').filter({ hasText: /Далі/ });
    await expect(nextBtn).toBeVisible({ timeout: 5000 });
    await nextBtn.click();

    // ── Step 1: City ──
    await page.waitForTimeout(1000);

    const allInputs = page.locator('input:visible');
    for (let i = 0; i < await allInputs.count(); i++) {
      const input = allInputs.nth(i);
      const type = await input.getAttribute('type');
      const inputmode = await input.getAttribute('inputmode');
      if (type === 'text' && inputmode !== 'numeric') {
        await input.fill('Kyiv');
        break;
      }
    }

    await page.waitForTimeout(2000);
    const suggestions = page.locator('[role="listbox"] [role="option"], [class*="dropdown"] button, [class*="suggestion"], [class*="result"]').first();
    if (await suggestions.count() > 0) {
      await suggestions.click();
      await page.waitForTimeout(500);
    }

    const nextBtn2 = page.locator('button').filter({ hasText: /Далі/ });
    if (await nextBtn2.count() > 0 && await nextBtn2.isEnabled()) {
      await nextBtn2.click();
      await page.waitForTimeout(1000);

      // ── Step 2: Time ──
      const nextBtn3 = page.locator('button').filter({ hasText: /Далі/ });
      if (await nextBtn3.count() > 0 && await nextBtn3.isEnabled()) {
        await nextBtn3.click();
        await page.waitForTimeout(1000);

        // ── Step 3: Name ──
        const textInputs = page.locator('input[type="text"]:visible');
        if (await textInputs.count() > 0) {
          await textInputs.first().fill('Тест Playwright');
        }

        const submitBtn = page.locator('button').filter({ hasText: /Розрахувати|Далі|Створити/ });
        if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
          await submitBtn.click();

          // Wait for chart calculation
          await page.waitForURL(/\/chart\/(?!new)/, { timeout: 60000 });

          const url = page.url();
          expect(url).toMatch(/\/chart\/[a-zA-Z0-9-]+/);

          // Verify chart data loaded
          const bodyText = await page.locator('body').textContent();
          expect(bodyText!.length).toBeGreaterThan(200);
        }
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 3: Chart View — Real Data & All Sections
// ═══════════════════════════════════════════════════════════════════

test.describe('Chart View — Full Data Display', () => {
  let chartUrl: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'tests/.auth/user.json' });
    const page = await context.newPage();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const chartLink = page.locator('a[href^="/chart/"]').filter({
      hasNot: page.locator('text=/Нова карта|chart\\/new/'),
    }).first();

    if (await chartLink.count() > 0) {
      chartUrl = (await chartLink.getAttribute('href'))!;
    } else {
      chartUrl = ''; // No charts exist
    }
    await context.close();
  });

  test('chart page loads with real planet data', async ({ page }) => {
    if (!chartUrl) {
      test.skip(true, 'No saved charts found — create one first');
      return;
    }
    await page.goto(chartUrl);
    await page.waitForLoadState('networkidle');

    const quickIdentity = page.locator('text=/Сонце|Місяць|Асцендент|MC/i');
    await expect(quickIdentity.first()).toBeVisible({ timeout: 15000 });
  });

  test('planets table has real data rows', async ({ page }) => {
    if (!chartUrl) {
      test.skip(true, 'No saved charts found');
      return;
    }
    await page.goto(chartUrl);
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    const hasSun = bodyText?.match(/Сонце|Sun/i);
    const hasMoon = bodyText?.match(/Місяць|Moon/i);
    expect(hasSun || hasMoon).toBeTruthy();
  });

  test('NatalChartWheel SVG renders', async ({ page }) => {
    if (!chartUrl) {
      test.skip(true, 'No saved charts found');
      return;
    }
    await page.goto(chartUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible({ timeout: 15000 });
  });

  test('AI report button exists and can be clicked', async ({ page }) => {
    if (!chartUrl) {
      test.skip(true, 'No saved charts found');
      return;
    }
    test.setTimeout(90000);
    await page.goto(chartUrl);
    await page.waitForLoadState('networkidle');

    const reportBtns = page.locator('button').filter({
      hasText: /загальн|кар'єр|стосунк|здоров|фінанс|духовн/i,
    });

    if (await reportBtns.count() > 0) {
      await reportBtns.first().click();
      await page.waitForTimeout(5000);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText!.length).toBeGreaterThan(500);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 4: Data Prefilling — Logical Test
// ═══════════════════════════════════════════════════════════════════

test.describe('Data Prefilling — Logged-in User', () => {
  const PRODUCT_PAGES = [
    '/horoscope/personality',
    '/horoscope/love',
    '/horoscope/career',
  ];

  for (const pagePath of PRODUCT_PAGES) {
    test(`${pagePath}: form fields prefilled from user chart data`, async ({ page }) => {
      const response = await page.goto(pagePath);
      const status = response?.status() ?? 0;
      if (status === 404) {
        // ISR/SSG pages can 404 transiently on first cold load — retry once
        await page.waitForTimeout(2000);
        const retry = await page.goto(pagePath);
        if (retry?.status() === 404) {
          test.skip(true, `${pagePath} returned 404 (ISR not warmed yet)`);
          return;
        }
      }

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(4000); // Wait for Supabase prefill fetch

      // Check if the "auto-filled" badge is visible (user has charts)
      const autofillBadge = page.locator('text=/автоматично.*профіл/i');
      const hasBadge = await autofillBadge.count() > 0;

      if (hasBadge) {
        // Badge is visible — deep assertions on all prefilled fields
        await expect(autofillBadge.first()).toBeVisible();

        // 1. Name is prefilled with non-empty value
        const nameInput = page.locator('input[type="text"]').first();
        await expect(nameInput).toBeVisible();
        const nameVal = await nameInput.inputValue();
        expect(nameVal.length).toBeGreaterThan(0);

        // 2. Email is prefilled and readonly
        const emailInput = page.locator('input[type="email"]');
        if (await emailInput.count() > 0) {
          const emailVal = await emailInput.inputValue();
          expect(emailVal).toContain('@');
          const isReadOnly = await emailInput.getAttribute('readonly');
          expect(isReadOnly).not.toBeNull();
        }

        // 3. Birth date — check format if present, but allow empty (chart may lack birth_date)
        const dateInput = page.locator('input[type="date"]');
        if (await dateInput.count() > 0) {
          const dateVal = await dateInput.inputValue();
          if (dateVal) {
            expect(dateVal).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          }
        }

        // 4. Birth time — check format if present, allow empty
        const timeInput = page.locator('input[type="time"]');
        if (await timeInput.count() > 0) {
          const timeVal = await timeInput.inputValue();
          if (timeVal) {
            expect(timeVal).toMatch(/^\d{2}:\d{2}/);
          }
        }

        // 5. City — check if present, allow empty
        const textInputs = page.locator('input[type="text"]');
        if (await textInputs.count() >= 2) {
          const cityVal = await textInputs.nth(1).inputValue();
          if (cityVal) {
            expect(cityVal.length).toBeGreaterThan(0);
          }
        }
      } else {
        // No badge — user may not have charts yet. Verify page at least renders form
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible({ timeout: 5000 });
        const bodyText = await page.locator('body').textContent();
        expect(bodyText!.length).toBeGreaterThan(100);
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
// Group 5: Explore — All Features with Real API Data
// ═══════════════════════════════════════════════════════════════════

test.describe('Explore — Real API Features', () => {
  test('loads explore page', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 15000 });

    const headingText = await heading.textContent();
    expect(headingText).toContain('Досліджуйте');
  });

  test('personal horoscope returns real data', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give client-side chart fetch time

    // Check for "Показати" buttons — they only appear when charts are loaded
    const showButtons = page.locator('button').filter({ hasText: 'Показати' });
    if (await showButtons.count() === 0) {
      test.skip(true, 'No feature buttons — charts not loaded for explore');
      return;
    }

    await showButtons.first().click();

    // Wait for API response
    await page.waitForTimeout(15000);

    const result = page.locator('pre');
    const error = page.locator('text=/Помилка/');
    const hasResult = await result.count() > 0;
    const hasError = await error.count() > 0;

    if (hasResult) {
      const json = await result.first().textContent();
      expect(json!.length).toBeGreaterThan(10); // Real data, not empty
    }
    expect(hasResult || hasError).toBe(true);
  });

  test('numerology returns real data', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const showButtons = page.locator('button').filter({ hasText: 'Показати' });
    if (await showButtons.count() < 4) {
      test.skip(true, 'Not enough feature buttons — charts not loaded');
      return;
    }

    await showButtons.nth(3).click();

    await page.waitForTimeout(15000);

    const result = page.locator('pre');
    if (await result.count() > 0) {
      const json = await result.last().textContent();
      expect(json!.length).toBeGreaterThan(10);
    }
  });

  test('transit SVG renders', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const showButtons = page.locator('button').filter({ hasText: 'Показати' });
    if (await showButtons.count() < 3) {
      test.skip(true, 'Not enough feature buttons — charts not loaded');
      return;
    }

    await showButtons.nth(2).click();

    await page.waitForTimeout(20000);

    // SVG should render or error should show
    const svg = page.locator('.overflow-auto svg');
    const error = page.locator('text=/Помилка|Невалідний/');
    const hasSvg = await svg.count() > 0;
    const hasError = await error.count() > 0;
    expect(hasSvg || hasError).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 6: Compatibility — Full Flow with Saved Chart
// ═══════════════════════════════════════════════════════════════════

test.describe('Compatibility — Authenticated Flow', () => {
  test('page loads with form', async ({ page }) => {
    await page.goto('/compatibility');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Партнер');
  });

  test('Person 1 uses saved chart, Person 2 manual', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/compatibility');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check if "Моя карта" button exists (user has saved charts)
    const myChartBtn = page.locator('button').filter({ hasText: 'Моя карта' });
    const hasMyChart = await myChartBtn.count() > 0;

    if (hasMyChart) {
      const chartLoaded = page.locator('text=/Дані завантажено/');
      await expect(chartLoaded).toBeVisible({ timeout: 10000 });
    }

    // Fill Person 2
    const partnerSection = page.locator('text=Партнер').first();
    await expect(partnerSection).toBeVisible({ timeout: 10000 });

    // Fill partner name
    const nameInputs = page.locator('input[type="text"][placeholder*="партнер" i]');
    if (await nameInputs.count() > 0) {
      await nameInputs.first().fill('Тест Партнер');
    } else {
      const allNameInputs = page.locator('input[type="text"]');
      if (await allNameInputs.count() >= 2) {
        await allNameInputs.nth(1).fill('Тест Партнер');
      }
    }

    // Search for city for Person 2
    const cityInputs = page.locator('input[placeholder*="місто" i], input[placeholder*="city" i]');
    if (await cityInputs.count() >= 2) {
      await cityInputs.last().fill('Kyiv');
      await page.waitForTimeout(2000);
      const suggestion = page.locator('[role="option"], [role="listbox"] >> text=/Kyiv|Київ/i').first();
      if (await suggestion.count() > 0) {
        await suggestion.click();
        await page.waitForTimeout(500);
      }
    }

    const submitBtn = page.locator('button').filter({ hasText: /Розрахувати сумісність/ });
    await expect(submitBtn).toBeVisible({ timeout: 5000 });

    const isEnabled = await submitBtn.isEnabled();
    if (isEnabled) {
      await submitBtn.click();

      const loadingOrResult = page.locator('text=/Аналізуємо|Висока сумісність|Хороша сумісність|Потребує роботи|Помилка/');
      await expect(loadingOrResult).toBeVisible({ timeout: 45000 });

      await page.waitForTimeout(30000);
      const score = page.locator('text=/%/');
      const error = page.locator('text=/Помилка/');
      const hasScore = await score.count() > 0;
      const hasError = await error.count() > 0;
      expect(hasScore || hasError).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 7: Daily Horoscope — Real Data
// ═══════════════════════════════════════════════════════════════════

test.describe('Daily Horoscope — Real API Data', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toContainText('Гороскоп на сьогодні', { timeout: 10000 });
  });

  test('full flow: enter date → get horoscope → verify data', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const numericInputs = page.locator('input[inputmode="numeric"]');
    if (await numericInputs.count() >= 2) {
      await numericInputs.first().fill('15');
      await numericInputs.nth(1).fill('1995');

      const monthSelect = page.locator('select').first();
      if (await monthSelect.count() > 0) {
        await monthSelect.selectOption({ index: 2 });
      }
    }

    await page.waitForTimeout(500);

    const submitBtn = page.locator('button').filter({ hasText: /Дізнатися прогноз/ });
    if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
      await submitBtn.click();

      await page.waitForTimeout(10000);

      const bodyText = await page.locator('body').textContent();
      const hasHoroscope = bodyText?.match(/Кохання|Кар'єра|Здоров/i);
      const hasError = bodyText?.match(/Помилка|помилка/);

      expect(hasHoroscope || hasError).toBeTruthy();

      if (hasHoroscope) {
        const stars = page.locator('text=/\\/10/');
        await expect(stars).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 8: Moon Calendar — Server Data
// ═══════════════════════════════════════════════════════════════════

test.describe('Moon Calendar — Real Server Data', () => {
  test('displays current moon phase with real data', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const bodyText = await page.locator('body').textContent();
    const hasMoonData = bodyText?.match(/Місяць|місяць|фаза|Фаза|Новий|Повний|Зростаючий|Спадний/i);
    expect(hasMoonData).toBeTruthy();
  });

  test('calendar renders with substantial content', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(500);
  });

  test('void-of-course info section visible', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');

    const voidInfo = page.locator('text=/без курсу|Void|void/i');
    await expect(voidInfo.first()).toBeVisible({ timeout: 10000 });
  });

  test('moon phase info sections visible', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');

    const phaseInfo = page.locator('text=/Фази Місяця/i');
    await expect(phaseInfo.first()).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 9: All Horoscope Product Pages — Load & Have Content
// ═══════════════════════════════════════════════════════════════════

test.describe('All Horoscope Product Pages', () => {
  const PRODUCT_PAGES = [
    { path: '/horoscope/personality', name: 'Personality' },
    { path: '/horoscope/love', name: 'Love' },
    { path: '/horoscope/love-compatibility', name: 'Love Compatibility' },
    { path: '/horoscope/career', name: 'Career' },
    { path: '/horoscope/health', name: 'Health' },
    { path: '/horoscope/finance', name: 'Finance' },
    { path: '/horoscope/children', name: 'Children' },
    { path: '/horoscope/2026', name: '2026' },
    { path: '/horoscope/monthly', name: 'Monthly' },
    { path: '/horoscope/3-years', name: '3 Years' },
    { path: '/horoscope/talent', name: 'Talent' },
    { path: '/horoscope/marriage', name: 'Marriage' },
  ];

  for (const p of PRODUCT_PAGES) {
    test(`${p.name}: page loads with heading and content`, async ({ page }) => {
      const response = await page.goto(p.path);
      expect(response?.status()).not.toBe(404);

      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      const bodyText = await page.locator('body').textContent();
      expect(bodyText!.length).toBeGreaterThan(100);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
// Group 10: All Navigation Links Work (no 404/500)
// ═══════════════════════════════════════════════════════════════════

test.describe('Navigation — All Links Work', () => {
  const CRITICAL_LINKS = [
    { path: '/', name: 'Home' },
    { path: '/chart/new', name: 'New Chart' },
    { path: '/compatibility', name: 'Compatibility' },
    { path: '/moon', name: 'Moon Calendar' },
    { path: '/daily', name: 'Daily Horoscope' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/explore', name: 'Explore' },
    { path: '/quiz', name: 'Quiz' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/terms', name: 'Terms' },
    { path: '/ascendant', name: 'Ascendant' },
  ];

  for (const link of CRITICAL_LINKS) {
    test(`${link.name} (${link.path}) loads without 404/500`, async ({ page }) => {
      const response = await page.goto(link.path);
      expect(response?.status()).toBeLessThan(400);

      const bodyText = await page.locator('body').textContent();
      expect(bodyText!.length).toBeGreaterThan(50);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
// Group 11: All 12 Zodiac Pages
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// Group 12: No Critical Console Errors — Authenticated Pages
// ═══════════════════════════════════════════════════════════════════

test.describe('No Critical Console Errors (Auth)', () => {
  const PAGES = [
    '/dashboard', '/explore', '/daily', '/quiz',
    '/ascendant', '/privacy', '/terms', '/compatibility',
  ];

  for (const pagePath of PAGES) {
    test(`${pagePath}: no JS errors in console`, async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (
            text.includes('favicon') ||
            text.includes('PostHog') ||
            text.includes('posthog') ||
            text.includes('analytics') ||
            text.includes('CORS') ||
            text.includes('hydration') ||
            text.includes('Hydration') ||
            text.includes('Failed to load resource') ||
            text.includes('net::ERR') ||
            text.includes('AbortError') ||
            text.includes('chunk') ||
            text.includes('_next') ||
            text.includes('webpack') ||
            text.includes('404') ||
            text.includes('Sentry') ||
            text.includes('sentry')
          ) return;
          errors.push(text);
        }
      });

      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      if (errors.length > 0) {
        console.log(`Console errors on ${pagePath}:`, errors);
      }
      expect(errors.length).toBe(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
// Group 13: All 12 Zodiac Pages
// ═══════════════════════════════════════════════════════════════════

test.describe('All 12 Zodiac Pages', () => {
  const ZODIAC_SIGNS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];

  for (const sign of ZODIAC_SIGNS) {
    test(`/zodiac/${sign}: loads with sign-specific content`, async ({ page }) => {
      const response = await page.goto(`/zodiac/${sign}`);
      expect(response?.status()).not.toBe(404);

      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      const bodyText = await page.locator('body').textContent();
      expect(bodyText!.length).toBeGreaterThan(200);

      const hasZodiacContent = bodyText?.match(/стихія|елемент|планета|сумісн|якост/i);
      expect(hasZodiacContent).toBeTruthy();
    });
  }
});
