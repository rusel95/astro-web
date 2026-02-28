-- Fix: restrict quiz_sessions RLS to service_role only
-- All quiz operations go through API routes using the service client,
-- so there's no need for public (anon) access to this PII-containing table.

DROP POLICY IF EXISTS "Anyone can create quiz sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Anyone can read quiz sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Anyone can update quiz sessions" ON public.quiz_sessions;

CREATE POLICY "Service role only"
  ON public.quiz_sessions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
