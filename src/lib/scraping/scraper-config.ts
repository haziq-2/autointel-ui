import { ACTIVE_SCRAPERS, SCRAPING_JOBS } from "@/lib/mock-data/scrapers";

export const SCRAPE_DURATION_SEC = 60;

export interface ScrapeContext {
  id: string;
  title: string;
  marketplace: string;
  location: string;
  sourceId?: string;
}

export function resolveScrapeContext(id: string, city?: string): ScrapeContext {
  const location = city ? `${city} · 50 mi` : "Select city";

  const source = ACTIVE_SCRAPERS.find((s) => s.id === id);
  if (source) {
    return {
      id,
      title: source.name,
      marketplace: source.name,
      location,
      sourceId: source.id,
    };
  }

  const job = SCRAPING_JOBS.find((j) => j.id === id);
  if (job) {
    return {
      id,
      title: job.name,
      marketplace: job.marketplace,
      location: city ? `${city} · 50 mi` : job.location,
    };
  }

  return {
    id,
    title: "Scraping job",
    marketplace: "Facebook Marketplace",
    location,
  };
}

export const ALL_SOURCE_IDS = ACTIVE_SCRAPERS.map((s) => s.id);

const MESSAGE_TEMPLATES: Record<string, string[]> = {
  facebook: [
    "Scanning Facebook Marketplace — {city}",
    "Found 2022 Toyota Tacoma in {city} — $28,900",
    "New listing in {city}: 2021 Ford F-150 — $31,200",
    "Parsed seller profile in {city}",
  ],
  craigslist: [
    "Fetching Craigslist feed — {city}",
    "Found 2019 Chevy Silverado in {city} — $26,400",
    "Matched private seller in {city}",
    "Enriched listing from {city}",
  ],
  cargurus: [
    "Loading CarGurus results — {city}",
    "Found 2020 Honda CR-V in {city} — $24,800",
    "Dealer listing updated in {city}",
    "Scanned result pages for {city}",
  ],
};

export function getActivityMessages(sourceId: string, city: string): string[] {
  const templates =
    MESSAGE_TEMPLATES[sourceId] ?? [
      "Scanning listings in {city}",
      "New vehicle found in {city}",
      "Indexing listing in {city}",
      "Updating records for {city}",
    ];
  return templates.map((t) => t.replace(/\{city\}/g, city));
}
