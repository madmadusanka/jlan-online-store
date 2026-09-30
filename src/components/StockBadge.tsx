import { getStockStatus } from "@/lib/types";
import styles from "./StockBadge.module.css";

interface StockBadgeProps {
  quantity: number;
  showQuantity?: boolean;
}

export default function StockBadge({
  quantity,
  showQuantity = false,
}: StockBadgeProps) {
  const status = getStockStatus(quantity);

  const statusClass =
    status === "in-stock"
      ? styles.inStock
      : status === "low-stock"
        ? styles.lowStock
        : styles.outOfStock;

  const label =
    status === "in-stock"
      ? "In Stock"
      : status === "low-stock"
        ? "Low Stock"
        : "Out of Stock";

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      <span className={styles.dot} />
      {label}
      {showQuantity && quantity > 0 && (
        <span> ({quantity})</span>
      )}
    </span>
  );
}
