import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Психологічний аналіз | Зоря',
  description: 'Психологічний профіль, особистісні риси та глибинні мотивації на основі натальної карти.',
};

export default function PsychologicalAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="psychological"
      title="Психологічний аналіз"
      description="Психологічний профіль та глибинні мотивації на основі вашої натальної карти."
    />
  );
}
