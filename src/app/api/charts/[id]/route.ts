import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: chart, error } = await supabase
      .from('charts')
      .select('id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender, chart_data, created_at')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error || !chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    return NextResponse.json({ chart });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
