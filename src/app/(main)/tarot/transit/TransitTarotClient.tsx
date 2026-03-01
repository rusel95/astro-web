'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function TransitTarotClient() {
  return (
    <FeaturePageLayout
      title="Транзитне таро"
      description="Поєднання астрологічних транзитів і карт таро. Розклад на поточний період."
      apiEndpoint="/api/tarot/transit-natal"
      formVariant="date-range"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.report && (
            <AnalysisSection title="Транзитне таро" data={data.report as Record<string, unknown>} />
          )}
          {!!data.cards && Array.isArray(data.cards) && (
            <AnalysisSection title="Карти" data={{ cards: data.cards } as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
