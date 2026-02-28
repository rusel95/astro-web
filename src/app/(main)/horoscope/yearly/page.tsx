import type { Metadata } from 'next';
import SignHoroscopePage from '@/components/horoscope/SignHoroscopePage';

export const metadata: Metadata = {
  title: 'Річний гороскоп | Зоря',
  description: 'Річний гороскоп для всіх знаків зодіаку. Детальний прогноз на рік.',
};

export default function YearlyHoroscopePage() {
  return (
    <SignHoroscopePage
      title="Річний гороскоп"
      description="Прогноз на рік для вашого знаку зодіаку"
      apiPath="/api/horoscope/yearly"
    />
  );
}
