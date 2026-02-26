'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { PRODUCTS } from '@/lib/products/data';
import type { Product } from '@/lib/products/types';

interface PaywallSectionProps {
  quizCompleted: boolean;
}

// Show a curated selection of products for the paywall
const FEATURED_SLUGS = [
  'natal-chart-report',
  'love-compatibility',
  'year-forecast',
];

export default function PaywallSection({ quizCompleted }: PaywallSectionProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const featuredProducts = FEATURED_SLUGS
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== null);

  useEffect(() => {
    track(ANALYTICS_EVENTS.PAYWALL_VIEWED, { quiz_completed: quizCompleted });
  }, [quizCompleted]);

  const handleProductClick = useCallback((product: Product) => {
    track(ANALYTICS_EVENTS.PAYWALL_CTA_CLICKED, {
      product_slug: product.slug,
      product_name: product.name_uk,
      price: product.price_usd,
    });
    track(ANALYTICS_EVENTS.PLAN_SELECTED, {
      plan: product.slug,
    });

    if (!quizCompleted) {
      window.location.href = '/quiz';
      return;
    }

    setToastMessage('Ця функція скоро буде доступна!');
    setTimeout(() => setToastMessage(null), 3000);
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
          <motion.button
            key={product.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            onClick={() => handleProductClick(product)}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-zorya-violet/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{product.icon}</span>
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
                <span className="text-lg font-bold text-zorya-violet">
                  ${product.price_usd}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium z-50"
        >
          {toastMessage}
        </motion.div>
      )}
    </motion.div>
  );
}
