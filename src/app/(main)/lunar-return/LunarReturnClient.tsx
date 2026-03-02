'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function LunarReturnClient() {
  return (
    <FeaturePageLayout
      title="Лунар (Lunar Return)"
      description="Карта повернення Місяця. Емоційні теми та настрій місячного циклу."
      apiEndpoint="/api/lunar-return"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.lunarReturnReport && (
            <AnalysisSection title="Звіт лунару" data={data.lunarReturnReport as Record<string, unknown>} />
          )}

          {!!data.lunarReturnTransits && (
            <AnalysisSection title="Транзити лунару" data={data.lunarReturnTransits as Record<string, unknown>} />
          )}

          {!!data.lunarReturnChart && (
            <AnalysisSection title="Дані карти лунару" data={data.lunarReturnChart as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
