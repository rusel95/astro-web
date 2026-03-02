'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function NumerologyClient() {
  return (
    <FeaturePageLayout
      title="Нумерологія"
      description="Ключові числа вашої долі: число душі, особистості, долі та зрілості."
      apiEndpoint="/api/numerology"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.coreNumbers && (
            <AnalysisSection title="Ключові числа" data={data.coreNumbers as Record<string, unknown>} />
          )}

          {!!data.comprehensiveReport && (
            <AnalysisSection title="Комплексний звіт" data={data.comprehensiveReport as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
