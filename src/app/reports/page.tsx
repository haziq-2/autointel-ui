import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REPORTS = [
  { name: "Daily Market Report", description: "Market trends, price changes, and regional activity", lastRun: "Jun 24, 2026" },
  { name: "Weekly Acquisition Report", description: "Scored opportunities, margins, and pipeline status", lastRun: "Jun 23, 2026" },
  { name: "Pricing Intelligence Report", description: "Valuations, comparables, and pricing recommendations", lastRun: "Jun 23, 2026" },
  { name: "Inventory Performance Report", description: "Days in stock, turnover, aging, and mix analysis", lastRun: "Jun 22, 2026" },
  { name: "Competitive Intelligence Report", description: "Competitor inventory, pricing, and market share", lastRun: "Jun 22, 2026" },
  { name: "Fleet Performance Report", description: "Utilization, maintenance, and replacement forecast", lastRun: "Jun 21, 2026" },
  { name: "Executive Summary", description: "Leadership briefing with key metrics and AI highlights", lastRun: "Jun 24, 2026" },
];

export default function ReportsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Reports" description="Executive reporting center" />

      <div className="surface-card divide-y divide-border overflow-hidden">
          {REPORTS.map((report) => (
            <div
              key={report.name}
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-card-title">{report.name}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{report.description}</p>
                <p className="mt-2 text-label">Last generated {report.lastRun}</p>
              </div>
              <div className="flex gap-2">
                {["PDF", "Excel", "CSV"].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "min-w-[58px]")}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
