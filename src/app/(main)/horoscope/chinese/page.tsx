import type { Metadata } from 'next';
import FeaturePageLayout from '@/components/feature/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Китайський гороскоп | Зоря',
  description: 'Китайський гороскоп за датою народження. Дізнайтесь свою тварину та елемент.',
};

export default function ChineseHoroscopePage() {
  return (
    <FeaturePageLayout
      title="Китайський гороскоп"
      description="Дізнайтесь вашу тварину, елемент та прогноз за китайською астрологією"
      apiEndpoint="/api/horoscope/chinese"
      formVariant="basic"
    />
  );
}
