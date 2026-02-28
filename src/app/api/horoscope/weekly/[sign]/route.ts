import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sign: string }> }
) {
  try {
    const { sign } = await params;
    const client = getAstrologyClient();
    const horoscope = await client.horoscope.getSignWeeklyHoroscope(sign as any);

    return NextResponse.json(
      { horoscope },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'horoscope/weekly', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати тижневий гороскоп' },
      { status: 500 }
    );
  }
}
