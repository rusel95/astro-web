import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findVoidPeriods } from '@/lib/moon/void-calculator';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '30');

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    // Try Supabase first (pre-computed, fast)
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const endDateStr = endDate.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('moon_calendar')
          .select('date, void_of_course')
          .gte('date', startDate)
          .lte('date', endDateStr)
          .not('void_of_course', 'is', null)
          .order('date', { ascending: true });

        if (!error && data && data.length > 0) {
          const voidPeriods = data.map((row) => ({
            start: row.void_of_course.start,
            end: row.void_of_course.end,
            last_aspect: {
              planet: row.void_of_course.lastAspect.planet,
              type: row.void_of_course.lastAspect.type,
              time: row.void_of_course.lastAspect.time,
            },
            sign_ingress: {
              to_sign: row.void_of_course.nextSign,
              time: row.void_of_course.end,
            },
            moon_sign: row.void_of_course.moonSign,
            duration_minutes: row.void_of_course.durationMinutes,
          }));

          return NextResponse.json({ void_periods: voidPeriods }, {
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
          });
        }
      } catch {
        // Fall through to computed fallback
      }
    }

    // Fallback: compute void periods on-the-fly
    // Limit to 7 days to keep response fast
    const computeEnd = new Date(startDate);
    computeEnd.setDate(computeEnd.getDate() + Math.min(days, 7));

    const computed = findVoidPeriods(new Date(startDate), computeEnd);
    const voidPeriods = computed.map((v) => ({
      start: v.start.toISOString(),
      end: v.end.toISOString(),
      last_aspect: {
        planet: v.lastAspect.planet,
        type: v.lastAspect.type,
        time: v.lastAspect.time.toISOString(),
      },
      sign_ingress: {
        to_sign: v.nextSign,
        time: v.end.toISOString(),
      },
      moon_sign: v.moonSign,
      duration_minutes: v.durationMinutes,
    }));

    return NextResponse.json({ void_periods: voidPeriods }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: any) {
    console.error('Void of course error:', error);
    // Return empty array rather than failing the whole page
    return NextResponse.json({ void_periods: [] });
  }
}
