'use client';

import { useEffect, useState } from 'react';
import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

interface EclipseItem {
  date?: string;
  type?: string;
  saros_series?: number | string;
  description?: string;
  [key: string]: unknown;
}

function UpcomingEclipses({ data }: { data: unknown }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : (data as any)?.eclipses || (data as any)?.data || [];
  if (!Array.isArray(items) || items.length === 0) {
    return <AnalysisSection title="Майбутні затемнення" data={data as Record<string, unknown>} />;
  }

  const typeLabel = (t: string | undefined) => {
    if (!t) return '';
    if (t.includes('solar') || t.includes('сон')) return '☀️ Сонячне';
    if (t.includes('lunar') || t.includes('міс')) return '🌑 Місячне';
    return t;
  };

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-medium text-white/70">Майбутні затемнення</h3>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {items.slice(0, 10).map((item: EclipseItem, i: number) => (
          <div key={i} className="px-5 py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white">{typeLabel(item.type)}</p>
              {item.date && <p className="text-xs text-white/40 mt-0.5">{item.date}</p>}
              {item.description && <p className="text-xs text-white/50 mt-1">{item.description}</p>}
            </div>
            {item.saros_series !== undefined && (
              <span className="text-xs text-white/30 shrink-0">Сарос {item.saros_series}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EclipsesClient() {
  const [upcoming, setUpcoming] = useState<unknown>(null);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
    fetch('/api/eclipses')
      .then(r => r.json())
      .then(d => { setUpcoming(d.upcoming ?? d); })
      .catch(() => {})
      .finally(() => setLoadingUpcoming(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Затемнення</h1>
        <p className="text-white/60 mt-1">Майбутні затемнення та їхній вплив на натальну карту.</p>
      </div>

      {/* Upcoming eclipses — no birth data needed */}
      {loadingUpcoming ? (
        <div className="animate-pulse h-40 bg-white/[0.05] rounded-2xl" />
      ) : (
        <UpcomingEclipses data={upcoming} />
      )}

      {/* Natal impact — requires birth data */}
      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <h2 className="text-base font-semibold text-white mb-1">Вплив на натальну карту</h2>
        <p className="text-sm text-white/50 mb-4">Введіть дані народження, щоб побачити, як затемнення впливають на ваші натальні позиції.</p>
        <FeaturePageLayout
          title=""
          description=""
          apiEndpoint="/api/eclipses"
          formVariant="basic"
        >
          {(data) => (
            <div className="space-y-4">
              {!!data.natalImpact && (
                <AnalysisSection title="Натальний вплив затемнень" data={data.natalImpact as Record<string, unknown>} />
              )}
              {!!data.upcoming && (
                <AnalysisSection title="Майбутні затемнення (персоналізовано)" data={data.upcoming as Record<string, unknown>} defaultCollapsed />
              )}
            </div>
          )}
        </FeaturePageLayout>
      </div>
    </div>
  );
}
