"use client";

import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { JobStatusBadge } from "@/components/shared/status-badge";
import { MarketplaceMark } from "@/components/shared/marketplace-mark";
import { Card } from "@/components/shared/card";
import { ContinuousScrapePanel } from "@/components/scraping/continuous-scrape-panel";
import { ACTIVE_SCRAPERS, SCRAPING_JOBS } from "@/lib/mock-data/scrapers";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  DataTableCell,
} from "@/components/shared/data-table";
import { Pencil, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrapersPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Data Collection" description="Configure and run marketplace scraping jobs">
        <Link href="/scrapers/run-all" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Run all (~6 min)
        </Link>
      </PageHeader>

      <section className="mb-12">
        <SectionTitle description="Poll every source automatically on a fixed interval">Automation</SectionTitle>
        <ContinuousScrapePanel />
      </section>

      <section className="mb-12">
        <SectionTitle description="Active marketplace connectors">Sources</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVE_SCRAPERS.map((scraper) => (
            <Card key={scraper.id} className="card-interactive flex flex-col">
              <div className="flex items-start gap-3">
                <MarketplaceMark id={scraper.id} name={scraper.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-card-title truncate">{scraper.name}</p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <Row label="Last run" value={scraper.lastRun} />
                <Row label="Today" value={Math.round(scraper.vehiclesFound * 0.08).toLocaleString()} mono />
                <Row label="Total found" value={scraper.vehiclesFound.toLocaleString()} mono />
                <Row label="Success" value={`${scraper.successRate}%`} mono />
              </dl>
              <div className="mt-5 flex items-center gap-2">
                <Link
                  href={`/scrapers/${scraper.id}/live`}
                  className={cn(buttonVariants({ size: "sm" }), "flex-1")}
                >
                  Collect Data
                </Link>
                <Button variant="outline" size="sm" className="size-8 p-0" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="size-8 p-0" title="Pause">
                  <Pause className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle description="Scheduled and on-demand jobs">Jobs</SectionTitle>
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Name</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden md:table-cell">Marketplace</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden xl:table-cell">Criteria</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden lg:table-cell">Location</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden xl:table-cell">Frequency</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell align="right" className="hidden sm:table-cell">Found</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden lg:table-cell">Last run</DataTableHeaderCell>
              <DataTableHeaderCell className="w-24">Actions</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {SCRAPING_JOBS.map((job) => (
              <DataTableRow key={job.id}>
                <DataTableCell className="truncate font-medium">{job.name}</DataTableCell>
                <DataTableCell className="hidden truncate text-muted-foreground md:table-cell">{job.marketplace}</DataTableCell>
                <DataTableCell className="hidden truncate text-muted-foreground xl:table-cell">{job.searchCriteria}</DataTableCell>
                <DataTableCell className="hidden truncate text-muted-foreground lg:table-cell">{job.location}</DataTableCell>
                <DataTableCell className="hidden text-muted-foreground xl:table-cell">{job.frequency}</DataTableCell>
                <DataTableCell><JobStatusBadge status={job.status} /></DataTableCell>
                <DataTableCell align="right" className="text-metric hidden text-[13px] sm:table-cell">{job.vehiclesFound}</DataTableCell>
                <DataTableCell className="hidden text-muted-foreground lg:table-cell">{job.lastRun}</DataTableCell>
                <DataTableCell className="overflow-visible">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/scrapers/${job.id}/live`} className="text-[13px] font-medium text-primary hover:underline">
                      Run
                    </Link>
                    <button type="button" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">Pause</button>
                    <button type="button" className="p-1 text-muted-foreground transition-colors hover:text-foreground">
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
    <div>
      <dt className="text-helper">{label}</dt>
      <dd className={cn("mt-0.5 text-[13px] text-foreground", mono && "font-mono tabular-nums")}>{value}</dd>
    </div>
  );
}
