/**
 * Feature pages tests — all new astrology feature pages (Phases 9-18).
 * Tests that each page loads, shows the form/content, and works on mobile.
 */

import { test, expect } from '@playwright/test';

// All feature pages that use FeaturePageLayout (show birth data form for non-auth users)
const FEATURE_PAGES = [
  // Phase 9: Progressions & Directions
  { path: '/progressions', heading: /прогресії/i },
  { path: '/directions', heading: /дирекції/i },

  // Phase 10: Specialized Analyses
  { path: '/analysis/career', heading: /кар'єрний аналіз/i },
  { path: '/analysis/health', heading: /аналіз здоров/i },
  { path: '/analysis/karmic', heading: /кармічний/i },
  { path: '/analysis/psychological', heading: /психологічний/i },
  { path: '/analysis/spiritual', heading: /духовний/i },
  { path: '/analysis/vocational', heading: /покликання/i },
  { path: '/analysis/lunar', heading: /місячний аналіз/i },
  { path: '/analysis/relocation', heading: /релокац/i },

  // Phase 11: Tarot
  { path: '/tarot', heading: /таро/i },
  { path: '/tarot/single', heading: /таро|карт/i },
  { path: '/tarot/three-card', heading: /три карти|таро/i },
  { path: '/tarot/celtic-cross', heading: /кельтський хрест|таро/i },
  { path: '/tarot/houses', heading: /гороскопний розклад|таро/i },
  { path: '/tarot/tree-of-life', heading: /дерево|сефірот/i },
  { path: '/tarot/birth-cards', heading: /карти народження/i },
  { path: '/tarot/synastry', heading: /синастрійне таро|таро/i },
  { path: '/tarot/transit', heading: /транзитне таро|таро/i },

  // Phase 12: Chinese Astrology
  { path: '/chinese', heading: /bazi|чотири стовпи/i },
  { path: '/chinese/forecast', heading: /китайський прогноз|прогноз/i },
  { path: '/chinese/compatibility', heading: /китайська сумісність|сумісність/i },

  // Phase 13: Traditional Astrology
  { path: '/traditional', heading: /традиційний аналіз|традиційна/i },
  { path: '/traditional/profections', heading: /профекції/i },

  // Phase 14: Astrocartography
  { path: '/astrocartography', heading: /астрокартографія|карта ліній/i },
  { path: '/astrocartography/location', heading: /аналіз локації/i },

  // Phase 15: Numerology, Fixed Stars, Eclipses
  { path: '/numerology', heading: /нумерологія/i },
  { path: '/numerology/compatibility', heading: /нумерологічна сумісність/i },
  { path: '/fixed-stars', heading: /фіксовані зірки/i },
  { path: '/eclipses', heading: /затемнення/i },

  // Phase 16: Wellness, Financial, Business
  { path: '/insights/wellness', heading: /велнес/i },
  { path: '/insights/financial', heading: /фінансові/i },
  { path: '/insights/business', heading: /бізнес/i },

  // Phase 17: Glossary
  { path: '/glossary', heading: /глосарій/i },

  // Phase 18: Settings
  { path: '/settings', heading: /налаштування/i },
];

test.describe('Feature Pages — Desktop (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const fp of FEATURE_PAGES) {
    test(`${fp.path} loads with heading`, async ({ page }) => {
      await page.goto(fp.path, { waitUntil: 'domcontentloaded' });
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 15000 });
      if (fp.heading) {
        await expect(heading).toContainText(fp.heading);
      }
    });
  }
});

test.describe('Feature Pages — Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const fp of FEATURE_PAGES) {
    test(`${fp.path} no horizontal overflow on mobile`, async ({ page }) => {
      await page.goto(fp.path, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(395);
    });
  }
});

test.describe('Feature Pages — Form Presence', () => {
  // Pages that show a birth data form for non-auth users
  const FORM_PAGES = [
    '/progressions',
    '/directions',
    '/analysis/career',
    '/numerology',
    '/fixed-stars',
    '/insights/wellness',
    '/insights/financial',
    '/insights/business',
    '/astrocartography',
    '/astrocartography/location',
    '/traditional',
    '/traditional/profections',
  ];

  for (const path of FORM_PAGES) {
    test(`${path} shows birth data form or result`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      // Either a form with input or a result section should be present
      const formOrResult = page.locator('input, [class*="AnalysisSection"], button[type="submit"]').first();
      await expect(formOrResult).toBeVisible({ timeout: 15000 });
    });
  }
});
