import * as Sentry from '@sentry/nextjs';

const DEFAULT_TIMEOUT = 10_000;
const ANALYSIS_TIMEOUT = 15_000;
const DEBOUNCE_MS = 500;

const ANALYSIS_ENDPOINTS = [
  '/api/analysis/',
  '/api/report',
  '/api/compatibility',
  '/api/composite',
  '/api/relationship-insights',
  '/api/insights/',
];

// Per-session concurrency tracking
let activeRequests = 0;
const MAX_CONCURRENT = 3;
const requestQueue: Array<() => void> = [];

function isAnalysisEndpoint(url: string): boolean {
  return ANALYSIS_ENDPOINTS.some((ep) => url.includes(ep));
}

function getTimeout(url: string): number {
  return isAnalysisEndpoint(url) ? ANALYSIS_TIMEOUT : DEFAULT_TIMEOUT;
}

function getSentrySeverity(
  status: number | null,
  isTimeout: boolean
): Sentry.SeverityLevel {
  if (isTimeout) return 'warning';
  if (status && status >= 400 && status < 500) {
    if (status === 401 || status === 403) return 'error';
    return 'warning';
  }
  if (status && status >= 500) return 'error';
  return 'error';
}

async function waitForSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return;
  }
  return new Promise<void>((resolve) => {
    requestQueue.push(() => {
      activeRequests++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  activeRequests--;
  const next = requestQueue.shift();
  if (next) next();
}

// Debounce tracking per form
const debounceTimers = new Map<string, NodeJS.Timeout>();

export function debounceSubmit(
  key: string,
  fn: () => void,
  delay = DEBOUNCE_MS
): void {
  const existing = debounceTimers.get(key);
  if (existing) clearTimeout(existing);
  debounceTimers.set(
    key,
    setTimeout(() => {
      debounceTimers.delete(key);
      fn();
    }, delay)
  );
}

export interface ApiResponse<T = Record<string, unknown>> {
  data: T | null;
  error: string | null;
}

export async function apiCall<T = Record<string, unknown>>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  await waitForSlot();

  const controller = new AbortController();
  const timeout = getTimeout(url);
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timer);

    if (!res.ok) {
      const severity = getSentrySeverity(res.status, false);
      Sentry.captureMessage(`API error: ${res.status} ${url}`, severity);
      const body = await res.text().catch(() => '');
      return {
        data: null,
        error:
          body || `HTTP ${res.status}`,
      };
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err) {
    clearTimeout(timer);
    const isTimeout =
      err instanceof DOMException && err.name === 'AbortError';
    const severity = getSentrySeverity(null, isTimeout);
    Sentry.captureException(err, { level: severity, tags: { url } });

    if (isTimeout) {
      return { data: null, error: 'Запит зайняв занадто довго. Спробуйте ще раз.' };
    }
    return {
      data: null,
      error: 'Помилка мережі. Перевірте з\'єднання та спробуйте ще раз.',
    };
  } finally {
    releaseSlot();
  }
}

export async function apiPost<T = Record<string, unknown>>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiGet<T = Record<string, unknown>>(
  url: string
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, { method: 'GET' });
}
