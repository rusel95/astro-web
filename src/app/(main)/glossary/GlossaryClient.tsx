'use client';

import { useEffect, useState } from 'react';
import AnalysisSection from '@/components/feature/AnalysisSection';

interface GlossaryData {
  activePoints?: unknown;
  elements?: unknown;
  houses?: unknown;
  keywords?: unknown;
  lifeAreas?: unknown;
}

export default function GlossaryClient() {
  const [data, setData] = useState<GlossaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/glossary')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Астрологічний глосарій</h1>
        <p className="text-white/60 mt-1">Довідник астрологічних термінів, планет, будинків та елементів.</p>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Пошук термінів..."
          className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder-white/30 focus:outline-none focus:border-zorya-violet/50"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-16 bg-white/[0.05] rounded-2xl" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-6">
          {!!data.elements && (
            <AnalysisSection title="Стихії" data={data.elements as Record<string, unknown>} />
          )}
          {!!data.activePoints && (
            <AnalysisSection title="Планети та точки" data={data.activePoints as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.houses && (
            <AnalysisSection title="Будинки" data={data.houses as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.lifeAreas && (
            <AnalysisSection title="Сфери життя" data={data.lifeAreas as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.keywords && (
            <AnalysisSection title="Ключові слова" data={data.keywords as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      ) : (
        <p className="text-white/40 text-sm">Не вдалося завантажити глосарій.</p>
      )}
    </div>
  );
}
