"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Category, slugify } from "@/lib/types";
import styles from "./page.module.css";

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getCategoryStats = (catName: string) => {
    const catProducts = products.filter((p) => p.categoryName === catName);
    return {
      total: catProducts.length,
      inStock: catProducts.filter((p) => p.stockQuantity > 0).length,
    };
  };

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
            <p>Loading categories...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} id="categories-page">
      <div className={styles.pageInner}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>All Categories</h1>
          <p className={styles.pageSubtitle}>
            Browse our product categories — each with its own dedicated page
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => {
            const stats = getCategoryStats(cat.name);
            return (
              <Link
                key={cat.id}
                href={`/category/${slugify(cat.name)}`}
                className={styles.card}
                id={`category-listing-${cat.id}`}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <h2 className={styles.cardTitle}>{cat.name}</h2>
                </div>

                <p className={styles.cardDescription}>
                  {cat.description || `Browse all products in the ${cat.name} category.`}
                </p>

                <div className={styles.cardStats}>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{stats.total}</span>
                    <span className={styles.cardStatLabel}>Products</span>
                  </div>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{stats.inStock}</span>
                    <span className={styles.cardStatLabel}>In Stock</span>
                  </div>
                </div>

                <div className={styles.cardArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
