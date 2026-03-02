import type { Metadata } from 'next';
import TarotSpreadClient from '@/components/feature/TarotSpreadClient';

export const metadata: Metadata = {
  title: 'Синастрійне таро | Зоря',
  description: 'Розклад таро для пари. Карткове читання для двох людей та їх стосунків.',
};

export default function TarotSynastryPage() {
  return (
    <TarotSpreadClient
      spreadType="synastry"
      title="Синастрійне таро"
      description="Розклад таро для пари. Карти відображають динаміку ваших стосунків."
      drawLabel="Витягнути карти для пари"
    />
  );
}
