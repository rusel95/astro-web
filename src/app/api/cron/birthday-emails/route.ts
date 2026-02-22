/**
 * Birthday Email Cron Job
 * 
 * GET /api/cron/birthday-emails
 * 
 * Runs daily (via Vercel Cron or external scheduler)
 * Sends birthday forecast emails to users whose birthday is in 7 days
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUsersWithUpcomingBirthdays } from '@/lib/birthday-forecast-cache';
import { createServiceClient } from '@/lib/supabase/service';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const DAYS_AHEAD = 7; // Send email 7 days before birthday
    
    // Get users with birthdays in 7 days
    const users = await getUsersWithUpcomingBirthdays(DAYS_AHEAD);
    
    if (users.length === 0) {
      return NextResponse.json({
        message: 'No birthdays today',
        date: new Date().toISOString(),
      });
    }
    
    const supabase = createServiceClient();
    const results: Array<{
      user_id: string;
      email: string;
      status: 'sent' | 'skipped' | 'error';
      reason?: string;
    }> = [];
    
    for (const user of users) {
      try {
        // Check if forecast exists for this year
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1; // Birthday forecast is for next year of life
        
        const { data: existingForecast } = await supabase
          .from('birthday_forecasts')
          .select('id, email_sent_at')
          .eq('user_id', user.user_id)
          .eq('forecast_year', nextYear)
          .single();
        
        // Skip if already sent
        if (existingForecast?.email_sent_at) {
          results.push({
            user_id: user.user_id,
            email: user.email,
            status: 'skipped',
            reason: 'Email already sent',
          });
          continue;
        }
        
        // If no forecast exists, generate one first
        let forecastId = existingForecast?.id;
        
        if (!forecastId) {
          // Fetch user's chart
          const { data: chart } = await supabase
            .from('charts')
            .select('*')
            .eq('id', user.chart_id)
            .single();
          
          if (!chart) {
            results.push({
              user_id: user.user_id,
              email: user.email,
              status: 'error',
              reason: 'Chart not found',
            });
            continue;
          }
          
          // Generate forecast via API
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astro-web-five.vercel.app';
          
          const generateRes = await fetch(`${baseUrl}/api/birthday-forecast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chart: chart.chart_data,
              userName: user.email.split('@')[0],
              age: calculateAge(user.birth_date),
            }),
          });
          
          if (!generateRes.ok) {
            results.push({
              user_id: user.user_id,
              email: user.email,
              status: 'error',
              reason: 'Failed to generate forecast',
            });
            continue;
          }
          
          const forecast = await generateRes.json();
          
          // Save forecast
          const { data: savedForecast } = await supabase
            .from('birthday_forecasts')
            .insert({
              user_id: user.user_id,
              chart_id: user.chart_id,
              birth_date: user.birth_date,
              forecast_year: nextYear,
              age_turning: calculateAge(user.birth_date) + 1,
              forecast_data: forecast,
            })
            .select()
            .single();
          
          forecastId = savedForecast?.id;
        }
        
        if (!forecastId) {
          results.push({
            user_id: user.user_id,
            email: user.email,
            status: 'error',
            reason: 'Failed to create forecast',
          });
          continue;
        }
        
        // Send email
        const emailRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://astro-web-five.vercel.app'}/api/birthday-forecast/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cronSecret}`,
          },
          body: JSON.stringify({
            user_id: user.user_id,
            forecast_id: forecastId,
            days_until_birthday: DAYS_AHEAD,
          }),
        });
        
        if (emailRes.ok) {
          results.push({
            user_id: user.user_id,
            email: user.email,
            status: 'sent',
          });
        } else {
          results.push({
            user_id: user.user_id,
            email: user.email,
            status: 'error',
            reason: 'Email send failed',
          });
        }
        
      } catch (error: any) {
        results.push({
          user_id: user.user_id,
          email: user.email,
          status: 'error',
          reason: error.message,
        });
      }
    }
    
    return NextResponse.json({
      message: 'Birthday emails processed',
      date: new Date().toISOString(),
      total_users: users.length,
      sent: results.filter(r => r.status === 'sent').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    });
    
  } catch (error: any) {
    console.error('Birthday cron error:', error);
    return NextResponse.json(
      { error: error.message || 'Cron job failed' },
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
