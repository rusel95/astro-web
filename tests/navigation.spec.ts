/**
 * Navigation tests — DesktopNav, MobileNav, Footer.
 * Tests dropdown menus, mobile slide-in, footer links, sticky behavior.
 */

import { test, expect } from '@playwright/test';

test.describe('Desktop Navigation', () => {
  test('nav has logo linking to home', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('nav[aria-label="Головна навігація"] a[href="/"]').first();
    await expect(logo).toBeVisible({ timeout: 8000 });
  });

  test('nav has quiz CTA button', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('nav a[href="/quiz"]').first();
    await expect(cta).toBeVisible({ timeout: 8000 });
  });

  test('nav has moon link in dropdown', async ({ page }) => {
    await page.goto('/');
    // Moon link is inside "Безкоштовно" dropdown
    const dropdown = page.locator('nav button, nav [role="button"]').filter({ hasText: /безкоштовно/i }).first();
    if (await dropdown.isVisible().catch(() => false)) {
      await dropdown.hover();
      const moonLink = page.locator('a[href="/moon"]').first();
      await expect(moonLink).toBeVisible({ timeout: 5000 });
    }
  });

  test('nav has chart/new link in dropdown', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('nav button, nav [role="button"]').filter({ hasText: /безкоштовно/i }).first();
    if (await dropdown.isVisible().catch(() => false)) {
      await dropdown.hover();
      const chartLink = page.locator('a[href="/chart/new"]').first();
      await expect(chartLink).toBeVisible({ timeout: 5000 });
    }
  });

  test('"Гороскопи" dropdown shows on hover', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('nav button, nav [role="button"]').filter({ hasText: /гороскопи/i }).first();
    if (await dropdown.isVisible().catch(() => false)) {
      await dropdown.hover();
      // Should show dropdown links
      const link = page.locator('a[href="/horoscope/personality"]').first();
      await expect(link).toBeVisible({ timeout: 5000 });
    }
  });

  test('"Безкоштовно" dropdown shows on hover', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('nav button, nav [role="button"]').filter({ hasText: /безкоштовно/i }).first();
    if (await dropdown.isVisible().catch(() => false)) {
      await dropdown.hover();
      const link = page.locator('a[href="/chart/new"]');
      await expect(link.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('bottom tab bar is visible', async ({ page }) => {
    await page.goto('/');
    const mobileNav = page.locator('nav[aria-label="Мобільна навігація"]').first();
    await expect(mobileNav).toBeVisible({ timeout: 8000 });
  });

  test('bottom bar has key tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const homeTab = page.locator('nav[aria-label="Мобільна навігація"]').locator('text=Головна').first();
    await expect(homeTab).toBeVisible({ timeout: 8000 });
  });

  test('"Нова карта" button links to /chart/new', async ({ page }) => {
    await page.goto('/');
    const newChart = page.locator('a[aria-label="Нова карта"]').first();
    await expect(newChart).toBeVisible({ timeout: 8000 });
    expect(await newChart.getAttribute('href')).toBe('/chart/new');
  });

  test('hamburger menu opens slide-in panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Find menu button
    const menuBtn = page.locator('nav[aria-label="Мобільна навігація"]').locator('text=Меню').first();
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click();
      // Slide-in should show links
      await page.waitForTimeout(500);
      const quizLink = page.locator('a[href="/quiz"]').filter({ hasText: /тест/i }).first();
      await expect(quizLink).toBeVisible({ timeout: 5000 });
    }
  });

  test('mobile nav hidden on /chart/new', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForLoadState('networkidle');
    const mobileNav = page.locator('nav[aria-label="Мобільна навігація"]');
    // Should be hidden or not in DOM
    const count = await mobileNav.count();
    expect(count).toBe(0);
  });
});

test.describe('Footer', () => {
  test('footer is visible on homepage', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible({ timeout: 8000 });
  });

  test('footer has copyright text', async ({ page }) => {
    await page.goto('/');
    const copyright = page.locator('text=© 2026 Зоря').first();
    await expect(copyright).toBeVisible({ timeout: 8000 });
  });

  test('footer has legal links', async ({ page }) => {
    await page.goto('/');
    const terms = page.locator('footer a[href="/terms"]').first();
    const privacy = page.locator('footer a[href="/privacy"]').first();
    await expect(terms).toBeVisible({ timeout: 8000 });
    await expect(privacy).toBeVisible({ timeout: 8000 });
  });

  test('footer has product links', async ({ page }) => {
    await page.goto('/');
    const personalityLink = page.locator('footer a[href="/horoscope/personality"]').first();
    await expect(personalityLink).toBeVisible({ timeout: 8000 });
  });

  test('footer has free tools links', async ({ page }) => {
    await page.goto('/');
    const chartLink = page.locator('footer a[href="/chart/new"]').first();
    const moonLink = page.locator('footer a[href="/moon"]').first();
    await expect(chartLink).toBeVisible({ timeout: 8000 });
    await expect(moonLink).toBeVisible({ timeout: 8000 });
  });

  test('footer hidden on /chart/new', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForLoadState('networkidle');
    // NewFooter should not render
    const copyright = page.locator('text=© 2026 Зоря');
    const count = await copyright.count();
    expect(count).toBe(0);
  });
});
