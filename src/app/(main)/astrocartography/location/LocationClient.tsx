'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

export default function LocationClient() {
  return (
    <FeaturePageLayout
      title="Аналіз локації"
      description="Астрологічний аналіз конкретного міста — яку енергію несуть планети в цьому місці."
      apiEndpoint="/api/astrocartography/location"
      formVariant="location"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.locationAnalysis && (
            <SectionCard title="Аналіз локації">
              <ReportRenderer content={data.locationAnalysis} />
            </SectionCard>
          )}

          {!!data.relocationChart && (
            <SectionCard title="Карта релокації" defaultCollapsed>
              <ReportRenderer content={data.relocationChart} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
