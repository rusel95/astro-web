import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Покликання | Зоря',
  description: 'Вокаційний аналіз та справжнє покликання на основі натальної карти.',
};

export default function VocationalAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="vocational"
      title="Аналіз покликання"
      description="Справжнє покликання та вокаційний потенціал на основі вашої натальної карти."
    />
  );
}
