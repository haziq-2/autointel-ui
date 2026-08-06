/** Build /vehicles URLs from chart selections for click-to-filter. */

export type VehiclesFilterParams = {
  make?: string;
  marketplace?: string;
  bodyStyle?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  search?: string;
  status?: string;
  sortBy?: string;
};

export function vehiclesHref(params: VehiclesFilterParams): string {
  const sp = new URLSearchParams();
  if (params.make && params.make !== "all") sp.set("make", params.make);
  if (params.marketplace && params.marketplace !== "all") {
    sp.set("marketplace", params.marketplace);
  }
  if (params.bodyStyle && params.bodyStyle !== "all") {
    sp.set("bodyStyle", params.bodyStyle);
  }
  if (params.minPrice != null && params.minPrice > 0) {
    sp.set("minPrice", String(params.minPrice));
  }
  if (params.maxPrice != null && Number.isFinite(params.maxPrice)) {
    sp.set("maxPrice", String(params.maxPrice));
  }
  if (params.minYear != null && params.minYear > 0) {
    sp.set("minYear", String(params.minYear));
  }
  if (params.maxYear != null && Number.isFinite(params.maxYear)) {
    sp.set("maxYear", String(params.maxYear));
  }
  if (params.search) sp.set("search", params.search);
  if (params.status && params.status !== "all") sp.set("status", params.status);
  if (params.sortBy) sp.set("sortBy", params.sortBy);

  const qs = sp.toString();
  return qs ? `/vehicles?${qs}` : "/vehicles";
}

/** Price bucket definitions shared by dashboard + click filters */
export const PRICE_BUCKETS = [
  { label: "<$10k", min: 0, max: 10_000 },
  { label: "$10–20k", min: 10_000, max: 20_000 },
  { label: "$20–30k", min: 20_000, max: 30_000 },
  { label: "$30–40k", min: 30_000, max: 40_000 },
  { label: "$40–50k", min: 40_000, max: 50_000 },
  { label: "$50k+", min: 50_000, max: Infinity },
] as const;

export const YEAR_BUCKETS = [
  { label: "<2000", min: 0, max: 2000 },
  { label: "2000–04", min: 2000, max: 2005 },
  { label: "2005–09", min: 2005, max: 2010 },
  { label: "2010–14", min: 2010, max: 2015 },
  { label: "2015–19", min: 2015, max: 2020 },
  { label: "2020–22", min: 2020, max: 2023 },
  { label: "2023+", min: 2023, max: Infinity },
] as const;
