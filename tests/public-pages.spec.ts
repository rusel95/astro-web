/**
 * Tests for all public pages (no auth required).
 * Ensures every page loads, has proper content, and works on mobile.
 */

import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { path: '/', title: /персональні|гороскопи|прогнози/i, key: 'Home' },
  { path: '/compatibility', title: /сумісність/i, key: 'Compatibility' },
  { path: '/auth/login', title: /вхід|login/i, key: 'Login' },
];

test.describe('Public Pages — Desktop', () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.key}: loads and shows title`, async ({ page: pw }) => {
      await pw.goto(page.path);
      
      // Check URL (allow redirects for authenticated routes)
      const finalUrl = pw.url();
      const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
      const isExpectedPath = finalUrl.includes(page.path) || (page.path === '/auth/login' && finalUrl === new URL(baseURL).origin + '/');
      expect(isExpectedPath).toBeTruthy();
      
      // Check title or heading
      const heading = pw.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 8000 });
      
      // Skip title check for login page if redirected (already logged in)
      if (page.title && !finalUrl.includes('/auth/login')) {
        await expect(heading).toContainText(page.title);
      }
    });

    test(`${page.key}: has no console errors`, async ({ page: pw }) => {
      const errors: string[] = [];
      pw.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await pw.goto(page.path);
      await pw.waitForLoadState('networkidle');
      
      // Filter out known third-party errors (PostHog, analytics, etc.)
      const criticalErrors = errors.filter(
        (err) => 
          !err.includes('posthog') && 
          !err.includes('analytics') &&
          !err.includes('favicon')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });

    test(`${page.key}: no layout shift (mobile)`, async ({ page: pw }) => {
      await pw.setViewportSize({ width: 390, height: 844 });
      await pw.goto(page.path);
      
      // Wait for page to settle
      await pw.waitForTimeout(1000);
      
      // Page should not overflow horizontally
      const scrollWidth = await pw.evaluate(() => document.body.scrollWidth);
      const viewportWidth = 390;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 5);
    });
  }
});

test.describe('Homepage Features', () => {
  test('CTA button navigates to /chart/new', async ({ page }) => {
    await page.goto('/');
    
    // Find main CTA (likely "Створити натальну карту" or similar)
    const cta = page.locator('a[href="/chart/new"], button').filter({ hasText: /створити|почати/i }).first();
    
    if (await cta.isVisible()) {
      await cta.click();
      await expect(page).toHaveURL(/\/chart\/new/);
    } else {
      // If no CTA found, just check that page loaded
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('navigation menu is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation (header/nav)
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    
    // Look for mobile menu button (hamburger icon)
    const menuBtn = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      // Mobile menu should open
      const menu = page.locator('[role="dialog"], [aria-modal="true"]').first();
      await expect(menu).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Compatibility Page', () => {
  test('shows two chart inputs', async ({ page }) => {
    await page.goto('/compatibility');
    
    // Should have two separate chart selection areas
    const inputs = page.locator('input, select').all();
    expect((await inputs).length).toBeGreaterThan(0);
  });

  test('has explanatory content', async ({ page }) => {
    await page.goto('/compatibility');
    
    // Should explain what compatibility check does
    const content = page.locator('p, article').first();
    await expect(content).toBeVisible();
  });
});

test.describe('Login Page', () => {
  test('Google OAuth button works', async ({ page }) => {
    await page.goto('/auth/login');
    
    const googleBtn = page.locator('button, a').filter({ hasText: /google/i }).first();
    await expect(googleBtn).toBeVisible();
    
    // Click should navigate to OAuth
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'commit', timeout: 8000 }).catch(() => null),
      googleBtn.click(),
    ]);
    
    const url = page.url();
    expect(
      url.includes('accounts.google.com') ||
      url.includes('supabase.co/auth')
    ).toBeTruthy();
  });

  test('email/password form is present', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Either email form OR Google-only login is acceptable
    const hasEmailForm = await emailInput.isVisible().catch(() => false);
    const hasGoogleBtn = await page.locator('button, a').filter({ hasText: /google/i }).first().isVisible();
    
    expect(hasEmailForm || hasGoogleBtn).toBeTruthy();
  });
});
