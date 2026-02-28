'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductValueProps from './ProductValueProps';
import ProductForm from './ProductForm';
import ProductIcon from '@/components/icons/ProductIcon';
import type { Product } from '@/lib/products/types';
import { CATEGORY_NAMES_UK } from '@/lib/products/types';
import { getProductsByCategory, PRODUCTS } from '@/lib/products/data';

interface ProductPageTemplateProps {
  product: Product;
}

// Get 2-3 cross-sell products from related categories
function getCrossSellProducts(product: Product): Product[] {
  const RELATED_CATEGORIES: Record<string, string[]> = {
    purpose: ['money', 'future'],
    love: ['children', 'purpose'],
    children: ['love', 'health'],
    health: ['future', 'purpose'],
    future: ['money', 'purpose'],
    money: ['purpose', 'future'],
  };

  const related = RELATED_CATEGORIES[product.category] || [];
  const sameCategory = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug);
  const relatedProducts = related
    .flatMap((cat) => getProductsByCategory(cat))
    .filter((p) => p.slug !== product.slug);

  return [...sameCategory, ...relatedProducts].slice(0, 3);
}

export default function ProductPageTemplate({ product }: ProductPageTemplateProps) {
  const crossSell = getCrossSellProducts(product);
  const categoryName = CATEGORY_NAMES_UK[product.category];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          Головна
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{categoryName}</span>
        <span>/</span>
        <span className="text-text-primary">{product.name_uk}</span>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-4 flex justify-center"><ProductIcon name={product.icon} size={48} className="text-zorya-violet" /></div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
          {product.name_uk}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {product.description_uk}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zorya-violet/10 text-zorya-violet font-semibold">
          Безкоштовно
        </div>
      </motion.div>

      {/* Value Propositions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
          Що ви дізнаєтесь
        </h2>
        <ProductValueProps valueProps={product.value_props_uk} icon={product.icon} />
      </motion.section>

      {/* Divider */}
      <div className="border-t border-white/[0.08]" />

      {/* Birth Data Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProductForm productSlug={product.slug} />
      </motion.section>

      {/* SEO Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 md:p-8"
      >
        <h2 className="text-lg font-display font-semibold text-text-primary mb-3">
          {product.name_uk} онлайн
        </h2>
        <div className="text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            {product.name_uk} — це персоналізований астрологічний аналіз, створений
            на основі точних астрономічних даних NASA та вашої натальної карти.
            Кожен звіт враховує унікальне розташування планет у момент вашого народження.
          </p>
          <p>
            Наші професійні астрологи з понад 10-річним досвідом ретельно інтерпретують
            кожен аспект вашої карти, щоб надати вам глибокий та практичний аналіз.
            {product.category === 'love' && ' Дізнайтесь більше про ваші стосунки та сумісність.'}
            {product.category === 'money' && ' Розкрийте свій фінансовий потенціал та кар\'єрні можливості.'}
            {product.category === 'health' && ' Зрозумійте вразливі зони вашого здоров\'я та отримайте рекомендації.'}
            {product.category === 'future' && ' Дізнайтесь, що чекає на вас попереду.'}
            {product.category === 'children' && ' Отримайте астрологічні поради щодо планування сім\'ї.'}
            {product.category === 'purpose' && ' Зрозумійте своє справжнє призначення та потенціал.'}
          </p>
        </div>
      </motion.section>

      {/* Cross-sell */}
      {crossSell.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            Вам також може сподобатись
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {crossSell.map((p) => (
              <Link
                key={p.slug}
                href={`/horoscope/${p.slug}`}
                className="glass-card p-5 hover:border-zorya-violet/30 transition-all group"
              >
                <span className="mb-2 block"><ProductIcon name={p.icon} size={28} className="text-zorya-violet" /></span>
                <h3 className="font-semibold text-text-primary group-hover:text-zorya-violet transition-colors text-sm">
                  {p.name_uk}
                </h3>
                <p className="text-text-muted text-xs mt-1">{p.description_uk}</p>
                <span className="text-zorya-violet font-semibold text-sm mt-2 block">
                  Безкоштовно
                </span>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
