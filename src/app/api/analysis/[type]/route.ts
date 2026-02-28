import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAstrologyClient, toSdkChartOptions } from '@/lib/astrology-client';

const ANALYSIS_TYPES = ['career', 'health', 'karmic', 'psychological', 'spiritual', 'vocational', 'lunar', 'relocation'] as const;
type AnalysisType = typeof ANALYSIS_TYPES[number];

const ANALYSIS_METHOD_MAP: Record<AnalysisType, (client: ReturnType<typeof getAstrologyClient>, req: any) => Promise<any>> = {
  career: (client, req) => client.analysis.getCareerAnalysis(req),
  health: (client, req) => client.analysis.getHealthAnalysis(req),
  karmic: (client, req) => client.analysis.getKarmicAnalysis(req),
  psychological: (client, req) => client.analysis.getPsychologicalAnalysis(req),
  spiritual: (client, req) => client.analysis.getSpiritualAnalysis(req),
  vocational: (client, req) => client.analysis.getVocationalAnalysis(req),
  lunar: (client, req) => client.analysis.getLunarAnalysis(req),
  relocation: (client, req) => client.analysis.getRelocationAnalysis(req),
};

export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
  const { type } = params;

  if (!ANALYSIS_TYPES.includes(type as AnalysisType)) {
    return NextResponse.json({ error: `Невідомий тип аналізу: ${type}` }, { status: 400 });
  }

  try {
    const { subject } = await req.json();
    const client = getAstrologyClient();
    const options = toSdkChartOptions();

    const analysisResult = await ANALYSIS_METHOD_MAP[type as AnalysisType](client, { subject, options } as any).catch((e: unknown) => {
      Sentry.captureException(e, { tags: { route: `analysis/${type}`, call: `get${type}Analysis` }, level: 'error' });
      return null;
    });

    if (!analysisResult) {
      return NextResponse.json({ error: 'Помилка аналізу. Спробуйте ще раз.' }, { status: 500 });
    }

    return NextResponse.json(
      { analysis: analysisResult, type },
      { headers: { 'Cache-Control': 'private, s-maxage=2592000, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    Sentry.captureException(error, { tags: { route: `analysis/${type}`, level: 'error' } });
    return NextResponse.json({ error: error.message || 'Помилка аналізу' }, { status: 500 });
  }
}
