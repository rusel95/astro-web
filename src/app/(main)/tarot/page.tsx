import type { Metadata } from 'next';
import TarotHubClient from './TarotHubClient';

export const metadata: Metadata = {
  title: 'Таро | Зоря',
  description: 'Карткові розклади таро: одна карта, три карти, Кельтський хрест, карти народження та астрологічне таро.',
};

export default function TarotPage() {
  return <TarotHubClient />;
}
