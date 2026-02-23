import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getMoonPosition,
  getMoonPhase,
  getZodiacSign,
} from '@/lib/moon/ephemeris';
import { isCurrentlyVoid, getNextVoidPeriod } from '@/lib/moon/void-calculator';

export const runtime = 'nodejs';
export const revalidate = 900; // Cache for 15 minutes

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chartId = searchParams.get('chartId');
    
    const now = new Date();
    const moonPos = getMoonPosition(now);
    const moonSign = getZodiacSign(moonPos.longitude);
    const phase = getMoonPhase(now);
    
    // Check if currently void
    const isVoid = isCurrentlyVoid(now);
    
    // Get next void period
    const nextVoid = getNextVoidPeriod(now);
    
    // Calculate house position if chartId provided
    let house = 1; // Default
    if (chartId) {
      // TODO: Calculate house based on user's natal chart
      // For now, use default
    }
    
    const currentMoon = {
      longitude: moonPos.longitude,
      sign: moonSign,
      house,
      phase: phase.phase,
      illumination: phase.illumination,
      is_void: isVoid,
      next_void: nextVoid ? {
        start: nextVoid.start.toISOString(),
        end: nextVoid.end.toISOString(),
        last_aspect: {
          planet: nextVoid.lastAspect.planet,
          type: nextVoid.lastAspect.type,
          time: nextVoid.lastAspect.time.toISOString(),
        },
        sign_ingress: {
          to_sign: nextVoid.nextSign,
          time: nextVoid.end.toISOString(),
        },
        duration_minutes: nextVoid.durationMinutes,
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
