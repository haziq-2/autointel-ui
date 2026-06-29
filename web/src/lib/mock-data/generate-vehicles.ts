import type { VehicleListing, VehicleFilters } from "@/lib/types";

const MODEL_BODY_STYLE: Record<string, Record<string, string>> = {
  Ford: { "F-150": "Truck", Explorer: "SUV", Mustang: "Coupe", Escape: "SUV", Bronco: "SUV", Maverick: "Truck" },
  Toyota: { Camry: "Sedan", RAV4: "SUV", Tacoma: "Truck", Corolla: "Sedan", Highlander: "SUV", "4Runner": "SUV", Tundra: "Truck" },
  Honda: { "CR-V": "SUV", Accord: "Sedan", Civic: "Sedan", Pilot: "SUV", "HR-V": "SUV", Odyssey: "Van" },
  Chevrolet: { Silverado: "Truck", Equinox: "SUV", Tahoe: "SUV", Malibu: "Sedan", Traverse: "SUV", Colorado: "Truck", Camaro: "Coupe" },
  Ram: { "1500": "Truck", "2500": "Truck", ProMaster: "Van" },
  Tesla: { "Model 3": "Electric", "Model Y": "Electric", "Model S": "Electric", "Model X": "Electric" },
  BMW: { X5: "SUV", "3 Series": "Sedan", "5 Series": "Sedan", X3: "SUV" },
  Jeep: { Wrangler: "SUV", "Grand Cherokee": "SUV", Compass: "SUV", Gladiator: "Truck" },
  Nissan: { Altima: "Sedan", Rogue: "SUV", Frontier: "Truck", Pathfinder: "SUV", Sentra: "Sedan" },
  Hyundai: { Tucson: "SUV", "Santa Fe": "SUV", Elantra: "Sedan", Palisade: "SUV", Sonata: "Sedan" },
  GMC: { Sierra: "Truck", Yukon: "SUV", Terrain: "SUV", Canyon: "Truck" },
  Subaru: { Outback: "SUV", Forester: "SUV", Crosstrek: "SUV", WRX: "Sedan" },
  Mazda: { "CX-5": "SUV", "Mazda3": "Sedan", "CX-9": "SUV", "MX-5 Miata": "Coupe" },
  Kia: { Telluride: "SUV", Sorento: "SUV", Forte: "Sedan", Sportage: "SUV" },
  "Mercedes-Benz": { "C-Class": "Sedan", GLC: "SUV", "E-Class": "Sedan", GLE: "SUV" },
  Audi: { A4: "Sedan", Q5: "SUV", Q7: "SUV", A6: "Sedan" },
  Lexus: { RX: "SUV", ES: "Sedan", NX: "SUV", IS: "Sedan" },
  Volkswagen: { Jetta: "Sedan", Tiguan: "SUV", Atlas: "SUV", Golf: "Sedan" },
  Dodge: { Charger: "Sedan", Durango: "SUV", Hornet: "SUV" },
  Volvo: { XC90: "SUV", XC60: "SUV", S60: "Sedan" },
};

function getBodyStyleForModel(make: string, model: string): string {
  return MODEL_BODY_STYLE[make]?.[model] ?? "Sedan";
}

const MAKES_MODELS: Record<string, string[]> = {
  Ford: ["F-150", "Explorer", "Mustang", "Escape", "Bronco", "Maverick"],
  Toyota: ["Camry", "RAV4", "Tacoma", "Corolla", "Highlander", "4Runner", "Tundra"],
  Honda: ["CR-V", "Accord", "Civic", "Pilot", "HR-V", "Odyssey"],
  Chevrolet: ["Silverado", "Equinox", "Tahoe", "Malibu", "Traverse", "Colorado", "Camaro"],
  Ram: ["1500", "2500", "ProMaster"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  BMW: ["X5", "3 Series", "5 Series", "X3"],
  Jeep: ["Wrangler", "Grand Cherokee", "Compass", "Gladiator"],
  Nissan: ["Altima", "Rogue", "Frontier", "Pathfinder", "Sentra"],
  Hyundai: ["Tucson", "Santa Fe", "Elantra", "Palisade", "Sonata"],
  GMC: ["Sierra", "Yukon", "Terrain", "Canyon"],
  Subaru: ["Outback", "Forester", "Crosstrek", "WRX"],
  Mazda: ["CX-5", "Mazda3", "CX-9", "MX-5 Miata"],
  Kia: ["Telluride", "Sorento", "Forte", "Sportage"],
  "Mercedes-Benz": ["C-Class", "GLC", "E-Class", "GLE"],
  Audi: ["A4", "Q5", "Q7", "A6"],
  Lexus: ["RX", "ES", "NX", "IS"],
  Volkswagen: ["Jetta", "Tiguan", "Atlas", "Golf"],
  Dodge: ["Charger", "Durango", "Hornet"],
  Volvo: ["XC90", "XC60", "S60"],
};

export const VEHICLE_MAKES = Object.keys(MAKES_MODELS).sort();

const MARKETPLACES = [
  "Facebook Marketplace",
  "Craigslist",
  "AutoTrader",
];

const LOCATIONS = [
  "Dallas, TX",
  "Houston, TX",
  "Austin, TX",
  "San Antonio, TX",
  "Fort Worth, TX",
  "El Paso, TX",
  "Phoenix, AZ",
  "Tucson, AZ",
  "Atlanta, GA",
  "Denver, CO",
  "Charlotte, NC",
  "Nashville, TN",
  "Tampa, FL",
  "Orlando, FL",
  "Miami, FL",
  "Oklahoma City, OK",
  "Kansas City, MO",
  "Las Vegas, NV",
];

export const SCRAPE_CITIES = LOCATIONS;

export function matchesCity(vehicleLocation: string, cityQuery: string): boolean {
  const q = cityQuery.trim().toLowerCase();
  if (!q) return false;
  const loc = vehicleLocation.toLowerCase();
  const cityName = q.split(",")[0].trim();
  return loc.includes(cityName) || loc.includes(q);
}

export function getVehiclesByCity(city: string, limit = 80): VehicleListing[] {
  return dedupeVehicles(getAllVehicles().filter((v) => matchesCity(v.location, city))).slice(0, limit);
}

export function countVehiclesByCity(city: string): number {
  return getAllVehicles().filter((v) => matchesCity(v.location, city)).length;
}

const MODEL_VARIANTS = Object.entries(MAKES_MODELS).flatMap(([make, models]) =>
  models.map((model) => ({ make, model }))
);

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

const EXTERIOR_COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Beige",
  "Orange",
  "Pearl White",
  "Midnight Blue",
  "Burgundy",
  "Champagne",
];

const TRIMS = [
  "Base",
  "S",
  "SE",
  "LE",
  "EX",
  "XLE",
  "LT",
  "LTZ",
  "XLT",
  "Lariat",
  "Sport",
  "Limited",
  "Premium",
  "Touring",
  "Platinum",
  "Denali",
  "SR5",
  "TRD Off-Road",
  "R/T",
  "GT",
];

const BODY_STYLE_PRICE: Record<string, [number, number]> = {
  Truck: [22000, 72000],
  SUV: [16000, 62000],
  Sedan: [9000, 42000],
  Coupe: [18000, 58000],
  Electric: [26000, 88000],
  Van: [14000, 48000],
};

const DEALER_NAMES = [
  "Premier Auto",
  "Texas Motors",
  "Southwest Auto Group",
  "Metro Cars",
  "Valley Dealership",
  "Lone Star Motors",
  "Gulf Coast Auto",
  "Hill Country Cars",
  "Desert Auto Sales",
  "Capital City Cars",
];

const PRIVATE_SELLERS = [
  "Private Seller",
  "Local Owner",
  "Mike T.",
  "Sarah K.",
  "James R.",
  "Family Sale",
  "Estate Sale",
];

function vehicleCombo(index: number) {
  const seed = index + 1;
  const modelIdx = Math.floor(seededRandom(seed * 2) * MODEL_VARIANTS.length);
  const year = 2012 + Math.floor(seededRandom(seed * 5) * 14);
  const locIdx = Math.floor(seededRandom(seed * 7) * LOCATIONS.length);
  const marketIdx = Math.floor(seededRandom(seed * 11) * MARKETPLACES.length);

  return {
    ...MODEL_VARIANTS[modelIdx],
    year,
    location: LOCATIONS[locIdx],
    marketplace: MARKETPLACES[marketIdx],
  };
}

function priceForVehicle(seed: number, bodyStyle: string, year: number): number {
  const [min, max] = BODY_STYLE_PRICE[bodyStyle] ?? BODY_STYLE_PRICE.Sedan;
  const age = Math.max(0, 2026 - year);
  const depreciation = Math.min(0.45, age * 0.04);
  const range = max - min;
  const base = min + Math.floor(seededRandom(seed * 5) * range);
  return Math.round(base * (1 - depreciation));
}

function mileageForVehicle(seed: number, year: number): number {
  const age = Math.max(1, 2026 - year);
  const annual = 7500 + Math.floor(seededRandom(seed * 4) * 9000);
  const base = age * annual;
  const noise = Math.floor((seededRandom(seed * 6) - 0.5) * 12000);
  return Math.max(1200, base + noise);
}

export function dedupeVehicles(vehicles: VehicleListing[]): VehicleListing[] {
  const seenIds = new Set<string>();
  return vehicles.filter((v) => {
    if (seenIds.has(v.id)) return false;
    seenIds.add(v.id);
    return true;
  });
}

const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid"];
const STATUSES = ["new", "reviewed", "saved", "archived"] as const;
const SELLER_TYPES = ["dealer", "private"] as const;

export const TOTAL_VEHICLES = 5143;

export function generateVehicle(index: number): VehicleListing {
  const seed = index + 1;
  const { make, model, year, location, marketplace } = vehicleCombo(index);
  const bodyStyle = getBodyStyleForModel(make, model);
  const trim = pick(TRIMS, seed * 3);
  const color = pick(EXTERIOR_COLORS, seed * 18);
  const mileage = mileageForVehicle(seed, year);
  const basePrice = priceForVehicle(seed, bodyStyle, year);
  const sellerType = pick(SELLER_TYPES, seed * 8);
  const daysAgo = Math.floor(seededRandom(seed * 9) * 30);
  const dateFound = new Date(Date.now() - daysAgo * 86400000).toISOString().split("T")[0];
  const aiScore = 55 + Math.floor(seededRandom(seed * 10) * 45);
  const opportunityScore = 50 + Math.floor(seededRandom(seed * 11) * 50);
  const fairMarketValue = basePrice + Math.floor((seededRandom(seed * 12) - 0.4) * 6000);

  const sellers = sellerType === "dealer" ? DEALER_NAMES : PRIVATE_SELLERS;
  const drivetrain = pick(["FWD", "RWD", "AWD", "4WD"], seed * 19);
  const condition = pick(["Excellent", "Very Good", "Good", "Fair"], seed * 20);

  return {
    id: `v-${index + 1}`,
    title: `${year} ${make} ${model} ${trim} · ${color}`,
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
    fuelType: bodyStyle === "Electric" ? "Electric" : pick(FUEL_TYPES.filter((f) => f !== "Electric"), seed * 14),
    bodyStyle,
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
    description: `${condition} ${year} ${make} ${model} ${trim} with ${drivetrain}. ${mileage.toLocaleString()} miles, listed in ${location}.`,
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
  let items = dedupeVehicles(getAllVehicles());

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
  return dedupeVehicles(
    getAllVehicles().sort((a, b) => b.dateFound.localeCompare(a.dateFound))
  ).slice(0, count);
}

export function getSavedOpportunities(): VehicleListing[] {
  return dedupeVehicles(
    getAllVehicles().filter((v) => v.status === "saved" || v.opportunityScore >= 82)
  ).slice(0, 24);
}
