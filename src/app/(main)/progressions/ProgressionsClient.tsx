'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
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
        const report = extractSafeData(data.progressionReport);
        const progressions = extractSafeData(data.progressions);

        return (
          <div className="space-y-4">
            {report && (
              <SectionCard title="Звіт прогресій">
                <ReportRenderer content={report} />
              </SectionCard>
            )}

            {progressions && (
              <SectionCard title="Прогресовані позиції" defaultCollapsed>
                <KeyValueGrid data={progressions} />
              </SectionCard>
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
