import type { Metadata } from 'next';
import BirthCardsClient from './BirthCardsClient';

export const metadata: Metadata = {
  title: 'Карти народження | Зоря',
  description: 'Ваша карта особистості та карта душі на основі дати народження. Таро-профіль за числологією.',
};

export default function TarotBirthCardsPage() {
  return <BirthCardsClient />;
}
