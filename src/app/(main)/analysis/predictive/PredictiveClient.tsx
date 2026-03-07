'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

export default function PredictiveClient() {
  return (
    <FeaturePageLayout
      title="Прогностичний аналіз"
      description="Ключові тенденції та періоди на основі вашої натальної карти."
      apiEndpoint="/api/analysis/predictive"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.predictive && (
            <SectionCard title="Прогностичний аналіз">
              <ReportRenderer content={data.predictive} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
