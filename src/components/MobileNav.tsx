'use client';

import { usePathname } from 'next/navigation';
import { Home, Star, Moon, Heart, Plus } from 'lucide-react';

interface Props {
  isLoggedIn: boolean;
}

const ITEMS = [
  { href: '/', label: 'Головна', Icon: Home, matchExact: true },
  { href: '/dashboard', label: 'Карти', Icon: Star, matchExact: false, requiresAuth: true },
  { href: '/moon', label: 'Місяць', Icon: Moon, matchExact: false },
  { href: '/compatibility', label: 'Сумісність', Icon: Heart, matchExact: false },
];

export default function MobileNav({ isLoggedIn }: Props) {
  const pathname = usePathname();

  // Hide on chart creation wizard
  if (pathname?.startsWith('/chart/new')) return null;

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08]"
      style={{
        background: 'rgba(8,8,26,0.95)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Мобільна навігація"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map(({ href, label, Icon, matchExact, requiresAuth }) => {
          if (requiresAuth && !isLoggedIn) return null;
          const active = isActive(href, matchExact ?? false);

          return (
            <a
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px]"
              style={{
                color: active ? '#9966E6' : 'rgba(255,255,255,0.45)',
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2 : 1.5}
                style={{ color: active ? '#9966E6' : 'rgba(255,255,255,0.45)' }}
              />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </a>
          );
        })}

        {/* New Chart CTA */}
        <a
          href="/chart/new"
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px]"
          style={{ color: '#9966E6' }}
          aria-label="Нова карта"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
              boxShadow: '0 2px 12px rgba(108,60,225,0.5)',
            }}
          >
            <Plus size={18} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-[10px] font-medium leading-none text-white/60">Нова</span>
        </a>
      </div>
    </nav>
  );
}
