'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

// Extract only display-safe fields from the SDK report response.
// subject_data, directed_data, chart_data are internal SDK fields that can
// contain unknown/complex structures — rendering them causes React crashes.
function extractReportDisplay(report: unknown): Record<string, unknown> | null {
  if (!report || typeof report !== 'object') return null;
  const r = report as Record<string, unknown>;
  const display: Record<string, unknown> = {};
  if (r.interpretations) display.interpretations = r.interpretations;
  if (r.direction_type) display.direction_type = r.direction_type;
  if (typeof r.arc_used === 'number') display.arc_used = r.arc_used;
  if (r.target_date) display.target_date = r.target_date;
  return Object.keys(display).length > 0 ? display : null;
}

export default function DirectionsClient() {
  return (
    <FeaturePageLayout
      title="Сонячні дуги (дирекції)"
      description="Напрямлені позиції планет методом сонячної дуги. Аналіз ключових переходів та зрілості."
      apiEndpoint="/api/directions"
      formVariant="date-range"
    >
      {(data) => {
        const reportDisplay = extractReportDisplay(data.directionReport);
        return (
          <div className="space-y-6">
            {reportDisplay && (
              <AnalysisSection title="Звіт дирекцій" data={reportDisplay} />
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
