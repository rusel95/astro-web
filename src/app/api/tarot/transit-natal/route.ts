import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();

    const birthData = subject?.birth_data;
    if (!birthData) {
      return NextResponse.json({ error: 'Дані народження обов\'язкові' }, { status: 400 });
    }

    const [drawn, report] = await Promise.all([
      client.tarot.drawCards({ count: 3 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'tarot/transit-natal', call: 'drawCards' }, level: 'warning' });
        return null;
      }),
      client.tarot.generateNatalReport({
        birth_data: birthData,
        include_timing: false,
        language: 'uk',
      } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'tarot/transit-natal', call: 'generateNatalReport' }, level: 'warning' });
        return null;
      }),
    ]);

    const cards = (drawn as any)?.cards ?? drawn;

    return NextResponse.json({ cards, report });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'tarot/transit-natal', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка транзитного таро' }, { status: 500 });
  }
}
