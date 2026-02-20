import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  
  // Screenshot comparison settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // Allow small differences
      threshold: 0.2, // 20% threshold for visual diffs
    },
  },

  use: {
    baseURL: process.env.BASE_URL || 'https://astro-web-five.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup: login once and save storage state
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Tests that require auth — reuse saved session
    {
      name: 'authenticated',
      testMatch: /.*\.auth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Tests that don't need auth
    {
      name: 'public',
      testMatch: /.*(?<!\.auth)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Mobile viewport
    {
      name: 'mobile',
      testMatch: /.*(?<!\.auth)\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
  ],

  // webServer only needed for local dev; comment out when testing against prod
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
