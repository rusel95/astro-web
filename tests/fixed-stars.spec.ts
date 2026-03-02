/**
 * Fixed Stars page tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Fixed Stars Page', () => {
  test('/fixed-stars loads with heading', async ({ page }) => {
    await page.goto('/fixed-stars');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/фіксовані зірки/i);
  });

  test('/fixed-stars shows birth data form', async ({ page }) => {
    await page.goto('/fixed-stars');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('mobile: /fixed-stars no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/fixed-stars');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
