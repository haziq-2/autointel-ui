import type {
  AlertCategory,
  AlertPriority,
  AlertType,
  AlertsDashboardStats,
  IntelligenceAlert,
} from "@/lib/types";
import { getAllVehicles, getSavedOpportunities } from "./generate-vehicles";

function seed(id: string | number) {
  const n = typeof id === "string" ? id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) : id;
  const x = Math.sin(n * 9999) * 10000;
  return x - Math.floor(x);
}

const MARKET_INTEL_TEMPLATES = [
  { subject: "Toyota Tacoma demand increased", change: 17, location: "Texas", direction: "up" as const },
  { subject: "Ford F-150 prices increased", change: 6, location: "Dallas", direction: "up" as const },
  { subject: "Honda Civic inventory rising", change: 11, location: "Houston", direction: "up" as const },
  { subject: "SUV demand index climbed", change: 14, location: "Austin", direction: "up" as const },
  { subject: "Truck margins expanded", change: 8, location: "Phoenix", direction: "up" as const },
  { subject: "EV segment cooling", change: 5, location: "Denver", direction: "down" as const },
  { subject: "Sedan days-to-sell decreased", change: 12, location: "Atlanta", direction: "down" as const },
  { subject: "Ram 1500 search volume surged", change: 19, location: "Charlotte", direction: "up" as const },
  { subject: "Private seller listings up", change: 9, location: "Nashville", direction: "up" as const },
  { subject: "Chevrolet Silverado supply tightened", change: 7, location: "Dallas", direction: "down" as const },
];

const SYSTEM_ALERTS = [
  { title: "Scraper sync completed", aiSummary: "Facebook Marketplace import finished — 142 new listings indexed." },
  { title: "CarGurus rate limit recovered", aiSummary: "Scraper resumed normal cadence after 12-minute throttle." },
  { title: "Weekly digest ready", aiSummary: "Acquisition summary for Texas region is available in Reports." },
  { title: "Watchlist threshold reached", aiSummary: "3 saved searches matched new listings today." },
  { title: "Data quality check passed", aiSummary: "All 3 active sources validated — 99.2% field completeness." },
  { title: "Craigslist Dallas job completed", aiSummary: "87 listings parsed in 4m 12s with zero errors." },
];

const SAVED_SEARCHES = [
  "Texas Trucks Under $30k",
  "SUVs Under $25k",
  "Private Seller Tacomas",
  "Dallas F-150 Deals",
  "Low Mileage Hondas",
];

function formatPostedAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function priorityFor(type: AlertType, score?: number): AlertPriority {
  if (type === "risk") return score && score > 70 ? "critical" : "high";
  if (type === "underpriced") return "high";
  if (type === "price_drop") return "high";
  if (type === "new_match") return "medium";
  if (type === "market_intel") return "medium";
  if (type === "watchlist") return "medium";
  return "low";
}

function buildVehicleAlerts(): IntelligenceAlert[] {
  const vehicles = getAllVehicles();
  const alerts: IntelligenceAlert[] = [];

  const underpriced = vehicles
    .filter((v) => (v.fairMarketValue ?? v.price * 1.1) > v.price * 1.05)
    .slice(0, 18);

  underpriced.forEach((v, i) => {
    const market = v.fairMarketValue ?? Math.round(v.price * 1.14);
    const savings = market - v.price;
    const minutes = 18 + i * 14;
    alerts.push({
      id: `alert-up-${i + 1}`,
      type: "underpriced",
      category: "price_drop",
      priority: "high",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 8,
      saved: i < 3,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: `Priced ${formatCurrencyShort(savings)} under regional market estimate.`,
      location: v.location,
      marketplace: v.marketplace,
      expectedProfit: savings,
      explanationBullets: [],
      relatedAlertIds: [],
      data: {
        currentPrice: v.price,
        marketValue: market,
        savings,
        priceHistory: v.priceHistory ?? buildPriceHistory(v.price, 3),
      },
    });
  });

  const priceDropVehicles = vehicles.filter((v) => v.priceHistory && v.priceHistory.length > 1).slice(0, 24);
  priceDropVehicles.forEach((v, i) => {
    const hist = v.priceHistory!;
    const previous = hist[hist.length - 2]?.price ?? v.price + 1500;
    const reduction = previous - v.price;
    const minutes = 8 + i * 9;
    alerts.push({
      id: `alert-pd-${i + 1}`,
      type: "price_drop",
      category: "price_drop",
      priority: "high",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 10,
      saved: false,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: `Seller reduced price by ${formatCurrencyShort(reduction)}.`,
      location: v.location,
      marketplace: v.marketplace,
      expectedProfit: v.marginPotential ?? Math.round(reduction * 1.4),
      explanationBullets: [],
      relatedAlertIds: [],
      data: {
        previousPrice: previous,
        currentPrice: v.price,
        reduction,
        priceHistory: hist.length > 2 ? hist : buildPriceHistory(v.price, 5),
      },
    });
  });

  const newMatches = vehicles.slice(40, 58);
  newMatches.forEach((v, i) => {
    const minutes = 5 + i * 6;
    alerts.push({
      id: `alert-nm-${i + 1}`,
      type: "new_match",
      category: "new_listing",
      priority: "medium",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 5,
      saved: i === 0,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: `Matches saved search "${SAVED_SEARCHES[i % SAVED_SEARCHES.length]}".`,
      location: v.location,
      marketplace: v.marketplace,
      expectedProfit: v.marginPotential ?? 3200,
      explanationBullets: [],
      relatedAlertIds: [],
      data: { savedSearch: SAVED_SEARCHES[i % SAVED_SEARCHES.length], price: v.price },
    });
  });

  MARKET_INTEL_TEMPLATES.forEach((t, i) => {
    const minutes = 45 + i * 18;
    const trend = Array.from({ length: 7 }, (_, j) => 50 + j * 3 + (t.direction === "up" ? j * 2 : -j));
    alerts.push({
      id: `alert-mi-${i + 1}`,
      type: "market_intel",
      category: "market_intel",
      priority: "medium",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 6,
      saved: false,
      title: t.subject,
      aiSummary: `${t.change}% ${t.direction === "up" ? "increase" : "decrease"} detected in ${t.location}.`,
      explanationBullets: [],
      relatedAlertIds: [],
      data: { change: t.change, location: t.location, direction: t.direction, subject: t.subject, trend },
    });
  });

  const riskVehicles = vehicles.filter((v) => v.mileage > 95000 || v.daysListed > 45).slice(0, 14);
  riskVehicles.forEach((v, i) => {
    const isRepair = i % 2 === 0;
    const minutes = 60 + i * 22;
    alerts.push({
      id: `alert-risk-${i + 1}`,
      type: "risk",
      category: "risk",
      priority: priorityFor("risk", isRepair ? 80 : 50),
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 5,
      saved: false,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: isRepair
        ? `Elevated repair risk — estimated reconditioning ${formatCurrencyShort(2800 + i * 200)}.`
        : `Projected holding time ${52 + i * 3} days exceeds acquisition target.`,
      location: v.location,
      marketplace: v.marketplace,
      explanationBullets: [],
      relatedAlertIds: [],
      data: isRepair
        ? { riskType: "repair", estimatedRepairs: 2800 + i * 200 }
        : { riskType: "holding", holdingDays: 52 + i * 3, targetDays: 28 },
    });
  });

  const watchlist = getSavedOpportunities().slice(0, 10);
  watchlist.forEach((v, i) => {
    const minutes = 90 + i * 25;
    alerts.push({
      id: `alert-wl-${i + 1}`,
      type: "watchlist",
      category: "watchlist",
      priority: "medium",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: true,
      saved: true,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: "Watchlist vehicle updated — price or listing details changed.",
      location: v.location,
      marketplace: v.marketplace,
      expectedProfit: v.marginPotential ?? 4100,
      explanationBullets: [],
      relatedAlertIds: [],
      data: {},
    });
  });

  SYSTEM_ALERTS.forEach((s, i) => {
    const minutes = 120 + i * 40;
    alerts.push({
      id: `alert-sys-${i + 1}`,
      type: "system",
      category: "system",
      priority: "low",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 2,
      saved: false,
      title: s.title,
      aiSummary: s.aiSummary,
      explanationBullets: [],
      relatedAlertIds: [],
      data: {},
    });
  });

  return alerts.sort((a, b) => a.minutesAgo - b.minutesAgo);
}

function formatCurrencyShort(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function buildPriceHistory(current: number, points: number) {
  const hist: { date: string; price: number }[] = [];
  for (let i = points - 1; i >= 0; i--) {
    hist.push({
      date: `2026-0${Math.min(6, 6 - Math.floor(i / 2))}-${10 + i}`,
      price: current + i * 350 + Math.round(seed(i) * 200),
    });
  }
  return hist;
}

export const INTELLIGENCE_ALERTS: IntelligenceAlert[] = buildVehicleAlerts();

export function getAlertsByCategory(category: AlertCategory): IntelligenceAlert[] {
  if (category === "all") return INTELLIGENCE_ALERTS;
  return INTELLIGENCE_ALERTS.filter((a) => a.category === category);
}

export function getUnreadCountByCategory(): Record<AlertCategory, number> {
  const counts: Record<string, number> = {
    all: INTELLIGENCE_ALERTS.filter((a) => !a.read).length,
    price_drop: 0,
    new_listing: 0,
    market_intel: 0,
    risk: 0,
    watchlist: 0,
    system: 0,
  };
  for (const a of INTELLIGENCE_ALERTS) {
    if (!a.read) counts[a.category]++;
  }
  return counts as Record<AlertCategory, number>;
}

export function getAlertById(id: string): IntelligenceAlert | undefined {
  return INTELLIGENCE_ALERTS.find((a) => a.id === id);
}

export const ALERTS_DASHBOARD_STATS: AlertsDashboardStats = {
  todayTotal: 42,
  highPriority: 8,
  priceDrops: 12,
  newListings: 6,
  negotiation: 0,
  highValueCount: 0,
  priceDropsKpi: 34,
  potentialSavings: 18200,
  negotiationCount: 0,
  avgAcceptance: 0,
  marketAlerts: 15,
  newTrends: 4,
  topOpportunity: {
    title: "2022 Toyota Tacoma TRD",
    vehicleId: INTELLIGENCE_ALERTS.find((a) => a.title.includes("Tacoma"))?.vehicleId ?? "v-2",
    roi: 0,
    confidence: 0,
  },
  highestRoi: {
    title: "",
    vehicleId: "",
    roi: 0,
  },
  mostActiveMarketplace: "Facebook Marketplace",
  highestDemandCity: "Dallas, TX",
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  high_value_opportunity: "Alert",
  underpriced: "Under Market Value",
  price_drop: "Price Drop",
  new_match: "New Match",
  high_roi: "Alert",
  negotiation: "Negotiation",
  market_intel: "Market Alert",
  risk: "Risk Alert",
  watchlist: "Watchlist",
  system: "System",
};

export const ALERT_MARKETPLACES = [
  "Facebook Marketplace",
  "Craigslist",
  "CarGurus",
];
export const ALERT_CITIES = [
  "Dallas",
  "Houston",
  "Austin",
  "Phoenix",
  "Denver",
  "Atlanta",
  "Charlotte",
  "Nashville",
  "San Antonio",
  "Fort Worth",
];
export const ALERT_MAKES = [
  "Ford",
  "Toyota",
  "Honda",
  "Chevrolet",
  "Ram",
  "Tesla",
  "Jeep",
  "Nissan",
  "Hyundai",
  "GMC",
];
