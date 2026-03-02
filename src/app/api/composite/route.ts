import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';
import { ChartInput } from '@/types/astrology';

export async function POST(req: NextRequest) {
  try {
    const { person1, person2 }: { person1: ChartInput; person2: ChartInput } = await req.json();

    const client = getAstrologyClient();
    const options = toSdkChartOptions();
    const subject1 = toSdkSubject(person1);
    const subject2 = toSdkSubject(person2);

    const [compositeChart, compositeChartSvg, compositeReport] = await Promise.all([
      client.charts.getCompositeChart({ subject1, subject2, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'composite', call: 'getCompositeChart' }, level: 'warning' });
        return null;
      }),
      client.svg.getCompositeChartSvg({ subject1, subject2, options } as any, { responseType: 'text' } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'composite', call: 'getCompositeChartSvg' }, level: 'warning' });
        return null;
      }),
      client.analysis.getCompositeReport({ subject1, subject2, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'composite', call: 'getCompositeReport' }, level: 'warning' });
        return null;
      }),
    ]);

    if (!compositeChart && !compositeReport) {
      return NextResponse.json(
        { error: 'Не вдалося отримати композитну карту' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        compositeChart,
        compositeChartSvg: typeof compositeChartSvg === 'string' ? compositeChartSvg : null,
        compositeReport,
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'composite', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Помилка композитної карти' },
      { status: 500 }
    );
  }
}
