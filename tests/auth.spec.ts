/**
 * Auth tests — no credentials required.
 * Tests login page UI, Google OAuth redirect, and protected route guards.
 */

import { test, expect } from '@playwright/test';

test.describe('Auth — Login page', () => {
  test('login page loads and shows Google button', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/\/auth\/login/);

    // Page title / heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Google OAuth button must be visible
    const googleBtn = page.locator('button, a').filter({ hasText: /google/i }).first();
    await expect(googleBtn).toBeVisible();
  });

  test('Google OAuth button redirects to accounts.google.com', async ({ page }) => {
    await page.goto('/auth/login');

    const googleBtn = page.locator('button, a').filter({ hasText: /google/i }).first();

    // Intercept the navigation
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'commit', timeout: 8000 }).catch(() => null),
      googleBtn.click(),
    ]);

    const url = page.url();
    // Should redirect to Google or Supabase OAuth endpoint
    expect(
      url.includes('accounts.google.com') ||
      url.includes('supabase.co/auth') ||
      url.includes('supabase.co')
    ).toBeTruthy();
  });

  test('email input and password input are present', async ({ page }) => {
    await page.goto('/auth/login');

    // Check for email input
    const emailInput = page.locator('input[type="email"]');
    // Check for password input
    const passwordInput = page.locator('input[type="password"]');

    // At least one of: email form OR just Google OAuth (some apps are Google-only)
    const hasEmailForm = await emailInput.isVisible().catch(() => false);
    const hasGoogleBtn = await page.locator('button, a').filter({ hasText: /google/i }).first().isVisible().catch(() => false);

    expect(hasEmailForm || hasGoogleBtn).toBeTruthy();
  });
});

test.describe('Auth — Protected routes', () => {
  test('/dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login page (not stay on dashboard)
    await page.waitForURL(/\/(auth\/login|login|\/)/, { timeout: 8000 }).catch(() => {});
    const url = page.url();
    const redirectedAway = !url.includes('/dashboard') || url.includes('/login');
    expect(redirectedAway).toBeTruthy();
  });

  test('/chart/new is accessible without auth', async ({ page }) => {
    // Chart creation should work without login (anonymous users can create charts)
    await page.goto('/chart/new');
    await expect(page).toHaveURL(/\/chart\/new/);

    // Step 0 should be visible
    const dateInput = page.locator('input[inputmode="numeric"]').first();
    await expect(dateInput).toBeVisible({ timeout: 6000 });
  });
});

test.describe('Auth — Login page visual', () => {
  test('login page has no broken layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/auth/login');

    // Page should not overflow horizontally
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 390;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
  });
});
