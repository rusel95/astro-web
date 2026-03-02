import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';
import { mapAPIResponse } from '@/lib/api-mapper';
import { ChartInput } from '@/types/astrology';

interface CompatibilityInput {
  person1: ChartInput;
  person2: ChartInput;
}

export async function POST(req: NextRequest) {
  try {
    const input: CompatibilityInput = await req.json();
    const { person1, person2 } = input;

    const client = getAstrologyClient();
    const options = toSdkChartOptions();
    const subject1 = toSdkSubject(person1);
    const subject2 = toSdkSubject(person2);

    // Core: natal charts for both persons (required)
    const [apiResponse1, apiResponse2] = await Promise.all([
      client.charts.getNatalChart({ subject: subject1, options }),
      client.charts.getNatalChart({ subject: subject2, options }),
    ]);

    const chart1 = mapAPIResponse(apiResponse1 as any, person1);
    const chart2 = mapAPIResponse(apiResponse2 as any, person2);

    // Enhanced: synastry chart, SVG, reports (graceful fallback)
    const [synastryChart, synastryChartSvg, synastryReport, compatibilityScore] = await Promise.all([
      client.charts.getSynastryChart({ subject1, subject2, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'compatibility', call: 'getSynastryChart' }, level: 'warning' });
        return null;
      }),
      client.svg.getSynastryChartSvg({ subject1, subject2, options } as any, { responseType: 'text' } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'compatibility', call: 'getSynastryChartSvg' }, level: 'warning' });
        return null;
      }),
      client.analysis.getSynastryReport({ subject1, subject2, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'compatibility', call: 'getSynastryReport' }, level: 'warning' });
        return null;
      }),
      client.analysis.getCompatibilityScore({ subjects: [subject1, subject2] } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'compatibility', call: 'getCompatibilityScore' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      {
        person1Chart: chart1,
        person2Chart: chart2,
        synastryChart,
        synastryChartSvg: typeof synastryChartSvg === 'string' ? synastryChartSvg : null,
        synastryReport,
        compatibilityScore,
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'compatibility', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Помилка аналізу сумісності' },
      { status: 500 }
    );
  }
}
