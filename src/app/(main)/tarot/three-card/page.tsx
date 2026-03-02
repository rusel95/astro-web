import type { Metadata } from 'next';
import TarotSpreadClient from '@/components/feature/TarotSpreadClient';

export const metadata: Metadata = {
  title: 'Три карти таро | Зоря',
  description: 'Розклад на три карти: минуле, теперішнє, майбутнє.',
};

export default function TarotThreeCardPage() {
  return (
    <TarotSpreadClient
      spreadType="three_card"
      title="Три карти"
      description="Минуле · Теперішнє · Майбутнє. Розклад для розуміння динаміки ситуації."
      drawLabel="Витягнути три карти"
    />
  );
}
