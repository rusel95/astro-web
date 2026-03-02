import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject: rawSubject } = await req.json();
    const client = getAstrologyClient();

    const subject = {
      name: rawSubject.name,
      birth_data: rawSubject.birth_data,
    };
    const options = toSdkChartOptions();

    const horoscope = await client.horoscope.getPersonalDailyHoroscope({ subject, options } as any);

    return NextResponse.json(
      { horoscope },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'horoscope/personal', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати персональний гороскоп' },
      { status: 500 }
    );
  }
}
