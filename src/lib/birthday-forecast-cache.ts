/**
 * Birthday Forecast Caching
 * 
 * Handles caching and retrieval of AI-generated birthday forecasts
 */

import { createServiceClient } from './supabase/service';
import type { BirthdayForecastResponse } from '@/app/api/birthday-forecast/route';
import type { 
  BirthdayForecastRecord, 
  CreateBirthdayForecastInput 
} from '@/types/birthday-forecast';

/**
 * Get cached birthday forecast or return null if not exists
 */
export async function getCachedForecast(params: {
  user_id: string;
  chart_id: string;
  forecast_year: number;
}): Promise<BirthdayForecastRecord | null> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('birthday_forecasts')
    .select('*')
    .eq('user_id', params.user_id)
    .eq('chart_id', params.chart_id)
    .eq('forecast_year', params.forecast_year)
    .single();
  
  if (error || !data) return null;
  
  return data as BirthdayForecastRecord;
}

/**
 * Save generated forecast to cache
 */
export async function saveForecast(
  input: CreateBirthdayForecastInput
): Promise<BirthdayForecastRecord | null> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('birthday_forecasts')
    .upsert({
      user_id: input.user_id,
      chart_id: input.chart_id,
      birth_date: input.birth_date,
      forecast_year: input.forecast_year,
      age_turning: input.age_turning,
      forecast_data: input.forecast_data,
      generated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,chart_id,forecast_year',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Failed to save forecast:', error);
    return null;
  }
  
  return data as BirthdayForecastRecord;
}

/**
 * Mark forecast as viewed by user
 */
export async function markForecastViewed(id: string): Promise<void> {
  const supabase = createServiceClient();
  
  await supabase
    .from('birthday_forecasts')
    .update({ viewed_at: new Date().toISOString() })
    .eq('id', id)
    .is('viewed_at', null); // Only update if not already viewed
}

/**
 * Mark forecast as shared
 */
export async function markForecastShared(id: string): Promise<void> {
  const supabase = createServiceClient();
  
  await supabase
    .from('birthday_forecasts')
    .update({ shared: true })
    .eq('id', id);
}

/**
 * Mark email as sent
 */
export async function markEmailSent(id: string): Promise<void> {
  const supabase = createServiceClient();
  
  await supabase
    .from('birthday_forecasts')
    .update({ email_sent_at: new Date().toISOString() })
    .eq('id', id);
}

/**
 * Get users with upcoming birthdays (for email triggers)
 * Returns users whose birthday is in N days
 */
export async function getUsersWithUpcomingBirthdays(
  days_ahead: number = 7
): Promise<Array<{
  user_id: string;
  email: string;
  birth_date: string;
  chart_id: string;
}>> {
  const supabase = createServiceClient();
  
  // Calculate target date (today + days_ahead)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days_ahead);
  
  const targetMonth = targetDate.getMonth() + 1; // 1-12
  const targetDay = targetDate.getDate();
  
  // Query profiles where birth_date matches month/day
  // (Supabase doesn't have direct date comparison, so we use SQL function)
  const { data, error } = await supabase.rpc('get_upcoming_birthdays', {
    target_month: targetMonth,
    target_day: targetDay,
  });
  
  if (error || !data) {
    console.error('Failed to get upcoming birthdays:', error);
    return [];
  }
  
  return data;
}

/**
 * Get forecast for specific user and year
 */
export async function getForecastByUserAndYear(
  user_id: string,
  forecast_year: number
): Promise<BirthdayForecastRecord | null> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('birthday_forecasts')
    .select('*')
    .eq('user_id', user_id)
    .eq('forecast_year', forecast_year)
    .single();
  
  if (error || !data) return null;
  
  return data as BirthdayForecastRecord;
}
