import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, target_date, direction_type = 'solar_arc' } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const targetDate = target_date || new Date().toISOString().split('T')[0];

    const [directions, directionReport] = await Promise.all([
      client.charts.getDirections({ subject, target_date: targetDate, direction_type, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'directions', call: 'getDirections' }, level: 'warning' });
        return null;
      }),
      client.analysis.getDirectionReport({ subject, target_date: targetDate, direction_type, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'directions', call: 'getDirectionReport' }, level: 'warning' });
        return null;
      }),
    ]);

    const partialErrors = [!directions, !directionReport].filter(Boolean).length;

    return NextResponse.json(
      { directions, directionReport, partialErrors: partialErrors > 0 ? partialErrors : undefined },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'directions', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка дирекцій' }, { status: 500 });
  }
}
