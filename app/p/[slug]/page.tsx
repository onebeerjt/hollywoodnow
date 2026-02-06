import Link from "next/link";
import ProductDetail from "./ProductDetail";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <main style={{ padding: "2rem" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link href="/">Home</Link>
        {" | "}
        <Link href="/cart">Cart</Link>
      </nav>
      <ProductDetail slug={params.slug} />
    </main>
  );
}
