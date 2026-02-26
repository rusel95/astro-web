export type ProductCategory = 'purpose' | 'love' | 'children' | 'health' | 'future' | 'money';

export interface Product {
  slug: string;
  name_uk: string;
  category: ProductCategory;
  description_uk: string;
  value_props_uk: string[];
  price_usd: number;
  icon: string;
  sort_order: number;
}

export interface ProductCategoryInfo {
  id: ProductCategory;
  name_uk: string;
  icon: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryInfo[] = [
  { id: 'purpose', name_uk: 'Призначення', icon: 'sparkles' },
  { id: 'love', name_uk: 'Кохання', icon: 'heart' },
  { id: 'children', name_uk: 'Діти', icon: 'baby' },
  { id: 'health', name_uk: "Здоров'я", icon: 'activity' },
  { id: 'future', name_uk: 'Майбутнє', icon: 'telescope' },
  { id: 'money', name_uk: 'Гроші', icon: 'coins' },
];

export const CATEGORY_NAMES_UK: Record<ProductCategory, string> = {
  purpose: 'Призначення',
  love: 'Кохання',
  children: 'Діти',
  health: "Здоров'я",
  future: 'Майбутнє',
  money: 'Гроші',
};
