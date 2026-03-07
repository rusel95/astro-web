'use client';

import { useEffect, useState } from 'react';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import DataTable from '@/components/feature/DataTable';

interface GlossaryData {
  activePoints?: unknown;
  elements?: unknown;
  houses?: unknown;
  keywords?: unknown;
  lifeAreas?: unknown;
}

function GlossarySection({ title, data, defaultCollapsed = false }: { title: string; data: unknown; defaultCollapsed?: boolean }) {
  if (!data) return null;
  return (
    <SectionCard title={title} defaultCollapsed={defaultCollapsed}>
      {Array.isArray(data) ? (
        <DataTable data={data} />
      ) : (
        <ReportRenderer content={data} />
      )}
    </SectionCard>
  );
}

export default function GlossaryClient() {
  const [data, setData] = useState<GlossaryData | null>(null);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-16 bg-white/[0.05] rounded-2xl" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-4">
          <GlossarySection title="Стихії" data={data.elements} />
          <GlossarySection title="Планети та точки" data={data.activePoints} defaultCollapsed />
          <GlossarySection title="Будинки" data={data.houses} defaultCollapsed />
          <GlossarySection title="Сфери життя" data={data.lifeAreas} defaultCollapsed />
          <GlossarySection title="Ключові слова" data={data.keywords} defaultCollapsed />
        </div>
      ) : (
        <p className="text-white/40 text-sm">Не вдалося завантажити глосарій.</p>
      )}
    </div>
  );
}
