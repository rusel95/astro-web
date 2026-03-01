'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SvgChartViewer from '@/components/feature/SvgChartViewer';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function TransitClient() {
  return (
    <FeaturePageLayout
      title="Транзитна карта"
      description="Поточні транзити відносно вашої натальної карти. Бі-колесо, аспекти та прогноз."
      apiEndpoint="/api/transit"
      formVariant="date-range"
    >
      {(data) => (
        <div className="space-y-6">
          {typeof data.transitChartSvg === 'string' && (
            <SvgChartViewer svgContent={data.transitChartSvg} title="Транзитне бі-колесо" />
          )}

          {!!data.transitReport && (
            <AnalysisSection title="Транзитний звіт" data={data.transitReport as Record<string, unknown>} />
          )}

          {!!data.natalTransitReport && (
            <AnalysisSection title="Натальні транзити" data={data.natalTransitReport as Record<string, unknown>} />
          )}

          {!!data.natalTransits && (
            <AnalysisSection title="Найближчі транзити (30 днів)" data={data.natalTransits as Record<string, unknown>} defaultCollapsed />
          )}

          {!!data.transitChart && (
            <AnalysisSection title="Дані транзитної карти" data={data.transitChart as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
