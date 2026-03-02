import type { Metadata } from 'next';
import TransitTarotClient from './TransitTarotClient';

export const metadata: Metadata = {
  title: 'Транзитне таро | Зоря',
  description: 'Поєднання астрологічних транзитів та карт таро. Прогноз на основі натальної карти та таро.',
};

export default function TarotTransitPage() {
  return <TransitTarotClient />;
}
