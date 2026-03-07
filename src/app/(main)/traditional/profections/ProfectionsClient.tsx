'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import KeyValueGrid from '@/components/feature/KeyValueGrid';
import DataTable from '@/components/feature/DataTable';

export default function ProfectionsClient() {
  return (
    <FeaturePageLayout
      title="Профекції"
      description="Річні профекції та хазяїн року. Класична техніка тимелордів."
      apiEndpoint="/api/traditional/profections"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.annualProfection && (
            <SectionCard title="Поточна профекція">
              {typeof data.annualProfection === 'object' && !Array.isArray(data.annualProfection) ? (
                <KeyValueGrid data={data.annualProfection as Record<string, unknown>} columns={2} />
              ) : (
                <ReportRenderer content={data.annualProfection} />
              )}
            </SectionCard>
          )}

          {!!data.profectionsAnalysis && (
            <SectionCard title="Аналіз профекцій" defaultCollapsed>
              <ReportRenderer content={data.profectionsAnalysis} />
            </SectionCard>
          )}

          {!!data.profectionTimeline && (
            <SectionCard title="Хронологія профекцій (0–90 років)" defaultCollapsed>
              {Array.isArray(data.profectionTimeline) ? (
                <DataTable data={data.profectionTimeline} maxRows={20} />
              ) : (
                <ReportRenderer content={data.profectionTimeline} />
              )}
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
