/**
 * Redirect tests — verifies all removed pages redirect correctly.
 * Phase 18: Cleanup redirects.
 */

import { test, expect } from '@playwright/test';

const REDIRECTS = [
  { from: '/explore', to: /\/dashboard|\/auth\/login/ },
  { from: '/ascendant', to: /\/chart\/new/ },
  { from: '/daily', to: /\/horoscope\/daily/ },
  { from: '/horoscopes/career', to: /\/horoscope\/career/ },
  { from: '/horoscopes/love', to: /\/horoscope\/love/ },
  { from: '/horoscopes/health', to: /\/horoscope\/health/ },
  { from: '/horoscopes/personality', to: /\/horoscope\/personality/ },
  { from: '/horoscopes/compatibility', to: /\/horoscope\/love-compatibility/ },
  { from: '/horoscopes/forecast', to: /\/horoscope\/monthly/ },
];

test.describe('Page Redirects', () => {
  for (const redirect of REDIRECTS) {
    test(`${redirect.from} → ${redirect.to}`, async ({ page }) => {
      await page.goto(redirect.from);
      const finalUrl = page.url();
      expect(finalUrl).toMatch(redirect.to);
    });
  }

  test('mobile: /explore redirects on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/explore');
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/dashboard|\/auth\/login/);
  });

  test('mobile: /ascendant redirects on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/ascendant');
    expect(page.url()).toContain('/chart/new');
  });
});
