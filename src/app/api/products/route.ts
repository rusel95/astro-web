import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, getProductsByCategory } from '@/lib/products/data';
import type { ProductCategory } from '@/lib/products/types';

const VALID_CATEGORIES: ProductCategory[] = ['purpose', 'love', 'children', 'health', 'future', 'money'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let products = PRODUCTS;

  if (category) {
    if (!VALID_CATEGORIES.includes(category as ProductCategory)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }
    products = getProductsByCategory(category);
  }

  // Sort by sort_order
  const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order);

  return NextResponse.json({ products: sorted });
}
