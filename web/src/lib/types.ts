export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type Recommendation = "buy_now" | "negotiate" | "monitor" | "ignore";
export type AcquisitionRecommendation =
  | "acquire_immediately"
  | "strong_candidate"
  | "monitor"
  | "avoid";
export type SourceStatus = "healthy" | "degraded" | "offline" | "syncing" | "running" | "paused" | "idle";
export type JobStatus = "running" | "completed" | "paused" | "failed" | "scheduled" | "idle";
export type VehicleStatus = "new" | "reviewed" | "saved" | "archived";
export type OpportunityStage = "review" | "contacted" | "negotiating" | "purchased" | "rejected";
export type RiskLevel = "low" | "medium" | "high";
export type ConnectionHealth = "excellent" | "good" | "degraded" | "failed";

export interface KpiMetric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export interface VehicleListing {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  seller: string;
  sellerType: "dealer" | "private" | "auction";
  marketplace: string;
  aiScore: number;
  opportunityScore: number;
  daysListed: number;
  fuelType: string;
  bodyStyle: string;
  dateFound: string;
  status: VehicleStatus;
  fairMarketValue?: number;
  estimatedResale?: number;
  marginPotential?: number;
  recommendation?: Recommendation;
  description?: string;
  vin?: string;
  condition?: string;
  transmission?: string;
  priceHistory?: { date: string; price: number }[];
  imageUrl?: string;
  listingUrl?: string;
}

export interface AcquisitionOpportunity extends VehicleListing {
  marketPrice: number;
  estimatedValue: number;
  marginPotential: number;
  acquisitionScore: number;
  marginScore: number;
  demandScore: number;
  sellerTrustScore: number;
  pricingScore: number;
  negotiationPotential: number;
  expectedResaleDays: number;
  expectedProfit: number;
  riskLevel: RiskLevel;
  acquisitionRecommendation: AcquisitionRecommendation;
  aiExplanation: string;
  sellerQuality: number;
  recommendation: Recommendation;
  stage?: OpportunityStage;
}

export interface ScraperSource {
  id: string;
  name: string;
  status: SourceStatus;
  lastRun: string;
  vehiclesFound: number;
  successRate: number;
}

export interface ScrapingJob {
  id: string;
  name: string;
  marketplace: string;
  searchCriteria: string;
  location: string;
  frequency: string;
  status: JobStatus;
  vehiclesFound: number;
  lastRun: string;
  startedAt?: string;
  duration?: string;
  criteria?: ScraperCriteria;
}

export interface ScraperCriteria {
  marketplace: string;
  location: string;
  radius: number;
  make: string;
  model: string;
  yearMin: number;
  yearMax: number;
  priceMin: number;
  priceMax: number;
  mileageMax: number;
  keywords: string;
  sellerType: string;
  sortOrder: string;
  frequency: string;
  maxResults: number;
}

export interface DataSource {
  id: string;
  name: string;
  category: "marketplace" | "oem" | "auction" | "internal" | "crm" | "dms";
  status: SourceStatus;
  lastSync: string;
  recordsImported: number;
  syncFrequency: string;
  connectionHealth: ConnectionHealth;
  lastError?: string;
  avgDailyRecords: number;
}

export interface SyncLog {
  id: string;
  source: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  records: number;
  message: string;
}

export interface AiInsight {
  what: string;
  why: string;
  impact: string;
  action: string;
  confidence: number;
}

export interface VehiclePricingIntelligence {
  vehicleId: string;
  estimatedMarketValue: number;
  confidenceScore: number;
  suggestedPurchasePrice: number;
  suggestedSellingPrice: number;
  expectedGrossProfit: number;
  expectedRoi: number;
  expectedDaysToSell: number;
  riskLevel: RiskLevel;
  marketCompetitiveness: number;
  pricePosition: "below" | "at" | "above";
  aiExplanation: string;
  comparables: { title: string; price: number; location: string }[];
  regionalAvg: number;
}

export interface InventoryUnit {
  id: string;
  title: string;
  stockNumber: string;
  daysInInventory: number;
  cost: number;
  listPrice: number;
  margin: number;
  location: string;
  bodyStyle: string;
  status: "retail" | "wholesale" | "pending";
}

export interface Competitor {
  id: string;
  name: string;
  region: string;
  inventoryCount: number;
  inventoryChange: number;
  avgPrice: number;
  priceReductions: number;
  newListings: number;
  marketShare: number;
}

export interface SellerProfile {
  id: string;
  name: string;
  type: "dealer" | "private";
  rating: number;
  avgPrice: number;
  avgDaysListed: number;
  repeatSeller: boolean;
  responseSpeed: string;
  pricingAccuracy: number;
  riskIndicators: string[];
  listingCount: number;
}

export interface MarketplaceMetrics {
  id: string;
  name: string;
  listings: number;
  growthRate: number;
  avgPriceChange: number;
  qualityScore: number;
  duplicateRate: number;
  regionsCovered: number;
  dailyVolume: number;
  health: ConnectionHealth;
}

export interface FleetVehicle {
  id: string;
  unit: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  utilization: number;
  maintenanceCost: number;
  fuelCost: number;
  residualValue: number;
  replacementDue: string;
}

export interface DemandForecastPoint {
  period: string;
  demand: number;
  low: number;
  high: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  category: string;
  read: boolean;
  channels: ("email" | "slack" | "sms" | "in_app")[];
}

export interface SourceHealth {
  source: string;
  vehiclesFoundToday: number;
  newListings: number;
  priceChanges: number;
  avgDaysOnMarket: number;
  lastCrawl: string;
  status: SourceStatus;
}

export interface PricingVehicle {
  id: string;
  vehicle: string;
  currentPrice: number;
  recommendedPrice: number;
  competitorAvg: number;
  marketPosition: "below" | "at" | "above";
  expectedMargin: number;
  sellProbability: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  insights?: string[];
}

export interface VehicleFilters {
  search?: string;
  marketplace?: string;
  make?: string;
  status?: VehicleStatus | "all";
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "dateFound" | "price" | "opportunityScore" | "aiScore";
  sortDir?: "asc" | "desc";
}

export interface NavItem {
  title: string;
  href: string;
  icon: import("lucide-react").LucideIcon;
  badge?: string;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export type OpportunityLabel =
  | "excellent_buy"
  | "strong_opportunity"
  | "worth_reviewing"
  | "high_risk"
  | "avoid";

export interface OpportunityBreakdown {
  estimatedProfit: number;
  marketDemand: number;
  daysToSell: number;
  popularity: number;
  priceAttractiveness: number;
  repairRisk: "Low" | "Medium" | "High";
  repairRiskScore: number;
}

export interface VehicleOpportunityIntel {
  score: number;
  confidence: number;
  label: OpportunityLabel;
  breakdown: OpportunityBreakdown;
  explanationBullets: string[];
}

export interface PurchaseAlert {
  id: string;
  vehicleId: string;
  title: string;
  opportunityScore: number;
  expectedProfit: number;
  location: string;
  postedAgo: string;
  read: boolean;
}

export interface NegotiationIntel {
  firstOffer: number;
  targetPurchasePrice: number;
  acceptanceProbability: number;
  maxOffer: number;
  sellerMotivation: "Low" | "Medium" | "High";
  difficulty: "Easy" | "Moderate" | "Hard";
  reasoningBullets: string[];
  explanation: string;
}

export interface ProfitAnalysis {
  purchasePrice: number;
  transportation: number;
  reconditioning: number;
  auctionFees: number;
  holdingCost: number;
  totalAcquisitionCost: number;
  expectedSellingPrice: number;
  netProfit: number;
  roi: number;
  waterfall: { label: string; value: number; type: "cost" | "revenue" | "total" }[];
  costBreakdown: { name: string; value: number }[];
}

export interface ComparableListing {
  id: string;
  vehicle: string;
  year: number;
  mileage: number;
  price: number;
  daysListed: number;
  source: string;
  distance: string;
  status?: "Active" | "Sold" | "Pending";
}

export type BuyRecommendationStatus = "buy" | "review" | "avoid";

export interface PricingOpportunityDriver {
  icon: "trending" | "demand" | "mileage" | "resale" | "inventory" | "repair" | "seasonal" | "transport" | "age";
  title: string;
  description: string;
}

export interface PricingPriceComparison {
  askingPrice: number;
  marketValue: number;
  difference: number;
  differencePct: number;
  lowestComparable: number;
  marketAverage: number;
  highestComparable: number;
}

export interface PricingPriceHistoryPoint {
  date: string;
  label: string;
  price: number;
  event?: string;
}

export interface PricingPriceHistory {
  points: PricingPriceHistoryPoint[];
  initialPrice: number;
  currentPrice: number;
  totalReduction: number;
  reductionCount: number;
  daysSinceLastReduction: number;
}

export interface PricingMarketSnapshot {
  avgLocalPrice: number;
  avgDaysToSell: number;
  demandScore: number;
  inventoryLevel: "Low" | "Balanced" | "High";
  similarActiveListings: number;
  recentSales: number;
  demandTrend: number[];
}

export interface PricingRiskScores {
  pricing: number;
  repair: number;
  demand: number;
  holding: number;
  market: number;
  overall: "Low Risk" | "Moderate Risk" | "High Risk";
}

export interface PricingWorkspace {
  vehicleId: string;
  vehicleTitle: string;
  marketplace: string;
  location: string;
  make: string;
  model: string;
  askingPrice: number;
  marketValue: number;
  recommendedPurchase: number;
  maxPurchase: number;
  expectedResale: number;
  expectedNetProfit: number;
  projectedRoi: number;
  recommendation: {
    status: BuyRecommendationStatus;
    confidence: number;
    timestamp: string;
    bullets: string[];
  };
  priceComparison: PricingPriceComparison;
  comparables: ComparableListing[];
  negotiation: NegotiationIntel;
  profit: ProfitAnalysis;
  priceHistory: PricingPriceHistory;
  marketSnapshot: PricingMarketSnapshot;
  risk: PricingRiskScores;
  positiveDrivers: PricingOpportunityDriver[];
  negativeDrivers: PricingOpportunityDriver[];
  insights: AiInsightFeedItem[];
}

export interface PricingIntelExtended {
  currentPrice: number;
  marketValue: number;
  difference: number;
  differencePct: number;
  marketPosition: string;
  recommendedPurchase: number;
  maxPurchase: number;
  expectedSelling: number;
  expectedGrossProfit: number;
  confidence: number;
  priceDistribution: { range: string; count: number }[];
  priceTrend: { month: string; price: number; market: number }[];
  comparables: ComparableListing[];
}

export interface RegionalStateIntel {
  code: string;
  name: string;
  demandScore: number;
  avgSaleTime: number;
  avgMargin: number;
  topCategory: string;
}

export interface RegionalCityIntel {
  city: string;
  state: string;
  demandScore: number;
  inventory: number;
  avgMargin: number;
  avgSaleTime: number;
}

export interface AiInsightFeedItem {
  id: string;
  text: string;
  timestamp: string;
  confidence: number;
  category: string;
}

export interface AlertRulesConfig {
  enabled: boolean;
  minOpportunityScore: number;
  minProfit: number;
  maxPurchasePrice: number;
  maxMileage: number;
  preferredMakes: string[];
  preferredModels: string[];
  preferredCities: string[];
  marketplaces: string[];
  repairRiskThreshold: "Low" | "Medium" | "High";
  roiThreshold: number;
  demandScoreThreshold: number;
  priceDropPercent: number;
  /** @deprecated use preferredMakes */
  makes: string[];
  /** @deprecated use preferredCities */
  cities: string[];
  categories: string[];
}

export type AlertCategory =
  | "all"
  | "price_drop"
  | "new_listing"
  | "market_intel"
  | "risk"
  | "watchlist"
  | "system";

export type AlertType =
  | "high_value_opportunity"
  | "underpriced"
  | "price_drop"
  | "new_match"
  | "high_roi"
  | "negotiation"
  | "market_intel"
  | "risk"
  | "watchlist"
  | "system";

export type AlertPriority = "critical" | "high" | "medium" | "low";

export interface IntelligenceAlert {
  id: string;
  type: AlertType;
  category: Exclude<AlertCategory, "all">;
  priority: AlertPriority;
  timestamp: string;
  postedAgo: string;
  minutesAgo: number;
  read: boolean;
  saved: boolean;
  vehicleId?: string;
  title: string;
  aiSummary: string;
  location?: string;
  marketplace?: string;
  opportunityScore?: number;
  expectedProfit?: number;
  explanationBullets: string[];
  relatedAlertIds: string[];
  data: Record<string, string | number | boolean | number[] | { date: string; price: number }[] | undefined>;
}

export interface AlertsDashboardStats {
  todayTotal: number;
  highPriority: number;
  priceDrops: number;
  newListings: number;
  negotiation: number;
  highValueCount: number;
  priceDropsKpi: number;
  potentialSavings: number;
  negotiationCount: number;
  avgAcceptance: number;
  marketAlerts: number;
  newTrends: number;
  topOpportunity: { title: string; vehicleId: string; roi: number; confidence: number };
  highestRoi: { title: string; vehicleId: string; roi: number };
  mostActiveMarketplace: string;
  highestDemandCity: string;
}

export interface AlertsAiSummary {
  vehiclesAnalyzed: number;
  highValueCount: number;
  roiIncrease: number;
  marketInsight: string;
  priceDropsToday: number;
  topRecommendation: { title: string; vehicleId: string };
}

export interface DemandIntelMetrics {
  topModels: { model: string; demandIndex: number; change: number }[];
  fastestSelling: { vehicle: string; days: number }[];
  topBrands: { brand: string; share: number }[];
  topCategories: { category: string; index: number }[];
  avgDaysToSell: number;
  demandIndex: number;
  inventorySupply: number;
  buyerActivity: number;
  forecast30: { week: string; demand: number }[];
  forecast60: { week: string; demand: number }[];
  forecast90: { week: string; demand: number }[];
  seasonal: { month: string; index: number }[];
}
