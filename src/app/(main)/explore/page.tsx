'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartInput } from '@/types/astrology';

const DEMO_SUBJECT: ChartInput = {
  name: 'Demo',
  birthDate: '1990-05-11',
  birthTime: '18:15',
  city: 'Kyiv',
  countryCode: 'UA',
  latitude: 50.4501,
  longitude: 30.5234,
};

type ExploreAction = 'daily_horoscope' | 'transit' | 'numerology' | 'transit_svg';

interface Feature {
  action: ExploreAction;
  title: string;
  icon: string;
  description: string;
  sdkMethod: string;
}

const FEATURES: Feature[] = [
  {
    action: 'daily_horoscope',
    title: 'Персональний гороскоп',
    icon: '🔮',
    description: 'Персоналізований прогноз на сьогодні на основі натальної карти — не знаковий, а індивідуальний.',
    sdkMethod: 'client.horoscope.getPersonalDailyHoroscope()',
  },
  {
    action: 'transit',
    title: 'Транзити на сьогодні',
    icon: '🪐',
    description: 'Поточні планетарні транзити до натальної карти — які аспекти зараз активні.',
    sdkMethod: 'client.charts.getTransitChart()',
  },
  {
    action: 'transit_svg',
    title: 'Транзитна карта SVG',
    icon: '🎨',
    description: 'Візуалізація транзитної карти — натальна карта з поточними транзитами.',
    sdkMethod: 'client.svg.getTransitChartSvg()',
  },
  {
    action: 'numerology',
    title: 'Нумерологія',
    icon: '🔢',
    description: 'Число життєвого шляху, число долі, число душі — зовсім нова функціональність.',
    sdkMethod: 'client.numerology.getCoreNumbers()',
  },
];

// SVG from the API is trusted content (our own API provider, not user input)
function SvgRenderer({ svg }: { svg: string }) {
  // Basic validation: ensure it starts with SVG-like content
  if (!svg || (!svg.trim().startsWith('<svg') && !svg.trim().startsWith('<?xml'))) {
    return <p className="text-sm text-white/50">Невалідний SVG</p>;
  }
  return (
    <div
      className="bg-white/5 rounded-lg p-2 overflow-auto max-h-[500px] [&>svg]:w-full [&>svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function ExplorePage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function runFeature(action: ExploreAction) {
    setLoading(prev => ({ ...prev, [action]: true }));
    setErrors(prev => ({ ...prev, [action]: '' }));

    try {
      const res = await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, chartInput: DEMO_SUBJECT }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      setResults(prev => ({ ...prev, [action]: data.data }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [action]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">API Explorer</h1>
        <p className="text-white/60">
          Демо нових можливостей Astrology API SDK — натисніть щоб протестувати
        </p>
        <p className="text-xs text-white/40">
          Демо-дані: {DEMO_SUBJECT.name}, {DEMO_SUBJECT.birthDate}, {DEMO_SUBJECT.birthTime}, {DEMO_SUBJECT.city}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.action}>
            <CardHeader>
              <CardTitle className="text-lg">
                {feature.icon} {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
              <code className="text-xs text-accent-purple/80 bg-white/5 px-2 py-1 rounded w-fit">
                {feature.sdkMethod}
              </code>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => runFeature(feature.action)}
                disabled={loading[feature.action]}
                className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/30 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loading[feature.action] ? 'Завантаження...' : 'Спробувати'}
              </button>

              {errors[feature.action] && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  {errors[feature.action]}
                </div>
              )}

              {results[feature.action] && (
                <div className="space-y-2">
                  {feature.action === 'transit_svg' && results[feature.action]?.svg ? (
                    <SvgRenderer svg={results[feature.action].svg} />
                  ) : (
                    <pre className="p-3 bg-white/5 rounded-lg text-xs overflow-auto max-h-[400px] whitespace-pre-wrap">
                      {JSON.stringify(results[feature.action], null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Всі доступні SDK категорії</CardTitle>
          <CardDescription>
            Повний список категорій що SDK підтримує (68+ ендпоінтів)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            {[
              { name: 'charts', desc: 'Natal, synastry, composite, transit, returns' },
              { name: 'analysis', desc: 'Natal report, synastry report, career, health' },
              { name: 'horoscope', desc: 'Personal daily, weekly, monthly, yearly' },
              { name: 'data', desc: 'Positions, aspects, houses, lunar metrics' },
              { name: 'svg', desc: 'Natal, synastry, transit chart images' },
              { name: 'lunar', desc: 'Phases, void-of-course, mansions, calendar' },
              { name: 'traditional', desc: 'Dignities, profections, lots, sect' },
              { name: 'numerology', desc: 'Core numbers, compatibility, reports' },
              { name: 'tarot', desc: 'Card draws, tree of life, timing' },
              { name: 'chinese', desc: 'BaZi, yearly forecast, compatibility' },
              { name: 'eclipses', desc: 'Upcoming, natal check, interpretation' },
              { name: 'fixedStars', desc: 'Positions, conjunctions, reports' },
              { name: 'astrocartography', desc: 'Lines, maps, relocation, power zones' },
              { name: 'insights', desc: 'Relationship, pet, wellness, financial, business' },
              { name: 'enhanced', desc: 'Global analysis, personal analysis' },
              { name: 'glossary', desc: 'Cities, countries, house systems, points' },
            ].map((cat) => (
              <div key={cat.name} className="p-3 bg-white/5 rounded-lg">
                <div className="font-mono text-accent-purple">{cat.name}</div>
                <div className="text-xs text-white/50 mt-1">{cat.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
