"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DirectorSeed } from "@/lib/reel/types";

const ERAS = ["All", "Silent Era", "Golden Age", "New Hollywood", "Contemporary"] as const;

export default function DirectorArchive({ directors }: { directors: DirectorSeed[] }) {
  const [era, setEra] = useState<(typeof ERAS)[number]>("All");

  const filtered = useMemo(() => {
    if (era === "All") return directors;
    return directors.filter((director) => director.era === era);
  }, [directors, era]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-6 border-b border-[var(--line)] pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Reference Desk</p>
        <h1 className="font-head text-6xl">Director Archive</h1>
        <Link href="/" className="mt-2 inline-block text-sm underline-offset-4 hover:underline">
          Back to feed
        </Link>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {ERAS.map((item) => (
          <button
            key={item}
            onClick={() => setEra(item)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
              era === item ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((director) => (
          <article key={director.id} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">{director.era}</p>
            <h2 className="mt-1 text-xl font-semibold">{director.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{director.funFact}</p>
            <Link href={`/directors/${director.id}`} className="mt-3 inline-block text-xs uppercase tracking-wider text-[var(--accent)]">
              Full spotlight
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
