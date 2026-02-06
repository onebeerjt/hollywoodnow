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

type Cart = {
  id: string;
  line_items?: {
    physical_items?: CartItem[];
    digital_items?: CartItem[];
    custom_items?: CartItem[];
  };
};

type CartResponse = { data: Cart | null };

export default function CartPage() {
  const [message, setMessage] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [itemId, setItemId] = useState<string>("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

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

  async function addItem() {
    setMessage("");
    const res = await fetch("/api/cart/items", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_items: [
          {
            product_id: Number(productId),
            quantity: Number(quantity)
          }
        ]
      })
    });
    setMessage(res.ok ? "Added item." : "Failed to add item.");
    await loadCart();
  }

  async function updateItem(item = itemId) {
    setMessage("");
    const res = await fetch("/api/cart/items", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: item, quantity: Number(quantity) })
    });
    setMessage(res.ok ? "Updated item." : "Failed to update item.");
    await loadCart();
  }

  async function removeItem(item = itemId) {
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

  return (
    <main style={{ padding: "2rem", maxWidth: "780px" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link href="/">Home</Link>
      </nav>

      <h1>Cart</h1>
      <p>
        Minimal cart controls to exercise the API routes. A full cart UI can be
        layered later.
      </p>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Current cart</h2>
        {status === "loading" ? <p>Loading cart...</p> : null}
        {!cart ? <p>No cart yet.</p> : null}
        {cart && items.length === 0 ? <p>Cart is empty.</p> : null}
        {items.length > 0 ? (
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{ border: "1px solid #ddd", padding: "0.75rem" }}
              >
                <strong>{item.name}</strong>
                <p>Item ID: {item.id}</p>
                {item.product_id ? <p>Product ID: {item.product_id}</p> : null}
                <p>Qty: {item.quantity}</p>
                {item.list_price ? <p>${item.list_price.toFixed(2)}</p> : null}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button type="button" onClick={() => updateItem(item.id)}>
                    Update qty
                  </button>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        <button type="button" onClick={createCart}>
          Create cart
        </button>

        <label style={{ display: "grid", gap: "0.5rem" }}>
          Product ID
          <input
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            placeholder="123"
          />
        </label>
        <label style={{ display: "grid", gap: "0.5rem" }}>
          Quantity
          <input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="1"
          />
        </label>
        <button type="button" onClick={addItem}>
          Add item
        </button>

        <label style={{ display: "grid", gap: "0.5rem" }}>
          Cart Item ID
          <input
            value={itemId}
            onChange={(event) => setItemId(event.target.value)}
            placeholder="item-id"
          />
        </label>
        <button type="button" onClick={() => updateItem()}>
          Update item
        </button>
        <button type="button" onClick={() => removeItem()}>
          Remove item
        </button>
      </div>

      {message ? <p style={{ marginTop: "1rem" }}>{message}</p> : null}
    </main>
  );
}
