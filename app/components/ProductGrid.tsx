"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price?: number;
  custom_url?: { url?: string };
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

type ApiResponse = { data: Product[] };
type ProductResponse = { data: Product };

type Props = {
  category?: string;
  page?: string;
};

export default function ProductGrid({ category, page }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [details, setDetails] = useState<Record<number, Product>>({});
  const [sizeSelection, setSizeSelection] = useState<Record<number, string>>({});
  const [quickStatus, setQuickStatus] = useState<Record<number, "idle" | "loading">>(
    {}
  );

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

  function getPrimaryImage(product: Product) {
    const sorted = product.images
      ?.slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return (
      sorted?.find((img) => img.is_thumbnail)?.url_standard ??
      sorted?.[0]?.url_standard ??
      sorted?.[0]?.url_thumbnail
    );
  }

  function getSizeOptions(product: Product) {
    const option = product.options?.find((opt) =>
      (opt.display_name ?? "").toLowerCase().includes("size")
    );
    const fromOptions =
      option?.option_values?.map((value) => value.label).filter(Boolean) ?? [];
    if (fromOptions.length) return Array.from(new Set(fromOptions)) as string[];

    const fromVariants =
      product.variants
        ?.flatMap((variant) => variant.option_values ?? [])
        .filter((value) =>
          (value.option_display_name ?? "").toLowerCase().includes("size")
        )
        .map((value) => value.label)
        .filter(Boolean) ?? [];
    return Array.from(new Set(fromVariants)) as string[];
  }

  function getVariantForSize(product: Product, sizeLabel: string) {
    if (!sizeLabel) return undefined;
    return product.variants?.find((variant) =>
      (variant.option_values ?? []).some(
        (value) =>
          (value.option_display_name ?? "").toLowerCase().includes("size") &&
          value.label === sizeLabel
      )
    );
  }

  async function openQuickAdd(productId: number) {
    setActiveId(productId);
    if (details[productId]) return;
    setQuickStatus((prev) => ({ ...prev, [productId]: "loading" }));
    const res = await fetch(`/api/product/id-${productId}`);
    if (res.ok) {
      const data = (await res.json()) as ProductResponse;
      setDetails((prev) => ({ ...prev, [productId]: data.data }));
    }
    setQuickStatus((prev) => ({ ...prev, [productId]: "idle" }));
  }

  async function quickAdd(productId: number) {
    const product = details[productId];
    const size = sizeSelection[productId];
    const variant = product ? getVariantForSize(product, size) : undefined;

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
    return <p>Loading products...</p>;
  }

  if (status === "error") {
    return <p>{message || "Could not load products."}</p>;
  }

  return (
    <div>
      {message ? <p>{message}</p> : null}
      <div className="product-grid">
        {products.map((product) => {
          const slug = `id-${product.id}`;
          const image = getPrimaryImage(product);
          const detail = details[product.id];
          const sizeOptions = detail ? getSizeOptions(detail) : [];
          return (
            <article key={product.id} className="product-card">
              <Link href={`/p/${slug}`}>
                <h2>{product.name}</h2>
              </Link>
              {image ? (
                <img src={image} alt={product.name} />
              ) : null}
              <p className="price">
                {product.price ? `$${product.price.toFixed(2)}` : ""}
              </p>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => openQuickAdd(product.id)}
                >
                  Quick add
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => addToCart(product.id)}
                >
                  Add to cart
                </button>
              </div>

              {activeId === product.id ? (
                <div className="quick-panel">
                  {quickStatus[product.id] === "loading" ? (
                    <p>Loading sizes…</p>
                  ) : sizeOptions.length ? (
                    <label className="quick-label">
                      Size
                      <select
                        value={sizeSelection[product.id] ?? ""}
                        onChange={(event) =>
                          setSizeSelection((prev) => ({
                            ...prev,
                            [product.id]: event.target.value
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {sizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p>Single size</p>
                  )}
                  <button
                    type="button"
                    className="btn"
                    onClick={() => quickAdd(product.id)}
                    disabled={sizeOptions.length > 0 && !sizeSelection[product.id]}
                  >
                    Add now
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
