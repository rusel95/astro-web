import { NextRequest, NextResponse } from 'next/server';
import { VoidPeriod } from '@/types/moon';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '30');

    const baseUrl = process.env.ASTROLOGY_API_BASE_URL || 'https://api.astrology-api.io/api/v3';
    const apiKey = process.env.ASTROLOGY_API_KEY;

    if (!apiKey || apiKey === 'placeholder') {
      return NextResponse.json(
        { error: 'API тимчасово недоступний' },
        { status: 503 }
      );
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    const response = await fetch(`${baseUrl}/moon/void-of-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate.toISOString().split('T')[0],
        timezone: 'Europe/Kiev',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map API response to our types
    const voidPeriods: VoidPeriod[] = (data.void_periods || []).map((v: any) => ({
      start: v.start,
      end: v.end,
      last_aspect: {
        planet: v.last_aspect.planet,
        type: v.last_aspect.type,
        time: v.last_aspect.time,
      },
      sign_ingress: {
        to_sign: v.sign_ingress.to_sign,
        time: v.sign_ingress.time,
      },
    }));

    return NextResponse.json({ void_periods: voidPeriods }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: any) {
    console.error('Void of course error:', error);
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати void periods' },
      { status: 500 }
    );
  }
}
