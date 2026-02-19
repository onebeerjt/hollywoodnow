"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DirectorSpotlightPayload, FeedFilter, ReelCard } from "@/lib/reel/types";
import { titleCaseTag } from "@/lib/reel/utils";
import { useSavedCards } from "@/components/reel/use-saved-cards";
import { useThemeMode } from "@/components/reel/use-theme-mode";

type FeedResponse = {
  page: number;
  pageSize: number;
  hasMore: boolean;
  items: ReelCard[];
};

const FILTERS: Array<{ label: string; value: FeedFilter }> = [
  { label: "All", value: "all" },
  { label: "Facts", value: "fact" },
  { label: "Deep Dives", value: "deep_dive" },
  { label: "Directors", value: "director_spotlight" },
  { label: "On This Day", value: "on_this_day" },
  { label: "Lore", value: "lore" }
];

function shareCard(card: ReelCard) {
  const text = `${card.title}\n${card.summary}`;
  navigator.clipboard.writeText(text).catch(() => undefined);
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--card)]/65" />
      ))}
    </div>
  );
}

function CardActions({ card, saved, onSave }: { card: ReelCard; saved: boolean; onSave: () => void }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-xs">
      <button onClick={onSave} className="rounded-full border border-[var(--line)] px-3 py-1 hover:bg-[var(--accent)]/15">
        {saved ? "Saved" : "Save"}
      </button>
      <button onClick={() => shareCard(card)} className="rounded-full border border-[var(--line)] px-3 py-1 hover:bg-[var(--accent)]/15">
        Share
      </button>
      {card.type === "deep_dive" ? (
        <Link href={`/read/${card.slug}`} className="rounded-full border border-[var(--line)] px-3 py-1 hover:bg-[var(--accent)]/15">
          Read Page
        </Link>
      ) : null}
    </div>
  );
}

function DirectorTimeline({ directorId }: { directorId: number }) {
  const [data, setData] = useState<DirectorSpotlightPayload | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/director/${directorId}`)
      .then((res) => res.json())
      .then((payload) => {
        if (mounted) setData(payload);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [directorId]);

  if (!data) return <p className="mt-2 text-xs text-[var(--muted)]">Loading career arc...</p>;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs italic text-[var(--muted)]">{data.quote}</p>
      <div className="space-y-1">
        {data.timeline.slice(-6).map((film) => (
          <div key={`${film.id}-${film.title}`} className="flex items-center justify-between gap-3 border-b border-[var(--line)]/70 pb-1 text-xs">
            <span className="truncate">{film.title}</span>
            <span className="text-[var(--muted)]">{film.release_date?.slice(0, 4) ?? "-"} · {(film.vote_average ?? 0).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeepDiveBody({ topic }: { topic: string }) {
  const [body, setBody] = useState<string>("");
  const [readTime, setReadTime] = useState<number>(3);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/generate/deepdive?topic=${encodeURIComponent(topic)}`)
      .then((res) => res.json())
      .then((payload) => {
        if (!mounted) return;
        setBody(payload.body ?? "No article generated.");
        setReadTime(payload.readTime ?? 3);
      })
      .catch(() => {
        if (mounted) setBody("Unable to generate this deep dive right now.");
      });

    return () => {
      mounted = false;
    };
  }, [topic]);

  if (!body) return <p className="mt-3 text-sm text-[var(--muted)]">Generating deep dive...</p>;

  return (
    <div className="mt-4 border-t border-[var(--line)] pt-4">
      <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">{readTime} min read</p>
      <p className="deep-dive-copy text-sm leading-7 text-[var(--ink)]">{body}</p>
    </div>
  );
}

function FeedCard({
  card,
  search,
  isSaved,
  onToggleSaved
}: {
  card: ReelCard;
  search: string;
  isSaved: (id: string) => boolean;
  onToggleSaved: (card: ReelCard) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const matches = useMemo(() => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return `${card.title} ${card.summary}`.toLowerCase().includes(q);
  }, [card, search]);

  if (!matches) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      className={`reel-card rounded-2xl border p-5 ${card.type === "lore" ? "lore-card" : ""}`}
    >
      {card.type === "on_this_day" ? <p className="font-head text-4xl leading-none text-[var(--accent)]">{card.dateLabel}</p> : null}

      <h2 className={`mt-2 ${card.type === "deep_dive" ? "font-head text-3xl" : "text-xl font-semibold"}`}>{card.title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink)]">{card.summary}</p>

      {card.type === "fact" && card.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
              #{titleCaseTag(tag)}
            </span>
          ))}
        </div>
      ) : null}

      {card.type === "box_office" ? (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] p-3">
          <p className="text-xs uppercase tracking-widest text-[var(--muted)]">{card.year}</p>
          <p className="mt-1 font-head text-3xl text-[var(--accent)]">{card.gross}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">{card.context}</p>
        </div>
      ) : null}

      {card.type === "director_spotlight" ? (
        <button className="mt-3 text-xs uppercase tracking-wider text-[var(--accent)]" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Hide timeline" : "Show timeline"}
        </button>
      ) : null}

      {card.type === "deep_dive" ? (
        <button className="mt-3 text-xs uppercase tracking-wider text-[var(--accent)]" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Collapse deep dive" : "Expand deep dive"}
        </button>
      ) : null}

      {card.type === "director_spotlight" && expanded ? <DirectorTimeline directorId={card.directorId} /> : null}
      {card.type === "deep_dive" && expanded ? <DeepDiveBody topic={card.topic} /> : null}

      <CardActions card={card} saved={isSaved(card.id)} onSave={() => onToggleSaved(card)} />
    </motion.article>
  );
}

export default function FeedPage() {
  const { mode, setMode } = useThemeMode();
  const { groupedCount, isSaved, toggleSaved } = useSavedCards();

  const [filter, setFilter] = useState<FeedFilter>("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ReelCard[]>([]);
  const [filmOfDay, setFilmOfDay] = useState<ReelCard | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/filmoftheday")
      .then((res) => res.json())
      .then((payload) => setFilmOfDay(payload.item ?? null))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [filter]);

  useEffect(() => {
    if (!hasMore || loading) return;
    setLoading(true);

    fetch(`/api/feed?page=${page}&filter=${filter}`)
      .then((res) => res.json() as Promise<FeedResponse>)
      .then((payload) => {
        setItems((prev) => [...prev, ...payload.items]);
        setHasMore(payload.hasMore);
      })
      .finally(() => setLoading(false));
  }, [page, filter, hasMore, loading]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "280px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <main className="min-h-screen px-4 pb-20 pt-8 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <header className="mb-6 border-b border-[var(--line)] pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-[var(--muted)]">Cinema Paper</p>
                <h1 className="font-head text-6xl leading-none md:text-8xl">THE REEL</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">{todayLabel}</p>
              </div>
              <button
                onClick={() => setMode(mode === "dark" ? "broadsheet" : "dark")}
                className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                {mode === "dark" ? "Broadsheet" : "Dark Mode"}
              </button>
            </div>
          </header>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                  filter === item.value ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search directors, films, or themes"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-4">
            {filmOfDay?.type === "film_of_day" ? (
              <article className="reel-card rounded-2xl border border-[var(--accent)] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Pinned: Film of the Day</p>
                <h2 className="mt-2 font-head text-3xl">{filmOfDay.film.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {filmOfDay.film.year} · Directed by {filmOfDay.film.director}
                </p>
                <p className="mt-3 text-sm leading-6">{filmOfDay.whyItMatters}</p>
              </article>
            ) : null}
            {items.map((card) => (
              <FeedCard key={card.id} card={card} search={search} isSaved={isSaved} onToggleSaved={toggleSaved} />
            ))}
            {loading ? <FeedSkeleton /> : null}
            <div ref={sentinelRef} className="h-1" />
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
            <h2 className="font-head text-3xl text-[var(--accent)]">Film of the Day</h2>
            {filmOfDay ? (
              <>
                <h3 className="mt-3 text-lg font-semibold">{filmOfDay.title.replace("Film of the Day: ", "")}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{filmOfDay.summary}</p>
                {filmOfDay.type === "film_of_day" && filmOfDay.tmdbRating ? (
                  <p className="mt-2 text-xs uppercase tracking-widest text-[var(--muted)]">TMDB {filmOfDay.tmdbRating}</p>
                ) : null}
                {filmOfDay.type === "film_of_day" && filmOfDay.whyItMatters ? (
                  <p className="mt-3 text-sm leading-6">{filmOfDay.whyItMatters}</p>
                ) : null}
              </>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">Loading today&apos;s pick...</p>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
            <h2 className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Your Saved Cards</h2>
            <p className="mt-2 font-head text-5xl text-[var(--accent)]">{groupedCount}</p>
            <Link href="/saved" className="mt-3 inline-block text-sm underline-offset-4 hover:underline">
              Open collection
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
