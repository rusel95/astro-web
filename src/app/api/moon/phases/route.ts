import { NextRequest, NextResponse } from 'next/server';
import { MoonPhase } from '@/types/moon';

export const runtime = 'edge';
export const revalidate = 86400; // Cache for 24 hours

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

    const response = await fetch(`${baseUrl}/moon/phases`, {
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
    const phases: MoonPhase[] = (data.phases || []).map((p: any) => ({
      date: p.date,
      phase: p.phase as MoonPhase['phase'],
      illumination: p.illumination,
      zodiac_sign: p.zodiac_sign,
      degree: p.degree,
    }));

    return NextResponse.json({ phases }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error: any) {
    console.error('Moon phases error:', error);
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати фази Місяця' },
      { status: 500 }
    );
  }
}
