import Link from "next/link";
import ProductGrid from "./components/ProductGrid";

export default function Home({
  searchParams
}: {
  searchParams?: { category?: string; page?: string };
}) {
  const category = searchParams?.category;
  const page = searchParams?.page;

  return (
    <main className="page">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Season 01 · Experimental Supply</p>
          <h1>Marino Infantry</h1>
          <p className="lede">
            Quiet utility, heavy silhouettes, and a clean headless pipeline.
            Built for fast previews with secure keys and hosted checkout later.
          </p>
        </div>
        <nav className="nav">
          <Link href="/cart">Cart</Link>
        </nav>
      </header>

      <section className="section">
        <ProductGrid category={category} page={page} />
      </section>
    </main>
  );
}
