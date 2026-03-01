import type { Metadata } from 'next';
import TransitClient from './TransitClient';

export const metadata: Metadata = {
  title: 'Транзитна карта | Зоря',
  description: 'Транзитна карта з бі-колесом, поточні транзити та прогноз на найближчий місяць.',
};

export default function TransitPage() {
  return <TransitClient />;
}
