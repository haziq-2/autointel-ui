import type { VehicleListing, VehicleFilters } from "@/lib/types";

const MAKES_MODELS: Record<string, string[]> = {
  Ford: ["F-150", "Explorer", "Mustang", "Escape", "Bronco"],
  Toyota: ["Camry", "RAV4", "Tacoma", "Corolla", "Highlander"],
  Honda: ["CR-V", "Accord", "Civic", "Pilot", "HR-V"],
  Chevrolet: ["Silverado", "Equinox", "Tahoe", "Malibu", "Traverse"],
  Ram: ["1500", "2500", "ProMaster"],
  Tesla: ["Model 3", "Model Y", "Model S"],
  BMW: ["X5", "3 Series", "5 Series"],
  Jeep: ["Wrangler", "Grand Cherokee", "Compass"],
  Nissan: ["Altima", "Rogue", "Frontier"],
  Hyundai: ["Tucson", "Santa Fe", "Elantra"],
};

const MARKETPLACES = [
  "Facebook Marketplace",
  "Craigslist",
  "AutoTrader",
  "Cars.com",
  "CarGurus",
  "Dealer Websites",
];

const LOCATIONS = [
  "Dallas, TX",
  "Houston, TX",
  "Austin, TX",
  "San Antonio, TX",
  "Fort Worth, TX",
  "Phoenix, AZ",
  "Atlanta, GA",
  "Denver, CO",
  "Charlotte, NC",
  "Nashville, TN",
  "Tampa, FL",
  "Orlando, FL",
];

const IMAGES = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c50d88?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
];

const BODY_STYLES = ["Sedan", "SUV", "Truck", "Coupe", "Van"];
const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid"];
const STATUSES = ["new", "reviewed", "saved", "archived"] as const;
const SELLER_TYPES = ["dealer", "private"] as const;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

export const TOTAL_VEHICLES = 5247;

export function generateVehicle(index: number): VehicleListing {
  const seed = index + 1;
  const makes = Object.keys(MAKES_MODELS);
  const make = pick(makes, seed);
  const model = pick(MAKES_MODELS[make], seed * 2);
  const year = 2016 + Math.floor(seededRandom(seed * 3) * 9);
  const mileage = 8000 + Math.floor(seededRandom(seed * 4) * 120000);
  const basePrice = 12000 + Math.floor(seededRandom(seed * 5) * 48000);
  const location = pick(LOCATIONS, seed * 6);
  const marketplace = pick(MARKETPLACES, seed * 7);
  const sellerType = pick(SELLER_TYPES, seed * 8);
  const daysAgo = Math.floor(seededRandom(seed * 9) * 30);
  const dateFound = new Date(Date.now() - daysAgo * 86400000).toISOString().split("T")[0];
  const aiScore = 55 + Math.floor(seededRandom(seed * 10) * 45);
  const opportunityScore = 50 + Math.floor(seededRandom(seed * 11) * 50);
  const fairMarketValue = basePrice + Math.floor((seededRandom(seed * 12) - 0.4) * 6000);

  const sellers =
    sellerType === "dealer"
      ? ["Premier Auto", "Texas Motors", "Southwest Auto Group", "Metro Cars", "Valley Dealership"]
      : ["Private Seller"];

  return {
    id: `v-${index + 1}`,
    image: IMAGES[index % IMAGES.length],
    title: `${year} ${make} ${model}`,
    make,
    model,
    year,
    price: basePrice,
    mileage,
    location,
    seller: pick(sellers, seed * 13),
    sellerType,
    marketplace,
    aiScore,
    opportunityScore,
    daysListed: daysAgo,
    fuelType: pick(FUEL_TYPES, seed * 14),
    bodyStyle: pick(BODY_STYLES, seed * 15),
    dateFound,
    status: pick([...STATUSES], seed * 16),
    fairMarketValue,
    estimatedResale: fairMarketValue + Math.floor(seededRandom(seed * 17) * 4000),
    marginPotential: Math.max(0, fairMarketValue - basePrice),
    recommendation:
      opportunityScore >= 85
        ? "buy_now"
        : opportunityScore >= 75
          ? "negotiate"
          : opportunityScore >= 60
            ? "monitor"
            : "ignore",
    description: `Well-maintained ${year} ${make} ${model} located in ${location}.`,
    vin: `1${make.slice(0, 2).toUpperCase()}${String(seed).padStart(14, "0")}`.slice(0, 17),
    priceHistory: [
      { date: dateFound, price: basePrice + 800 },
      { date: new Date(Date.now() - Math.max(1, daysAgo - 3) * 86400000).toISOString().split("T")[0], price: basePrice + 400 },
      { date: dateFound, price: basePrice },
    ],
  };
}

let _cache: VehicleListing[] | null = null;

export function getAllVehicles(): VehicleListing[] {
  if (!_cache) {
    _cache = Array.from({ length: TOTAL_VEHICLES }, (_, i) => generateVehicle(i));
  }
  return _cache;
}

export function getVehicleById(id: string): VehicleListing | undefined {
  const num = parseInt(id.replace("v-", ""), 10);
  if (isNaN(num) || num < 1 || num > TOTAL_VEHICLES) return undefined;
  return generateVehicle(num - 1);
}

export function queryVehicles(
  filters: VehicleFilters,
  page: number,
  pageSize: number
): { vehicles: VehicleListing[]; total: number } {
  let items = getAllVehicles();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.seller.toLowerCase().includes(q)
    );
  }
  if (filters.marketplace && filters.marketplace !== "all") {
    items = items.filter((v) => v.marketplace === filters.marketplace);
  }
  if (filters.make && filters.make !== "all") {
    items = items.filter((v) => v.make === filters.make);
  }
  if (filters.status && filters.status !== "all") {
    items = items.filter((v) => v.status === filters.status);
  }
  if (filters.minPrice) items = items.filter((v) => v.price >= filters.minPrice!);
  if (filters.maxPrice) items = items.filter((v) => v.price <= filters.maxPrice!);

  const sortBy = filters.sortBy ?? "dateFound";
  const sortDir = filters.sortDir ?? "desc";
  items = [...items].sort((a, b) => {
    const av = a[sortBy] as string | number;
    const bv = b[sortBy] as string | number;
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const total = items.length;
  const start = (page - 1) * pageSize;
  return { vehicles: items.slice(start, start + pageSize), total };
}

export function getRecentVehicles(count: number): VehicleListing[] {
  return getAllVehicles()
    .sort((a, b) => b.dateFound.localeCompare(a.dateFound))
    .slice(0, count);
}

export function getSavedOpportunities(): VehicleListing[] {
  return getAllVehicles()
    .filter((v) => v.status === "saved" || v.opportunityScore >= 82)
    .slice(0, 24);
}
