import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { getPageInsights } from "@/lib/mock-data/intelligence";

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
    <div>
      <PageHeader title="Reports" description="Executive reporting center" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="divide-y divide-border border-y border-border">
          {REPORTS.map((report) => (
            <div
              key={report.name}
              className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
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
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 min-w-[56px]")}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AiInsightsPanel insights={getPageInsights("reports")} />
      </div>
    </div>
  );
}
