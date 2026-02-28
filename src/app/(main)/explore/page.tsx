'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartInput } from '@/types/astrology';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  city: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

type ExploreAction = 'daily_horoscope' | 'transit' | 'numerology' | 'transit_svg';

interface Feature {
  action: ExploreAction;
  title: string;
  icon: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    action: 'daily_horoscope',
    title: 'Персональний гороскоп',
    icon: '🔮',
    description: 'Персоналізований прогноз на сьогодні на основі вашої натальної карти.',
  },
  {
    action: 'transit',
    title: 'Транзити на сьогодні',
    icon: '🪐',
    description: 'Поточні планетарні транзити до вашої натальної карти — які аспекти зараз активні.',
  },
  {
    action: 'transit_svg',
    title: 'Транзитна карта',
    icon: '🎨',
    description: 'Візуалізація транзитної карти — ваша натальна карта з поточними транзитами.',
  },
  {
    action: 'numerology',
    title: 'Нумерологія',
    icon: '🔢',
    description: 'Число життєвого шляху, число долі, число душі на основі вашої дати народження.',
  },
];

/**
 * SVG renderer for transit chart visualization.
 * The SVG comes from our own Astrology API (trusted first-party content),
 * not from user input or third-party sources.
 */
function SvgRenderer({ svg }: { svg: string }) {
  if (!svg || (!svg.trim().startsWith('<svg') && !svg.trim().startsWith('<?xml'))) {
    return <p className="text-sm text-white/50">Невалідний SVG</p>;
  }
  return (
    <div
      className="bg-white/5 rounded-lg p-2 overflow-auto max-h-[500px] [&>svg]:w-full [&>svg]:h-auto"
      // Safe: SVG is from our own first-party Astrology API, not user input
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function ExplorePage() {
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch saved charts
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoadingCharts(false);
      return;
    }

    async function fetchMyCharts() {
      try {
        const res = await fetch('/api/charts/my');
        if (!res.ok) {
          setLoadingCharts(false);
          return;
        }
        const data = await res.json();
        if (data.charts && data.charts.length > 0) {
          setSavedCharts(data.charts);
          setSelectedChartId(data.charts[0].id);
        }
      } catch {
        // Not logged in or no charts
      } finally {
        setLoadingCharts(false);
      }
    }
    fetchMyCharts();
  }, []);

  const selectedChart = savedCharts.find(c => c.id === selectedChartId);

  function getChartInput(): ChartInput | null {
    if (!selectedChart) return null;
    return {
      name: selectedChart.name,
      birthDate: selectedChart.birth_date,
      birthTime: selectedChart.birth_time || '12:00',
      city: selectedChart.city,
      countryCode: selectedChart.country_code,
      latitude: selectedChart.latitude,
      longitude: selectedChart.longitude,
    };
  }

  async function runFeature(action: ExploreAction) {
    const chartInput = getChartInput();
    if (!chartInput) return;

    setLoading(prev => ({ ...prev, [action]: true }));
    setErrors(prev => ({ ...prev, [action]: '' }));

    try {
      const res = await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, chartInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Помилка ${res.status}`);
      }

      setResults(prev => ({ ...prev, [action]: data.data }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [action]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  }

  // Loading state
  if (loadingCharts) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full border-3 border-zorya-violet/20 border-t-zorya-violet animate-spin mx-auto mb-4" />
        <p className="text-white/60">Завантаження...</p>
      </div>
    );
  }

  // No charts — prompt to create one
  if (savedCharts.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">🔭</div>
          <h1 className="text-3xl font-display font-bold">Досліджуйте можливості</h1>
          <p className="text-white/60">
            Для доступу до персонального гороскопу, транзитів та нумерології потрібно спочатку створити натальну карту.
          </p>
          <Link
            href="/chart/new"
            className="btn-primary inline-flex"
          >
            ✦ Створити натальну карту
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-bold">Досліджуйте</h1>
        <p className="text-white/60">
          Персональний гороскоп, транзити та нумерологія на основі вашої натальної карти
        </p>
      </div>

      {/* Chart selector */}
      {savedCharts.length > 1 && (
        <div className="max-w-md mx-auto">
          <label className="block text-sm text-white/50 mb-2">Оберіть карту</label>
          <select
            value={selectedChartId || ''}
            onChange={(e) => {
              setSelectedChartId(e.target.value);
              setResults({});
              setErrors({});
            }}
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {savedCharts.map(chart => (
              <option key={chart.id} value={chart.id}>
                {chart.name} — {chart.birth_date}, {chart.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedChart && (
        <p className="text-center text-sm text-white/40">
          {selectedChart.name} · {selectedChart.birth_date} · {selectedChart.birth_time || '12:00'} · {selectedChart.city}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.action}>
            <CardHeader>
              <CardTitle className="text-lg">
                {feature.icon} {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => runFeature(feature.action)}
                disabled={loading[feature.action] || !selectedChart}
                className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/30 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loading[feature.action] ? 'Завантаження...' : 'Показати'}
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
    </div>
  );
}
