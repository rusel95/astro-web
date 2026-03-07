'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';
import KeyValueGrid from '@/components/feature/KeyValueGrid';

export default function WellnessClient() {
  return (
    <FeaturePageLayout
      title="Велнес-аналіз"
      description="Астрологічний аналіз здоров'я, біоритми, карта тіла та оптимальні часові вікна."
      apiEndpoint="/api/insights/wellness"
      formVariant="full"
    >
      {(data) => (
        <div className="space-y-4">
          {!!data.wellnessScore && (
            <SectionCard title="Велнес-рейтинг">
              {typeof data.wellnessScore === 'object' && !Array.isArray(data.wellnessScore) ? (
                <KeyValueGrid data={data.wellnessScore as Record<string, unknown>} columns={2} />
              ) : (
                <ReportRenderer content={data.wellnessScore} />
              )}
            </SectionCard>
          )}

          {!!data.bodyMapping && (
            <SectionCard title="Карта тіла" defaultCollapsed>
              <ReportRenderer content={data.bodyMapping} />
            </SectionCard>
          )}

          {!!data.biorhythms && (
            <SectionCard title="Біоритми" defaultCollapsed>
              <ReportRenderer content={data.biorhythms} />
            </SectionCard>
          )}

          {!!data.energyPatterns && (
            <SectionCard title="Енергетичні патерни" defaultCollapsed>
              <ReportRenderer content={data.energyPatterns} />
            </SectionCard>
          )}

          {!!data.wellnessTiming && (
            <SectionCard title="Оптимальні часові вікна" defaultCollapsed>
              <ReportRenderer content={data.wellnessTiming} />
            </SectionCard>
          )}

          {!!data.moonWellness && (
            <SectionCard title="Місячний велнес" defaultCollapsed>
              <ReportRenderer content={data.moonWellness} />
            </SectionCard>
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
