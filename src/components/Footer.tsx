'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on onboarding/chart creation pages
  if (pathname?.startsWith('/chart/new')) {
    return null;
  }

  return (
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
  );
}
