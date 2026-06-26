import type { ScrapingJob, ScraperSource } from "@/lib/types";

export const ACTIVE_SCRAPERS: ScraperSource[] = [
  { id: "facebook", name: "Facebook Marketplace", status: "running", lastRun: "2 min ago", vehiclesFound: 1842, successRate: 98.2 },
  { id: "craigslist", name: "Craigslist", status: "idle", lastRun: "18 min ago", vehiclesFound: 924, successRate: 96.4 },
  { id: "autotrader", name: "AutoTrader", status: "running", lastRun: "1 min ago", vehiclesFound: 3210, successRate: 99.1 },
];

export const SCRAPING_JOBS: ScrapingJob[] = [
  {
    id: "job-1",
    name: "Dallas Trucks",
    marketplace: "Facebook Marketplace",
    searchCriteria: "Ford F-150, Ram 1500 · 2018–2024",
    location: "Dallas, TX · 50 mi",
    frequency: "Every 30 min",
    status: "running",
    vehiclesFound: 428,
    lastRun: "2 min ago",
    startedAt: "Today, 8:14 AM",
    duration: "12m 40s",
  },
  {
    id: "job-2",
    name: "Austin SUVs",
    marketplace: "AutoTrader",
    searchCriteria: "Toyota RAV4, Honda CR-V · Under $30k",
    location: "Austin, TX · 75 mi",
    frequency: "Every 1 hr",
    status: "completed",
    vehiclesFound: 312,
    lastRun: "48 min ago",
    startedAt: "Today, 7:00 AM",
    duration: "8m 12s",
  },
  {
    id: "job-3",
    name: "Houston Craigslist",
    marketplace: "Craigslist",
    searchCriteria: "All makes · Private sellers",
    location: "Houston, TX · 40 mi",
    frequency: "Every 2 hr",
    status: "scheduled",
    vehiclesFound: 186,
    lastRun: "3 hr ago",
    startedAt: "Yesterday, 4:22 PM",
    duration: "15m 08s",
  },
];

export const RECENT_JOBS = SCRAPING_JOBS.slice(0, 5);

export const LIVE_ACTIVITY_MESSAGES = [
  "Found 2022 Toyota Tacoma in Dallas, TX — $28,900",
  "Detected price drop on 2021 Ford F-150 — now $31,200",
  "New listing: 2020 Honda CR-V in Austin — $24,800",
  "Scanned page 142 of Facebook Marketplace results",
  "Found 2019 Chevy Silverado in Houston — $26,400",
  "Price change: 2023 Tesla Model Y dropped $1,200",
  "New private seller listing in Fort Worth — 2021 Ram 1500",
  "Matched criteria: 2022 Jeep Wrangler in Denver",
];
