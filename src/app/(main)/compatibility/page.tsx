import type { Metadata } from 'next';
import CompatibilityClient from './CompatibilityClient';

export const metadata: Metadata = {
  title: 'Перевірити сумісність | Синастрія — Зоря',
  description:
    'Безкоштовна перевірка астрологічної сумісності за натальними картами. Дізнайтеся рівень гармонії з партнером.',
  openGraph: {
    title: 'Перевірити сумісність | Зоря',
    description:
      'Безкоштовна перевірка астрологічної сумісності за натальними картами. Дізнайтеся рівень гармонії з партнером.',
  },
};

export default function CompatibilityPage() {
  return <CompatibilityClient />;
}
