import type { Metadata } from 'next';
import TarotSpreadClient from '@/components/feature/TarotSpreadClient';

export const metadata: Metadata = {
  title: 'Кельтський хрест | Зоря',
  description: 'Класичний розклад на 10 карт таро для глибокого аналізу ситуації.',
};

export default function TarotCelticCrossPage() {
  return (
    <TarotSpreadClient
      spreadType="celtic_cross"
      title="Кельтський хрест"
      description="Класичний 10-картний розклад для глибокого аналізу ситуації та її розвитку."
      drawLabel="Розкласти Кельтський хрест"
    />
  );
}
