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
  priceHistory?: { date: string; price: number }[];
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
