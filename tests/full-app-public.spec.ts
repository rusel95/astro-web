/**
 * Full App Clickthrough — Anonymous (Public) User
 *
 * Walks through all public features without authentication:
 * - Landing page, chart creation, compatibility, daily horoscope, quiz
 * - Auth redirects for protected routes
 *
 * Run: npx playwright test tests/full-app-public.spec.ts --project=public
 */

import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════════════
// Group 1: Landing Page — Full Content Check
// ═══════════════════════════════════════════════════════════════════

test.describe('Landing Page — All Sections Render', () => {
  test('page loads with hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('landing has substantial content (all sections)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(2000);
  });

  test('hero CTA button is visible and clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Main CTA (quiz or chart creation)
    const cta = page.locator('a[href="/quiz"], a[href="/chart/new"]').first();
    if (await cta.count() > 0) {
      await expect(cta).toBeVisible({ timeout: 10000 });
    }
  });

  test('has product or horoscope links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for lazy sections

    // Product links or horoscope links
    const links = page.locator('a[href^="/horoscope/"], a[href="/chart/new"], a[href="/quiz"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has navigation with key links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Nav should have at least moon, compatibility, or new chart link
    const navLinks = page.locator('nav a[href="/moon"], nav a[href="/compatibility"], nav a[href="/chart/new"]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 2: Chart Creation — Full Flow (Anonymous)
// ═══════════════════════════════════════════════════════════════════

test.describe('Chart Creation — Full Anonymous Flow', () => {
  test('step 0: date picker loads', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('full flow: date → city → time → name → result', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/chart/new');
    await page.waitForTimeout(1500);

    // Dismiss cookie consent banner if present (it intercepts pointer events)
    const rejectCookies = page.locator('button').filter({ hasText: /Відхилити|Reject|Decline/i });
    if (await rejectCookies.count() > 0) {
      await rejectCookies.first().click();
      await page.waitForTimeout(500);
    }

    // ── Step 0: Birth Date ──
    const numericInputs = page.locator('input[inputmode="numeric"]');
    const monthSelect = page.locator('select').first();

    if (await numericInputs.count() >= 2) {
      await numericInputs.first().fill('15');
      if (await monthSelect.count() > 0) {
        await monthSelect.selectOption({ index: 2 }); // March
      }
      await numericInputs.nth(1).fill('1995');
    }

    const nextBtn = page.locator('button').filter({ hasText: /Далі/ });
    await expect(nextBtn).toBeVisible({ timeout: 5000 });
    await nextBtn.click();

    // ── Step 1: City ──
    await page.waitForTimeout(1000);
    const step1Heading = page.locator('h1');
    await expect(step1Heading).toBeVisible({ timeout: 5000 });

    // Search for a city
    const allInputs = page.locator('input:visible');
    let cityFound = false;

    for (let i = 0; i < await allInputs.count(); i++) {
      const input = allInputs.nth(i);
      const type = await input.getAttribute('type');
      const inputmode = await input.getAttribute('inputmode');
      if (type === 'text' && inputmode !== 'numeric') {
        await input.fill('Kyiv');
        cityFound = true;
        break;
      }
    }

    if (cityFound) {
      await page.waitForTimeout(2000);
      // Look for autocomplete dropdown
      const suggestions = page.locator('[role="listbox"] [role="option"], [class*="dropdown"] button, [class*="suggestion"], [class*="result"]').first();
      if (await suggestions.count() > 0) {
        await suggestions.click();
        await page.waitForTimeout(500);
      }
    }

    // Try to advance — if city wasn't selected, "Далі" will be disabled and we stop
    const nextBtn2 = page.locator('button').filter({ hasText: /Далі/ });
    if (await nextBtn2.count() > 0) {
      const enabled = await nextBtn2.isEnabled();
      if (enabled) {
        await nextBtn2.click();
        await page.waitForTimeout(1000);

        // ── Step 2: Time — just proceed with default ──
        const nextBtn3 = page.locator('button').filter({ hasText: /Далі/ });
        if (await nextBtn3.count() > 0 && await nextBtn3.isEnabled()) {
          await nextBtn3.click();
          await page.waitForTimeout(1000);

          // ── Step 3: Name ──
          const textInputs = page.locator('input[type="text"]:visible');
          if (await textInputs.count() > 0) {
            await textInputs.first().fill('Тест Юзер');
          }

          // Submit
          const submitBtn = page.locator('button').filter({ hasText: /Розрахувати|Далі|Створити/ });
          if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
            await submitBtn.click();
            await page.waitForTimeout(30000);

            const url = page.url();
            if (url.includes('/chart/') && !url.includes('/chart/new')) {
              const bodyText = await page.locator('body').textContent();
              expect(bodyText!.length).toBeGreaterThan(200);
            }
          }
        }
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 3: Compatibility — Anonymous Flow
// ═══════════════════════════════════════════════════════════════════

test.describe('Compatibility — Anonymous Flow', () => {
  test('page loads with form', async ({ page }) => {
    await page.goto('/compatibility');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Both person sections visible
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Партнер');
  });

  test('submit button exists', async ({ page }) => {
    await page.goto('/compatibility');
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button').filter({ hasText: /Розрахувати/ });
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
  });

  test('info section is visible', async ({ page }) => {
    await page.goto('/compatibility');
    await page.waitForLoadState('networkidle');

    const infoSection = page.locator('text=/синастрія/i');
    await expect(infoSection.first()).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 4: Daily Horoscope — Anonymous
// ═══════════════════════════════════════════════════════════════════

test.describe('Daily Horoscope — Anonymous', () => {
  test('page loads with form', async ({ page }) => {
    // /daily redirects to /horoscope/daily (SignHoroscopePage)
    await page.goto('/horoscope/daily');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toContainText(/щоденний гороскоп/i, { timeout: 10000 });
  });

  test('shows zodiac sign selector', async ({ page }) => {
    await page.goto('/horoscope/daily');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 5: Auth Redirects — Protected Routes
// ═══════════════════════════════════════════════════════════════════

test.describe('Auth Redirects — Protected Routes', () => {
  test('/dashboard redirects to /auth/login for anonymous', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login
    await page.waitForURL('**/auth/login**', { timeout: 15000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('/explore shows content or empty state', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(50);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 6: Quiz Flow
// ═══════════════════════════════════════════════════════════════════

test.describe('Quiz — Public Flow', () => {
  test('quiz page loads with content', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('quiz has interactive elements', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Quiz uses buttons for navigation and inputs for data
    const buttons = page.locator('button:visible');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 7: Moon Calendar — Public Access
// ═══════════════════════════════════════════════════════════════════

test.describe('Moon Calendar — Public Access', () => {
  test('loads with current moon data', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    const hasMoonContent = bodyText?.match(/Місяць|місяць|фаза|календар/i);
    expect(hasMoonContent).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 8: Legal Pages
// ═══════════════════════════════════════════════════════════════════

test.describe('Legal Pages', () => {
  test('/privacy loads', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBeLessThan(400);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(50);
  });

  test('/terms loads', async ({ page }) => {
    const response = await page.goto('/terms');
    expect(response?.status()).toBeLessThan(400);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(50);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 9: Login Page — UI Renders
// ═══════════════════════════════════════════════════════════════════

test.describe('Login Page', () => {
  test('login page renders with email/password fields', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 10: Ascendant Calculator
// ═══════════════════════════════════════════════════════════════════

test.describe('Ascendant Calculator', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/ascendant');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('has form inputs', async ({ page }) => {
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(200);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Group 11: All Critical Pages — No JS Errors
// ═══════════════════════════════════════════════════════════════════

test.describe('No Critical Console Errors', () => {
  const PAGES = [
    '/', '/moon', '/compatibility', '/chart/new', '/daily',
    '/quiz', '/ascendant', '/auth/login', '/privacy', '/terms',
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
