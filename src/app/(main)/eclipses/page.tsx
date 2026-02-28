import type { Metadata } from 'next';
import EclipsesClient from './EclipsesClient';

export const metadata: Metadata = {
  title: 'Затемнення | Зоря',
  description: 'Майбутні сонячні та місячні затемнення, цикли Сароса та їхній вплив на натальну карту.',
};

export default function EclipsesPage() {
  return <EclipsesClient />;
}
