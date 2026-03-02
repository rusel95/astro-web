'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';
import PartialErrorBanner from '@/components/feature/PartialErrorBanner';

export default function ChineseForecastClient() {
  return (
    <FeaturePageLayout
      title="Китайський прогноз"
      description="Річний прогноз за китайською астрологією, аналіз елементів та сонячні терміни."
      apiEndpoint="/api/chinese/forecast"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.partialErrors && (
            <PartialErrorBanner message="Деякі розділи не завантажилися. Спробуйте ще раз." />
          )}

          {!!data.yearlyForecast && (
            <AnalysisSection title="Річний прогноз" data={data.yearlyForecast as Record<string, unknown>} />
          )}

          {!!data.yearElements && (
            <AnalysisSection title="Аналіз елементів року" data={data.yearElements as Record<string, unknown>} defaultCollapsed />
          )}

          {!!data.solarTerms && (
            <AnalysisSection title="Сонячні терміни" data={data.solarTerms as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
