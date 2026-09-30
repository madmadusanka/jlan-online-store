import { Product, Category } from "./types";

const API_BASE = "/api/pos";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchProductsByCategory(
  categoryId: number
): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter((p) => p.categoryId === categoryId && p.isActive);
}

export async function fetchProductById(
  id: number
): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id);
}
