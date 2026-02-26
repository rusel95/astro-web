import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Зоря — Персональна Астрологія | Натальна карта з AI',
  description:
    'Персональні гороскопи та астрологічні прогнози від Зоря. Натальна карта, місячний календар, сумісність та щоденні прогнози з AI-інтерпретацією.',
  openGraph: {
    title: 'Зоря — Персональна Астрологія',
    description:
      'Персональні гороскопи та астрологічні прогнози від Зоря. Натальна карта, місячний календар, сумісність та щоденні прогнози з AI-інтерпретацією.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
