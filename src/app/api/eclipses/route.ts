import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function GET() {
  try {
    const client = getAstrologyClient();

    const upcoming = await client.eclipses.getUpcoming({ count: 10 } as any).catch((e: unknown) => {
      Sentry.captureException(e, { tags: { route: 'eclipses', call: 'getUpcoming' }, level: 'warning' });
      return null;
    });

    return NextResponse.json(
      { upcoming },
      { headers: { 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'eclipses', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка затемнень' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();

    const [upcoming, natalImpact] = await Promise.all([
      client.eclipses.getUpcoming({ count: 10 } as any).catch(() => null),
      client.eclipses.checkNatalImpact({ subject, max_orb: 5 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'eclipses', call: 'checkNatalImpact' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { upcoming, natalImpact },
      { headers: { 'Cache-Control': 'private, s-maxage=604800, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'eclipses', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка затемнень' }, { status: 500 });
  }
}
