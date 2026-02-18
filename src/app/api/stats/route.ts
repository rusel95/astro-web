import { NextResponse } from 'next/server';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service';

const BASE_COUNT = 1000; // Starting offset (shows before real data is available)

export async function GET() {
  let realCount = 0;

  try {
    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data } = await supabase
        .from('chart_counter')
        .select('count')
        .eq('id', 1)
        .single();

      if (data?.count) {
        realCount = Number(data.count);
      }
    }
  } catch {
    realCount = 0;
  }

  return NextResponse.json({
    total: BASE_COUNT + realCount,
    base: BASE_COUNT,
    real: realCount,
  });
}
