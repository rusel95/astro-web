'use client';

import { Sparkles, Moon, Heart, Calculator, CalendarDays } from 'lucide-react';
import DropdownMenu, { DropdownGroup } from './DropdownMenu';
import AuthNav from '@/components/AuthNav';
import { track } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

interface DesktopNavProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null;
}

const HOROSCOPE_GROUPS: DropdownGroup[] = [
  {
    title: 'Призначення',
    items: [
      { href: '/horoscope/personality', label: 'Гороскоп особистості', icon: '✨', description: 'Доля та призначення' },
      { href: '/horoscope/talent', label: 'Звіт талантів', icon: '💎', description: 'Приховані здібності' },
    ],
  },
  {
    title: 'Кохання',
    items: [
      { href: '/horoscope/love', label: 'Любовний гороскоп', icon: '❤️', description: 'Де ви зустрінете кохання' },
      { href: '/horoscope/love-compatibility', label: 'Сумісність кохання', icon: '💕', description: 'Синастрійний звіт' },
      { href: '/horoscope/marriage', label: 'Коли я одружуся?', icon: '💍', description: 'Прогноз шлюбу' },
    ],
  },
  {
    title: 'Майбутнє',
    items: [
      { href: '/horoscope/2026', label: 'Гороскоп на 2026', icon: '📅', description: 'Річний прогноз' },
      { href: '/horoscope/monthly', label: 'Прогноз на місяць', icon: '🗓', description: 'Детальний місячний' },
      { href: '/horoscope/3-years', label: 'Прогноз на 3 роки', icon: '🔭', description: 'Довгостроковий прогноз' },
    ],
  },
  {
    title: 'Ще',
    items: [
      { href: '/horoscope/health', label: "Звіт здоров'я", icon: '🏥', description: 'Вразливі зони' },
      { href: '/horoscope/career', label: "Кар'єрний гороскоп", icon: '💼', description: 'Кар\'єрне призначення' },
      { href: '/horoscope/finance', label: 'Фінансовий успіх', icon: '💰', description: 'Фінансове становище' },
      { href: '/horoscope/children', label: 'Дитячий гороскоп', icon: '👶', description: 'Для батьків' },
    ],
  },
];

const FREE_TOOLS_GROUPS: DropdownGroup[] = [
  {
    title: 'Безкоштовні інструменти',
    items: [
      { href: '/chart/new', label: 'Натальна карта', icon: '🌟', description: 'Розрахунок з AI-інтерпретацією' },
      { href: '/compatibility', label: 'Сумісність партнерів', icon: '💞', description: 'Синастрія двох карт' },
      { href: '/moon', label: 'Місячний календар', icon: '🌙', description: 'Фази та void periods' },
    ],
  },
  {
    title: 'Зодіак',
    items: [
      { href: '/zodiac/aries', label: 'Знаки зодіаку', icon: '♈', description: 'Характеристики 12 знаків' },
      { href: '/quiz', label: 'Астро-тест', icon: '🧪', description: 'Дізнайтесь своє призначення' },
    ],
  },
];

export default function DesktopNav({ user }: DesktopNavProps) {
  return (
    <nav
      aria-label="Головна навігація"
      className="sticky top-0 z-50 border-b border-white/[0.07]"
      style={{
        background: 'rgba(8,8,26,0.85)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <img src="/logo-64.png" alt="Зоря" className="w-8 h-8 rounded-xl" />
          <span className="hidden sm:inline font-display text-xl font-semibold text-zorya-violet group-hover:text-zorya-gold transition-colors">
            Зоря
          </span>
        </a>

        {/* Center navigation — desktop only */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="/horoscope/2026"
            onClick={() => track(ANALYTICS_EVENTS.NAV_ITEM_CLICKED, { item: '2026' })}
            className="px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
          >
            2026
          </a>

          <DropdownMenu
            label="Гороскопи"
            groups={HOROSCOPE_GROUPS}
            icon={<Sparkles size={14} className="text-zorya-violet" />}
          />

          <DropdownMenu
            label="Безкоштовно"
            groups={FREE_TOOLS_GROUPS}
            icon={<CalendarDays size={14} className="text-green-400" />}
          />

          {user && (
            <a
              href="/dashboard"
              onClick={() => track(ANALYTICS_EVENTS.NAV_ITEM_CLICKED, { item: 'dashboard' })}
              className="px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
            >
              Мій кабінет
            </a>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <a
            href="/quiz"
            className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-white text-sm font-semibold rounded-full transition-all"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
              boxShadow: '0 2px 14px rgba(108, 60, 225, 0.35)',
            }}
          >
            <span>✦</span>
            <span className="hidden sm:inline">Пройти тест</span>
            <span className="sm:hidden text-xs">Тест</span>
          </a>
          <AuthNav user={user} />
        </div>
      </div>
    </nav>
  );
}
