import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { Card } from "@/components/shared/card";
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
import { DailyScrapeChart } from "@/components/dashboard/daily-scrape-chart";
import { formatCurrency, formatMileage } from "@/lib/format";

export default function DashboardPage() {
  const recentVehicles = getRecentVehicles(6);
  const dailyScrapeData = getDailyScrapeCounts(30);
  const sparkData = dailyScrapeData.slice(-7).map((d) => d.count);
  const todayCount = getTodayScrapeCount();
  const yesterdayCount = dailyScrapeData.at(-2)?.count ?? 0;
  const todayChange =
    yesterdayCount > 0 ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Executive overview — market intelligence and acquisition signals"
      />

      <KpiGrid className="mb-12 lg:grid-cols-3">
        <KpiCard label="Vehicles tracked" value={TOTAL_VEHICLES.toLocaleString()} change={8.2} changeLabel="this week" sparkline={sparkData} />
        <KpiCard label="Scraped today" value={todayCount} change={todayChange} changeLabel="vs yesterday" />
        <KpiCard label="Active scrapers" value={4} />
      </KpiGrid>

      <section className="mb-12">
        <SectionTitle>Daily scraped vehicles</SectionTitle>
        <Card padding>
          <DailyScrapeChart data={dailyScrapeData} />
        </Card>
      </section>

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

      <section>
        <SectionTitle
          action={
            <Link href="/vehicles" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
              View all →
            </Link>
          }
        >
          Recent discoveries
        </SectionTitle>
        <Card padding={false}>
          <div className="divide-y divide-border">
            {recentVehicles.map((v) => (
              <Link
                key={v.id}
                href={`/vehicles/${v.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary-soft/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{v.title}</p>
                  <p className="text-helper">{v.marketplace} · {v.location}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="font-mono text-[13px] font-medium tabular-nums">{formatCurrency(v.price)}</p>
                  <p className="text-helper">{formatMileage(v.mileage)}</p>
                </div>
                <div className="text-right">
                  <p className="text-helper">AI score</p>
                  <ScoreBadge score={v.aiScore} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
