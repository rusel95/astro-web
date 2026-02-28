import type { Metadata } from 'next';
import ProgressionsClient from './ProgressionsClient';

export const metadata: Metadata = {
  title: 'Вторинні прогресії | Зоря',
  description: 'Прогресовані позиції планет та звіт про поточний вплив вторинних прогресій на вашу натальну карту.',
};

export default function ProgressionsPage() {
  return <ProgressionsClient />;
}
