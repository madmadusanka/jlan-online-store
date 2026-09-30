import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="main-footer">
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <img
              src="/logos/jlan-main.png"
              alt="JLAN"
              className={styles.footerLogo}
            />
            <p className={styles.footerDescription}>
              Your trusted partner for quality products. Browse our extensive
              catalog of products across multiple categories with real-time
              stock availability.
            </p>
          </div>

          <div>
            <h4 className={styles.footerColumnTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className={styles.footerLink}>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className={styles.footerLink}>
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColumnTitle}>Contact</h4>
            <ul className={styles.footerLinks}>
              <li>
                <span className={styles.footerLink}>info@jlan.com</span>
              </li>
              <li>
                <span className={styles.footerLink}>+94 11 234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} JLAN. All rights reserved.</p>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.footerSocial} aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className={styles.footerSocial} aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
