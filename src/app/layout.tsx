import type { Metadata } from 'next';
import './globals.css';
import AuthNav from '@/components/AuthNav';
import PostHogProvider from '@/components/PostHogProvider';

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
    <html lang="uk">
      <body className="min-h-screen bg-cosmic-900 text-text-primary antialiased">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-cosmic-900/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-bold text-xl text-zorya-violet">
              <img src="/logo-64.png" alt="Зоря" className="w-8 h-8 rounded-lg" />
              <span className="hidden sm:inline">Зоря</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Full label on sm+, icon-only on xs */}
              <a
                href="/chart/new"
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2 bg-zorya-purple text-white text-sm font-semibold rounded-full hover:bg-zorya-violet transition-colors shadow-glow-sm"
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
        <footer className="bg-cosmic-800 border-t border-white/10 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <a href="/" className="text-zorya-violet font-bold text-lg">✦ Зоря</a>
            <p className="text-text-muted text-sm mt-2">
              Натальна карта з AI-інтерпретацією
            </p>
            <div className="mt-4">
              <a
                href="/chart/new"
                className="inline-block px-8 py-3 bg-zorya-purple text-white font-semibold rounded-full hover:bg-zorya-violet transition-colors shadow-glow-sm"
              >
                Розрахувати карту безкоштовно
              </a>
            </div>
            <p className="text-text-muted text-xs mt-6">© 2026 Зоря. Всі права захищені.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
