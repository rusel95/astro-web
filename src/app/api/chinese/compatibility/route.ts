import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject1, subject2 } = await req.json();
    const client = getAstrologyClient();

    const compatibility = await client.chinese.calculateCompatibility({
      subjects: [subject1, subject2],
    } as any).catch((e: unknown) => {
      Sentry.captureException(e, { tags: { route: 'chinese/compatibility', call: 'calculateCompatibility' }, level: 'error' });
      return null;
    });

    if (!compatibility) {
      return NextResponse.json({ error: 'Помилка розрахунку сумісності' }, { status: 500 });
    }

    return NextResponse.json(
      { compatibility },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'chinese/compatibility', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка китайської сумісності' }, { status: 500 });
  }
}
