'use client';

import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/products/data';
import { track } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import ProductIcon from '@/components/icons/ProductIcon';

interface Props {
  userSign?: string | null;
}

// Recommend products based on zodiac-relevant categories
const SIGN_CATEGORIES: Record<string, string[]> = {
  Aries: ['purpose', 'money', 'future'],
  Taurus: ['money', 'love', 'health'],
  Gemini: ['purpose', 'future', 'love'],
  Cancer: ['children', 'love', 'health'],
  Leo: ['purpose', 'money', 'love'],
  Virgo: ['health', 'money', 'purpose'],
  Libra: ['love', 'purpose', 'future'],
  Scorpio: ['love', 'health', 'money'],
  Sagittarius: ['future', 'purpose', 'money'],
  Capricorn: ['money', 'purpose', 'future'],
  Aquarius: ['future', 'purpose', 'love'],
  Pisces: ['love', 'health', 'children'],
};

const DEFAULT_CATEGORIES = ['purpose', 'love', 'future'];

export default function RecommendedProducts({ userSign }: Props) {
  const recommended = useMemo(() => {
    const categories = userSign ? (SIGN_CATEGORIES[userSign] || DEFAULT_CATEGORIES) : DEFAULT_CATEGORIES;

    // Get one product from each priority category (up to 4)
    const picked: typeof PRODUCTS[number][] = [];
    const usedSlugs = new Set<string>();

    for (const cat of categories) {
      const product = PRODUCTS.find(p => p.category === cat && !usedSlugs.has(p.slug));
      if (product) {
        picked.push(product);
        usedSlugs.add(product.slug);
      }
      if (picked.length >= 4) break;
    }

    // Fill remaining slots if less than 3
    if (picked.length < 3) {
      for (const p of PRODUCTS) {
        if (!usedSlugs.has(p.slug)) {
          picked.push(p);
          usedSlugs.add(p.slug);
        }
        if (picked.length >= 3) break;
      }
    }

    return picked;
  }, [userSign]);

  if (recommended.length === 0) return null;

  return (
    <div>
      <h2 className="font-semibold text-white mb-3">Рекомендовано для вас</h2>
      <div className="space-y-2">
        {recommended.map(product => {
          return (
            <a
              key={product.slug}
              href={`/horoscope/${product.slug}`}
              onClick={() => {
                track(ANALYTICS_EVENTS.PRODUCT_CARD_CLICKED, {
                  product_slug: product.slug,
                  source: 'dashboard_recommended',
                });
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl transition-all hover:bg-white/5 group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(108,60,225,0.12)', border: '1px solid rgba(108,60,225,0.2)' }}
                >
                  <ProductIcon name={product.icon} size={18} className="text-zorya-violet" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors">
                    {product.name_uk}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{product.description_uk}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-medium text-zorya-gold">${product.price_usd}</span>
                <ChevronRight size={14} className="text-white/25 group-hover:text-white/50 transition-colors" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
