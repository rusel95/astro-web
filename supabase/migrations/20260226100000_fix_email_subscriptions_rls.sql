-- Fix: restrict email_subscriptions RLS to service_role only
-- Previous policy was too permissive (USING true / WITH CHECK true)

DROP POLICY IF EXISTS "Service role can manage email subscriptions" ON public.email_subscriptions;

CREATE POLICY "Service role can manage email subscriptions"
  ON public.email_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
