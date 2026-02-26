'use client';

import { useEffect } from 'react';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

interface Props {
  productSlug: string;
  productName: string;
}

export default function ProductPageTracker({ productSlug, productName }: Props) {
  useEffect(() => {
    track(ANALYTICS_EVENTS.PRODUCT_PAGE_VIEWED, {
      product_slug: productSlug,
      product_name: productName,
    });
  }, [productSlug, productName]);

  return null;
}
