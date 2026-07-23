import type { ScrapingJob, ScraperSource } from "@/lib/types";

export const ACTIVE_SCRAPERS: ScraperSource[] = [
  { id: "facebook", name: "Facebook Marketplace", status: "running", lastRun: "2 min ago", vehiclesFound: 796, successRate: 98.2 },
  { id: "craigslist", name: "Craigslist", status: "idle", lastRun: "—", vehiclesFound: 0, successRate: 0 },
  { id: "autotrader", name: "AutoTrader", status: "idle", lastRun: "—", vehiclesFound: 0, successRate: 0 },
];

export const SCRAPING_JOBS: ScrapingJob[] = [
  {
    id: "job-1",
    name: "Dallas Facebook",
    marketplace: "Facebook Marketplace",
    searchCriteria: "All makes · Marketplace feed",
    location: "Dallas, TX · 50 mi",
    frequency: "Every 30 min",
    status: "running",
    vehiclesFound: 796,
    lastRun: "2 min ago",
    startedAt: "Today, 8:14 AM",
    duration: "12m 40s",
  },
];

export const RECENT_JOBS = SCRAPING_JOBS.slice(0, 5);

export const LIVE_ACTIVITY_MESSAGES = [
  "Facebook Marketplace sync — 796 vehicles tracked",
  "New Dallas listing indexed from Marketplace feed",
  "Scanned Facebook Marketplace results pages",
  "Detected recent Facebook Marketplace discoveries",
  "Vehicle catalog refreshed from listings.csv",
  "Image URLs attached for all active listings",
];
