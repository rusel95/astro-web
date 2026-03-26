import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const predictive = await client.analysis.getPredictiveAnalysis({ subject, orb: 6, language: 'uk' } as any);

    if (!predictive) {
      Sentry.captureMessage('getPredictiveAnalysis returned null/undefined', { tags: { route: 'analysis/predictive' } });
      return NextResponse.json({ error: 'Не вдалося отримати прогностичний аналіз' }, { status: 500 });
    }

    return NextResponse.json(
      { predictive },
      {
        headers: { 'Cache-Control': 'private, s-maxage=604800, stale-while-revalidate=86400' },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'analysis/predictive', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка прогностичного аналізу' }, { status: 500 });
  }
}
