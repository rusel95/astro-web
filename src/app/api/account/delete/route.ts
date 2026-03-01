import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service';

export async function DELETE() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    // Get current user from session
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Не авторизований' }, { status: 401 });
    }

    const userId = user.id;
    const serviceClient = createServiceClient();

    // Delete all user data in order (respecting FK constraints)
    await serviceClient.from('feature_results').delete().eq('user_id', userId);
    await serviceClient.from('partner_charts').delete().eq('user_id', userId);
    await serviceClient.from('charts').delete().eq('user_id', userId);
    await serviceClient.from('profiles').delete().eq('id', userId);

    // Delete auth user (requires service role)
    const { error: deleteError } = await serviceClient.auth.admin.deleteUser(userId);
    if (deleteError) {
      Sentry.captureException(deleteError, { tags: { route: 'account/delete' }, level: 'error' });
      return NextResponse.json({ error: 'Помилка видалення акаунта' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'account/delete', level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка видалення акаунта' }, { status: 500 });
  }
}
