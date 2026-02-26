import { NextRequest, NextResponse } from 'next/server';
import { getAstrologyClient } from '@/lib/astrology-client';

const VALID_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

const SIGN_UK: Record<string, string> = {
  Aries: 'Овен', Taurus: 'Телець', Gemini: 'Близнюки', Cancer: 'Рак',
  Leo: 'Лев', Virgo: 'Діва', Libra: 'Терези', Scorpio: 'Скорпіон',
  Sagittarius: 'Стрілець', Capricorn: 'Козоріг', Aquarius: 'Водолій', Pisces: 'Риби',
};

// In-memory cache: key = "sign-date"
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');
  const dateParam = searchParams.get('date');

  if (!sign || !VALID_SIGNS.includes(sign as typeof VALID_SIGNS[number])) {
    return NextResponse.json(
      { error: 'Invalid or missing sign parameter. Must be one of: ' + VALID_SIGNS.join(', ') },
      { status: 400 }
    );
  }

  const today = new Date();
  const date = dateParam || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cacheKey = `${sign}-${date}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    });
  }

  try {
    const client = getAstrologyClient();
    const result = await client.horoscope.getSignDailyHoroscope({
      sign: sign as typeof VALID_SIGNS[number],
      date,
      language: 'uk',
    });

    // Map life_areas to the contract format (love/career/health categories)
    const loveArea = result.life_areas?.find(a => a.area?.toLowerCase().includes('love') || a.area?.toLowerCase().includes('relationship'));
    const careerArea = result.life_areas?.find(a => a.area?.toLowerCase().includes('career') || a.area?.toLowerCase().includes('work') || a.area?.toLowerCase().includes('finance'));
    const healthArea = result.life_areas?.find(a => a.area?.toLowerCase().includes('health') || a.area?.toLowerCase().includes('wellness'));

    const response = {
      sign,
      sign_uk: SIGN_UK[sign] || sign,
      date,
      horoscope: {
        general_uk: result.overall_theme || 'Сьогодні зірки сприяють вашому розвитку.',
        love_uk: loveArea?.prediction || 'Гармонія у стосунках.',
        career_uk: careerArea?.prediction || 'Вдалий день для ділових рішень.',
        health_uk: healthArea?.prediction || 'Зверніть увагу на своє самопочуття.',
      },
      overall_rating: result.overall_rating || 7,
      life_areas: result.life_areas || [],
      lucky_number: result.lucky_elements?.numbers?.[0] || Math.floor(Math.random() * 9) + 1,
      mood_uk: result.tips?.[0] || 'Натхнення',
    };

    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    });
  } catch (error) {
    console.error('Daily horoscope API error:', error);

    // Return fallback data so UI doesn't break
    const fallback = {
      sign,
      sign_uk: SIGN_UK[sign] || sign,
      date,
      horoscope: {
        general_uk: 'Сьогодні зірки підтримують ваші починання. Довіряйте інтуїції.',
        love_uk: 'Гармонійний день для стосунків. Приділіть увагу близьким.',
        career_uk: 'Вдалий час для нових проєктів та ідей.',
        health_uk: 'Приділіть увагу відпочинку та відновленню енергії.',
      },
      overall_rating: 7,
      life_areas: [],
      lucky_number: Math.floor(Math.random() * 9) + 1,
      mood_uk: 'Спокій',
    };

    return NextResponse.json(fallback, {
      headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' },
    });
  }
}
