'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function LocationClient() {
  return (
    <FeaturePageLayout
      title="Аналіз локації"
      description="Астрологічний аналіз конкретного міста — яку енергію несуть планети в цьому місці."
      apiEndpoint="/api/astrocartography/location"
      formVariant="location"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.locationAnalysis && (
            <AnalysisSection title="Аналіз локації" data={data.locationAnalysis as Record<string, unknown>} />
          )}

          {!!data.relocationChart && (
            <AnalysisSection title="Карта релокації" data={data.relocationChart as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
