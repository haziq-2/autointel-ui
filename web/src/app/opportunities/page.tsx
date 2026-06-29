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

      <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          {columns.map((col) => (
            <div key={col.id} className="w-[260px] shrink-0">
              <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
                <h2 className="text-card-title">{col.label}</h2>
                <span className="font-mono text-label tabular-nums">{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vehicles/${v.id}`}
                    className="block rounded-md border border-border p-3 transition-colors hover:bg-[#fafafa]"
                  >
                    <p className="text-[13px] font-medium leading-snug">{v.title}</p>
                    <p className="mt-1 font-mono text-[13px] tabular-nums">{formatCurrency(v.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-label">Score</span>
                      <ScoreBadge score={v.acquisitionScore} />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-label">
                      <span>Margin</span>
                      <span className="font-mono tabular-nums text-[#16a34a]">+{formatCurrency(v.expectedProfit)}</span>
                    </div>
                    <div className="mt-2 border-t border-border pt-2">
                      <AcquisitionRecommendationBadge recommendation={v.acquisitionRecommendation} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                      {v.aiExplanation}
                    </p>
                  </Link>
                ))}
                {col.items.length === 0 && (
                  <p className="py-8 text-center text-label">Empty</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
