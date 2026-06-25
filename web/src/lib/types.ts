export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type Recommendation = "buy_now" | "negotiate" | "monitor" | "ignore";
export type SourceStatus = "healthy" | "degraded" | "offline" | "syncing" | "running" | "paused" | "idle";
export type JobStatus = "running" | "completed" | "paused" | "failed" | "scheduled" | "idle";
export type VehicleStatus = "new" | "reviewed" | "saved" | "archived";
export type OpportunityStage = "review" | "contacted" | "negotiating" | "purchased" | "rejected";

export interface KpiMetric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export interface VehicleListing {
  id: string;
  image: string;
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

export interface SourceHealth {
  source: string;
  vehiclesFoundToday: number;
  newListings: number;
  priceChanges: number;
  avgDaysOnMarket: number;
  lastCrawl: string;
  status: SourceStatus;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  category: string;
  read: boolean;
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
