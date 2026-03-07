'use client';

import FeaturePageLayout from './FeaturePageLayout';
import SectionCard from './SectionCard';
import ReportRenderer from './ReportRenderer';

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
        <div className="space-y-4">
          {!!data.analysis && (
            <SectionCard title={title}>
              <ReportRenderer content={data.analysis} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
