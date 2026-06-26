import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { JobStatusBadge, ScoreBadge } from "@/components/shared/status-badge";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  DataTableCell,
} from "@/components/shared/data-table";
import { RECENT_JOBS } from "@/lib/mock-data/scrapers";
import { getRecentVehicles, TOTAL_VEHICLES } from "@/lib/mock-data/generate-vehicles";
import { getDailyScrapeCounts, getTodayScrapeCount } from "@/lib/mock-data/scrape-activity";
import { getExecutiveSummary, getPageInsights } from "@/lib/mock-data/intelligence";
import { DailyScrapeChart } from "@/components/dashboard/daily-scrape-chart";
import { formatCurrency, formatMileage } from "@/lib/format";

export default function DashboardPage() {
  const recentVehicles = getRecentVehicles(6);
  const dailyScrapeData = getDailyScrapeCounts(30);
  const todayCount = getTodayScrapeCount();
  const yesterdayCount = dailyScrapeData.at(-2)?.count ?? 0;
  const todayChange =
    yesterdayCount > 0 ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100) : 0;
  const exec = getExecutiveSummary();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Executive overview — market intelligence and acquisition signals"
      />

      <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-0 border-b border-border lg:grid-cols-4">
        <KpiCard label="Vehicles tracked" value={TOTAL_VEHICLES.toLocaleString()} change={8.2} changeLabel="this week" />
        <KpiCard label="Scraped today" value={todayCount} change={todayChange} changeLabel="vs yesterday" />
        <KpiCard label="High-opportunity" value={exec.highOpportunityCount} change={12} changeLabel="this week" />
        <KpiCard label="Inventory health" value={`${exec.inventoryHealth}/100`} />
      </div>

      <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-0 border-b border-border lg:grid-cols-4">
        <KpiCard label="Active scrapers" value={2} />
        <KpiCard label="Est. acquisition value" value={formatCurrency(exec.estimatedAcquisitionValue)} />
        <KpiCard label="Potential gross profit" value={formatCurrency(exec.potentialGrossProfit)} />
        <KpiCard label="Market coverage" value={`${exec.marketCoverage} regions`} />
      </div>

      <section className="mb-10">
        <SectionTitle>Today&apos;s highlights</SectionTitle>
        <div className="rounded-md border border-border bg-[#fafafa] p-4">
          <ul className="space-y-2">
            {exec.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-[13px] text-foreground">
                <span className="text-muted-foreground">·</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <section>
          <SectionTitle>Daily scraped vehicles</SectionTitle>
          <div className="rounded-md border border-border p-4 sm:p-6">
            <DailyScrapeChart data={dailyScrapeData} />
          </div>
        </section>
        <AiInsightsPanel insights={getPageInsights("dashboard")} title="AI summary" />
      </div>

      <section className="mb-12">
        <SectionTitle>Recent scraping jobs</SectionTitle>
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Job</DataTableHeaderCell>
              <DataTableHeaderCell>Source</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Found</DataTableHeaderCell>
              <DataTableHeaderCell>Started</DataTableHeaderCell>
              <DataTableHeaderCell>Duration</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {RECENT_JOBS.map((job) => (
              <DataTableRow key={job.id}>
                <DataTableCell className="font-medium text-foreground">{job.name}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{job.marketplace}</DataTableCell>
                <DataTableCell><JobStatusBadge status={job.status} /></DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{job.vehiclesFound}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{job.startedAt}</DataTableCell>
                <DataTableCell className="font-mono text-muted-foreground tabular-nums">{job.duration}</DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section className="mb-12">
        <SectionTitle
          action={
            <Link href="/vehicles" className="text-label text-muted-foreground hover:text-foreground">
              View all
            </Link>
          }
        >
          Recent discoveries
        </SectionTitle>
        <div className="divide-y divide-border border-y border-border">
          {recentVehicles.map((v) => (
            <Link
              key={v.id}
              href={`/vehicles/${v.id}`}
              className="flex items-center gap-4 py-4 transition-colors hover:bg-[#fafafa]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{v.title}</p>
                <p className="text-label">{v.marketplace} · {v.location}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-mono text-[13px] font-medium tabular-nums">{formatCurrency(v.price)}</p>
                <p className="text-label">{formatMileage(v.mileage)}</p>
              </div>
              <div className="text-right">
                <p className="text-label">AI score</p>
                <ScoreBadge score={v.aiScore} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
