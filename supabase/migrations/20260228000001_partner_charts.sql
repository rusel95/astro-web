-- Partner charts table
-- Stores second person's birth data for relationship features
CREATE TABLE IF NOT EXISTS partner_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  city TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female') OR gender IS NULL),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for user's partners lookup
CREATE INDEX idx_partner_charts_user
  ON partner_charts (user_id, created_at DESC);

-- RLS policies
ALTER TABLE partner_charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own partner charts"
  ON partner_charts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own partner charts"
  ON partner_charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own partner charts"
  ON partner_charts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own partner charts"
  ON partner_charts FOR DELETE
  USING (auth.uid() = user_id);

-- Rollback script (run manually if needed):
-- DROP TABLE IF EXISTS partner_charts;
