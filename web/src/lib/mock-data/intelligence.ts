import type {
  AcquisitionOpportunity,
  AcquisitionRecommendation,
  AiInsight,
  Alert,
  Competitor,
  DataSource,
  DemandForecastPoint,
  FleetVehicle,
  InventoryUnit,
  MarketplaceMetrics,
  RiskLevel,
  SellerProfile,
  SyncLog,
  VehicleListing,
  VehiclePricingIntelligence,
} from "@/lib/types";
import { getAllVehicles, getSavedOpportunities, getVehicleById } from "./generate-vehicles";
import { getDailyScrapeCounts, getTodayScrapeCount } from "./scrape-activity";

export const DATA_SOURCES: DataSource[] = [
  { id: "facebook", name: "Facebook Marketplace", category: "marketplace", status: "running", lastSync: "2 min ago", recordsImported: 184200, syncFrequency: "Every 30 min", connectionHealth: "excellent", avgDailyRecords: 612 },
  { id: "craigslist", name: "Craigslist", category: "marketplace", status: "idle", lastSync: "18 min ago", recordsImported: 92400, syncFrequency: "Every 1 hr", connectionHealth: "good", avgDailyRecords: 284 },
  { id: "autotrader", name: "AutoTrader", category: "marketplace", status: "running", lastSync: "1 min ago", recordsImported: 321000, syncFrequency: "Every 30 min", connectionHealth: "excellent", avgDailyRecords: 890 },
  { id: "carscom", name: "Cars.com", category: "marketplace", status: "idle", lastSync: "32 min ago", recordsImported: 156800, syncFrequency: "Every 2 hr", connectionHealth: "good", avgDailyRecords: 412 },
  { id: "cargurus", name: "CarGurus", category: "marketplace", status: "paused", lastSync: "1 hr ago", recordsImported: 110400, syncFrequency: "Every 2 hr", connectionHealth: "degraded", lastError: "Rate limit exceeded", avgDailyRecords: 318 },
  { id: "dealer", name: "Dealer Websites", category: "marketplace", status: "running", lastSync: "8 min ago", recordsImported: 64000, syncFrequency: "Every 4 hr", connectionHealth: "good", avgDailyRecords: 156 },
  { id: "oem", name: "OEM Inventory Feeds", category: "oem", status: "running", lastSync: "12 min ago", recordsImported: 48200, syncFrequency: "Every 6 hr", connectionHealth: "excellent", avgDailyRecords: 94 },
  { id: "auction", name: "Auction Feeds", category: "auction", status: "running", lastSync: "45 min ago", recordsImported: 28400, syncFrequency: "Daily", connectionHealth: "good", avgDailyRecords: 68 },
  { id: "inventory", name: "Internal Inventory", category: "internal", status: "running", lastSync: "5 min ago", recordsImported: 1248, syncFrequency: "Real-time", connectionHealth: "excellent", avgDailyRecords: 12 },
  { id: "crm", name: "CRM", category: "crm", status: "running", lastSync: "15 min ago", recordsImported: 8420, syncFrequency: "Every 1 hr", connectionHealth: "good", avgDailyRecords: 28 },
  { id: "dms", name: "DMS", category: "dms", status: "running", lastSync: "10 min ago", recordsImported: 15600, syncFrequency: "Every 30 min", connectionHealth: "excellent", avgDailyRecords: 42 },
];

export const SYNC_LOGS: SyncLog[] = [
  { id: "s1", source: "AutoTrader", timestamp: "Today, 9:14 AM", status: "success", records: 142, message: "Sync completed successfully" },
  { id: "s2", source: "Facebook Marketplace", timestamp: "Today, 9:12 AM", status: "success", records: 98, message: "Sync completed successfully" },
  { id: "s3", source: "CarGurus", timestamp: "Today, 8:45 AM", status: "warning", records: 0, message: "Rate limit exceeded — retry scheduled" },
  { id: "s4", source: "DMS", timestamp: "Today, 8:30 AM", status: "success", records: 24, message: "Inventory records updated" },
  { id: "s5", source: "Auction Feeds", timestamp: "Today, 7:00 AM", status: "success", records: 18, message: "New auction lots imported" },
  { id: "s6", source: "CRM", timestamp: "Today, 6:30 AM", status: "success", records: 12, message: "Lead activity synced" },
];

export const MARKET_TRENDS = [
  { metric: "Avg listing price", value: "$28,420", change: -2.4, explanation: "Average asking prices declined 2.4% over 30 days as supply increased in midsize SUVs." },
  { metric: "Active inventory", value: "5,247", change: 6.2, explanation: "Total tracked listings rose 6.2% as spring selling season accelerates listing volume." },
  { metric: "Days on market", value: "24.6", change: -8.1, explanation: "Vehicles are selling faster — average days listed fell 8.1% indicating stronger demand." },
  { metric: "Price reductions", value: "412", change: 14.3, explanation: "Sellers are adjusting prices more aggressively, up 14.3% week-over-week." },
];

export const FAST_SELLING_MODELS = [
  { model: "Toyota Tacoma", region: "Texas", daysToSell: 12, change: "+22% demand" },
  { model: "Ford F-150", region: "Southwest", daysToSell: 14, change: "+18% demand" },
  { model: "Honda CR-V", region: "Southeast", daysToSell: 16, change: "+11% demand" },
];

export const SLOW_SELLING_MODELS = [
  { model: "Chevrolet Malibu", region: "Texas", daysToSell: 48, change: "-14% demand" },
  { model: "Nissan Altima", region: "Southwest", daysToSell: 42, change: "-9% demand" },
  { model: "Hyundai Elantra", region: "Southeast", daysToSell: 38, change: "-6% demand" },
];

export const INVENTORY_UNITS: InventoryUnit[] = [
  { id: "inv-1", title: "2022 Ford F-150 XLT", stockNumber: "PAG-4821", daysInInventory: 18, cost: 32400, listPrice: 36900, margin: 4500, location: "Dallas", bodyStyle: "Truck", status: "retail" },
  { id: "inv-2", title: "2021 Toyota RAV4 LE", stockNumber: "PAG-4819", daysInInventory: 42, cost: 22800, listPrice: 26400, margin: 3600, location: "Houston", bodyStyle: "SUV", status: "retail" },
  { id: "inv-3", title: "2020 Honda Accord Sport", stockNumber: "PAG-4812", daysInInventory: 67, cost: 19200, listPrice: 21800, margin: 2600, location: "Austin", bodyStyle: "Sedan", status: "retail" },
  { id: "inv-4", title: "2023 Chevy Silverado LT", stockNumber: "PAG-4824", daysInInventory: 8, cost: 41200, listPrice: 45800, margin: 4600, location: "Dallas", bodyStyle: "Truck", status: "pending" },
  { id: "inv-5", title: "2019 BMW X5 xDrive40i", stockNumber: "PAG-4808", daysInInventory: 91, cost: 28400, listPrice: 31200, margin: 2800, location: "Fort Worth", bodyStyle: "SUV", status: "wholesale" },
  { id: "inv-6", title: "2022 Jeep Wrangler Sahara", stockNumber: "PAG-4816", daysInInventory: 34, cost: 31800, listPrice: 35400, margin: 3600, location: "San Antonio", bodyStyle: "SUV", status: "retail" },
];

export const COMPETITORS: Competitor[] = [
  { id: "c1", name: "Lone Star Motors", region: "Dallas-Fort Worth", inventoryCount: 842, inventoryChange: -12, avgPrice: 31200, priceReductions: 28, newListings: 64, marketShare: 18.2 },
  { id: "c2", name: "Gulf Coast Auto", region: "Houston", inventoryCount: 624, inventoryChange: 8, avgPrice: 28400, priceReductions: 14, newListings: 42, marketShare: 14.6 },
  { id: "c3", name: "Hill Country Cars", region: "Austin", inventoryCount: 418, inventoryChange: -4, avgPrice: 29800, priceReductions: 18, newListings: 38, marketShare: 11.4 },
  { id: "c4", name: "Southwest Auto Group", region: "Phoenix", inventoryCount: 512, inventoryChange: -8, avgPrice: 30600, priceReductions: 22, newListings: 48, marketShare: 12.8 },
];

export const SELLER_PROFILES: SellerProfile[] = [
  { id: "sel-1", name: "Premier Auto", type: "dealer", rating: 4.6, avgPrice: 32400, avgDaysListed: 22, repeatSeller: true, responseSpeed: "< 2 hrs", pricingAccuracy: 92, riskIndicators: [], listingCount: 186 },
  { id: "sel-2", name: "Texas Motors", type: "dealer", rating: 4.2, avgPrice: 28600, avgDaysListed: 28, repeatSeller: true, responseSpeed: "< 4 hrs", pricingAccuracy: 88, riskIndicators: ["Occasional overpricing"], listingCount: 142 },
  { id: "sel-3", name: "Private Seller", type: "private", rating: 3.8, avgPrice: 22400, avgDaysListed: 34, repeatSeller: false, responseSpeed: "< 24 hrs", pricingAccuracy: 76, riskIndicators: ["Inconsistent pricing", "Slow response"], listingCount: 892 },
  { id: "sel-4", name: "Metro Cars", type: "dealer", rating: 4.4, avgPrice: 31200, avgDaysListed: 19, repeatSeller: true, responseSpeed: "< 1 hr", pricingAccuracy: 94, riskIndicators: [], listingCount: 218 },
];

export const MARKETPLACE_METRICS: MarketplaceMetrics[] = [
  { id: "facebook", name: "Facebook Marketplace", listings: 1842, growthRate: 8.4, avgPriceChange: -1.2, qualityScore: 78, duplicateRate: 4.2, regionsCovered: 12, dailyVolume: 612, health: "excellent" },
  { id: "autotrader", name: "AutoTrader", listings: 3210, growthRate: 5.1, avgPriceChange: -0.8, qualityScore: 91, duplicateRate: 1.8, regionsCovered: 12, dailyVolume: 890, health: "excellent" },
  { id: "craigslist", name: "Craigslist", listings: 924, growthRate: 2.4, avgPriceChange: -2.1, qualityScore: 68, duplicateRate: 8.6, regionsCovered: 10, dailyVolume: 284, health: "good" },
  { id: "carscom", name: "Cars.com", listings: 1568, growthRate: 3.8, avgPriceChange: -1.4, qualityScore: 86, duplicateRate: 2.4, regionsCovered: 11, dailyVolume: 412, health: "good" },
  { id: "cargurus", name: "CarGurus", listings: 1104, growthRate: -1.2, avgPriceChange: 0.4, qualityScore: 84, duplicateRate: 3.1, regionsCovered: 11, dailyVolume: 318, health: "degraded" },
  { id: "dealer", name: "Dealer Websites", listings: 640, growthRate: 4.6, avgPriceChange: -0.6, qualityScore: 93, duplicateRate: 0.8, regionsCovered: 8, dailyVolume: 156, health: "good" },
];

export const FLEET_VEHICLES: FleetVehicle[] = [
  { id: "f1", unit: "FL-1042", make: "Ford", model: "Transit", year: 2019, mileage: 142000, utilization: 84, maintenanceCost: 4200, fuelCost: 6800, residualValue: 12400, replacementDue: "Q3 2026" },
  { id: "f2", unit: "FL-1088", make: "Chevrolet", model: "Silverado", year: 2018, mileage: 178000, utilization: 72, maintenanceCost: 5800, fuelCost: 9200, residualValue: 9800, replacementDue: "Q2 2026" },
  { id: "f3", unit: "FL-1102", make: "Toyota", model: "Camry", year: 2021, mileage: 68000, utilization: 91, maintenanceCost: 1800, fuelCost: 4200, residualValue: 18600, replacementDue: "Q1 2028" },
  { id: "f4", unit: "FL-1114", make: "Ram", model: "1500", year: 2017, mileage: 192000, utilization: 68, maintenanceCost: 6400, fuelCost: 10400, residualValue: 8200, replacementDue: "Q2 2026" },
  { id: "f5", unit: "FL-1120", make: "Honda", model: "CR-V", year: 2020, mileage: 94000, utilization: 88, maintenanceCost: 2400, fuelCost: 4800, residualValue: 16200, replacementDue: "Q4 2027" },
];

export const ALERTS: Alert[] = [
  { id: "a1", title: "Undervalued F-150 detected", description: "2021 Ford F-150 listed $4,200 below market in Dallas.", severity: "high", timestamp: "12 min ago", category: "Acquisition", read: false, channels: ["in_app", "email"] },
  { id: "a2", title: "Truck demand spike", description: "Pickup demand in Southwest up 18% over 7 days.", severity: "medium", timestamp: "1 hr ago", category: "Market", read: false, channels: ["in_app", "slack"] },
  { id: "a3", title: "Competitor inventory drop", description: "Lone Star Motors inventory fell 12% this week.", severity: "medium", timestamp: "2 hr ago", category: "Competitive", read: true, channels: ["in_app"] },
  { id: "a4", title: "Inventory aging threshold", description: "3 units exceeded 60 days in inventory.", severity: "high", timestamp: "3 hr ago", category: "Inventory", read: false, channels: ["in_app", "email", "sms"] },
  { id: "a5", title: "Rapid price reduction", description: "2022 RAV4 reduced $1,800 in 48 hours.", severity: "low", timestamp: "5 hr ago", category: "Pricing", read: true, channels: ["in_app"] },
  { id: "a6", title: "Auction opportunity", description: "12 trucks below reserve at Manheim Dallas.", severity: "high", timestamp: "6 hr ago", category: "Auction", read: false, channels: ["in_app", "email"] },
];

function toAcquisitionRecommendation(score: number): AcquisitionRecommendation {
  if (score >= 88) return "acquire_immediately";
  if (score >= 75) return "strong_candidate";
  if (score >= 60) return "monitor";
  return "avoid";
}

function toRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  return "high";
}

export function enrichAcquisition(vehicle: VehicleListing): AcquisitionOpportunity {
  const margin = vehicle.marginPotential ?? Math.max(0, (vehicle.fairMarketValue ?? vehicle.price) - vehicle.price);
  const acquisitionScore = Math.min(100, Math.round(vehicle.opportunityScore * 0.4 + vehicle.aiScore * 0.3 + (margin > 3000 ? 30 : 15)));
  const marginScore = Math.min(100, Math.round((margin / 6000) * 100));
  const demandScore = Math.min(100, vehicle.aiScore + 8);
  const sellerTrustScore = vehicle.sellerType === "dealer" ? 82 : 68;
  const pricingScore = Math.min(100, Math.round(((vehicle.fairMarketValue ?? vehicle.price) - vehicle.price) / vehicle.price * 200 + 50));
  const acquisitionRecommendation = toAcquisitionRecommendation(acquisitionScore);

  const explanations: Record<AcquisitionRecommendation, string> = {
    acquire_immediately: `Strong margin ($${margin.toLocaleString()}) with high demand signals for ${vehicle.make} ${vehicle.model} in ${vehicle.location.split(",")[0]}. Pricing is favorable and resale velocity is above regional average.`,
    strong_candidate: `Solid acquisition candidate with ${marginScore}% margin score. Negotiate 3–5% below asking to maximize ROI.`,
    monitor: `Moderate opportunity. Track price movement and competitor activity before committing.`,
    avoid: `Limited margin and elevated risk at current asking price. Better alternatives available in market.`,
  };

  return {
    ...vehicle,
    marketPrice: vehicle.fairMarketValue ?? vehicle.price,
    estimatedValue: vehicle.estimatedResale ?? vehicle.price + margin,
    marginPotential: margin,
    acquisitionScore,
    marginScore,
    demandScore,
    sellerTrustScore,
    pricingScore,
    negotiationPotential: Math.min(100, pricingScore + 10),
    expectedResaleDays: vehicle.bodyStyle === "Truck" ? 14 : vehicle.bodyStyle === "SUV" ? 18 : 26,
    expectedProfit: margin,
    riskLevel: toRiskLevel(acquisitionScore),
    acquisitionRecommendation,
    aiExplanation: explanations[acquisitionRecommendation],
    sellerQuality: sellerTrustScore,
    recommendation: vehicle.recommendation ?? "monitor",
  };
}

export function getAcquisitionOpportunities(): AcquisitionOpportunity[] {
  return getSavedOpportunities().map(enrichAcquisition);
}

export function getVehiclePricingIntelligence(vehicleId: string): VehiclePricingIntelligence | null {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;

  const fmv = vehicle.fairMarketValue ?? vehicle.price;
  const margin = Math.max(0, fmv - vehicle.price);
  const comparables = getAllVehicles()
    .filter((v) => v.make === vehicle.make && v.model === vehicle.model && v.id !== vehicle.id)
    .slice(0, 4)
    .map((v) => ({ title: v.title, price: v.price, location: v.location }));

  const pricePosition: "below" | "at" | "above" =
    vehicle.price < fmv * 0.97 ? "below" : vehicle.price > fmv * 1.03 ? "above" : "at";

  return {
    vehicleId,
    estimatedMarketValue: fmv,
    confidenceScore: 88,
    suggestedPurchasePrice: Math.round(vehicle.price * 0.96),
    suggestedSellingPrice: Math.round(fmv * 1.04),
    expectedGrossProfit: margin,
    expectedRoi: Math.round((margin / vehicle.price) * 100 * 10) / 10,
    expectedDaysToSell: vehicle.bodyStyle === "Truck" ? 14 : 22,
    riskLevel: margin > 2500 ? "low" : margin > 1000 ? "medium" : "high",
    marketCompetitiveness: Math.min(100, 70 + Math.round(margin / 200)),
    pricePosition,
    aiExplanation: `Listed ${pricePosition === "below" ? "below" : pricePosition === "above" ? "above" : "at"} regional market average. ${vehicle.make} ${vehicle.model} units in ${vehicle.location.split(",")[1]?.trim() ?? "region"} are moving in ${vehicle.bodyStyle === "Truck" ? "14" : "22"} days on average. Confidence driven by ${comparables.length} comparable listings.`,
    comparables,
    regionalAvg: fmv,
  };
}

export function getDemandForecast(segment: string): DemandForecastPoint[] {
  const base = segment.includes("Truck") ? 82 : segment.includes("SUV") ? 74 : 62;
  return [
    { period: "30d", demand: base, low: base - 8, high: base + 6 },
    { period: "60d", demand: base + 4, low: base - 4, high: base + 12 },
    { period: "90d", demand: base + 8, low: base, high: base + 16 },
    { period: "6mo", demand: base + 12, low: base + 2, high: base + 22 },
    { period: "12mo", demand: base + 6, low: base - 6, high: base + 18 },
  ];
}

export function getExecutiveSummary() {
  const today = getTodayScrapeCount();
  return {
    highlights: [
      `${today} new vehicles discovered today`,
      "42 undervalued listings detected",
      "Truck demand increased 18% in Southwest",
      "Average listing price down 2.4%",
      "17 acquisition opportunities flagged",
    ],
    estimatedAcquisitionValue: 1842000,
    potentialGrossProfit: 428000,
    inventoryHealth: 78,
    marketCoverage: 12,
    highOpportunityCount: 17,
  };
}

export function getPageInsights(page: string): AiInsight[] {
  const insights: Record<string, AiInsight[]> = {
    dashboard: [
      {
        what: "Truck demand up 18% in Southwest",
        why: "Inventory for pickups fell 14% while search volume increased",
        impact: "Acquisition margins on trucks may compress within 30 days",
        action: "Prioritize F-150 and Tacoma acquisitions this week",
        confidence: 92,
      },
    ],
    "data-sources": [
      {
        what: "CarGurus sync degraded",
        why: "Rate limiting triggered during peak crawl window",
        impact: "12% gap in Southwest listing coverage until restored",
        action: "Reduce sync frequency to every 4 hours temporarily",
        confidence: 96,
      },
    ],
    "market-intelligence": [
      {
        what: "Used Toyota Tacomas in Texas up 6.8%",
        why: "Inventory fell 18% over 30 days while demand held steady",
        impact: "Retail pricing power increasing for this segment",
        action: "Increase Tacoma acquisition targets in Dallas and Houston",
        confidence: 91,
      },
    ],
    pricing: [
      {
        what: "38 listings priced 8%+ below market",
        why: "Private sellers adjusting faster than dealers in Texas metros",
        impact: "$428K potential gross profit across flagged units",
        action: "Route top 10 to acquisition team for immediate review",
        confidence: 89,
      },
    ],
    inventory: [
      {
        what: "Inventory overweight in sedans",
        why: "Sedan share at 34% vs 22% regional benchmark",
        impact: "Turn rate projected 12% below target this quarter",
        action: "Discount 2019–2021 sedans and acquire additional trucks",
        confidence: 87,
      },
    ],
    opportunities: [
      {
        what: "17 high-confidence acquisition targets",
        why: "Combined margin score above 75 with low seller risk",
        impact: "Expected profit $186K if 60% convert",
        action: "Contact top 5 private-seller listings today",
        confidence: 90,
      },
    ],
    demand: [
      {
        what: "Pickup shortage expected in 90 days",
        why: "Seasonal demand curve and declining wholesale supply",
        impact: "Retail prices may rise 3–5% in Q3",
        action: "Build truck inventory 8% above current levels",
        confidence: 84,
      },
    ],
    competitive: [
      {
        what: "Lone Star Motors inventory down 12%",
        why: "Aggressive wholesale disposition of aged units",
        impact: "Opening to capture market share in DFW trucks",
        action: "Match pricing on comparable F-150 inventory",
        confidence: 88,
      },
    ],
    fleet: [
      {
        what: "2 units exceed 170,000 miles",
        why: "Maintenance costs rising above replacement threshold",
        impact: "$18K annual savings from targeted replacement",
        action: "Replace FL-1088 and FL-1114 in Q2 2026",
        confidence: 93,
      },
    ],
    sellers: [
      {
        what: "Metro Cars shows 94% pricing accuracy",
        why: "Consistent listing-to-sale price alignment over 90 days",
        impact: "Lower negotiation friction on dealer acquisitions",
        action: "Prioritize Metro Cars listings in acquisition queue",
        confidence: 86,
      },
    ],
    marketplaces: [
      {
        what: "AutoTrader highest quality score at 91",
        why: "Low duplicate rate and complete listing metadata",
        impact: "Best source for pricing intelligence calibration",
        action: "Weight AutoTrader comparables at 40% in pricing model",
        confidence: 94,
      },
    ],
    alerts: [
      {
        what: "4 unread high-priority alerts",
        why: "Acquisition and inventory thresholds breached today",
        impact: "Delayed response may forfeit undervalued units",
        action: "Review acquisition alerts before end of day",
        confidence: 97,
      },
    ],
    reports: [
      {
        what: "Weekly acquisition report ready",
        why: "17 opportunities and 42 undervalued units flagged",
        impact: "Executive team briefing data current as of this morning",
        action: "Export PDF for Monday leadership review",
        confidence: 95,
      },
    ],
  };
  return insights[page] ?? insights.dashboard;
}
