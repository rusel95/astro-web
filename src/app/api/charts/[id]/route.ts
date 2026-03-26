import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
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

// Update chart birth data fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Only allow updating specific fields
    const ALLOWED_FIELDS = ['name', 'birth_date', 'birth_time', 'city', 'country_code', 'latitude', 'longitude', 'gender'];
    const updates: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Only invalidate chart_data if a birth field actually changed value
    const BIRTH_FIELDS = ['birth_date', 'birth_time', 'city', 'latitude', 'longitude', 'country_code'];
    const hasBirthFieldUpdate = BIRTH_FIELDS.some(f => f in updates);
    if (hasBirthFieldUpdate) {
      const { data: current } = await supabase
        .from('charts')
        .select('birth_date, birth_time, city, latitude, longitude, country_code')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (current) {
        const actuallyChanged = BIRTH_FIELDS.some(f =>
          f in updates && String(updates[f] ?? '') !== String((current as Record<string, unknown>)[f] ?? '')
        );
        if (actuallyChanged) {
          updates.chart_data = null;
        }
      }
    }

    const { data: chart, error } = await supabase
      .from('charts')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender')
      .single();

    if (error) {
      Sentry.captureException(error, { tags: { route: 'charts/[id]', method: 'PATCH' } });
      return NextResponse.json({ error: 'Не вдалося оновити дані' }, { status: 500 });
    }

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    return NextResponse.json({ chart });
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'charts/[id]', method: 'PATCH' } });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
