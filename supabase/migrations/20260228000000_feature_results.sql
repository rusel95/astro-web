-- Feature results cache table
-- Caches API results for authenticated users to avoid repeated API calls
CREATE TABLE IF NOT EXISTS feature_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chart_id UUID NOT NULL,
  feature_type TEXT NOT NULL,
  feature_params JSONB DEFAULT '{}'::jsonb,
  feature_params_hash TEXT NOT NULL DEFAULT '',
  result_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Composite index for quick lookups
CREATE INDEX idx_feature_results_lookup
  ON feature_results (user_id, feature_type, chart_id, feature_params_hash);

-- Index for cache expiry cleanup
CREATE INDEX idx_feature_results_expires
  ON feature_results (expires_at);

-- RLS policies
ALTER TABLE feature_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feature results"
  ON feature_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feature results"
  ON feature_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feature results"
  ON feature_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feature results"
  ON feature_results FOR DELETE
  USING (auth.uid() = user_id);

-- Rollback script (run manually if needed):
-- DROP TABLE IF EXISTS feature_results;
