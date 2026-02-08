"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

type ApiResponse = { data: Category[] };

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const active = searchParams.get("category") ?? "all";

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch("/api/categories", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return { data: [] } as ApiResponse;
        return (await res.json()) as ApiResponse;
      })
      .then((data) => {
        setCategories(data.data ?? []);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("idle");
      });

    return () => controller.abort();
  }, []);

  function setCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <aside className="category-nav">
      <p className="category-title">Catalog</p>
      <button
        type="button"
        className={`category-link${active === "all" ? " is-active" : ""}`}
        onClick={() => setCategory("all")}
        disabled={status === "loading" || isPending}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`category-link${active === String(category.id) ? " is-active" : ""}`}
          onClick={() => setCategory(String(category.id))}
          disabled={status === "loading" || isPending}
        >
          {category.name}
        </button>
      ))}
    </aside>
  );
}
