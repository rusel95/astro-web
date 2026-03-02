/**
 * Tarot section tests.
 */

import { test, expect } from '@playwright/test';

const TAROT_PAGES = [
  { path: '/tarot', heading: /таро/i },
  { path: '/tarot/single', heading: /одна карта|таро/i },
  { path: '/tarot/three-card', heading: /три карти|таро/i },
  { path: '/tarot/celtic-cross', heading: /кельтський хрест|таро/i },
  { path: '/tarot/houses', heading: /гороскопний розклад|таро/i },
  { path: '/tarot/tree-of-life', heading: /дерево|сефірот|таро/i },
  { path: '/tarot/birth-cards', heading: /карти народження/i },
  { path: '/tarot/synastry', heading: /синастрійне|таро/i },
  { path: '/tarot/transit', heading: /транзитне|таро/i },
];

test.describe('Tarot Pages — Desktop', () => {
  for (const tp of TAROT_PAGES) {
    test(`${tp.path} loads with heading`, async ({ page }) => {
      await page.goto(tp.path, { waitUntil: 'domcontentloaded' });
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 15000 });
      await expect(heading).toContainText(tp.heading);
    });
  }

  test('tarot spread has draw button', async ({ page }) => {
    await page.goto('/tarot/single');
    await page.waitForLoadState('networkidle').catch(() => {});
    const drawBtn = page.locator('button').filter({ hasText: /витягнути|draw/i }).first();
    await expect(drawBtn).toBeVisible({ timeout: 10000 });
  });

  test('birth-cards page has form input', async ({ page }) => {
    await page.goto('/tarot/birth-cards');
    await page.waitForLoadState('networkidle').catch(() => {});
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Tarot Pages — Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const tp of TAROT_PAGES) {
    test(`${tp.path} no overflow on mobile`, async ({ page }) => {
      await page.goto(tp.path, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(395);
    });
  }
});
