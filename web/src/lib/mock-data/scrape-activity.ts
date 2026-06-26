import { format, subDays } from "date-fns";
import { getAllVehicles } from "./generate-vehicles";

export interface DailyScrapePoint {
  date: string;
  label: string;
  count: number;
}

export function getDailyScrapeCounts(days = 30): DailyScrapePoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
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
    label: format(new Date(`${date}T12:00:00`), "MMM d"),
    count,
  }));
}

export function getTodayScrapeCount(): number {
  const today = format(new Date(), "yyyy-MM-dd");
  return getDailyScrapeCounts(1).find((d) => d.date === today)?.count ?? 0;
}
