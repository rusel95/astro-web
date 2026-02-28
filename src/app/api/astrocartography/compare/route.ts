import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject, locations } = await req.json();

    if (!Array.isArray(locations) || locations.length < 2) {
      return NextResponse.json(
        { error: 'Потрібно вказати мінімум 2 локації для порівняння' },
        { status: 400 }
      );
    }

    const client = getAstrologyClient();
    const comparison = await client.astrocartography.compareLocations({ subject, locations } as any);

    return NextResponse.json(
      { comparison },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'astrocartography/compare', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка порівняння локацій' }, { status: 500 });
  }
}
