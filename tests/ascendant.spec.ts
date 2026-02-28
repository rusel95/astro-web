import { test, expect } from '@playwright/test';

test.describe('Ascendant Calculator', () => {
  test('page loads with hero and form', async ({ page }) => {
    await page.goto('/ascendant');
    await expect(page).toHaveURL(/\/ascendant/);
    // Should have title about ascendant
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/асцендент/i);
  });

  test('has birth date input', async ({ page }) => {
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');
    const inputs = page.locator('input');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  });

  test('has time input (required for ascendant)', async ({ page }) => {
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');
    // Should have time-related input
    const timeLabel = page.locator('label').filter({ hasText: /час народження/i }).first();
    await expect(timeLabel).toBeVisible({ timeout: 10000 });
  });

  test('has city search input', async ({ page }) => {
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');
    const cityLabel = page.locator('text=/місто/i');
    await expect(cityLabel).toBeVisible({ timeout: 10000 });
  });

  test('calculate button is disabled without data', async ({ page }) => {
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');
    const button = page.locator('button').filter({ hasText: /розрахувати|обчислити/i }).first();
    await expect(button).toBeVisible({ timeout: 10000 });
    await expect(button).toBeDisabled();
  });

  test('has Big Three explanation section', async ({ page }) => {
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');
    const bigThree = page.locator('text=/велика трійка/i');
    await expect(bigThree).toBeVisible({ timeout: 10000 });
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/ascendant');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('асцендент');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(30);
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ascendant');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });
});
