'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function FixedStarsClient() {
  return (
    <FeaturePageLayout
      title="Фіксовані зірки"
      description="Натальні кон'юнкції з фіксованими зірками та їхній вплив на особистість і долю."
      apiEndpoint="/api/fixed-stars"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.conjunctions && (
            <AnalysisSection title="Кон'юнкції із зірками" data={data.conjunctions as Record<string, unknown>} />
          )}
          {!!data.report && (
            <AnalysisSection title="Звіт фіксованих зірок" data={data.report as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
