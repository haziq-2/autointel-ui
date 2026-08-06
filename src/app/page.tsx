import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { Card } from "@/components/shared/card";
import { MarketplaceMark } from "@/components/shared/marketplace-mark";
import { ACTIVE_SCRAPERS } from "@/lib/mock-data/scrapers";
import {
  getAllVehicles,
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
import { MarketplaceChart } from "@/components/dashboard/marketplace-chart";
import { YearHistogramChart } from "@/components/dashboard/year-histogram-chart";
import { ShareDonutChart } from "@/components/dashboard/share-donut-chart";
import { ListingAgeChart } from "@/components/dashboard/listing-age-chart";
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

const YEAR_BUCKETS = [
  { label: "<2000", min: 0, max: 2000 },
  { label: "2000–04", min: 2000, max: 2005 },
  { label: "2005–09", min: 2005, max: 2010 },
  { label: "2010–14", min: 2010, max: 2015 },
  { label: "2015–19", min: 2015, max: 2020 },
  { label: "2020–22", min: 2020, max: 2023 },
  { label: "2023+", min: 2023, max: Infinity },
] as const;

const AGE_BUCKETS = [
  { label: "0–3d", min: 0, max: 4 },
  { label: "4–7d", min: 4, max: 8 },
  { label: "8–14d", min: 8, max: 15 },
  { label: "15–30d", min: 15, max: 31 },
  { label: "30d+", min: 31, max: Infinity },
] as const;

const SELLER_LABELS: Record<string, string> = {
  private: "Private",
  dealer: "Dealer",
  auction: "Auction",
};

const FUEL_COLORS = [
  "var(--primary)",
  "#0ea5e9",
  "#14b8a6",
  "#8b5cf6",
  "#f59e0b",
  "#64748b",
];

const SELLER_COLORS = ["#2563eb", "#0ea5e9", "#f59e0b"];

function toShareSlices(
  counts: Map<string, number>,
  total: number,
  limit?: number
) {
  const slices = [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
  return limit ? slices.slice(0, limit) : slices;
}

function getInventoryCharts() {
  const vehicles = getAllVehicles();
  const total = vehicles.length || 1;

  const makeCounts = new Map<string, number>();
  const bodyCounts = new Map<string, number>();
  const marketplaceCounts = new Map<string, number>();
  const fuelCounts = new Map<string, number>();
  const sellerCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();
  const priceCounts = PRICE_BUCKETS.map(() => 0);
  const yearCounts = YEAR_BUCKETS.map(() => 0);
  const ageCounts = AGE_BUCKETS.map(() => 0);

  for (const v of vehicles) {
    if (v.make && v.make !== "Other") {
      makeCounts.set(v.make, (makeCounts.get(v.make) ?? 0) + 1);
    }
    bodyCounts.set(v.bodyStyle, (bodyCounts.get(v.bodyStyle) ?? 0) + 1);

    if (v.marketplace) {
      marketplaceCounts.set(
        v.marketplace,
        (marketplaceCounts.get(v.marketplace) ?? 0) + 1
      );
    }

    if (v.fuelType && v.fuelType !== "—") {
      fuelCounts.set(v.fuelType, (fuelCounts.get(v.fuelType) ?? 0) + 1);
    }

    const sellerLabel = SELLER_LABELS[v.sellerType] ?? "Private";
    sellerCounts.set(sellerLabel, (sellerCounts.get(sellerLabel) ?? 0) + 1);

    const city = v.location.split(",")[0]?.trim();
    if (city && city !== "—") {
      locationCounts.set(city, (locationCounts.get(city) ?? 0) + 1);
    }

    if (v.price > 0) {
      const idx = PRICE_BUCKETS.findIndex((b) => v.price >= b.min && v.price < b.max);
      if (idx >= 0) priceCounts[idx] += 1;
    }

    if (v.year > 1900) {
      const idx = YEAR_BUCKETS.findIndex((b) => v.year >= b.min && v.year < b.max);
      if (idx >= 0) yearCounts[idx] += 1;
    }

    const ageIdx = AGE_BUCKETS.findIndex(
      (b) => v.daysListed >= b.min && v.daysListed < b.max
    );
    if (ageIdx >= 0) ageCounts[ageIdx] += 1;
  }

  const fuelTotal = [...fuelCounts.values()].reduce((s, n) => s + n, 0) || 1;
  const sellerTotal = [...sellerCounts.values()].reduce((s, n) => s + n, 0) || 1;

  const topMakes = [...makeCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topMarkets = [...locationCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const bodyStyles = toShareSlices(bodyCounts, total, 7);
  const marketplaces = toShareSlices(marketplaceCounts, total);
  const fuelTypes = toShareSlices(fuelCounts, fuelTotal);
  const sellerTypes = toShareSlices(sellerCounts, sellerTotal);

  const priceBuckets = PRICE_BUCKETS.map((b, i) => ({
    label: b.label,
    count: priceCounts[i],
  }));

  const yearBuckets = YEAR_BUCKETS.map((b, i) => ({
    label: b.label,
    count: yearCounts[i],
  }));

  const ageBuckets = AGE_BUCKETS.map((b, i) => ({
    label: b.label,
    count: ageCounts[i],
  }));

  return {
    topMakes,
    topMarkets,
    bodyStyles,
    marketplaces,
    fuelTypes,
    sellerTypes,
    priceBuckets,
    yearBuckets,
    ageBuckets,
  };
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
  const dailyScrapeData = getDailyScrapeCounts(30);
  const sparkData = dailyScrapeData.slice(-7).map((d) => d.count);
  const todayCount = getTodayScrapeCount();
  const avgDaily = getAverageDailyScrapeCount(7);
  const yesterdayCount = dailyScrapeData.at(-2)?.count ?? 0;
  const todayChange =
    yesterdayCount > 0 ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100) : 0;
  const activeCount = ACTIVE_SCRAPERS.filter(
    (s) => s.status === "running" || s.status === "healthy"
  ).length;
  const {
    topMakes,
    topMarkets,
    bodyStyles,
    marketplaces,
    fuelTypes,
    sellerTypes,
    priceBuckets,
    yearBuckets,
    ageBuckets,
  } = getInventoryCharts();

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
          subtitle="past week"
          sparkline={sparkData}
        />
        <KpiCard
          label="Active sources"
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
            <DailyScrapeChart data={dailyScrapeData} totalOverride={TOTAL_VEHICLES} />
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
                      <p className="font-mono text-[13px] font-medium tabular-nums text-foreground">
                        {scraper.vehiclesFound.toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">found</p>
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

      {/* Marketplace + year mix — 6 / 6 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Where listings are coming from"
          >
            Marketplace split
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <MarketplaceChart data={marketplaces} />
          </Card>
        </DashboardSection>
        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Age mix of inventory by model year"
          >
            Model year
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <YearHistogramChart data={yearBuckets} />
          </Card>
        </DashboardSection>
      </div>

      {/* Top markets + seller + fuel — 4 / 4 / 4 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        <DashboardSection className="lg:col-span-4 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Cities with the most scraped inventory"
          >
            Top markets
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <TopMakesChart data={topMarkets} yAxisWidth={96} />
          </Card>
        </DashboardSection>
        <DashboardSection className="lg:col-span-4 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Private vs dealer vs auction supply"
          >
            Seller type
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <ShareDonutChart data={sellerTypes} colors={SELLER_COLORS} emptyLabel="No seller data" />
          </Card>
        </DashboardSection>
        <DashboardSection className="lg:col-span-4 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="Powertrain mix across indexed listings"
          >
            Fuel type
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <ShareDonutChart data={fuelTypes} colors={FUEL_COLORS} emptyLabel="No fuel data" />
          </Card>
        </DashboardSection>
      </div>

      {/* Listing age + price distribution — 6 / 6 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        <DashboardSection className="lg:col-span-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0">
          <SectionTitle
            className="lg:mb-0 lg:pb-4"
            description="How long listings have been on the market"
          >
            Listing age
          </SectionTitle>
          <Card padding className="h-full min-h-0">
            <ListingAgeChart data={ageBuckets} />
          </Card>
        </DashboardSection>
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
      </div>
    </div>
  );
}
