import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();
    const today = new Date().toISOString().split('T')[0];

    const [profectionsAnalysis, annualProfection, profectionTimeline] = await Promise.all([
      client.traditional.getProfectionsAnalysis({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'traditional/profections', call: 'getProfectionsAnalysis' }, level: 'warning' });
        return null;
      }),
      client.traditional.getAnnualProfection({ subject, current_date: today } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'traditional/profections', call: 'getAnnualProfection' }, level: 'warning' });
        return null;
      }),
      client.traditional.getProfectionTimeline({ subject, start_age: 0, end_age: 90 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'traditional/profections', call: 'getProfectionTimeline' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { profectionsAnalysis, annualProfection, profectionTimeline },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'traditional/profections', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка профекцій' }, { status: 500 });
  }
}
