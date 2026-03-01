import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, location } = await req.json();
    const client = getAstrologyClient();

    if (!location) {
      return NextResponse.json({ error: 'Локація обов\'язкова' }, { status: 400 });
    }

    const [locationAnalysis, relocationChart] = await Promise.all([
      client.astrocartography.analyzeLocation({ subject, location } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'astrocartography/location', call: 'analyzeLocation' }, level: 'warning' });
        return null;
      }),
      client.astrocartography.generateRelocationChart({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'astrocartography/location', call: 'generateRelocationChart' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { locationAnalysis, relocationChart },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'astrocartography/location', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка аналізу локації' }, { status: 500 });
  }
}
