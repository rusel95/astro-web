import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, year } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();
    const targetYear = year || new Date().getFullYear();

    const [solarReturnChart, solarReturnChartSvg, solarReturnReport, solarReturnTransits] = await Promise.all([
      client.charts.getSolarReturnChart({ subject, year: targetYear, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'solar-return', call: 'getSolarReturnChart' }, level: 'warning' });
        return null;
      }),
      Promise.resolve(null), // No SVG method for solar return
      client.analysis.getSolarReturnReport({ subject, year: targetYear, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'solar-return', call: 'getSolarReturnReport' }, level: 'warning' });
        return null;
      }),
      client.charts.getSolarReturnTransits({ subject, year: targetYear, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'solar-return', call: 'getSolarReturnTransits' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      {
        solarReturnChart,
        solarReturnChartSvg: typeof solarReturnChartSvg === 'string' ? solarReturnChartSvg : null,
        solarReturnReport,
        solarReturnTransits,
      },
      {
        headers: { 'Cache-Control': 'private, s-maxage=31536000, stale-while-revalidate=86400' },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'solar-return', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка соляру' }, { status: 500 });
  }
}
