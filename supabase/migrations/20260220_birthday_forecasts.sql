-- Migration: Birthday Forecasts Feature
-- Date: 2026-02-20
-- Purpose: Add database tables for Birthday Forecast caching and email automation

-- 1. Birthday Forecasts table (cached AI forecasts)
CREATE TABLE IF NOT EXISTS birthday_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chart_id TEXT NOT NULL,
  
  -- Birthday info
  birth_date DATE NOT NULL,
  forecast_year INT NOT NULL, -- Year forecast was generated for (2026, 2027, etc.)
  age_turning INT NOT NULL, -- Age user will turn
  
  -- Generated forecast (cached to avoid re-generation)
  forecast_data JSONB NOT NULL, -- Full BirthdayForecastResponse object
  
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ, -- When user first viewed the forecast
  shared BOOLEAN DEFAULT FALSE, -- Whether user shared it
  
  -- Email tracking
  email_sent_at TIMESTAMPTZ, -- When we sent birthday reminder email
  email_opened BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One forecast per user per year
  UNIQUE(user_id, chart_id, forecast_year)
);

-- Indexes for fast lookups
CREATE INDEX idx_birthday_forecasts_user ON birthday_forecasts(user_id);
CREATE INDEX idx_birthday_forecasts_birth_date ON birthday_forecasts(birth_date);
CREATE INDEX idx_birthday_forecasts_year ON birthday_forecasts(forecast_year);
CREATE INDEX idx_birthday_forecasts_email_sent ON birthday_forecasts(email_sent_at) WHERE email_sent_at IS NULL;

-- Enable RLS
ALTER TABLE birthday_forecasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own forecasts"
  ON birthday_forecasts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own forecasts"
  ON birthday_forecasts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forecasts"
  ON birthday_forecasts FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. Add primary_chart_id to profiles (for default chart selection)
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS primary_chart_id TEXT;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_primary_chart ON profiles(primary_chart_id);

-- 3. Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_birthday_forecasts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER birthday_forecasts_updated_at
  BEFORE UPDATE ON birthday_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION update_birthday_forecasts_updated_at();

-- 4. SQL function to find upcoming birthdays
-- Used for email cron job (find users whose birthday is in N days)
CREATE OR REPLACE FUNCTION get_upcoming_birthdays(
  target_month INT,
  target_day INT
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  birth_date TEXT,
  chart_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    au.email,
    p.birth_date::TEXT,
    p.primary_chart_id as chart_id
  FROM profiles p
  INNER JOIN auth.users au ON p.id = au.id
  WHERE 
    EXTRACT(MONTH FROM p.birth_date::DATE) = target_month
    AND EXTRACT(DAY FROM p.birth_date::DATE) = target_day
    AND p.primary_chart_id IS NOT NULL -- Only users with saved chart
    AND au.email IS NOT NULL; -- Only users with email
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Comments for documentation
COMMENT ON TABLE birthday_forecasts IS 'Cached AI-generated birthday forecasts for users';
COMMENT ON COLUMN birthday_forecasts.forecast_data IS 'Full JSON response from /api/birthday-forecast endpoint';
COMMENT ON COLUMN birthday_forecasts.forecast_year IS 'Calendar year the forecast is for (e.g., 2026)';
COMMENT ON COLUMN birthday_forecasts.email_sent_at IS 'When we sent the "Birthday coming up" email';
COMMENT ON COLUMN profiles.primary_chart_id IS 'User preferred chart for birthday forecasts and emails';
COMMENT ON FUNCTION get_upcoming_birthdays IS 'Find users with birthday on specific month/day for email triggers';
