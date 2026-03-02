/**
 * Eclipses page tests.
 */

import { test, expect } from '@playwright/test';

test.describe('Eclipses Page', () => {
  test('loads with heading', async ({ page }) => {
    await page.goto('/eclipses');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/затемнення/i);
  });

  test('shows upcoming eclipses section', async ({ page }) => {
    await page.goto('/eclipses');
    await page.waitForLoadState('networkidle').catch(() => {});
    // Either shows the eclipses list or a loading state
    const content = page.locator('text=/затемнення|solar|lunar|місячне|сонячне/i').first();
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('has natal impact section with form', async ({ page }) => {
    await page.goto('/eclipses');
    await page.waitForLoadState('networkidle').catch(() => {});
    // Should have the natal impact form section
    const natalSection = page.locator('text=/вплив на натальну карту/i').first();
    await expect(natalSection).toBeVisible({ timeout: 10000 });
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/eclipses');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('затемнення');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/eclipses');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
