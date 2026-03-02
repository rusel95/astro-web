import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, date } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();
    const targetDate = date || new Date().toISOString().split('T')[0];

    const [lunarReturnChart, lunarReturnChartSvg, lunarReturnReport, lunarReturnTransits] = await Promise.all([
      client.charts.getLunarReturnChart({ subject, date: targetDate, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'lunar-return', call: 'getLunarReturnChart' }, level: 'warning' });
        return null;
      }),
      Promise.resolve(null), // No SVG method for lunar return
      client.analysis.getLunarReturnReport({ subject, date: targetDate, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'lunar-return', call: 'getLunarReturnReport' }, level: 'warning' });
        return null;
      }),
      client.charts.getLunarReturnTransits({ subject, date: targetDate, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'lunar-return', call: 'getLunarReturnTransits' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      {
        lunarReturnChart,
        lunarReturnChartSvg: typeof lunarReturnChartSvg === 'string' ? lunarReturnChartSvg : null,
        lunarReturnReport,
        lunarReturnTransits,
      },
      {
        headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'lunar-return', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка лунару' }, { status: 500 });
  }
}
