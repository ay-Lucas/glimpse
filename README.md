# Glimpse

TV & Movie discovery app with AI‑assisted recommendations, streaming availability, and fast, cached detail pages.

Live: https://glimpse.lucasanderson.dev

![Screenshot](./public/home_screenshot.png)

## Features

- Search people, movies, and series with rich, media‑forward results
- Title pages with seasons/episodes, cast and crew, trailers, reviews, and recommendations
- Streaming availability via JustWatch, alongside TMDB metadata and ratings
- AI recommendations from short “mood/vibe” prompts
- Watchlists (schema + server wiring) and authenticated, protected routes
- Fast loads with Server Components, ISR, LQIP placeholders, and Redis caching

## Stack

- Frontend: Next.js 14 (App Router, Server Components, ISR), React, TypeScript, Tailwind CSS, Radix UI/shadcn
- Backend & APIs: Node.js, Edge/Serverless routes, Zod validation, OpenAI API
- Data: PostgreSQL (Supabase), Drizzle ORM
- Caching: Upstash Redis (KV REST)
- Auth: Supabase Auth (JWT, RLS), SSR session handling
- Infra: Vercel (Edge Runtime), Docker (local), GitHub Actions (scheduled backfill)

## Architecture Overview

- App Router with colocated server components in `src/app`
  - Media routes under `src/app/(media)` for movies, TV, people
  - Edge API for AI ranking at `src/app/api/recommend/route.ts` (model: `gpt-4o-mini`)
- Data layer with Drizzle ORM (`src/db`) targeting Supabase Postgres
  - Tables for `movies`, `tv_shows`, `profiles`, `watchlist`, `watchlist_items`, and summaries
- Caching & performance
  - Upstash Redis via `src/services/cache.ts` for LQIP blur data, popular scores, and AI result payloads
  - Next/Image with placeholder blur and image domain rewrites (`next.config.mjs`)
  - ISR for detail pages plus on‑demand revalidation
- Security
  - SSR Auth via Supabase and protected routes in `src/middleware.ts`
  - Bot filtering allow/block lists and simple IP/route rate limiting (150 req/min) in `src/lib/rateLimit.ts`

## Getting Started

Prerequisites

- Node 20+ and npm

Install

```bash
npm install
```

Environment

Create `.env.local` and provide the following (use your own keys/secrets):

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
POSTGRES_URL=...                             # Supabase connection string
TMDB_ACCESS_TOKEN=...                        # TMDB v4 access token
KV_REST_API_URL=...                          # Upstash Redis REST URL
KV_REST_API_TOKEN=...                        # Upstash Redis REST token

# AI recommendations (optional locally)
OPENAI_API_KEY=...

# Revalidation/backfill
REVALIDATE_SECRET=...
SITE_URL=http://localhost:3000
```

Run dev server

```bash
npm run dev
```

## Scripts

- `npm run dev` — start Next.js in development
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run backfill` — populate Redis LQIP, DB summaries, popular people scores, and warm caches
- `npm run revalidate` — on‑demand revalidation of key pages (home, discover, popular IDs)

GitHub Actions runs a scheduled “Backfill and Revalidate” workflow (`.github/workflows/backfill.yml`).

## Caching Details

- Redis namespaces
  - `lqip:{movie|tv}:{id}` — BlurData for images
  - `popular:people` — Precomputed popularity score payload
  - `match:{sha1(tags)}` — AI recommendation results (24h TTL)
- Edge API (`/api/recommend`) caches AI output for 24h and filters for complete metadata before returning results.

## Security & Rate Limiting

- Supabase SSR auth with protected routes: signed‑in users redirected away from landing; unauthenticated users redirected to `/signin` for protected pages
- Bot handling: aggressive blocklist and allowlist for image optimization bypass
- Simple per‑IP, per‑route rate limiting: 150 requests/minute

## Deployment

- Vercel with `output: "standalone"` and Edge runtime for the AI API route
- Image config allows `image.tmdb.org` and `images.justwatch.com`; `/tmdb/:path*` rewrites to TMDB CDN
- Set all environment variables in Vercel Project Settings and connect Supabase and Upstash

## Attribution

This product uses the following data sources:

- [TMDB](https://www.themoviedb.org) — Movie & TV metadata
- [JustWatch](https://www.justwatch.com) — Streaming availability

These services are **not endorsed or certified** by either provider.

<p align="center">
  <a href="https://www.themoviedb.org/">
    <img src="./src/assets/tmdb-alt-long-logo.svg" alt="TMDB logo" width="200"/>
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.justwatch.com/">
    <img src="./src/assets/justwatch-logo.svg" alt="JustWatch logo" width="180"/>
  </a>
</p>
