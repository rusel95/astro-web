/**
 * Ascendant page tests — page was removed, now redirects to /chart/new.
 */

import { test, expect } from '@playwright/test';

test.describe('Ascendant Calculator (removed — redirects to /chart/new)', () => {
  test('redirects to /chart/new', async ({ page }) => {
    await page.goto('/ascendant');
    const finalUrl = page.url();
    expect(finalUrl).toContain('/chart/new');
  });

  test('mobile: redirect works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ascendant');
    const finalUrl = page.url();
    expect(finalUrl).toContain('/chart/new');
  });
});
