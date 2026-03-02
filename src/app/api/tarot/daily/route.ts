import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function GET(req: NextRequest) {
  try {
    const client = getAstrologyClient();
    const today = new Date().toISOString().split('T')[0];

    const dailyCard = await client.tarot.getDailyCard({ user_id: `anon-${today}` } as any).catch((e: unknown) => {
      Sentry.captureException(e, { tags: { route: 'tarot/daily', call: 'getDailyCard' }, level: 'warning' });
      return null;
    });

    if (!dailyCard) {
      return NextResponse.json({ error: 'Карту дня недоступна' }, { status: 500 });
    }

    return NextResponse.json(
      { dailyCard },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'tarot/daily', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка карти дня' }, { status: 500 });
  }
}
