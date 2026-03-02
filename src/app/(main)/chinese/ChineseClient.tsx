'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';
import PartialErrorBanner from '@/components/feature/PartialErrorBanner';

export default function ChineseClient() {
  return (
    <FeaturePageLayout
      title="Китайська астрологія"
      description="BaZi (Чотири стовпи долі), вдалі напрямки (Мін Гуа) та стовпи удачі."
      apiEndpoint="/api/chinese/bazi"
      formVariant="full"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.partialErrors && (
            <PartialErrorBanner message="Деякі розділи не завантажилися. Спробуйте ще раз." />
          )}

          {!!data.bazi && (
            <AnalysisSection title="BaZi — Чотири стовпи долі" data={data.bazi as Record<string, unknown>} />
          )}

          {!!data.luckPillars && (
            <AnalysisSection title="Стовпи удачі (Da Yun)" data={data.luckPillars as Record<string, unknown>} defaultCollapsed />
          )}

          {!!data.mingGua && (
            <AnalysisSection title="Мін Гуа — Сприятливі напрямки" data={data.mingGua as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
