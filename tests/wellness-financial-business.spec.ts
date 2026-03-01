/**
 * Wellness, Financial, and Business insight pages tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Insights Pages', () => {
  test('/insights/wellness loads with heading', async ({ page }) => {
    await page.goto('/insights/wellness');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/велнес/i);
  });

  test('/insights/wellness shows form', async ({ page }) => {
    await page.goto('/insights/wellness');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('/insights/financial loads with heading', async ({ page }) => {
    await page.goto('/insights/financial');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/фінансов/i);
  });

  test('/insights/financial shows form', async ({ page }) => {
    await page.goto('/insights/financial');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('/insights/business loads with heading', async ({ page }) => {
    await page.goto('/insights/business');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/бізнес/i);
  });

  test('/insights/business shows form', async ({ page }) => {
    await page.goto('/insights/business');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('mobile: /insights/wellness no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/insights/wellness');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('mobile: /insights/financial no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/insights/financial');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('mobile: /insights/business no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/insights/business');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
