import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const [analysis, dignitiesAnalysis, lotsAnalysis] = await Promise.all([
      client.traditional.getAnalysis({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'traditional/analysis', call: 'getAnalysis' }, level: 'warning' });
        return null;
      }),
      client.traditional.getDignitiesAnalysis({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'traditional/analysis', call: 'getDignitiesAnalysis' }, level: 'warning' });
        return null;
      }),
      client.traditional.getLotsAnalysis({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'traditional/analysis', call: 'getLotsAnalysis' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { analysis, dignitiesAnalysis, lotsAnalysis },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'traditional/analysis', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка традиційного аналізу' }, { status: 500 });
  }
}
