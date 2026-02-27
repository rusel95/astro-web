import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { mapAPIResponse } from '@/lib/api-mapper';
import { ChartInput, NatalChart, AspectType } from '@/types/astrology';
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';
import { AstrologyError } from '@astro-api/astroapi-typescript';

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
function getAspectType(angle: number): { type: AspectType; orb: number } | null {
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

// Score per aspect type (0-100 scale)
const ASPECT_SCORE: Partial<Record<AspectType, number>> = {
  Trine: 85,
  Sextile: 75,
  Conjunction: 65,
  Opposition: 40,
  Square: 25,
};

// Weight by planet pair importance for relationships
const PLANET_WEIGHT: Record<string, number> = {
  Sun: 1.5,
  Moon: 2.0,
  Venus: 2.0,
  Mars: 1.5,
  Mercury: 1.0,
  Jupiter: 1.0,
};

// Calculate compatibility score (0-100) via weighted average of aspect scores
function calculateCompatibilityScore(aspects: SynastryAspect[]): number {
  if (aspects.length === 0) return 50;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const aspect of aspects) {
    const baseScore = ASPECT_SCORE[aspect.type] ?? 50;
    const w1 = PLANET_WEIGHT[aspect.planet1] ?? 1.0;
    const w2 = PLANET_WEIGHT[aspect.planet2] ?? 1.0;
    const weight = (w1 + w2) / 2;

    const orbFactor = 1 - (aspect.orb / 10) * 0.2;

    totalWeightedScore += baseScore * weight * orbFactor;
    totalWeight += weight;
  }

  const score = Math.round(totalWeightedScore / totalWeight);
  return Math.max(20, Math.min(95, score));
}

export async function POST(req: NextRequest) {
  try {
    const input: CompatibilityInput = await req.json();
    const { person1, person2 } = input;

    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    // Fetch both natal charts in parallel via SDK
    const [apiResponse1, apiResponse2] = await Promise.all([
      client.charts.getNatalChart({ subject: toSdkSubject(person1), options }),
      client.charts.getNatalChart({ subject: toSdkSubject(person2), options }),
    ]);

    const chart1 = mapAPIResponse(apiResponse1 as any, person1);
    const chart2 = mapAPIResponse(apiResponse2 as any, person2);

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
    Sentry.captureException(error, { tags: { route: 'compatibility' } });
    if (error instanceof AstrologyError) {
      console.error('Astrology API error:', error.statusCode, error.message);
    } else {
      console.error('Compatibility API error:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Помилка аналізу сумісності' },
      { status: 500 }
    );
  }
}
