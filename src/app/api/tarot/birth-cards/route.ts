import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { birth_date, subject } = await req.json();
    const client = getAstrologyClient();

    const payload = subject ? { subject, include_interpretation: true } : { birth_date, include_interpretation: true };

    const birthCards = await client.tarot.calculateBirthCards(payload as any).catch((e: unknown) => {
      Sentry.captureException(e, { tags: { route: 'tarot/birth-cards', call: 'calculateBirthCards' }, level: 'error' });
      return null;
    });

    if (!birthCards) {
      return NextResponse.json({ error: 'Помилка розрахунку карт народження' }, { status: 500 });
    }

    return NextResponse.json(
      { birthCards },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'tarot/birth-cards', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка карт народження' }, { status: 500 });
  }
}
