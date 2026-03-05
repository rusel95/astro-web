/**
 * Auth setup — runs once before authenticated tests.
 * Calls Supabase REST API directly (bypasses React form) for reliability.
 * Injects auth session as cookies so Next.js server components can read it.
 *
 * Usage:
 *   TEST_EMAIL=test@example.com TEST_PASSWORD=secret npx playwright test --project=setup
 *
 * Or put credentials in tests/.env.test (never commit this file):
 *   TEST_EMAIL=test@example.com
 *   TEST_PASSWORD=secret
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

// Public Supabase credentials (NEXT_PUBLIC_ prefix = safe to use in tests)
const SUPABASE_URL = 'https://jrjshwhgpbmttmxbsqtn.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyanNod2hncGJtdHRteGJzcXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTUwMjQsImV4cCI6MjA4Njk5MTAyNH0.gdPPkpI3fmo0-jbq5gDPnwGMhse1Q5IV0qhbtFYdT18';

// Supabase SSR cookie settings (matches @supabase/ssr DEFAULT_COOKIE_OPTIONS)
const COOKIE_MAX_AGE = 400 * 24 * 60 * 60; // 400 days in seconds
const PROJECT_REF = 'jrjshwhgpbmttmxbsqtn';
const COOKIE_NAME = `sb-${PROJECT_REF}-auth-token`;

setup('authenticate', async ({ page, request }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_EMAIL and TEST_PASSWORD env vars are required for auth setup.\n' +
        'Create tests/.env.test or export them before running tests.',
    );
  }

  // Step 1: Authenticate via Supabase REST API directly (no React form interaction)
  const authResponse = await request.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      data: { email, password },
    },
  );

  if (!authResponse.ok()) {
    const body = await authResponse.text();
    throw new Error(`Supabase auth failed (${authResponse.status()}): ${body}`);
  }

  const session = await authResponse.json();
  expect(session.access_token).toBeTruthy();

  // Step 2: Inject session as cookie so Next.js server components can read it
  // @supabase/ssr stores the session JSON in a cookie named sb-{ref}-auth-token
  // The server-side createServerClient reads it via cookies().getAll()
  const baseURL = process.env.BASE_URL || 'https://astro-web-five.vercel.app';
  const isLocalhost = baseURL.includes('localhost');
  const domain = isLocalhost ? 'localhost' : new URL(baseURL).hostname;

  const sessionJson = JSON.stringify(session);

  // Handle chunking if session JSON exceeds 3180 bytes (encodeURIComponent length)
  const MAX_CHUNK_SIZE = 3180;
  const encoded = encodeURIComponent(sessionJson);

  if (encoded.length <= MAX_CHUNK_SIZE) {
    // Single cookie — no chunking needed
    await page.context().addCookies([
      {
        name: COOKIE_NAME,
        value: sessionJson,
        domain,
        path: '/',
        sameSite: 'Lax',
        httpOnly: false,
        maxAge: COOKIE_MAX_AGE,
      },
    ]);
  } else {
    // Chunk the session across multiple cookies
    const chunks: string[] = [];
    let remaining = encoded;
    while (remaining.length > 0) {
      let head = remaining.slice(0, MAX_CHUNK_SIZE);
      const lastEscape = head.lastIndexOf('%');
      if (lastEscape > MAX_CHUNK_SIZE - 3) head = head.slice(0, lastEscape);
      chunks.push(decodeURIComponent(head));
      remaining = remaining.slice(encodeURIComponent(chunks[chunks.length - 1]).length);
    }
    await page.context().addCookies(
      chunks.map((chunk, i) => ({
        name: `${COOKIE_NAME}.${i}`,
        value: chunk,
        domain,
        path: '/',
        sameSite: 'Lax' as const,
        httpOnly: false,
        maxAge: COOKIE_MAX_AGE,
      })),
    );
  }

  // Step 3: Verify by navigating to dashboard (server-side auth check must pass)
  await page.goto(`${baseURL}/dashboard`);
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  // Step 4: Save auth state (cookies + localStorage)
  await page.context().storageState({ path: authFile });
});
