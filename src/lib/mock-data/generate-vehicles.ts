import type { VehicleListing, VehicleFilters } from "@/lib/types";
import rawListings from "./listings.json";

interface RawListing {
  listingId: string;
  title: string;
  price: number;
  year: number;
  make: string;
  model: string;
  mileage: number;
  location: string;
  seller: string;
  url: string;
  image: string;
  postedTime: string;
  vin: string;
  condition: string;
  fuel: string;
  transmission: string;
  firstSeen: string;
  lastSeen: string;
  source?: string;
}

const LISTINGS = rawListings as RawListing[];

const SOURCE_ALIASES: Record<string, string> = {
  facebook: "Facebook Marketplace",
  "facebook marketplace": "Facebook Marketplace",
  craigslist: "Craigslist",
  autotrader: "OfferUp",
  cargurus: "OfferUp",
  offerup: "OfferUp",
};

const KNOWN_MAKES: Record<string, string> = {
  ford: "Ford",
  toyota: "Toyota",
  honda: "Honda",
  chevrolet: "Chevrolet",
  chevy: "Chevrolet",
  ram: "Ram",
  dodge: "Dodge",
  tesla: "Tesla",
  bmw: "BMW",
  jeep: "Jeep",
  nissan: "Nissan",
  hyundai: "Hyundai",
  gmc: "GMC",
  subaru: "Subaru",
  mazda: "Mazda",
  kia: "Kia",
  "mercedes-benz": "Mercedes-Benz",
  mercedes: "Mercedes-Benz",
  audi: "Audi",
  lexus: "Lexus",
  volkswagen: "Volkswagen",
  vw: "Volkswagen",
  volvo: "Volvo",
  cadillac: "Cadillac",
  buick: "Buick",
  chrysler: "Chrysler",
  acura: "Acura",
  infiniti: "Infiniti",
  lincoln: "Lincoln",
  mitsubishi: "Mitsubishi",
  porsche: "Porsche",
  jaguar: "Jaguar",
  "land rover": "Land Rover",
  mini: "Mini",
  fiat: "Fiat",
  genesis: "Genesis",
  polaris: "Polaris",
  yamaha: "Yamaha",
  kawasaki: "Kawasaki",
  suzuki: "Suzuki",
  harley: "Harley-Davidson",
  "harley-davidson": "Harley-Davidson",
  baja: "Baja",
  boom: "Boom",
};

function titleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ")
    .trim();
}

function looksLikeMake(value: string): boolean {
  const v = value.trim();
  if (!v || v.length > 40) return false;
  // reject emoji / punctuation-led junk from dealer spam titles
  if (!/^[A-Za-z]/.test(v)) return false;
  return true;
}

function deriveMakeModel(title: string, year: number): { make: string; model: string } {
  const tokens = title.trim().split(/\s+/).filter((t) => t && !/^[\u{1F300}-\u{1FAFF}]+$/u.test(t));
  let idx = 0;
  if (tokens[0] && /^(19|20)\d{2}$/.test(tokens[0])) idx = 1;
  else if (year > 0 && tokens[0] === String(year)) idx = 1;

  const makeRaw = tokens[idx] ?? "";
  const twoWord = `${tokens[idx] ?? ""} ${tokens[idx + 1] ?? ""}`.toLowerCase().trim();
  if (KNOWN_MAKES[twoWord]) {
    return {
      make: KNOWN_MAKES[twoWord],
      model: titleCase(tokens.slice(idx + 2).join(" ")) || "—",
    };
  }

  const make = KNOWN_MAKES[makeRaw.toLowerCase()] ?? (looksLikeMake(makeRaw) ? titleCase(makeRaw) : "Other");
  const model = titleCase(tokens.slice(idx + 1).join(" ")) || "—";
  return { make: make || "Other", model };
}

function resolveMakeModel(raw: RawListing, year: number): { make: string; model: string } {
  const derived = deriveMakeModel(raw.title, year);
  const csvMake = (raw.make || "").trim();
  const csvModel = (raw.model || "").trim();

  if (looksLikeMake(csvMake)) {
    const normalized = KNOWN_MAKES[csvMake.toLowerCase()] ?? titleCase(csvMake);
    return {
      make: normalized,
      model: looksLikeMake(csvModel) ? titleCase(csvModel) : derived.model,
    };
  }
  return derived;
}

function classifyBodyStyle(title: string): string {
  const t = title.toLowerCase();
  const has = (words: string[]) => words.some((w) => t.includes(w));

  if (has(["bowrider", "pontoon", "sailboat", "yacht", "boat", "jet ski", "waverunner", "bass boat"])) return "Boat";
  if (has(["atv", "utv", "side by side", "ranger crew", "4 wheeler", "four wheeler", "polaris", "rzr"])) return "ATV";
  if (has(["motorcycle", "harley", "scooter", "moped", "cbr", "efi", "dirt bike"])) return "Motorcycle";
  if (has(["camper", "rv", "travel trailer", "motorhome", "fifth wheel"])) return "RV";
  if (has(["truck", "pickup", "1500", "2500", "3500", "f-150", "f150", "f-250", "silverado", "sierra", "tacoma", "tundra", "ram ", "frontier", "colorado", "gladiator", "maverick", "ranger"])) return "Truck";
  if (has(["van", "promaster", "odyssey", "sienna", "caravan", "transit", "express"])) return "Van";
  if (has(["suv", "explorer", "tahoe", "suburban", "expedition", "4runner", "rav4", "cr-v", "crv", "santa fe", "pilot", "highlander", "escape", "equinox", "rogue", "wrangler", "cherokee", "telluride", "palisade", "bronco", "traverse", "pathfinder", "forester", "outback", "tucson", "sorento", "sportage", "cx-5", "cx-9", "durango", "yukon"])) return "SUV";
  if (has(["coupe", "mustang", "camaro", "corvette", "challenger", "miata", "convertible"])) return "Coupe";
  if (has(["sedan", "camry", "corolla", "accord", "civic", "altima", "sonata", "elantra", "malibu", "charger", "jetta"])) return "Sedan";
  return "Sedan";
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function normalizeMarketplace(source?: string): string {
  const key = (source || "").trim().toLowerCase();
  return SOURCE_ALIASES[key] ?? source?.trim() ?? "Facebook Marketplace";
}

const STATUSES = ["new", "reviewed", "saved", "archived"] as const;

function toDate(iso: string): string {
  if (!iso) return new Date().toISOString().split("T")[0];
  // Handle ISO and craigslist-style offsets
  const parsed = new Date(iso);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
  const d = iso.split("T")[0];
  return d || new Date().toISOString().split("T")[0];
}

function dateMinus(dateStr: string, days: number): string {
  const base = new Date(dateStr);
  if (isNaN(base.getTime())) return dateStr;
  return new Date(base.getTime() - days * 86400000).toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  if (!a || !b) return 0;
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  if (isNaN(da) || isNaN(db)) return 0;
  return Math.max(0, Math.round((db - da) / 86400000));
}

function normalizeFuel(fuel: string, bodyStyle: string): string {
  const f = fuel.trim().toLowerCase();
  if (!f) {
    return bodyStyle === "Electric" ? "Electric" : "—";
  }
  if (f === "gas" || f === "gasoline" || f === "petrol") return "Gasoline";
  if (f === "diesel") return "Diesel";
  if (f === "electric" || f === "ev") return "Electric";
  if (f.includes("hybrid")) return "Hybrid";
  if (f.includes("plugin") || f.includes("plug-in")) return "Plug-in Hybrid";
  return titleCase(fuel);
}

function normalizeTransmission(value: string): string | undefined {
  const t = value.trim();
  if (!t) return undefined;
  const lower = t.toLowerCase();
  if (lower.startsWith("auto")) return "Automatic";
  if (lower.startsWith("man")) return "Manual";
  if (lower.includes("cvt")) return "CVT";
  return titleCase(t);
}

function normalizeCondition(value: string): string | undefined {
  const c = value.trim();
  if (!c) return undefined;
  if (c.toUpperCase() === "CPO") return "CPO";
  return titleCase(c);
}

function inferSellerType(
  seller: string,
  marketplace: string
): "dealer" | "private" | "auction" {
  if (/auction/i.test(seller)) return "auction";
  if (
    marketplace === "OfferUp" ||
    /dealer|motors|auto\b|sales|group|of dallas|of houston|of austin/i.test(seller)
  ) {
    return "dealer";
  }
  return "private";
}

function buildPriceHistory(
  price: number,
  dateFound: string,
  daysListed: number,
  seed: number
): { date: string; price: number }[] | undefined {
  if (price <= 0) return undefined;

  // Most listings never change price — just the current ask.
  const roll = seededRandom(seed * 41);
  if (roll < 0.78 || daysListed < 3) {
    return [{ date: dateFound, price }];
  }

  // Occasional single drop (~17%)
  if (roll < 0.95) {
    const dropPct = 0.03 + seededRandom(seed * 43) * 0.07; // 3–10%
    const listedAt = Math.round(price / (1 - dropPct));
    const dropDay = Math.min(
      daysListed,
      Math.max(2, Math.round(2 + seededRandom(seed * 47) * Math.min(14, daysListed)))
    );
    return [
      { date: dateMinus(dateFound, dropDay), price: listedAt },
      { date: dateFound, price },
    ];
  }

  // Rare two-step drop (~5%)
  const firstDrop = 0.04 + seededRandom(seed * 53) * 0.05;
  const secondDrop = 0.02 + seededRandom(seed * 59) * 0.05;
  const mid = Math.round(price / (1 - secondDrop));
  const listedAt = Math.round(mid / (1 - firstDrop));
  const span = Math.max(7, Math.min(daysListed || 21, 28));
  const firstDay = Math.round(span * (0.55 + seededRandom(seed * 61) * 0.25));
  const secondDay = Math.round(span * (0.15 + seededRandom(seed * 67) * 0.2));

  return [
    { date: dateMinus(dateFound, firstDay), price: listedAt },
    { date: dateMinus(dateFound, secondDay), price: mid },
    { date: dateFound, price },
  ];
}

function mapListing(raw: RawListing): VehicleListing {
  const seed = hashStr(raw.listingId || raw.title) + 1;
  const year = raw.year > 1900 ? raw.year : 0;
  const { make, model } = resolveMakeModel(raw, year);
  const bodyStyle = classifyBodyStyle(`${raw.title} ${make} ${model}`);
  const marketplace = normalizeMarketplace(raw.source);

  // Prefer real CSV mileage; leave 0 when unknown (UI shows "—")
  const mileage = raw.mileage > 0 ? raw.mileage : 0;
  const price = raw.price > 0 ? raw.price : 0;
  const aiScore = 55 + Math.floor(seededRandom(seed * 10) * 45);
  const opportunityScore = 50 + Math.floor(seededRandom(seed * 11) * 50);
  const fairMarketValue =
    price > 0
      ? Math.round(price * (1 + (seededRandom(seed * 12) - 0.4) * 0.25))
      : undefined;

  const dateFound = toDate(raw.postedTime || raw.firstSeen);
  const observedDays = daysBetween(raw.firstSeen, raw.lastSeen);
  const daysListed =
    observedDays > 0
      ? observedDays
      : Math.max(0, Math.floor((Date.now() - new Date(dateFound).getTime()) / 86400000) || 0);

  const seller =
    raw.seller ||
    (marketplace === "Craigslist"
      ? "Private seller"
      : marketplace === "OfferUp"
        ? "Private Seller"
        : "Private Seller");
  const condition = normalizeCondition(raw.condition);
  const transmission = normalizeTransmission(raw.transmission);

  return {
    id: raw.listingId,
    title: raw.title,
    make,
    model,
    year,
    price,
    mileage,
    location: raw.location || "—",
    seller,
    sellerType: inferSellerType(seller, marketplace),
    marketplace,
    aiScore,
    opportunityScore,
    daysListed,
    fuelType: normalizeFuel(raw.fuel, bodyStyle),
    bodyStyle,
    dateFound,
    status: pick([...STATUSES], seed * 16),
    fairMarketValue,
    estimatedResale: fairMarketValue
      ? fairMarketValue + Math.floor(seededRandom(seed * 17) * 4000)
      : undefined,
    marginPotential: fairMarketValue ? Math.max(0, fairMarketValue - price) : undefined,
    recommendation:
      opportunityScore >= 85
        ? "buy_now"
        : opportunityScore >= 75
          ? "negotiate"
          : opportunityScore >= 60
            ? "monitor"
            : "ignore",
    description: [
      condition ? `${condition} condition` : null,
      transmission,
      raw.title,
      raw.location ? `listed in ${raw.location}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    vin: raw.vin || undefined,
    condition,
    transmission,
    imageUrl: raw.image || undefined,
    listingUrl: raw.url || undefined,
    priceHistory: buildPriceHistory(price, dateFound, daysListed, seed),
  };
}

let _cache: VehicleListing[] | null = null;

export function getAllVehicles(): VehicleListing[] {
  if (!_cache) {
    _cache = LISTINGS.map(mapListing);
  }
  return _cache;
}

export const TOTAL_VEHICLES = LISTINGS.length;

export const VEHICLE_MAKES = Array.from(
  new Set(getAllVehicles().map((v) => v.make).filter((m) => m && m !== "Other"))
).sort();

export const VEHICLE_MARKETPLACES = Array.from(
  new Set(getAllVehicles().map((v) => v.marketplace).filter(Boolean))
).sort();

const BODY_ORDER = ["Sedan", "Coupe", "SUV", "Truck", "Van", "Motorcycle", "ATV", "RV", "Boat"];
const FUEL_ORDER = ["Gasoline", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"];

function orderedUnique(values: string[], preferred: string[]) {
  const present = new Set(values.filter((value) => value && value !== "—"));
  const ranked = preferred.filter((value) => present.has(value));
  const rest = [...present].filter((value) => !preferred.includes(value)).sort();
  return [...ranked, ...rest];
}

export const VEHICLE_BODY_STYLES = orderedUnique(
  getAllVehicles().map((v) => v.bodyStyle),
  BODY_ORDER
);

export const VEHICLE_FUELS = orderedUnique(
  getAllVehicles().map((v) => v.fuelType),
  FUEL_ORDER
);

const listingYears = getAllVehicles()
  .map((v) => v.year)
  .filter((year) => year >= 1980);

export const VEHICLE_YEAR_MIN = listingYears.length ? Math.min(...listingYears) : 1980;
export const VEHICLE_YEAR_MAX = listingYears.length ? Math.max(...listingYears) : new Date().getFullYear();

const LOCATIONS = Array.from(new Set(getAllVehicles().map((v) => v.location).filter((l) => l && l !== "—")));

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

export function dedupeVehicles(vehicles: VehicleListing[]): VehicleListing[] {
  const seenIds = new Set<string>();
  return vehicles.filter((v) => {
    if (seenIds.has(v.id)) return false;
    seenIds.add(v.id);
    return true;
  });
}

export function getVehicleById(id: string): VehicleListing | undefined {
  return getAllVehicles().find((v) => v.id === id);
}

function sortValue(
  vehicle: VehicleListing,
  sortBy: NonNullable<VehicleFilters["sortBy"]>,
  sortDir: "asc" | "desc"
): string | number {
  const missing = sortDir === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  if (sortBy === "price") return vehicle.price > 0 ? vehicle.price : missing;
  if (sortBy === "mileage") return vehicle.mileage > 0 ? vehicle.mileage : missing;
  if (sortBy === "year") return vehicle.year >= 1980 ? vehicle.year : missing;
  return vehicle[sortBy] as string | number;
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
  if (filters.bodyStyle && filters.bodyStyle !== "all") {
    items = items.filter((v) => v.bodyStyle === filters.bodyStyle);
  }
  if (filters.fuelType && filters.fuelType !== "all") {
    items = items.filter((v) => v.fuelType === filters.fuelType);
  }
  if (filters.sellerType && filters.sellerType !== "all") {
    items = items.filter((v) => v.sellerType === filters.sellerType);
  }
  if (filters.status && filters.status !== "all") {
    items = items.filter((v) => v.status === filters.status);
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    items = items.filter((v) => {
      if (v.price <= 0) return false;
      if (filters.minPrice != null && v.price < filters.minPrice) return false;
      if (filters.maxPrice != null && v.price > filters.maxPrice) return false;
      return true;
    });
  }
  if (filters.minYear != null || filters.maxYear != null) {
    const minYear = filters.minYear;
    const maxYear = filters.maxYear;
    const low = minYear != null && maxYear != null ? Math.min(minYear, maxYear) : minYear;
    const high = minYear != null && maxYear != null ? Math.max(minYear, maxYear) : maxYear;
    items = items.filter((v) => {
      if (!v.year || v.year < 1980) return false;
      if (low != null && v.year < low) return false;
      if (high != null && v.year > high) return false;
      return true;
    });
  }
  if (filters.minMileage != null || filters.maxMileage != null) {
    items = items.filter((v) => {
      if (v.mileage <= 0) return false;
      if (filters.minMileage != null && v.mileage < filters.minMileage) return false;
      if (filters.maxMileage != null && v.mileage > filters.maxMileage) return false;
      return true;
    });
  }

  const sortBy = filters.sortBy ?? "dateFound";
  const sortDir = filters.sortDir ?? "desc";
  items = [...items].sort((a, b) => {
    const av = sortValue(a, sortBy, sortDir);
    const bv = sortValue(b, sortBy, sortDir);
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
    [...getAllVehicles()].sort((a, b) => b.dateFound.localeCompare(a.dateFound))
  ).slice(0, count);
}

export function getSavedOpportunities(): VehicleListing[] {
  return dedupeVehicles(
    getAllVehicles().filter((v) => v.status === "saved" || v.opportunityScore >= 82)
  ).slice(0, 24);
}

export function countByMarketplace(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of getAllVehicles()) {
    counts[v.marketplace] = (counts[v.marketplace] ?? 0) + 1;
  }
  return counts;
}
