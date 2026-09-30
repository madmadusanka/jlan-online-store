export interface Product {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  categoryId?: number;
  categoryName: string;
  unitId?: number;
  unitName: string;
  supplierId?: number;
  supplierName: string;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPageConfig {
  slug: string;
  name: string;
  categoryId: number;
  logoUrl?: string;
  description?: string;
  accentColor?: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getStockStatus(quantity: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (quantity <= 0) return "out-of-stock";
  if (quantity <= 5) return "low-stock";
  return "in-stock";
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
