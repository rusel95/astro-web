/**
 * Cross-sell CTA tests — verify CTAs on chart, compatibility, and moon pages.
 */

import { test, expect } from '@playwright/test';

test.describe('Cross-sell CTAs', () => {
  test('moon page has calendar CTA', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');
    const cta = page.locator('a[href="/horoscope/calendar"]').first();
    await expect(cta).toBeVisible({ timeout: 15000 });
    const text = await cta.textContent();
    expect(text).toContain('Персональний Місячний Календар');
  });

  test('moon CTA navigates to product page', async ({ page }) => {
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');
    const cta = page.locator('a[href="/horoscope/calendar"]').first();
    await expect(cta).toBeVisible({ timeout: 15000 });
    await cta.click();
    await expect(page).toHaveURL(/\/horoscope\/calendar/);
  });

  test('moon CTA mobile: visible and not overflowing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/moon');
    await page.waitForLoadState('networkidle');
    const cta = page.locator('a[href="/horoscope/calendar"]').first();
    await expect(cta).toBeVisible({ timeout: 15000 });
  });
});
