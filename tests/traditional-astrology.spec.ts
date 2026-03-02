/**
 * Traditional Astrology section tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Traditional Astrology Pages', () => {
  test('/traditional loads with heading', async ({ page }) => {
    await page.goto('/traditional');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/традиційний аналіз|традиційна/i);
  });

  test('/traditional shows birth data form', async ({ page }) => {
    await page.goto('/traditional');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('/traditional/profections loads with heading', async ({ page }) => {
    await page.goto('/traditional/profections');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/профекції/i);
  });

  test('/traditional/profections shows form', async ({ page }) => {
    await page.goto('/traditional/profections');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('mobile: /traditional no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/traditional');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('mobile: /traditional/profections no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/traditional/profections');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
