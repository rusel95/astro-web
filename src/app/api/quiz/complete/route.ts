import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';
import { mapAPIResponse } from '@/lib/api-mapper';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/service';
import { ZODIAC_NAMES_UK, PLANET_NAMES_UK, ASPECT_NAMES_UK } from '@/lib/constants';
import type { ZodiacSign, PlanetName, Aspect } from '@/types/astrology';

interface QuizCompleteRequest {
  session_id: string;
}

interface QuizSessionData {
  session_id: string;
  birth_date: string;
  birth_time: string;
  birth_time_unknown: boolean;
  birth_city: string;
  birth_lat: number;
  birth_lng: number;
  country_code: string;
  name: string;
  zodiac_sign: string;
}

function formatDegrees(longitude: number): string {
  const totalDeg = longitude % 30;
  const deg = Math.floor(totalDeg);
  const minFloat = (totalDeg - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.floor((minFloat - min) * 60);
  return `${deg}\u00B0 ${min}' ${sec}"`;
}

async function generateInterpretations(
  aspects: Aspect[],
  zodiacSign: string,
  userName: string,
): Promise<Array<{ planet1: string; planet2: string; aspect_type: string; degrees: string; interpretation_uk: string }>> {
  // Take top 3 most significant aspects (lowest orb)
  const topAspects = aspects.slice(0, 3);

  // Try OpenAI for interpretations
  if (process.env.OPENAI_API_KEY) {
    try {
      const aspectDescriptions = topAspects.map((a) => {
        const p1Uk = PLANET_NAMES_UK[a.planet1 as PlanetName] || a.planet1;
        const p2Uk = PLANET_NAMES_UK[a.planet2 as PlanetName] || a.planet2;
        const typeUk = ASPECT_NAMES_UK[a.type] || a.type;
        return `${p1Uk} ${typeUk} ${p2Uk} (орб: ${a.orb.toFixed(1)}\u00B0)`;
      });

      const prompt = `Ти — професійний астролог. Напиши коротку (2-3 речення) інтерпретацію кожного з цих аспектів натальної карти для ${userName}, знак зодіаку — ${ZODIAC_NAMES_UK[zodiacSign as ZodiacSign] || zodiacSign}. Відповідай українською мовою. Будь позитивним, але чесним. Формат: один абзац на аспект, без нумерації.

Аспекти:
${aspectDescriptions.join('\n')}`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || '';
        const paragraphs = text.split('\n\n').filter((p: string) => p.trim());

        return topAspects.map((a, i) => ({
          planet1: a.planet1,
          planet2: a.planet2,
          aspect_type: a.type,
          degrees: formatDegrees(a.orb),
          interpretation_uk: paragraphs[i]?.trim() || getDefaultInterpretation(a),
        }));
      }
    } catch (err) {
      console.error('OpenAI error:', err);
    }
  }

  // Fallback: return aspects without AI interpretation
  return topAspects.map((a) => ({
    planet1: a.planet1,
    planet2: a.planet2,
    aspect_type: a.type,
    degrees: formatDegrees(a.orb),
    interpretation_uk: getDefaultInterpretation(a),
  }));
}

function getDefaultInterpretation(aspect: Aspect): string {
  const p1 = PLANET_NAMES_UK[aspect.planet1 as PlanetName] || aspect.planet1;
  const p2 = PLANET_NAMES_UK[aspect.planet2 as PlanetName] || aspect.planet2;
  const type = ASPECT_NAMES_UK[aspect.type] || aspect.type;
  return `${type} між ${p1} та ${p2} створює унікальну енергетичну взаємодію у вашій натальній карті, яка впливає на ваше сприйняття світу та внутрішній розвиток.`;
}

function zodiacFromDegree(deg: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  return signs[Math.floor((deg % 360) / 30)];
}

export async function POST(request: Request) {
  try {
    const body: QuizCompleteRequest = await request.json();

    if (!body.session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Load session data from Supabase or fallback
    let sessionData: QuizSessionData | null = null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('session_id', body.session_id)
          .single();

        if (error || !data) {
          return NextResponse.json({ error: 'Quiz session not found' }, { status: 404 });
        }
        sessionData = data as QuizSessionData;
      } catch (err) {
        console.error('Supabase fetch error:', err);
        return NextResponse.json({ error: 'Quiz session not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Calculate natal chart using Astrology SDK
    const client = getAstrologyClient();
    const [year, month, day] = sessionData.birth_date.split('-').map(Number);
    const birthTime = sessionData.birth_time ?? '12:00';
    const [hour, minute] = birthTime.split(':').map(Number);

    const subject = {
      name: sessionData.name,
      birth_data: {
        year,
        month,
        day,
        hour,
        minute,
        second: 0,
        city: sessionData.birth_city,
        country_code: sessionData.country_code,
      },
    };

    const options = toSdkChartOptions();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartResponse = await client.charts.getNatalChart({ subject, options } as any);

    const chartInput = {
      birthDate: sessionData.birth_date,
      birthTime: sessionData.birth_time,
      city: sessionData.birth_city,
      countryCode: sessionData.country_code,
      latitude: sessionData.birth_lat,
      longitude: sessionData.birth_lng,
      name: sessionData.name,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const natalChart = mapAPIResponse(chartResponse as any, chartInput);

    // Generate AI interpretations for top aspects
    const keyAspects = await generateInterpretations(
      natalChart.aspects,
      sessionData.zodiac_sign,
      sessionData.name,
    );

    const ascendantSign = zodiacFromDegree(natalChart.ascendant);
    const zodiacSignUk = ZODIAC_NAMES_UK[sessionData.zodiac_sign as ZodiacSign] || sessionData.zodiac_sign;
    const ascendantSignUk = ZODIAC_NAMES_UK[ascendantSign] || ascendantSign;

    const miniHoroscope = {
      natal_chart: {
        ascendant: natalChart.ascendant,
        planets: natalChart.planets,
        houses: natalChart.houses,
        aspects: natalChart.aspects,
      },
      key_aspects: keyAspects,
      zodiac_sign_uk: zodiacSignUk,
      ascendant_sign_uk: ascendantSignUk,
    };

    // Save mini horoscope data to session
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase
          .from('quiz_sessions')
          .update({ mini_horoscope_data: miniHoroscope })
          .eq('session_id', body.session_id);
      } catch (err) {
        console.error('Failed to save mini horoscope:', err);
      }
    }

    return NextResponse.json({
      session_id: body.session_id,
      mini_horoscope: miniHoroscope,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'quiz/complete' } });
    console.error('Quiz complete error:', err);
    return NextResponse.json(
      { error: 'Не вдалося створити міні-гороскоп. Спробуйте пізніше.' },
      { status: 500 }
    );
  }
}
