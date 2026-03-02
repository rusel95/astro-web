import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, target_date, progression_type = 'secondary' } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const targetDate = target_date || new Date().toISOString().split('T')[0];

    const [progressions, progressionReport] = await Promise.all([
      client.charts.getProgressions({ subject, target_date: targetDate, progression_type, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'progressions', call: 'getProgressions' }, level: 'warning' });
        return null;
      }),
      client.analysis.getProgressionReport({ subject, target_date: targetDate, progression_type, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'progressions', call: 'getProgressionReport' }, level: 'warning' });
        return null;
      }),
    ]);

    const partialErrors = [!progressions, !progressionReport].filter(Boolean).length;

    return NextResponse.json(
      { progressions, progressionReport, partialErrors: partialErrors > 0 ? partialErrors : undefined },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'progressions', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка прогресій' }, { status: 500 });
  }
}
