import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '30');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch from moon_calendar table (only rows with void_of_course data)
    const { data, error } = await supabase
      .from('moon_calendar')
      .select('date, void_of_course')
      .gte('date', startDate)
      .lte('date', endDateStr)
      .not('void_of_course', 'is', null)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data) {
      return NextResponse.json({ void_periods: [] });
    }

    // Extract void periods from JSONB data
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
  } catch (error: any) {
    console.error('Void of course error:', error);
    return NextResponse.json(
      { error: error.message || 'Не вдалося отримати void periods' },
      { status: 500 }
    );
  }
}
