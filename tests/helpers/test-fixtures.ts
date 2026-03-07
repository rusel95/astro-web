/**
 * Custom Playwright test fixtures with API mocking.
 *
 * By default, all tests use mock API data (saves quota).
 * Set REAL_API=true to bypass mocks and hit real APIs:
 *   REAL_API=true npx playwright test
 */

import { test as base } from '@playwright/test';
import { setupApiMocks } from './mock-api';

/**
 * Extended test fixture that auto-mocks /api/* routes.
 * Use `import { test, expect } from '../helpers/test-fixtures'` in test files.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    if (!process.env.REAL_API) {
      await setupApiMocks(page);
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';
