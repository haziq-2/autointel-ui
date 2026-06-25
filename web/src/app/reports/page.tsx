import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REPORTS = [
  { name: "Scraping activity", description: "Job runs, success rates, vehicles by source", lastRun: "Jun 24, 2026" },
  { name: "Vehicle discovery", description: "Vehicles found in date range with filters", lastRun: "Jun 23, 2026" },
  { name: "Acquisition opportunities", description: "Saved and high-scoring vehicles with margins", lastRun: "Jun 22, 2026" },
  { name: "Marketplace performance", description: "Source comparison and coverage metrics", lastRun: "Jun 21, 2026" },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Export operational data" />

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
              {["CSV", "Excel", "PDF"].map((fmt) => (
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
    </div>
  );
}
