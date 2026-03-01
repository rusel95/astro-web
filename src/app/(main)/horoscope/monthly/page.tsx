import type { Metadata } from 'next';
import SignHoroscopePage from '@/components/horoscope/SignHoroscopePage';

export const metadata: Metadata = {
  title: 'Місячний гороскоп | Зоря',
  description: 'Місячний гороскоп для всіх знаків зодіаку. Детальний прогноз на місяць.',
};

export default function MonthlyHoroscopePage() {
  return (
    <SignHoroscopePage
      title="Місячний гороскоп"
      description="Прогноз на місяць для вашого знаку зодіаку"
      apiPath="/api/horoscope/monthly"
    />
  );
}
