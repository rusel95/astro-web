import type { Metadata } from 'next';
import ProfectionsClient from './ProfectionsClient';

export const metadata: Metadata = {
  title: 'Профекції | Зоря',
  description: 'Річні профекції та хазяїн року. Класична астрологічна техніка тимелордів.',
};

export default function ProfectionsPage() {
  return <ProfectionsClient />;
}
