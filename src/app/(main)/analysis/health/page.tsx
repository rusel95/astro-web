import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: "Аналіз здоров'я | Зоря",
  description: "Вразливі зони та зони уваги на основі вашої натальної карти. 6-й дім та планетарні афліції.",
};

export default function HealthAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="health"
      title="Аналіз здоров'я"
      description="Вразливі зони та планетарні індикатори здоров'я на основі вашої натальної карти."
    />
  );
}
