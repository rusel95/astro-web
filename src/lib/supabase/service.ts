// Server-side Supabase client with service role key (API routes only)
// Requires env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY  (or falls back to anon key for RPC calls)
import { createClient } from '@supabase/supabase-js';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && url !== 'placeholder' && !!key && key !== 'placeholder';
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Service-only RLS policies will block writes.');
  }
  return createClient(url, key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
