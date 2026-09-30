"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product, formatPrice, slugify } from "@/lib/types";
import StockBadge from "@/components/StockBadge";
import styles from "./page.module.css";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/pos/products");
        const products: Product[] = await res.json();
        const found = products.find((p) => p.id === productId);
        setProduct(found || null);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

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
            <p>Loading product...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.pageInner}>
          <div className={styles.notFound}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.3">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <h2 className={styles.notFoundTitle}>Product Not Found</h2>
            <p className={styles.notFoundText}>
              This product doesn&apos;t exist or has been removed.
            </p>
            <Link href="/products" className={styles.notFoundLink}>
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} id="product-detail-page">
      <div className={styles.pageInner}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          {product.categoryName && (
            <>
              <span>/</span>
              <Link href={`/category/${slugify(product.categoryName)}`}>
                {product.categoryName}
              </Link>
            </>
          )}
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <Link href="/products" className={styles.backLink} id="back-to-products">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className={styles.productLayout} style={{ marginTop: 24 }}>
          {/* Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span className={styles.imagePlaceholderText}>
                    No image available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className={styles.detailsSection}>
            {product.categoryName && (
              <Link
                href={`/category/${slugify(product.categoryName)}`}
                className={styles.categoryBadge}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                {product.categoryName}
              </Link>
            )}

            <div>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.skuText}>SKU: {product.sku}</p>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.priceValue}>
                <span className={styles.priceCurrency}>Rs. </span>
                {formatPrice(product.sellingPrice)}
              </span>
              {product.unitName && (
                <span className={styles.priceUnit}>
                  per {product.unitName}
                </span>
              )}
            </div>

            <div className={styles.stockInfo}>
              <StockBadge quantity={product.stockQuantity} showQuantity />
              <span className={styles.stockQuantity}>
                <span className={styles.stockQuantityValue}>
                  {product.stockQuantity}
                </span>{" "}
                units available
              </span>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>SKU</span>
                <span className={styles.specValue}>{product.sku}</span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Category</span>
                <span className={styles.specValue}>
                  {product.categoryName || "Uncategorized"}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Unit</span>
                <span className={styles.specValue}>
                  {product.unitName || "pcs"}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Barcode</span>
                <span className={styles.specValue}>
                  {product.barcode || "—"}
                </span>
              </div>
            </div>

            {product.description && (
              <div className={styles.descriptionSection}>
                <h3 className={styles.descriptionTitle}>Description</h3>
                <p className={styles.descriptionText}>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
