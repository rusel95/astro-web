import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject1, subject2 } = await req.json();
    const client = getAstrologyClient();

    const s1 = { ...subject1, name: subject1?.name || 'Person 1' };
    const s2 = { ...subject2, name: subject2?.name || 'Person 2' };

    const compatibility = await client.numerology.analyzeCompatibility({ subjects: [s1, s2] } as any).catch((e: unknown) => {
      Sentry.captureException(e, { tags: { route: 'numerology/compatibility', call: 'analyzeCompatibility' }, level: 'error' });
      return null;
    });

    if (!compatibility) {
      return NextResponse.json({ error: 'Помилка нумерологічної сумісності' }, { status: 500 });
    }

    return NextResponse.json(
      { compatibility },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'numerology/compatibility', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка нумерологічної сумісності' }, { status: 500 });
  }
}
