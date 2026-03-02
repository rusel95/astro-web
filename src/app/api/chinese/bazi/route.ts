import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const currentYear = new Date().getFullYear();

    const [bazi, luckPillars, mingGua] = await Promise.all([
      client.chinese.calculateBaZi({
        subject,
        tradition: 'classical',
        analysis_depth: 'standard',
        language: 'uk',
        current_year: currentYear,
        include_luck_pillars: false,
      } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chinese/bazi', call: 'calculateBaZi' }, level: 'warning' });
        return null;
      }),
      client.chinese.calculateLuckPillars({
        subject,
        years_ahead: 60,
        language: 'uk',
        current_year: currentYear,
      } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chinese/bazi', call: 'calculateLuckPillars' }, level: 'warning' });
        return null;
      }),
      client.chinese.calculateMingGua({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chinese/bazi', call: 'calculateMingGua' }, level: 'warning' });
        return null;
      }),
    ]);

    const partialErrors = [!bazi, !luckPillars, !mingGua].filter(Boolean).length;

    return NextResponse.json(
      { bazi, luckPillars, mingGua, partialErrors: partialErrors > 0 ? partialErrors : undefined },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'chinese/bazi', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка BaZi' }, { status: 500 });
  }
}
