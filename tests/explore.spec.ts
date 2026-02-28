/**
 * Explore page tests — API demo features.
 */

import { test, expect } from '@playwright/test';

test.describe('Explore Page', () => {
  test('loads with heading', async ({ page }) => {
    await page.goto('/explore');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('has feature cards', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    const body = await page.textContent('body');
    // Should have some of the feature card texts
    const hasContent = body?.match(/гороскоп|транзити|нумерологія/i);
    expect(hasContent).toBeTruthy();
  });

  test('mobile: no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });
});
