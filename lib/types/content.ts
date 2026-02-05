export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
};

export type BlogPost = BlogPostSummary & {
  content: unknown;
};

export type NowPlayingTrack = {
  track: string;
  artist: string;
  album?: string;
  isPlaying: boolean;
  url?: string;
  playedAt?: string;
};

export type LatestFilm = {
  title: string;
  year?: string;
  letterboxdUrl: string;
  watchedAt?: string;
  posterUrl?: string;
};
