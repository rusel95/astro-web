import type { Metadata } from 'next';
import NumerologyClient from './NumerologyClient';

export const metadata: Metadata = {
  title: 'Нумерологія | Зоря',
  description: 'Числа долі, особистості та душі. Нумерологічний аналіз на основі дати народження та імені.',
};

export default function NumerologyPage() {
  return <NumerologyClient />;
}
