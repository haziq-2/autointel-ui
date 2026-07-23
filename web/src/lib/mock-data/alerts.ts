import type {
  AlertCategory,
  AlertPriority,
  AlertType,
  AlertsAiSummary,
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
  { title: "AutoTrader rate limit recovered", aiSummary: "Scraper resumed normal cadence after 12-minute throttle." },
  { title: "Weekly digest ready", aiSummary: "Acquisition summary for Texas region is available in Reports." },
  { title: "Watchlist threshold reached", aiSummary: "3 saved searches exceeded 90+ opportunity score today." },
  { title: "Data quality check passed", aiSummary: "All 3 active sources validated — 99.2% field completeness." },
  { title: "Craigslist Dallas job completed", aiSummary: "87 listings parsed in 4m 12s with zero errors." },
  { title: "AI model refresh", aiSummary: "Opportunity scoring model v2.4 deployed — confidence +3%." },
];

const SAVED_SEARCHES = [
  "Texas Trucks Under $30k",
  "High ROI SUVs",
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
  if (type === "high_value_opportunity") return "critical";
  if (type === "high_roi" || type === "underpriced") return "high";
  if (type === "price_drop" || type === "negotiation") return "high";
  if (type === "new_match") return "medium";
  if (type === "market_intel") return "medium";
  if (type === "watchlist") return "medium";
  return "low";
}

function buildVehicleAlerts(): IntelligenceAlert[] {
  const vehicles = getAllVehicles();
  const alerts: IntelligenceAlert[] = [];
  let idx = 0;

  const highValueVehicles = [...vehicles]
    .filter((v) => v.opportunityScore >= 88)
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 22);

  for (const v of highValueVehicles) {
    const minutes = 3 + idx * 11;
    const profit = v.marginPotential ?? Math.round(v.price * 0.14);
    const pctBelow = Math.round(
      (((v.fairMarketValue ?? v.price * 1.12) - v.price) / v.price) * 100
    );
    alerts.push({
      id: `alert-hv-${idx + 1}`,
      type: "high_value_opportunity",
      category: "high_value",
      priority: "critical",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: idx > 6,
      saved: idx < 4,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: `${pctBelow}% below market with strong ${v.location.split(",")[1]?.trim() ?? "TX"} demand.`,
      location: v.location,
      marketplace: v.marketplace,
      opportunityScore: Math.min(99, v.opportunityScore + 2),
      expectedProfit: profit,
      explanationBullets: [
        `${Math.abs(pctBelow)}% below estimated market value`,
        "Strong regional demand",
        "Low repair risk",
        "Fast projected sale",
      ],
      relatedAlertIds: [],
      data: { trim: v.model, mileage: v.mileage, price: v.price },
    });
    idx++;
  }

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
      category: "high_value",
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
      opportunityScore: v.opportunityScore,
      expectedProfit: savings,
      explanationBullets: [
        "Below comparable listings",
        "Strong margin potential",
        "Active buyer interest",
      ],
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
      aiSummary: `Seller reduced price by ${formatCurrencyShort(reduction)} — negotiation window opening.`,
      location: v.location,
      marketplace: v.marketplace,
      opportunityScore: v.opportunityScore,
      expectedProfit: v.marginPotential ?? Math.round(reduction * 1.4),
      explanationBullets: [
        "Multiple price reductions detected",
        `Listed ${v.daysListed} days — seller may be motivated`,
        "Comparable inventory increasing nearby",
      ],
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
      opportunityScore: v.opportunityScore,
      expectedProfit: v.marginPotential ?? 3200,
      explanationBullets: ["New listing within search criteria", "Early acquisition window"],
      relatedAlertIds: [],
      data: { savedSearch: SAVED_SEARCHES[i % SAVED_SEARCHES.length], price: v.price },
    });
  });

  const roiVehicles = [...vehicles]
    .sort((a, b) => (b.marginPotential ?? 0) - (a.marginPotential ?? 0))
    .slice(0, 16);
  roiVehicles.forEach((v, i) => {
    const profit = v.marginPotential ?? 4800;
    const roi = Math.round((profit / v.price) * 100);
    const minutes = 25 + i * 12;
    alerts.push({
      id: `alert-roi-${i + 1}`,
      type: "high_roi",
      category: "high_value",
      priority: "high",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 7,
      saved: i < 2,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: `Projected ${roi}% ROI with ${14 + (i % 8)}-day expected sale cycle.`,
      location: v.location,
      marketplace: v.marketplace,
      opportunityScore: v.opportunityScore,
      expectedProfit: profit,
      explanationBullets: ["Top quartile ROI for segment", "Favorable holding cost profile"],
      relatedAlertIds: [],
      data: { roi, netProfit: profit, expectedSaleDays: 14 + (i % 8) },
    });
  });

  const negVehicles = vehicles.filter((v) => v.daysListed > 12).slice(0, 20);
  negVehicles.forEach((v, i) => {
    const s = seed(v.id + "neg");
    const firstOffer = Math.round(v.price * (0.9 + s * 0.04));
    const maxOffer = Math.round(v.price * (0.96 + s * 0.02));
    const acceptance = Math.min(92, Math.round(72 + v.daysListed * 0.6));
    const minutes = 32 + i * 10;
    alerts.push({
      id: `alert-neg-${i + 1}`,
      type: "negotiation",
      category: "negotiation",
      priority: "high",
      timestamp: new Date(Date.now() - minutes * 60000).toISOString(),
      postedAgo: formatPostedAgo(minutes),
      minutesAgo: minutes,
      read: i > 9,
      saved: false,
      vehicleId: v.id,
      title: `${v.year} ${v.make} ${v.model}`,
      aiSummary: `${acceptance}% seller acceptance probability — motivated listing at ${v.daysListed} days.`,
      location: v.location,
      marketplace: v.marketplace,
      opportunityScore: v.opportunityScore,
      expectedProfit: v.marginPotential ?? 3800,
      explanationBullets: [
        v.daysListed > 18 ? "Seller reduced asking price twice" : "Extended time on market",
        `Listed for ${v.daysListed} days`,
        "Comparable inventory increasing",
        "High probability of successful negotiation",
      ],
      relatedAlertIds: [],
      data: { acceptanceProbability: acceptance, recommendedOffer: firstOffer, maxOffer },
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
      explanationBullets: ["Regional demand shift", "AI confidence above 85%"],
      relatedAlertIds: [],
      data: { change: t.change, location: t.location, direction: t.direction, trend },
    });
  });

  const riskVehicles = vehicles.filter((v) => v.opportunityScore < 72 || v.mileage > 95000).slice(0, 14);
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
      opportunityScore: v.opportunityScore,
      explanationBullets: isRepair
        ? ["Above-average predicted repair costs", "Consider inspection before offer"]
        : ["Slow-moving segment in region", "Margin compression risk"],
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
      aiSummary: "Watchlist vehicle updated — score increased 4 points since last review.",
      location: v.location,
      marketplace: v.marketplace,
      opportunityScore: v.opportunityScore,
      expectedProfit: v.marginPotential ?? 4100,
      explanationBullets: ["On your watchlist", "Price stable over 7 days"],
      relatedAlertIds: [],
      data: { scoreChange: 4 },
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
    high_value: 0,
    price_drop: 0,
    new_listing: 0,
    negotiation: 0,
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

export const ALERTS_AI_SUMMARY: AlertsAiSummary = {
  vehiclesAnalyzed: 127,
  highValueCount: 18,
  roiIncrease: 6,
  marketInsight: "Toyota trucks remain the strongest buying opportunity across Texas.",
  priceDropsToday: 12,
  topRecommendation: {
    title: "2022 Ford F-150 XLT",
    vehicleId: INTELLIGENCE_ALERTS.find((a) => a.type === "high_value_opportunity")?.vehicleId ?? "v-1",
  },
};

export const ALERTS_DASHBOARD_STATS: AlertsDashboardStats = {
  todayTotal: 42,
  highPriority: 8,
  priceDrops: 12,
  newListings: 6,
  negotiation: 4,
  highValueCount: 18,
  priceDropsKpi: 34,
  potentialSavings: 18200,
  negotiationCount: 21,
  avgAcceptance: 82,
  marketAlerts: 15,
  newTrends: 4,
  topOpportunity: {
    title: "2022 Toyota Tacoma TRD",
    vehicleId: INTELLIGENCE_ALERTS.find((a) => a.title.includes("Tacoma"))?.vehicleId ?? "v-2",
    roi: 31,
    confidence: 94,
  },
  highestRoi: {
    title: "2021 Ford F-150 Lariat",
    vehicleId: INTELLIGENCE_ALERTS.find((a) => a.type === "high_roi")?.vehicleId ?? "v-3",
    roi: 34,
  },
  mostActiveMarketplace: "Facebook Marketplace",
  highestDemandCity: "Dallas, TX",
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  high_value_opportunity: "High Value Opportunity",
  underpriced: "Under Market Value",
  price_drop: "Price Drop",
  new_match: "New Match",
  high_roi: "High ROI",
  negotiation: "Negotiation",
  market_intel: "Market Intelligence",
  risk: "Risk Alert",
  watchlist: "Watchlist",
  system: "System",
};

export const ALERT_MARKETPLACES = ["Facebook Marketplace"];
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
