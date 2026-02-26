import { NextResponse } from 'next/server';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/service';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import type { ZodiacSign } from '@/types/astrology';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface QuizSessionRequest {
  session_id: string;
  birth_date: string;
  birth_time: string;
  birth_time_unknown: boolean;
  birth_city: string;
  birth_lat: number;
  birth_lng: number;
  country_code: string;
  name: string;
  gender: string;
  email: string;
  zodiac_sign: string;
}

export async function POST(request: Request) {
  try {
    const body: QuizSessionRequest = await request.json();

    // Validation
    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (!body.birth_date || !body.name || !body.gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!body.birth_city || body.birth_lat == null || body.birth_lng == null) {
      return NextResponse.json({ error: 'Missing birth location' }, { status: 400 });
    }

    const sessionId = body.session_id || `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const zodiacSignUk = ZODIAC_NAMES_UK[body.zodiac_sign as ZodiacSign] || body.zodiac_sign;

    // Save to Supabase if configured
    let dbId: string | null = null;
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from('quiz_sessions')
          .insert({
            session_id: sessionId,
            birth_date: body.birth_date,
            birth_time: body.birth_time,
            birth_time_unknown: body.birth_time_unknown,
            birth_city: body.birth_city,
            birth_lat: body.birth_lat,
            birth_lng: body.birth_lng,
            country_code: body.country_code,
            name: body.name,
            gender: body.gender,
            email: body.email,
            zodiac_sign: body.zodiac_sign,
            completed: true,
          })
          .select('id')
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
        } else {
          dbId = data?.id;
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }

    return NextResponse.json({
      id: dbId || sessionId,
      session_id: sessionId,
      zodiac_sign: body.zodiac_sign,
      zodiac_sign_uk: zodiacSignUk,
      completed: true,
    });
  } catch (err) {
    console.error('Quiz session error:', err);
    return NextResponse.json(
      { error: 'Не вдалося зберегти сесію' },
      { status: 500 }
    );
  }
}
