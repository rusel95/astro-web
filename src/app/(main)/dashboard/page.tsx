import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartRow = any;

async function getSupabaseData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: charts } = await supabase
    .from('charts')
    .select('id, name, birth_date, city, country_code, gender, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { user, charts: charts ?? [] };
}

export default async function DashboardPage() {
  const result = await getSupabaseData();

  if (!result) {
    redirect('/auth/login');
  }

  return <DashboardClient user={result.user} charts={result.charts as ChartRow[]} />;
}
