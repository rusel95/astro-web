'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function ProfectionsClient() {
  return (
    <FeaturePageLayout
      title="Профекції"
      description="Річні профекції та хазяїн року. Класична техніка тимелордів."
      apiEndpoint="/api/traditional/profections"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.annualProfection && (
            <AnalysisSection title="Поточна профекція" data={data.annualProfection as Record<string, unknown>} />
          )}

          {!!data.profectionsAnalysis && (
            <AnalysisSection title="Аналіз профекцій" data={data.profectionsAnalysis as Record<string, unknown>} defaultCollapsed />
          )}

          {!!data.profectionTimeline && (
            <AnalysisSection title="Хронологія профекцій (0–90 років)" data={data.profectionTimeline as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
