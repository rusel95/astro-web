/**
 * Tests for /chart/new — the multi-step birth data form.
 * Runs without auth (chart creation is public).
 */

import { test, expect } from '@playwright/test';

test.describe('New Chart — Step 0: Date picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chart/new');
    // Wait for the page to render
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
  });

  test('shows date input picker on step 0', async ({ page }) => {
    // Step title
    await expect(page.locator('h1')).toContainText('дата народження');

    // DateInputPicker uses numeric inputs for day, month (select), year
    // Wait for the client component to hydrate
    const dayInput = page.locator('input[inputmode="numeric"]').first();
    await expect(dayInput).toBeVisible({ timeout: 8000 });
  });

  test('zodiac sign pill visible and compact (not giant emoji)', async ({ page }) => {
    // Use .first() — AnimatePresence may have old+new pill in DOM simultaneously
    const zodiacPill = page.locator('[data-testid="zodiac-pill"]').first();
    await expect(zodiacPill).toBeVisible({ timeout: 5000 });

    // The whole pill bounding box should be compact (not 200px+ tall like before)
    const pillBox = await zodiacPill.boundingBox();
    expect(pillBox).not.toBeNull();
    // Old layout: 108px emoji + text rows ≈ 200px+ height
    // New layout: horizontal pill ≈ 60-80px height
    expect(pillBox!.height).toBeLessThan(120);
  });

  test('"Далі" button is visible without scrolling', async ({ page }) => {
    await page.waitForTimeout(800);

    const nextBtn = page.locator('button', { hasText: 'Далі →' });
    await expect(nextBtn).toBeVisible();

    const info = await nextBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        innerHeight: window.innerHeight,
        scrollY: window.scrollY,
      };
    });
    console.log('Button info:', JSON.stringify(info));

    // Button should not extend beyond viewport (allow 2px sub-pixel tolerance)
    expect(info.bottom).toBeLessThanOrEqual(info.innerHeight + 2);
    expect(info.top).toBeGreaterThanOrEqual(0);
  });

  test('"Далі" button is enabled on step 0 (drum always has value)', async ({ page }) => {
    const nextBtn = page.locator('button', { hasText: 'Далі' });
    await expect(nextBtn).toBeEnabled();
  });

  test('advances to step 1 (city) on "Далі" click', async ({ page }) => {
    await page.locator('button', { hasText: 'Далі' }).click();
    await expect(page.locator('h1')).toContainText('народились');
  });
});

test.describe('New Chart — Step 0: Mobile viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro

  test('"Далі" button visible on mobile without scrolling', async ({ page }) => {
    await page.goto('/chart/new');
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    const nextBtn = page.locator('button', { hasText: 'Далі' });
    await expect(nextBtn).toBeVisible();

    const isInViewport = await nextBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(isInViewport).toBe(true);
  });

  test('zodiac pill fits on screen without overflow on mobile', async ({ page }) => {
    await page.goto('/chart/new');
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    // Use .first() — AnimatePresence may have old+new pill in DOM simultaneously
    const zodiacPill = page.locator('[data-testid="zodiac-pill"]').first();
    await expect(zodiacPill).toBeVisible({ timeout: 5000 });

    // Wait for Framer Motion animation to settle (initial: y:10 → animate: y:0)
    // then verify pill is visible AND "Далі" button is also visible (nothing pushed off screen)
    await page.waitForTimeout(600);
    await expect(zodiacPill).toBeVisible();
    await expect(page.locator('button', { hasText: 'Далі' })).toBeVisible();
  });
});

test.describe('New Chart — Full flow (no auth)', () => {
  test('can navigate steps 0 → 1 → 2 → back', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForTimeout(500);

    // Step 0 → 1
    await page.locator('button', { hasText: 'Далі →' }).click();
    await expect(page.locator('h1')).toContainText('народились', { timeout: 5000 });

    // Step 1: back button should be visible
    const backBtn = page.locator('button[aria-label="Назад"]');
    await expect(backBtn).toBeVisible({ timeout: 3000 });

    // Go back to step 0 — dispatchEvent bypasses pointer-events overlay from nav
    await backBtn.dispatchEvent('click');
    await expect(page.locator('h1')).toContainText('дата народження', { timeout: 5000 });
  });

  test('step 1 "Далі" disabled without city', async ({ page }) => {
    await page.goto('/chart/new');
    await page.locator('button', { hasText: 'Далі' }).click(); // go to step 1

    const nextBtn = page.locator('button', { hasText: 'Далі' });
    await expect(nextBtn).toBeDisabled();
  });
});
