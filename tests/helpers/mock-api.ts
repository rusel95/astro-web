/**
 * Playwright API mock helper.
 * Intercepts browser-level fetch calls to /api/* and returns fixture data.
 * Navigation still works normally — only API responses are mocked.
 *
 * Usage in tests:
 *   import { setupApiMocks } from './helpers/mock-api';
 *   test.beforeEach(async ({ page }) => { await setupApiMocks(page); });
 */

import type { Page, Route } from '@playwright/test';
import horoscopeFixtures from '../fixtures/horoscope.json';
import analysisFixtures from '../fixtures/analysis.json';
import compatibilityFixtures from '../fixtures/compatibility.json';
import chartFixtures from '../fixtures/chart.json';
import numerologyFixtures from '../fixtures/numerology.json';
import tarotFixtures from '../fixtures/tarot.json';
import chineseFixtures from '../fixtures/chinese.json';
import traditionalFixtures from '../fixtures/traditional.json';
import miscFixtures from '../fixtures/misc.json';

/** Route pattern → JSON response mapping */
const API_ROUTES: Array<{ pattern: RegExp; response: unknown; method?: string }> = [
  // Horoscopes — sign-based (GET)
  { pattern: /\/api\/horoscope\/daily\/\w+/, response: horoscopeFixtures.daily, method: 'GET' },
  { pattern: /\/api\/horoscope\/weekly\/\w+/, response: horoscopeFixtures.weekly, method: 'GET' },
  { pattern: /\/api\/horoscope\/monthly\/\w+/, response: horoscopeFixtures.monthly, method: 'GET' },
  { pattern: /\/api\/horoscope\/yearly\/\w+/, response: horoscopeFixtures.yearly, method: 'GET' },
  // Horoscope — personal (POST)
  { pattern: /\/api\/horoscope\/personal$/, response: horoscopeFixtures.personal, method: 'POST' },
  // Horoscope — chinese
  { pattern: /\/api\/horoscope\/chinese$/, response: miscFixtures.horoscopeChinese, method: 'POST' },
  // Daily horoscope (legacy route)
  { pattern: /\/api\/daily-horoscope$/, response: horoscopeFixtures.daily, method: 'GET' },

  // Analysis types (POST)
  { pattern: /\/api\/analysis\/career$/, response: analysisFixtures.career, method: 'POST' },
  { pattern: /\/api\/analysis\/health$/, response: analysisFixtures.health, method: 'POST' },
  { pattern: /\/api\/analysis\/karmic$/, response: analysisFixtures.karmic, method: 'POST' },
  { pattern: /\/api\/analysis\/psychological$/, response: analysisFixtures.psychological, method: 'POST' },
  { pattern: /\/api\/analysis\/spiritual$/, response: analysisFixtures.spiritual, method: 'POST' },
  { pattern: /\/api\/analysis\/vocational$/, response: analysisFixtures.vocational, method: 'POST' },
  { pattern: /\/api\/analysis\/lunar$/, response: analysisFixtures.lunar, method: 'POST' },
  { pattern: /\/api\/analysis\/relocation$/, response: analysisFixtures.relocation, method: 'POST' },
  // Predictive analysis
  { pattern: /\/api\/analysis\/predictive$/, response: { analysis: miscFixtures.transit, type: 'predictive' }, method: 'POST' },

  // Compatibility (POST)
  { pattern: /\/api\/compatibility$/, response: compatibilityFixtures.synastry, method: 'POST' },
  { pattern: /\/api\/composite$/, response: compatibilityFixtures.composite, method: 'POST' },
  { pattern: /\/api\/relationship-insights$/, response: miscFixtures.relationshipInsights, method: 'POST' },

  // Chart (POST)
  { pattern: /\/api\/chart$/, response: chartFixtures.natal, method: 'POST' },

  // Numerology (POST)
  { pattern: /\/api\/numerology$/, response: numerologyFixtures, method: 'POST' },
  { pattern: /\/api\/numerology\/compatibility$/, response: miscFixtures.numerologyCompatibility, method: 'POST' },

  // Tarot (POST)
  { pattern: /\/api\/tarot\/daily$/, response: tarotFixtures.daily, method: 'POST' },
  { pattern: /\/api\/tarot\/draw$/, response: tarotFixtures.draw, method: 'POST' },
  { pattern: /\/api\/tarot\/birth-cards$/, response: tarotFixtures.birthCards, method: 'POST' },
  { pattern: /\/api\/tarot\/transit-natal$/, response: tarotFixtures.transitNatal, method: 'POST' },

  // Chinese astrology (POST)
  { pattern: /\/api\/chinese\/bazi$/, response: chineseFixtures.bazi, method: 'POST' },
  { pattern: /\/api\/chinese\/forecast$/, response: chineseFixtures.forecast, method: 'POST' },
  { pattern: /\/api\/chinese\/compatibility$/, response: chineseFixtures.compatibility, method: 'POST' },

  // Traditional (POST)
  { pattern: /\/api\/traditional\/analysis$/, response: traditionalFixtures.analysis, method: 'POST' },
  { pattern: /\/api\/traditional\/profections$/, response: traditionalFixtures.profections, method: 'POST' },

  // Transits, Progressions, Directions, Returns (POST)
  { pattern: /\/api\/transit$/, response: miscFixtures.transit, method: 'POST' },
  { pattern: /\/api\/progressions$/, response: miscFixtures.progressions, method: 'POST' },
  { pattern: /\/api\/directions$/, response: miscFixtures.directions, method: 'POST' },
  { pattern: /\/api\/solar-return$/, response: miscFixtures.solarReturn, method: 'POST' },
  { pattern: /\/api\/lunar-return$/, response: miscFixtures.lunarReturn, method: 'POST' },

  // Eclipses, Fixed Stars (POST)
  { pattern: /\/api\/eclipses$/, response: miscFixtures.eclipses, method: 'POST' },
  { pattern: /\/api\/fixed-stars$/, response: miscFixtures.fixedStars, method: 'POST' },

  // Astrocartography (POST)
  { pattern: /\/api\/astrocartography\/map$/, response: miscFixtures.astrocartography.map, method: 'POST' },
  { pattern: /\/api\/astrocartography\/location$/, response: miscFixtures.astrocartography.location, method: 'POST' },
  { pattern: /\/api\/astrocartography\/compare$/, response: { locations: [miscFixtures.astrocartography.location] }, method: 'POST' },

  // Wellness, Financial, Business insights (POST)
  { pattern: /\/api\/insights\/wellness$/, response: miscFixtures.wellness, method: 'POST' },
  { pattern: /\/api\/insights\/financial$/, response: miscFixtures.financial, method: 'POST' },
  { pattern: /\/api\/insights\/business$/, response: miscFixtures.business, method: 'POST' },

  // Glossary (GET)
  { pattern: /\/api\/glossary$/, response: miscFixtures.glossary, method: 'GET' },

  // Lunar calendar (GET)
  { pattern: /\/api\/lunar\/calendar$/, response: miscFixtures.lunarCalendar, method: 'GET' },

  // Moon endpoints (GET) — these use astronomy-engine locally, but mock for consistency
  { pattern: /\/api\/moon\/current$/, response: miscFixtures.lunarCalendar.current_moon, method: 'GET' },
  { pattern: /\/api\/moon\/phases$/, response: miscFixtures.lunarCalendar.upcoming_events, method: 'GET' },
  { pattern: /\/api\/moon\/void-of-course$/, response: { periods: [] }, method: 'GET' },
];

/**
 * Set up API mocks for all /api/* routes.
 * Call this in test.beforeEach() to prevent real API calls.
 */
export async function setupApiMocks(page: Page): Promise<void> {
  await page.route('**/api/**', (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    // Find matching fixture
    for (const apiRoute of API_ROUTES) {
      if (apiRoute.pattern.test(url) && (!apiRoute.method || apiRoute.method === method)) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(apiRoute.response),
        });
      }
    }

    // Let non-matched requests through (e.g., Supabase auth, geocoding, etc.)
    return route.continue();
  });
}

/**
 * Set up API mocks that return errors (for error state testing).
 */
export async function setupApiErrorMocks(page: Page): Promise<void> {
  await page.route('**/api/**', (route: Route) => {
    const url = route.request().url();

    // Let non-astrology API calls through (Supabase, geocoding)
    if (url.includes('/api/geocode') || url.includes('/supabase')) {
      return route.continue();
    }

    return route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Помилка з\'єднання з сервером' }),
    });
  });
}

/**
 * Set up API mocks with slow responses (for loading state testing).
 */
export async function setupSlowApiMocks(page: Page, delayMs = 3000): Promise<void> {
  await page.route('**/api/**', async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    for (const apiRoute of API_ROUTES) {
      if (apiRoute.pattern.test(url) && (!apiRoute.method || apiRoute.method === method)) {
        await new Promise((r) => setTimeout(r, delayMs));
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(apiRoute.response),
        });
      }
    }

    return route.continue();
  });
}
