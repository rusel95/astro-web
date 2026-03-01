import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient } from '@/lib/astrology-client';

const SPREAD_COUNTS: Record<string, number> = {
  single: 1,
  three_card: 3,
  celtic_cross: 10,
  houses: 12,
  tree_of_life: 10,
  synastry: 7,
};

const TAROT_BASE_OPTIONS = {
  use_reversals: false,
  include_dignities: false,
  include_timing: false,
  include_astro_context: false,
  include_birth_cards: false,
  language: 'uk',
};

export async function POST(req: NextRequest) {
  try {
    const { spread_type = 'single', question, birth_data, partner_birth_data } = await req.json();
    const client = getAstrologyClient();

    const count = SPREAD_COUNTS[spread_type] ?? 1;

    // Step 1: Draw cards
    const drawn = await client.tarot.drawCards({ count } as any);
    const cards = (drawn as any)?.cards ?? drawn;

    // Step 2: Generate report based on spread type
    const reportPayload = {
      ...TAROT_BASE_OPTIONS,
      spread_type,
      cards,
      ...(question ? { question } : {}),
      ...(birth_data ? { birth_data } : {}),
      ...(partner_birth_data ? { partner_birth_data } : {}),
    };

    let report: unknown = null;
    try {
      switch (spread_type) {
        case 'single':
          report = await client.tarot.generateSingleReport(reportPayload as any);
          break;
        case 'three_card':
          report = await client.tarot.generateThreeCardReport(reportPayload as any);
          break;
        case 'celtic_cross':
          report = await client.tarot.generateCelticCrossReport(reportPayload as any);
          break;
        case 'houses':
          report = await client.tarot.generateHousesReport(reportPayload as any);
          break;
        case 'tree_of_life':
          report = await client.tarot.generateTreeOfLifeReport(reportPayload as any);
          break;
        case 'synastry':
          report = await client.tarot.generateSynastryReport(reportPayload as any);
          break;
        default:
          report = await client.tarot.generateSingleReport({ ...reportPayload, spread_type: 'single' } as any);
      }
    } catch (e: unknown) {
      Sentry.captureException(e, { tags: { route: 'tarot/draw', spread: spread_type }, level: 'warning' });
    }

    return NextResponse.json({ cards, report, spread_type });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'tarot/draw', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка розкладу таро' }, { status: 500 });
  }
}
