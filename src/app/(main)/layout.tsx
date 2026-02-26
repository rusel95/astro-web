import MobileNav from '@/components/MobileNav';
import DesktopNav from '@/components/navigation/DesktopNav';
import NewFooter from '@/components/navigation/NewFooter';
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
      <DesktopNav user={user} />

      <main className="min-h-[calc(100vh-56px)] pb-16 md:pb-0">{children}</main>

      <NewFooter />
      <Footer />
      <MobileNav isLoggedIn={!!user} />
    </>
  );
}
