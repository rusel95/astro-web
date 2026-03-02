import type { Metadata } from 'next';
import TarotSpreadClient from '@/components/feature/TarotSpreadClient';

export const metadata: Metadata = {
  title: 'Дерево Сефіротів | Зоря',
  description: 'Каббалістичний розклад таро на Дерево Життя. 10 сефірот — 10 карт.',
};

export default function TarotTreeOfLifePage() {
  return (
    <TarotSpreadClient
      spreadType="tree_of_life"
      title="Дерево Сефіротів"
      description="Каббалістичний розклад таро: 10 карт для 10 сфер буття."
      drawLabel="Розкласти Дерево Сефіротів"
    />
  );
}
