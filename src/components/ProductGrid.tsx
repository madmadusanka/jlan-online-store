import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = "No products found",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <h3 className={styles.emptyTitle}>{emptyMessage}</h3>
          <p className={styles.emptyText}>
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid} id="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
