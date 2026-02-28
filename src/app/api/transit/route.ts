import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, transit_date } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const transitDate = transit_date || new Date().toISOString().split('T')[0];

    const [transitChart, transitChartSvg, transitReport, natalTransitReport, natalTransits] = await Promise.all([
      client.charts.getTransitChart({ subject, transit_date: transitDate, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'transit', call: 'getTransitChart' }, level: 'warning' });
        return null;
      }),
      client.svg.getTransitChartSvg({ subject, transit_date: transitDate, options } as any, { responseType: 'text' } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'transit', call: 'getTransitChartSvg' }, level: 'warning' });
        return null;
      }),
      client.analysis.getTransitReport({ subject, transit_date: transitDate, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'transit', call: 'getTransitReport' }, level: 'warning' });
        return null;
      }),
      client.analysis.getNatalTransitReport({ subject, transit_date: transitDate, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'transit', call: 'getNatalTransitReport' }, level: 'warning' });
        return null;
      }),
      client.charts.getNatalTransits({ subject, start_date: transitDate, end_date: addDays(transitDate, 30), options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'transit', call: 'getNatalTransits' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      {
        transitChart,
        transitChartSvg: typeof transitChartSvg === 'string' ? transitChartSvg : null,
        transitReport,
        natalTransitReport,
        natalTransits,
      },
      {
        headers: { 'Cache-Control': 'private, s-maxage=3600, stale-while-revalidate=1800' },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'transit', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка транзитної карти' }, { status: 500 });
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
