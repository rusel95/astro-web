import { NextResponse } from 'next/server';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeRequest {
  email: string;
  name?: string;
  source?: string;
}

export async function POST(request: Request) {
  try {
    const body: SubscribeRequest = await request.json();

    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Невірний формат email' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { error } = await supabase
          .from('email_subscriptions')
          .upsert(
            {
              email: body.email.toLowerCase().trim(),
              name: body.name?.trim() || null,
              source: body.source || 'landing',
            },
            { onConflict: 'email' }
          );

        if (error) {
          console.error('Email subscription error:', error);
          return NextResponse.json(
            { error: 'Не вдалося зберегти підписку' },
            { status: 500 }
          );
        }
      } catch (err) {
        console.error('Supabase error:', err);
        return NextResponse.json(
          { error: 'Не вдалося зберегти підписку' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json(
      { error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
