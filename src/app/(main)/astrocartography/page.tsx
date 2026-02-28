import type { Metadata } from 'next';
import AstrocartographyClient from './AstrocartographyClient';

export const metadata: Metadata = {
  title: 'Астрокартографія | Зоря',
  description: 'Планетарні лінії на карті світу. Знайдіть найкращі місця для кар\'єри, любові та духовного розвитку.',
};

export default function AstrocartographyPage() {
  return <AstrocartographyClient />;
}
