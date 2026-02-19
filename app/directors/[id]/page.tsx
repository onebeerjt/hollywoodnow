"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { seedContent } from "@/lib/reel/seed";

type DirectorPayload = {
  id: number;
  name: string;
  biography?: string;
  timeline: Array<{ id: number; title: string; release_date?: string; vote_average?: number }>;
};

export default function DirectorPage({ params }: { params: { id: string } }) {
  const seed = seedContent.directors.find((director) => String(director.id) === params.id);
  const [director, setDirector] = useState<DirectorPayload | null>(null);

  useEffect(() => {
    fetch(`/api/director/${params.id}`)
      .then((res) => res.json())
      .then((payload) => setDirector(payload))
      .catch(() => undefined);
  }, [params.id]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 md:px-0">
      <Link href="/directors" className="text-sm underline-offset-4 hover:underline">
        Back to archive
      </Link>

      <article className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Director Spotlight</p>
        <h1 className="mt-3 font-head text-5xl">{director?.name ?? seed?.name ?? "Director"}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{seed?.era ?? "Unknown era"}</p>

        <p className="mt-4 text-sm leading-7">{director?.biography || seed?.funFact || "No biography available."}</p>

        <h2 className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Career Timeline</h2>
        <div className="mt-3 space-y-2">
          {(director?.timeline ?? []).slice(-14).map((film) => (
            <div key={`${film.id}-${film.title}`} className="flex items-center justify-between border-b border-[var(--line)] pb-2 text-sm">
              <span>{film.title}</span>
              <span className="text-[var(--muted)]">{film.release_date?.slice(0, 4) ?? "-"} · {(film.vote_average ?? 0).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
