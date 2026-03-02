import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();

    const [leadershipStyle, teamDynamics, businessTiming, hiringCompatibility] = await Promise.all([
      client.insights.business.getLeadershipStyle({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/business', call: 'getLeadershipStyle' }, level: 'warning' });
        return null;
      }),
      client.insights.business.getTeamDynamics({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/business', call: 'getTeamDynamics' }, level: 'warning' });
        return null;
      }),
      client.insights.business.getBusinessTiming({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/business', call: 'getBusinessTiming' }, level: 'warning' });
        return null;
      }),
      client.insights.business.getHiringCompatibility({ subject } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'insights/business', call: 'getHiringCompatibility' }, level: 'warning' });
        return null;
      }),
    ]);

    const hasData = leadershipStyle || teamDynamics || businessTiming || hiringCompatibility;
    if (!hasData) {
      return NextResponse.json({ error: 'Помилка бізнес-аналізу' }, { status: 500 });
    }

    return NextResponse.json(
      { leadershipStyle, teamDynamics, businessTiming, hiringCompatibility },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'insights/business', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка бізнес-аналізу' }, { status: 500 });
  }
}
