import type { Metadata } from 'next';
import TraditionalClient from './TraditionalClient';

export const metadata: Metadata = {
  title: 'Традиційна астрологія | Зоря',
  description: 'Гідності планет, арабські частки та традиційна техніка аналізу натальної карти.',
};

export default function TraditionalPage() {
  return <TraditionalClient />;
}
