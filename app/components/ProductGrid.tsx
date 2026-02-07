"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price?: number;
  custom_url?: { url?: string };
  images?: Array<{ url_standard?: string; url_thumbnail?: string }>;
};

type ApiResponse = { data: Product[] };

type Props = {
  category?: string;
  page?: string;
};

export default function ProductGrid({ category, page }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page) params.set("page", page);

    setStatus("loading");
    fetch(`/api/products?${params.toString()}`, {
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return (await res.json()) as ApiResponse;
      })
      .then((data) => {
        setProducts(data.data ?? []);
        setStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setStatus("error");
        setMessage(error.message || "Failed to load");
      });

    return () => controller.abort();
  }, [category, page]);

  async function addToCart(productId: number) {
    setMessage("");

    const add = async () =>
      fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_items: [{ product_id: productId, quantity: 1 }] })
      });

    let response = await add();
    if (response.status === 400) {
      await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      response = await add();
    }

    if (!response.ok) {
      setMessage("Could not add to cart.");
      return;
    }

    setMessage("Added to cart.");
  }

  if (status === "loading") {
    return <p>Loading products...</p>;
  }

  if (status === "error") {
    return <p>{message || "Could not load products."}</p>;
  }

  return (
    <div>
      {message ? <p>{message}</p> : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}
      >
        {products.map((product) => {
          const url = product.custom_url?.url ?? "";
          const cleaned = url.replace(/^\//, "").replace(/\/$/, "");
          const parts = cleaned.split("/");
          const urlSlug = parts[parts.length - 1] || "";
          const slug = urlSlug || `id-${product.id}`;
          const image =
            product.images?.[0]?.url_standard ?? product.images?.[0]?.url_thumbnail;
          return (
            <article
              key={product.id}
              style={{ border: "1px solid #ddd", padding: "1rem" }}
            >
              <Link href={`/p/${slug}`}>
                <h2>{product.name}</h2>
              </Link>
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : null}
              <p>{product.price ? `$${product.price.toFixed(2)}` : ""}</p>
              <button type="button" onClick={() => addToCart(product.id)}>
                Add to cart
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
