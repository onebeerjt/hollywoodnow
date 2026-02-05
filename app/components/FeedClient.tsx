"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Article from "./Article";

type FeedArticle = {
  id: string;
  title: string;
  year: number;
  source: string;
  summary: string;
  publishedAt?: string;
  url?: string;
};

type ViewMode = "this-year" | "random" | "by-decade";

const viewLabels: Record<ViewMode, string> = {
  "this-year": "This Year",
  random: "Random",
  "by-decade": "By Decade"
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function mixByDecade(items: FeedArticle[]) {
  const groups = new Map<number, FeedArticle[]>();
  let maxDecade = 0;

  items.forEach((article) => {
    const decade = Math.floor(article.year / 10) * 10;
    maxDecade = Math.max(maxDecade, decade);
    const bucket = groups.get(decade) ?? [];
    bucket.push(article);
    groups.set(decade, bucket);
  });

  for (const [decade, bucket] of groups.entries()) {
    groups.set(decade, shuffle(bucket));
  }

  const result: FeedArticle[] = [];
  const decadeKeys = Array.from(groups.keys());

  while (decadeKeys.some((decade) => (groups.get(decade) ?? []).length > 0)) {
    const weighted = decadeKeys
      .map((decade) => {
        const remaining = groups.get(decade)?.length ?? 0;
        if (remaining === 0) {
          return null;
        }
        const ageBoost = 1 + (maxDecade - decade) / 100;
        const weight = remaining * ageBoost;
        return { decade, weight };
      })
      .filter(Boolean) as Array<{ decade: number; weight: number }>;

    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;

    for (const entry of weighted) {
      roll -= entry.weight;
      if (roll <= 0) {
        const bucket = groups.get(entry.decade) ?? [];
        const next = bucket.shift();
        if (next) {
          result.push(next);
        }
        break;
      }
    }
  }

  return result;
}

export default function FeedClient({ articles }: { articles: FeedArticle[] }) {
  const initialVisible = 6;
  const batchSize = 3;
  const [view, setView] = useState<ViewMode>("this-year");
  const [seed, setSeed] = useState(0);
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [homeDecade, setHomeDecade] = useState<string>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const currentYear = new Date().getFullYear();

  const decades = useMemo(
    () =>
      Array.from(new Set(articles.map((article) => `${Math.floor(article.year / 10) * 10}s`))).sort(
        (a, b) => Number(b.slice(0, 4)) - Number(a.slice(0, 4))
      ),
    [articles]
  );

  useEffect(() => {
    if (decades.length > 0 && !selectedDecade) {
      setSelectedDecade(decades[0]);
    }
  }, [decades, selectedDecade]);

  const randomized = useMemo(() => mixByDecade(shuffle(articles)), [articles, seed]);

  const feed = useMemo(() => {
    if (view === "this-year") {
      const decadeFilter =
        homeDecade === "all" ? null : Number(homeDecade.replace("s", ""));
      const base = decadeFilter
        ? randomized.filter(
            (article) => article.year >= decadeFilter && article.year <= decadeFilter + 9
          )
        : randomized;
      const thisYear = base.filter((article) => article.year === currentYear);
      const rest = base.filter((article) => article.year !== currentYear);
      return [...shuffle(thisYear), ...rest];
    }

    if (view === "by-decade" && selectedDecade) {
      const baseYear = Number(selectedDecade.slice(0, 4));
      return randomized.filter((article) => article.year >= baseYear && article.year <= baseYear + 9);
    }

    return randomized;
  }, [currentYear, homeDecade, randomized, selectedDecade, view]);

  const visibleArticles = useMemo(() => feed.slice(0, visibleCount), [feed, visibleCount]);

  useEffect(() => {
    setVisibleCount(initialVisible);
  }, [view, selectedDecade, seed, homeDecade]);

  const handleViewChange = (next: ViewMode) => {
    setView(next);
    setSeed(Math.random());
    if (next === "by-decade" && decades.length > 0) {
      const randomDecade = decades[Math.floor(Math.random() * decades.length)];
      setSelectedDecade(randomDecade);
    }
  };

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }
        setVisibleCount((count) => Math.min(count + batchSize, feed.length));
      },
      { rootMargin: "220px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [feed.length]);

  return (
    <main className="feed">
      <header className="feed__header">
        <div className="feed__controls" role="tablist" aria-label="Feed Views">
          {Object.entries(viewLabels).map(([key, label]) => {
            const isActive = view === key;
            return (
              <button
                key={key}
                className={`feed__control ${isActive ? "is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleViewChange(key as ViewMode)}
              >
                {label}
              </button>
            );
          })}
        </div>
        {view === "this-year" ? (
          <div className="feed__filter">
            <label className="feed__filter-label" htmlFor="home-decade">
              Decade
            </label>
            <select
              id="home-decade"
              className="feed__filter-select"
              value={homeDecade}
              onChange={(event) => {
                setHomeDecade(event.target.value);
                setSeed(Math.random());
              }}
            >
              <option value="all">All decades</option>
              {decades.map((decade) => (
                <option key={decade} value={decade}>
                  {decade}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {view === "by-decade" ? (
          <div className="feed__decade-pills" aria-label="Choose decade">
            {decades.map((decade) => (
              <button
                key={decade}
                type="button"
                className={`feed__decade-pill ${selectedDecade === decade ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedDecade(decade);
                  setSeed(Math.random());
                }}
              >
                {decade}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <section className="feed__list">
        {visibleArticles.map((article) => (
          <Article key={article.id} {...article} />
        ))}
      </section>

      <div className="feed__sentinel" ref={sentinelRef} aria-hidden />
    </main>
  );
}
