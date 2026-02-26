import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Увійти | Зоря',
  description:
    'Увійдіть в особистий кабінет Зоря для доступу до ваших натальних карт та персональних гороскопів.',
};

export default function LoginPage() {
  return <LoginClient />;
}
