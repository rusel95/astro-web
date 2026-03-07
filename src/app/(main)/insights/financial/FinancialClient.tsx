'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

export default function FinancialClient() {
  return (
    <FeaturePageLayout
      title="Фінансові інсайти"
      description="Астрологічний аналіз фінансових ритмів, ринкового тайминг та особистої торгівельної стратегії."
      apiEndpoint="/api/insights/financial"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.marketTiming && (
            <SectionCard title="Ринковий таймінг">
              <ReportRenderer content={data.marketTiming} />
            </SectionCard>
          )}

          {!!data.personalTrading && (
            <SectionCard title="Особиста торгівля" defaultCollapsed>
              <ReportRenderer content={data.personalTrading} />
            </SectionCard>
          )}

          {!!data.gannAnalysis && (
            <SectionCard title="Аналіз Ганна" defaultCollapsed>
              <ReportRenderer content={data.gannAnalysis} />
            </SectionCard>
          )}

          {!!data.bradleySiderograph && (
            <SectionCard title="Сайдерограф Бредлі" defaultCollapsed>
              <ReportRenderer content={data.bradleySiderograph} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
