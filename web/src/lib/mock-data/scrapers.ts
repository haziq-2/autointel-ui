import type { ScrapingJob, ScraperSource } from "@/lib/types";

export const ACTIVE_SCRAPERS: ScraperSource[] = [
  {
    id: "craigslist",
    name: "Craigslist",
    status: "healthy",
    lastRun: "8 min ago",
    vehiclesFound: 3946,
    successRate: 97.4,
  },
  {
    id: "facebook",
    name: "Facebook Marketplace",
    status: "running",
    lastRun: "2 min ago",
    vehiclesFound: 1351,
    successRate: 98.1,
  },
  {
    id: "cargurus",
    name: "CarGurus",
    status: "healthy",
    lastRun: "18 min ago",
    vehiclesFound: 1553,
    successRate: 96.8,
  },
];

export const SCRAPING_JOBS: ScrapingJob[] = [
  {
    id: "job-1",
    name: "Dallas Craigslist",
    marketplace: "Craigslist",
    searchCriteria: "All makes · Local feed",
    location: "Dallas, TX · 50 mi",
    frequency: "Every 30 min",
    status: "completed",
    vehiclesFound: 3946,
    lastRun: "8 min ago",
    startedAt: "Today, 8:02 AM",
    duration: "9m 02s",
  },
  {
    id: "job-2",
    name: "Dallas Facebook",
    marketplace: "Facebook Marketplace",
    searchCriteria: "All makes · Marketplace feed",
    location: "Dallas, TX · 50 mi",
    frequency: "Every 30 min",
    status: "running",
    vehiclesFound: 1351,
    lastRun: "2 min ago",
    startedAt: "Today, 8:14 AM",
    duration: "11m 18s",
  },
  {
    id: "job-3",
    name: "Dallas CarGurus",
    marketplace: "CarGurus",
    searchCriteria: "Used vehicles · Regional",
    location: "Dallas, TX · 50 mi",
    frequency: "Hourly",
    status: "completed",
    vehiclesFound: 1553,
    lastRun: "18 min ago",
    startedAt: "Today, 7:50 AM",
    duration: "7m 41s",
  },
];

export const RECENT_JOBS = SCRAPING_JOBS.slice(0, 5);

export const LIVE_ACTIVITY_MESSAGES = [
  "Craigslist sync — 3,946 vehicles tracked",
  "Facebook Marketplace sync — 1,351 vehicles tracked",
  "CarGurus sync — 1,553 vehicles tracked",
  "Vehicle catalog refreshed from listings.csv",
  "Real make/model/VIN fields applied where available",
  "Image URLs attached for active listings",
];
