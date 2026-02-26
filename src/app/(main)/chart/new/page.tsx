import type { Metadata } from 'next';
import ChartNewClient from './ChartNewClient';

export const metadata: Metadata = {
  title: 'Нова натальна карта | Зоря',
  description:
    'Розрахуйте безкоштовну натальну карту з AI-інтерпретацією. Введіть дату, час та місце народження.',
  openGraph: {
    title: 'Натальна карта | Зоря',
    description:
      'Розрахуйте безкоштовну натальну карту з AI-інтерпретацією. Введіть дату, час та місце народження.',
  },
};

export default function NewChartPage() {
  return <ChartNewClient />;
}
