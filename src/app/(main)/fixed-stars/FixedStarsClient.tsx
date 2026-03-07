'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import DataTable from '@/components/feature/DataTable';

export default function FixedStarsClient() {
  return (
    <FeaturePageLayout
      title="Фіксовані зірки"
      description="Натальні кон'юнкції з фіксованими зірками та їхній вплив на особистість і долю."
      apiEndpoint="/api/fixed-stars"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.conjunctions && (
            <SectionCard title="Кон'юнкції із зірками">
              {Array.isArray(data.conjunctions) ? (
                <DataTable data={data.conjunctions} />
              ) : (
                <ReportRenderer content={data.conjunctions} />
              )}
            </SectionCard>
          )}

          {!!data.report && (
            <SectionCard title="Звіт фіксованих зірок" defaultCollapsed>
              <ReportRenderer content={data.report} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
