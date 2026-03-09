/**
 * Server-side utility for generating AI-enhanced Ukrainian reports
 * from raw SDK data (directions, progressions, transits, etc.).
 *
 * Uses OpenAI GPT-4o to transform raw English SDK text into
 * structured, polished Ukrainian interpretations.
 */

import * as Sentry from '@sentry/nextjs';

interface AIFeatureReport {
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    text: string;
    rating?: number;
  }>;
  recommendations: string[];
}

const FEATURE_PROMPTS: Record<string, { systemContext: string; focusAreas: string }> = {
  directions: {
    systemContext: 'дирекції (сонячні дуги) — метод прогнозування, де кожен градус руху дорівнює одному року життя',
    focusAreas: 'ключові переходи планет по знаках і домах, зрілість і трансформація, важливі періоди активації',
  },
  progressions: {
    systemContext: 'вторинні прогресії — символічний рух карти, де один день після народження = один рік життя',
    focusAreas: 'прогресований Місяць (найшвидший, показує емоційний цикл), прогресоване Сонце (зміна знаку = нова ера), зміни домів',
  },
  transit: {
    systemContext: 'транзити — реальні поточні позиції планет відносно натальної карти',
    focusAreas: 'активні транзити зовнішніх планет, точні аспекти, період дії, сфери впливу',
  },
};

/**
 * Generate a polished Ukrainian report from raw SDK data.
 * Returns null if OpenAI is not configured or call fails (graceful degradation).
 */
export async function generateFeatureReport(
  featureType: string,
  rawData: unknown,
): Promise<AIFeatureReport | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'placeholder') return null;

  const config = FEATURE_PROMPTS[featureType];
  if (!config) return null;

  // Serialize raw data, truncating if too large
  let rawText: string;
  try {
    rawText = JSON.stringify(rawData, null, 2);
    if (rawText.length > 12000) {
      rawText = rawText.slice(0, 12000) + '\n... (скорочено)';
    }
  } catch {
    return null;
  }

  const systemPrompt = `Ти — професійний астролог з 20+ роками досвіду. Спеціалізація: ${config.systemContext}.
Завжди відповідай УКРАЇНСЬКОЮ мовою. Використовуй правильну українську астрологічну термінологію:
- "Тригон" (не "Трін"), "Квадратура" (не "Квадрат"), "Секстиль", "Опозиція", "Кон'юнкція"
- "Соляр" (не "Повернення Сонця"), "Лунар", "Прогресії", "Дирекції"
- Для планет: "Сонце", "Місяць", "Меркурій", "Венера", "Марс", "Юпітер", "Сатурн", "Уран", "Нептун", "Плутон"

Тон: теплий, практичний, мотивуючий. Уникай кліше денних гороскопів. Давай конкретні поради.`;

  const userPrompt = `Проаналізуй ці сирі дані ${config.systemContext} та створи структурований звіт.

Фокус аналізу: ${config.focusAreas}

Сирі дані від SDK:
${rawText}

Поверни ТІЛЬКИ валідний JSON (без markdown):
{
  "title": "Короткий заголовок звіту (5-8 слів)",
  "summary": "2-3 яскраві речення — що головне у цих даних для людини, її ключові теми зараз",
  "sections": [
    {
      "heading": "Назва секції (наприклад: Ключові переходи)",
      "text": "Детальний аналіз цієї теми. Мінімум 3-4 речення. Використовуй конкретні позиції планет з даних.",
      "rating": 7
    }
  ],
  "recommendations": ["3-5 конкретних практичних порад, прив'язаних до позицій планет"]
}

ВИМОГИ:
- Мінімум 4 секції, кожна з rating від 1 до 10 (важливість/сила впливу)
- Кожна секція — мінімум 3 речення
- Перекладай ВСІ англійські назви планет і знаків на українську
- Якщо в даних є позиції планет — обов'язково згадуй їх конкретно
- Остання рекомендація: "Для глибшого розуміння зверніться до професійного астролога на сайті Зоря"`;

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
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
      Sentry.captureMessage(`AI feature report failed: ${res.status}`, {
        level: 'warning',
        tags: { featureType },
        extra: { status: res.status, error: errText.slice(0, 500) },
      });
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as AIFeatureReport;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: 'ai-report', featureType },
      level: 'warning',
    });
    return null;
  }
}
