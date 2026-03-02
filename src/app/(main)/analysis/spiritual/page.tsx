import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Духовний аналіз | Зоря',
  description: 'Духовний потенціал, вищі планети та нептунічні теми натальної карти.',
};

export default function SpiritualAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="spiritual"
      title="Духовний аналіз"
      description="Духовний потенціал та вищі планети вашої натальної карти."
    />
  );
}
