import type { Metadata } from 'next';
import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'Астрологічний тест | Пройти тест — Зоря',
  description:
    'Пройдіть безкоштовний астрологічний тест та дізнайтеся свій персональний гороскоп. За 2 хвилини отримайте міні-інтерпретацію натальної карти.',
  openGraph: {
    title: 'Астрологічний тест | Зоря',
    description:
      'Пройдіть безкоштовний астрологічний тест та дізнайтеся свій персональний гороскоп. За 2 хвилини отримайте міні-інтерпретацію натальної карти.',
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
