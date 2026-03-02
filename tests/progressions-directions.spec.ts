/**
 * Progressions and Directions pages tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Progressions and Directions Pages', () => {
  test('/progressions loads with heading', async ({ page }) => {
    await page.goto('/progressions');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/вторинні прогресії|прогресії/i);
  });

  test('/progressions shows form', async ({ page }) => {
    await page.goto('/progressions');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('/directions loads with heading', async ({ page }) => {
    await page.goto('/directions');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/сонячні дуги|дирекції/i);
  });

  test('/directions shows form', async ({ page }) => {
    await page.goto('/directions');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('mobile: /progressions no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/progressions');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('mobile: /directions no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/directions');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
