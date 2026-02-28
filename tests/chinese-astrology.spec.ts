/**
 * Chinese Astrology section tests (BaZi, forecast, compatibility).
 */

import { test, expect } from '@playwright/test';

test.describe('Chinese Astrology Pages', () => {
  test('/chinese loads with BaZi heading', async ({ page }) => {
    await page.goto('/chinese');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/bazi|чотири стовпи/i);
  });

  test('/chinese shows birth data form', async ({ page }) => {
    await page.goto('/chinese');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('/chinese/forecast loads', async ({ page }) => {
    await page.goto('/chinese/forecast');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/китайський прогноз|прогноз/i);
  });

  test('/chinese/compatibility loads', async ({ page }) => {
    await page.goto('/chinese/compatibility');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('mobile: /chinese no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/chinese');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('mobile: /chinese/forecast no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/chinese/forecast');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
