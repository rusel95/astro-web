'use client';

import { usePathname } from 'next/navigation';

const PRODUCT_LINKS = [
  { href: '/horoscope/personality', label: 'Гороскоп особистості' },
  { href: '/horoscope/love', label: 'Любовний гороскоп' },
  { href: '/horoscope/2026', label: 'Гороскоп на 2026' },
  { href: '/horoscope/career', label: "Кар'єрний гороскоп" },
  { href: '/horoscope/health', label: "Звіт здоров'я" },
  { href: '/horoscope/finance', label: 'Фінансовий успіх' },
];

const PARTNER_LINKS = [
  { href: '/horoscope/love-compatibility', label: 'Сумісність кохання' },
  { href: '/horoscope/marriage', label: 'Коли я одружуся?' },
  { href: '/horoscope/children', label: 'Дитячий гороскоп' },
  { href: '/horoscope/conception', label: 'Календар зачаття' },
];

const COMPANY_LINKS = [
  { href: '/terms', label: 'Умови користування' },
  { href: '/privacy', label: 'Політика конфіденційності' },
];

const FREE_TOOL_LINKS = [
  { href: '/chart/new', label: 'Натальна карта' },
  { href: '/compatibility', label: 'Сумісність партнерів' },
  { href: '/moon', label: 'Місячний календар' },
  { href: '/quiz', label: 'Астро-тест' },
];

export default function NewFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/chart/new')) return null;

  return (
    <footer
      className="border-t border-white/[0.07] py-12"
      style={{ background: 'rgba(8,8,26,0.6)' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
          {/* Column 1: Products */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">
              Персональні сервіси
            </h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: For Partners */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">
              Для партнерів
            </h3>
            <ul className="space-y-2.5">
              {PARTNER_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Free Tools */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">
              Безкоштовно
            </h3>
            <ul className="space-y-2.5">
              {FREE_TOOL_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">
              Про компанію
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a href="mailto:ruslan.popesku@gmail.com" className="text-sm text-white/50 hover:text-white transition-colors">
                ruslan.popesku@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 pb-20 md:pb-0">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-lg font-semibold text-zorya-violet">✦ Зоря</span>
            <span className="text-xs text-white/25">Астрологічна платформа</span>
          </div>
          <p className="text-xs text-white/25">© 2026 Зоря. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}
