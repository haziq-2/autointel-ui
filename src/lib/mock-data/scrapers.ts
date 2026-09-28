import type { ScrapingJob, ScraperSource } from "@/lib/types";

export const ACTIVE_SCRAPERS: ScraperSource[] = [
  {
    id: "craigslist",
    name: "Craigslist",
    status: "healthy",
    lastRun: "9 min ago",
    vehiclesFound: 27565,
    successRate: 97.4,
  },
  {
    id: "facebook",
    name: "Facebook Marketplace",
    status: "running",
    lastRun: "11 min ago",
    vehiclesFound: 22273,
    successRate: 98.1,
  },
  {
    id: "offerup",
    name: "OfferUp",
    status: "healthy",
    lastRun: "5 min ago",
    vehiclesFound: 17943,
    successRate: 97.1,
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
    vehiclesFound: 27565,
    lastRun: "9 min ago",
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
    vehiclesFound: 22273,
    lastRun: "11 min ago",
    startedAt: "Today, 8:14 AM",
    duration: "11m 18s",
  },
  {
    id: "job-3",
    name: "Dallas OfferUp",
    marketplace: "OfferUp",
    searchCriteria: "Cars & trucks · Regional",
    location: "Dallas, TX · 50 mi",
    frequency: "Every 1 hr",
    status: "completed",
    vehiclesFound: 17943,
    lastRun: "5 min ago",
    startedAt: "Today, 8:05 AM",
    duration: "6m 22s",
  },
];

export const RECENT_JOBS = SCRAPING_JOBS.slice(0, 5);

export const LIVE_ACTIVITY_MESSAGES = [
  "Craigslist sync — 27,565 vehicles tracked",
  "Facebook Marketplace sync — 22,273 vehicles tracked",
  "OfferUp sync — 17,943 vehicles tracked",
  "Vehicle catalog refreshed from listings.csv",
  "Image URLs attached for active listings",
];
