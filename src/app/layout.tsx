import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import AuthNav from '@/components/AuthNav';
import PostHogProvider from '@/components/PostHogProvider';

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

async function getUser() {
  // Only attempt server-side user fetch if Supabase is configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="uk" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cosmic-900 text-text-primary antialiased font-sans">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/[0.07]" style={{ background: 'rgba(8,8,26,0.85)', backdropFilter: 'blur(20px) saturate(1.5)', WebkitBackdropFilter: 'blur(20px) saturate(1.5)' }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <img src="/logo-64.png" alt="Зоря" className="w-8 h-8 rounded-xl" />
              <span className="hidden sm:inline font-display text-xl font-semibold text-zorya-violet group-hover:text-zorya-gold transition-colors">Зоря</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/chart/new"
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-white text-sm font-semibold rounded-full transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
                  boxShadow: '0 2px 14px rgba(108, 60, 225, 0.35)',
                }}
              >
                <span>✦</span>
                <span className="hidden sm:inline">Розрахувати карту</span>
                <span className="sm:hidden text-xs">Карта</span>
              </a>
              <AuthNav user={user} />
            </div>
          </div>
        </nav>

        <PostHogProvider />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>

        {/* Footer */}
        <footer className="bg-cosmic-800 border-t border-white/[0.07] py-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <a href="/" className="inline-flex items-center gap-2 group">
              <span className="font-display text-2xl font-semibold text-zorya-violet group-hover:text-zorya-gold transition-colors">✦ Зоря</span>
            </a>
            <p className="text-text-muted text-sm mt-2">
              Натальна карта з AI-інтерпретацією
            </p>
            <div className="mt-5">
              <a
                href="/chart/new"
                className="inline-flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-full transition-all text-sm"
                style={{
                  background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
                  boxShadow: '0 3px 18px rgba(108, 60, 225, 0.38)',
                }}
              >
                ✦ Розрахувати карту безкоштовно
              </a>
            </div>
            <p className="text-text-muted text-xs mt-6 opacity-60">© 2026 Зоря. Всі права захищені.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
