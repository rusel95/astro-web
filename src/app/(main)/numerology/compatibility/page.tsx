import type { Metadata } from 'next';
import NumerologyCompatibilityClient from './NumerologyCompatibilityClient';

export const metadata: Metadata = {
  title: 'Нумерологічна сумісність | Зоря',
  description: 'Числова сумісність двох людей на основі імені та дати народження.',
};

export default function NumerologyCompatibilityPage() {
  return <NumerologyCompatibilityClient />;
}
