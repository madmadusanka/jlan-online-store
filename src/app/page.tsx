"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Category, slugify } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import styles from "./page.module.css";

export default function HomePage() {
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

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stockQuantity > 0).length;
  const totalCategories = categories.length;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= 5
  ).length;

  const getCategoryProductCount = (catName: string) =>
    products.filter((p) => p.categoryName === catName).length;

  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "60vh",
        color: "var(--color-text-muted)"
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
    );
  }

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Real-time Stock Updates
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Browse Our</span>
              <span className={styles.heroTitleAccent}>Product Catalog</span>
            </h1>
            <p className={styles.heroDescription}>
              Explore our complete range of products with real-time stock
              availability. Browse by category, search for specific items, and
              view detailed product information.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className={styles.heroBtnPrimary} id="hero-browse-btn">
                Browse All Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link href="/categories" className={styles.heroBtnSecondary} id="hero-categories-btn">
                View Categories
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img
              src="/logos/jlan-main.png"
              alt="JLAN"
              className={styles.heroLogoFloat}
            />
            <div className={styles.heroGlow} />
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <span className={styles.statValue}>{totalProducts}</span>
              <span className={styles.statLabel}>Total Products</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className={styles.statValue}>{inStockProducts}</span>
              <span className={styles.statLabel}>In Stock</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className={styles.statValue}>{totalCategories}</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className={styles.statValue}>{lowStockProducts}</span>
              <span className={styles.statLabel}>Low Stock</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Shop by Category</h2>
              <p className={styles.sectionSubtitle}>
                Browse products organized by category
              </p>
            </div>
            <Link href="/categories" className={styles.sectionLink}>
              View all categories
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${slugify(cat.name)}`}
                className={styles.categoryCard}
                id={`category-card-${cat.id}`}
              >
                <div className={styles.categoryIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryCount}>
                  {getCategoryProductCount(cat.name)} products
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Products</h2>
              <p className={styles.sectionSubtitle}>
                Our latest and most popular products
              </p>
            </div>
            <Link href="/products" className={styles.sectionLink}>
              View all products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </>
  );
}
