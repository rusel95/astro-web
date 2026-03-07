import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Load tests/.env.test if it exists (for TEST_EMAIL, TEST_PASSWORD)
const envTestPath = path.join(__dirname, 'tests', '.env.test');
if (fs.existsSync(envTestPath)) {
  const envContent = fs.readFileSync(envTestPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  reporter: 'html',
  
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

    // Mobile viewport removed — individual specs use setViewportSize where needed
  ],

  // webServer only needed for local dev; comment out when testing against prod
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
