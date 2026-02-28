'use client';

import { Sparkles, Moon, Calculator } from 'lucide-react';
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
    title: 'Прогнози',
    items: [
      { href: '/horoscope/daily', label: 'Щоденний гороскоп', icon: 'sun', description: 'Прогноз на сьогодні за знаком' },
      { href: '/horoscope/weekly', label: 'Тижневий гороскоп', icon: 'calendar', description: 'Прогноз на тиждень' },
      { href: '/horoscope/monthly', label: 'Місячний гороскоп', icon: 'calendar-days', description: 'Детальний місячний' },
      { href: '/horoscope/yearly', label: 'Річний гороскоп', icon: 'calendar-range', description: 'Прогноз на рік' },
      { href: '/horoscope/chinese', label: 'Китайський гороскоп', icon: 'sparkles', description: 'Тварина та елемент' },
    ],
  },
  {
    title: 'Особистість',
    items: [
      { href: '/horoscope/personality', label: 'Гороскоп особистості', icon: 'sparkles', description: 'Доля та призначення' },
      { href: '/horoscope/talent', label: 'Звіт талантів', icon: 'gem', description: 'Приховані здібності' },
      { href: '/horoscope/career', label: "Кар'єрний гороскоп", icon: 'briefcase', description: 'Кар\'єрне призначення' },
      { href: '/horoscope/health', label: "Звіт здоров'я", icon: 'activity', description: 'Вразливі зони' },
      { href: '/horoscope/finance', label: 'Фінансовий успіх', icon: 'coins', description: 'Фінансове становище' },
    ],
  },
  {
    title: 'Кохання',
    items: [
      { href: '/horoscope/love', label: 'Любовний гороскоп', icon: 'heart', description: 'Де ви зустрінете кохання' },
      { href: '/horoscope/love-compatibility', label: 'Сумісність кохання', icon: 'heart-handshake', description: 'Синастрійний звіт' },
      { href: '/horoscope/marriage', label: 'Коли я одружуся?', icon: 'ring', description: 'Прогноз шлюбу' },
      { href: '/horoscope/children', label: 'Дитячий гороскоп', icon: 'baby', description: 'Для батьків' },
    ],
  },
];

const CHARTS_GROUPS: DropdownGroup[] = [
  {
    title: 'Карти',
    items: [
      { href: '/chart/new', label: 'Натальна карта', icon: 'star', description: 'Розрахунок з AI-інтерпретацією' },
      { href: '/ascendant', label: 'Калькулятор Асцендента', icon: 'compass', description: 'Висхідний знак та Велика Трійка' },
      { href: '/compatibility', label: 'Сумісність партнерів', icon: 'users', description: 'Синастрія двох карт' },
      { href: '/composite', label: 'Композитна карта', icon: 'heart-handshake', description: 'Об\'єднана карта стосунків' },
      { href: '/relationship', label: 'Інсайти стосунків', icon: 'heart', description: 'Мови кохання та тривожні знаки' },
    ],
  },
  {
    title: 'Прогнози & інструменти',
    items: [
      { href: '/transit', label: 'Транзитна карта', icon: 'activity', description: 'Поточні транзити та бі-колесо' },
      { href: '/solar-return', label: 'Соляр', icon: 'sun', description: 'Річний прогноз (Solar Return)' },
      { href: '/lunar-return', label: 'Лунар', icon: 'moon', description: 'Місячний цикл (Lunar Return)' },
      { href: '/analysis/predictive', label: 'Прогностика', icon: 'trending-up', description: 'Ключові тенденції та періоди' },
      { href: '/progressions', label: 'Прогресії', icon: 'git-branch', description: 'Вторинні прогресії карти' },
      { href: '/directions', label: 'Дирекції', icon: 'navigation', description: 'Сонячні дуги та дирекції' },
      { href: '/moon', label: 'Місячний календар', icon: 'calendar', description: 'Фази та Місяць без курсу' },
      { href: '/zodiac/aries', label: 'Знаки зодіаку', icon: 'sparkles', description: 'Характеристики 12 знаків' },
      { href: '/explore', label: 'Дослідження API', icon: 'flask', description: 'Розширені астрологічні інструменти' },
    ],
  },
  {
    title: 'Аналізи',
    items: [
      { href: '/analysis/career', label: "Кар'єрний аналіз", icon: 'briefcase', description: 'Кар\'єрне призначення' },
      { href: '/analysis/health', label: "Аналіз здоров'я", icon: 'activity', description: 'Вразливі зони' },
      { href: '/analysis/karmic', label: 'Кармічний аналіз', icon: 'infinity', description: 'Кармічні уроки та вузли' },
      { href: '/analysis/psychological', label: 'Психологічний', icon: 'brain', description: 'Психологічний профіль' },
      { href: '/analysis/spiritual', label: 'Духовний аналіз', icon: 'sparkles', description: 'Духовний потенціал' },
      { href: '/analysis/vocational', label: 'Покликання', icon: 'star', description: 'Справжнє покликання' },
      { href: '/analysis/lunar', label: 'Місячний аналіз', icon: 'moon', description: 'Місячна природа та емоції' },
      { href: '/analysis/relocation', label: 'Аналіз релокації', icon: 'map-pin', description: 'Найкращі місця для переїзду' },
    ],
  },
  {
    title: 'Таро',
    items: [
      { href: '/tarot', label: 'Таро: головна', icon: 'sparkles', description: 'Щоденна карта та всі розклади' },
      { href: '/tarot/single', label: 'Одна карта', icon: 'star', description: 'Відповідь на одне запитання' },
      { href: '/tarot/three-card', label: 'Три карти', description: 'Минуле · Теперішнє · Майбутнє', icon: 'layers' },
      { href: '/tarot/celtic-cross', label: 'Кельтський хрест', icon: 'cross', description: '10 карт · Глибокий аналіз' },
      { href: '/tarot/birth-cards', label: 'Карти народження', icon: 'star', description: 'Карта особистості та душі' },
    ],
  },
  {
    title: 'Китайська астрологія',
    items: [
      { href: '/chinese', label: 'BaZi (Чотири стовпи)', icon: 'sparkles', description: 'Класична китайська астрологія' },
      { href: '/chinese/forecast', label: 'Китайський прогноз', icon: 'calendar', description: 'Річний прогноз та елементи' },
      { href: '/chinese/compatibility', label: 'Китайська сумісність', icon: 'users', description: 'Сумісність за знаком та елементом' },
    ],
  },
  {
    title: 'Традиційна астрологія',
    items: [
      { href: '/traditional', label: 'Традиційний аналіз', icon: 'star', description: 'Гідності, арабські частки, секта' },
      { href: '/traditional/profections', label: 'Профекції', icon: 'calendar', description: 'Річні тимелорди (0–90 років)' },
    ],
  },
  {
    title: 'Астрокартографія',
    items: [
      { href: '/astrocartography', label: 'Карта ліній', icon: 'map', description: 'Планетарні лінії на карті світу' },
      { href: '/astrocartography/location', label: 'Аналіз локації', icon: 'map-pin', description: 'Астро-аналіз конкретного міста' },
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
          <DropdownMenu
            label="Гороскопи"
            groups={HOROSCOPE_GROUPS}
            icon={<Sparkles size={14} className="text-zorya-violet" />}
          />

          <DropdownMenu
            label="Карти"
            groups={CHARTS_GROUPS}
            icon={<Calculator size={14} className="text-green-400" />}
          />

          <a
            href="/moon"
            onClick={() => track(ANALYTICS_EVENTS.NAV_ITEM_CLICKED, { item: 'moon' })}
            className="px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
          >
            <span className="flex items-center gap-1.5">
              <Moon size={14} className="text-zorya-gold" />
              Місяць
            </span>
          </a>

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
