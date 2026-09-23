import type {
  AiInsightFeedItem,
  AlertRulesConfig,
  BuyRecommendationStatus,
  ComparableListing,
  DemandIntelMetrics,
  NegotiationIntel,
  OpportunityBreakdown,
  OpportunityLabel,
  PricingIntelExtended,
  PricingOpportunityDriver,
  PricingWorkspace,
  ProfitAnalysis,
  PurchaseAlert,
  RegionalCityIntel,
  RegionalStateIntel,
  VehicleOpportunityIntel,
} from "@/lib/types";
import { getAllVehicles, getSavedOpportunities, getVehicleById } from "./generate-vehicles";
import { VEHICLE_MAKES } from "./generate-vehicles";

function seed(id: string | number) {
  const n = typeof id === "string" ? id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) : id;
  const x = Math.sin(n * 9999) * 10000;
  return x - Math.floor(x);
}

export function getOpportunityLabel(score: number): OpportunityLabel {
  if (score >= 90) return "excellent_buy";
  if (score >= 78) return "strong_opportunity";
  if (score >= 65) return "worth_reviewing";
  if (score >= 50) return "high_risk";
  return "avoid";
}

export const OPPORTUNITY_LABEL_DISPLAY: Record<
  OpportunityLabel,
  { label: string; emoji: string; className: string }
> = {
  excellent_buy: { label: "Excellent Buy", emoji: "🔥", className: "bg-[var(--tint-success-bg)] text-[var(--tint-success-fg)] border-transparent" },
  strong_opportunity: { label: "Strong Opportunity", emoji: "🟢", className: "bg-[var(--tint-success-bg)] text-[var(--tint-success-fg)] border-transparent" },
  worth_reviewing: { label: "Worth Reviewing", emoji: "🟡", className: "bg-[var(--tint-warning-bg)] text-[var(--tint-warning-fg)] border-transparent" },
  high_risk: { label: "High Risk", emoji: "🟠", className: "bg-[var(--tint-warning-bg)] text-[var(--tint-warning-fg)] border-transparent" },
  avoid: { label: "Avoid", emoji: "🔴", className: "bg-[var(--tint-danger-bg)] text-[var(--tint-danger-fg)] border-transparent" },
};

export function getVehicleOpportunityIntel(vehicleId: string): VehicleOpportunityIntel | null {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;

  const s = seed(vehicleId);
  const score = Math.min(99, Math.max(42, vehicle.opportunityScore + Math.round((s - 0.5) * 8)));
  const margin = vehicle.marginPotential ?? Math.max(0, (vehicle.fairMarketValue ?? vehicle.price) - vehicle.price);
  const pctBelow = Math.round(((vehicle.fairMarketValue ?? vehicle.price) - vehicle.price) / vehicle.price * 100);

  const breakdown: OpportunityBreakdown = {
    estimatedProfit: Math.min(99, Math.round(70 + (margin / 80))),
    marketDemand: Math.min(99, vehicle.aiScore + 6),
    daysToSell: vehicle.bodyStyle === "Truck" ? 12 : vehicle.bodyStyle === "SUV" ? 16 : 22,
    popularity: Math.min(99, Math.round(65 + s * 30)),
    priceAttractiveness: Math.min(99, Math.round(60 + pctBelow * 2.5)),
    repairRisk: margin > 3500 ? "Low" : margin > 1500 ? "Medium" : "High",
    repairRiskScore: margin > 3500 ? 88 : margin > 1500 ? 62 : 38,
  };

  const city = vehicle.location.split(",")[0];
  const state = vehicle.location.split(",")[1]?.trim() ?? "TX";

  const bullets = [
    pctBelow > 0 ? `Listed ${Math.abs(pctBelow)}% below estimated market value` : "Priced near regional market average",
    `Similar vehicles sell within ${breakdown.daysToSell} days`,
    `High demand in ${state}`,
    `${vehicle.make} ${vehicle.model} shows strong resale performance`,
    `Low predicted repair costs for ${vehicle.year} model year`,
    `High buyer search volume in ${city} metro`,
  ].filter((_, i) => i < 4 + Math.floor(s * 3));

  return {
    score,
    confidence: Math.min(97, 82 + Math.round(s * 14)),
    label: getOpportunityLabel(score),
    breakdown,
    explanationBullets: bullets,
  };
}

export function getNegotiationIntel(vehicleId: string): NegotiationIntel | null {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;
  const s = seed(vehicleId + "neg");
  const motivation = vehicle.daysListed > 21 ? "High" : vehicle.daysListed > 12 ? "Medium" : "Low";

  return {
    firstOffer: Math.round(vehicle.price * (0.91 + s * 0.03)),
    targetPurchasePrice: Math.round(vehicle.price * (0.94 + s * 0.02)),
    acceptanceProbability: Math.min(92, Math.round(68 + vehicle.daysListed * 0.8 + s * 10)),
    maxOffer: Math.round(vehicle.price * (0.97 + s * 0.02)),
    sellerMotivation: motivation as NegotiationIntel["sellerMotivation"],
    difficulty: motivation === "High" ? "Easy" : motivation === "Medium" ? "Moderate" : "Hard",
    reasoningBullets: [
      vehicle.daysListed > 14 ? "Seller reduced asking price twice" : "Listing price stable since posted",
      `Vehicle has been listed for ${vehicle.daysListed} days`,
      "Comparable inventory is increasing in this segment",
      motivation === "High"
        ? "High probability of successful negotiation"
        : "Moderate room for price negotiation",
    ],
    explanation:
      vehicle.daysListed > 14
        ? "Seller has reduced the asking price twice over the last two weeks. Similar vehicles remain on the market for more than 20 days, suggesting there is room for negotiation."
        : "Listing is relatively new with limited price movement. Comparable supply suggests modest negotiation leverage within 3–5% of asking.",
  };
}

export function getProfitAnalysis(vehicleId: string): ProfitAnalysis | null {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;
  const s = seed(vehicleId + "profit");
  const purchase = Math.round(vehicle.price * 0.96);
  const transport = 450 + Math.round(s * 350);
  const recon = 800 + Math.round(s * 1200);
  const auctionFees = 275 + Math.round(s * 125);
  const holding = 320 + Math.round(vehicle.daysListed * 12);
  const sell = vehicle.estimatedResale ?? Math.round((vehicle.fairMarketValue ?? vehicle.price) * 1.05);
  const totalAcquisitionCost = purchase + transport + recon + auctionFees + holding;
  const net = sell - totalAcquisitionCost;

  const costBreakdown = [
    { name: "Transport", value: transport },
    { name: "Recon", value: recon },
    { name: "Auction/Fees", value: auctionFees },
    { name: "Holding", value: holding },
  ];

  return {
    purchasePrice: purchase,
    transportation: transport,
    reconditioning: recon,
    auctionFees,
    holdingCost: holding,
    totalAcquisitionCost,
    expectedSellingPrice: sell,
    netProfit: net,
    roi: Math.round((net / purchase) * 1000) / 10,
    costBreakdown,
    waterfall: [
      { label: "Purchase", value: -purchase, type: "cost" },
      { label: "Transport", value: -transport, type: "cost" },
      { label: "Recon", value: -recon, type: "cost" },
      { label: "Fees", value: -auctionFees, type: "cost" },
      { label: "Holding", value: -holding, type: "cost" },
      { label: "Sale", value: sell, type: "revenue" },
      { label: "Net profit", value: net, type: "total" },
    ],
  };
}

export function getPricingWorkspace(vehicleId: string): PricingWorkspace | null {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;

  const s = seed(vehicleId);
  const opportunity = getVehicleOpportunityIntel(vehicleId);
  const negotiation = getNegotiationIntel(vehicleId)!;
  const profit = getProfitAnalysis(vehicleId)!;

  const marketValue = vehicle.fairMarketValue ?? Math.round(vehicle.price * 1.08);
  const diff = vehicle.price - marketValue;
  const diffPct = Math.round((diff / marketValue) * 1000) / 10;
  const recommendedPurchase = Math.round(vehicle.price * (0.93 + s * 0.02));
  const maxPurchase = Math.round(vehicle.price * (0.98 + s * 0.01));
  const expectedResale = profit.expectedSellingPrice;
  const expectedNetProfit = profit.netProfit;
  const projectedRoi = profit.roi;

  const compPrices = getAllVehicles()
    .filter((v) => v.make === vehicle.make && v.model === vehicle.model && v.id !== vehicle.id)
    .map((v) => v.price);
  const lowestComparable = compPrices.length ? Math.min(...compPrices) : Math.round(vehicle.price * 0.88);
  const highestComparable = compPrices.length ? Math.max(...compPrices) : Math.round(vehicle.price * 1.12);
  const marketAverage = compPrices.length
    ? Math.round(compPrices.reduce((a, b) => a + b, 0) / compPrices.length)
    : marketValue;

  const comparables: ComparableListing[] = getAllVehicles()
    .filter((v) => v.make === vehicle.make && v.id !== vehicle.id)
    .slice(0, 10)
    .map((v, i) => ({
      id: v.id,
      vehicle: `${v.year} ${v.make} ${v.model}`,
      year: v.year,
      mileage: v.mileage,
      price: v.price,
      daysListed: v.daysListed,
      source: v.marketplace,
      distance: `${6 + i * 5} mi`,
      status: (i % 7 === 0 ? "Sold" : i % 5 === 0 ? "Pending" : "Active") as ComparableListing["status"],
    }));

  const pctBelow = Math.round(((marketValue - vehicle.price) / marketValue) * 100);
  let recStatus: BuyRecommendationStatus = "review";
  if (opportunity && opportunity.score >= 82 && pctBelow >= 8) recStatus = "buy";
  else if (opportunity && (opportunity.score < 60 || pctBelow < 0)) recStatus = "avoid";

  const city = vehicle.location.split(",")[0];
  const initialPrice = vehicle.priceHistory?.[0]?.price ?? Math.round(vehicle.price * 1.08);
  const reductionCount = vehicle.priceHistory ? Math.max(0, vehicle.priceHistory.length - 1) : 2;

  const priceHistoryPoints = vehicle.priceHistory?.length
    ? vehicle.priceHistory.map((p, i) => ({
        date: p.date,
        label: i === 0 ? "Listed" : `Drop ${i}`,
        price: p.price,
        event: i === 0 ? "Initial listing" : `Price reduced $${(vehicle.priceHistory![i - 1]?.price ?? p.price) - p.price}`,
      }))
  : [
      { date: "2026-05-20", label: "Listed", price: initialPrice, event: "Initial listing" },
      { date: "2026-06-01", label: "Drop 1", price: Math.round(initialPrice * 0.97), event: "Price reduced" },
      { date: "2026-06-12", label: "Current", price: vehicle.price, event: "Current asking price" },
    ];

  const insights: AiInsightFeedItem[] = [
    {
      id: `pi-${vehicleId}-1`,
      text: `This listing is priced ${Math.abs(pctBelow)}% ${pctBelow >= 0 ? "below" : "above"} the local market average`,
      timestamp: "2 min ago",
      confidence: 94,
      category: "Valuation",
    },
    {
      id: `pi-${vehicleId}-2`,
      text: `Comparable ${vehicle.make} ${vehicle.model} vehicles typically sell within ${opportunity?.breakdown.daysToSell ?? 14} days`,
      timestamp: "9 min ago",
      confidence: 91,
      category: "Demand",
    },
    {
      id: `pi-${vehicleId}-3`,
      text: `Purchasing below ${formatCurrencyShort(recommendedPurchase)} is projected to increase ROI by ${Math.round(4 + s * 6)}%`,
      timestamp: "16 min ago",
      confidence: 89,
      category: "Profit",
    },
    {
      id: `pi-${vehicleId}-4`,
      text: `Regional demand for ${vehicle.model} has increased over the last month in ${city}`,
      timestamp: "24 min ago",
      confidence: 87,
      category: "Regional",
    },
    {
      id: `pi-${vehicleId}-5`,
      text: "Similar listings have experienced multiple price reductions in this segment",
      timestamp: "31 min ago",
      confidence: 85,
      category: "Market",
    },
  ];

  const repairScore = opportunity?.breakdown.repairRiskScore ?? 70;
  const demandScore = opportunity?.breakdown.marketDemand ?? 80;

  return {
    vehicleId,
    vehicleTitle: vehicle.title,
    marketplace: vehicle.marketplace,
    location: vehicle.location,
    make: vehicle.make,
    model: vehicle.model,
    askingPrice: vehicle.price,
    marketValue,
    recommendedPurchase,
    maxPurchase,
    expectedResale,
    expectedNetProfit,
    projectedRoi,
    recommendation: {
      status: recStatus,
      confidence: opportunity?.confidence ?? 91,
      timestamp: "Updated 3 minutes ago",
      bullets: opportunity?.explanationBullets ?? [
        `Listed ${Math.abs(pctBelow)}% below market value`,
        "High regional demand",
        "Strong resale history",
        "Low predicted repair costs",
        `Expected sale within ${opportunity?.breakdown.daysToSell ?? 14} days`,
      ],
    },
    priceComparison: {
      askingPrice: vehicle.price,
      marketValue,
      difference: diff,
      differencePct: diffPct,
      lowestComparable,
      marketAverage,
      highestComparable,
    },
    comparables,
    negotiation,
    profit,
    priceHistory: {
      points: priceHistoryPoints,
      initialPrice,
      currentPrice: vehicle.price,
      totalReduction: initialPrice - vehicle.price,
      reductionCount,
      daysSinceLastReduction: Math.max(1, vehicle.daysListed % 12),
    },
    marketSnapshot: {
      avgLocalPrice: marketAverage,
      avgDaysToSell: opportunity?.breakdown.daysToSell ?? 14,
      demandScore,
      inventoryLevel: demandScore > 85 ? "Low" : demandScore > 70 ? "Balanced" : "High",
      similarActiveListings: 18 + Math.round(s * 24),
      recentSales: 6 + Math.round(s * 8),
      demandTrend: [72, 74, 76, 79, 81, demandScore, demandScore + 2].map((v) => Math.min(99, v)),
    },
    risk: {
      pricing: Math.min(95, Math.max(20, 100 - Math.abs(pctBelow) * 3)),
      repair: repairScore,
      demand: demandScore,
      holding: Math.min(90, 40 + vehicle.daysListed * 2),
      market: Math.min(92, 55 + Math.round(s * 35)),
      overall:
        repairScore > 75 && demandScore > 80
          ? "Low Risk"
          : repairScore > 55 && demandScore > 65
            ? "Moderate Risk"
            : "High Risk",
    },
    positiveDrivers: [
      { icon: "trending", title: "Below market value", description: `${Math.abs(pctBelow)}% under AI estimated market` },
      { icon: "demand", title: "High buyer demand", description: `Demand score ${demandScore} in ${city}` },
      { icon: "mileage", title: "Competitive mileage", description: `${vehicle.mileage.toLocaleString()} mi vs segment avg` },
      { icon: "resale", title: "Strong resale performance", description: `${vehicle.make} ${vehicle.model} holds value well` },
      { icon: "inventory", title: "Low inventory", description: "Limited comparable supply locally" },
    ],
    negativeDrivers: [
      { icon: "repair", title: "Cosmetic repairs likely", description: "Minor reconditioning budget recommended" },
      { icon: "seasonal", title: "Seasonal demand shift", description: "Segment velocity softening slightly" },
      { icon: "transport", title: "Transportation cost", description: `Est. ${formatCurrencyShort(profit.transportation)} to hub` },
      { icon: "age", title: "Model year factor", description: `${vehicle.year} model — verify warranty coverage` },
    ],
    insights,
  };
}

function formatCurrencyShort(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
}

export function getPricingIntelExtended(vehicleId: string): PricingIntelExtended | null {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;
  const marketValue = vehicle.fairMarketValue ?? Math.round(vehicle.price * 1.08);
  const diff = vehicle.price - marketValue;
  const diffPct = Math.round((diff / marketValue) * 1000) / 10;

  const comparables: ComparableListing[] = getAllVehicles()
    .filter((v) => v.make === vehicle.make && v.id !== vehicle.id)
    .slice(0, 8)
    .map((v, i) => ({
      id: v.id,
      vehicle: `${v.year} ${v.make} ${v.model}`,
      year: v.year,
      mileage: v.mileage,
      price: v.price,
      daysListed: v.daysListed,
      source: v.marketplace,
      distance: `${8 + i * 6} mi`,
    }));

  return {
    currentPrice: vehicle.price,
    marketValue,
    difference: diff,
    differencePct: diffPct,
    marketPosition: diffPct < -3 ? `${Math.abs(diffPct)}% Under Market` : diffPct > 3 ? `${diffPct}% Over Market` : "At Market",
    recommendedPurchase: Math.round(vehicle.price * 0.95),
    maxPurchase: Math.round(vehicle.price * 0.98),
    expectedSelling: Math.round(marketValue * 1.06),
    expectedGrossProfit: marketValue - Math.round(vehicle.price * 0.95),
    confidence: 91,
    priceDistribution: [
      { range: "$12–18k", count: 42 },
      { range: "$18–24k", count: 68 },
      { range: "$24–30k", count: 54 },
      { range: "$30–36k", count: 38 },
      { range: "$36k+", count: 22 },
    ],
    priceTrend: [
      { month: "Jan", price: vehicle.price + 1200, market: marketValue + 800 },
      { month: "Feb", price: vehicle.price + 900, market: marketValue + 600 },
      { month: "Mar", price: vehicle.price + 600, market: marketValue + 400 },
      { month: "Apr", price: vehicle.price + 400, market: marketValue + 200 },
      { month: "May", price: vehicle.price + 200, market: marketValue },
      { month: "Jun", price: vehicle.price, market: marketValue - 100 },
    ],
    comparables,
  };
}

export const PURCHASE_ALERTS: PurchaseAlert[] = getSavedOpportunities()
  .slice(0, 8)
  .map((v, i) => ({
    id: `pa-${i + 1}`,
    vehicleId: v.id,
    title: `${v.year} ${v.make} ${v.model}`,
    opportunityScore: Math.min(99, v.opportunityScore + 4),
    expectedProfit: v.marginPotential ?? 4200,
    location: v.location.split(",")[0],
    postedAgo: `${4 + i * 7} minutes ago`,
    read: i > 3,
  }));

export const DEFAULT_ALERT_RULES: AlertRulesConfig = {
  enabled: true,
  minOpportunityScore: 85,
  minProfit: 2500,
  maxPurchasePrice: 45000,
  maxMileage: 120000,
  preferredMakes: ["Ford", "Toyota", "Chevrolet", "Honda"],
  preferredModels: ["F-150", "Tacoma", "Silverado", "CR-V"],
  preferredCities: ["Dallas", "Houston", "Austin", "Phoenix"],
  marketplaces: ["Facebook Marketplace", "Craigslist", "CarGurus"],
  repairRiskThreshold: "Medium",
  roiThreshold: 18,
  demandScoreThreshold: 75,
  priceDropPercent: 5,
  makes: ["Ford", "Toyota", "Chevrolet", "Honda"],
  cities: ["Dallas", "Houston", "Austin", "Phoenix"],
  categories: ["Truck", "SUV"],
};

export const AI_INSIGHT_FEED: AiInsightFeedItem[] = [
  { id: "i1", text: "Toyota Tacoma demand increased 16% in Texas this week", timestamp: "2 min ago", confidence: 94, category: "Demand" },
  { id: "i2", text: "SUVs priced under $20,000 are selling 28% faster", timestamp: "8 min ago", confidence: 91, category: "Pricing" },
  { id: "i3", text: "Ford F-150 inventory has fallen across Dallas", timestamp: "14 min ago", confidence: 88, category: "Supply" },
  { id: "i4", text: "Honda Civic listings have become 9% cheaper over the past month", timestamp: "22 min ago", confidence: 86, category: "Market" },
  { id: "i5", text: "Vehicles with Opportunity Scores above 90 average a projected ROI of 26%", timestamp: "31 min ago", confidence: 93, category: "Acquisition" },
  { id: "i6", text: "Private-seller trucks in Houston showing 12% higher margins", timestamp: "45 min ago", confidence: 87, category: "Regional" },
  { id: "i7", text: "EV segment demand index up 12% — Model Y leading volume", timestamp: "1 hr ago", confidence: 85, category: "Demand" },
];

export const US_STATE_INTEL: RegionalStateIntel[] = [
  { code: "TX", name: "Texas", demandScore: 94, avgSaleTime: 11, avgMargin: 4850, topCategory: "Pickup Trucks" },
  { code: "AZ", name: "Arizona", demandScore: 88, avgSaleTime: 13, avgMargin: 4200, topCategory: "SUVs" },
  { code: "FL", name: "Florida", demandScore: 86, avgSaleTime: 14, avgMargin: 3900, topCategory: "Sedans" },
  { code: "GA", name: "Georgia", demandScore: 84, avgSaleTime: 15, avgMargin: 4100, topCategory: "SUVs" },
  { code: "CO", name: "Colorado", demandScore: 82, avgSaleTime: 16, avgMargin: 4500, topCategory: "Trucks" },
  { code: "NC", name: "North Carolina", demandScore: 81, avgSaleTime: 14, avgMargin: 3800, topCategory: "SUVs" },
  { code: "TN", name: "Tennessee", demandScore: 79, avgSaleTime: 15, avgMargin: 3600, topCategory: "Trucks" },
  { code: "CA", name: "California", demandScore: 78, avgSaleTime: 18, avgMargin: 5200, topCategory: "Electric" },
  { code: "NV", name: "Nevada", demandScore: 76, avgSaleTime: 16, avgMargin: 4000, topCategory: "SUVs" },
  { code: "OK", name: "Oklahoma", demandScore: 74, avgSaleTime: 17, avgMargin: 3400, topCategory: "Trucks" },
  { code: "MO", name: "Missouri", demandScore: 72, avgSaleTime: 18, avgMargin: 3200, topCategory: "Sedans" },
  { code: "NY", name: "New York", demandScore: 68, avgSaleTime: 22, avgMargin: 4800, topCategory: "Sedans" },
];

export const TOP_CITIES_INTEL: RegionalCityIntel[] = [
  { city: "Dallas", state: "TX", demandScore: 96, inventory: 842, avgMargin: 5120, avgSaleTime: 10 },
  { city: "Houston", state: "TX", demandScore: 93, inventory: 724, avgMargin: 4680, avgSaleTime: 11 },
  { city: "Austin", state: "TX", demandScore: 91, inventory: 418, avgMargin: 4920, avgSaleTime: 12 },
  { city: "Phoenix", state: "AZ", demandScore: 89, inventory: 512, avgMargin: 4350, avgSaleTime: 13 },
  { city: "Denver", state: "CO", demandScore: 85, inventory: 386, avgMargin: 4580, avgSaleTime: 14 },
  { city: "Atlanta", state: "GA", demandScore: 84, inventory: 468, avgMargin: 4020, avgSaleTime: 15 },
  { city: "Charlotte", state: "NC", demandScore: 82, inventory: 312, avgMargin: 3880, avgSaleTime: 14 },
  { city: "Nashville", state: "TN", demandScore: 80, inventory: 284, avgMargin: 3720, avgSaleTime: 16 },
];

export const POPULAR_TRENDS = {
  brands: [
    { name: "Toyota", value: 92 },
    { name: "Ford", value: 88 },
    { name: "Honda", value: 84 },
    { name: "Chevrolet", value: 79 },
    { name: "Tesla", value: 76 },
  ],
  bodyStyles: [
    { name: "Pickup Trucks", value: 94 },
    { name: "SUVs", value: 86 },
    { name: "Sedans", value: 68 },
    { name: "EVs", value: 72 },
  ],
  fuelTypes: [
    { name: "Gasoline", value: 78 },
    { name: "Hybrid", value: 82 },
    { name: "Electric", value: 74 },
    { name: "Diesel", value: 64 },
  ],
  priceSegments: [
    { name: "Under $15k", value: 71 },
    { name: "$15–25k", value: 88 },
    { name: "$25–35k", value: 84 },
    { name: "$35k+", value: 69 },
  ],
};

export function getDemandIntelMetrics(): DemandIntelMetrics {
  return {
    topModels: [
      { model: "Ford F-150", demandIndex: 94, change: 18 },
      { model: "Toyota Tacoma", demandIndex: 91, change: 16 },
      { model: "Honda CR-V", demandIndex: 86, change: 11 },
      { model: "Chevy Silverado", demandIndex: 84, change: 14 },
      { model: "Tesla Model Y", demandIndex: 82, change: 12 },
    ],
    fastestSelling: [
      { vehicle: "2022 Toyota Tacoma", days: 9 },
      { vehicle: "2021 Ford F-150", days: 11 },
      { vehicle: "2023 Honda CR-V", days: 13 },
      { vehicle: "2022 Ram 1500", days: 14 },
    ],
    topBrands: [
      { brand: "Toyota", share: 18.4 },
      { brand: "Ford", share: 16.2 },
      { brand: "Honda", share: 12.8 },
      { brand: "Chevrolet", share: 11.6 },
    ],
    topCategories: [
      { category: "Pickup Trucks", index: 94 },
      { category: "Mid-size SUVs", index: 86 },
      { category: "Compact SUVs", index: 82 },
      { category: "Sedans", index: 68 },
    ],
    avgDaysToSell: 14.2,
    demandIndex: 87,
    inventorySupply: 5143,
    buyerActivity: 92,
    forecast30: Array.from({ length: 4 }, (_, i) => ({
      week: `Wk ${i + 1}`,
      demand: 82 + i * 3,
    })),
    forecast60: Array.from({ length: 8 }, (_, i) => ({
      week: `Wk ${i + 1}`,
      demand: 80 + i * 2.2,
    })),
    forecast90: Array.from({ length: 12 }, (_, i) => ({
      week: `Wk ${i + 1}`,
      demand: 78 + i * 1.8,
    })),
    seasonal: [
      { month: "Jan", index: 0.92 },
      { month: "Feb", index: 0.96 },
      { month: "Mar", index: 1.04 },
      { month: "Apr", index: 1.1 },
      { month: "May", index: 1.14 },
      { month: "Jun", index: 1.12 },
      { month: "Jul", index: 1.08 },
      { month: "Aug", index: 1.05 },
      { month: "Sep", index: 1.0 },
      { month: "Oct", index: 0.94 },
      { month: "Nov", index: 0.9 },
      { month: "Dec", index: 0.88 },
    ],
  };
}

export function getDashboardWidgets() {
  const vehicles = getAllVehicles();
  const topOpps = getSavedOpportunities().slice(0, 5);
  const byRoi = [...vehicles].sort((a, b) => (b.marginPotential ?? 0) - (a.marginPotential ?? 0)).slice(0, 5);
  const undervalued = [...vehicles]
    .filter((v) => (v.fairMarketValue ?? v.price) > v.price)
    .sort((a, b) => (b.fairMarketValue! - b.price) - (a.fairMarketValue! - a.price))
    .slice(0, 5);
  const newest = [...vehicles].sort((a, b) => b.dateFound.localeCompare(a.dateFound)).slice(0, 5);
  const priceDrops = vehicles.filter((v) => v.priceHistory && v.priceHistory.length > 1).slice(0, 5);

  return {
    topOpportunities: topOpps,
    highestRoi: byRoi,
    undervalued,
    negotiable: topOpps.filter((v) => v.daysListed > 14).slice(0, 5),
    popularModels: getDemandIntelMetrics().topModels,
    topCities: TOP_CITIES_INTEL.slice(0, 5),
    urgent: topOpps.filter((v) => v.opportunityScore >= 88).slice(0, 4),
    priceDrops,
    newest,
    highestProfit: byRoi,
  };
}

export { VEHICLE_MAKES };
