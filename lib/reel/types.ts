export type ReelCardType =
  | "on_this_day"
  | "fact"
  | "deep_dive"
  | "director_spotlight"
  | "film_of_day"
  | "box_office"
  | "lore";

export type ReelTag =
  | "GoldenAge"
  | "ProductionLore"
  | "BoxOffice"
  | "DirectorLore"
  | "CineTech"
  | "NewHollywood"
  | "SilentEra"
  | "WorldCinema";

export type ReelFact = {
  id: string;
  topic: string;
  title: string;
  body: string;
  tags: ReelTag[];
};

export type ReelLore = {
  id: string;
  title: string;
  body: string;
  era: string;
  tags: ReelTag[];
};

export type DirectorSeed = {
  id: number;
  name: string;
  era: "Silent Era" | "Golden Age" | "New Hollywood" | "Contemporary";
  funFact: string;
};

export type FilmSeed = {
  title: string;
  year: number;
  director: string;
  tmdbId?: number;
};

export type BoxOfficeSeed = {
  id: string;
  title: string;
  year: number;
  gross: string;
  context: string;
};

export type SeedContent = {
  facts: ReelFact[];
  lore: ReelLore[];
  directors: DirectorSeed[];
  filmOfDay: FilmSeed[];
  deepDiveTopics: string[];
  boxOfficeHistory: BoxOfficeSeed[];
};

export type ReelCardBase = {
  id: string;
  type: ReelCardType;
  title: string;
  summary: string;
  tags?: string[];
  image?: string | null;
};

export type OnThisDayCard = ReelCardBase & {
  type: "on_this_day";
  dateLabel: string;
  year: number;
  event: string;
  movieTitle?: string;
};

export type FactCard = ReelCardBase & {
  type: "fact";
  topic: string;
};

export type DeepDiveCard = ReelCardBase & {
  type: "deep_dive";
  topic: string;
  readTimeMinutes: number;
  slug: string;
};

export type DirectorSpotlightCard = ReelCardBase & {
  type: "director_spotlight";
  directorId: number;
  directorName: string;
  era: string;
  funFact: string;
};

export type FilmOfDayCard = ReelCardBase & {
  type: "film_of_day";
  film: FilmSeed;
  whyItMatters?: string;
  tmdbRating?: number | null;
};

export type BoxOfficeCard = ReelCardBase & {
  type: "box_office";
  year: number;
  gross: string;
  context: string;
};

export type LoreCard = ReelCardBase & {
  type: "lore";
  era: string;
};

export type ReelCard =
  | OnThisDayCard
  | FactCard
  | DeepDiveCard
  | DirectorSpotlightCard
  | FilmOfDayCard
  | BoxOfficeCard
  | LoreCard;

export type FeedFilter = "all" | "fact" | "deep_dive" | "director_spotlight" | "on_this_day" | "lore";

export type DirectorFilm = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
};

export type DirectorSpotlightPayload = {
  id: number;
  name: string;
  biography?: string;
  profile_path?: string | null;
  known_for_department?: string;
  timeline: DirectorFilm[];
  funFact: string;
  quote: string;
};
