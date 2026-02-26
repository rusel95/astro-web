import AuthNav from '@/components/AuthNav';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

async function getUser() {
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

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <>
      {/* Navigation */}
      <nav aria-label="Головна навігація" className="sticky top-0 z-50 border-b border-white/[0.07]" style={{ background: 'rgba(8,8,26,0.85)', backdropFilter: 'blur(20px) saturate(1.5)', WebkitBackdropFilter: 'blur(20px) saturate(1.5)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo-64.png" alt="Зоря" className="w-8 h-8 rounded-xl" />
            <span className="hidden sm:inline font-display text-xl font-semibold text-zorya-violet group-hover:text-zorya-gold transition-colors">Зоря</span>
          </a>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {user && (
              <a
                href="/dashboard"
                aria-label="Мій кабінет"
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
              >
                <span>⭐</span>
                <span>Мої карти</span>
              </a>
            )}
            <a
              href="/moon"
              aria-label="Місячний календар"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
            >
              <span>🌙</span>
              <span>Місяць</span>
            </a>
            <a
              href="/compatibility"
              aria-label="Сумісність"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
            >
              <span>💞</span>
              <span>Сумісність</span>
            </a>
            <a
              href="/chart/new"
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-white text-sm font-semibold rounded-full transition-all"
              style={{
                background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
                boxShadow: '0 2px 14px rgba(108, 60, 225, 0.35)',
              }}
            >
              <span>✦</span>
              <span className="hidden sm:inline">Нова карта</span>
              <span className="sm:hidden text-xs">Карта</span>
            </a>
            <AuthNav user={user} />
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-56px)] pb-16 md:pb-0">{children}</main>

      <Footer />
      <MobileNav isLoggedIn={!!user} />
    </>
  );
}
