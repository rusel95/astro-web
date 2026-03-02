import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

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

export default async function HomePage() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        redirect('/dashboard');
      }
    }
  } catch (e) {
    // redirect() throws a special Next.js error — re-throw it
    if (e && typeof e === 'object' && 'digest' in e) throw e;
    // Auth check failed — show landing page
  }

  return <HomeClient />;
}
