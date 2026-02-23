import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const revalidate = 86400; // Cache for 24 hours

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

    // Fetch from moon_calendar table
    const { data, error } = await supabase
      .from('moon_calendar')
      .select('date, moon_sign, moon_phase, moon_phase_angle, illumination_percent, moon_longitude')
      .gte('date', startDate)
      .lte('date', endDateStr)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Дані ще не згенеровано. Запустіть: npm run generate-moon-calendar' },
        { status: 503 }
      );
    }

    // Map to expected format
    const phases = data.map((row) => ({
      date: row.date,
      phase: row.moon_phase,
      illumination: row.illumination_percent,
      zodiac_sign: row.moon_sign,
      degree: row.moon_longitude % 30, // Degree within sign
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
