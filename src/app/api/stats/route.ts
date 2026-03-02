import { NextResponse } from 'next/server';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  let total_charts = 0;
  let total_users = 0;

  try {
    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();

      const { count: chartsCount } = await supabase
        .from('charts')
        .select('*', { count: 'exact', head: true });

      if (chartsCount !== null) {
        total_charts = chartsCount;
      }

      // Try to get user count via admin API (requires service role)
      try {
        const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1 });
        const anyData = usersData as any;
        if (anyData?.total) {
          total_users = anyData.total;
        }
      } catch {
        // User count not available — skip
      }
    }
  } catch {
    // Fall through with zeros — UI shows defaults
  }

  return NextResponse.json(
    { total_charts, total_users },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300' } }
  );
}
