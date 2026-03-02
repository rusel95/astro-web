import type { Metadata } from 'next';
import LunarReturnClient from './LunarReturnClient';

export const metadata: Metadata = {
  title: 'Лунар (Lunar Return) | Зоря',
  description: 'Лунар — карта повернення Місяця. Місячний цикл та емоційні теми.',
};

export default function LunarReturnPage() {
  return <LunarReturnClient />;
}
