import { test, expect } from '@playwright/test';

test.describe('Daily Horoscope', () => {
  test('page loads with hero and badge', async ({ page }) => {
    await page.goto('/daily');
    await expect(page).toHaveURL(/\/daily/);
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/гороскоп/i);
  });

  test('has free badge', async ({ page }) => {
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    const badge = page.locator('span, div').filter({ hasText: /безкоштовно/i }).first();
    await expect(badge).toBeVisible({ timeout: 10000 });
  });

  test('has birth date input form', async ({ page }) => {
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    const inputs = page.locator('input');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  });

  test('has submit button', async ({ page }) => {
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    const button = page.locator('button').filter({ hasText: /дізнати|прогноз/i }).first();
    await expect(button).toBeVisible({ timeout: 10000 });
  });

  test('has SEO info section', async ({ page }) => {
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    const seoSection = page.locator('text=/про щоденний гороскоп/i');
    await expect(seoSection).toBeVisible({ timeout: 10000 });
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/daily');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('гороскоп');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(30);
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });
});
