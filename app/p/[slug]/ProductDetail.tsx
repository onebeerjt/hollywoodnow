"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price?: number;
  images?: Array<{ url_standard?: string; url_thumbnail?: string }>;
};

type ApiResponse = { data: Product };

type Props = {
  slug: string;
};

export default function ProductDetail({ slug }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(`/api/product/${slug}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load product");
        return (await res.json()) as ApiResponse;
      })
      .then((data) => {
        setProduct(data.data);
        setStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setStatus("error");
        setMessage(error.message || "Failed to load");
      });

    return () => controller.abort();
  }, [slug]);

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
    return <p>Loading product...</p>;
  }

  if (status === "error") {
    return <p>{message || "Could not load product."}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const image = product.images?.[0]?.url_standard ?? product.images?.[0]?.url_thumbnail;

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "720px" }}>
      <h1>{product.name}</h1>
      {image ? (
        <img src={image} alt={product.name} style={{ width: "100%" }} />
      ) : null}
      {product.price ? <p>${product.price.toFixed(2)}</p> : null}
      {product.description ? (
        <div
          dangerouslySetInnerHTML={{ __html: product.description }}
          style={{ lineHeight: 1.6 }}
        />
      ) : null}
      <button type="button" onClick={() => addToCart(product.id)}>
        Add to cart
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
