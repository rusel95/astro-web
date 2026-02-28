/**
 * Legal pages tests — /terms and /privacy.
 */

import { test, expect } from '@playwright/test';

test.describe('Terms Page', () => {
  test('loads with correct heading', async ({ page }) => {
    await page.goto('/terms');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 8000 });
    await expect(h1).toContainText(/користувацька угода/i);
  });

  test('has disclaimer about entertainment', async ({ page }) => {
    await page.goto('/terms');
    const text = await page.textContent('body');
    expect(text).toContain('розважальний характер');
  });

  test('has last updated date', async ({ page }) => {
    await page.goto('/terms');
    const updated = page.locator('text=/оновлення/i').first();
    await expect(updated).toBeVisible({ timeout: 8000 });
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/terms');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('угода');
  });

  test('mobile: no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/terms');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });
});

test.describe('Privacy Page', () => {
  test('loads with correct heading', async ({ page }) => {
    await page.goto('/privacy');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 8000 });
    await expect(h1).toContainText(/конфіденційності/i);
  });

  test('has data collection section', async ({ page }) => {
    await page.goto('/privacy');
    const section = page.locator('text=/дані ми збираємо/i').first();
    await expect(section).toBeVisible({ timeout: 8000 });
  });

  test('has user rights section', async ({ page }) => {
    await page.goto('/privacy');
    const rights = page.locator('text=/ваші права/i').first();
    await expect(rights).toBeVisible({ timeout: 8000 });
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/privacy');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('конфіденційності');
  });

  test('mobile: no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });
});
