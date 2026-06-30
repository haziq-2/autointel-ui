"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { AcquisitionRecommendationBadge, ScoreBadge } from "@/components/shared/status-badge";
import { getAcquisitionOpportunities } from "@/lib/mock-data/intelligence";
import { formatCurrency } from "@/lib/format";
import type { OpportunityStage } from "@/lib/types";

const STAGES: { id: OpportunityStage; label: string }[] = [
  { id: "review", label: "Review" },
  { id: "contacted", label: "Contacted" },
  { id: "negotiating", label: "Negotiating" },
  { id: "purchased", label: "Purchased" },
  { id: "rejected", label: "Rejected" },
];

export default function OpportunitiesPage() {
  const opportunities = getAcquisitionOpportunities();

  const columns = STAGES.map((stage, colIdx) => ({
    ...stage,
    items: opportunities.filter((_, idx) => idx % STAGES.length === colIdx),
  }));

  return (
    <div>
      <PageHeader
        title="Acquisition Intelligence"
        description="AI-scored acquisition pipeline"
      />

      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {columns.map((col) => (
            <div key={col.id} className="w-[220px] shrink-0">
              <div className="mb-2 flex items-baseline justify-between border-b border-border pb-1.5">
                <h2 className="text-[13px] font-semibold">{col.label}</h2>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{col.items.length}</span>
              </div>
              <div className="space-y-1.5">
                {col.items.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vehicles/${v.id}`}
                    className="block rounded-lg border border-border p-2 transition-colors hover:bg-[#fafafa]"
                  >
                    <p className="line-clamp-2 text-[12px] font-medium leading-tight">{v.title}</p>
                    <p className="mt-1 font-mono text-[12px] font-semibold tabular-nums">{formatCurrency(v.price)}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Score</span>
                        <ScoreBadge score={v.acquisitionScore} />
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-[#16a34a]">
                        +{formatCurrency(v.expectedProfit)}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <AcquisitionRecommendationBadge recommendation={v.acquisitionRecommendation} />
                    </div>
                    <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-muted-foreground">
                      {v.aiExplanation}
                    </p>
                  </Link>
                ))}
                {col.items.length === 0 && (
                  <p className="py-6 text-center text-[11px] text-muted-foreground">Empty</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
