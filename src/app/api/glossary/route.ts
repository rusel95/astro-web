import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const client = getAstrologyClient();

    const [activePoints, elements, houses, keywords, lifeAreas] = await Promise.all([
      client.glossary.getActivePoints({} as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'glossary', call: 'getActivePoints' }, level: 'warning' });
        return null;
      }),
      client.glossary.getElements().catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'glossary', call: 'getElements' }, level: 'warning' });
        return null;
      }),
      client.glossary.getHouses({} as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'glossary', call: 'getHouses' }, level: 'warning' });
        return null;
      }),
      client.glossary.getKeywords(category ? { category } : {} as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'glossary', call: 'getKeywords' }, level: 'warning' });
        return null;
      }),
      client.glossary.getLifeAreas({ language: 'uk' } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'glossary', call: 'getLifeAreas' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { activePoints, elements, houses, keywords, lifeAreas },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'glossary', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка глосарія' }, { status: 500 });
  }
}
