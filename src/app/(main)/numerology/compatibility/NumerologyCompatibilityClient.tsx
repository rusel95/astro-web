'use client';

import { useState } from 'react';
import BirthDataForm from '@/components/feature/BirthDataForm';
import AnalysisSection from '@/components/feature/AnalysisSection';
import ErrorState from '@/components/feature/ErrorState';
import { apiPost } from '@/lib/api-client';
import type { ChartInput } from '@/types/astrology';

function chartInputToSubject(input: ChartInput) {
  const [year, month, day] = input.birthDate.split('-').map(Number);
  const [hour, minute] = (input.birthTime || '12:00').split(':').map(Number);
  return {
    name: input.name || 'Person',
    birth_data: {
      year, month, day, hour, minute, second: 0,
      city: input.city,
      country_code: input.countryCode,
      latitude: input.latitude,
      longitude: input.longitude,
    },
  };
}

export default function NumerologyCompatibilityClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [subject1, setSubject1] = useState<Record<string, unknown> | null>(null);

  const handleSubmit1 = (data: ChartInput) => {
    setSubject1(chartInputToSubject(data));
    setResult(null);
    setError(null);
  };

  const handleSubmit2 = async (data: ChartInput) => {
    if (!subject1) return;
    const s2 = chartInputToSubject(data);
    setLoading(true);
    setError(null);
    const { data: res, error: apiError } = await apiPost('/api/numerology/compatibility', {
      subject1,
      subject2: s2,
    });
    if (apiError) setError(apiError);
    else if (res) setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Нумерологічна сумісність</h1>
        <p className="text-white/60 mt-1">Аналіз числової сумісності двох людей на основі імені та дати народження.</p>
      </div>

      {/* Person 1 */}
      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <h2 className="text-sm text-white/40 uppercase tracking-wider mb-4">
          {subject1 ? '✓ Перша особа' : 'Перша особа'}
        </h2>
        {!subject1 ? (
          <BirthDataForm variant="basic" onSubmit={handleSubmit1} loading={false} submitLabel="Далі →" />
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-sm">{(subject1 as any).name}</p>
            <button
              onClick={() => { setSubject1(null); setResult(null); }}
              className="text-xs text-zorya-violet hover:underline"
            >
              Змінити
            </button>
          </div>
        )}
      </div>

      {/* Person 2 */}
      {subject1 && (
        <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h2 className="text-sm text-white/40 uppercase tracking-wider mb-4">Друга особа</h2>
          <BirthDataForm variant="basic" onSubmit={handleSubmit2} loading={loading} submitLabel="Розрахувати сумісність" />
        </div>
      )}

      {error && !loading && (
        <ErrorState
          type="api"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {result && !error && (
        <div className="space-y-4">
          {!!result.compatibility && (
            <AnalysisSection title="Нумерологічна сумісність" data={result.compatibility as Record<string, unknown>} />
          )}
        </div>
      )}
    </div>
  );
}
