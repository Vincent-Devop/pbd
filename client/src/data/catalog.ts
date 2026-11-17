import { sampleCategories, sampleProducts } from "@shared/sample-content";
import type { Product, ProductVariant } from "@shared/sample-content";

export type { Product, ProductVariant } from "@shared/sample-content";

export type CartLine = {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export const catalog: Product[] = sampleProducts;
export const categories: string[] = sampleCategories;

export function formatKes(amount: number) {
  return `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function uniqueColors(product: Product) {
  return product.variants.filter((variant, index, variants) => variants.findIndex((item) => item.color === variant.color) === index);
}
