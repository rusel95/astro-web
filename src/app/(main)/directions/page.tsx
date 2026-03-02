import type { Metadata } from 'next';
import DirectionsClient from './DirectionsClient';

export const metadata: Metadata = {
  title: 'Дирекції | Зоря',
  description: 'Сонячні дуги та напрямлені позиції планет. Аналіз ключових переходів за методом solar arc directions.',
};

export default function DirectionsPage() {
  return <DirectionsClient />;
}
