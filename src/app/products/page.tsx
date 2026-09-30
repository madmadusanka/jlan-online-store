"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import styles from "./page.module.css";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/pos/products"),
          fetch("/api/pos/categories"),
        ]);
        const prods: Product[] = await prodRes.json();
        const cats: Category[] = await catRes.json();
        setProducts(prods.filter((p) => p.isActive));
        setCategories(cats.filter((c) => c.isActive));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryName === selectedCategory);
    }

    // Sort
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
  }, [products, searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageInner} style={{ 
          display: "flex", alignItems: "center", justifyContent: "center", 
          minHeight: "50vh", color: "var(--color-text-muted)" 
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid var(--color-border)",
              borderTop: "3px solid var(--color-primary)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            <p>Loading products...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} id="products-page">
      <div className={styles.pageInner}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>All Products</h1>
          <p className={styles.pageSubtitle}>
            Browse our complete product catalog with real-time stock information
          </p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="product-search-input"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="product-sort-select"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
            </select>
          </div>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${selectedCategory === "all" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("all")}
            id="filter-all"
          >
            All ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.categoryName === cat.name
            ).length;
            return (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${selectedCategory === cat.name ? styles.active : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
                id={`filter-cat-${cat.id}`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <p className={styles.resultCount}>
          Showing {filteredProducts.length} of {products.length} products
        </p>

        <ProductGrid
          products={filteredProducts}
          emptyMessage="No products match your search"
        />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <div className={styles.pageInner} style={{ 
          display: "flex", alignItems: "center", justifyContent: "center", 
          minHeight: "50vh", color: "var(--color-text-muted)" 
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid var(--color-border)",
              borderTop: "3px solid var(--color-primary)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            <p>Loading...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
