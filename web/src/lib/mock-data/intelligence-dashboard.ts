import type { AiInsightFeedItem } from "@/lib/types";
import { getAllVehicles, TOTAL_VEHICLES } from "./generate-vehicles";
import { getTodayScrapeCount } from "./scrape-activity";

function genSeries(
  points: number,
  base: number,
  variance: number,
  trend: number,
  labelFn: (i: number) => string
) {
  return Array.from({ length: points }, (_, i) => ({
    label: labelFn(i),
    value: Math.round(base + i * trend + Math.sin(i * 1.2) * variance),
  }));
}

function genMultiSeries(
  periods: Record<string, number>,
  metrics: { key: string; base: number; trend: number; variance: number }[]
) {
  const result: Record<string, { label: string; [key: string]: string | number }[]> = {};
  for (const [period, points] of Object.entries(periods)) {
    result[period] = Array.from({ length: points }, (_, i) => {
      const row: { label: string; [key: string]: string | number } = {
        label:
          period === "7d"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
            : period === "30d"
              ? `Day ${i + 1}`
              : period === "90d"
                ? `Wk ${i + 1}`
                : `M${i + 1}`,
      };
      for (const m of metrics) {
        row[m.key] = Math.round(m.base + i * m.trend + Math.sin(i * 0.8 + m.base) * m.variance);
      }
      return row;
    });
  }
  return result;
}

export const MARKET_HERO_KPIS = {
  activeListings: { value: TOTAL_VEHICLES, change: 6.2, sparkline: [4820, 4890, 4940, 4980, 5020, 5080, 5143] },
  newListingsToday: { value: getTodayScrapeCount(), change: 12.4, sparkline: [98, 112, 105, 128, 134, 118, getTodayScrapeCount()] },
  avgMarketPrice: { value: 22840, change: 2.4, sparkline: [22380, 22490, 22560, 22640, 22720, 22790, 22840] },
  avgOpportunityScore: { value: 76, change: 7.0, sparkline: [69, 71, 72, 73, 74, 75, 76] },
  highValueOpportunities: { value: 186, change: 18.6, sparkline: [142, 148, 156, 162, 168, 176, 186] },
  avgDaysToSell: { value: 14.2, change: -6.2, sparkline: [18.4, 17.8, 16.9, 16.2, 15.4, 14.8, 14.2] },
};

export const MARKET_AI_SUMMARY = {
  bullets: [
    "18,420 listings analyzed today",
    "Pickup trucks continue to outperform SUVs",
    "Average listing prices increased by 2.4%",
    "Dallas remains the strongest acquisition market",
    "186 vehicles currently qualify as high-value opportunities",
  ],
  confidence: 94,
  timestamp: "Updated 4 minutes ago",
};

export const MARKET_LISTING_ACTIVITY = genMultiSeries(
  { "7d": 7, "30d": 30, "90d": 13, "1y": 12 },
  [
    { key: "newListings", base: 380, trend: 2.2, variance: 18 },
    { key: "removedListings", base: 265, trend: 1.4, variance: 14 },
    { key: "priceDrops", base: 32, trend: 0.9, variance: 5 },
  ]
);

export const MARKET_AVG_PRICE_TREND = genMultiSeries(
  { "7d": 7, "30d": 30, "90d": 13, "1y": 12 },
  [{ key: "avgPrice", base: 22380, trend: 68, variance: 120 }]
);

export const SUPPLY_DEMAND_ANALYSIS = [
  { name: "Toyota Tacoma", supply: 62, demand: 94, verdict: "Excellent Buying Market" },
  { name: "Ford F-150", supply: 78, demand: 91, verdict: "Strong Demand" },
  { name: "Honda CR-V", supply: 71, demand: 86, verdict: "Favorable Market" },
  { name: "Chevy Silverado", supply: 74, demand: 84, verdict: "Balanced" },
  { name: "Toyota RAV4", supply: 68, demand: 88, verdict: "Strong Demand" },
  { name: "Pickup Trucks", supply: 72, demand: 96, verdict: "Excellent Buying Market" },
  { name: "Mid-size SUVs", supply: 81, demand: 82, verdict: "Balanced" },
  { name: "Sedans", supply: 88, demand: 64, verdict: "Oversupplied" },
  { name: "Electric", supply: 58, demand: 76, verdict: "Emerging Opportunity" },
  { name: "Hybrid SUVs", supply: 54, demand: 89, verdict: "Excellent Buying Market" },
];

export const MARKETPLACE_COMPARISON = [
  { name: "Facebook Marketplace", listings: 2142, avgPrice: 26200, avgProfit: 4200, opportunityScore: 79, active: true },
  { name: "Craigslist", listings: 1086, avgPrice: 24100, avgProfit: 3800, opportunityScore: 74, active: true },
  { name: "AutoTrader", listings: 1915, avgPrice: 31200, avgProfit: 4600, opportunityScore: 77, active: true },
  { name: "OfferUp", listings: 842, avgPrice: 22800, avgProfit: 3400, opportunityScore: 71, active: false },
  { name: "Cars.com", listings: 624, avgPrice: 29800, avgProfit: 4100, opportunityScore: 73, active: false },
];

export function getTopUndervaluedVehicles(limit = 5) {
  return [...getAllVehicles()]
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

export const PRICE_DROP_ACTIVITY = {
  todayDrops: 34,
  todayChange: 14.3,
  avgReduction: 1840,
  largestDrop: 4200,
  multipleReductions: 18,
  timeline: [
    { time: "6 AM", drops: 4, avgReduction: 1200 },
    { time: "9 AM", drops: 8, avgReduction: 1640 },
    { time: "12 PM", drops: 12, avgReduction: 1920 },
    { time: "3 PM", drops: 22, avgReduction: 1780 },
    { time: "6 PM", drops: 34, avgReduction: 1840 },
  ],
  sparkline: [18, 22, 26, 28, 31, 34],
};

export const MARKET_AI_INSIGHTS: AiInsightFeedItem[] = [
  { id: "mi1", text: "Toyota Tacoma inventory declined 12% this week", timestamp: "3 min ago", confidence: 94, category: "Inventory" },
  { id: "mi2", text: "SUVs priced under $20,000 continue selling faster than average", timestamp: "11 min ago", confidence: 91, category: "Demand" },
  { id: "mi3", text: "Facebook Marketplace currently offers the highest number of undervalued vehicles", timestamp: "18 min ago", confidence: 93, category: "Marketplace" },
  { id: "mi4", text: "Average acquisition margins increased by 6%", timestamp: "26 min ago", confidence: 88, category: "Pricing" },
  { id: "mi5", text: "Ford F-150 demand continues to rise across Texas", timestamp: "34 min ago", confidence: 92, category: "Regional" },
  { id: "mi6", text: "Pickup truck listings are up 8% while sedan supply tightens", timestamp: "42 min ago", confidence: 86, category: "Segment" },
];

// ─── DEMAND INTELLIGENCE ───────────────────────────────────────────

export const DEMAND_HERO_KPIS = {
  highestDemandSegment: { value: "Pickup Trucks", change: 18.2 },
  highestDemandBrand: { value: "Toyota", change: 14.6 },
  avgDemandScore: { value: 87, change: 8.4, sparkline: [78, 80, 82, 84, 85, 86, 87] },
  fastestSelling: { value: "2022 Toyota Tacoma", days: 9 },
  avgSaleTime: { value: 14.2, change: -6.2, sparkline: [18, 17, 16, 15.5, 15, 14.6, 14.2] },
  inventorySupply: { value: TOTAL_VEHICLES, change: 4.1 },
  projectedRoi: { value: 24.8, change: 5.2, sparkline: [19, 20, 21, 22, 23, 24, 24.8] },
  forecastAccuracy: { value: 93, change: 2.1 },
};

export const DEMAND_RANKINGS = {
  makes: [
    { name: "Toyota", score: 94, growth: 14.6 },
    { name: "Ford", score: 91, growth: 12.2 },
    { name: "Honda", score: 86, growth: 9.8 },
    { name: "Chevrolet", score: 84, growth: 11.4 },
    { name: "Ram", score: 82, growth: 10.1 },
    { name: "Tesla", score: 78, growth: 8.6 },
  ],
  models: [
    { name: "Ford F-150", score: 96, growth: 18.0 },
    { name: "Toyota Tacoma", score: 94, growth: 16.4 },
    { name: "Honda CR-V", score: 89, growth: 11.2 },
    { name: "Chevy Silverado", score: 87, growth: 13.8 },
    { name: "Toyota RAV4", score: 86, growth: 10.6 },
    { name: "Tesla Model Y", score: 84, growth: 12.0 },
  ],
  categories: [
    { name: "Pickup Trucks", score: 96, growth: 18.2 },
    { name: "Mid-size SUVs", score: 88, growth: 11.4 },
    { name: "Compact SUVs", score: 85, growth: 9.6 },
    { name: "Full-size SUVs", score: 82, growth: 8.2 },
    { name: "Sedans", score: 68, growth: -4.2 },
    { name: "Electric", score: 76, growth: 12.8 },
  ],
  fuelTypes: [
    { name: "Gasoline", score: 78, growth: 4.2 },
    { name: "Hybrid", score: 86, growth: 16.8 },
    { name: "Electric", score: 74, growth: 12.4 },
    { name: "Diesel", score: 72, growth: 6.8 },
  ],
  priceSegments: [
    { name: "Under $15k", score: 71, growth: 3.2 },
    { name: "$15–25k", score: 92, growth: 14.8 },
    { name: "$25–35k", score: 88, growth: 10.4 },
    { name: "$35–50k", score: 79, growth: 7.6 },
    { name: "$50k+", score: 64, growth: 2.1 },
  ],
};

export const FASTEST_SELLING_LEADERBOARD = [
  { vehicle: "2022 Toyota Tacoma TRD", demandScore: 96, daysToSell: 9, expectedRoi: 31, trend: "up" as const, confidence: 94 },
  { vehicle: "2021 Ford F-150 XLT", demandScore: 94, daysToSell: 11, expectedRoi: 28, trend: "up" as const, confidence: 92 },
  { vehicle: "2023 Honda CR-V EX", demandScore: 91, daysToSell: 13, expectedRoi: 24, trend: "up" as const, confidence: 90 },
  { vehicle: "2022 Ram 1500 Big Horn", demandScore: 89, daysToSell: 14, expectedRoi: 26, trend: "stable" as const, confidence: 88 },
  { vehicle: "2021 Toyota RAV4 XLE", demandScore: 87, daysToSell: 15, expectedRoi: 22, trend: "up" as const, confidence: 87 },
  { vehicle: "2022 Chevy Silverado LT", demandScore: 86, daysToSell: 16, expectedRoi: 25, trend: "stable" as const, confidence: 86 },
  { vehicle: "2023 Tesla Model Y", demandScore: 84, daysToSell: 17, expectedRoi: 21, trend: "down" as const, confidence: 84 },
  { vehicle: "2020 Jeep Wrangler Sahara", demandScore: 82, daysToSell: 18, expectedRoi: 23, trend: "up" as const, confidence: 83 },
];

export const DEMAND_FORECAST = {
  "30d": Array.from({ length: 4 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    demandGrowth: 82 + i * 3.2,
    supply: 5100 - i * 28,
    expectedProfit: 4200 + i * 180,
    avgDaysToSell: 15 - i * 0.4,
  })),
  "60d": Array.from({ length: 8 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    demandGrowth: 80 + i * 2.4,
    supply: 5120 - i * 22,
    expectedProfit: 4000 + i * 140,
    avgDaysToSell: 15.5 - i * 0.25,
  })),
  "90d": Array.from({ length: 12 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    demandGrowth: 78 + i * 1.8,
    supply: 5140 - i * 18,
    expectedProfit: 3900 + i * 110,
    avgDaysToSell: 16 - i * 0.18,
  })),
};

export const SEASONAL_DEMAND = [
  { season: "Spring", demand: 1.12, profit: 1.08, supply: 0.96 },
  { season: "Summer", demand: 1.14, profit: 1.1, supply: 0.94 },
  { season: "Fall", demand: 0.98, profit: 0.96, supply: 1.02 },
  { season: "Winter", demand: 0.9, profit: 0.88, supply: 1.08 },
  { season: "Tax Season", demand: 1.18, profit: 1.14, supply: 0.92 },
  { season: "Holiday", demand: 0.86, profit: 0.84, supply: 1.12 },
];

export const SEASONAL_HEATMAP = [
  { month: "Jan", trucks: 0.88, suvs: 0.9, sedans: 0.82, ev: 0.78 },
  { month: "Feb", trucks: 0.92, suvs: 0.94, sedans: 0.86, ev: 0.82 },
  { month: "Mar", trucks: 1.04, suvs: 1.02, sedans: 0.94, ev: 0.88 },
  { month: "Apr", trucks: 1.12, suvs: 1.08, sedans: 0.96, ev: 0.92 },
  { month: "May", trucks: 1.16, suvs: 1.1, sedans: 0.94, ev: 0.94 },
  { month: "Jun", trucks: 1.14, suvs: 1.08, sedans: 0.92, ev: 0.96 },
  { month: "Jul", trucks: 1.1, suvs: 1.06, sedans: 0.9, ev: 0.98 },
  { month: "Aug", trucks: 1.06, suvs: 1.04, sedans: 0.88, ev: 1.0 },
  { month: "Sep", trucks: 1.0, suvs: 0.98, sedans: 0.86, ev: 0.96 },
  { month: "Oct", trucks: 0.96, suvs: 0.94, sedans: 0.84, ev: 0.92 },
  { month: "Nov", trucks: 0.9, suvs: 0.92, sedans: 0.82, ev: 0.88 },
  { month: "Dec", trucks: 0.86, suvs: 0.9, sedans: 0.8, ev: 0.86 },
];

export const CATEGORY_PERFORMANCE = [
  { category: "SUV", demand: 86, profit: 4200, supply: 1842, daysToSell: 15, opportunityScore: 78 },
  { category: "Pickup", demand: 96, profit: 5100, supply: 1648, daysToSell: 11, opportunityScore: 84 },
  { category: "Sedan", demand: 64, profit: 2800, supply: 1128, daysToSell: 22, opportunityScore: 68 },
  { category: "Luxury", demand: 72, profit: 6200, supply: 412, daysToSell: 28, opportunityScore: 74 },
  { category: "Hybrid", demand: 88, profit: 4600, supply: 386, daysToSell: 14, opportunityScore: 82 },
  { category: "Electric", demand: 76, profit: 5400, supply: 298, daysToSell: 19, opportunityScore: 76 },
  { category: "Compact", demand: 82, profit: 3200, supply: 624, daysToSell: 16, opportunityScore: 75 },
];

export const EMERGING_OPPORTUNITIES = [
  { segment: "Hybrid SUVs", demandChange: 24, inventoryChange: -9, projectedMargin: 5700, confidence: 93 },
  { segment: "Midsize Trucks", demandChange: 19, inventoryChange: -6, projectedMargin: 4900, confidence: 91 },
  { segment: "Compact Crossovers", demandChange: 16, inventoryChange: -4, projectedMargin: 3800, confidence: 88 },
  { segment: "Used EV Trucks", demandChange: 12, inventoryChange: 8, projectedMargin: 6200, confidence: 82 },
  { segment: "Private Seller SUVs", demandChange: 14, inventoryChange: -11, projectedMargin: 4400, confidence: 90 },
];

export const BUYER_ACTIVITY = {
  searchActivity: genSeries(7, 8400, 400, 120, (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]),
  demandIndex: 87,
  buyerCompetition: 78,
  vehicleSaves: 1240,
  vehicleContacts: 486,
  listingViews: 28400,
  weeklyTrend: [72, 76, 78, 81, 84, 86, 87],
};

export const DEMAND_AI_INSIGHTS: AiInsightFeedItem[] = [
  { id: "di1", text: "Compact SUVs continue gaining demand across Sun Belt metros", timestamp: "5 min ago", confidence: 93, category: "Segment" },
  { id: "di2", text: "Honda inventory expected to tighten 8% over next 30 days", timestamp: "14 min ago", confidence: 89, category: "Supply" },
  { id: "di3", text: "Toyota resale values remain strong — 14% above segment average", timestamp: "22 min ago", confidence: 92, category: "Pricing" },
  { id: "di4", text: "Electric truck demand slowing in California, stable in Texas", timestamp: "31 min ago", confidence: 85, category: "Regional" },
  { id: "di5", text: "Tax season spike driving 18% lift in $15–25k segment", timestamp: "48 min ago", confidence: 91, category: "Seasonal" },
];

// ─── REGIONAL INTELLIGENCE ───────────────────────────────────────────

export const EXTENDED_STATE_INTEL = [
  { code: "TX", name: "Texas", demandScore: 94, inventory: 2142, avgMargin: 4850, avgSaleTime: 11, topCategory: "Pickup Trucks", opportunityScore: 82, roi: 26.4, priceTrend: [29200, 28900, 28600, 28400] },
  { code: "AZ", name: "Arizona", demandScore: 88, inventory: 842, avgMargin: 4200, avgSaleTime: 13, topCategory: "SUVs", opportunityScore: 79, roi: 23.8, priceTrend: [27800, 27600, 27400, 27200] },
  { code: "FL", name: "Florida", demandScore: 86, inventory: 1124, avgMargin: 3900, avgSaleTime: 14, topCategory: "Sedans", opportunityScore: 74, roi: 21.2, priceTrend: [26400, 26200, 26100, 25900] },
  { code: "GA", name: "Georgia", demandScore: 84, inventory: 624, avgMargin: 4100, avgSaleTime: 15, topCategory: "SUVs", opportunityScore: 76, roi: 22.6, priceTrend: [27100, 26900, 26800, 26600] },
  { code: "CO", name: "Colorado", demandScore: 82, inventory: 486, avgMargin: 4500, avgSaleTime: 16, topCategory: "Trucks", opportunityScore: 78, roi: 24.1, priceTrend: [30200, 30000, 29800, 29600] },
  { code: "NC", name: "North Carolina", demandScore: 81, inventory: 412, avgMargin: 3800, avgSaleTime: 14, topCategory: "SUVs", opportunityScore: 73, roi: 20.8, priceTrend: [25800, 25600, 25500, 25400] },
  { code: "TN", name: "Tennessee", demandScore: 79, inventory: 384, avgMargin: 3600, avgSaleTime: 15, topCategory: "Trucks", opportunityScore: 72, roi: 20.2, priceTrend: [25200, 25100, 25000, 24900] },
  { code: "CA", name: "California", demandScore: 78, inventory: 1684, avgMargin: 5200, avgSaleTime: 18, topCategory: "Electric", opportunityScore: 71, roi: 22.4, priceTrend: [34200, 33900, 33600, 33400] },
  { code: "NV", name: "Nevada", demandScore: 76, inventory: 312, avgMargin: 4000, avgSaleTime: 16, topCategory: "SUVs", opportunityScore: 74, roi: 21.6, priceTrend: [28600, 28400, 28200, 28100] },
  { code: "OK", name: "Oklahoma", demandScore: 74, inventory: 286, avgMargin: 3400, avgSaleTime: 17, topCategory: "Trucks", opportunityScore: 70, roi: 19.8, priceTrend: [24400, 24300, 24200, 24100] },
  { code: "MO", name: "Missouri", demandScore: 72, inventory: 268, avgMargin: 3200, avgSaleTime: 18, topCategory: "Sedans", opportunityScore: 68, roi: 18.6, priceTrend: [23800, 23700, 23600, 23500] },
  { code: "NY", name: "New York", demandScore: 68, inventory: 892, avgMargin: 4800, avgSaleTime: 22, topCategory: "Sedans", opportunityScore: 66, roi: 19.2, priceTrend: [31200, 31000, 30800, 30600] },
  { code: "WA", name: "Washington", demandScore: 77, inventory: 524, avgMargin: 4600, avgSaleTime: 17, topCategory: "SUVs", opportunityScore: 73, roi: 21.8, priceTrend: [31800, 31600, 31400, 31200] },
  { code: "IL", name: "Illinois", demandScore: 71, inventory: 648, avgMargin: 3600, avgSaleTime: 19, topCategory: "Sedans", opportunityScore: 67, roi: 18.4, priceTrend: [26800, 26600, 26500, 26400] },
  { code: "OH", name: "Ohio", demandScore: 73, inventory: 486, avgMargin: 3400, avgSaleTime: 18, topCategory: "Trucks", opportunityScore: 69, roi: 19.6, priceTrend: [25400, 25200, 25100, 25000] },
  { code: "PA", name: "Pennsylvania", demandScore: 70, inventory: 542, avgMargin: 3500, avgSaleTime: 20, topCategory: "SUVs", opportunityScore: 66, roi: 18.2, priceTrend: [26200, 26000, 25900, 25800] },
  { code: "MI", name: "Michigan", demandScore: 69, inventory: 468, avgMargin: 3300, avgSaleTime: 21, topCategory: "Trucks", opportunityScore: 65, roi: 17.8, priceTrend: [24800, 24600, 24500, 24400] },
  { code: "VA", name: "Virginia", demandScore: 75, inventory: 386, avgMargin: 3900, avgSaleTime: 16, topCategory: "SUVs", opportunityScore: 72, roi: 20.4, priceTrend: [27600, 27400, 27300, 27200] },
  { code: "SC", name: "South Carolina", demandScore: 74, inventory: 298, avgMargin: 3700, avgSaleTime: 16, topCategory: "SUVs", opportunityScore: 71, roi: 20.0, priceTrend: [26200, 26000, 25900, 25800] },
  { code: "NM", name: "New Mexico", demandScore: 71, inventory: 186, avgMargin: 3500, avgSaleTime: 18, topCategory: "Trucks", opportunityScore: 68, roi: 19.0, priceTrend: [25600, 25400, 25300, 25200] },
];

export const MARKET_OPPORTUNITY_RATINGS = [
  { city: "Dallas", stars: 5 },
  { city: "Phoenix", stars: 5 },
  { city: "Houston", stars: 4 },
  { city: "Austin", stars: 4 },
  { city: "Denver", stars: 4 },
  { city: "Atlanta", stars: 3 },
  { city: "Charlotte", stars: 3 },
  { city: "Nashville", stars: 4 },
];

export const TOP_CITIES_EXTENDED = [
  { city: "Dallas", state: "TX", demandScore: 96, inventory: 842, avgMargin: 5120, avgSaleTime: 10, opportunityScore: 84, roi: 28.2 },
  { city: "Houston", state: "TX", demandScore: 93, inventory: 724, avgMargin: 4680, avgSaleTime: 11, opportunityScore: 81, roi: 26.4 },
  { city: "Austin", state: "TX", demandScore: 91, inventory: 418, avgMargin: 4920, avgSaleTime: 12, opportunityScore: 80, roi: 25.8 },
  { city: "Phoenix", state: "AZ", demandScore: 89, inventory: 512, avgMargin: 4350, avgSaleTime: 13, opportunityScore: 78, roi: 24.6 },
  { city: "Denver", state: "CO", demandScore: 85, inventory: 386, avgMargin: 4580, avgSaleTime: 14, opportunityScore: 76, roi: 23.2 },
  { city: "Atlanta", state: "GA", demandScore: 84, inventory: 468, avgMargin: 4020, avgSaleTime: 15, opportunityScore: 74, roi: 22.0 },
  { city: "Charlotte", state: "NC", demandScore: 82, inventory: 312, avgMargin: 3880, avgSaleTime: 14, opportunityScore: 72, roi: 21.4 },
  { city: "Nashville", state: "TN", demandScore: 80, inventory: 284, avgMargin: 3720, avgSaleTime: 16, opportunityScore: 71, roi: 20.8 },
];

export const STATE_PERFORMANCE_CARDS = EXTENDED_STATE_INTEL.filter((s) =>
  ["TX", "CA", "FL", "AZ", "GA", "CO"].includes(s.code)
);

export const BRAND_BY_REGION = {
  TX: { brands: ["Toyota", "Ford", "Chevrolet"], models: ["F-150", "Tacoma", "Silverado"], categories: ["Pickup Trucks", "SUVs"], fuel: ["Gasoline", "Diesel"] },
  CA: { brands: ["Tesla", "Toyota", "Honda"], models: ["Model Y", "Camry", "CR-V"], categories: ["Electric", "Sedans"], fuel: ["Electric", "Hybrid"] },
  FL: { brands: ["Toyota", "Honda", "Ford"], models: ["RAV4", "Accord", "Explorer"], categories: ["SUVs", "Sedans"], fuel: ["Gasoline", "Hybrid"] },
  AZ: { brands: ["Ford", "Ram", "Toyota"], models: ["F-150", "1500", "Tacoma"], categories: ["Pickup Trucks", "SUVs"], fuel: ["Gasoline", "Diesel"] },
};

export const REGIONAL_PRICE_TRENDS = {
  states: ["Texas", "California", "Florida", "Arizona", "Georgia"],
  data: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    Texas: 29200 - i * 68,
    California: 34200 - i * 72,
    Florida: 26400 - i * 42,
    Arizona: 27800 - i * 58,
    Georgia: 27100 - i * 48,
  })),
};

export const REGIONAL_INVENTORY = {
  inventoryGrowth: 4.2,
  newListings: 412,
  removedListings: 286,
  avgListingAge: 18.4,
  marketSaturation: 62,
  supplyIndex: 78,
  weekly: Array.from({ length: 8 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    growth: 2.1 + i * 0.3,
    newListings: 380 + i * 4,
    removed: 260 + i * 3,
  })),
};

export const REGIONAL_DEMAND_FORECAST = [
  { state: "Texas", projectedDemand: 96, expectedRoi: 26.4, avgSaleTime: 11, inventoryChange: -4.2, confidence: 94 },
  { state: "Arizona", projectedDemand: 91, expectedRoi: 23.8, avgSaleTime: 13, inventoryChange: -6.8, confidence: 91 },
  { state: "Florida", projectedDemand: 88, expectedRoi: 21.2, avgSaleTime: 14, inventoryChange: 2.4, confidence: 88 },
  { state: "Georgia", projectedDemand: 86, expectedRoi: 22.6, avgSaleTime: 15, inventoryChange: -1.8, confidence: 87 },
  { state: "California", projectedDemand: 82, expectedRoi: 22.4, avgSaleTime: 18, inventoryChange: 3.2, confidence: 85 },
  { state: "Colorado", projectedDemand: 84, expectedRoi: 24.1, avgSaleTime: 16, inventoryChange: -2.6, confidence: 86 },
];

export const REGIONAL_AI_INSIGHTS: AiInsightFeedItem[] = [
  { id: "ri1", text: "Texas remains the strongest buying market — margins up 8% MoM", timestamp: "6 min ago", confidence: 95, category: "Acquisition" },
  { id: "ri2", text: "Arizona inventory continues shrinking — down 6.8% in 30 days", timestamp: "15 min ago", confidence: 92, category: "Supply" },
  { id: "ri3", text: "Florida SUV demand increased 14% ahead of hurricane season prep", timestamp: "24 min ago", confidence: 88, category: "Demand" },
  { id: "ri4", text: "California margins declined slightly — EV segment pressure", timestamp: "33 min ago", confidence: 86, category: "Pricing" },
  { id: "ri5", text: "Pickup trucks outperform all categories across the Southwest", timestamp: "41 min ago", confidence: 93, category: "Segment" },
];

export const INTELLIGENCE_FILTER_OPTIONS = {
  marketplaces: ["All", "Facebook Marketplace", "Craigslist", "AutoTrader"],
  states: ["All", "Texas", "California", "Florida", "Arizona", "Georgia", "Colorado", "North Carolina"],
  cities: ["All", "Dallas", "Houston", "Austin", "Phoenix", "Denver", "Atlanta", "Charlotte", "Nashville"],
  makes: ["All", "Ford", "Toyota", "Honda", "Chevrolet", "Ram", "Tesla", "Jeep"],
  categories: ["All", "Truck", "SUV", "Sedan", "Electric", "Hybrid", "Luxury", "Compact"],
  fuelTypes: ["All", "Gasoline", "Hybrid", "Electric", "Diesel"],
  dateRanges: ["7 Days", "30 Days", "90 Days", "1 Year"],
};
