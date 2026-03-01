import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject: rawSubject } = await req.json();
    const client = getAstrologyClient();

    const subject = {
      name: rawSubject.name,
      birth_data: rawSubject.birth_data,
    };

    const horoscope = await client.horoscope.getChineseHoroscope({ subject } as any);

    return NextResponse.json(
      { horoscope },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'horoscope/chinese', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати китайський гороскоп' },
      { status: 500 }
    );
  }
}
