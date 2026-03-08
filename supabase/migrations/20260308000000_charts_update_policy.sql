-- Allow authenticated users to update their own charts
CREATE POLICY "Users can update own charts"
  ON public.charts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
