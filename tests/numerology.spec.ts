/**
 * Numerology feature tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Numerology Page', () => {
  test('loads with heading and description', async ({ page }) => {
    await page.goto('/numerology');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/нумерологія/i);
  });

  test('shows birth data form', async ({ page }) => {
    await page.goto('/numerology');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/numerology');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('нумерологі');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(20);
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/numerology');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});

test.describe('Numerology Compatibility Page', () => {
  test('loads with heading', async ({ page }) => {
    await page.goto('/numerology/compatibility');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/нумерологічна сумісність/i);
  });

  test('shows two-step form (Person 1 first)', async ({ page }) => {
    await page.goto('/numerology/compatibility');
    await page.waitForLoadState('networkidle').catch(() => {});
    const person1Label = page.locator('text=/перша особа/i').first();
    await expect(person1Label).toBeVisible({ timeout: 10000 });
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/numerology/compatibility');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
