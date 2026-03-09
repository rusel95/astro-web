import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject: rawSubject } = await req.json();
    const client = getAstrologyClient();

    // ChineseHoroscopeSubject.birth_data only accepts year/month/day/hour/minute/gender.
    // The standard Subject includes city/lat/lng which the Chinese endpoint rejects with 500.
    // Null gender must be OMITTED (not passed as null) or the endpoint rejects it.
    const bd = rawSubject?.birth_data ?? {};
    const birth_data: Record<string, unknown> = {
      year: bd.year ?? null,
      month: bd.month ?? null,
      day: bd.day ?? null,
      hour: bd.hour ?? null,
      minute: bd.minute ?? null,
    };
    if (bd.gender === 'male' || bd.gender === 'female') {
      birth_data.gender = bd.gender;
    }
    const subject = { name: rawSubject?.name ?? null, birth_data };

    const horoscope = await client.horoscope.getChineseHoroscope({ subject, language: 'uk' } as any)
      .catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'horoscope/chinese' }, extra: { birthYear: bd.year, hasGender: !!bd.gender } });
        return null;
      });

    if (!horoscope) {
      return NextResponse.json(
        { error: 'Не вдалося отримати китайський гороскоп' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { horoscope },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'horoscope/chinese', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати китайський гороскоп' },
      { status: 500 }
    );
  }
}
