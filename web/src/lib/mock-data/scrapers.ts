import type { ScrapingJob, ScraperSource } from "@/lib/types";

export const ACTIVE_SCRAPERS: ScraperSource[] = [
  {
    id: "craigslist",
    name: "Craigslist",
    status: "healthy",
    lastRun: "12 min ago",
    vehiclesFound: 2714,
    successRate: 97.4,
  },
  {
    id: "facebook",
    name: "Facebook Marketplace",
    status: "running",
    lastRun: "2 min ago",
    vehiclesFound: 836,
    successRate: 98.2,
  },
  {
    id: "cargurus",
    name: "CarGurus",
    status: "healthy",
    lastRun: "28 min ago",
    vehiclesFound: 305,
    successRate: 96.1,
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
    vehiclesFound: 2714,
    lastRun: "12 min ago",
    startedAt: "Today, 8:02 AM",
    duration: "8m 14s",
  },
  {
    id: "job-2",
    name: "Dallas Facebook",
    marketplace: "Facebook Marketplace",
    searchCriteria: "All makes · Marketplace feed",
    location: "Dallas, TX · 50 mi",
    frequency: "Every 30 min",
    status: "running",
    vehiclesFound: 836,
    lastRun: "2 min ago",
    startedAt: "Today, 8:14 AM",
    duration: "12m 40s",
  },
  {
    id: "job-3",
    name: "Dallas CarGurus",
    marketplace: "CarGurus",
    searchCriteria: "Used vehicles · Regional",
    location: "Dallas, TX · 50 mi",
    frequency: "Hourly",
    status: "completed",
    vehiclesFound: 305,
    lastRun: "28 min ago",
    startedAt: "Today, 7:45 AM",
    duration: "6m 22s",
  },
];

export const RECENT_JOBS = SCRAPING_JOBS.slice(0, 5);

export const LIVE_ACTIVITY_MESSAGES = [
  "Craigslist sync — 2,714 vehicles tracked",
  "Facebook Marketplace sync — 836 vehicles tracked",
  "CarGurus sync — 305 vehicles tracked",
  "Vehicle catalog refreshed from listings.csv",
  "Image URLs attached for active listings",
  "New Dallas listing indexed from Marketplace feed",
];
