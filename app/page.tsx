import Link from "next/link";
import ProductGrid from "./components/ProductGrid";
import CategoryNav from "./components/CategoryNav";

export default function Home({
  searchParams
}: {
  searchParams?: { category?: string; page?: string };
}) {
  const category = searchParams?.category;
  const page = searchParams?.page;

  return (
    <main className="page palace">
      <header className="topbar">
        <div className="logo-strip">
          <span className="logo-mark">Marino</span>
          <span className="logo-dot">•</span>
          <span className="logo-mark">Infantry</span>
        </div>
        <nav className="nav">
          <Link href="/cart">Cart</Link>
        </nav>
      </header>

      <section className="catalog">
        <CategoryNav />
        <div className="catalog-main">
          <ProductGrid category={category} page={page} />
        </div>
      </section>
    </main>
  );
}
