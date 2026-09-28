# AutoIntel AI (TripAI)

Dashboard for browsing scraped vehicle listings, seeing where they cluster across the United States, and reviewing acquisition signals.

The browser tab title is **AutoIntel AI**. The sidebar brand is **TripAI**. The npm package name is `car-listings-scraper-ui`.

This is a frontend-only Next.js app. There is no backend, database, authentication, or environment file. Listing data is a static JSON file generated from a CSV. Scraping, the AI assistant, the VIN decoder, and report downloads are simulated in the browser.

## Stack

| Layer | Used |
| --- | --- |
| Framework | Next.js 16 (App Router, `src/app`) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, `tw-animate-css` |
| Components | shadcn on Base UI (`@base-ui/react`) |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Map | `@svg-maps/usa` |
| Motion | `framer-motion` |
| Dates | `date-fns` |
| Fonts | Inter and Geist Mono via `next/font/google` |

`@/*` maps to `src/*`.

## Requirements

- Node.js 20.9 or newer
- npm

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `build` first) |
| `npm run ingest:listings` | Convert `listings.csv` into `src/lib/mock-data/listings.json` |

## Add data from a CSV

The dashboard, Vehicles, and Markets pages read `src/lib/mock-data/listings.json`. They do not read the CSV at runtime. `src/lib/mock-data/generate-vehicles.ts` imports that JSON and turns each row into a listing.

1. Put the file at the project root as `listings.csv`, or pass another path.
2. Regenerate the JSON:

```bash
npm run ingest:listings
# or:
node scripts/ingest-listings.mjs path/to/your-file.csv
```

3. Restart `npm run dev`. Next.js imports the JSON at compile time, so a running server will not pick up the new file until it restarts. A production deploy needs `npm run build` again.

The ingest script replaces `listings.json`. It does not merge with the existing JSON. To add rows, include them in the CSV and run ingest again. Duplicate listing IDs are dropped. Rows with fewer than 20 columns, or with an empty listing ID or title, are skipped. When it finishes, the script prints how many listings were written, how many were skipped, and the source counts.

Column 0 is ignored (the sample file uses a row number). Quoted fields that contain commas are fine.

| Column | Field |
| --- | --- |
| 1 | Source (`craigslist`, `facebook`, `cargurus`, `autotrader`) |
| 2 | Listing ID (required) |
| 3 | Title (required) |
| 4 | Price |
| 5 | Year |
| 6 | Make |
| 7 | Model |
| 8 | Mileage |
| 9 | Location |
| 10 | Seller |
| 11 | URL |
| 12 | Image URL |
| 13 | Posted time |
| 14 | VIN |
| 15 | Condition |
| 16 | Fuel |
| 17 | Transmission |
| 18 | First seen |
| 19 | Last seen |

Source names are normalized during ingest. In the UI, CarGurus and Autotrader listings are shown as OfferUp.

Other screens use hand-written fixtures in `src/lib/mock-data/` (scrapers, alerts, AI answers, scrape activity) and are not updated by the CSV.

## Pages

| Route | Screen |
| --- | --- |
| `/` | Dashboard: KPIs and charts |
| `/scrapers` | Data Collection: sources and jobs |
| `/scrapers/new` | New scraper form |
| `/scrapers/run-all` | Simulated run of every source |
| `/scrapers/[id]/live` | Live scrape feed for one source |
| `/vehicles` | Searchable listing table |
| `/vehicles/[id]` | Listing detail |
| `/markets` | Search plus US state heatmap |
| `/ai-analysis` | Chat UI with canned answers |
| `/alerts` | Alert list |
| `/alerts/rules` | Alert threshold settings |
| `/reports` | Report list (download buttons are display-only) |
| `/vin-decoder` | Local VIN lookup (not in the sidebar) |

Navigation is defined in `src/lib/constants.ts`. The sidebar, top bar, theme toggle, and command palette wrap every page.

Live scraping (`src/lib/scraping/use-scrape-simulation.ts`) is a 60-second client simulation. It replays vehicles already in the dataset and does not call marketplace sites. VIN decode (`src/lib/vin/client.ts`) returns two known sample VINs or a seeded fake decode. `00000000000000000` returns an error.

## Project layout

```
src/app/                  routes
src/components/ui/        shadcn / Base UI primitives
src/components/layout/    shell, sidebar, navbar, theme
src/components/dashboard/ charts
src/components/markets/   US heatmap
src/components/scraping/  scrape panels
src/components/alerts/    alerts UI
src/components/vin/       VIN form and result
src/lib/mock-data/        listings JSON and other fixtures
src/lib/geo/              state resolution and market summaries
src/lib/scraping/         scrape simulation
src/lib/vin/              local VIN decoder
src/lib/types.ts          shared types
scripts/ingest-listings.mjs
listings.csv              source export
```

## Production

```bash
npm run build
npm start
```

Ingest the CSV before building if the listings changed. `listings.json` is large, so the first compile can take a while. A standard Next.js host works; there are no server secrets or external services.
