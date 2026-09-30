import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "JLAN | Product Catalog",
  description:
    "Browse our extensive product catalog. View real-time stock availability, pricing, and product details across all categories.",
  keywords: ["JLAN", "products", "catalog", "stock", "inventory"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ paddingTop: "var(--nav-height)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
