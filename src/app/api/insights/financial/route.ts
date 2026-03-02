import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();

    const [marketTiming, personalTrading, gannAnalysis, bradleySiderograph] = await Promise.all([
      client.insights.financial.getMarketTiming({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/financial', call: 'getMarketTiming' }, level: 'warning' });
        return null;
      }),
      client.insights.financial.analyzePersonalTrading({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/financial', call: 'analyzePersonalTrading' }, level: 'warning' });
        return null;
      }),
      client.insights.financial.getGannAnalysis({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/financial', call: 'getGannAnalysis' }, level: 'warning' });
        return null;
      }),
      client.insights.financial.getBradleySiderograph({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/financial', call: 'getBradleySiderograph' }, level: 'warning' });
        return null;
      }),
    ]);

    const hasData = marketTiming || personalTrading || gannAnalysis || bradleySiderograph;
    if (!hasData) {
      return NextResponse.json({ error: 'Помилка фінансового аналізу' }, { status: 500 });
    }

    return NextResponse.json(
      { marketTiming, personalTrading, gannAnalysis, bradleySiderograph },
      { headers: { 'Cache-Control': 'private, s-maxage=86400, stale-while-revalidate=3600' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'insights/financial', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка фінансового аналізу' }, { status: 500 });
  }
}
