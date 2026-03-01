import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkSubject } from '@/lib/astrology-client';
import { ChartInput } from '@/types/astrology';

export async function POST(req: NextRequest) {
  try {
    const { person1, person2 }: { person1: ChartInput; person2: ChartInput } = await req.json();

    const client = getAstrologyClient();
    const subject1 = toSdkSubject(person1);
    const subject2 = toSdkSubject(person2);

    const [compatibility, loveLanguages1, loveLanguages2, redFlags1, redFlags2, timing] = await Promise.all([
      client.insights.relationship.getCompatibility({ subjects: [subject1, subject2] } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'relationship-insights', call: 'getCompatibility' }, level: 'warning' });
        return null;
      }),
      client.insights.relationship.getLoveLanguages({ subject: subject1 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'relationship-insights', call: 'getLoveLanguages1' }, level: 'warning' });
        return null;
      }),
      client.insights.relationship.getLoveLanguages({ subject: subject2 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'relationship-insights', call: 'getLoveLanguages2' }, level: 'warning' });
        return null;
      }),
      client.insights.relationship.getRedFlags({ subject: subject1 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'relationship-insights', call: 'getRedFlags1' }, level: 'warning' });
        return null;
      }),
      client.insights.relationship.getRedFlags({ subject: subject2 } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'relationship-insights', call: 'getRedFlags2' }, level: 'warning' });
        return null;
      }),
      client.insights.relationship.getTiming({ subjects: [subject1, subject2] } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'relationship-insights', call: 'getTiming' }, level: 'warning' });
        return null;
      }),
    ]);

    const partialErrors: string[] = [];
    if (!compatibility) partialErrors.push('compatibility');
    if (!loveLanguages1 && !loveLanguages2) partialErrors.push('loveLanguages');
    if (!timing) partialErrors.push('timing');

    return NextResponse.json(
      {
        compatibility,
        loveLanguages: {
          person1: loveLanguages1,
          person2: loveLanguages2,
        },
        redFlags: {
          person1: redFlags1,
          person2: redFlags2,
        },
        timing,
        partialErrors: partialErrors.length > 0 ? partialErrors : undefined,
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'relationship-insights', level: 'error' } });
    return NextResponse.json(
      { error: error.message || 'Помилка аналізу стосунків' },
      { status: 500 }
    );
  }
}
