import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const predictive = await client.analysis.getPredictiveAnalysis({ subject, options } as any);

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
