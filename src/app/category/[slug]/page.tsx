"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product, Category, slugify } from "@/lib/types";
import CategoryHero from "@/components/CategoryHero";
import ProductGrid from "@/components/ProductGrid";
import styles from "./page.module.css";

// Map category slugs to custom logo URLs — add entries here when logos are uploaded
const categoryLogos: Record<string, string> = {
  // "agro": "/logos/agro-logo.png",
  // "heavy-equipment": "/logos/heavy-equipment-logo.png",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/pos/products"),
          fetch("/api/pos/categories"),
        ]);
        const prods: Product[] = await prodRes.json();
        const cats: Category[] = await catRes.json();
        setAllProducts(prods.filter((p) => p.isActive));
        setCategories(cats.filter((c) => c.isActive));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Find the matching category by slug
  const category = categories.find((c) => slugify(c.name) === slug);

  // Get products for this category
  const categoryProducts = allProducts.filter(
    (p) => category && p.categoryName === category.name
  );

  const inStockCount = categoryProducts.filter(
    (p) => p.stockQuantity > 0
  ).length;

  // Apply search and sort
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case "stock-desc":
        result.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      case "stock-asc":
        result.sort((a, b) => a.stockQuantity - b.stockQuantity);
        break;
    }

    return result;
  }, [categoryProducts, searchQuery, sortBy]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "60vh", color: "var(--color-text-muted)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "3px solid var(--color-border)",
            borderTop: "3px solid var(--color-primary)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          <p>Loading category...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={styles.notFound}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.3">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <h2 className={styles.notFoundTitle}>Category Not Found</h2>
        <p className={styles.notFoundText}>
          The category &ldquo;{slug}&rdquo; does not exist.
        </p>
        <Link href="/categories" className={styles.notFoundLink}>
          Browse All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page} id="category-page">
      <CategoryHero
        title={category.name}
        description={category.description || undefined}
        logoUrl={categoryLogos[slug]}
        productCount={categoryProducts.length}
        inStockCount={inStockCount}
      />

      <div className={styles.pageInner}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="category-search-input"
            />
          </div>

          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="category-sort-select"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-desc">Stock: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
          </select>
        </div>

        <p className={styles.resultCount}>
          Showing {filteredProducts.length} of {categoryProducts.length} products
        </p>

        <ProductGrid
          products={filteredProducts}
          emptyMessage={`No products found in ${category.name}`}
        />
      </div>
    </div>
  );
}
