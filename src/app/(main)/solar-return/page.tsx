import type { Metadata } from 'next';
import SolarReturnClient from './SolarReturnClient';

export const metadata: Metadata = {
  title: 'Соляр (Solar Return) | Зоря',
  description: 'Соляр — карта повернення Сонця. Прогноз на рік за натальною картою.',
};

export default function SolarReturnPage() {
  return <SolarReturnClient />;
}
