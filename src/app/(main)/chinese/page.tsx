import type { Metadata } from 'next';
import ChineseClient from './ChineseClient';

export const metadata: Metadata = {
  title: 'Китайська астрологія | Зоря',
  description: 'BaZi (Чотири стовпи долі), стовпи удачі та Мін Гуа. Класична китайська астрологія.',
};

export default function ChinesePage() {
  return <ChineseClient />;
}
