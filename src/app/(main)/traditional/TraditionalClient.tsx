'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import DataTable from '@/components/feature/DataTable';

export default function TraditionalClient() {
  return (
    <FeaturePageLayout
      title="Традиційна астрологія"
      description="Гідності планет, арабські частки та традиційна техніка аналізу карти."
      apiEndpoint="/api/traditional/analysis"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.analysis && (
            <SectionCard title="Традиційний аналіз">
              <ReportRenderer content={data.analysis} />
            </SectionCard>
          )}

          {!!data.dignitiesAnalysis && (
            <SectionCard title="Гідності планет" defaultCollapsed>
              {Array.isArray(data.dignitiesAnalysis) ? (
                <DataTable data={data.dignitiesAnalysis} />
              ) : (
                <ReportRenderer content={data.dignitiesAnalysis} />
              )}
            </SectionCard>
          )}

          {!!data.lotsAnalysis && (
            <SectionCard title="Арабські частки" defaultCollapsed>
              {Array.isArray(data.lotsAnalysis) ? (
                <DataTable data={data.lotsAnalysis} />
              ) : (
                <ReportRenderer content={data.lotsAnalysis} />
              )}
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
