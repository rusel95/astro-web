import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getMoonPhase, getMoonPosition, getZodiacSign } from '@/lib/moon/ephemeris';

export const runtime = 'nodejs';
export const revalidate = 86400; // Cache for 24 hours

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function computePhasesForRange(startDate: Date, days: number) {
  const phases = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const moonPos = getMoonPosition(date);
    const phase = getMoonPhase(date);

    phases.push({
      date: date.toISOString().split('T')[0],
      phase: phase.phase,
      illumination: Math.round(phase.illumination),
      zodiac_sign: getZodiacSign(moonPos.longitude),
      degree: Math.round(moonPos.longitude % 30 * 10) / 10,
    });
  }
  return phases;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '30');

    // Try Supabase first (pre-computed, fast)
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days);
        const endDateStr = endDate.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('moon_calendar')
          .select('date, moon_sign, moon_phase, illumination_percent, moon_longitude')
          .gte('date', startDate)
          .lte('date', endDateStr)
          .order('date', { ascending: true });

        if (!error && data && data.length > 0) {
          const phases = data.map((row) => ({
            date: row.date,
            phase: row.moon_phase,
            illumination: row.illumination_percent,
            zodiac_sign: row.moon_sign,
            degree: row.moon_longitude % 30,
          }));

          return NextResponse.json({ phases }, {
            headers: {
              'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
            },
          });
        }
      } catch {
        // Fall through to computed fallback
      }
    }

    // Fallback: compute phases on-the-fly using astronomy engine
    const phases = computePhasesForRange(new Date(startDate), days);

    return NextResponse.json({ phases }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
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
