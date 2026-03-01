'use client';

import FeaturePageLayout from './FeaturePageLayout';
import AnalysisSection from './AnalysisSection';

interface AnalysisPageClientProps {
  analysisType: string;
  title: string;
  description: string;
}

export default function AnalysisPageClient({
  analysisType,
  title,
  description,
}: AnalysisPageClientProps) {
  return (
    <FeaturePageLayout
      title={title}
      description={description}
      apiEndpoint={`/api/analysis/${analysisType}`}
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.analysis && (
            <AnalysisSection title={title} data={data.analysis as Record<string, unknown>} />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
