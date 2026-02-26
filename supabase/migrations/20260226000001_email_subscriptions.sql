-- Migration: Email Subscriptions
-- Date: 2026-02-26
-- Purpose: Store email newsletter subscriptions from landing page

CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'landing',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);

-- Enable RLS
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS: service role inserts (via API), no direct client access needed
CREATE POLICY "Service role can manage email subscriptions"
  ON public.email_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE public.email_subscriptions IS 'Newsletter email subscriptions from landing page and other sources';
