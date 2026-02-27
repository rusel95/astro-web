/**
 * Tests for all 12 zodiac sign pages.
 * Ensures SEO content, images, and mobile layout for each sign.
 */

import { test, expect } from '@playwright/test';

const ZODIAC_SIGNS = [
  { slug: 'aries', name: 'Овен', symbol: '♈' },
  { slug: 'taurus', name: 'Телець', symbol: '♉' },
  { slug: 'gemini', name: 'Близнюки', symbol: '♊' },
  { slug: 'cancer', name: 'Рак', symbol: '♋' },
  { slug: 'leo', name: 'Лев', symbol: '♌' },
  { slug: 'virgo', name: 'Діва', symbol: '♍' },
  { slug: 'libra', name: 'Терези', symbol: '♎' },
  { slug: 'scorpio', name: 'Скорпіон', symbol: '♏' },
  { slug: 'sagittarius', name: 'Стрілець', symbol: '♐' },
  { slug: 'capricorn', name: 'Козеріг', symbol: '♑' },
  { slug: 'aquarius', name: 'Водолій', symbol: '♒' },
  { slug: 'pisces', name: 'Риби', symbol: '♓' },
];

test.describe('Zodiac Pages — All Signs', () => {
  for (const sign of ZODIAC_SIGNS) {
    test(`${sign.name}: page loads with correct title`, async ({ page }) => {
      await page.goto(`/zodiac/${sign.slug}`);
      
      // Check URL
      await expect(page).toHaveURL(`/zodiac/${sign.slug}`);
      
      // Check heading contains sign name or symbol
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible({ timeout: 8000 });
      
      const headingText = await heading.textContent();
      const hasSignName = headingText?.includes(sign.name) || headingText?.includes(sign.symbol);
      expect(hasSignName).toBeTruthy();
    });

    test(`${sign.name}: has description content`, async ({ page }) => {
      await page.goto(`/zodiac/${sign.slug}`);
      
      // Find main description paragraph (skip dates paragraph)
      const content = page.locator('p').filter({ hasText: /знак|представник|символ/i }).first();
      await expect(content).toBeVisible();
      
      const text = await content.textContent();
      expect(text?.length).toBeGreaterThan(50); // At least 50 chars of content
    });

    test(`${sign.name}: mobile layout no overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/zodiac/${sign.slug}`);
      
      await page.waitForLoadState('networkidle');
      
      // No horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(410); // 390 + scrollbar tolerance
    });
  }
});

test.describe('Zodiac Pages — SEO & Meta', () => {
  test('Aries: has proper meta tags', async ({ page }) => {
    await page.goto('/zodiac/aries');
    
    // Check page title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title).toMatch(/овен|aries/i);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
  });

  test('Leo: has Open Graph tags for social sharing', async ({ page }) => {
    await page.goto('/zodiac/leo');
    
    // Check OG title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogTitle).toMatch(/лев|leo/i);
    
    // Check OG image (if present)
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    if (ogImage) {
      expect(ogImage).toMatch(/https?:\/\//);
    }
  });
});

test.describe('Zodiac Pages — Navigation', () => {
  test('can navigate between signs', async ({ page }) => {
    await page.goto('/zodiac/aries');
    
    // Look for "next sign" or navigation links
    const nextSignLink = page.locator('a[href*="/zodiac/"]').nth(1);
    
    if (await nextSignLink.isVisible()) {
      await nextSignLink.click();
      await expect(page).toHaveURL(/\/zodiac\/[a-z]+/);
      
      // New sign page should load
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('back button works', async ({ page }) => {
    await page.goto('/');
    await page.goto('/zodiac/scorpio');
    
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Zodiac Pages — Visual Elements', () => {
  test('Gemini: has zodiac symbol/icon', async ({ page }) => {
    await page.goto('/zodiac/gemini');
    
    // Symbol should be visible (emoji in heading or separate element)
    const bodyText = await page.locator('body').textContent();
    
    const hasSymbol = 
      bodyText?.includes('♊') || 
      (await page.locator('svg, img[alt*="Близнюки"]').isVisible().catch(() => false));
    
    expect(hasSymbol).toBeTruthy();
  });

  test('Capricorn: has consistent theme colors', async ({ page }) => {
    await page.goto('/zodiac/capricorn');
    
    // Page should have background/theme colors applied
    const bodyColor = await page.locator('body').evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should not be plain white (rgb(255, 255, 255))
    expect(bodyColor).not.toBe('rgb(255, 255, 255)');
  });
});
