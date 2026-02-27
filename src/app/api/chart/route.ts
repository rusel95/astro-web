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

    // Fetch natal chart data and SVG in parallel
    const [apiResponse, svgContent] = await Promise.all([
      client.charts.getNatalChart({ subject, options }),
      client.svg.getNatalChartSvg({ subject, options } as any, { responseType: 'text' }).catch(() => null),
    ]);

    const chart = mapAPIResponse(apiResponse as any, input);

    // Attach SVG if available
    if (svgContent && typeof svgContent === 'string' && svgContent.startsWith('<')) {
      chart.svgContent = svgContent;
    }

    const stored = { id, input, chart, createdAt: new Date().toISOString() };
    saveChart(stored);

    // Increment global counter (fire-and-forget, non-blocking)
    if (isSupabaseConfigured()) {
      void createServiceClient().rpc('increment_chart_counter');
    }

    return NextResponse.json({ id, chart });
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
