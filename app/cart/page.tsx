"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  product_id?: number;
  name: string;
  quantity: number;
  list_price?: number;
};

type ProductSummary = {
  id: number;
  name: string;
  images?: Array<{
    url_standard?: string;
    url_thumbnail?: string;
    is_thumbnail?: boolean;
    sort_order?: number;
  }>;
};

type Cart = {
  id: string;
  redirect_urls?: {
    cart_url?: string;
    checkout_url?: string;
  };
  line_items?: {
    physical_items?: CartItem[];
    digital_items?: CartItem[];
    custom_items?: CartItem[];
  };
};

type CartResponse = { data: Cart | null };
type ProductResponse = { data: ProductSummary };

export default function CartPage() {
  const [message, setMessage] = useState<string>("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [products, setProducts] = useState<Record<number, ProductSummary>>({});

  async function loadCart() {
    setStatus("loading");
    const res = await fetch("/api/cart", { credentials: "include" });
    if (!res.ok) {
      setStatus("idle");
      return;
    }
    const data = (await res.json()) as CartResponse;
    setCart(data.data);
    setStatus("idle");

    const ids = [
      ...(data.data?.line_items?.physical_items ?? []),
      ...(data.data?.line_items?.digital_items ?? [])
    ]
      .map((item) => item.product_id)
      .filter((id): id is number => Boolean(id));

    const uniqueIds = Array.from(new Set(ids));
    if (uniqueIds.length) {
      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await fetch(`/api/product/id-${id}`);
          if (!response.ok) return null;
          const payload = (await response.json()) as ProductResponse;
          return payload.data;
        })
      );
      const map: Record<number, ProductSummary> = {};
      results.filter(Boolean).forEach((product) => {
        if (product) map[product.id] = product;
      });
      setProducts(map);
    }
  }

  useEffect(() => {
    void loadCart();
  }, []);

  async function createCart() {
    setMessage("");
    const res = await fetch("/api/cart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    setMessage(res.ok ? "Cart created." : "Failed to create cart.");
    await loadCart();
  }

  async function removeItem(item: string) {
    setMessage("");
    const res = await fetch("/api/cart/items", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: item })
    });
    setMessage(res.ok ? "Removed item." : "Failed to remove item.");
    await loadCart();
  }

  const items = [
    ...(cart?.line_items?.physical_items ?? []),
    ...(cart?.line_items?.digital_items ?? []),
    ...(cart?.line_items?.custom_items ?? [])
  ];

  function getPrimaryImage(product?: ProductSummary) {
    const sorted = product?.images
      ?.slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return (
      sorted?.find((img) => img.is_thumbnail)?.url_standard ??
      sorted?.[0]?.url_standard ??
      sorted?.[0]?.url_thumbnail
    );
  }

  return (
    <main className="page cart-page">
      <header className="topbar">
        <div className="logo-strip">
          <span className="logo-mark">Marino</span>
          <span className="logo-dot">•</span>
          <span className="logo-mark">Infantry</span>
        </div>
        <nav className="nav">
          <Link href="/">Back to shop</Link>
        </nav>
      </header>

      <section className="cart-shell">
        <div className="cart-header">
          <h1>Your Cart</h1>
          {cart?.redirect_urls?.checkout_url ? (
            <button
              type="button"
              className="btn"
              onClick={() =>
                (window.location.href = cart.redirect_urls?.checkout_url ?? "/")
              }
            >
              Checkout
            </button>
          ) : null}
        </div>
        {status === "loading" ? <p>Loading cart…</p> : null}
        {!cart ? (
          <div className="cart-empty">
            <p>No cart yet.</p>
            <button type="button" className="btn" onClick={createCart}>
              Start cart
            </button>
          </div>
        ) : null}
        {cart && items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button type="button" className="btn" onClick={createCart}>
              Refresh cart
            </button>
          </div>
        ) : null}
        {items.length > 0 ? (
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-info">
                  {item.product_id && products[item.product_id] ? (
                    <img
                      src={getPrimaryImage(products[item.product_id])}
                      alt={products[item.product_id].name}
                    />
                  ) : null}
                  <strong>{item.name}</strong>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="cart-meta">
                  {item.list_price ? <p>${item.list_price.toFixed(2)}</p> : null}
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {message ? <p>{message}</p> : null}
      </section>
    </main>
  );
}
