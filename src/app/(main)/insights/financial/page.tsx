import type { Metadata } from 'next';
import FinancialClient from './FinancialClient';

export const metadata: Metadata = {
  title: 'Фінансові інсайти | Зоря',
  description: 'Астрологічний ринковий таймінг, аналіз Ганна, сайдерограф Бредлі та особиста торгівельна стратегія.',
};

export default function FinancialPage() {
  return <FinancialClient />;
}
