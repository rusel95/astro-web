/**
 * Tests for all horoscope types.
 * Each type has different content/focus but similar structure.
 */

import { test, expect } from '@playwright/test';

const HOROSCOPE_TYPES = [
  { slug: 'personality', name: 'Особистість', icon: '🧠' },
  { slug: 'love', name: 'Любов', icon: '❤️' },
  { slug: 'career', name: "Кар'єра", icon: '💼' },
  { slug: 'health', name: "Здоров'я", icon: '💪' },
  { slug: 'forecast', name: 'Прогноз', icon: '🔮' },
  { slug: 'compatibility', name: 'Сумісність', icon: '💑' },
];

test.describe('Horoscope Pages — All Types', () => {
  for (const type of HOROSCOPE_TYPES) {
    test(`${type.name}: page loads correctly`, async ({ page }) => {
      await page.goto(`/horoscopes/${type.slug}`);
      
      // Check URL
      await expect(page).toHaveURL(`/horoscopes/${type.slug}`);
      
      // Check heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 8000 });
    });

    test(`${type.name}: has content/description`, async ({ page }) => {
      await page.goto(`/horoscopes/${type.slug}`);
      
      // Should have explanatory text
      const content = page.locator('p, article, section').first();
      await expect(content).toBeVisible();
      
      const text = await content.textContent();
      expect(text?.length).toBeGreaterThan(30);
    });

    test(`${type.name}: mobile responsive`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/horoscopes/${type.slug}`);
      
      await page.waitForLoadState('networkidle');
      
      // No horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(410); // 390 + scrollbar tolerance
    });
  }
});

test.describe('Horoscope Pages — Interactive Elements', () => {
  test('Personality: has form/input for birth data', async ({ page }) => {
    await page.goto('/horoscopes/personality');
    
    // Should have some way to input birth info (or link to chart creation)
    const hasInput = 
      await page.locator('input, select, button').first().isVisible() ||
      await page.locator('a[href*="/chart"]').first().isVisible();
    
    expect(hasInput).toBeTruthy();
  });

  test('Love: has relevant content', async ({ page }) => {
    await page.goto('/horoscopes/love');
    
    // Page text should mention love/relationships
    const bodyText = await page.locator('body').textContent();
    const hasLoveContent = 
      bodyText?.match(/любов|відносин|партнер|romance|relationship/i);
    
    expect(hasLoveContent).toBeTruthy();
  });

  test('Career: has relevant content', async ({ page }) => {
    await page.goto('/horoscopes/career');
    
    const bodyText = await page.locator('body').textContent();
    const hasCareerContent = 
      bodyText?.match(/кар'єр|робот|професі|career|work|job/i);
    
    expect(hasCareerContent).toBeTruthy();
  });

  test('Health: has relevant content', async ({ page }) => {
    await page.goto('/horoscopes/health');
    
    const bodyText = await page.locator('body').textContent();
    const hasHealthContent = 
      bodyText?.match(/здоров|фізичн|енергі|health|wellness|energy/i);
    
    expect(hasHealthContent).toBeTruthy();
  });
});

test.describe('Horoscope Pages — Navigation', () => {
  test('can navigate between horoscope types', async ({ page }) => {
    await page.goto('/horoscopes/personality');
    
    // Look for links to other horoscope types
    const otherHoroscope = page.locator('a[href*="/horoscopes/"]').nth(1);
    
    if (await otherHoroscope.isVisible()) {
      await otherHoroscope.click();
      await expect(page).toHaveURL(/\/horoscopes\/[a-z]+/);
    }
  });

  test('breadcrumb/back navigation works', async ({ page }) => {
    await page.goto('/');
    await page.goto('/horoscopes/forecast');
    
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Horoscope Pages — SEO', () => {
  test('Forecast: has proper meta tags', async ({ page }) => {
    await page.goto('/horoscopes/forecast');
    
    // Check page title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
  });

  test('Compatibility: has Open Graph tags', async ({ page }) => {
    await page.goto('/horoscopes/compatibility');
    
    // Wait for meta tags (may need rebuild on production)
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content', { timeout: 5000 }).catch(() => null);
    expect(ogTitle).toBeTruthy();
  });
});

test.describe('Horoscope Pages — Performance', () => {
  test('Love: loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/horoscopes/love');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('Career: no render-blocking resources', async ({ page }) => {
    await page.goto('/horoscopes/career');
    
    // Check that first contentful paint happens quickly
    const metrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint');
      return fcp ? fcp.startTime : null;
    });
    
    if (metrics) {
      expect(metrics).toBeLessThan(2000); // FCP < 2s
    }
  });
});
