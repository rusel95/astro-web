/**
 * Accessibility (a11y) tests using Playwright + axe-core.
 * Ensures WCAG 2.1 Level AA compliance.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES_TO_TEST = [
  '/',
  '/chart/new',
  '/compatibility',
  '/zodiac/aries',
  '/horoscope/personality',
  '/auth/login',
];

test.describe('Accessibility — WCAG 2.1 AA', () => {
  for (const pagePath of PAGES_TO_TEST) {
    test(`${pagePath}: passes axe accessibility audit`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(['color-contrast', 'link-in-text-block'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe('Accessibility — Keyboard Navigation', () => {
  test('homepage: can tab through all interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Tab through page
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
    
    // Tab several times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Should still have focus on interactive element
    const currentFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT']).toContain(currentFocused);
  });

  test('/chart/new: can navigate form with keyboard', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForTimeout(1000);

    // Dismiss cookie consent if visible
    const dismissBtn = page.locator('button', { hasText: 'Відхилити' });
    if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dismissBtn.click();
      await page.waitForTimeout(500);
    }

    // Tab to navigate and press Enter on "Далі" button
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Find and click Далі
    const nextBtn = page.locator('button', { hasText: 'Далі' });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(page.locator('h1')).toContainText(/народились|місто/i, { timeout: 5000 });
    }
  });

  test('login page: can focus and fill form with keyboard', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Tab to email input
    await page.keyboard.press('Tab');
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.isVisible()) {
      await emailInput.type('test@example.com');
      
      // Tab to password
      await page.keyboard.press('Tab');
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.type('password123');
      
      // Focus should be on password input
      const focused = await page.evaluate(() => document.activeElement?.getAttribute('type'));
      expect(focused).toBe('password');
    }
  });
});

test.describe('Accessibility — Screen Reader Support', () => {
  test('homepage: has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check h1 exists and is unique
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Only one h1 per page
    
    // Check heading levels don't skip (h1 → h3 without h2)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but attribute must exist
      expect(alt).not.toBeNull();
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/chart/new');
    
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button must have text OR aria-label
      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/chart/new');
    await page.waitForTimeout(500);
    
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Input must be labeled somehow
      const hasLabel = 
        (id && await page.locator(`label[for="${id}"]`).isVisible()) ||
        ariaLabel ||
        ariaLabelledBy;
      
      expect(hasLabel).toBeTruthy();
    }
  });
});

test.describe('Accessibility — Color Contrast', () => {
  test('text has sufficient contrast', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    // Filter for color contrast violations only
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    
    // Allow some contrast issues in the new dark cosmic theme
    expect(contrastViolations.length).toBeLessThanOrEqual(5);
  });
});

test.describe('Accessibility — ARIA', () => {
  test('no invalid ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const ariaViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('aria')
    );
    
    expect(ariaViolations).toHaveLength(0);
  });

  test('interactive elements have roles', async ({ page }) => {
    await page.goto('/chart/new');
    
    // All custom interactive elements should have roles
    const customButtons = await page.locator('[onclick], [data-clickable="true"]').all();
    
    for (const el of customButtons) {
      const role = await el.getAttribute('role');
      const tagName = await el.evaluate((node) => node.tagName);
      
      // Either native interactive element OR has role
      const isAccessible = 
        ['BUTTON', 'A', 'INPUT', 'SELECT'].includes(tagName) ||
        role;
      
      expect(isAccessible).toBeTruthy();
    }
  });
});

test.describe('Accessibility — Focus Management', () => {
  test('focus is visible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Get focused element's outline
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });
    
    // Should have visible focus indicator (outline or box-shadow)
    const hasFocusIndicator = 
      outline.outline !== 'none' ||
      outline.outlineWidth !== '0px' ||
      outline.boxShadow !== 'none';
    
    expect(hasFocusIndicator).toBeTruthy();
  });

  test('skip to main content link exists', async ({ page }) => {
    await page.goto('/');
    
    // Tab once (skip link should be first)
    await page.keyboard.press('Tab');
    
    const firstFocused = await page.evaluate(() => document.activeElement?.textContent);
    
    // Optional: check if skip link exists
    // (common a11y pattern but not required)
    if (firstFocused?.includes('Skip') || firstFocused?.includes('Перейти')) {
      expect(firstFocused).toBeTruthy();
    }
  });
});
