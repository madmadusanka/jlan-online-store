import Link from "next/link";
import { Product, formatPrice } from "@/lib/types";
import StockBadge from "./StockBadge";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={styles.card}
      id={`product-card-${product.id}`}
    >
      <div className={styles.imageWrapper}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg
              width="48"
              height="48"
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
          </div>
        )}

        {product.categoryName && (
          <span className={styles.categoryBadge}>{product.categoryName}</span>
        )}

        <div className={styles.stockPosition}>
          <StockBadge quantity={product.stockQuantity} />
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.sku}>{product.sku}</span>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.meta}>
          {product.unitName && (
            <span className={styles.unit}>per {product.unitName}</span>
          )}
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            <span className={styles.priceCurrency}>Rs.</span>
            {formatPrice(product.sellingPrice)}
          </span>
          <span className={styles.viewBtn}>
            View
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
