import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: "Кар'єрний аналіз | Зоря",
  description: "Кар'єрне призначення, 10-й дім, MC та Сатурн. Глибокий аналіз вашого професійного потенціалу.",
};

export default function CareerAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="career"
      title="Кар'єрний аналіз"
      description="Кар'єрне призначення та професійний потенціал на основі вашої натальної карти."
    />
  );
}
