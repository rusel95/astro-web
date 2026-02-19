import { NextRequest, NextResponse } from 'next/server';
import { buildAPIRequest, mapAPIResponse } from '@/lib/api-mapper';
import { ChartInput, NatalChart, Planet, AspectType } from '@/types/astrology';

interface CompatibilityInput {
  person1: ChartInput;
  person2: ChartInput;
}

interface SynastryAspect {
  planet1: string;
  person1Name: string;
  planet2: string;
  person2Name: string;
  type: AspectType;
  orb: number;
  description: string;
}

interface CompatibilityResult {
  person1Chart: NatalChart;
  person2Chart: NatalChart;
  synastryAspects: SynastryAspect[];
  compatibilityScore: number;
  aiAnalysis?: string;
}

// Calculate angle difference between two longitudes (0-180)
function getAngleDifference(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// Determine aspect type based on angle
function getAspectType(angle: number, orb: number = 8): { type: AspectType; orb: number } | null {
  const aspects = [
    { type: 'Conjunction' as AspectType, angle: 0, maxOrb: 8 },
    { type: 'Sextile' as AspectType, angle: 60, maxOrb: 6 },
    { type: 'Square' as AspectType, angle: 90, maxOrb: 7 },
    { type: 'Trine' as AspectType, angle: 120, maxOrb: 8 },
    { type: 'Opposition' as AspectType, angle: 180, maxOrb: 8 },
  ];

  for (const aspect of aspects) {
    const actualOrb = Math.abs(angle - aspect.angle);
    if (actualOrb <= aspect.maxOrb) {
      return { type: aspect.type, orb: actualOrb };
    }
  }
  return null;
}

// Get Ukrainian description for aspect
function getAspectDescription(planet1: string, planet2: string, type: AspectType): string {
  const descriptions: Record<AspectType, string> = {
    Conjunction: 'З\'єднання — інтенсивна взаємодія',
    Sextile: 'Секстиль — гармонійна підтримка',
    Square: 'Квадрат — напруга і виклики',
    Trine: 'Тригон — природна гармонія',
    Opposition: 'Опозиція — протилежності притягуються',
    Quincunx: 'Квінкукс — необхідність адаптації',
    Semisextile: 'Напівсекстиль — легка підтримка',
    Semisquare: 'Напівквадрат — легка напруга',
    Sesquisquare: 'Сесквіквадрат — помірна напруга',
    Quintile: 'Квінтиль — творчий зв\'язок',
    Biquintile: 'Біквінтиль — креативна синергія',
  };
  return descriptions[type] || '';
}

// Calculate synastry aspects between two charts
function calculateSynastryAspects(
  chart1: NatalChart,
  chart2: NatalChart,
  name1: string,
  name2: string
): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];

  // Key planets for relationships
  const keyPlanets = ['Sun', 'Moon', 'Venus', 'Mars', 'Mercury', 'Jupiter'];

  for (const p1 of chart1.planets) {
    if (!keyPlanets.includes(p1.name)) continue;

    for (const p2 of chart2.planets) {
      if (!keyPlanets.includes(p2.name)) continue;

      const angle = getAngleDifference(p1.longitude, p2.longitude);
      const aspect = getAspectType(angle);

      if (aspect) {
        aspects.push({
          planet1: p1.name,
          person1Name: name1,
          planet2: p2.name,
          person2Name: name2,
          type: aspect.type,
          orb: aspect.orb,
          description: getAspectDescription(p1.name, p2.name, aspect.type),
        });
      }
    }
  }

  return aspects;
}

// Calculate compatibility score (0-100)
function calculateCompatibilityScore(aspects: SynastryAspect[]): number {
  let score = 50; // Base score

  for (const aspect of aspects) {
    switch (aspect.type) {
      case 'Conjunction':
        score += 8;
        break;
      case 'Trine':
        score += 10;
        break;
      case 'Sextile':
        score += 7;
        break;
      case 'Square':
        score -= 3;
        break;
      case 'Opposition':
        score += 2; // Can be challenging but creates attraction
        break;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export async function POST(req: NextRequest) {
  try {
    const input: CompatibilityInput = await req.json();
    const { person1, person2 } = input;

    const baseUrl = process.env.ASTROLOGY_API_BASE_URL || 'https://api.astrology-api.io/api/v3';
    const apiKey = process.env.ASTROLOGY_API_KEY;

    if (!apiKey || apiKey === 'placeholder') {
      return NextResponse.json(
        { error: 'Сервіс тимчасово недоступний' },
        { status: 503 }
      );
    }

    // Fetch both natal charts in parallel
    const [chart1Res, chart2Res] = await Promise.all([
      fetch(`${baseUrl}/charts/natal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(buildAPIRequest(person1)),
      }),
      fetch(`${baseUrl}/charts/natal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(buildAPIRequest(person2)),
      }),
    ]);

    if (!chart1Res.ok || !chart2Res.ok) {
      throw new Error('Помилка розрахунку карт');
    }

    const [apiResponse1, apiResponse2] = await Promise.all([
      chart1Res.json(),
      chart2Res.json(),
    ]);

    const chart1 = mapAPIResponse(apiResponse1, person1);
    const chart2 = mapAPIResponse(apiResponse2, person2);

    // Calculate synastry aspects
    const synastryAspects = calculateSynastryAspects(
      chart1,
      chart2,
      person1.name,
      person2.name
    );

    // Calculate compatibility score
    const compatibilityScore = calculateCompatibilityScore(synastryAspects);

    const result: CompatibilityResult = {
      person1Chart: chart1,
      person2Chart: chart2,
      synastryAspects,
      compatibilityScore,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Compatibility API error:', error);
    return NextResponse.json(
      { error: error.message || 'Помилка аналізу сумісності' },
      { status: 500 }
    );
  }
}
