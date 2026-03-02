'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function WellnessClient() {
  return (
    <FeaturePageLayout
      title="Велнес-аналіз"
      description="Астрологічний аналіз здоров'я, біоритми, карта тіла та оптимальні часові вікна."
      apiEndpoint="/api/insights/wellness"
      formVariant="full"
    >
      {(data) => (
        <div className="space-y-6">
          {!!data.wellnessScore && (
            <AnalysisSection title="Велнес-рейтинг" data={data.wellnessScore as Record<string, unknown>} />
          )}
          {!!data.bodyMapping && (
            <AnalysisSection title="Карта тіла" data={data.bodyMapping as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.biorhythms && (
            <AnalysisSection title="Біоритми" data={data.biorhythms as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.energyPatterns && (
            <AnalysisSection title="Енергетичні патерни" data={data.energyPatterns as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.wellnessTiming && (
            <AnalysisSection title="Оптимальні часові вікна" data={data.wellnessTiming as Record<string, unknown>} defaultCollapsed />
          )}
          {!!data.moonWellness && (
            <AnalysisSection title="Місячний велнес" data={data.moonWellness as Record<string, unknown>} defaultCollapsed />
          )}
        </div>
      )}
    </FeaturePageLayout>
  );
}
