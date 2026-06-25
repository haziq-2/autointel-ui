"use client";

import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { RecommendationBadge } from "@/components/shared/status-badge";
import { getSavedOpportunities } from "@/lib/mock-data/generate-vehicles";
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
  const vehicles = getSavedOpportunities();

  const columns = STAGES.map((stage, colIdx) => ({
    ...stage,
    items: vehicles.filter((_, idx) => idx % STAGES.length === colIdx),
  }));

  return (
    <div>
      <PageHeader
        title="Saved opportunities"
        description="Acquisition pipeline"
      />

      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <div key={col.id} className="w-[240px] shrink-0">
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
                  <div className="relative mb-3 h-20 w-full overflow-hidden rounded border border-border bg-[#fafafa]">
                    <Image src={v.image} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <p className="text-[13px] font-medium leading-snug">{v.title}</p>
                  <p className="mt-1 font-mono text-[13px] tabular-nums">{formatCurrency(v.price)}</p>
                  <p className="mt-1 text-label">
                    +{formatCurrency(v.marginPotential ?? 0)} margin
                  </p>
                  <p className="mt-2 text-label">{v.seller}</p>
                  {v.recommendation && (
                    <div className="mt-2 border-t border-border pt-2">
                      <RecommendationBadge recommendation={v.recommendation} />
                    </div>
                  )}
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
