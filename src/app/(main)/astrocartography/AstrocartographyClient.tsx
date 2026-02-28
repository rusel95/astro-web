'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';
import SvgChartViewer from '@/components/feature/SvgChartViewer';

export default function AstrocartographyClient() {
  return (
    <FeaturePageLayout
      title="Астрокартографія"
      description="Планетарні лінії на карті світу та зони сили. Знайдіть ваші кращі місця для проживання."
      apiEndpoint="/api/astrocartography/map"
      formVariant="basic"
    >
      {(data) => (
        <div className="space-y-6">
          {typeof data.mapData === 'string' && (
            <SvgChartViewer svgContent={data.mapData} title="Карта астрокартографії" />
          )}

          {!!data.powerZones && (
            <AnalysisSection title="Зони сили" data={data.powerZones as Record<string, unknown>} />
          )}

          {!!data.lines && (
            <AnalysisSection title="Планетарні лінії" data={data.lines as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
