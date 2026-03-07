'use client';

import { useEffect, useState } from 'react';
import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

interface EclipseItem {
  date?: string;
  type?: string;
  saros_series?: number | string;
  description?: string;
  [key: string]: unknown;
}

function UpcomingEclipses({ data }: { data: unknown }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : (data as Record<string, unknown>)?.eclipses || (data as Record<string, unknown>)?.data || [];
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <SectionCard title="Майбутні затемнення">
        <ReportRenderer content={data} />
      </SectionCard>
    );
  }

  const typeLabel = (t: string | undefined) => {
    if (!t) return '';
    const lower = t.toLowerCase();
    if (lower.includes('solar') || lower.includes('сон')) return 'Сонячне';
    if (lower.includes('lunar') || lower.includes('міс')) return 'Місячне';
    return t;
  };

  return (
    <SectionCard title="Майбутні затемнення">
      <div className="divide-y divide-white/[0.06] -mx-4">
        {items.slice(0, 10).map((item: EclipseItem, i: number) => (
          <div key={i} className="px-4 py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white font-medium">{typeLabel(item.type)}</p>
              {item.date && <p className="text-xs text-white/40 mt-0.5">{item.date}</p>}
              {item.description && <p className="text-xs text-white/50 mt-1">{item.description}</p>}
            </div>
            {item.saros_series !== undefined && (
              <span className="text-xs text-white/30 shrink-0 bg-white/[0.04] px-2 py-0.5 rounded">
                Сарос {item.saros_series}
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
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

      {loadingUpcoming ? (
        <div className="animate-pulse h-40 bg-white/[0.05] rounded-2xl" />
      ) : (
        <UpcomingEclipses data={upcoming} />
      )}

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
                <SectionCard title="Натальний вплив затемнень">
                  <ReportRenderer content={data.natalImpact} />
                </SectionCard>
              )}
            </div>
          )}
        </FeaturePageLayout>
      </div>
    </div>
  );
}
