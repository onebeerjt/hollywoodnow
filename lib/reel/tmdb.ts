import type { DirectorFilm, DirectorSpotlightPayload } from "@/lib/reel/types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export function tmdbImage(path?: string | null): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}${path}`;
}

async function tmdbFetch<T>(path: string): Promise<T | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  const res = await fetch(`${TMDB_BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${key}`, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function searchMoviePoster(movieTitle: string): Promise<string | null> {
  const data = await tmdbFetch<{ results: Array<{ poster_path?: string | null }> }>(
    `/search/movie?query=${encodeURIComponent(movieTitle)}`
  );
  return tmdbImage(data?.results?.[0]?.poster_path ?? null);
}

export async function getFilmRatingById(id?: number): Promise<number | null> {
  if (!id) return null;
  const data = await tmdbFetch<{ vote_average?: number }>(`/movie/${id}`);
  if (!data?.vote_average) return null;
  return Number(data.vote_average.toFixed(1));
}

export async function getDirectorSpotlight(id: number, funFact: string): Promise<DirectorSpotlightPayload | null> {
  const [person, credits] = await Promise.all([
    tmdbFetch<{
      id: number;
      name: string;
      biography?: string;
      profile_path?: string | null;
      known_for_department?: string;
    }>(`/person/${id}`),
    tmdbFetch<{ crew: DirectorFilm[] }>(`/person/${id}/movie_credits`)
  ]);

  if (!person) return null;

  const timeline = (credits?.crew ?? [])
    .filter((credit) => Boolean(credit.release_date) && Boolean(credit.title))
    .sort((a, b) => (a.release_date ?? "").localeCompare(b.release_date ?? ""))
    .slice(-12);

  return {
    ...person,
    timeline,
    quote: `${person.name} treated cinema as a dialogue between craft and obsession.`,
    funFact
  };
}
