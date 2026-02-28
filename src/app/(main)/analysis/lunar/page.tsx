import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Місячний аналіз | Зоря',
  description: 'Місячний характер, емоційні паттерни та інтуїція на основі натальної карти.',
};

export default function LunarAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="lunar"
      title="Місячний аналіз"
      description="Місячний характер, емоційна природа та інтуїція вашої натальної карти."
    />
  );
}
