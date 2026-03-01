import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { sanitizeInput } from '@/lib/input-sanitizer';

async function getAuthUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { user, supabase } : null;
}

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ partners: [] });

    const { data: partners } = await auth.supabase
      .from('partner_charts')
      .select('id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender, created_at')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ partners: partners ?? [] });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'partner-charts', method: 'GET' } });
    return NextResponse.json({ partners: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });

    const body = await req.json();
    const name = sanitizeInput(body.name || '');
    if (!name) return NextResponse.json({ error: "Ім'я обов'язкове" }, { status: 400 });

    const { data, error } = await auth.supabase.from('partner_charts').insert({
      user_id: auth.user.id,
      name,
      birth_date: body.birth_date,
      birth_time: body.birth_time || '12:00',
      city: sanitizeInput(body.city || ''),
      country_code: body.country_code || '',
      latitude: body.latitude || 0,
      longitude: body.longitude || 0,
      gender: body.gender || 'unknown',
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ partner: data }, { status: 201 });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'partner-charts', method: 'POST' } });
    return NextResponse.json({ error: error.message || 'Помилка створення' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID обов\'язковий' }, { status: 400 });

    const { error } = await auth.supabase
      .from('partner_charts')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'partner-charts', method: 'DELETE' } });
    return NextResponse.json({ error: error.message || 'Помилка видалення' }, { status: 500 });
  }
}
