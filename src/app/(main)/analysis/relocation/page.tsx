import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Аналіз релокації | Зоря',
  description: 'Астрологічний аналіз релокації — найкращі місця для переїзду та розвитку.',
};

export default function RelocationAnalysisPage() {
  return (
    <AnalysisPageClient
      analysisType="relocation"
      title="Аналіз релокації"
      description="Астрологічний аналіз найкращих місць для переїзду та особистого розвитку."
    />
  );
}
