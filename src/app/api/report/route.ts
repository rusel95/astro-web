import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NatalChart, ReportArea } from '@/types/astrology';
import { PLANET_NAMES_UK, ZODIAC_NAMES_UK, PLANET_SYMBOLS, getPlanetDignityStatus, DIGNITY_NAMES_UK } from '@/lib/constants';

const vectorStoreId = () => process.env.OPENAI_VECTOR_STORE_ID || '';

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

const AREA_NAMES: Record<ReportArea, string> = {
  general: 'Особистість',
  career: "Кар'єра",
  relationships: 'Стосунки',
  health: "Здоров'я",
  finances: 'Фінанси',
  spirituality: 'Духовність',
};

const AREA_FOCUS: Record<ReportArea, string> = {
  general: 'загальний характер особистості, сильні та слабкі сторони, життєвий шлях',
  career: "кар'єрні перспективи, професійні таланти, стиль роботи, фінансовий потенціал через працю",
  relationships: "романтичні стосунки, партнерство, стиль кохання, сумісність, сімейне життя",
  health: "фізичне та ментальне здоров'я, вразливі зони, рекомендації щодо способу життя",
  finances: "фінансові таланти, стиль заробітку, інвестиційні схильності, ризики та можливості",
  spirituality: "духовний шлях, карма, минулі життя (Вузли Місяця), сакральна місія, зв'язок з вищим «Я», медитативні практики та духовний розвиток",
};

export async function POST(req: NextRequest) {
  try {
    const { chart, area }: { chart: NatalChart; area: ReportArea } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'placeholder') {
      return NextResponse.json(
        { error: 'AI сервіс не налаштований. Зверніться до адміністратора.' },
        { status: 503 }
      );
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const vsId = vectorStoreId();

    const systemPrompt = `You are a professional astrologer with 20+ years of experience in natal chart interpretation. 
Always respond with warm, practical, motivating interpretations tailored to the user's natal chart. Avoid daily horoscope clichés.

CRITICAL REQUIREMENT: ALL facts, interpretations, and statements MUST come from established astrological literature. NO speculation or made-up information.
- PRIORITIZE the knowledge snippets provided from the vector database (when available)
- For aspects and house interpretations, be HIGHLY ACCURATE and cite specific sources
- If vector database knowledge is unavailable, cite classical astrological texts or modern psychological astrology authorities

Always answer in Ukrainian (uk).`;

    const userPrompt = `Сфера аналізу: ${AREA_NAMES[area]}
Фокус: ${AREA_FOCUS[area]}

Натальна карта:
${formatChartContext(chart)}

ВИМОГИ ДО АНАЛІЗУ:
1. Для кожної планети ОБОВ'ЯЗКОВО розкрий: а) значення знаку зодіаку для цієї планети, б) значення дому для цієї планети, в) якщо вказано планетарну гідність (Володарювання, Екзальтація, Вигнання, Падіння) — це КЛЮЧОВА інформація, обов'язково поясни її вплив. Наприклад: «Сонце у Леві — це Володарювання: планета максимально сильна, дає особливий авторитет і харизму».
2. Планета у Вигнанні або Падінні — це виклик, а не вирок. Опиши конструктивно: що це за випробування і як з ним працювати.
3. Використовуй конкретні астрологічні факти, не загальні фрази.

Поверни ТІЛЬКИ валідний JSON (без markdown):
{
  "summary": "2-3 речення яскравого підсумку для цієї сфери — що головне у цій людини щодо даної сфери",
  "key_influences": ["10 пунктів — по одному для кожної з 10 планет (Сонце, Місяць, Меркурій, Венера, Марс, Юпітер, Сатурн, Уран, Нептун, Плутон). Для кожної: планета-символ + знак зодіаку + дім + якщо є гідність — позначити. Приклад: '☉ Сонце в Леві (👑 Володарювання), 1 дім — ...'. Мінімум 2 речення на кожну планету."],
  "detailed_analysis": "Розгорнутий аналіз мінімум 12 абзаців, розділених подвійним переносом рядка (\\n\\n). Кожен абзац починається з заголовку у форматі '## Заголовок' на окремому рядку. Структура:\n## Сонце: знак і дім\n[2-3 речення про Сонце у знаку зодіаку + 2-3 речення про Сонце в домі + якщо є гідність — її роль]\n\n## Місяць: знак і дім\n[аналогічно]\n\n## Меркурій, Венера, Марс\n[аналогічно — можна об'єднати в один абзац для кожної]\n\n## Юпітер і Сатурн: розширення і обмеження\n[2 планети разом]\n\n## Вищі планети: Уран, Нептун, Плутон\n[3 планети разом]\n\n## Ключові аспекти\n[найважливіші 3-5 аспектів та їх вплив на сферу]\n\n## Аскендент і MC\n[їх роль у цій сфері]\n\n## Планетарні гідності: загальна картина\n[підсумок всіх знайдених гідностей у карті та що це означає]\n\n## Висновок\n[інтеграція, загальний потенціал та поради]",
  "recommendations": ["ПЕРШИЙ пункт ОБОВ'ЯЗКОВО: 'Для глибшого розуміння своєї натальної карти та персональних рекомендацій радимо звернутися до професійного астролога сайту Зоря — консультація допоможе розкрити всі нюанси вашого гороскопу.' Далі ще 4 конкретні практичні поради, прив'язані до конкретних позицій карти."]
}`;

    // Use file_search with vector store if configured
    const tools: any[] = [];
    const tool_resources: any = {};

    if (vsId) {
      tools.push({ type: 'file_search' });
      tool_resources.file_search = { vector_store_ids: [vsId] };
    }

    let content: string;

    if (vsId) {
      // Use Responses API with file_search tool for vector store access
      const res = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          instructions: systemPrompt,
          input: userPrompt,
          tools: [{ type: 'file_search', vector_store_ids: [vsId] }],
          temperature: 0.7,
          text: { format: { type: 'json_object' } },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('OpenAI Responses API error:', res.status, errText);
        // Fallback to chat completions without vector store
        content = await fallbackChatCompletion(model, systemPrompt, userPrompt);
      } else {
        const data = await res.json();
        // Extract text from response output
        const outputText = data.output?.find((o: any) => o.type === 'message')
          ?.content?.find((c: any) => c.type === 'output_text')?.text;
        if (outputText) {
          content = outputText;
        } else {
          content = await fallbackChatCompletion(model, systemPrompt, userPrompt);
        }
      }
    } else {
      content = await fallbackChatCompletion(model, systemPrompt, userPrompt);
    }

    // Parse and return
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: 'report' } });
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Не вдалося згенерувати звіт. Спробуйте пізніше.' },
      { status: 500 }
    );
  }
}

async function fallbackChatCompletion(model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}
