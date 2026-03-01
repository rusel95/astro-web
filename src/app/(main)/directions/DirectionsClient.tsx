'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function DirectionsClient() {
  return (
    <FeaturePageLayout
      title="Сонячні дуги (дирекції)"
      description="Напрямлені позиції планет методом сонячної дуги. Аналіз ключових переходів та зрілості."
      apiEndpoint="/api/directions"
      formVariant="date-range"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.directionReport && (
            <AnalysisSection title="Звіт дирекцій" data={data.directionReport as Record<string, unknown>} />
          )}

          {!!data.directions && (
            <AnalysisSection title="Направлені позиції" data={data.directions as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
