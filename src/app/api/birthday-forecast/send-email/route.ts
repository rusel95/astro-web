/**
 * Send Birthday Forecast Email
 * 
 * POST /api/birthday-forecast/send-email
 * 
 * Sends birthday reminder email with forecast link
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { markEmailSent } from '@/lib/birthday-forecast-cache';
import { renderBirthdayForecastEmail } from '@/lib/email/templates/birthday-forecast';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { user_id, forecast_id, days_until_birthday } = await req.json();
    
    if (!user_id || !forecast_id) {
      return NextResponse.json({ 
        error: 'user_id and forecast_id required' 
      }, { status: 400 });
    }
    
    const supabase = createServiceClient();
    
    // Get user data
    const { data: user } = await supabase.auth.admin.getUserById(user_id);
    if (!user?.user?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get forecast data
    const { data: forecast } = await supabase
      .from('birthday_forecasts')
      .select('*')
      .eq('id', forecast_id)
      .single();
    
    if (!forecast) {
      return NextResponse.json({ error: 'Forecast not found' }, { status: 404 });
    }
    
    // Check if email already sent
    if (forecast.email_sent_at) {
      return NextResponse.json({ 
        message: 'Email already sent',
        sent_at: forecast.email_sent_at 
      });
    }
    
    // Build forecast URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astro-web-five.vercel.app';
    const forecastUrl = `${baseUrl}/birthday-forecast/${forecast.chart_id}`;
    
    // Get user name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user_id)
      .single();
    
    const userName = profile?.full_name || user.user.email.split('@')[0];
    
    // Render email HTML
    const emailHtml = renderBirthdayForecastEmail({
      userName,
      age: forecast.age_turning,
      daysUntilBirthday: days_until_birthday || 7,
      forecastUrl,
    });
    
    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Зоря <astro@astrosvitla.com>',
      to: user.user.email,
      subject: `🎂 ${userName}, через ${days_until_birthday} днів твій день народження!`,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': forecast_id,
      },
    });
    
    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: emailError 
      }, { status: 500 });
    }
    
    // Mark email as sent
    await markEmailSent(forecast_id);
    
    return NextResponse.json({
      success: true,
      email_id: emailData?.id,
      sent_to: user.user.email,
      forecast_url: forecastUrl,
    });
    
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
