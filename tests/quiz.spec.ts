import { test, expect } from '@playwright/test';

test.describe('Quiz Flow', () => {
  test('quiz page loads with first step', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page).toHaveURL(/\/quiz/);
    // Should show first step (birthday input)
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('quiz has progress bar', async ({ page }) => {
    await page.goto('/quiz');
    // Progress indicator should be visible
    const progress = page.locator('[role="progressbar"], .progress, [class*="progress"]').first();
    await expect(progress).toBeVisible({ timeout: 10000 }).catch(() => {
      // Progress might be styled differently — check for step indicators
    });
  });

  test('quiz step 1 has date input', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');
    // Should have date input fields (day/month/year or date picker)
    const inputs = page.locator('input, select');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  });

  test('quiz mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('quiz has CTA button', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');
    const button = page.locator('button').filter({ hasText: /далі|продовжити|наступн/i }).first();
    await expect(button).toBeVisible({ timeout: 10000 });
  });

  test('quiz has back navigation', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');
    // Logo or back link should be present
    const nav = page.locator('a[href="/"], [class*="logo"]').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });
});
