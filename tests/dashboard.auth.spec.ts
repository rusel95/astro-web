/**
 * Dashboard tests — require auth (uses saved storage state from auth.setup.ts).
 *
 * To run:
 *   TEST_EMAIL=... TEST_PASSWORD=... npx playwright test --project=setup
 *   npx playwright test --project=authenticated
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard (authenticated)', () => {
  test('shows dashboard after login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    // Should not redirect to login
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });

  test('dashboard shows user charts or empty state', async ({ page }) => {
    await page.goto('/dashboard');
    // Either charts list or empty state message
    const hasCharts = await page.locator('[data-testid="chart-card"]').count() > 0;
    const hasEmpty = await page.locator('text=/немає|пусто|карт/i').count() > 0;
    expect(hasCharts || hasEmpty).toBe(true);
  });

  test('can navigate to new chart from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    const newChartLink = page.locator('a[href="/chart/new"], button', { hasText: /нова карта|створити/i });
    if (await newChartLink.count() > 0) {
      await newChartLink.first().click();
      await expect(page).toHaveURL(/\/chart\/new/);
    }
  });
});
