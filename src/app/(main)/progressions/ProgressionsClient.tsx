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
    if (['subject', 'subject_data', 'chart_data', 'progressed_data', 'options'].includes(k)) continue;
    if (v != null) safe[k] = v;
  }
  return Object.keys(safe).length > 0 ? safe : null;
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
        const aiReport = data.aiReport as { title: string; summary: string; sections: Array<{ heading: string; text: string; rating?: number }>; recommendations: string[] } | null;
        const report = extractSafeData(data.progressionReport);
        const progressions = extractSafeData(data.progressions);

        return (
          <div className="space-y-4">
            {aiReport && (
              <AIReportCard report={aiReport} />
            )}

            {!aiReport && report && (
              <SectionCard title="Звіт прогресій">
                <ReportRenderer content={report} />
              </SectionCard>
            )}

            {progressions && (
              <SectionCard title="Прогресовані позиції" defaultCollapsed>
                <KeyValueGrid data={progressions} />
              </SectionCard>
            )}

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
