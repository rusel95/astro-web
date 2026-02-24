import { NextRequest, NextResponse } from 'next/server';
import { getAstrologyClient, toSdkSubject, toSdkChartOptions } from '@/lib/astrology-client';
import { AstrologyError } from '@astro-api/astroapi-typescript';

export async function POST(req: NextRequest) {
  try {
    const { action, ...params } = await req.json();
    const client = getAstrologyClient();

    switch (action) {
      case 'daily_horoscope': {
        const subject = toSdkSubject(params.chartInput);
        const result = await client.horoscope.getPersonalDailyHoroscope({
          subject,
          options: toSdkChartOptions(),
        } as any);
        return NextResponse.json({ action, data: result });
      }

      case 'transit': {
        const now = new Date();
        const result = await client.charts.getTransitChart({
          natal_subject: toSdkSubject(params.chartInput),
          transit_datetime: {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            city: params.chartInput.city,
            country_code: params.chartInput.countryCode,
          },
          options: toSdkChartOptions(),
        });
        return NextResponse.json({ action, data: result });
      }

      case 'synastry_report': {
        const result = await client.analysis.getSynastryReport({
          subject1: toSdkSubject(params.person1),
          subject2: toSdkSubject(params.person2),
          options: toSdkChartOptions(),
          report_options: { language: 'uk' as any },
        } as any);
        return NextResponse.json({ action, data: result });
      }

      case 'numerology': {
        const result = await client.numerology.getCoreNumbers({
          subject: toSdkSubject(params.chartInput),
        } as any);
        return NextResponse.json({ action, data: result });
      }

      case 'transit_svg': {
        const now = new Date();
        const result = await client.svg.getTransitChartSvg({
          natal_subject: toSdkSubject(params.chartInput),
          transit_datetime: {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            city: params.chartInput.city,
            country_code: params.chartInput.countryCode,
          },
          options: toSdkChartOptions(),
        } as any, { responseType: 'text' });
        return NextResponse.json({ action, data: { svg: result } });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    if (error instanceof AstrologyError) {
      console.error('Explore API error:', error.statusCode, error.message, error.details);
      return NextResponse.json(
        { error: error.message, statusCode: error.statusCode, details: error.details },
        { status: error.statusCode || 500 }
      );
    }
    console.error('Explore error:', error);
    return NextResponse.json({ error: error.message || 'Помилка' }, { status: 500 });
  }
}
