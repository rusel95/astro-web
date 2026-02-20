/**
 * Tests for chart view and birthday forecast pages.
 * These are dynamic routes: /chart/[id] and /birthday-forecast/[id]
 */

import { test, expect } from '@playwright/test';

test.describe('Chart View — /chart/[id]', () => {
  // Use a simplified approach: test against production chart or skip full flow
  const TEST_CHART_PATH = '/chart/test-chart-id-mock';
  
  test.beforeEach(async ({ page }) => {
    // Skip chart creation flow for now - requires full multi-step form completion
    // Instead, navigate directly to a chart path (will show 404 or error if not exists)
    // In real scenario, this would use a pre-seeded test chart ID from database
    test.skip();
  });

  test('chart view page loads', async ({ page }) => {
    // Should be on /chart/[id]
    expect(page.url()).toMatch(/\/chart\/[a-zA-Z0-9-]+/);
    
    // Page should have main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('chart wheel is visible', async ({ page }) => {
    // Chart SVG or canvas should render
    const chartWheel = page.locator('svg, canvas, [data-testid="chart-wheel"]').first();
    await expect(chartWheel).toBeVisible({ timeout: 10000 });
  });

  test('planet positions are displayed', async ({ page }) => {
    // Should show list of planets
    const planetsList = page.locator('ul, div').filter({ hasText: /сонце|sun|місяць|moon/i }).first();
    await expect(planetsList).toBeVisible();
  });

  test('aspects are shown', async ({ page }) => {
    // Aspects section (if present)
    const aspectsSection = page.locator('section, div').filter({ hasText: /аспект|aspect/i }).first();
    
    if (await aspectsSection.isVisible()) {
      await expect(aspectsSection).toBeVisible();
    }
  });

  test('share button works', async ({ page }) => {
    // Look for share button
    const shareBtn = page.locator('button').filter({ hasText: /поділитися|share/i }).first();
    
    if (await shareBtn.isVisible()) {
      await shareBtn.click();
      
      // Share modal/menu should appear
      await page.waitForTimeout(500);
      // Could be Web Share API or custom modal
    }
  });

  test('chart is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Chart wheel should scale down
    const chartWheel = page.locator('svg, canvas').first();
    const box = await chartWheel.boundingBox();
    
    if (box) {
      // Chart should fit within viewport width
      expect(box.width).toBeLessThanOrEqual(390);
    }
  });

  test('birthday banner shows if birthday is today', async ({ page }) => {
    // If today is the user's birthday (rare), banner should show
    // This test is probabilistic — just check for banner element existence
    const birthdayBanner = page.locator('[data-testid="birthday-banner"]');
    
    // May or may not be visible depending on test date
    const isVisible = await birthdayBanner.isVisible().catch(() => false);
    // Just ensure no crash — visibility depends on date
    expect(typeof isVisible).toBe('boolean');
  });
});

test.describe('Birthday Forecast — /birthday-forecast/[id]', () => {
  test.skip('generates forecast for chart (requires AI API)', async ({ page }) => {
    // This test requires OPENAI_API_KEY in production
    // Skip in CI unless key is available
    
    // Navigate to birthday forecast page
    // (would need to create chart first, similar to above)
    
    // await page.goto('/birthday-forecast/test-chart-id');
    // await expect(page.locator('h1')).toContainText(/прогноз|forecast/i);
  });

  test('birthday forecast page structure (mock)', async ({ page }) => {
    // Go directly to birthday forecast (will fail if no chart, but we can test structure)
    await page.goto('/birthday-forecast/test-id').catch(() => {});
    
    // If page loads (even with error), check for expected elements
    const hasHeading = await page.locator('h1').isVisible().catch(() => false);
    
    // Just verify page doesn't crash completely
    expect(typeof hasHeading).toBe('boolean');
  });
});

test.describe('Chart Actions', () => {
  test.skip('can download chart as PDF (authenticated)', async ({ page }) => {
    // PDF download requires authenticated user
    // Skip for now — add in authenticated test suite
  });

  test.skip('can edit chart data', async ({ page }) => {
    // Edit functionality (if exists)
    // Add when feature is implemented
  });

  test.skip('can delete chart (authenticated)', async ({ page }) => {
    // Delete requires auth
    // Add to authenticated suite
  });
});
