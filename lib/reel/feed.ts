import { fetchOnThisDayCards } from "@/lib/reel/on-this-day";
import { generateWhyItMatters } from "@/lib/reel/anthropic";
import { getFilmRatingById } from "@/lib/reel/tmdb";
import { seedContent } from "@/lib/reel/seed";
import type {
  BoxOfficeCard,
  DeepDiveCard,
  DirectorSpotlightCard,
  FactCard,
  FeedFilter,
  FilmOfDayCard,
  LoreCard,
  ReelCard
} from "@/lib/reel/types";
import { seededShuffle, slugify } from "@/lib/reel/utils";

const PAGE_SIZE = 10;

function buildStaticCards(seed: number): ReelCard[] {
  const facts: FactCard[] = seedContent.facts.map((fact) => ({
    id: fact.id,
    type: "fact",
    title: fact.title,
    summary: fact.body,
    tags: fact.tags,
    topic: fact.topic,
    image: null
  }));

  const lore: LoreCard[] = seedContent.lore.map((item) => ({
    id: item.id,
    type: "lore",
    title: item.title,
    summary: item.body,
    era: item.era,
    tags: item.tags,
    image: null
  }));

  const directors: DirectorSpotlightCard[] = seedContent.directors.map((director) => ({
    id: `director-${director.id}`,
    type: "director_spotlight",
    title: `${director.name} Spotlight`,
    summary: director.funFact,
    directorId: director.id,
    directorName: director.name,
    era: director.era,
    funFact: director.funFact,
    image: null
  }));

  const dives: DeepDiveCard[] = seedContent.deepDiveTopics.map((topic, index) => ({
    id: `deep-${index + 1}`,
    type: "deep_dive",
    title: topic,
    summary: `Editorial deep dive queued: ${topic}`,
    topic,
    readTimeMinutes: 3,
    slug: slugify(topic),
    image: null
  }));

  const boxOffice: BoxOfficeCard[] = seedContent.boxOfficeHistory.map((entry) => ({
    id: entry.id,
    type: "box_office",
    title: entry.title,
    summary: `${entry.gross} · ${entry.context}`,
    year: entry.year,
    gross: entry.gross,
    context: entry.context,
    tags: ["BoxOffice"],
    image: null
  }));

  return ensureAlternatingTypes(seededShuffle([...facts, ...lore, ...directors, ...dives, ...boxOffice], seed));
}

function ensureAlternatingTypes(cards: ReelCard[]): ReelCard[] {
  const output: ReelCard[] = [];
  for (const card of cards) {
    if (!output.length || output[output.length - 1]?.type !== card.type) {
      output.push(card);
      continue;
    }

    const swapIndex = cards.findIndex((candidate) => candidate.type !== card.type && !output.includes(candidate));
    if (swapIndex >= 0) {
      output.push(cards[swapIndex]);
      output.push(card);
    } else {
      output.push(card);
    }
  }

  const deduped = new Map(output.map((item) => [item.id, item]));
  return [...deduped.values()];
}

export async function getFilmOfDayCard(): Promise<FilmOfDayCard> {
  const now = new Date();
  const dayKey = Number(now.toISOString().slice(0, 10).replace(/-/g, ""));
  const index = dayKey % seedContent.filmOfDay.length;
  const film = seedContent.filmOfDay[index];

  const [whyItMatters, tmdbRating] = await Promise.all([
    generateWhyItMatters(film.title).catch(() => `${film.title} captures a key transition point in film history and remains a touchstone for directors who followed.`),
    getFilmRatingById(film.tmdbId).catch(() => null)
  ]);

  return {
    id: `film-day-${dayKey}`,
    type: "film_of_day",
    title: `Film of the Day: ${film.title}`,
    summary: `${film.year} · Directed by ${film.director}`,
    film,
    whyItMatters,
    tmdbRating,
    image: null
  };
}

export async function getFeedPage(page = 1, filter: FeedFilter = "all"): Promise<{ page: number; pageSize: number; hasMore: boolean; items: ReelCard[] }> {
  const seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const staticCards = buildStaticCards(seed);
  const onThisDayCards = page <= 2 ? await fetchOnThisDayCards(4) : [];

  const allCards = ensureAlternatingTypes(seededShuffle([...staticCards, ...onThisDayCards], seed + page));

  const filtered =
    filter === "all"
      ? allCards
      : allCards.filter((card) => {
          if (filter === "director_spotlight") return card.type === "director_spotlight";
          if (filter === "on_this_day") return card.type === "on_this_day";
          return card.type === filter;
        });

  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return {
    page,
    pageSize: PAGE_SIZE,
    hasMore: start + PAGE_SIZE < filtered.length,
    items
  };
}
