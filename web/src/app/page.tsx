import Link from "next/link";
import Image from "next/image";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
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
import { formatCurrency, formatMileage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function DashboardPage() {
  const recentVehicles = getRecentVehicles(6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Scraping activity and recent discoveries"
      />

      <div className="mb-12 grid grid-cols-2 gap-x-8 gap-y-0 border-b border-border lg:grid-cols-4">
        <KpiCard label="Total vehicles scraped" value={TOTAL_VEHICLES.toLocaleString()} change={8.2} changeLabel="this week" />
        <KpiCard label="Active scrapers" value={2} />
        <KpiCard label="New today" value={142} change={12} changeLabel="vs yesterday" />
        <KpiCard label="Saved opportunities" value={24} change={4} changeLabel="this week" />
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
              <div className="relative h-11 w-[3.75rem] shrink-0 overflow-hidden rounded border border-border bg-[#fafafa]">
                <Image src={v.image} alt="" fill className="object-cover" unoptimized />
              </div>
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

      <section>
        <SectionTitle>Quick actions</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Link href="/scrapers/new" className={cn(buttonVariants({ size: "sm" }))}>
            New scraper
          </Link>
          <Link href="/scrapers/job-1/live" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Start all scrapers
          </Link>
          <Link href="/vehicles" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            View vehicles
          </Link>
          <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Export data
          </button>
        </div>
      </section>
    </div>
  );
}
