import { NextRequest, NextResponse } from 'next/server';
import { NatalChart } from '@/types/astrology';
import { PLANET_NAMES_UK, ZODIAC_NAMES_UK, PLANET_SYMBOLS, getPlanetDignityStatus, DIGNITY_NAMES_UK } from '@/lib/constants';

function formatChartContext(chart: NatalChart): string {
  const lines: string[] = [];
  lines.push(`Планети (знак + дім + планетарна гідність):`);
  for (const p of chart.planets) {
    const retro = p.isRetrograde ? ' ℞ (ретроградна)' : '';
    const dignityKey = getPlanetDignityStatus(p.name, p.sign);
    const dignityLabel = dignityKey ? ` — ${DIGNITY_NAMES_UK[dignityKey]}` : '';
    lines.push(
      `- ${PLANET_SYMBOLS[p.name]} ${PLANET_NAMES_UK[p.name]}: ${ZODIAC_NAMES_UK[p.sign]} (${p.longitude.toFixed(1)}°), ${p.house} дім${retro}${dignityLabel}`
    );
  }
  lines.push(`\nДоми:`);
  for (const h of chart.houses) {
    lines.push(`- Дім ${h.number}: куспід ${h.cusp.toFixed(1)}° у ${ZODIAC_NAMES_UK[h.sign]}`);
  }
  lines.push(`\nАспекти:`);
  for (const a of chart.aspects) {
    lines.push(`- ${PLANET_NAMES_UK[a.planet1]} ${a.type} ${PLANET_NAMES_UK[a.planet2]} (орб ${a.orb.toFixed(1)}°)`);
  }
  lines.push(`\nАсцендент: ${chart.ascendant.toFixed(1)}° (${ZODIAC_NAMES_UK[zodiacSignFromDegree(chart.ascendant)]})`);
  lines.push(`MC (Середина неба): ${chart.midheaven.toFixed(1)}° (${ZODIAC_NAMES_UK[zodiacSignFromDegree(chart.midheaven)]})`);
  return lines.join('\n');
}

const ZODIAC_SIGNS_LIST = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
] as const;

function zodiacSignFromDegree(deg: number): typeof ZODIAC_SIGNS_LIST[number] {
  return ZODIAC_SIGNS_LIST[Math.floor((deg % 360) / 30)];
}

export interface BirthdayForecastResponse {
  greeting: string;
  year_overview: string;
  themes: {
    title: string;
    icon: string;
    description: string;
  }[];
  monthly_highlights: {
    month: string;
    highlight: string;
  }[];
  advice: string[];
  lucky_periods: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { chart, userName, age }: { chart: NatalChart; userName: string; age: number } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'placeholder') {
      return NextResponse.json(
        { error: 'AI сервіс не налаштований. Зверніться до адміністратора.' },
        { status: 503 }
      );
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const nextAge = age + 1;

    const systemPrompt = `You are a professional astrologer specializing in Solar Return (Birthday) forecasts. 
You create warm, encouraging, and insightful yearly predictions based on natal charts.

IMPORTANT RULES:
- Be specific and personal, avoid generic horoscope clichés
- Focus on growth opportunities and positive potential
- Acknowledge challenges constructively with practical advice
- Write in warm, supportive Ukrainian language
- Base all insights on actual chart positions

Always respond in Ukrainian (uk).`;

    const userPrompt = `Створи персональний прогноз на рік для ${userName}, якому/якій виповнюється ${nextAge} років.

Натальна карта:
${formatChartContext(chart)}

ЗАВДАННЯ: Створи детальний Birthday Forecast (річний прогноз) на основі натальної карти.

Поверни ТІЛЬКИ валідний JSON (без markdown):
{
  "greeting": "Персональне привітання з днем народження для ${userName} (2-3 речення, тепле та надихаюче)",
  "year_overview": "Загальний огляд року — що принесе цей рік, головні теми та енергії (4-5 речень)",
  "themes": [
    {
      "title": "Назва теми (напр. 'Кар'єра та амбіції')",
      "icon": "emoji для теми",
      "description": "Опис цієї сфери на рік (3-4 речення)"
    }
  ],
  "monthly_highlights": [
    { "month": "Березень", "highlight": "Короткий прогноз на місяць (1 речення)" },
    { "month": "Квітень", "highlight": "..." }
  ],
  "advice": ["5 конкретних порад на цей рік, прив'язаних до позицій карти"],
  "lucky_periods": ["3-4 найсприятливіші періоди року з датами та описом"]
}

ВИМОГИ:
- themes: мінімум 5 тем (любов, кар'єра, здоров'я, фінанси, духовність)
- monthly_highlights: всі 12 місяців починаючи з поточного
- Усі прогнози мають базуватися на конкретних позиціях планет у карті
- Згадуй конкретні планети та аспекти, коли це доречно`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenAI error:', res.status, errText);
      throw new Error(`OpenAI error: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: unknown) {
    console.error('Birthday forecast error:', error);
    const message = error instanceof Error ? error.message : 'Birthday forecast generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
