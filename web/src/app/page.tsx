import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { Card } from "@/components/shared/card";
import { ScoreBadge, StatusBadge } from "@/components/shared/status-badge";
import { MarketplaceMark } from "@/components/shared/marketplace-mark";
import { ACTIVE_SCRAPERS } from "@/lib/mock-data/scrapers";
import {
  getAllVehicles,
  getRecentVehicles,
  TOTAL_VEHICLES,
} from "@/lib/mock-data/generate-vehicles";
import {
  getAverageDailyScrapeCount,
  getDailyScrapeCounts,
  getTodayScrapeCount,
} from "@/lib/mock-data/scrape-activity";
import { DailyScrapeChart } from "@/components/dashboard/daily-scrape-chart";
import { TopMakesChart } from "@/components/dashboard/top-makes-chart";
import { BodyStyleChart } from "@/components/dashboard/body-style-chart";
import { PriceHistogramChart } from "@/components/dashboard/price-histogram-chart";
import { formatCurrency, formatMileage } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRICE_BUCKETS = [
  { label: "<$10k", min: 0, max: 10_000 },
  { label: "$10–20k", min: 10_000, max: 20_000 },
  { label: "$20–30k", min: 20_000, max: 30_000 },
  { label: "$30–40k", min: 30_000, max: 40_000 },
  { label: "$40–50k", min: 40_000, max: 50_000 },
  { label: "$50k+", min: 50_000, max: Infinity },
] as const;

function getInventoryCharts() {
  const vehicles = getAllVehicles();
  const total = vehicles.length || 1;

  const makeCounts = new Map<string, number>();
  const bodyCounts = new Map<string, number>();
  const priceCounts = PRICE_BUCKETS.map(() => 0);

  for (const v of vehicles) {
    if (v.make && v.make !== "Other") {
      makeCounts.set(v.make, (makeCounts.get(v.make) ?? 0) + 1);
    }
    bodyCounts.set(v.bodyStyle, (bodyCounts.get(v.bodyStyle) ?? 0) + 1);

    if (v.price > 0) {
      const idx = PRICE_BUCKETS.findIndex((b) => v.price >= b.min && v.price < b.max);
      if (idx >= 0) priceCounts[idx] += 1;
    }
  }

  const topMakes = [...makeCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const bodyStyles = [...bodyCounts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const priceBuckets = PRICE_BUCKETS.map((b, i) => ({
    label: b.label,
    count: priceCounts[i],
  }));

  return { topMakes, bodyStyles, priceBuckets };
}

function DashboardSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex min-h-0 min-w-0 flex-col", className)}>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const recentVehicles = getRecentVehicles(6);
  const dailyScrapeData = getDailyScrapeCounts(30);
  const sparkData = dailyScrapeData.slice(-7).map((d) => d.count);
  const todayCount = getTodayScrapeCount();
  const avgDaily = getAverageDailyScrapeCount(30);
  const yesterdayCount = dailyScrapeData.at(-2)?.count ?? 0;
  const todayChange =
    yesterdayCount > 0 ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100) : 0;
  const activeCount = ACTIVE_SCRAPERS.filter(
    (s) => s.status === "running" || s.status === "healthy"
  ).length;
  const { topMakes, bodyStyles, priceBuckets } = getInventoryCharts();

  return (
    <div className="animate-fade-in flex flex-col gap-4 md:gap-6">
      <PageHeader
        className="mb-0"
        title="Dashboard"
        description="Scraping activity, source health, and the latest vehicle discoveries"
      >
        <Link href="/scrapers" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Data collection
        </Link>
        <Link href="/vehicles" className={cn(buttonVariants({ size: "sm" }))}>
          Browse vehicles
        </Link>
      </PageHeader>

      {/* KPI row — equal-width / equal-height cards */}
      <KpiGrid>
        <KpiCard
          label="Vehicles tracked"
          value={TOTAL_VEHICLES.toLocaleString()}
          change={8.2}
          changeLabel="this week"
          sparkline={sparkData}
        />
        <KpiCard
          label="Scraped today"
          value={todayCount}
          change={todayChange}
          changeLabel="vs yesterday"
        />
        <KpiCard
          label="Daily average"
          value={avgDaily}
          subtitle="last 30 days"
          sparkline={sparkData}
        />
        <KpiCard
          label="Active scrapers"
          value={`${activeCount}/${ACTIVE_SCRAPERS.length}`}
          subtitle="sources online"
        />
      </KpiGrid>

      {/* Primary charts — 8 / 4 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        <DashboardSection className="lg:col-span-8 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Vehicles indexed over the last 30 days of scrape activity"
          >
            Daily scraped vehicles
          </SectionTitle>
          <Card padding className="flex h-full min-h-0 flex-col">
            <DailyScrapeChart data={dailyScrapeData} />
          </Card>
        </DashboardSection>

        <DashboardSection className="lg:col-span-4 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Marketplace connectors"
            action={
              <Link
                href="/scrapers"
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Manage →
              </Link>
            }
          >
            Sources
          </SectionTitle>
          <Card padding={false} className="flex h-full min-h-0 flex-col overflow-hidden">
            <ul className="flex h-full flex-col divide-y divide-border">
              {ACTIVE_SCRAPERS.map((scraper) => (
                <li key={scraper.id} className="flex min-h-0 flex-1">
                  <Link
                    href={`/scrapers/${scraper.id}/live`}
                    className="flex w-full items-center gap-3 px-5 py-4 transition-colors hover:bg-primary-soft/50"
                  >
                    <MarketplaceMark id={scraper.id} name={scraper.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {scraper.name}
                      </p>
                      <p className="text-helper">Last run {scraper.lastRun}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <StatusBadge status={scraper.status} />
                      <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
                        {scraper.vehiclesFound.toLocaleString()} found
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </DashboardSection>
      </div>

      {/* Inventory charts — 6 / 6 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Most common brands in your catalog"
          >
            Top makes
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <TopMakesChart data={topMakes} />
          </Card>
        </DashboardSection>
        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Inventory mix by vehicle type"
          >
            Body styles
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <BodyStyleChart data={bodyStyles} />
          </Card>
        </DashboardSection>
      </div>

      {/* Price distribution + Recent discoveries — 6 / 6 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="How listings are distributed across asking-price ranges"
          >
            Price distribution
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <PriceHistogramChart data={priceBuckets} />
          </Card>
        </DashboardSection>

        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Newest listings with AI scores"
            action={
              <Link
                href="/vehicles"
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            Recent discoveries
          </SectionTitle>
          <Card padding={false} className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex h-full flex-col divide-y divide-border">
              {recentVehicles.map((v) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${v.id}`}
                  className="flex flex-1 items-center gap-3 px-5 py-3.5 transition-colors hover:bg-primary-soft/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">{v.title}</p>
                    <p className="text-helper">
                      {v.marketplace} · {v.location}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[13px] font-medium tabular-nums">
                      {formatCurrency(v.price)}
                    </p>
                    <div className="mt-0.5 flex items-center justify-end gap-2">
                      <span className="text-helper">{formatMileage(v.mileage)}</span>
                      <ScoreBadge score={v.aiScore} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </DashboardSection>
      </div>
    </div>
  );
}
