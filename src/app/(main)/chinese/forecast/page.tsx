import type { Metadata } from 'next';
import ChineseForecastClient from './ChineseForecastClient';

export const metadata: Metadata = {
  title: 'Китайський прогноз | Зоря',
  description: 'Річний прогноз за китайською астрологією, баланс елементів та сонячні терміни.',
};

export default function ChineseForecastPage() {
  return <ChineseForecastClient />;
}
