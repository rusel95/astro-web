'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import AIReportCard from '@/components/feature/AIReportCard';
import KeyValueGrid from '@/components/feature/KeyValueGrid';

function extractSafeData(obj: unknown): Record<string, unknown> | null {
  if (!obj || typeof obj !== 'object') return null;
  const r = obj as Record<string, unknown>;
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(r)) {
    if (['subject', 'subject_data', 'chart_data', 'directed_data', 'options'].includes(k)) continue;
    if (v != null) safe[k] = v;
  }
  return Object.keys(safe).length > 0 ? safe : null;
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
        const aiReport = data.aiReport as { title: string; summary: string; sections: Array<{ heading: string; text: string; rating?: number }>; recommendations: string[] } | null;
        const report = extractSafeData(data.directionReport);
        const directions = extractSafeData(data.directions);

        return (
          <div className="space-y-4">
            {aiReport && (
              <AIReportCard report={aiReport} />
            )}

            {!aiReport && report && (
              <SectionCard title="Звіт дирекцій">
                <ReportRenderer content={report} />
              </SectionCard>
            )}

            {directions && (
              <SectionCard title="Напрямлені позиції" defaultCollapsed>
                <KeyValueGrid data={directions} />
              </SectionCard>
            )}

            {/* Show raw SDK report as collapsible fallback when AI report is available */}
            {aiReport && report && (
              <SectionCard title="Сирі дані SDK" defaultCollapsed>
                <ReportRenderer content={report} />
              </SectionCard>
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
