import type { Metadata } from 'next';
import FixedStarsClient from './FixedStarsClient';

export const metadata: Metadata = {
  title: 'Фіксовані зірки | Зоря',
  description: 'Кон\'юнкції натальних планет з фіксованими зірками. Їхній вплив на особистість і долю.',
};

export default function FixedStarsPage() {
  return <FixedStarsClient />;
}
