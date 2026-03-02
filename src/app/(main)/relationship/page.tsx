import type { Metadata } from 'next';
import RelationshipClient from './RelationshipClient';

export const metadata: Metadata = {
  title: 'Інсайти стосунків | Зоря',
  description: 'Аналіз мов кохання, тривожних знаків та оптимального часу для стосунків на основі натальних карт.',
};

export default function RelationshipPage() {
  return <RelationshipClient />;
}
