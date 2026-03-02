'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function SolarReturnClient() {
  return (
    <FeaturePageLayout
      title="Соляр (Solar Return)"
      description="Карта повернення Сонця у натальну позицію. Основні теми та енергії на рік."
      apiEndpoint="/api/solar-return"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.solarReturnReport && (
            <AnalysisSection title="Звіт соляру" data={data.solarReturnReport as Record<string, unknown>} />
          )}

          {!!data.solarReturnTransits && (
            <AnalysisSection title="Транзити соляру" data={data.solarReturnTransits as Record<string, unknown>} />
          )}

          {!!data.solarReturnChart && (
            <AnalysisSection title="Дані карти соляру" data={data.solarReturnChart as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
