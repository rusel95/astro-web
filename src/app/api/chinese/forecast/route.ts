import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, forecast_year } = await req.json();
    const client = getAstrologyClient();
    const year = forecast_year || new Date().getFullYear();

    const [yearlyForecast, yearElements, solarTerms] = await Promise.all([
      client.chinese.getYearlyForecast({
        subject,
        forecast_year: year,
        include_monthly: false,
        include_advice: true,
        language: 'uk',
      } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chinese/forecast', call: 'getYearlyForecast' }, level: 'warning' });
        return null;
      }),
      client.chinese.analyzeYearElements(year, { language: 'uk' } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chinese/forecast', call: 'analyzeYearElements' }, level: 'warning' });
        return null;
      }),
      client.chinese.getSolarTerms(year).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chinese/forecast', call: 'getSolarTerms' }, level: 'warning' });
        return null;
      }),
    ]);

    const partialErrors = [!yearlyForecast, !yearElements, !solarTerms].filter(Boolean).length;

    return NextResponse.json(
      { yearlyForecast, yearElements, solarTerms, partialErrors: partialErrors > 0 ? partialErrors : undefined },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'chinese/forecast', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка китайського прогнозу' }, { status: 500 });
  }
}
