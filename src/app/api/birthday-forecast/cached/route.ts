/**
 * Cached Birthday Forecast API
 * 
 * GET /api/birthday-forecast/cached?chart_id=xxx&year=2026
 * 
 * Returns cached forecast if available, otherwise generates new one
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getCachedForecast, saveForecast, markForecastViewed } from '@/lib/birthday-forecast-cache';
import type { BirthdayForecastResponse } from '../route';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chart_id = searchParams.get('chart_id');
    const year = searchParams.get('year');
    
    if (!chart_id) {
      return NextResponse.json({ error: 'chart_id required' }, { status: 400 });
    }
    
    const forecast_year = year ? parseInt(year) : new Date().getFullYear();
    
    // Get authenticated user
    const supabase = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check cache first
    const cached = await getCachedForecast({
      user_id: user.id,
      chart_id,
      forecast_year,
    });
    
    if (cached) {
      // Mark as viewed (fire-and-forget)
      if (!cached.viewed_at) {
        void markForecastViewed(cached.id);
      }
      
      return NextResponse.json({
        forecast: cached.forecast_data,
        cached: true,
        generated_at: cached.generated_at,
      });
    }
    
    // Not cached - need to generate
    // Fetch chart data
    const { data: chart } = await supabase
      .from('charts')
      .select('*')
      .eq('id', chart_id)
      .eq('user_id', user.id)
      .single();
    
    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }
    
    // Generate forecast via main API
    const generateRes = await fetch(`${req.nextUrl.origin}/api/birthday-forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chart: chart.chart_data,
        userName: user.email?.split('@')[0] || 'Friend',
        age: calculateAge(chart.birth_date),
      }),
    });
    
    if (!generateRes.ok) {
      throw new Error('Failed to generate forecast');
    }
    
    const forecast: BirthdayForecastResponse = await generateRes.json();
    
    // Save to cache
    await saveForecast({
      user_id: user.id,
      chart_id,
      birth_date: chart.birth_date,
      forecast_year,
      age_turning: calculateAge(chart.birth_date) + 1,
      forecast_data: forecast,
    });
    
    return NextResponse.json({
      forecast,
      cached: false,
      generated_at: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Cached forecast error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get forecast' },
      { status: 500 }
    );
  }
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
