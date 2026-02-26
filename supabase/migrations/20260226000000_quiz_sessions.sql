-- Migration: Quiz Sessions
-- Date: 2026-02-26
-- Purpose: Store quiz session data for onboarding funnel

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Birth data (collected during quiz steps)
  birth_date DATE,
  birth_time TIME,
  birth_time_unknown BOOLEAN DEFAULT false,
  birth_city TEXT NOT NULL DEFAULT '',
  birth_lat DECIMAL(10,6),
  birth_lng DECIMAL(10,6),
  country_code TEXT NOT NULL DEFAULT '',

  -- Personal data
  name TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  zodiac_sign TEXT NOT NULL DEFAULT '',

  -- Generated mini-horoscope result
  mini_horoscope_data JSONB,

  -- Status
  completed BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_session_id ON public.quiz_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_email ON public.quiz_sessions(email);

-- Enable RLS
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: quiz is anonymous, so allow public access
CREATE POLICY "Anyone can create quiz sessions"
  ON public.quiz_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read quiz sessions"
  ON public.quiz_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update quiz sessions"
  ON public.quiz_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_quiz_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_sessions_updated_at
  BEFORE UPDATE ON public.quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_sessions_updated_at();

-- Comments
COMMENT ON TABLE public.quiz_sessions IS 'Quiz onboarding session data before chart creation';
COMMENT ON COLUMN public.quiz_sessions.session_id IS 'Client-generated session ID (format: quiz_TIMESTAMP_RANDOM)';
COMMENT ON COLUMN public.quiz_sessions.mini_horoscope_data IS 'AI-generated mini-horoscope result after quiz completion';
