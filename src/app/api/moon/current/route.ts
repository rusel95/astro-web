import { NextRequest, NextResponse } from 'next/server';
import { CurrentMoon } from '@/types/moon';

export const runtime = 'edge';
export const revalidate = 900; // Cache for 15 minutes

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chartId = searchParams.get('chartId');
    
    const baseUrl = process.env.ASTROLOGY_API_BASE_URL || 'https://api.astrology-api.io/api/v3';
    const apiKey = process.env.ASTROLOGY_API_KEY;

    if (!apiKey || apiKey === 'placeholder') {
      return NextResponse.json(
        { error: 'API тимчасово недоступний' },
        { status: 503 }
      );
    }

    const now = new Date();
    const requestBody: any = {
      date: now.toISOString(),
      latitude: 49.8397, // Default: Lviv
      longitude: 24.0297,
    };

    // If chartId provided, fetch user's chart for house position
    if (chartId) {
      // TODO: Fetch user chart from storage/Supabase
      // For now, use default coordinates
    }

    const response = await fetch(`${baseUrl}/moon/current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    const currentMoon: CurrentMoon = {
      longitude: data.longitude,
      sign: data.sign,
      house: data.house || 1,
      phase: data.phase,
      illumination: data.illumination,
      is_void: data.is_void || false,
      next_void: data.next_void ? {
        start: data.next_void.start,
        end: data.next_void.end,
        last_aspect: data.next_void.last_aspect,
        sign_ingress: data.next_void.sign_ingress,
      } : undefined,
    };

    return NextResponse.json({ current: currentMoon }, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (error: any) {
    console.error('Current moon error:', error);
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати поточну позицію Місяця' },
      { status: 500 }
    );
  }
}
