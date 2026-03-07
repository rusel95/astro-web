'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import DataTable from '@/components/feature/DataTable';
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
        <div className="space-y-4">
          {!!data.partialErrors && (
            <PartialErrorBanner message="Деякі розділи не завантажилися. Спробуйте ще раз." />
          )}

          {!!data.yearlyForecast && (
            <SectionCard title="Річний прогноз">
              <ReportRenderer content={data.yearlyForecast} />
            </SectionCard>
          )}

          {!!data.yearElements && (
            <SectionCard title="Аналіз елементів року" defaultCollapsed>
              <ReportRenderer content={data.yearElements} />
            </SectionCard>
          )}

          {!!data.solarTerms && (
            <SectionCard title="Сонячні терміни" defaultCollapsed>
              {Array.isArray(data.solarTerms) ? (
                <DataTable data={data.solarTerms} />
              ) : (
                <ReportRenderer content={data.solarTerms} />
              )}
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
