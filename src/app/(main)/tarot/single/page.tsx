import type { Metadata } from 'next';
import TarotSpreadClient from '@/components/feature/TarotSpreadClient';

export const metadata: Metadata = {
  title: 'Одна карта таро | Зоря',
  description: 'Витягніть одну карту таро для відповіді на ваше запитання.',
};

export default function TarotSinglePage() {
  return (
    <TarotSpreadClient
      spreadType="single"
      title="Одна карта"
      description="Витягніть одну карту для відповіді на ваше запитання."
      drawLabel="Витягнути карту"
    />
  );
}
