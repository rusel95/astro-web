/**
 * Analysis pages tests (career, health, karmic, psychological, spiritual, vocational, lunar, relocation).
 */

import { test, expect } from '@playwright/test';

const analysisPages = [
  { path: '/analysis/career', heading: /кар.єрний аналіз/i },
  { path: '/analysis/health', heading: /аналіз здоров.я/i },
  { path: '/analysis/karmic', heading: /карміч/i },
  { path: '/analysis/psychological', heading: /психологіч/i },
  { path: '/analysis/spiritual', heading: /духовн/i },
  { path: '/analysis/vocational', heading: /вокаціон|призначен/i },
  { path: '/analysis/lunar', heading: /місяч/i },
  { path: '/analysis/relocation', heading: /релокац/i },
];

test.describe('Analysis Pages', () => {
  for (const { path, heading } of analysisPages) {
    test(`${path} loads with heading`, async ({ page }) => {
      await page.goto(path);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 10000 });
      await expect(h1).toContainText(heading);
    });

    test(`${path} shows birth data form`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle').catch(() => {});
      const input = page.locator('input').first();
      await expect(input).toBeVisible({ timeout: 10000 });
    });

    test(`mobile: ${path} no overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      await page.waitForLoadState('networkidle').catch(() => {});
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(395);
    });
  }
});
