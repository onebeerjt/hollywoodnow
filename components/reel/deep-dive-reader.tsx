"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { seedContent } from "@/lib/reel/seed";
import { slugify } from "@/lib/reel/utils";

export default function DeepDiveReader({ topic }: { topic: string }) {
  const [body, setBody] = useState("");
  const [readTime, setReadTime] = useState(3);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/generate/deepdive?topic=${encodeURIComponent(topic)}`)
      .then((res) => res.json())
      .then((payload) => {
        if (!mounted) return;
        setBody(payload.body ?? "No article available.");
        setReadTime(payload.readTime ?? 3);
      })
      .catch(() => {
        if (mounted) setBody("Could not load deep dive article.");
      });

    return () => {
      mounted = false;
    };
  }, [topic]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 md:px-0">
      <Link href="/" className="text-sm underline-offset-4 hover:underline">
        Back to feed
      </Link>

      <article className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Deep Dive Reader</p>
        <h1 className="mt-3 font-head text-5xl leading-tight">{topic}</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{readTime} min read</p>

        <div className="mt-6 border-t border-[var(--line)] pt-6">
          {body ? <p className="deep-dive-copy text-base leading-8">{body}</p> : <p className="text-sm text-[var(--muted)]">Loading article...</p>}
        </div>
      </article>

      <section className="mt-8">
        <h2 className="font-head text-3xl">Related Deep Dives</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {seedContent.deepDiveTopics
            .filter((item) => item !== topic)
            .slice(0, 4)
            .map((item) => (
              <Link key={item} href={`/read/${slugify(item)}`} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 text-sm hover:border-[var(--accent)]">
                {item}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
