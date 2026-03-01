import type { Metadata } from 'next';
import WellnessClient from './WellnessClient';

export const metadata: Metadata = {
  title: 'Велнес-аналіз | Зоря',
  description: 'Астрологічний аналіз здоров\'я: біоритми, карта тіла, енергетичні патерни та оптимальний час для відновлення.',
};

export default function WellnessPage() {
  return <WellnessClient />;
}
