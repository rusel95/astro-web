'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Star, Moon, Heart, Plus, Menu, X, ChevronRight, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

interface Props {
  isLoggedIn: boolean;
}

const ITEMS = [
  { href: '/', label: 'Головна', Icon: Home, matchExact: true },
  { href: '/dashboard', label: 'Карти', Icon: Star, matchExact: false, requiresAuth: true },
  { href: '/moon', label: 'Місяць', Icon: Moon, matchExact: false },
  { href: '/compatibility', label: 'Сумісність', Icon: Heart, matchExact: false },
];

const MENU_SECTIONS = [
  {
    title: 'Прогнози',
    items: [
      { href: '/horoscope/daily', label: 'Щоденний гороскоп' },
      { href: '/horoscope/weekly', label: 'Тижневий гороскоп' },
      { href: '/horoscope/monthly', label: 'Місячний гороскоп' },
      { href: '/horoscope/yearly', label: 'Річний гороскоп' },
      { href: '/horoscope/chinese', label: 'Китайський гороскоп' },
    ],
  },
  {
    title: 'Особистість та кохання',
    items: [
      { href: '/horoscope/personality', label: 'Гороскоп особистості' },
      { href: '/horoscope/talent', label: 'Звіт талантів' },
      { href: '/horoscope/career', label: "Кар'єрний гороскоп" },
      { href: '/horoscope/health', label: "Звіт здоров'я" },
      { href: '/horoscope/finance', label: 'Фінансовий успіх' },
      { href: '/horoscope/love', label: 'Любовний гороскоп' },
      { href: '/horoscope/love-compatibility', label: 'Сумісність кохання' },
      { href: '/horoscope/marriage', label: 'Коли я одружуся?' },
      { href: '/horoscope/children', label: 'Дитячий гороскоп' },
    ],
  },
  {
    title: 'Карти та інструменти',
    items: [
      { href: '/chart/new', label: 'Натальна карта' },
      { href: '/ascendant', label: 'Калькулятор Асцендента' },
      { href: '/compatibility', label: 'Сумісність партнерів' },
      { href: '/composite', label: 'Композитна карта' },
      { href: '/relationship', label: 'Інсайти стосунків' },
      { href: '/transit', label: 'Транзитна карта' },
      { href: '/solar-return', label: 'Соляр' },
      { href: '/lunar-return', label: 'Лунар' },
      { href: '/analysis/predictive', label: 'Прогностика' },
      { href: '/moon', label: 'Місячний календар' },
      { href: '/zodiac/aries', label: 'Знаки зодіаку' },
      { href: '/explore', label: 'Дослідження API' },
      { href: '/quiz', label: 'Астро-тест' },
    ],
  },
];

export default function MobileNav({ isLoggedIn }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (pathname?.startsWith('/chart/new')) return null;

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Hamburger menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-[280px] overflow-y-auto"
              style={{
                background: 'rgba(15,10,30,0.98)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <span className="font-display text-lg font-semibold text-zorya-violet">✦ Зоря</span>
                <button onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Quiz CTA */}
              <div className="px-5 py-4">
                <a
                  href="/quiz"
                  onClick={() => {
                    track(ANALYTICS_EVENTS.NAV_ITEM_CLICKED, { item: 'quiz', source: 'mobile_menu' });
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full min-h-[44px] text-white text-sm font-semibold rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
                    boxShadow: '0 2px 14px rgba(108,60,225,0.35)',
                  }}
                >
                  <Sparkles size={16} />
                  Пройти тест
                </a>
              </div>

              {/* Search filter */}
              <div className="px-5 pb-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Пошук функцій..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder-white/30 focus:outline-none focus:border-zorya-violet/50"
                  />
                </div>
              </div>

              {/* Sections */}
              {MENU_SECTIONS.map(section => {
                const filteredItems = searchQuery
                  ? section.items.filter(item =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : section.items;
                if (filteredItems.length === 0) return null;
                return (
                  <div key={section.title} className="px-5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-medium mb-2">
                      {section.title}
                    </p>
                    <div className="space-y-0.5">
                      {filteredItems.map(item => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            track(ANALYTICS_EVENTS.NAV_ITEM_CLICKED, { item: item.label, source: 'mobile_menu' });
                            setMenuOpen(false);
                          }}
                          className="flex items-center justify-between min-h-[44px] py-2 text-sm text-white/60 hover:text-white transition-colors"
                        >
                          {item.label}
                          <ChevronRight size={14} className="text-white/20" />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Legal */}
              <div className="px-5 py-3 border-t border-white/[0.06]">
                <a href="/terms" className="block py-2 text-xs text-white/30 hover:text-white/50">Умови</a>
                <a href="/privacy" className="block py-2 text-xs text-white/30 hover:text-white/50">Конфіденційність</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
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
                className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px]"
                style={{ color: active ? '#9966E6' : 'rgba(255,255,255,0.45)' }}
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
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px]"
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

          {/* Hamburger menu button */}
          <button
            onClick={() => { setMenuOpen(true); setSearchQuery(''); }}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px]"
            style={{ color: menuOpen ? '#9966E6' : 'rgba(255,255,255,0.45)' }}
          >
            <Menu size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Меню</span>
          </button>
        </div>
      </nav>
    </>
  );
}
