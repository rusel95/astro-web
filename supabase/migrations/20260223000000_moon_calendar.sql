-- Місячний календар з void-of-course періодами та фазами
-- Migration: 20260223_moon_calendar.sql

-- Таблиця місячних даних (pre-calculated для швидкості)
CREATE TABLE IF NOT EXISTS moon_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,

  -- Moon position
  moon_sign TEXT NOT NULL,
  moon_longitude DECIMAL(8,4) NOT NULL,
  moon_house INTEGER, -- для default chart (Lviv)
  
  -- Moon phase
  moon_phase TEXT NOT NULL CHECK (moon_phase IN (
    'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
    'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent'
  )),
  moon_phase_angle DECIMAL(6,2) NOT NULL, -- 0-360
  illumination_percent DECIMAL(5,2) NOT NULL, -- 0-100
  
  -- Void of Course period (if any)
  void_of_course JSONB, -- {start, end, lastAspect, moonSign, nextSign, durationMinutes}
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Індекси
CREATE INDEX idx_moon_calendar_date ON moon_calendar(date);
CREATE INDEX idx_moon_calendar_void ON moon_calendar USING GIN (void_of_course);

-- Персональні місячні транзити (cached per user)
CREATE TABLE IF NOT EXISTS moon_transits_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Transit data
  moon_house INTEGER NOT NULL CHECK (moon_house BETWEEN 1 AND 12),
  moon_sign TEXT NOT NULL,
  
  -- Interpretation (generated or template-based)
  interpretation TEXT,
  recommendations JSONB, -- {good: string[], avoid: string[]}
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- Індекси
CREATE INDEX idx_moon_transits_user_date ON moon_transits_cache(user_id, date);
CREATE INDEX idx_moon_transits_date ON moon_transits_cache(date);

-- RLS (Row Level Security)
ALTER TABLE moon_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_transits_cache ENABLE ROW LEVEL SECURITY;

-- Політики доступу: moon_calendar доступний всім для читання
CREATE POLICY "Moon calendar readable by everyone"
  ON moon_calendar FOR SELECT
  USING (true);

-- Політики доступу: moon_transits_cache тільки власний
CREATE POLICY "Moon transits readable by owner"
  ON moon_transits_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Moon transits insertable by owner"
  ON moon_transits_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Moon transits updatable by owner"
  ON moon_transits_cache FOR UPDATE
  USING (auth.uid() = user_id);

-- Функція для оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригери для автоматичного оновлення updated_at
CREATE TRIGGER update_moon_calendar_updated_at BEFORE UPDATE
  ON moon_calendar FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moon_transits_updated_at BEFORE UPDATE
  ON moon_transits_cache FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE moon_calendar IS 'Pre-calculated Moon positions, phases, and void-of-course periods for fast lookup';
COMMENT ON TABLE moon_transits_cache IS 'User-specific Moon transits with house positions and interpretations';
COMMENT ON COLUMN moon_calendar.void_of_course IS 'JSONB with void period details: {start, end, lastAspect, moonSign, nextSign, durationMinutes}';
COMMENT ON COLUMN moon_transits_cache.recommendations IS 'JSONB with recommendations: {good: string[], avoid: string[]}';
