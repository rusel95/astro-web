'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

// Extract only display-safe fields from the SDK report response.
// subject_data, progressed_data, chart_data are internal SDK fields that can
// contain unknown/complex structures — rendering them causes React crashes.
function extractReportDisplay(report: unknown): Record<string, unknown> | null {
  if (!report || typeof report !== 'object') return null;
  const r = report as Record<string, unknown>;
  const display: Record<string, unknown> = {};
  // Guard: interpretations may come as non-array from API — normalize to prevent .map() crash
  if (r.interpretations) {
    display.interpretations = Array.isArray(r.interpretations)
      ? r.interpretations
      : typeof r.interpretations === 'object'
        ? r.interpretations
        : String(r.interpretations);
  }
  if (r.progression_type) display.progression_type = r.progression_type;
  if (r.target_date) display.target_date = r.target_date;
  return Object.keys(display).length > 0 ? display : null;
}

export default function ProgressionsClient() {
  return (
    <FeaturePageLayout
      title="Вторинні прогресії"
      description="Прогресовані позиції планет та їх вплив на ваш розвиток. Символічний рух карти в часі."
      apiEndpoint="/api/progressions"
      formVariant="date-range"
    >
      {(data) => {
        const reportDisplay = extractReportDisplay(data.progressionReport);
        return (
          <div className="space-y-6">
            {reportDisplay && (
              <AnalysisSection title="Звіт прогресій" data={reportDisplay} />
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
