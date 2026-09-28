import type { VehicleListing } from "@/lib/types";
import { getAllVehicles } from "@/lib/mock-data/generate-vehicles";
import { cityLabel, resolveState, STATE_NAMES } from "./resolve-state";

export type StateCount = { code: string; name: string; count: number };
export type CityCount = { name: string; state: string; count: number };

export type MarketSummary = {
  total: number;
  craigslist: number;
  facebook: number;
  offerup: number;
  placed: number;
  medianPrice: number | null;
  medianMileage: number | null;
  states: StateCount[];
  /** Lowercase state code → listing count, for the heatmap. */
  counts: Record<string, number>;
  cities: CityCount[];
  citiesByState: Record<string, CityCount[]>;
};

export function searchListings(query: string): VehicleListing[] {
  const items = getAllVehicles();
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((vehicle) => {
    const title = vehicle.title.toLowerCase();
    const make = vehicle.make.toLowerCase();
    const model = vehicle.model.toLowerCase();
    return (
      title.includes(q) ||
      make.includes(q) ||
      model.includes(q) ||
      `${vehicle.year} ${make} ${model}`.includes(q)
    );
  });
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  return sorted[mid];
}

function topCities(counts: Map<string, CityCount>, limit: number): CityCount[] {
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

export function summarizeMarkets(vehicles: VehicleListing[]): MarketSummary {
  let craigslist = 0;
  let facebook = 0;
  let offerup = 0;
  let placed = 0;
  const stateCounts = new Map<string, number>();
  const cityCounts = new Map<string, CityCount>();
  const cityCountsByState = new Map<string, Map<string, CityCount>>();
  const prices: number[] = [];
  const miles: number[] = [];

  for (const vehicle of vehicles) {
    if (vehicle.marketplace === "Craigslist") craigslist += 1;
    else if (vehicle.marketplace === "Facebook Marketplace") facebook += 1;
    else if (vehicle.marketplace === "OfferUp") offerup += 1;

    if (vehicle.price >= 500 && vehicle.price <= 500_000) prices.push(vehicle.price);
    if (vehicle.mileage > 0 && vehicle.mileage <= 400_000) miles.push(vehicle.mileage);

    const state = resolveState(vehicle.location);
    if (!state) continue;
    placed += 1;
    stateCounts.set(state, (stateCounts.get(state) ?? 0) + 1);

    const city = cityLabel(vehicle.location);
    if (!city) continue;
    const key = `${state}:${city.toLowerCase()}`;
    const existing = cityCounts.get(key);
    if (existing) existing.count += 1;
    else cityCounts.set(key, { name: city, state, count: 1 });

    let bucket = cityCountsByState.get(state);
    if (!bucket) {
      bucket = new Map();
      cityCountsByState.set(state, bucket);
    }
    const inState = bucket.get(key);
    if (inState) inState.count += 1;
    else bucket.set(key, { name: city, state, count: 1 });
  }

  const states = [...stateCounts.entries()]
    .map(([code, count]) => ({
      code,
      name: STATE_NAMES[code] ?? code,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const counts: Record<string, number> = {};
  for (const [code, count] of stateCounts) counts[code.toLowerCase()] = count;

  const citiesByState: Record<string, CityCount[]> = {};
  for (const [code, bucket] of cityCountsByState) {
    citiesByState[code] = topCities(bucket, 8);
  }

  return {
    total: vehicles.length,
    craigslist,
    facebook,
    offerup,
    placed,
    medianPrice: median(prices),
    medianMileage: median(miles),
    states,
    counts,
    cities: topCities(cityCounts, 8),
    citiesByState,
  };
}
