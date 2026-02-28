/**
 * Glossary page tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Glossary Page', () => {
  test('loads with heading', async ({ page }) => {
    await page.goto('/glossary');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/глосарій/i);
  });

  test('has search input', async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForLoadState('networkidle').catch(() => {});
    const searchInput = page.locator('input[placeholder*="Пошук"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('search input is interactive', async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForLoadState('networkidle').catch(() => {});
    const searchInput = page.locator('input[placeholder*="Пошук"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('Сонце');
      await expect(searchInput).toHaveValue('Сонце');
    }
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/glossary');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('глосарій');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
  });

  test('desktop: shows glossary content or loading state', async ({ page }) => {
    await page.goto('/glossary');
    await page.waitForLoadState('networkidle').catch(() => {});
    // Either glossary data sections or loading skeleton
    const content = page.locator('[class*="animate-pulse"], [role="region"], h3, [class*="AnalysisSection"]').first();
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/glossary');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('desktop: no horizontal overflow (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/glossary');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(1300);
  });
});
