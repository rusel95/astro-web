import type { Metadata } from 'next';
import GlossaryClient from './GlossaryClient';

export const metadata: Metadata = {
  title: 'Астрологічний глосарій | Зоря',
  description: 'Довідник астрологічних термінів: планети, будинки, стихії, аспекти та ключові поняття.',
};

export default function GlossaryPage() {
  return <GlossaryClient />;
}
