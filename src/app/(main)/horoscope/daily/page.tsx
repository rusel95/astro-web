import type { Metadata } from 'next';
import SignHoroscopePage from '@/components/horoscope/SignHoroscopePage';

export const metadata: Metadata = {
  title: 'Щоденний гороскоп | Зоря',
  description: 'Щоденний гороскоп для всіх знаків зодіаку. Кохання, кар\'єра, здоров\'я та загальний прогноз на сьогодні.',
};

export default function DailyHoroscopePage() {
  return (
    <SignHoroscopePage
      title="Щоденний гороскоп"
      description="Прогноз на сьогодні для вашого знаку зодіаку"
      apiPath="/api/horoscope/daily"
    />
  );
}
