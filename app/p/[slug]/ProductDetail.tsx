"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price?: number;
  images?: Array<{
    url_standard?: string;
    url_thumbnail?: string;
    is_thumbnail?: boolean;
    sort_order?: number;
  }>;
  variants?: Array<{
    id: number;
    option_values?: Array<{
      option_display_name?: string;
      label?: string;
    }>;
  }>;
  options?: Array<{
    display_name?: string;
    option_values?: Array<{ label?: string }>;
  }>;
};

type ApiResponse = { data: Product };

type Props = {
  slug: string;
};

export default function ProductDetail({ slug }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [size, setSize] = useState<string>("");

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
    const variant =
      size && product
        ? product.variants?.find((variant) =>
            (variant.option_values ?? []).some(
              (value) =>
                (value.option_display_name ?? "").toLowerCase().includes("size") &&
                value.label === size
            )
          )
        : undefined;

    const add = async () =>
      fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_items: [
            {
              product_id: productId,
              quantity: 1,
              ...(variant ? { variant_id: variant.id } : {})
            }
          ]
        })
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

  const sortedImages = product.images
    ?.slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const image =
    sortedImages?.find((img) => img.is_thumbnail)?.url_standard ??
    sortedImages?.[0]?.url_standard ??
    sortedImages?.[0]?.url_thumbnail;

  const sizeOptions =
    product.options
      ?.find((opt) => (opt.display_name ?? "").toLowerCase().includes("size"))
      ?.option_values?.map((value) => value.label)
      .filter(Boolean) ?? [];

  return (
    <div className="product-detail">
      <div className="product-media">
        {image ? <img src={image} alt={product.name} /> : null}
      </div>
      <div className="product-info">
        <p className="eyebrow">Marino Infantry</p>
        <h1>{product.name}</h1>
        {product.price ? <p className="price">${product.price.toFixed(2)}</p> : null}
        {product.description ? (
          <div
            className="product-desc"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : null}
        {sizeOptions.length ? (
          <label className="quick-label">
            Size
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="">Select</option>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="card-actions">
          <button
            type="button"
            className="btn"
            onClick={() => addToCart(product.id)}
            disabled={sizeOptions.length > 0 && !size}
          >
            Add to cart
          </button>
        </div>
        {message ? <p>{message}</p> : null}
      </div>
    </div>
  );
}
