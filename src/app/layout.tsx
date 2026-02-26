import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import PostHogProvider from '@/components/PostHogProvider';
import { CookieConsent } from '@/components/CookieConsent';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Зоря — Натальна карта з AI-інтерпретацією',
  description: 'Зоря — розрахунок натальної карти з AI-інтерпретацією у всіх сферах життя. Астрономічна точність та персоналізований аналіз.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cosmic-900 text-text-primary antialiased font-sans">
        <PostHogProvider />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
