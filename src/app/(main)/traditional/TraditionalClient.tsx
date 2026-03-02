'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function TraditionalClient() {
  return (
    <FeaturePageLayout
      title="Традиційна астрологія"
      description="Гідності планет, арабські частки та традиційна техніка аналізу карти."
      apiEndpoint="/api/traditional/analysis"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.analysis && (
            <AnalysisSection title="Традиційний аналіз" data={data.analysis as Record<string, unknown>} />
          )}

          {!!data.dignitiesAnalysis && (
            <AnalysisSection title="Гідності планет" data={data.dignitiesAnalysis as Record<string, unknown>} defaultCollapsed />
          )}

          {!!data.lotsAnalysis && (
            <AnalysisSection title="Арабські частки" data={data.lotsAnalysis as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
