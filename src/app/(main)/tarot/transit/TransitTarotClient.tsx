'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

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
            <SectionCard title="Транзитне таро">
              <ReportRenderer content={data.report} />
            </SectionCard>
          )}
          {!!data.cards && Array.isArray(data.cards) && (
            <SectionCard title="Карти" defaultCollapsed>
              <ReportRenderer content={data.cards} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
