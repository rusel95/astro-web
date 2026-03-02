import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const [lines, mapData, powerZones] = await Promise.all([
      client.astrocartography.getLines({ subject, coordinate_density: 10, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'astrocartography/map', call: 'getLines' }, level: 'warning' });
        return null;
      }),
      client.astrocartography.generateMap({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'astrocartography/map', call: 'generateMap' }, level: 'warning' });
        return null;
      }),
      client.astrocartography.findPowerZones({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'astrocartography/map', call: 'findPowerZones' }, level: 'warning' });
        return null;
      }),
    ]);

    return NextResponse.json(
      { lines, mapData, powerZones },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'astrocartography/map', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка астрокартографії' }, { status: 500 });
  }
}
