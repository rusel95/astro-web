import { NextRequest, NextResponse } from 'next/server';
import { buildAPIRequest, mapAPIResponse } from '@/lib/api-mapper';
import { saveChart, generateId } from '@/lib/chart-store';
import { ChartInput } from '@/types/astrology';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
    const input: ChartInput = await req.json();
    const id = generateId();

    const baseUrl = process.env.ASTROLOGY_API_BASE_URL || 'https://api.astrology-api.io/api/v3';
    const apiKey = process.env.ASTROLOGY_API_KEY;

    if (!apiKey || apiKey === 'placeholder') {
      return NextResponse.json(
        { error: 'Сервіс тимчасово недоступний. Зверніться до адміністратора.' },
        { status: 503 }
      );
    }

    const body = buildAPIRequest(input);

    // Fetch natal chart data and SVG in parallel
    const [chartRes, svgRes] = await Promise.all([
      fetch(`${baseUrl}/charts/natal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      }),
      fetch(`${baseUrl}/svg/natal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      }).catch(() => null),
    ]);

    if (!chartRes.ok) {
      const errBody = await chartRes.text();
      console.error('Astrology API error:', chartRes.status, errBody);
      throw new Error(`Помилка розрахунку карти (${chartRes.status})`);
    }

    const apiResponse = await chartRes.json();
    const chart = mapAPIResponse(apiResponse, input);

    // Attach SVG if available
    if (svgRes?.ok) {
      const svgText = await svgRes.text();
      if (svgText.startsWith('<')) {
        chart.svgContent = svgText;
      }
    }

    const stored = { id, input, chart, createdAt: new Date().toISOString() };
    saveChart(stored);

    // Increment global counter (fire-and-forget, non-blocking)
    if (isSupabaseConfigured()) {
      void createServiceClient().rpc('increment_chart_counter');
    }

    return NextResponse.json({ id, chart });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Не вдалося розрахувати карту' },
      { status: 500 }
    );
  }
}
