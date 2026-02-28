/**
 * Explore page tests — page was removed, now redirects to /dashboard.
 */

import { test, expect } from '@playwright/test';

test.describe('Explore Page (removed — redirects to dashboard)', () => {
  test('redirects to /dashboard', async ({ page }) => {
    await page.goto('/explore');
    // Should redirect to /dashboard (may go to /auth/login if not logged in)
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/dashboard|\/auth\/login/);
  });

  test('mobile: redirect works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/explore');
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/dashboard|\/auth\/login/);
  });
});
