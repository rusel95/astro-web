import type { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Бізнес-аналіз | Зоря',
  description: 'Астрологічний стиль лідерства, командна динаміка, бізнес-таймінг та сумісність при найманні.',
};

export default function BusinessPage() {
  return <BusinessClient />;
}
