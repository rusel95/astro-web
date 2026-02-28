'use client';

import FeaturePageLayout from './FeaturePageLayout';

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
      formVariant="full"
    />
  );
}
