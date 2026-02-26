import { Metadata } from 'next';
import DailyHoroscopeClient from './DailyHoroscopeClient';

export const metadata: Metadata = {
  title: 'Гороскоп на сьогодні | Щоденний прогноз | Зоря',
  description: 'Безкоштовний щоденний гороскоп на сьогодні — кохання, кар\'єра, здоров\'я. Персональний прогноз для вашого знаку зодіаку.',
  openGraph: {
    title: 'Гороскоп на сьогодні | Зоря',
    description: 'Безкоштовний щоденний гороскоп — дізнайтеся, що зірки приготували для вас сьогодні.',
  },
};

export default function DailyHoroscopePage() {
  return <DailyHoroscopeClient />;
}
