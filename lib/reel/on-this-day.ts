import { searchMoviePoster } from "@/lib/reel/tmdb";
import type { OnThisDayCard } from "@/lib/reel/types";

type WikiEvent = {
  year: number;
  text: string;
  pages?: Array<{ normalizedtitle?: string }>;
};

function looksFilmRelated(text: string): boolean {
  return /(film|cinema|movie|director|actor|actress|premiere|released|screened|academy awards|hollywood)/i.test(text);
}

function extractMovieTitle(text: string): string | undefined {
  const quoted = text.match(/[“\"]([^\"”]{2,})[”\"]/);
  if (quoted?.[1]) return quoted[1];

  const titleCase = text.match(/\b([A-Z][\w'’-]+(?:\s+[A-Z][\w'’-]+){1,4})\b/);
  return titleCase?.[1];
}

export async function fetchOnThisDayCards(limit = 4): Promise<OnThisDayCard[]> {
  try {
    const today = new Date();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 12 } });

    if (!res.ok) return [];

    const data = (await res.json()) as { events: WikiEvent[] };

    const events = data.events
      .filter((item) => looksFilmRelated(item.text))
      .slice(0, limit);

    const dateLabel = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

    const cards = await Promise.all(
      events.map(async (event, index) => {
        const movieTitle = extractMovieTitle(event.text);
        const poster = movieTitle ? await searchMoviePoster(movieTitle) : null;

        return {
          id: `otd-${month}-${day}-${index}`,
          type: "on_this_day",
          title: `On this day in ${event.year}`,
          summary: event.text,
          dateLabel,
          year: event.year,
          event: event.text,
          movieTitle,
          image: poster
        } satisfies OnThisDayCard;
      })
    );

    return cards;
  } catch {
    return [];
  }
}
