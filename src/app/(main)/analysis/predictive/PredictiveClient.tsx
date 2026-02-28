'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

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
            <AnalysisSection title="Прогностичний аналіз" data={data.predictive as Record<string, unknown>} />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
