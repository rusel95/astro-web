/**
 * Visual regression tests — screenshots of all major pages.
 * Baseline screenshots stored in tests/screenshots/baseline/
 * Compare against on each run to detect UI regressions.
 */

import { test, expect } from '@playwright/test';

const PAGES_TO_SCREENSHOT = [
  { path: '/', name: 'home' },
  { path: '/chart/new', name: 'chart-new-step0' },
  { path: '/compatibility', name: 'compatibility' },
  { path: '/zodiac/aries', name: 'zodiac-aries' },
  { path: '/zodiac/leo', name: 'zodiac-leo' },
  { path: '/horoscopes/personality', name: 'horoscope-personality' },
  { path: '/horoscopes/love', name: 'horoscope-love' },
  { path: '/auth/login', name: 'auth-login' },
];

test.describe('Visual Regression — Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const page of PAGES_TO_SCREENSHOT) {
    test(`${page.name}: desktop screenshot`, async ({ page: pw }) => {
      await pw.goto(page.path);
      
      // Wait for page to fully load
      await pw.waitForLoadState('networkidle');
      await pw.waitForTimeout(1000); // Wait for animations
      
      // Take screenshot
      await expect(pw).toHaveScreenshot(`${page.name}-desktop.png`, {
        fullPage: true,
        animations: 'disabled',
        mask: [
          // Mask dynamic content (dates, times, user-specific data)
          pw.locator('[data-testid="current-date"]'),
          pw.locator('[data-testid="user-avatar"]'),
        ],
      });
    });
  }
});

test.describe('Visual Regression — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro

  for (const page of PAGES_TO_SCREENSHOT) {
    test(`${page.name}: mobile screenshot`, async ({ page: pw }) => {
      await pw.goto(page.path);
      
      await pw.waitForLoadState('networkidle');
      await pw.waitForTimeout(1000);
      
      await expect(pw).toHaveScreenshot(`${page.name}-mobile.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});

test.describe('Visual Regression — Dark Mode (if supported)', () => {
  test.use({ 
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark',
  });

  test('home: dark mode screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('home-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('chart-new: dark mode screenshot', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('chart-new-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression — Interactive States', () => {
  test('button hover states', async ({ page }) => {
    await page.goto('/');
    
    const cta = page.locator('button, a[href="/chart/new"]').first();
    if (await cta.isVisible()) {
      // Hover
      await cta.hover();
      await page.waitForTimeout(300);
      
      await expect(page).toHaveScreenshot('button-hover.png', {
        clip: await cta.boundingBox() || undefined,
      });
    }
  });

  test('form input focus states', async ({ page }) => {
    await page.goto('/chart/new');
    
    const input = page.locator('input').first();
    await input.focus();
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('input-focus.png', {
      clip: await input.boundingBox() || undefined,
    });
  });
});

test.describe('Visual Regression — Component Isolation', () => {
  test('zodiac pill component', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForTimeout(1000);
    
    const zodiacPill = page.locator('[data-testid="zodiac-pill"]').first();
    if (await zodiacPill.isVisible()) {
      await expect(zodiacPill).toHaveScreenshot('zodiac-pill.png');
    }
  });

  test('navigation menu', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav, header').first();
    if (await nav.isVisible()) {
      await expect(nav).toHaveScreenshot('navigation.png');
    }
  });
});
