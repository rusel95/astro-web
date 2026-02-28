import type { Metadata } from 'next';
import SignHoroscopePage from '@/components/horoscope/SignHoroscopePage';

export const metadata: Metadata = {
  title: 'Тижневий гороскоп | Зоря',
  description: 'Тижневий гороскоп для всіх знаків зодіаку. Детальний прогноз на тиждень.',
};

export default function WeeklyHoroscopePage() {
  return (
    <SignHoroscopePage
      title="Тижневий гороскоп"
      description="Прогноз на тиждень для вашого знаку зодіаку"
      apiPath="/api/horoscope/weekly"
    />
  );
}
