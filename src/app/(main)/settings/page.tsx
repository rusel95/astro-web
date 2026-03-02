import type { Metadata } from 'next';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
  title: 'Налаштування | Зоря',
  description: 'Налаштування акаунта: конфіденційність та видалення профілю.',
};

export default function SettingsPage() {
  return <SettingsClient />;
}
