/**
 * Astrocartography section tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Astrocartography Pages', () => {
  test('/astrocartography loads with heading', async ({ page }) => {
    await page.goto('/astrocartography');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/астрокартографія/i);
  });

  test('/astrocartography shows birth data form', async ({ page }) => {
    await page.goto('/astrocartography');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('/astrocartography/location loads with heading', async ({ page }) => {
    await page.goto('/astrocartography/location');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/аналіз локації/i);
  });

  test('/astrocartography/location shows form', async ({ page }) => {
    await page.goto('/astrocartography/location');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('mobile: /astrocartography no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/astrocartography');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('mobile: /astrocartography/location no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/astrocartography/location');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
