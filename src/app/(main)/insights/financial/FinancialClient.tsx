'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function FinancialClient() {
  return (
    <FeaturePageLayout
      title="Фінансові інсайти"
      description="Астрологічний аналіз фінансових ритмів, ринкового тайминг та особистої торгівельної стратегії."
      apiEndpoint="/api/insights/financial"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.marketTiming && (
            <AnalysisSection title="Ринковий таймінг" data={data.marketTiming as Record<string, unknown>} />
          )}
          {!!data.personalTrading && (
            <AnalysisSection title="Особиста торгівля" data={data.personalTrading as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.gannAnalysis && (
            <AnalysisSection title="Аналіз Ганна" data={data.gannAnalysis as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.bradleySiderograph && (
            <AnalysisSection title="Сайдерограф Бредлі" data={data.bradleySiderograph as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
