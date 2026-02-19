"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { exportSavedDigest, useSavedCards } from "@/components/reel/use-saved-cards";
import type { ReelCardType } from "@/lib/reel/types";

const FILTERS: Array<{ label: string; value: ReelCardType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Facts", value: "fact" },
  { label: "Deep Dives", value: "deep_dive" },
  { label: "Directors", value: "director_spotlight" },
  { label: "On This Day", value: "on_this_day" },
  { label: "Lore", value: "lore" }
];

export default function SavedPageClient() {
  const { saved, toggleSaved } = useSavedCards();
  const [filter, setFilter] = useState<ReelCardType | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return saved.filter((card) => {
      const typeMatch = filter === "all" || card.type === filter;
      const q = query.trim().toLowerCase();
      const textMatch = !q || `${card.title} ${card.summary}`.toLowerCase().includes(q);
      return typeMatch && textMatch;
    });
  }, [saved, filter, query]);

  const exportDigest = () => {
    const digest = exportSavedDigest(filtered);
    navigator.clipboard.writeText(digest).catch(() => undefined);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-6 border-b border-[var(--line)] pb-4">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Archive</p>
        <h1 className="font-head text-6xl">Saved Collection</h1>
        <div className="mt-3 flex items-center gap-3">
          <Link href="/" className="text-sm underline-offset-4 hover:underline">
            Back to feed
          </Link>
          <button onClick={exportDigest} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-wider">
            Export Digest
          </button>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
              filter === item.value ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search within saved cards"
        className="mb-6 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm outline-none"
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((card) => (
          <article key={card.id} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">{card.type.replace(/_/g, " ")}</p>
            <h2 className="mt-1 text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{card.summary}</p>
            <button onClick={() => toggleSaved(card)} className="mt-3 text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
              Remove
            </button>
          </article>
        ))}
      </section>

      {!filtered.length ? <p className="mt-8 text-sm text-[var(--muted)]">No saved cards match this filter.</p> : null}
    </main>
  );
}
