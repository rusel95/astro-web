'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SvgChartViewer from '@/components/feature/SvgChartViewer';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import DataTable from '@/components/feature/DataTable';

export default function AstrocartographyClient() {
  return (
    <FeaturePageLayout
      title="Астрокартографія"
      description="Планетарні лінії на карті світу та зони сили. Знайдіть ваші кращі місця для проживання."
      apiEndpoint="/api/astrocartography/map"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-4">
          {typeof data.mapData === 'string' && (
            <SvgChartViewer svgContent={data.mapData} title="Карта астрокартографії" />
          )}

          {!!data.powerZones && (
            <SectionCard title="Зони сили">
              {Array.isArray(data.powerZones) ? (
                <DataTable data={data.powerZones} />
              ) : (
                <ReportRenderer content={data.powerZones} />
              )}
            </SectionCard>
          )}

          {!!data.lines && (
            <SectionCard title="Планетарні лінії" defaultCollapsed>
              {Array.isArray(data.lines) ? (
                <DataTable data={data.lines} />
              ) : (
                <ReportRenderer content={data.lines} />
              )}
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
