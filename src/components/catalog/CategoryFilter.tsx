'use client';

import { PRODUCT_CATEGORIES } from '@/lib/products/types';

interface CategoryFilterProps {
  activeCategory: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeCategory === null
            ? 'bg-gradient-to-r from-zorya-purple to-zorya-violet text-white shadow-glow-sm'
            : 'bg-white/[0.07] text-text-secondary hover:bg-white/[0.12] hover:text-text-primary border border-white/10'
        }`}
      >
        Усі
      </button>
      {PRODUCT_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-zorya-purple to-zorya-violet text-white shadow-glow-sm'
              : 'bg-white/[0.07] text-text-secondary hover:bg-white/[0.12] hover:text-text-primary border border-white/10'
          }`}
        >
          {cat.name_uk}
        </button>
      ))}
    </div>
  );
}
