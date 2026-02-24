import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ charts: [] });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ charts: [] });
    }

    const { data: charts } = await supabase
      .from('charts')
      .select('id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ charts: charts ?? [] });
  } catch {
    return NextResponse.json({ charts: [] });
  }
}
