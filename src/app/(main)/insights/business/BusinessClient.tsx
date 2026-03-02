'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function BusinessClient() {
  return (
    <FeaturePageLayout
      title="Бізнес-аналіз"
      description="Астрологічний аналіз стилю лідерства, командної динаміки та оптимального бізнес-тайминг."
      apiEndpoint="/api/insights/business"
      formVariant="full"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.leadershipStyle && (
            <AnalysisSection title="Стиль лідерства" data={data.leadershipStyle as Record<string, unknown>} />
          )}
          {!!data.teamDynamics && (
            <AnalysisSection title="Командна динаміка" data={data.teamDynamics as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.businessTiming && (
            <AnalysisSection title="Бізнес-таймінг" data={data.businessTiming as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.hiringCompatibility && (
            <AnalysisSection title="Сумісність при найманні" data={data.hiringCompatibility as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
