'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function ProgressionsClient() {
  return (
    <FeaturePageLayout
      title="Вторинні прогресії"
      description="Прогресовані позиції планет та їх вплив на ваш розвиток. Символічний рух карти в часі."
      apiEndpoint="/api/progressions"
      formVariant="date-range"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.progressionReport && (
            <AnalysisSection title="Звіт прогресій" data={data.progressionReport as Record<string, unknown>} />
          )}

          {!!data.progressions && (
            <AnalysisSection title="Прогресовані позиції" data={data.progressions as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
