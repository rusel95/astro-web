import type { Metadata } from 'next';
import AnalysisPageClient from '@/components/feature/AnalysisPageClient';

export const metadata: Metadata = {
  title: 'Китайська сумісність | Зоря',
  description: 'Сумісність за китайською астрологією — знаки зодіаку, елементи та BaZi.',
};

// Note: Chinese compatibility requires two subjects — using basic form for now
// Full partner selection requires custom implementation
export default function ChineseCompatibilityPage() {
  return (
    <AnalysisPageClient
      analysisType="compatibility"
      title="Китайська сумісність"
      description="Сумісність за китайськими знаками зодіаку та елементами."
    />
  );
}
