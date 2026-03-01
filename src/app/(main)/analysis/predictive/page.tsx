import type { Metadata } from 'next';
import PredictiveClient from './PredictiveClient';

export const metadata: Metadata = {
  title: 'Прогностичний аналіз | Зоря',
  description: 'Аналіз майбутніх тенденцій та ключових періодів на основі натальної карти.',
};

export default function PredictivePage() {
  return <PredictiveClient />;
}
