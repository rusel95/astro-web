'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import ProductCard from '@/components/catalog/ProductCard';
import { PRODUCTS } from '@/lib/products/data';

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeCategory) return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-badge mb-4 inline-flex">
            <span className="text-zorya-gold">✦</span> Каталог
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Персональні гороскопи
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Оберіть гороскоп, який відповідає вашим потребам
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}
