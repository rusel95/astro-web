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

export default function LunarReturnClient() {
  return (
    <FeaturePageLayout
      title="Лунар (Lunar Return)"
      description="Карта повернення Місяця. Емоційні теми та настрій місячного циклу."
      apiEndpoint="/api/lunar-return"
      formVariant="basic"
    >
      {(data) => {
        const report = extractSafeData(data.lunarReturnReport);
        const transits = data.lunarReturnTransits;
        const chart = extractSafeData(data.lunarReturnChart);
        const transitArr = Array.isArray(transits) ? transits : null;

        return (
          <div className="space-y-4">
            {report && (
              <SectionCard title="Звіт лунару">
                <ReportRenderer content={report} />
              </SectionCard>
            )}

            {transitArr && transitArr.length > 0 && (
              <SectionCard title="Транзити лунару">
                <DataTable data={transitArr} />
              </SectionCard>
            )}

            {!transitArr && transits && typeof transits === 'object' ? (
              <SectionCard title="Транзити лунару">
                <ReportRenderer content={transits as Record<string, unknown>} />
              </SectionCard>
            ) : null}

            {chart && (
              <SectionCard title="Дані карти лунару" defaultCollapsed>
                <KeyValueGrid data={chart} />
              </SectionCard>
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
