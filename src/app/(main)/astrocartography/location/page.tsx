import type { Metadata } from 'next';
import LocationClient from './LocationClient';

export const metadata: Metadata = {
  title: 'Аналіз локації | Зоря',
  description: 'Астрологічний аналіз міста чи країни. Дізнайтесь, яку астрологічну енергію несе конкретне місце.',
};

export default function AstrocartographyLocationPage() {
  return <LocationClient />;
}
