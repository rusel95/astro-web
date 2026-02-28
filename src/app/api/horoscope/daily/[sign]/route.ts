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

    const [horoscope, horoscopeText] = await Promise.all([
      client.horoscope.getSignDailyHoroscope(sign as any),
      client.horoscope.getSignDailyHoroscopeText(sign as any).catch(() => null),
    ]);

    return NextResponse.json(
      { horoscope, horoscopeText },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'horoscope/daily', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати гороскоп' },
      { status: 500 }
    );
  }
}
