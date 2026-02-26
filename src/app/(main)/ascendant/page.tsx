import { Metadata } from 'next';
import AscendantClient from './AscendantClient';

export const metadata: Metadata = {
  title: 'Розрахувати Асцендент | Калькулятор Асцендента | Зоря',
  description: 'Безкоштовний калькулятор асцендента: дізнайтеся свій висхідний знак, Велику Трійку (Сонце, Місяць, Асцендент) та як вас бачить світ.',
  openGraph: {
    title: 'Розрахувати Асцендент | Зоря',
    description: 'Безкоштовний калькулятор асцендента — дізнайтеся свій висхідний знак за датою, часом та місцем народження.',
  },
};

export default function AscendantPage() {
  return <AscendantClient />;
}
