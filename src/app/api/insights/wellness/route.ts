import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();

    const [bodyMapping, biorhythms, energyPatterns, wellnessTiming, wellnessScore, moonWellness] = await Promise.all([
      client.insights.wellness.getBodyMapping({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/wellness', call: 'getBodyMapping' }, level: 'warning' });
        return null;
      }),
      client.insights.wellness.getBiorhythms({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/wellness', call: 'getBiorhythms' }, level: 'warning' });
        return null;
      }),
      client.insights.wellness.getEnergyPatterns({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/wellness', call: 'getEnergyPatterns' }, level: 'warning' });
        return null;
      }),
      client.insights.wellness.getWellnessTiming({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/wellness', call: 'getWellnessTiming' }, level: 'warning' });
        return null;
      }),
      client.insights.wellness.getWellnessScore({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/wellness', call: 'getWellnessScore' }, level: 'warning' });
        return null;
      }),
      client.insights.wellness.getMoonWellness({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/wellness', call: 'getMoonWellness' }, level: 'warning' });
        return null;
      }),
    ]);

    const hasData = bodyMapping || biorhythms || energyPatterns || wellnessTiming || wellnessScore || moonWellness;
    if (!hasData) {
      return NextResponse.json({ error: 'Помилка велнес-аналізу' }, { status: 500 });
    }

    return NextResponse.json(
      { bodyMapping, biorhythms, energyPatterns, wellnessTiming, wellnessScore, moonWellness },
      { headers: { 'Cache-Control': 'private, s-maxage=86400, stale-while-revalidate=3600' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'insights/wellness', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка велнес-аналізу' }, { status: 500 });
  }
}
