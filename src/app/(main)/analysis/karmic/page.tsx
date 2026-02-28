import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Кармічний аналіз | Зоря',
  description: 'Кармічні уроки, вузли Місяця та минуле життя. Аналіз кармічних паттернів натальної карти.',
};

export default function KarmicAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="karmic"
      title="Кармічний аналіз"
      description="Кармічні уроки та вузли Місяця. Глибинні паттерни вашої душі."
    />
  );
}
