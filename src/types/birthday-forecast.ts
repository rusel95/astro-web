/**
 * Birthday Forecast Types
 * 
 * Types for birthday forecast feature (caching, email automation)
 */

import type { BirthdayForecastResponse } from '@/app/api/birthday-forecast/route';

export interface BirthdayForecastRecord {
  id: string;
  user_id: string;
  chart_id: string;
  
  // Birthday info
  birth_date: string; // ISO date (YYYY-MM-DD)
  forecast_year: number; // 2026, 2027, etc.
  age_turning: number;
  
  // Cached forecast
  forecast_data: BirthdayForecastResponse;
  
  // Metadata
  generated_at: string; // ISO timestamp
  viewed_at: string | null;
  shared: boolean;
  
  // Email tracking
  email_sent_at: string | null;
  email_opened: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface CreateBirthdayForecastInput {
  user_id: string;
  chart_id: string;
  birth_date: string;
  forecast_year: number;
  age_turning: number;
  forecast_data: BirthdayForecastResponse;
}

export interface BirthdayEmailTrigger {
  user_id: string;
  email: string;
  name: string;
  birth_date: string;
  days_until_birthday: number;
  forecast_url: string;
}

export interface BirthdayForecastCache {
  /**
   * Get or generate birthday forecast for a chart
   * Uses cached version if available, generates new if needed
   */
  getOrGenerate(params: {
    user_id: string;
    chart_id: string;
    birth_date: string;
    age_turning: number;
  }): Promise<BirthdayForecastResponse>;
  
  /**
   * Mark forecast as viewed
   */
  markViewed(id: string): Promise<void>;
  
  /**
   * Mark forecast as shared
   */
  markShared(id: string): Promise<void>;
  
  /**
   * Mark email as sent
   */
  markEmailSent(id: string): Promise<void>;
}
