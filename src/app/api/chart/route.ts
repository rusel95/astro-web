import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { mapAPIResponse } from '@/lib/api-mapper';
import { saveChart, generateId } from '@/lib/chart-store';
import { ChartInput } from '@/types/astrology';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service';
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';
import { AstrologyError } from '@astro-api/astroapi-typescript';

export async function POST(req: NextRequest) {
  try {
    const input: ChartInput = await req.json();
    const id = generateId();

    const client = getAstrologyClient();
    const subject = toSdkSubject(input);
    const options = toSdkChartOptions();

    // Fetch natal chart data, SVG, and enhanced data in parallel
    // Enhanced calls are optional — failures don't block the basic chart
    const [apiResponse, svgContent, natalReport, enhancedPositions, enhancedAspects] = await Promise.all([
      client.charts.getNatalChart({ subject, options }),
      client.svg.getNatalChartSvg({ subject, options } as any, { responseType: 'text' }).catch(() => null),
      client.analysis.getNatalReport({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chart', call: 'getNatalReport' }, level: 'warning' });
        return null;
      }),
      client.data.getEnhancedPositions({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chart', call: 'getEnhancedPositions' }, level: 'warning' });
        return null;
      }),
      client.data.getEnhancedAspects({ subject, options } as any).catch((e: unknown) => {
        Sentry.captureException(e, { tags: { route: 'chart', call: 'getEnhancedAspects' }, level: 'warning' });
        return null;
      }),
    ]);

    const chart = mapAPIResponse(apiResponse as any, input);

    // Attach SVG if available
    if (svgContent && typeof svgContent === 'string' && svgContent.startsWith('<')) {
      chart.svgContent = svgContent;
    }

    // Attach enhanced data if available
    const enhanced: Record<string, unknown> = {};
    if (natalReport) enhanced.natalReport = natalReport;
    if (enhancedPositions) enhanced.enhancedPositions = enhancedPositions;
    if (enhancedAspects) enhanced.enhancedAspects = enhancedAspects;

    const stored = { id, input, chart, createdAt: new Date().toISOString() };
    saveChart(stored);

    // Increment global counter (fire-and-forget, non-blocking)
    if (isSupabaseConfigured()) {
      void createServiceClient().rpc('increment_chart_counter');
    }

    return NextResponse.json({ id, chart, enhanced });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'chart' } });
    if (error instanceof AstrologyError) {
      console.error('Astrology API error:', error.statusCode, error.message);
    }
    return NextResponse.json(
      { error: error.message || 'Не вдалося розрахувати карту' },
      { status: 500 }
    );
  }
}
