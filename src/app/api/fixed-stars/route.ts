import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const [conjunctions, report] = await Promise.all([
      client.fixedStars.getConjunctions({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'fixed-stars', call: 'getConjunctions' }, level: 'warning' });
        return null;
      }),
      client.fixedStars.generateReport({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'fixed-stars', call: 'generateReport' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { conjunctions, report },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'fixed-stars', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка фіксованих зірок' }, { status: 500 });
  }
}
