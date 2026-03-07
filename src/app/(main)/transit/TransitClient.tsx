'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SvgChartViewer from '@/components/feature/SvgChartViewer';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import DataTable from '@/components/feature/DataTable';
import KeyValueGrid from '@/components/feature/KeyValueGrid';

function extractSafeData(obj: unknown): Record<string, unknown> | null {
  if (!obj || typeof obj !== 'object') return null;
  const r = obj as Record<string, unknown>;
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(r)) {
    if (['subject', 'subject_data', 'chart_data', 'options'].includes(k)) continue;
    if (v != null) safe[k] = v;
  }
  return Object.keys(safe).length > 0 ? safe : null;
}

export default function TransitClient() {
  return (
    <FeaturePageLayout
      title="Транзитна карта"
      description="Поточні транзити відносно вашої натальної карти. Бі-колесо, аспекти та прогноз."
      apiEndpoint="/api/transit"
      formVariant="date-range"
    >
      {(data) => {
        const transitReport = extractSafeData(data.transitReport);
        const natalTransitReport = extractSafeData(data.natalTransitReport);
        const natalTransits = data.natalTransits;
        const transitChart = extractSafeData(data.transitChart);
        const transitsArr = Array.isArray(natalTransits) ? natalTransits : null;

        return (
          <div className="space-y-4">
            {typeof data.transitChartSvg === 'string' && (
              <SvgChartViewer svgContent={data.transitChartSvg} title="Транзитне бі-колесо" />
            )}

            {transitReport && (
              <SectionCard title="Транзитний звіт">
                <ReportRenderer content={transitReport} />
              </SectionCard>
            )}

            {natalTransitReport && (
              <SectionCard title="Натальні транзити">
                <ReportRenderer content={natalTransitReport} />
              </SectionCard>
            )}

            {transitsArr && transitsArr.length > 0 && (
              <SectionCard title="Найближчі транзити (30 днів)" defaultCollapsed>
                <DataTable data={transitsArr} />
              </SectionCard>
            )}

            {!transitsArr && natalTransits && typeof natalTransits === 'object' ? (
              <SectionCard title="Найближчі транзити (30 днів)" defaultCollapsed>
                <ReportRenderer content={natalTransits as Record<string, unknown>} />
              </SectionCard>
            ) : null}

            {transitChart && (
              <SectionCard title="Дані транзитної карти" defaultCollapsed>
                <KeyValueGrid data={transitChart} />
              </SectionCard>
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
