import FeedClient from "./components/FeedClient";

type GNewsArticle = {
  title: string;
  description?: string;
  content?: string;
  publishedAt?: string;
  url?: string;
  source?: { name?: string };
};

type GNewsResponse = {
  articles: GNewsArticle[];
};

function trimSummary(text: string, limit = 520) {
  if (text.length <= limit) {
    return text;
  }
  const clipped = text.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : limit)}…`;
}

const fallbackArticles = [
  {
    title: "Studio Backlots Open to the Public",
    year: 1991,
    source: "Hollywood Gazette",
    summary:
      "A summer initiative invites residents behind the scenes, turning iconic sound stages into open-air exhibits and reviving interest in practical sets.",
    url: "https://example.com/hollywood-gazette"
  },
  {
    title: "A New Age of Movie Palaces",
    year: 2004,
    source: "West Coast Chronicle",
    summary:
      "Historic theaters reopen with restored marquees and live orchestras, anchoring neighborhood nights with a grand, old-world glow.",
    url: "https://example.com/west-coast-chronicle"
  },
  {
    title: "Writers Find a Home in Silver Lake",
    year: 2012,
    source: "City Arts Journal",
    summary:
      "A once-quiet district becomes a hub for screenwriters, cafes, and public readings, shaping a new creative corridor in the city.",
    url: "https://example.com/city-arts-journal"
  }
];

async function getArticles() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return fallbackArticles;
  }

  const baseParams = {
    lang: "en",
    country: "us",
    max: "10",
    sortby: "relevance",
    in: "title,description",
    apikey: apiKey
  };

  const queries = [
    "hollywood OR film OR movie OR cinema",
    "\"golden age\" hollywood OR classic hollywood",
    "\"1950s\" hollywood OR \"old hollywood\" OR \"film noir\""
  ];

  try {
    const responses = await Promise.all(
      queries.map(async (query) => {
        const params = new URLSearchParams({
          ...baseParams,
          q: query,
          from: "1950-01-01T00:00:00Z"
        });

        const response = await fetch(`https://gnews.io/api/v4/search?${params}`, {
          next: { revalidate: 600 }
        });

        if (!response.ok) {
          return [] as GNewsArticle[];
        }

        const data = (await response.json()) as GNewsResponse;
        return data.articles;
      })
    );

    const merged = responses.flat();
    if (merged.length === 0) {
      return fallbackArticles;
    }

    const seen = new Set<string>();

    return merged
      .filter((article) => {
        const key = `${article.title}-${article.publishedAt}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .map((article) => {
      const publishedAt = article.publishedAt
        ? new Date(article.publishedAt)
        : null;
      const year = publishedAt ? publishedAt.getFullYear() : new Date().getFullYear();
      const summarySource = article.content || article.description || "";
      const summary = summarySource.replace(/\\s*\\[\\+\\d+\\s+chars\\]\\s*$/i, "");

      return {
        title: article.title,
        year,
        source: article.source?.name ?? "Unknown Source",
        summary: summary ? trimSummary(summary) : "No summary available yet.",
        publishedAt: article.publishedAt,
        url: article.url
      };
    });
  } catch {
    return fallbackArticles;
  }
}

export default async function Home() {
  const articles = await getArticles();

  return <FeedClient articles={articles} />;
}
