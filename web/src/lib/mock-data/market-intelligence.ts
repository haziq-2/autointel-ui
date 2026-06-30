import { format, subDays } from "date-fns";
import type { VehicleListing } from "@/lib/types";
import type { AiInsightFeedItem } from "@/lib/types";
import { getAllVehicles } from "./generate-vehicles";
import {
  MARKET_LISTING_ACTIVITY,
  MARKET_AVG_PRICE_TREND,
} from "./intelligence-dashboard";

export interface MarketIntelFilters {
  dateRange: string;
  marketplace: string;
  category: string;
  priceRange: string;
  state: string;
}

const STATE_ABBR: Record<string, string> = {
  Texas: "TX",
  California: "CA",
  Florida: "FL",
  Arizona: "AZ",
  Georgia: "GA",
  Colorado: "CO",
  "North Carolina": "NC",
};

const LUXURY_MAKES = new Set(["BMW", "Mercedes-Benz", "Audi", "Lexus", "Volvo"]);

const PRICE_BOUNDS: Record<string, [number, number]> = {
  "Under $15k": [0, 14999],
  "$15–25k": [15000, 25000],
  "$25–35k": [25000, 35000],
  "$35k+": [35001, Infinity],
};

const DATE_RANGE_DAYS: Record<string, number> = {
  "7 Days": 7,
  "30 Days": 30,
  "90 Days": 90,
  "1 Year": 365,
};

const CHART_PERIODS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

function matchesState(location: string, state: string): boolean {
  if (state === "All") return true;
  const abbr = STATE_ABBR[state];
  if (abbr) return location.endsWith(`, ${abbr}`);
  return location.toLowerCase().includes(state.toLowerCase());
}

function matchesCategory(vehicle: VehicleListing, category: string): boolean {
  if (category === "All") return true;
  switch (category) {
    case "Truck":
      return vehicle.bodyStyle === "Truck";
    case "SUV":
      return vehicle.bodyStyle === "SUV";
    case "Sedan":
      return vehicle.bodyStyle === "Sedan";
    case "Electric":
      return vehicle.fuelType === "Electric" || vehicle.bodyStyle === "Electric";
    case "Hybrid":
      return vehicle.fuelType === "Hybrid";
    case "Luxury":
      return LUXURY_MAKES.has(vehicle.make);
    case "Compact":
      return vehicle.bodyStyle === "Sedan" && vehicle.price < 22000;
    default:
      return true;
  }
}

function matchesPriceRange(price: number, priceRange: string): boolean {
  if (priceRange === "All") return true;
  const bounds = PRICE_BOUNDS[priceRange];
  if (!bounds) return true;
  return price >= bounds[0] && price <= bounds[1];
}

function matchesDateRange(dateFound: string, dateRange: string): boolean {
  if (dateRange === "All") return true;
  const days = DATE_RANGE_DAYS[dateRange];
  if (!days) return true;
  const cutoff = format(subDays(new Date(), days), "yyyy-MM-dd");
  return dateFound >= cutoff;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function sparklineFromDaily(values: number[]): number[] {
  if (values.length === 0) return [0, 0, 0, 0, 0, 0, 0];
  if (values.length >= 7) return values.slice(-7);
  const pad = Array.from({ length: 7 - values.length }, () => values[0] ?? 0);
  return [...pad, ...values];
}

function vehiclesInWindow(
  vehicles: VehicleListing[],
  startDaysAgo: number,
  endDaysAgo: number
): VehicleListing[] {
  const start = format(subDays(new Date(), startDaysAgo), "yyyy-MM-dd");
  const end = format(subDays(new Date(), endDaysAgo), "yyyy-MM-dd");
  return vehicles.filter((v) => v.dateFound >= start && v.dateFound < end);
}

function buildDailyCounts(vehicles: VehicleListing[], days: number) {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    buckets.set(format(subDays(new Date(), i), "yyyy-MM-dd"), 0);
  }
  for (const v of vehicles) {
    const count = buckets.get(v.dateFound);
    if (count !== undefined) buckets.set(v.dateFound, count + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

export function filterMarketVehicles(
  filters: MarketIntelFilters,
  options?: { includeDateRange?: boolean }
): VehicleListing[] {
  const includeDateRange = options?.includeDateRange ?? true;
  return getAllVehicles().filter(
    (v) =>
      (filters.marketplace === "All" || v.marketplace === filters.marketplace) &&
      matchesCategory(v, filters.category) &&
      matchesPriceRange(v.price, filters.priceRange) &&
      matchesState(v.location, filters.state) &&
      (!includeDateRange || matchesDateRange(v.dateFound, filters.dateRange))
  );
}

export function computeMarketKpis(vehicles: VehicleListing[]) {
  const today = format(new Date(), "yyyy-MM-dd");
  const recentWeek = vehiclesInWindow(vehicles, 7, 0);
  const priorWeek = vehiclesInWindow(vehicles, 14, 7);

  const activeListings = vehicles.length;
  const newToday = vehicles.filter((v) => v.dateFound === today).length;
  const avgMarketPrice = Math.round(avg(vehicles.map((v) => v.price))) || 0;
  const avgOpportunityScore = vehicles.length ? Math.round(avg(vehicles.map((v) => v.opportunityScore))) : 0;
  const highValueOpportunities = vehicles.filter((v) => v.opportunityScore >= 85).length;
  const avgDaysToSell = vehicles.length
    ? Math.round(avg(vehicles.map((v) => v.daysListed)) * 10) / 10
    : 0;

  const dailyNew = buildDailyCounts(vehicles, 7).map((d) => d.count);
  const priceSpark = sparklineFromDaily(
    buildDailyCounts(vehicles, 7).map((d) => {
      const dayVehicles = vehicles.filter((v) => v.dateFound === d.date);
      return dayVehicles.length ? Math.round(avg(dayVehicles.map((v) => v.price))) : avgMarketPrice;
    })
  );
  const scoreSpark = sparklineFromDaily(
    buildDailyCounts(vehicles, 7).map((d) => {
      const dayVehicles = vehicles.filter((v) => v.dateFound === d.date);
      return dayVehicles.length ? Math.round(avg(dayVehicles.map((v) => v.opportunityScore))) : avgOpportunityScore;
    })
  );
  const highValueSpark = sparklineFromDaily(
    buildDailyCounts(vehicles, 7).map((d) =>
      vehicles.filter((v) => v.dateFound === d.date && v.opportunityScore >= 85).length
    )
  );
  const daysSpark = sparklineFromDaily(
    buildDailyCounts(vehicles, 7).map((d) => {
      const dayVehicles = vehicles.filter((v) => v.dateFound === d.date);
      return dayVehicles.length
        ? Math.round(avg(dayVehicles.map((v) => v.daysListed)) * 10) / 10
        : avgDaysToSell;
    })
  );

  const priorAvgPrice = priorWeek.length ? Math.round(avg(priorWeek.map((v) => v.price))) : avgMarketPrice;
  const priorAvgScore = priorWeek.length
    ? Math.round(avg(priorWeek.map((v) => v.opportunityScore)))
    : avgOpportunityScore;
  const priorHighValue = priorWeek.filter((v) => v.opportunityScore >= 85).length;
  const priorActive = priorWeek.length || 1;
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const priorNewToday = priorWeek.filter((v) => v.dateFound === yesterday).length || 1;
  const priorDays = priorWeek.length
    ? Math.round(avg(priorWeek.map((v) => v.daysListed)) * 10) / 10
    : avgDaysToSell || 1;

  return {
    activeListings: {
      value: activeListings,
      change: pctChange(recentWeek.length, priorActive),
      sparkline: sparklineFromDaily(dailyNew.length ? dailyNew : [activeListings]),
    },
    newListingsToday: {
      value: newToday,
      change: pctChange(newToday, priorNewToday),
      sparkline: sparklineFromDaily(dailyNew.length ? dailyNew : [newToday]),
    },
    avgMarketPrice: {
      value: avgMarketPrice,
      change: pctChange(avgMarketPrice, priorAvgPrice),
      sparkline: priceSpark,
    },
    avgOpportunityScore: {
      value: avgOpportunityScore,
      change: pctChange(avgOpportunityScore, priorAvgScore),
      sparkline: scoreSpark,
    },
    highValueOpportunities: {
      value: highValueOpportunities,
      change: pctChange(highValueOpportunities, priorHighValue),
      sparkline: highValueSpark,
    },
    avgDaysToSell: {
      value: avgDaysToSell,
      change: pctChange(avgDaysToSell, priorDays),
      sparkline: daysSpark,
    },
  };
}

function scaleSeries(
  series: { label: string; [key: string]: string | number }[],
  ratio: number,
  numericKeys: string[]
) {
  return series.map((row) => {
    const next = { ...row };
    for (const key of numericKeys) {
      if (typeof next[key] === "number") {
        next[key] = Math.max(0, Math.round((next[key] as number) * ratio));
      }
    }
    return next;
  });
}

export function buildListingActivityChart(
  vehicles: VehicleListing[],
  period: string
) {
  const days = CHART_PERIODS[period] ?? 30;
  const daily = buildDailyCounts(vehicles, days);

  if (period === "7d" || period === "30d") {
    const labels =
      period === "7d"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : daily.map((_, i) => `Day ${i + 1}`);

    return daily.map((d, i) => {
      const newListings = d.count;
      return {
        label: labels[i] ?? `Day ${i + 1}`,
        newListings,
        removedListings: Math.round(newListings * 0.62),
        priceDrops: Math.max(1, Math.round(newListings * (0.07 + Math.sin(i * 0.9) * 0.02))),
      };
    });
  }

  const fallback =
    MARKET_LISTING_ACTIVITY[period as keyof typeof MARKET_LISTING_ACTIVITY] ??
    MARKET_LISTING_ACTIVITY["30d"];
  const ratio = vehicles.length / Math.max(getAllVehicles().length, 1);
  return scaleSeries(fallback, ratio, ["newListings", "removedListings", "priceDrops"]);
}

export function buildAvgPriceChart(vehicles: VehicleListing[], period: string) {
  const days = CHART_PERIODS[period] ?? 30;
  const overallAvg = Math.round(avg(vehicles.map((v) => v.price))) || 22840;

  if (period === "7d" || period === "30d") {
    const daily = buildDailyCounts(vehicles, days);
    const labels =
      period === "7d"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : daily.map((_, i) => `Day ${i + 1}`);

    return daily.map((d, i) => {
      const dayVehicles = vehicles.filter((v) => v.dateFound === d.date);
      const avgPrice = dayVehicles.length
        ? Math.round(avg(dayVehicles.map((v) => v.price)))
        : overallAvg;
      return { label: labels[i] ?? `Day ${i + 1}`, avgPrice };
    });
  }

  const fallback =
    MARKET_AVG_PRICE_TREND[period as keyof typeof MARKET_AVG_PRICE_TREND] ??
    MARKET_AVG_PRICE_TREND["30d"];
  const ratio = vehicles.length / Math.max(getAllVehicles().length, 1);
  return fallback.map((row) => ({
    ...row,
    avgPrice: Math.round((row.avgPrice as number) * (0.85 + ratio * 0.15)),
  }));
}

export function getFilteredUndervalued(vehicles: VehicleListing[], limit = 5) {
  return [...vehicles]
    .filter((v) => (v.fairMarketValue ?? v.price * 1.1) > v.price)
    .sort((a, b) => (b.fairMarketValue! - b.price) - (a.fairMarketValue! - a.price))
    .slice(0, limit)
    .map((v) => {
      const marketValue = v.fairMarketValue ?? Math.round(v.price * 1.12);
      const difference = marketValue - v.price;
      return {
        id: v.id,
        vehicle: `${v.year} ${v.make} ${v.model}`,
        currentPrice: v.price,
        marketValue,
        difference,
        discountPct: -Math.round((difference / marketValue) * 100),
        opportunityScore: v.opportunityScore,
      };
    });
}

export function getFilteredMarketplaceStats(vehicles: VehicleListing[]) {
  const names = ["Facebook Marketplace", "Craigslist", "AutoTrader"];
  return names.map((name) => {
    const subset = vehicles.filter((v) => v.marketplace === name);
    return {
      name,
      listings: subset.length,
      avgPrice: subset.length ? Math.round(avg(subset.map((v) => v.price))) : 0,
      opportunityScore: subset.length ? Math.round(avg(subset.map((v) => v.opportunityScore))) : 0,
      active: true,
    };
  });
}

function topCategory(vehicles: VehicleListing[]): string {
  const counts = new Map<string, number>();
  for (const v of vehicles) {
    counts.set(v.bodyStyle, (counts.get(v.bodyStyle) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "SUVs";
}

function topState(vehicles: VehicleListing[]): string {
  const counts = new Map<string, number>();
  for (const v of vehicles) {
    const state = v.location.split(", ").pop() ?? v.location;
    counts.set(state, (counts.get(state) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const abbr = sorted[0]?.[0] ?? "TX";
  const stateName = Object.entries(STATE_ABBR).find(([, a]) => a === abbr)?.[0] ?? abbr;
  return stateName;
}

export function buildMarketSummary(vehicles: VehicleListing[], kpis: ReturnType<typeof computeMarketKpis>) {
  const count = vehicles.length;
  const segment = topCategory(vehicles);
  const priceDir = kpis.avgMarketPrice.change >= 0 ? "increased" : "declined";
  const priceChange = Math.abs(kpis.avgMarketPrice.change);
  const state = topState(vehicles);

  return {
    bullets: [
      `${count.toLocaleString()} listings match your current filters`,
      `${segment}s are the most active segment in this view`,
      `Average listing prices ${priceDir} by ${priceChange}% vs prior week`,
      `${state} shows the strongest concentration of listings`,
      `${kpis.highValueOpportunities.value} vehicles qualify as high-value opportunities`,
    ],
    confidence: Math.min(98, 88 + Math.floor(count / 500)),
    timestamp: "Updated just now",
  };
}

export function filterMarketInsights(
  insights: AiInsightFeedItem[],
  filters: MarketIntelFilters
): AiInsightFeedItem[] {
  return insights.filter((insight) => {
    const text = insight.text.toLowerCase();
    if (filters.marketplace !== "All" && text.includes("marketplace")) {
      return text.includes(filters.marketplace.toLowerCase().split(" ")[0]);
    }
    if (filters.state !== "All" && insight.category === "Regional") {
      return text.includes(filters.state.toLowerCase()) || filters.state === "Texas";
    }
    if (filters.category !== "All" && insight.category === "Segment") {
      return text.includes(filters.category.toLowerCase());
    }
    return true;
  });
}

export function isDefaultMarketFilters(filters: MarketIntelFilters): boolean {
  return (
    filters.dateRange === "30 Days" &&
    filters.marketplace === "All" &&
    filters.category === "All" &&
    filters.priceRange === "All" &&
    filters.state === "All"
  );
}

export function toMarketIntelFilters(filters: {
  dateRange: string;
  marketplace: string;
  category: string;
  priceRange: string;
  state: string;
}): MarketIntelFilters {
  return {
    dateRange: filters.dateRange,
    marketplace: filters.marketplace,
    category: filters.category,
    priceRange: filters.priceRange,
    state: filters.state,
  };
}
