'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import ProductIcon from '@/components/icons/ProductIcon';
import type { Product } from '@/lib/products/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        href={`/horoscope/${product.slug}`}
        onClick={() =>
          track(ANALYTICS_EVENTS.PRODUCT_CARD_CLICKED, {
            product_slug: product.slug,
            product_name: product.name_uk,
          })
        }
        className="glass-card block p-5 h-full"
      >
        <div className="flex items-start gap-3 mb-3">
          <ProductIcon name={product.icon} size={24} className="text-zorya-violet shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">
              {product.name_uk}
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {product.description_uk}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.07]">
          <span className="text-zorya-gold font-bold">${product.price_usd}</span>
          <span className="text-xs text-zorya-violet font-medium">
            Детальніше →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
