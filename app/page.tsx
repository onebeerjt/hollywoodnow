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
    <main style={{ padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Headless BigCommerce Store</h1>
          <p>Minimal product grid powered by the BigCommerce API.</p>
        </div>
        <nav>
          <Link href="/cart">Cart</Link>
        </nav>
      </header>

      <section style={{ marginTop: "2rem" }}>
        <ProductGrid category={category} page={page} />
      </section>
    </main>
  );
}
