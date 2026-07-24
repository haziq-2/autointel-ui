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
  autotrader: "CarGurus",
  cargurus: "CarGurus",
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

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid"];
const STATUSES = ["new", "reviewed", "saved", "archived"] as const;

function toDate(iso: string): string {
  if (!iso) return new Date().toISOString().split("T")[0];
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

function mapListing(raw: RawListing): VehicleListing {
  const seed = hashStr(raw.listingId || raw.title) + 1;
  const year = raw.year > 1900 ? raw.year : 2012 + Math.floor(seededRandom(seed * 5) * 13);
  const { make, model } = resolveMakeModel(raw, year);
  const bodyStyle = classifyBodyStyle(raw.title);
  const marketplace = normalizeMarketplace(raw.source);

  const age = Math.max(1, 2026 - year);
  const mileage =
    raw.mileage > 0
      ? raw.mileage
      : Math.max(1200, age * (7500 + Math.floor(seededRandom(seed * 4) * 9000)));

  const price = raw.price > 0 ? raw.price : 1000 + Math.floor(seededRandom(seed * 3) * 20000);
  const aiScore = 55 + Math.floor(seededRandom(seed * 10) * 45);
  const opportunityScore = 50 + Math.floor(seededRandom(seed * 11) * 50);
  const fairMarketValue = Math.round(price * (1 + (seededRandom(seed * 12) - 0.4) * 0.25));

  const dateFound = toDate(raw.firstSeen || raw.postedTime);
  const daysListed = Math.max(
    daysBetween(raw.firstSeen, raw.lastSeen),
    Math.floor(seededRandom(seed * 9) * 30)
  );

  const seller = raw.seller || (marketplace === "Craigslist" ? "Craigslist Seller" : "Private Seller");

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
    sellerType: marketplace === "Craigslist" && /dealer|autonat|sales/i.test(seller) ? "dealer" : "private",
    marketplace,
    aiScore,
    opportunityScore,
    daysListed,
    fuelType: raw.fuel ? titleCase(raw.fuel) : bodyStyle === "Electric" ? "Electric" : pick(FUEL_TYPES, seed * 14),
    bodyStyle,
    dateFound,
    status: pick([...STATUSES], seed * 16),
    fairMarketValue,
    estimatedResale: fairMarketValue + Math.floor(seededRandom(seed * 17) * 4000),
    marginPotential: Math.max(0, fairMarketValue - price),
    recommendation:
      opportunityScore >= 85
        ? "buy_now"
        : opportunityScore >= 75
          ? "negotiate"
          : opportunityScore >= 60
            ? "monitor"
            : "ignore",
    description: raw.condition
      ? `${titleCase(raw.condition)} ${raw.title}, listed in ${raw.location}.`
      : `${raw.title} · listed in ${raw.location || "—"}.`,
    vin: raw.vin || undefined,
    imageUrl: raw.image || undefined,
    listingUrl: raw.url || undefined,
    priceHistory: [
      { date: dateMinus(dateFound, 14), price: Math.round(price * 1.08) },
      { date: dateMinus(dateFound, 7), price: Math.round(price * 1.03) },
      { date: dateFound, price },
    ],
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
