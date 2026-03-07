'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import KeyValueGrid from '@/components/feature/KeyValueGrid';
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
        <div className="space-y-4">
          {!!data.partialErrors && (
            <PartialErrorBanner message="Деякі розділи не завантажилися. Спробуйте ще раз." />
          )}

          {!!data.bazi && (
            <SectionCard title="BaZi — Чотири стовпи долі">
              {typeof data.bazi === 'object' && !Array.isArray(data.bazi) ? (
                <>
                  <KeyValueGrid data={data.bazi as Record<string, unknown>} columns={2} />
                  <ReportRenderer content={data.bazi} className="mt-3" />
                </>
              ) : (
                <ReportRenderer content={data.bazi} />
              )}
            </SectionCard>
          )}

          {!!data.luckPillars && (
            <SectionCard title="Стовпи удачі (Da Yun)" defaultCollapsed>
              <ReportRenderer content={data.luckPillars} />
            </SectionCard>
          )}

          {!!data.mingGua && (
            <SectionCard title="Мін Гуа — Сприятливі напрямки" defaultCollapsed>
              {typeof data.mingGua === 'object' && !Array.isArray(data.mingGua) ? (
                <KeyValueGrid data={data.mingGua as Record<string, unknown>} />
              ) : (
                <ReportRenderer content={data.mingGua} />
              )}
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
