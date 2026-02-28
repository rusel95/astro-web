'use client';

import { useState, useEffect } from 'react';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import type { ZodiacSign } from '@/types/astrology';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import AnalysisSection from '@/components/feature/AnalysisSection';
import ErrorState from '@/components/feature/ErrorState';

const SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

interface SignHoroscopePageProps {
  title: string;
  description: string;
  apiPath: string; // e.g., '/api/horoscope/daily'
}

export default function SignHoroscopePage({ title, description, apiPath }: SignHoroscopePageProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSign) return;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiPath}/${selectedSign}`);
        if (!res.ok) throw new Error('Не вдалося завантажити гороскоп');
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Помилка завантаження');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [selectedSign, apiPath]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{title}</h1>
        <p className="text-white/60 mt-1">{description}</p>
      </div>

      {/* Sign selector */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {SIGNS.map((sign) => (
          <button
            key={sign}
            onClick={() => setSelectedSign(sign)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all min-h-[44px] ${
              selectedSign === sign
                ? 'bg-zorya-violet/20 border border-zorya-violet/40'
                : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]'
            }`}
          >
            <ZodiacIcon sign={sign} size={20} className={selectedSign === sign ? 'text-zorya-violet' : 'text-white/50'} />
            <span className={`text-[10px] font-medium ${selectedSign === sign ? 'text-zorya-violet' : 'text-white/50'}`}>
              {ZODIAC_NAMES_UK[sign]}
            </span>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          <div className="animate-pulse h-40 bg-white/[0.05] rounded-2xl" />
          <div className="animate-pulse h-24 bg-white/[0.05] rounded-2xl" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <ErrorState
          type="api"
          message={error}
          onRetry={() => selectedSign && setSelectedSign(selectedSign)}
        />
      )}

      {/* Results */}
      {data && !loading && !error && (
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => {
            if (!value || (typeof value === 'object' && Object.keys(value as object).length === 0)) return null;
            return (
              <AnalysisSection
                key={key}
                title={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                data={value as Record<string, unknown>}
              />
            );
          })}
        </div>
      )}

      {/* Prompt to select sign */}
      {!selectedSign && !loading && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 text-center">
          <p className="text-white/40 text-sm">Оберіть знак зодіаку для перегляду гороскопу</p>
        </div>
      )}
    </div>
  );
}
