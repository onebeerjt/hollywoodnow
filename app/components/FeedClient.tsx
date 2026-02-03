"use client";

import { useMemo, useState } from "react";
import Article from "./Article";

type FeedArticle = {
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

export default function FeedClient({ articles }: { articles: FeedArticle[] }) {
  const [view, setView] = useState<ViewMode>("this-year");
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from(
        new Set(articles.map((article) => article.year))
      ).sort((a, b) => a - b),
    [articles]
  );
  const [randomYear, setRandomYear] = useState<number | null>(
    years.length ? years[Math.floor(Math.random() * years.length)] : null
  );

  const handleViewChange = (next: ViewMode) => {
    if (next === "random") {
      const nextYear = years.length
        ? years[Math.floor(Math.random() * years.length)]
        : null;
      setRandomYear(nextYear);
    }
    setView(next);
  };

  const filtered = useMemo(() => {
    if (view === "this-year") {
      const thisYear = articles.filter((article) => article.year === currentYear);
      return thisYear.length > 0 ? thisYear : articles;
    }

    if (view === "random") {
      if (!randomYear) {
        return articles;
      }
      const byYear = articles.filter((article) => article.year === randomYear);
      return byYear.length ? shuffle(byYear) : articles;
    }

    return articles;
  }, [articles, currentYear, randomYear, view]);

  const byDecade = useMemo(() => {
    const groups: Record<string, FeedArticle[]> = {};
    filtered.forEach((article) => {
      const decade = `${Math.floor(article.year / 10) * 10}s`;
      groups[decade] = groups[decade] || [];
      groups[decade].push(article);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <main className="feed">
      <div className="feed__controls">
        {Object.entries(viewLabels).map(([key, label]) => {
          const isActive = view === key;
          return (
            <button
              key={key}
              className={`feed__control ${isActive ? "is-active" : ""}`}
              type="button"
              onClick={() => handleViewChange(key as ViewMode)}
            >
              {label}
            </button>
          );
        })}
        {view === "random" && randomYear ? (
          <span className="feed__control-info">{randomYear}</span>
        ) : null}
      </div>

      {view === "by-decade"
        ? byDecade.flatMap(([decade, decadeArticles]) => [
            <section className="feed__item feed__decade" key={`${decade}-title`}>
              <div className="decade-card">
                <p className="decade-card__label">Edition</p>
                <h2 className="decade-card__title">{decade}</h2>
                <p className="decade-card__note">Swipe to browse stories</p>
              </div>
            </section>,
            ...decadeArticles.map((article) => (
              <section
                className="feed__item"
                key={`${decade}-${article.title}-${article.year}`}
              >
                <Article {...article} />
              </section>
            ))
          ])
        : filtered.map((article) => (
            <section
              className="feed__item"
              key={`${article.title}-${article.year}`}
            >
              <Article {...article} />
            </section>
          ))}
    </main>
  );
}
