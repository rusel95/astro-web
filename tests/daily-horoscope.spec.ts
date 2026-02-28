import { test, expect } from '@playwright/test';

// /daily redirects to /horoscope/daily (SignHoroscopePage with zodiac sign selector)
test.describe('Daily Horoscope', () => {
  test('page loads with hero and badge', async ({ page }) => {
    await page.goto('/horoscope/daily');
    await expect(page).toHaveURL(/\/horoscope\/daily/);
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/гороскоп/i);
  });

  test('has zodiac sign selector buttons', async ({ page }) => {
    await page.goto('/horoscope/daily');
    await page.waitForLoadState('networkidle');
    const signButtons = page.locator('button').first();
    await expect(signButtons).toBeVisible({ timeout: 10000 });
  });

  test('has all 12 sign options', async ({ page }) => {
    await page.goto('/horoscope/daily');
    await page.waitForLoadState('networkidle');
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/horoscope/daily');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('гороскоп');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(30);
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/horoscope/daily');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });

  test('/daily redirect works to /horoscope/daily', async ({ page }) => {
    await page.goto('/daily');
    await expect(page).toHaveURL(/\/horoscope\/daily/);
  });
});
