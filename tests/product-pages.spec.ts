import { test, expect } from '@playwright/test';

const PRODUCT_SLUGS = [
  'personality', 'talent', 'love', 'marriage',
  'love-compatibility', 'conception', 'pregnancy', 'children',
  'health', 'calendar', 'monthly', '3-years',
  'finance', 'career', 'business', '2026',
];

test.describe('Product Pages (/horoscope/[slug])', () => {
  for (const slug of PRODUCT_SLUGS) {
    test(`/horoscope/${slug} loads correctly`, async ({ page }) => {
      const response = await page.goto(`/horoscope/${slug}`);
      expect(response?.status()).toBeLessThan(400);
      // Should have a heading
      const heading = page.locator('h1');
      await expect(heading).toBeVisible({ timeout: 10000 });
    });
  }

  test('product page has value propositions', async ({ page }) => {
    await page.goto('/horoscope/personality');
    await page.waitForLoadState('networkidle');
    // Should have value prop content
    const content = await page.textContent('body');
    expect(content!.length).toBeGreaterThan(200);
  });

  test('product page has form or CTA', async ({ page }) => {
    await page.goto('/horoscope/personality');
    await page.waitForLoadState('networkidle');
    // Should have a form or CTA button
    const formOrButton = page.locator('form, button').first();
    await expect(formOrButton).toBeVisible({ timeout: 10000 });
  });

  test('product page has SEO metadata', async ({ page }) => {
    await page.goto('/horoscope/personality');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
  });

  test('product page has breadcrumb navigation', async ({ page }) => {
    await page.goto('/horoscope/love');
    await page.waitForLoadState('networkidle');
    // Should have breadcrumb with link back
    const breadcrumb = page.locator('nav[aria-label*="bread"], a[href="/"]').first();
    await expect(breadcrumb).toBeVisible({ timeout: 10000 });
  });

  test('product page mobile: no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/horoscope/personality');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });

  test('invalid slug returns 404', async ({ page }) => {
    const response = await page.goto('/horoscope/nonexistent-product-xyz');
    // Should either 404 or redirect
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
