'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

export default function BusinessClient() {
  return (
    <FeaturePageLayout
      title="Бізнес-аналіз"
      description="Астрологічний аналіз стилю лідерства, командної динаміки та оптимального бізнес-тайминг."
      apiEndpoint="/api/insights/business"
      formVariant="full"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.leadershipStyle && (
            <SectionCard title="Стиль лідерства">
              <ReportRenderer content={data.leadershipStyle} />
            </SectionCard>
          )}

          {!!data.teamDynamics && (
            <SectionCard title="Командна динаміка" defaultCollapsed>
              <ReportRenderer content={data.teamDynamics} />
            </SectionCard>
          )}

          {!!data.businessTiming && (
            <SectionCard title="Бізнес-таймінг" defaultCollapsed>
              <ReportRenderer content={data.businessTiming} />
            </SectionCard>
          )}

          {!!data.hiringCompatibility && (
            <SectionCard title="Сумісність при найманні" defaultCollapsed>
              <ReportRenderer content={data.hiringCompatibility} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
