'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
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

export default function SolarReturnClient() {
  return (
    <FeaturePageLayout
      title="Соляр (Solar Return)"
      description="Карта повернення Сонця у натальну позицію. Вкажіть рік для розрахунку."
      apiEndpoint="/api/solar-return"
      formVariant="date-range"
    >
      {(data) => {
        const report = extractSafeData(data.solarReturnReport);
        const transits = data.solarReturnTransits;
        const chart = extractSafeData(data.solarReturnChart);
        const transitArr = Array.isArray(transits) ? transits : null;

        return (
          <div className="space-y-4">
            {report && (
              <SectionCard title="Звіт соляру">
                <ReportRenderer content={report} />
              </SectionCard>
            )}

            {transitArr && transitArr.length > 0 && (
              <SectionCard title="Транзити соляру">
                <DataTable data={transitArr} />
              </SectionCard>
            )}

            {!transitArr && transits && typeof transits === 'object' ? (
              <SectionCard title="Транзити соляру">
                <ReportRenderer content={transits as Record<string, unknown>} />
              </SectionCard>
            ) : null}

            {chart && (
              <SectionCard title="Дані карти соляру" defaultCollapsed>
                <KeyValueGrid data={chart} />
              </SectionCard>
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
