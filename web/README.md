# AutoIntel AI

Vehicle marketplace scraping and acquisition intelligence platform.

## Quick Start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Operational dashboard |
| `/scrapers` | Scraper management |
| `/scrapers/new` | Create scraper wizard |
| `/scrapers/[id]/live` | Live scraping view |
| `/vehicles` | Vehicle data table (5,000+ records) |
| `/vehicles/[id]` | Vehicle detail |
| `/opportunities` | Saved opportunities kanban |
| `/ai-analysis` | AI acquisition analysis |
| `/reports` | Export reports |
| `/settings` | Workspace settings |

## Stack

Next.js · React · TypeScript · Tailwind CSS · shadcn/ui · Lucide

Mock data: `src/lib/mock-data/` — 5,247 procedurally generated vehicles with pagination and filters.
