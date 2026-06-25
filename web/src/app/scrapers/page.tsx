"use client";

import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { StatusBadge, JobStatusBadge } from "@/components/shared/status-badge";
import { MarketplaceMark } from "@/components/shared/marketplace-mark";
import { ACTIVE_SCRAPERS, SCRAPING_JOBS } from "@/lib/mock-data/scrapers";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  DataTableCell,
} from "@/components/shared/data-table";
import { Plus, Pencil, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrapersPage() {
  return (
    <div>
      <PageHeader title="Scrapers" description="Configure and run marketplace scraping jobs">
        <Link href="/scrapers/new" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
          <Plus className="h-3.5 w-3.5" />
          New scraper
        </Link>
      </PageHeader>

      <section className="mb-12">
        <SectionTitle>Sources</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVE_SCRAPERS.map((scraper) => (
            <div key={scraper.id} className="rounded-md border border-border p-4">
              <div className="flex items-start gap-3">
                <MarketplaceMark id={scraper.id} name={scraper.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-card-title truncate">{scraper.name}</p>
                  <div className="mt-1"><StatusBadge status={scraper.status} /></div>
                </div>
              </div>
              <dl className="mt-4 space-y-2 border-t border-border pt-4">
                <Row label="Last run" value={scraper.lastRun} />
                <Row label="Vehicles found" value={scraper.vehiclesFound.toLocaleString()} mono />
                <Row label="Success rate" value={`${scraper.successRate}%`} mono />
              </dl>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href="/scrapers/job-1/live"
                  className={cn(buttonVariants({ size: "sm" }), "flex-1")}
                >
                  Start scraping
                </Link>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Pause className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Jobs</SectionTitle>
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Name</DataTableHeaderCell>
              <DataTableHeaderCell>Marketplace</DataTableHeaderCell>
              <DataTableHeaderCell>Criteria</DataTableHeaderCell>
              <DataTableHeaderCell>Location</DataTableHeaderCell>
              <DataTableHeaderCell>Frequency</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Found</DataTableHeaderCell>
              <DataTableHeaderCell>Last run</DataTableHeaderCell>
              <DataTableHeaderCell>Actions</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {SCRAPING_JOBS.map((job) => (
              <DataTableRow key={job.id}>
                <DataTableCell className="font-medium">{job.name}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{job.marketplace}</DataTableCell>
                <DataTableCell className="max-w-[160px] truncate text-muted-foreground">{job.searchCriteria}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{job.location}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{job.frequency}</DataTableCell>
                <DataTableCell><JobStatusBadge status={job.status} /></DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{job.vehiclesFound}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{job.lastRun}</DataTableCell>
                <DataTableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/scrapers/${job.id}/live`} className="text-[13px] font-medium hover:underline">
                      Run
                    </Link>
                    <span className="text-border">·</span>
                    <button type="button" className="text-[13px] text-muted-foreground hover:text-foreground">Pause</button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-[13px]">
      <dt className="text-label">{label}</dt>
      <dd className={cn("text-foreground", mono && "font-mono tabular-nums")}>{value}</dd>
    </div>
  );
}
