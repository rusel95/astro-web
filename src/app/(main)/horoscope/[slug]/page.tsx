import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products/data';
import { CATEGORY_NAMES_UK } from '@/lib/products/types';
import ProductPageTemplate from '@/components/product/ProductPageTemplate';
import ProductPageTracker from './tracker';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Продукт не знайдено' };

  const categoryName = CATEGORY_NAMES_UK[product.category];
  return {
    title: `${product.name_uk} — Зоря`,
    description: `${product.description_uk}. ${product.value_props_uk[0]}. Персоналізований астрологічний аналіз онлайн.`,
    openGraph: {
      title: `${product.name_uk} — Зоря`,
      description: product.description_uk,
      type: 'website',
    },
    keywords: [
      product.name_uk,
      categoryName,
      'гороскоп онлайн',
      'натальна карта',
      'астрологія',
    ],
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductPageTracker productSlug={product.slug} productName={product.name_uk} />
      <ProductPageTemplate product={product} />
    </>
  );
}
