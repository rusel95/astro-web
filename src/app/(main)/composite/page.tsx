import type { Metadata } from 'next';
import CompositeClient from './CompositeClient';

export const metadata: Metadata = {
  title: 'Композитна карта | Зоря',
  description: 'Розрахунок композитної карти стосунків. Об\'єднана карта двох партнерів.',
};

export default function CompositePage() {
  return <CompositeClient />;
}
