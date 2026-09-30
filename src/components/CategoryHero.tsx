import Link from "next/link";
import styles from "./CategoryHero.module.css";

interface CategoryHeroProps {
  title: string;
  description?: string;
  logoUrl?: string;
  productCount: number;
  inStockCount: number;
}

export default function CategoryHero({
  title,
  description,
  logoUrl,
  productCount,
  inStockCount,
}: CategoryHeroProps) {
  return (
    <section className={styles.hero} id="category-hero">
      <div className={styles.heroInner}>
        <img
          src={logoUrl || "/logos/jlan-main.png"}
          alt={title}
          className={styles.heroLogo}
        />
        <div className={styles.heroContent}>
          <nav className={styles.heroBreadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/categories">Categories</Link>
            <span>/</span>
            <span style={{ color: "var(--color-text-primary)" }}>{title}</span>
          </nav>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>{title}</span>
          </h1>
          {description && (
            <p className={styles.heroDescription}>{description}</p>
          )}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{productCount}</span>
              <span className={styles.heroStatLabel}>Products</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{inStockCount}</span>
              <span className={styles.heroStatLabel}>In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
