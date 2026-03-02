import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export const revalidate = 900; // ISR 15min

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const client = getAstrologyClient();

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const [mansions, voidOfCourse, events] = await Promise.all([
      client.lunar.getMansions({ date: startDate } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'lunar/calendar', call: 'getMansions' }, level: 'warning' });
        return null;
      }),
      client.lunar.getVoidOfCourse({ start_date: startDate, end_date: endDate } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'lunar/calendar', call: 'getVoidOfCourse' }, level: 'warning' });
        return null;
      }),
      client.lunar.getEvents({ start_date: startDate, end_date: endDate } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'lunar/calendar', call: 'getEvents' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { mansions, voidOfCourse, events, year, month },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'lunar/calendar', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка місячного календаря' }, { status: 500 });
  }
}
