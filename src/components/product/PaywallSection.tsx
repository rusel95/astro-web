'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { PRODUCTS } from '@/lib/products/data';
import type { Product } from '@/lib/products/types';
import ProductIcon from '@/components/icons/ProductIcon';

interface PaywallSectionProps {
  quizCompleted: boolean;
}

// Show a curated selection of products for the paywall
const FEATURED_SLUGS = [
  'personality',
  'love-compatibility',
  '2026',
];

export default function PaywallSection({ quizCompleted }: PaywallSectionProps) {
  const featuredProducts = FEATURED_SLUGS
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is Product => p != null);

  useEffect(() => {
    track(ANALYTICS_EVENTS.PAYWALL_VIEWED, { quiz_completed: quizCompleted });
  }, [quizCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
          Відкрийте повний потенціал вашої карти
        </h3>
        <p className="text-gray-500 text-sm">
          Оберіть персональний аналіз, який вам підходить
        </p>
      </div>

      <div className="space-y-4">
        {featuredProducts.map((product, i) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Link
              href={`/horoscope/${product.slug}`}
              onClick={() => {
                track(ANALYTICS_EVENTS.PAYWALL_CTA_CLICKED, {
                  product_slug: product.slug,
                  product_name: product.name_uk,
                  price: product.price_usd,
                });
              }}
              className="block w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-zorya-violet/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ProductIcon name={product.icon} size={22} className="text-zorya-violet" />
                    <h4 className="font-semibold text-gray-900 group-hover:text-zorya-violet transition-colors">
                      {product.name_uk}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.description_uk}
                  </p>
                  <ul className="text-xs text-gray-400 space-y-0.5">
                    {product.value_props_uk.slice(0, 2).map((prop, j) => (
                      <li key={j}>• {prop}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-semibold text-zorya-violet">
                    Безкоштовно
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
