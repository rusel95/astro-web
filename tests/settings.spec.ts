/**
 * Settings page tests — account deletion flow.
 */

import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test('loads with heading', async ({ page }) => {
    await page.goto('/settings');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(/налаштування/i);
  });

  test('has delete account section', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => {});
    const deleteSection = page.locator('text=/видалення акаунта/i').first();
    await expect(deleteSection).toBeVisible({ timeout: 10000 });
  });

  test('has delete account button', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => {});
    const deleteBtn = page.locator('button').filter({ hasText: /видалити акаунт/i }).first();
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
  });

  test('delete confirmation dialog appears on click', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => {});
    const deleteBtn = page.locator('button').filter({ hasText: /видалити акаунт/i }).first();
    if (await deleteBtn.isVisible().catch(() => false)) {
      await deleteBtn.click();
      // Confirmation input should appear
      const confirmInput = page.locator('input[placeholder*="ВИДАЛИТИ"]').first();
      await expect(confirmInput).toBeVisible({ timeout: 5000 });
    }
  });

  test('has cancel button in confirmation dialog', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => {});
    const deleteBtn = page.locator('button').filter({ hasText: /видалити акаунт/i }).first();
    if (await deleteBtn.isVisible().catch(() => false)) {
      await deleteBtn.click();
      const cancelBtn = page.locator('button').filter({ hasText: /скасувати/i }).first();
      await expect(cancelBtn).toBeVisible({ timeout: 5000 });
      // Clicking cancel dismisses the dialog
      await cancelBtn.click();
      await expect(cancelBtn).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('has SEO metadata', async ({ page }) => {
    await page.goto('/settings');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('налаштування');
  });

  test('mobile: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => {});
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
