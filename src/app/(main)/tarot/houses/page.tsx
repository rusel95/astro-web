import type { Metadata } from 'next';
import TarotSpreadClient from '@/components/feature/TarotSpreadClient';

export const metadata: Metadata = {
  title: 'Гороскопний розклад таро | Зоря',
  description: '12 карт таро для 12 астрологічних домів. Повна картина всіх сфер вашого життя.',
};

export default function TarotHousesPage() {
  return (
    <TarotSpreadClient
      spreadType="houses"
      title="Гороскопний розклад"
      description="12 карт для 12 сфер вашого життя. Астрологічний підхід до таро."
      drawLabel="Розкласти 12 домів"
    />
  );
}
