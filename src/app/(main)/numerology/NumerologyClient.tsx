'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import KeyValueGrid from '@/components/feature/KeyValueGrid';

export default function NumerologyClient() {
  return (
    <FeaturePageLayout
      title="Нумерологія"
      description="Ключові числа вашої долі: число душі, особистості, долі та зрілості."
      apiEndpoint="/api/numerology"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.coreNumbers && (
            <SectionCard title="Ключові числа">
              {typeof data.coreNumbers === 'object' && !Array.isArray(data.coreNumbers) ? (
                <KeyValueGrid data={data.coreNumbers as Record<string, unknown>} columns={2} />
              ) : (
                <ReportRenderer content={data.coreNumbers} />
              )}
            </SectionCard>
          )}

          {!!data.comprehensiveReport && (
            <SectionCard title="Комплексний звіт" defaultCollapsed>
              <ReportRenderer content={data.comprehensiveReport} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
