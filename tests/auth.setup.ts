/**
 * Auth setup — runs once before authenticated tests.
 * Logs in via email/password and saves storage state (cookies + localStorage).
 *
 * Usage:
 *   TEST_EMAIL=test@example.com TEST_PASSWORD=secret npx playwright test --project=setup
 *
 * Or put credentials in .env.test (never commit this file):
 *   TEST_EMAIL=test@example.com
 *   TEST_PASSWORD=secret
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_EMAIL and TEST_PASSWORD env vars are required for auth setup.\n' +
      'Create tests/.env.test or export them before running tests.'
    );
  }

  await page.goto('/auth/login');

  // Fill email
  await page.locator('input[type="email"]').fill(email);

  // Fill password
  await page.locator('input[type="password"]').fill(password);

  // Submit
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10_000 });
  await expect(page).toHaveURL(/\/dashboard/);

  // Save auth state (cookies + localStorage with Supabase tokens)
  await page.context().storageState({ path: authFile });
});
