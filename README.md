# The Reel

The Reel is a Next.js 14 editorial feed for film history obsessives: infinite-scroll cards, director retrospectives, Hollywood lore, box office milestones, and AI-generated deep dives.

No current news, no social discourse cycles, just timeless cinema culture.

## Concept

The home feed mixes multiple content card types:

- On This Day (Wikipedia + optional TMDB poster)
- Fact cards (short punchy history facts)
- Deep Dive cards (expand inline and full reader mode)
- Director spotlight cards (TMDB career timeline)
- Film of the Day (daily pinned classic/cult title)
- Box office history cards
- Hollywood lore / feud cards

The order is randomized daily and paginated at 10 cards per request.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- Claude API (Anthropic Messages API)
- TMDB API
- Wikipedia On This Day API
- Vercel KV (with graceful local fallback)
- `localStorage` for saved cards

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required keys:

- `ANTHROPIC_API_KEY`
- `TMDB_API_KEY`
- `KV_URL` (or Upstash-compatible Vercel KV vars)
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

If keys are missing, the app still runs with seeded fallback content.

## Getting API Keys

### Anthropic
1. Create/sign in at [Anthropic Console](https://console.anthropic.com/).
2. Create an API key.
3. Add it as `ANTHROPIC_API_KEY`.

### TMDB
1. Create/sign in at [TMDB](https://www.themoviedb.org/).
2. Go to account settings API section.
3. Create a v3 API key.
4. Add it as `TMDB_API_KEY`.

### Vercel KV / Upstash
1. Create a KV database in [Vercel Storage](https://vercel.com/docs/storage/vercel-kv).
2. Copy connection vars into `.env.local`.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

### Pages
- `/` Feed
- `/saved` Saved collection with export digest
- `/read/[slug]` Deep dive reader
- `/directors` Director archive by era
- `/directors/[id]` Director spotlight detail

### API
- `GET /api/feed?page=&filter=`
- `GET /api/onthisday`
- `GET /api/generate/fact?topic=`
- `GET /api/generate/deepdive?topic=`
- `GET /api/director/[id]`
- `GET /api/filmoftheday`

## AI Generation + Caching

Claude model: `claude-sonnet-4-20250514`

Used for:

- Deep Dive article body generation
- Film of the Day "Why It Matters" blurbs
- Topic fact generation endpoint

Caching behavior:

- Cache key namespaced by content type + slugified topic/title
- First attempts Vercel KV
- Falls back to in-memory cache for local/dev robustness

## Seed Content

Seed source:

- `data/seed-content.json`

Includes:

- 30 facts
- 15 lore stories
- 20 directors with TMDB IDs
- 100 curated film titles for rotation
- Deep-dive topic queue
- Box office history entries

### Customizing Content

Edit `data/seed-content.json`:

- Add fact/lore entries
- Update director IDs/eras/fun facts
- Add or reorder film rotation list
- Add deep dive topics for new editorial prompts

## Visual Modes

Two themes are included:

- Dark Mode (default): near-black palette, gold accents, grain texture
- Broadsheet Mode: cream paper palette and ink-toned typography

Theme is stored in local storage.

## Deployment (Vercel)

1. Push repo to GitHub/GitLab/Bitbucket.
2. Import in [Vercel](https://vercel.com/new).
3. Set environment variables in Project Settings.
4. Deploy.

The app is fully App Router compatible and can run as a single Vercel deployment.
