import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    // Numerology requires a name — use subject name or fallback
    const numerologySubject = { ...subject, name: subject?.name || 'User' };

    const [coreNumbers, comprehensiveReport] = await Promise.all([
      client.numerology.getCoreNumbers({ subject: numerologySubject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'numerology', call: 'getCoreNumbers' }, level: 'warning' });
        return null;
      }),
      client.numerology.getComprehensiveReport({ subject: numerologySubject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'numerology', call: 'getComprehensiveReport' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { coreNumbers, comprehensiveReport },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'numerology', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка нумерології' }, { status: 500 });
  }
}
