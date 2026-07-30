import { format, parseISO, subDays } from "date-fns";
import { getAllVehicles } from "./generate-vehicles";

export interface DailyScrapePoint {
  date: string;
  label: string;
  count: number;
}

/** Latest listing date in the catalog (yyyy-MM-dd), falling back to today. */
function getLatestListingDate(): string {
  const vehicles = getAllVehicles();
  let latest = "";
  for (const v of vehicles) {
    if (v.dateFound && v.dateFound > latest) latest = v.dateFound;
  }
  return latest || format(new Date(), "yyyy-MM-dd");
}

/**
 * Daily scrape counts for a rolling window ending on the most recent listing
 * date (not wall-clock today). That keeps the chart aligned with actual
 * scrape timestamps in the catalog instead of a stretch of empty future days.
 */
export function getDailyScrapeCounts(days = 30): DailyScrapePoint[] {
  const endDate = getLatestListingDate();
  const end = parseISO(`${endDate}T12:00:00`);

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(end, i), "yyyy-MM-dd");
    buckets.set(date, 0);
  }

  for (const vehicle of getAllVehicles()) {
    const count = buckets.get(vehicle.dateFound);
    if (count !== undefined) {
      buckets.set(vehicle.dateFound, count + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({
    date,
    label: format(parseISO(`${date}T12:00:00`), "MMM d"),
    count,
  }));
}

export function getTodayScrapeCount(): number {
  // "Today" relative to catalog activity = most recent scrape day
  const latest = getLatestListingDate();
  return getDailyScrapeCounts(1).find((d) => d.date === latest)?.count ?? 0;
}

export function getAverageDailyScrapeCount(days = 30): number {
  const data = getDailyScrapeCounts(days);
  const activeDays = data.filter((d) => d.count > 0);
  if (activeDays.length === 0) return 0;
  // Average over days that actually had scrapes so empty padding days
  // don't drag the number down after the window is re-anchored.
  return Math.round(
    activeDays.reduce((sum, point) => sum + point.count, 0) / activeDays.length
  );
}

export function getAverageDailyScrapeByMarketplace(days = 30): Record<string, number> {
  const endDate = getLatestListingDate();
  const end = parseISO(`${endDate}T12:00:00`);
  const startDate = format(subDays(end, days - 1), "yyyy-MM-dd");

  const totals: Record<string, number> = {};
  for (const vehicle of getAllVehicles()) {
    if (vehicle.dateFound >= startDate && vehicle.dateFound <= endDate) {
      totals[vehicle.marketplace] = (totals[vehicle.marketplace] ?? 0) + 1;
    }
  }

  const averages: Record<string, number> = {};
  for (const [marketplace, total] of Object.entries(totals)) {
    averages[marketplace] = Math.round(total / days);
  }
  return averages;
}
